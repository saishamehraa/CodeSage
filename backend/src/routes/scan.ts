// backend/src/routes/scan.ts
import express from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { processZipBuffer, processGitRepo } from '../services/ingestion';
import { runAutonomousScan } from '../workers/scanEngine';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Keep ZIP in memory

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

router.post('/start-scan', upload.single('file'), async (req, res) => {
  try {
    const { repoUrl, uploadMethod } = req.body;
    
    let files: { name: string; content: string }[] = [];
    let projectName = 'Local Upload';
    let repositoryRef = 'local_upload.zip';

    // 1. Ingest the Codebase based on the upload method
    if (uploadMethod === 'upload' && req.file) {
      files = await processZipBuffer(req.file.buffer);
      projectName = req.file.originalname;
    } else if ((uploadMethod === 'github' || uploadMethod === 'url') && repoUrl) {
      files = await processGitRepo(repoUrl);
      projectName = repoUrl.split('/').pop()?.replace('.git', '') || 'Git Repo';
      repositoryRef = repoUrl;
    } else {
      return res.status(400).json({ error: 'Invalid upload parameters' });
    }

    if (files.length === 0) {
      return res.status(400).json({ error: 'No valid files found to scan.' });
    }

    // 2. Create the initial "pending" project record in Supabase
    const { data: project, error } = await supabase
      .from('projects')
      .insert([{
        name: projectName,
        repository: repositoryRef,
        status: 'warn', // Default to warning until proven safe
        files_scanned: files.length
      }])
      .select()
      .single();

    if (error) throw error;

    // 3. Fire-and-forget the background worker
    // Notice there is no "await" here. This allows the HTTP request to finish.
    runAutonomousScan(project.id, files).catch(err => {
      console.error(`Fatal error in background scan for project ${project.id}:`, err);
    });

    // 4. Immediately return the project ID to the frontend
    res.status(200).json({ 
      success: true, 
      projectId: project.id,
      filesDiscovered: files.length 
    });

  } catch (error) {
    console.error("Scan initiation failed:", error);
    res.status(500).json({ error: 'Failed to initiate scan' });
  }
});

export default router;
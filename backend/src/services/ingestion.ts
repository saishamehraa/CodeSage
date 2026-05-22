// backend/src/services/ingestion.ts
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';
import simpleGit from 'simple-git';

// Files and directories to ignore to save AI tokens and processing time
const IGNORE_PATTERNS = [
  'node_modules', '.git', 'dist', 'build', '.next',
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.mp4', '.pdf',
  '.DS_Store'
];

function shouldIgnore(filePath: string): boolean {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

// 1. Handle ZIP Uploads (In-Memory)
export async function processZipBuffer(buffer: Buffer) {
  const zip = new AdmZip(buffer);
  const zipEntries = zip.getEntries();
  const files: { name: string; content: string }[] = [];

  for (const entry of zipEntries) {
    if (!entry.isDirectory && !shouldIgnore(entry.entryName)) {
      files.push({
        name: entry.entryName,
        content: entry.getData().toString('utf8'),
      });
    }
  }

  return files;
}

// 2. Handle GitHub / Git URLs (Clone to Temp Directory)
export async function processGitRepo(repoUrl: string) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codesage-'));
  const files: { name: string; content: string }[] = [];

  try {
    const git = simpleGit();
    await git.clone(repoUrl, tempDir, ['--depth', '1']); // Shallow clone for speed

    // Recursive function to read directory contents
    async function readDir(dir: string, base: string = '') {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(base, entry.name);

        if (shouldIgnore(relativePath)) continue;

        if (entry.isDirectory()) {
          await readDir(fullPath, relativePath);
        } else {
          // Read text files, skip binary reading errors
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            files.push({ name: relativePath, content });
          } catch (e) {
            console.warn(`Skipping unreadable file: ${relativePath}`);
          }
        }
      }
    }

    await readDir(tempDir);
  } finally {
    // Always clean up the temp directory!
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  return files;
}
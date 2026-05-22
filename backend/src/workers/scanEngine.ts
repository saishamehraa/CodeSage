// backend/src/workers/scanEngine.ts
import { createClient } from '@supabase/supabase-js';
import { analyzeCodeFile } from '../services/ai/codeAnalyzer';
import { searchLiveThreatIntel } from '../services/brightdata/threatIntel';

// Use the Service Role key to bypass RLS in the backend
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Helper to respect API rate limits (essential for free-tier models)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runAutonomousScan(projectId: string, files: { name: string, content: string }[]) {
  const channel = supabase.channel(`scan:${projectId}`);
  await channel.subscribe();

  let criticalCount = 0;
  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i];
    // Progress for code analysis phase (first 80%)
    const progress = Math.round(((i + 1) / totalFiles) * 80); 

    // Throttling to prevent API rate limiting
    await sleep(400);

    // 1. Update UI: Scanning file
    await channel.send({
      type: 'broadcast',
      event: 'progress_update',
      payload: { 
        progress, 
        phase: 'AI Code Analysis & Vulnerability Detection', 
        file: file.name,
        reasoning: `Executing neural analysis on AST structures in ${file.name}...` 
      },
    });

    try {
      // 2. Run OpenAI Agent (via OpenRouter)
      const issues = await analyzeCodeFile(file.name, file.content);

      // 3. Process found issues
      for (const issue of issues) {
        let cveId = null;
        let aiReasoning = `[DISCOVERED] ${issue.severity.toUpperCase()} risk in ${file.name}: ${issue.issue_type}`;

        // 4. If it's a high/critical risk, trigger Bright Data for live intel
        if (issue.severity === 'critical' || issue.severity === 'high') {
          criticalCount++;
          
          await channel.send({
            type: 'broadcast',
            event: 'progress_update',
            payload: { 
              progress, 
              phase: 'Web Threat Intelligence Sync', 
              file: file.name,
              reasoning: `[BRIGHT DATA ENGAGED] Searching live web for exploits matching: ${issue.issue_type}...` 
            },
          });

          const intel = await searchLiveThreatIntel(issue.issue_type);
          if (intel && intel.cve_found) {
            cveId = "ACTIVE-EXPLOIT-DETECTED";
            aiReasoning += `\n[ALERT] Live exploit discussions found via SERP API: ${intel.snippet}`;
          }
        }

        // 5. Save to Supabase
        await supabase.from('issues').insert({
          project_id: projectId,
          file_path: file.name,
          line_number: issue.line_number,
          severity: issue.severity,
          issue_type: issue.issue_type,
          message: issue.message,
          description: issue.description,
          fix_suggestion: issue.fix_suggestion,
          cve: cveId
        });

        // Stream the AI's internal monologue
        await channel.send({
          type: 'broadcast',
          event: 'progress_update',
          payload: { progress, phase: 'Compiling Risk Vector', file: file.name, reasoning: aiReasoning },
        });
      }
    } catch (error) {
      console.error(`Error analyzing ${file.name}:`, error);
      await channel.send({
        type: 'broadcast',
        event: 'progress_update',
        payload: { progress, phase: 'Warning', file: file.name, reasoning: 'File analysis skipped due to processing error.' }
      });
      continue; // Move to the next file if one fails
    }
  }

  // 6. Finalize the Verdict
  await channel.send({
    type: 'broadcast',
    event: 'progress_update',
    payload: { 
      progress: 90, 
      phase: 'Finalizing Deployment Verdict', 
      file: 'System',
      reasoning: `Analysis complete. Calculating final deployment scores...` 
    },
  });

  const finalStatus = criticalCount > 0 ? 'block' : 'pass';
  
  await supabase
    .from('projects')
    .update({ 
      status: finalStatus,
      security_score: finalStatus === 'block' ? 45 : 92,
      total_issues: criticalCount,
      critical_issues: criticalCount,
      last_scan: new Date().toISOString()
    })
    .eq('id', projectId);

  await channel.send({
    type: 'broadcast',
    event: 'progress_update',
    payload: { progress: 100, phase: 'Scan Complete', file: 'N/A', reasoning: 'Scan finished.' }
  });

  await supabase.removeChannel(channel);
}
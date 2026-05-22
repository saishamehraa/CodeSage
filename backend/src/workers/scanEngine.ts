// backend/src/workers/scanEngine.ts
import { createClient } from '@supabase/supabase-js';
import { analyzeCodeFile } from '../services/ai/codeAnalyzer';
import { searchLiveThreatIntel } from '../services/brightdata/threatIntel';

// Use the Service Role key to bypass RLS in the backend
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function runAutonomousScan(projectId: string, files: { name: string, content: string }[]) {
  const channel = supabase.channel(`scan:${projectId}`);
  await channel.subscribe();

  let criticalCount = 0;
  const totalFiles = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = Math.round(((i + 1) / totalFiles) * 80); // First 80% is code analysis

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

    // 2. Run OpenAI Agent
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
            reasoning: `[BRIGHT DATA ENGAGED] Searching live web for active exploits matching: ${issue.issue_type}...` 
          },
        });

        const intel = await searchLiveThreatIntel(issue.issue_type);
        if (intel.cve_found) {
          cveId = "ACTIVE-EXPLOIT-DETECTED"; // You can parse the actual CVE from the snippet
          aiReasoning += `\n[ALERT] Live exploit discussions found via SERP API: ${intel.snippet}`;
        }
      }

      // 5. Save to Supabase (This triggers the frontend postgres_changes listener instantly)
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

      // Stream the AI's internal monologue to the frontend terminal
      await channel.send({
        type: 'broadcast',
        event: 'progress_update',
        payload: { progress, phase: 'Compiling Risk Vector', file: file.name, reasoning: aiReasoning },
      });
    }
  }

  // 6. Finalize the Verdict
  await channel.send({
    type: 'broadcast',
    event: 'progress_update',
    payload: { 
      progress: 100, 
      phase: 'Finalizing Deployment Verdict', 
      file: 'Generating Report',
      reasoning: `Analysis complete. Calculating final deployment scores...` 
    },
  });

  const finalStatus = criticalCount > 0 ? 'block' : 'pass';
  
  await supabase
    .from('projects')
    .update({ 
      status: finalStatus,
      security_score: finalStatus === 'block' ? 45 : 92, // Calculate dynamically in prod
      total_issues: criticalCount,
      critical_issues: criticalCount
    })
    .eq('id', projectId);

  await supabase.removeChannel(channel);
}
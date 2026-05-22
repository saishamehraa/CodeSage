// src/app/hooks/useRealtimeScan.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { scanPhases } from '../lib/mockData';

export function useRealtimeScan(projectId: string | null) {
  const [state, setState] = useState({
    isScanning: false,
    scanProgress: 0,
    currentPhase: scanPhases[0],
    currentFile: '',
    liveAiReasoning: '',
    criticalCount: 0,
    highCount: 0,
  });

  useEffect(() => {
    if (!projectId) return;

    setState(prev => ({ ...prev, isScanning: true }));

    // Initialize channels
    const scanChannel = supabase.channel(`scan:${projectId}`);
    const issueChannel = supabase.channel(`public-issues:${projectId}`);

    // 1. Attach listeners FIRST
    scanChannel.on('broadcast', { event: 'progress_update' }, ({ payload }) => {
      setState(prev => ({
        ...prev,
        scanProgress: payload.progress,
        currentPhase: payload.phase,
        currentFile: payload.file || prev.currentFile,
        liveAiReasoning: payload.reasoning || prev.liveAiReasoning,
      }));
    });

    issueChannel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'issues',
        filter: `project_id=eq.${projectId}`
      },
      (payload) => {
        const newIssue = payload.new;
        setState(prev => ({
          ...prev,
          criticalCount: newIssue.severity === 'critical' ? prev.criticalCount + 1 : prev.criticalCount,
          highCount: newIssue.severity === 'high' ? prev.highCount + 1 : prev.highCount,
          liveAiReasoning: `[DISCOVERED] ${newIssue.issue_type} in ${newIssue.file_path}`
        }));
      }
    );

    // 2. Subscribe LAST
    scanChannel.subscribe();
    issueChannel.subscribe();

    // 3. Cleanup to prevent memory leaks and "ghost" connections
    return () => {
      supabase.removeChannel(scanChannel);
      supabase.removeChannel(issueChannel);
    };
  }, [projectId]);

  return { state };
}
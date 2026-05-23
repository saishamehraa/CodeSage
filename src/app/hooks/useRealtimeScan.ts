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

    // ANTI-CRASH FIX: Create a unique ID for the DB listener to bypass React Strict Mode caching
    const uniqueId = Date.now();

    // 1. Broadcast Channel (Must match backend EXACTLY: `scan:${projectId}`)
    const scanChannel = supabase
      .channel(`scan:${projectId}`)
      .on('broadcast', { event: 'progress_update' }, ({ payload }) => {
        setState(prev => ({
          ...prev,
          scanProgress: payload.progress,
          currentPhase: payload.phase,
          currentFile: payload.file || prev.currentFile,
          liveAiReasoning: payload.reasoning || prev.liveAiReasoning,
        }));
      })
      .subscribe();

    // 2. Database Channel (Name can be unique to prevent "after subscribe" crash)
    const issueChannel = supabase
      .channel(`public-issues-${projectId}-${uniqueId}`)
      .on(
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
            liveAiReasoning: `[DISCOVERED] ${newIssue.severity.toUpperCase()} risk: ${newIssue.issue_type}`
          }));
        }
      )
      .subscribe();

    // 3. Strict Cleanup
    return () => {
      supabase.removeChannel(scanChannel);
      supabase.removeChannel(issueChannel);
    };
  }, [projectId]);

  return { state };
}
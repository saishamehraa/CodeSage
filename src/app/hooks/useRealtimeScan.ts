// src/app/hooks/useRealtimeScan.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { scanPhases } from '../lib/mockData';

export interface ScanState {
  isScanning: boolean;
  scanProgress: number;
  currentPhase: string;
  currentFile: string;
  liveAiReasoning: string;
  criticalCount: number;
  highCount: number;
}

export function useRealtimeScan(projectId: string | null) {
  const [state, setState] = useState<ScanState>({
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

    // 1. Listen to Broadcast channel for quick-moving text (AI logs, progress bar updates)
    const scanChannel = supabase.channel(`scan:${projectId}`)
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

    // 2. Listen directly to Postgres changes on the 'issues' table for live discovery counts
    const issueChannel = supabase.channel(`public-issues:${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'issues',
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        const newIssue = payload.new;
        setState(prev => ({
          ...prev,
          criticalCount: newIssue.severity === 'critical' ? prev.criticalCount + 1 : prev.criticalCount,
          highCount: newIssue.severity === 'high' ? prev.highCount + 1 : prev.highCount,
          liveAiReasoning: `[DISCOVERED] Detected ${newIssue.issue_type} in ${newIssue.file_path}`
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(scanChannel);
      supabase.removeChannel(issueChannel);
    };
  }, [projectId]);

  return { state, setState };
}
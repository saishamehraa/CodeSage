// src/app/components/LiveScannerOverlay.tsx
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ShieldAlert, FileSearch, Terminal, DatabaseZap } from "lucide-react";
import { useRealtimeScan } from "../hooks/useRealtimeScan";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function LiveScannerOverlay({ projectId }: { projectId: string | null }) {
  const { state } = useRealtimeScan(projectId);

  if (!state.isScanning) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/80 p-8 backdrop-blur-xl relative overflow-hidden">
      {/* Visual cyber mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05),transparent)] pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            <h3 className="text-xl font-bold text-white tracking-tight">CodeSage Multi-Agent Security Engine Active</h3>
          </div>
          <p className="text-sm font-mono text-slate-400 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-cyan-400" />
            Analyzing: <span className="text-cyan-400 truncate max-w-md">{state.currentFile || "Indexing package trees..."}</span>
          </p>
        </div>

        {/* Live Attack Intel / Counter Widgets */}
        <div className="flex gap-4">
          <motion.div 
            animate={state.criticalCount > 0 ? { scale: [1, 1.1, 1] } : {}}
            className="px-4 py-3 rounded-lg bg-red-950/30 border border-red-500/20 text-center"
          >
            <div className="text-xs text-red-400 font-semibold uppercase flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Critical Risks
            </div>
            <div className="text-2xl font-black text-red-500 font-mono mt-1">{state.criticalCount}</div>
          </motion.div>

          <motion.div 
            animate={state.highCount > 0 ? { scale: [1, 1.1, 1] } : {}}
            className="px-4 py-3 rounded-lg bg-orange-950/30 border border-orange-500/20 text-center"
          >
            <div className="text-xs text-orange-400 font-semibold uppercase">High Risks</div>
            <div className="text-2xl font-black text-orange-400 font-mono mt-1">{state.highCount}</div>
          </motion.div>
        </div>
      </div>

      {/* Main Orchestrator Progress */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span className="text-violet-400 flex items-center gap-1">
            <DatabaseZap className="w-3 h-3" /> {state.currentPhase}
          </span>
          <span>{state.scanProgress}%</span>
        </div>
        <Progress value={state.scanProgress} className="h-2 bg-slate-900" />
      </div>

      {/* Streaming Terminal-Inspired Agent Stream */}
      <div className="rounded-lg bg-black/50 border border-white/5 p-4 font-mono text-xs text-emerald-400 space-y-1.5 h-32 overflow-y-auto">
        <div className="text-slate-500 flex items-center gap-1.5">
          <Terminal className="w-3 h-3" /> [Bright Data MCP Gateway Connected]
        </div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={state.liveAiReasoning}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="leading-relaxed whitespace-pre-wrap text-slate-300"
          >
            <span className="text-violet-400 font-bold">&gt;_ codesage-agent: </span>
            {state.liveAiReasoning || "Awaiting target file execution buffers..."}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
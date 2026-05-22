// src/app/components/Scanner.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Github, Link as LinkIcon, Scan, Shield, Code2, Database, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useNavigate } from "react-router";

import { api } from "../lib/api";
import { LiveScannerOverlay } from "./LiveScannerOverlay";
import { useRealtimeScan } from "../hooks/useRealtimeScan";

export function Scanner() {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'github' | 'url'>('upload');
  const [repoUrl, setRepoUrl] = useState('');
  
  // Tracking live scan state
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Listen to the realtime progress if a project is active
  const { state: scanState } = useRealtimeScan(activeProjectId);

  // Navigate automatically when scan progress hits 100
  useEffect(() => {
    if (activeProjectId && scanState.scanProgress >= 100) {
      setTimeout(() => {
        navigate(`/analysis/${activeProjectId}`);
      }, 1500); // 1.5s delay to show the "Complete" state briefly
    }
  }, [scanState.scanProgress, activeProjectId, navigate]);


const handleStartScan = async () => {
  if (uploadMethod !== 'upload' && !repoUrl) return;

  try {
    const formData = new FormData();
    formData.append('uploadMethod', uploadMethod);
    
    if (uploadMethod === 'upload') {
      // Assuming you have a state variable holding the selected File object
      const fileInput = document.getElementById('zip-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append('file', fileInput.files[0]);
      }
    } else {
      formData.append('repoUrl', repoUrl);
    }

    // Hit your new Node.js endpoint
    const response = await fetch('http://localhost:3000/api/start-scan', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      // Set the active ID to trigger the realtime WebSocket overlay
      setActiveProjectId(data.projectId);
    } else {
      console.error("Failed to start scan:", data.error);
    }

  } catch (err) {
    console.error("API error:", err);
  }
};

  const features = [
    { icon: Shield, title: "Security Analysis", description: "OWASP Top 10, CVE detection", gradient: "from-red-500 to-orange-500" },
    { icon: Code2, title: "Code Quality", description: "Syntax errors, runtime risks", gradient: "from-blue-500 to-cyan-500" },
    { icon: Database, title: "Threat Intelligence", description: "Live web scanning via Bright Data", gradient: "from-purple-500 to-pink-500" },
    { icon: Sparkles, title: "Auto-Fix Engine", description: "AI-generated security patches", gradient: "from-emerald-500 to-green-500" },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header (Hidden during scan for focus) */}
        {!activeProjectId && (
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
              <Scan className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-400 font-medium">AI-Powered Code Analysis</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-bold text-white mb-4">
              Repository Scanner
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-slate-400">
              Upload your codebase and let AI analyze security vulnerabilities
            </motion.p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!activeProjectId ? (
            <motion.div key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-8">
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feature, index) => (
                  <Card key={feature.title} className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                    <CardContent className="p-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
                      <p className="text-xs text-slate-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Upload Card */}
              <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Select Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as any)} className="mb-6">
                    <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                      <TabsTrigger value="upload" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                        <Upload className="w-4 h-4 mr-2" /> Upload ZIP
                      </TabsTrigger>
                      <TabsTrigger value="github" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                        <Github className="w-4 h-4 mr-2" /> GitHub
                      </TabsTrigger>
                      <TabsTrigger value="url" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                        <LinkIcon className="w-4 h-4 mr-2" /> Git URL
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="mt-6">
                      <div className="border-2 border-dashed border-white/10 rounded-lg p-12 text-center hover:border-violet-500/30 transition-all cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Drop your ZIP file here</h3>
                        <Button variant="outline" className="border-white/10 text-white mt-2">Browse Files</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="github" className="mt-6 space-y-4">
                      <div>
                        <Label className="text-white mb-2 block">GitHub Repository URL</Label>
                        <Input
                          placeholder="https://github.com/username/repository"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="bg-slate-800/50 border-white/10 text-white"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="mt-6 space-y-4">
                      <div>
                        <Label className="text-white mb-2 block">Git Repository URL</Label>
                        <Input
                          placeholder="https://gitlab.com/username/repository.git"
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="bg-slate-800/50 border-white/10 text-white"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end">
                    <Button onClick={handleStartScan} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-0">
                      <Scan className="w-4 h-4 mr-2" /> Execute Agent Pipeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="scanning" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <LiveScannerOverlay projectId={activeProjectId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
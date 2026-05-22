// src/app/components/Analysis.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, 
  Code2, FileCode, Download, ExternalLink, Zap, Search, Database, Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import Editor from "@monaco-editor/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

import { api } from "../lib/api";
import { threatIntelligence } from "../lib/mockData"; // Keep threat intel mock for now unless in DB

export function Analysis() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const { project: fetchedProject, issues: fetchedIssues } = await api.getProjectAnalysis(id);
        setProject(fetchedProject);
        setIssues(fetchedIssues);
        setSelectedIssue(fetchedIssues[0] || null);
      } catch (error) {
        console.error("Failed to load project analysis:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <p className="text-slate-400">Loading analysis data from Supabase...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="p-8 text-white">Project not found.</div>;
  }

  // Map database snake_case to chart data
  const scoreData = [
    { name: "Security", value: project.security_score || 0, fill: "#8b5cf6" },
    { name: "Reliability", value: project.reliability_score || 0, fill: "#06b6d4" },
    { name: "Maintainability", value: project.maintainability_score || 0, fill: "#10b981" },
  ];

  // Dynamically calculate issue distribution from the database issues
  const calculateIssuesByType = () => {
    const counts = { Security: 0, Quality: 0, Performance: 0, Style: 0 };
    issues.forEach(issue => {
      if (issue.issue_type.toLowerCase().includes('security') || issue.issue_type.toLowerCase().includes('injection')) counts.Security++;
      else counts.Quality++; // Simplified mapping for demo
    });
    return [
      { name: "Security", count: counts.Security, color: "#ef4444" },
      { name: "Quality", count: counts.Quality, color: "#f97316" },
      { name: "Performance", count: counts.Performance, color: "#eab308" },
      { name: "Style", count: counts.Style, color: "#3b82f6" },
    ];
  };

  const issuesByType = calculateIssuesByType();

  // Helper functions remain the same
  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pass': return 'from-emerald-500 to-green-500';
      case 'warn': return 'from-yellow-500 to-orange-500';
      case 'block': return 'from-red-500 to-rose-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pass': return <CheckCircle className="w-6 h-6" />;
      case 'warn': return <AlertTriangle className="w-6 h-6" />;
      case 'block': return <XCircle className="w-6 h-6" />;
      default: return <Shield className="w-6 h-6" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link to="/">
            <Button variant="outline" size="icon" className="border-white/10 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
            <p className="text-slate-400">{project.repository}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
          <Button className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
            <Zap className="w-4 h-4 mr-2" /> Apply Auto-Fixes
          </Button>
        </div>
      </div>

      {/* Deployment Verdict */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden">
          <div className={`h-1 bg-gradient-to-r ${getStatusColor(project.status)}`} />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    Deployment Verdict: <span className="uppercase">{project.status}</span>
                  </h2>
                  <p className="text-slate-400">
                    {project.status === 'pass' && 'Repository is ready for deployment'}
                    {project.status === 'warn' && 'Review recommended before deployment'}
                    {project.status === 'block' && 'Critical issues must be resolved before deployment'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Last Scanned</p>
                <p className="text-white font-medium">{new Date(project.last_scan).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoreData.map((score, index) => (
          <motion.div
            key={score.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{score.name} Score</h3>
                  <span className="text-3xl font-bold text-white">{score.value}%</span>
                </div>
                <Progress value={score.value} className="h-2 mb-2" />
                <p className="text-xs text-slate-400">
                  {score.value >= 90 ? 'Excellent' : score.value >= 75 ? 'Good' : score.value >= 60 ? 'Fair' : 'Needs Improvement'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Issue Sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Issues Found</CardTitle>
              <CardDescription>{issues.length} total issues detected</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {issues.map((issue) => (
                    <motion.div
                      key={issue.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedIssue(issue)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedIssue?.id === issue.id
                          ? 'bg-violet-500/10 border-violet-500/30'
                          : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={`${getSeverityColor(issue.severity)} border text-xs`}>
                          {issue.severity}
                        </Badge>
                        {issue.cve && (
                          <Badge variant="outline" className="border-white/10 text-slate-400 text-xs">
                            {issue.cve}
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium text-white text-sm mb-1">{issue.message}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FileCode className="w-3 h-3" />
                        <span className="truncate">{issue.file_path}:{issue.line_number}</span>
                      </div>
                    </motion.div>
                  ))}
                  {issues.length === 0 && <p className="text-slate-400 text-center py-8">No issues found!</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Issue Editor/Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          {selectedIssue ? (
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white mb-2">{selectedIssue.message}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getSeverityColor(selectedIssue.severity)} border`}>
                        {selectedIssue.severity} severity
                      </Badge>
                      <Badge variant="outline" className="border-white/10 text-slate-400">
                        {selectedIssue.issue_type}
                      </Badge>
                      {selectedIssue.cve && (
                        <Badge variant="outline" className="border-white/10 text-slate-400">
                          <ExternalLink className="w-3 h-3 mr-1" /> {selectedIssue.cve}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{selectedIssue.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="code" className="space-y-4">
                  <TabsList className="bg-slate-800/50">
                    <TabsTrigger value="code" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                      <Code2 className="w-4 h-4 mr-2" /> Code Details
                    </TabsTrigger>
                    <TabsTrigger value="fix" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-400">
                      <Zap className="w-4 h-4 mr-2" /> AI Fix
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="space-y-4">
                    <div className="rounded-lg overflow-hidden border border-white/10">
                      {/* Note: Real code snippet requires parsing the file. Using placeholder for UI purposes. */}
                      <Editor
                        height="400px"
                        defaultLanguage="javascript"
                        value={`// File: ${selectedIssue.file_path}\n// Issue around line ${selectedIssue.line_number}\n\n// Code snippet unavailable in demo environment.`}
                        theme="vs-dark"
                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="fix" className="space-y-4">
                    {selectedIssue.fix_suggestion ? (
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-emerald-400 mb-1">Fix Recommendation</h4>
                            <p className="text-sm text-emerald-400/80 mb-3">{selectedIssue.fix_suggestion}</p>
                            <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0">
                              <Zap className="w-3 h-3 mr-2" /> Apply This Fix
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400 py-8 text-center">No automated fix available for this issue.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-full items-center justify-center border border-dashed border-white/10 rounded-xl">
              <p className="text-slate-500">Select an issue to view details</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Statistics Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Issue Distribution Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={issuesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {issuesByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
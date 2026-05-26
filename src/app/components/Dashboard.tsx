//src/app/components/Dashboard.tsx
import { motion } from "motion/react";
import { Shield, AlertTriangle, CheckCircle, XCircle, TrendingUp, Activity, Clock, Code2, Database, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
// Keeping activityLog and threatIntel as mocks for the dashboard visualization
import { activityLog, threatIntelligence } from "../lib/mockData";

export function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real projects from Supabase
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin mx-auto" />
          <p className="text-slate-400">Loading CodeSage Intelligence...</p>
        </div>
      </div>
    );
  }

  // Calculate stats dynamically from DB data
  const totalCritical = projects.reduce((sum, p) => sum + (p.critical_issues || 0), 0);
  const avgSecurityScore = projects.length 
    ? Math.round(projects.reduce((sum, p) => sum + (p.security_score || 0), 0) / projects.length)
    : 0;

  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      change: "Active in database",
      icon: Code2,
      color: "from-violet-500 to-purple-500",
    },
    {
      title: "Critical Issues",
      value: totalCritical.toString(),
      change: "Across all repos",
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
    {
      title: "Avg Security Score",
      value: `${avgSecurityScore}%`,
      change: "Platform wide",
      icon: Shield,
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Scans Today",
      value: projects.filter(p => new Date(p.last_scan).toDateString() === new Date().toDateString()).length.toString(),
      change: "Recently analyzed",
      icon: Activity,
      color: "from-emerald-500 to-green-500",
    },
  ];

  const trendData = [
    { date: "Mon", security: 75, reliability: 82, issues: 45 },
    { date: "Tue", security: 76, reliability: 84, issues: 38 },
    { date: "Wed", security: 74, reliability: 81, issues: 52 },
    { date: "Thu", security: 77, reliability: 85, issues: 34 },
    { date: "Fri", security: avgSecurityScore || 78, reliability: 86, issues: totalCritical || 28 }, // Tie last day to real data
  ];

  const issueDistribution = [
    { name: "Critical", value: totalCritical || 16, color: "#ef4444" },
    { name: "High", value: 35, color: "#f97316" },
    { name: "Medium", value: 48, color: "#eab308" },
    { name: "Low", value: 24, color: "#3b82f6" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'warn': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'block': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4" />;
      case 'warn': return <AlertTriangle className="w-4 h-4" />;
      case 'block': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Security Dashboard
        </motion.h1>
        <p className="text-slate-400">Real-time AI-powered code intelligence and threat analysis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-all">
              <CardContent className="p-6 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Security Trends</CardTitle>
              <CardDescription>Weekly security and reliability metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReliability" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="security" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorSecurity)" />
                  <Area type="monotone" dataKey="reliability" stroke="#06b6d4" fillOpacity={1} fill="url(#colorReliability)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Issue Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Issue Distribution</CardTitle>
              <CardDescription>Current vulnerability breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {issueDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-400">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Recent Scans</CardTitle>
                <CardDescription>Latest project security assessments</CardDescription>
              </div>
              <Link to="/scanner">
                <Button variant="outline" size="sm" className="border-white/10 text-white hover:bg-white/10">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No projects scanned yet. <Link to="/scanner" className="text-violet-400 hover:underline">Start a scan</Link>
                </div>
              ) : (
                projects.slice(0, 3).map((project) => (
                  <Link key={project.id} to={`/analysis/${project.id}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-lg bg-slate-800/50 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{project.name}</h4>
                          <p className="text-xs text-slate-400">{project.repository}</p>
                        </div>
                        <Badge className={`${getStatusColor(project.status)} border`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(project.status)}
                            <span className="uppercase text-xs">{project.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Security</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.security_score} className="flex-1 h-1" />
                            <span className="text-xs text-white font-medium">{project.security_score || 0}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Reliability</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.reliability_score} className="flex-1 h-1" />
                            <span className="text-xs text-white font-medium">{project.reliability_score || 0}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Issues</p>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-orange-400" />
                            <span className="text-xs text-white font-medium">{project.total_issues || 0}</span>
                            {project.critical_issues > 0 && (
                              <span className="text-xs text-red-400">({project.critical_issues} critical)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(project.last_scan).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Activity Log</CardTitle>
              <CardDescription>Recent platform events and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityLog.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 p-3 rounded-lg bg-slate-800/30 border border-white/5"
                >
                  <div className={`w-2 h-2 mt-2 rounded-full ${getSeverityColor(activity.severity)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white mb-1">{activity.message}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium text-slate-400">{activity.project}</span>
                      <span>•</span>
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Threat Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-violet-400" />
                  Live Web Threat Intelligence
                </CardTitle>
                <CardDescription>Real-time security intelligence from Bright Data</CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {threatIntelligence.map((source, index) => (
                <motion.div
                  key={source.source}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-lg bg-slate-800/50 border border-white/10 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Database className="w-5 h-5 text-violet-400" />
                    <Badge className={`${getSeverityColor(source.severity)} text-xs`}>
                      {source.severity}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{source.source}</h4>
                  <p className="text-2xl font-bold text-violet-400 mb-1">{source.findings}</p>
                  <p className="text-xs text-slate-500">findings detected</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4"
      >
        <Link to="/scanner" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0">
            <Activity className="w-4 h-4 mr-2" />
            Start New Scan
          </Button>
        </Link>
        <Link to="/scanner" className="flex-1"> 
          <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
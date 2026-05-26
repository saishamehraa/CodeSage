import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Shield, Bell, Key, Database, Webhook, Code2, Zap, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

export function Settings() {
  // --- STATE MANAGEMENT ---
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // API Keys State
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    brightdata: "",
    github: "",
  });

  // CI/CD Platform State
  const [platforms, setPlatforms] = useState([
    { name: "GitHub Actions", enabled: true },
    { name: "GitLab CI", enabled: true },
    { name: "Jenkins", enabled: false },
    { name: "CircleCI", enabled: false },
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState({
    critical: true,
    blocked: true,
    cve: true,
    weekly: false
  });

  // --- LOAD SAVED DATA ON MOUNT ---
  useEffect(() => {
    const savedKeys = localStorage.getItem("codesage_api_keys");
    const savedPlatforms = localStorage.getItem("codesage_platforms");
    const savedNotifs = localStorage.getItem("codesage_notifications");

    if (savedKeys) setApiKeys(JSON.parse(savedKeys));
    if (savedPlatforms) setPlatforms(JSON.parse(savedPlatforms));
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  // Integrations remain static as they just show status
  const integrations = [
    {
      name: "Bright Data SERP API",
      description: "Real-time search engine results for threat intelligence",
      icon: Database,
      status: "connected",
      color: "from-violet-500 to-purple-500",
    },
    {
      name: "Bright Data MCP Server",
      description: "Multi-channel proxy for web data collection",
      icon: Shield,
      status: "connected",
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "Web Unlocker",
      description: "Access protected security databases and advisories",
      icon: Key,
      status: "connected",
      color: "from-emerald-500 to-green-500",
    },
    {
      name: "Scraping Browser",
      description: "Browser automation for CVE and exploit research",
      icon: Code2,
      status: "connected",
      color: "from-orange-500 to-red-500",
    },
  ];

  // --- HANDLERS ---
  const handleKeyChange = (keyName: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [keyName]: value }));
  };

  const togglePlatform = (platformName: string) => {
    setPlatforms(prev => prev.map(p => 
      p.name === platformName ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Logically save to browser storage
    localStorage.setItem("codesage_api_keys", JSON.stringify(apiKeys));
    localStorage.setItem("codesage_platforms", JSON.stringify(platforms));
    localStorage.setItem("codesage_notifications", JSON.stringify(notifications));

    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const handleReset = () => {
    // Clear state
    setApiKeys({ openai: "", brightdata: "", github: "" });
    setPlatforms([
      { name: "GitHub Actions", enabled: false },
      { name: "GitLab CI", enabled: false },
      { name: "Jenkins", enabled: false },
      { name: "CircleCI", enabled: false },
    ]);
    setNotifications({ critical: false, blocked: false, cve: false, weekly: false });
    
    // Clear storage
    localStorage.removeItem("codesage_api_keys");
    localStorage.removeItem("codesage_platforms");
    localStorage.removeItem("codesage_notifications");
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            Settings
          </motion.h1>
          <p className="text-slate-400">Configure your CodeSage platform</p>
        </div>

        {/* API Keys */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-violet-400" />
                API Keys
              </CardTitle>
              <CardDescription>Manage your API credentials for external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key" className="text-white">OpenRouter / OpenAI API Key</Label>
                <Input 
                  id="openai-key" 
                  type="password" 
                  placeholder="sk-or-v1-..." 
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500" 
                  value={apiKeys.openai}
                  onChange={(e) => handleKeyChange("openai", e.target.value)}
                />
                <p className="text-xs text-slate-500">Used for AI code analysis and fix generation</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brightdata-key" className="text-white">Bright Data API Key</Label>
                <Input 
                  id="brightdata-key" 
                  type="password" 
                  placeholder="bd-..." 
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500" 
                  value={apiKeys.brightdata}
                  onChange={(e) => handleKeyChange("brightdata", e.target.value)}
                />
                <p className="text-xs text-slate-500">Used for web threat intelligence gathering</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="github-token" className="text-white">GitHub Personal Access Token</Label>
                <Input 
                  id="github-token" 
                  type="password" 
                  placeholder="ghp_..." 
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500" 
                  value={apiKeys.github}
                  onChange={(e) => handleKeyChange("github", e.target.value)}
                />
                <p className="text-xs text-slate-500">Used for repository cloning and GitHub integration</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bright Data Integrations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-violet-400" />
                Bright Data Integrations
              </CardTitle>
              <CardDescription>Real-time web intelligence tools for security research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <motion.div key={integration.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + index * 0.05 }} className="p-4 rounded-lg bg-slate-800/50 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${integration.color}`}>
                        <integration.icon className="w-4 h-4 text-white" />
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          {integration.status}
                        </div>
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white text-sm mb-1">{integration.name}</h3>
                    <p className="text-xs text-slate-400">{integration.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CI/CD Integration */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Webhook className="w-5 h-5 text-violet-400" />
                CI/CD Integration
              </CardTitle>
              <CardDescription>Enable deployment blocking for continuous integration platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-white/10 transition-colors hover:bg-slate-800/80">
                  <div>
                    <h4 className="font-medium text-white text-sm mb-1">{platform.name}</h4>
                    <p className="text-xs text-slate-400">
                      {platform.enabled ? 'Deployment blocking enabled' : 'Not configured'}
                    </p>
                  </div>
                  <Switch 
                    checked={platform.enabled} 
                    onCheckedChange={() => togglePlatform(platform.name)} 
                  />
                </div>
              ))}
              <Separator className="bg-white/10" />
              <div className="p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-violet-400 mb-1">Webhook URL</h4>
                    <p className="text-sm text-violet-400/80 mb-2 font-mono break-all">
                      https://api.codesage.ai/webhooks/your-project-id
                    </p>
                    <Button variant="outline" size="sm" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      View Integration Guide
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-400" />
                Notifications
              </CardTitle>
              <CardDescription>Configure alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2">
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Critical Vulnerabilities</h4>
                  <p className="text-xs text-slate-400">Get notified when critical issues are found</p>
                </div>
                <Switch 
                  checked={notifications.critical} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, critical: checked}))} 
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between p-2">
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Deployment Blocked</h4>
                  <p className="text-xs text-slate-400">Alert when deployments are blocked by CodeSage</p>
                </div>
                <Switch 
                  checked={notifications.blocked} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, blocked: checked}))} 
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between p-2">
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">New CVE Detection</h4>
                  <p className="text-xs text-slate-400">Notify when new CVEs are detected in dependencies</p>
                </div>
                <Switch 
                  checked={notifications.cve} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, cve: checked}))} 
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between p-2">
                <div>
                  <h4 className="font-medium text-white text-sm mb-1">Weekly Reports</h4>
                  <p className="text-xs text-slate-400">Receive weekly security summary emails</p>
                </div>
                <Switch 
                  checked={notifications.weekly} 
                  onCheckedChange={(checked) => setNotifications(prev => ({...prev, weekly: checked}))} 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button Area */}
        <div className="flex items-center justify-end gap-4 pb-8">
          {saved && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center text-emerald-400 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Settings saved successfully
            </motion.div>
          )}
          
          <Button variant="outline" className="border-white/10 text-white hover:bg-white/10" onClick={handleReset}>
            Reset to Defaults
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 min-w-[140px] transition-all"
          >
            {isSaving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
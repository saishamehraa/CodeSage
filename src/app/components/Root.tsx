//src/app/components/Root.tsx
import { Outlet, Link, useLocation } from "react-router";
import { Shield, LayoutDashboard, Scan, Settings, Github, Search } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/scanner", icon: Scan, label: "Scanner" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Shield className="w-8 h-8 text-violet-400 group-hover:text-violet-300 transition-colors" />
                <div className="absolute inset-0 bg-violet-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CodeSage</h1>
                <p className="text-xs text-slate-400">AI Security Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="block">
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="ml-auto w-2 h-2 rounded-full bg-violet-400"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-400">Enterprise Plan</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

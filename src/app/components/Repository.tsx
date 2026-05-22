//src/app/components/Repository.tsx
import { useParams, Link } from "react-router";
// Add React import for useState
import React from 'react';
import { motion } from "motion/react";
import { ArrowLeft, Folder, File, ChevronRight, GitBranch, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { mockProjects } from "../lib/mockData";

export function Repository() {
  const { id } = useParams();
  const project = mockProjects.find(p => p.id === id) || mockProjects[0];

  const fileStructure = [
    { name: 'src', type: 'folder', children: [
      { name: 'auth', type: 'folder', children: [
        { name: 'jwt.ts', type: 'file', issues: 2 },
        { name: 'middleware.ts', type: 'file', issues: 0 },
      ]},
      { name: 'api', type: 'folder', children: [
        { name: 'user.ts', type: 'file', issues: 1 },
        { name: 'upload.ts', type: 'file', issues: 3 },
      ]},
      { name: 'database', type: 'folder', children: [
        { name: 'query.ts', type: 'file', issues: 4 },
        { name: 'connection.ts', type: 'file', issues: 0 },
      ]},
      { name: 'utils', type: 'folder', children: [
        { name: 'crypto.ts', type: 'file', issues: 2 },
        { name: 'helpers.ts', type: 'file', issues: 0 },
      ]},
    ]},
    { name: 'tests', type: 'folder', children: [
      { name: 'auth.test.ts', type: 'file', issues: 0 },
      { name: 'api.test.ts', type: 'file', issues: 0 },
    ]},
    { name: 'package.json', type: 'file', issues: 5 },
    { name: 'tsconfig.json', type: 'file', issues: 0 },
    { name: 'README.md', type: 'file', issues: 0 },
  ];

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
      </div>

      {/* Repository Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <GitBranch className="w-5 h-5 text-violet-400" />
            <div>
              <p className="text-sm text-slate-400">Branch</p>
              <p className="font-semibold text-white">main</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm text-slate-400">Last Commit</p>
              <p className="font-semibold text-white">2 hours ago</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm text-slate-400">Contributors</p>
              <p className="font-semibold text-white">8 developers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* File Structure */}
      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Repository Structure</CardTitle>
          <CardDescription>{project.filesScanned} files scanned</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <FileTree items={fileStructure} />
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function FileTree({ items, level = 0 }: { items: any[], level?: number }) {
  return (
    <div className={level > 0 ? 'ml-4 border-l border-white/10 pl-4' : ''}>
      {items.map((item, index) => (
        <FileTreeItem key={index} item={item} level={level} />
      ))}
    </div>
  );
}

function FileTreeItem({ item, level }: { item: any, level: number }) {
  const [isOpen, setIsOpen] = React.useState(level === 0);

  return (
    <div className="mb-1">
      <motion.div
        whileHover={{ x: 2 }}
        onClick={() => item.children && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
          item.children ? 'cursor-pointer hover:bg-white/5' : 'hover:bg-white/5'
        }`}
      >
        {item.children && (
          <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        )}
        {!item.children && <div className="w-4" />}
        {item.type === 'folder' ? (
          <Folder className="w-4 h-4 text-violet-400" />
        ) : (
          <File className="w-4 h-4 text-cyan-400" />
        )}
        <span className="flex-1 text-sm text-white">{item.name}</span>
        {item.issues !== undefined && item.issues > 0 && (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
            {item.issues} issues
          </Badge>
        )}
      </motion.div>
      {item.children && isOpen && (
        <FileTree items={item.children} level={level + 1} />
      )}
    </div>
  );
}


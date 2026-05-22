//src/app/components/StatsCard.tsx
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function StatsCard({ title, value, change, icon: Icon, color, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-all">
        <CardContent className="p-6 relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity`} />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm text-slate-400 mb-1">{title}</p>
              <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
              <p className="text-xs text-slate-500">{change}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${color} bg-opacity-20`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

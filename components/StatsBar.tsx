"use client";

import { motion } from "framer-motion";

interface StatBarProps {
  label: string;
  value: number;
  color?: string;
  delay?: number;
}

export function StatBar({
  label,
  value,
  color = "violet",
  delay = 0,
}: StatBarProps) {
  const colorMap: Record<string, string> = {
    violet: "bg-violet-500",
    cyan: "bg-cyan-500",
    pink: "bg-pink-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${colorMap[color] || colorMap.violet}`}
        />
      </div>
    </div>
  );
}

interface PlaystyleRadarProps {
  scores: Record<string, number>;
}

export function PlaystyleStats({ scores }: PlaystyleRadarProps) {
  const colors = ["violet", "cyan", "pink", "emerald", "amber"];
  const entries = Object.entries(scores);

  return (
    <div className="space-y-3">
      {entries.map(([key, value], i) => (
        <StatBar
          key={key}
          label={key.charAt(0).toUpperCase() + key.slice(1)}
          value={value}
          color={colors[i % colors.length]}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}

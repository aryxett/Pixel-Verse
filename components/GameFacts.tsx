"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  Trophy, Users, Gamepad2, Package,
  Star, Zap, TrendingUp, Clock,
} from "lucide-react";

/* ── Animated counter ── */
function Counter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to, duration]);

  const display = val >= 1_000_000
    ? `${(val / 1_000_000).toFixed(1)}M`
    : val >= 1_000
    ? `${(val / 1_000).toFixed(0)}K`
    : val.toString();

  return <span ref={ref}>{display}</span>;
}

/* ── Stat card ── */
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  glow: string;
  bg: string;
  delay?: number;
  suffix?: string;
}

function StatCard({ icon, label, value, color, glow, bg, delay = 0, suffix = "" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.04, y: -2 }}
      className="relative rounded-2xl p-3.5 border overflow-hidden cursor-default"
      style={{
        background: bg,
        borderColor: `${color}25`,
        boxShadow: `0 4px 20px ${glow}`,
      }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-30 pointer-events-none"
        style={{ background: color }}
      />

      {/* Icon */}
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        {/* Pulse dot */}
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
        />
      </div>

      {/* Value */}
      <p className="text-xl font-black leading-none mb-1" style={{ color }}>
        <Counter to={value} />
        {suffix}
      </p>

      {/* Label */}
      <p className="text-[11px] text-slate-500 font-medium">{label}</p>
    </motion.div>
  );
}

/* ── Popularity bar ── */
function PopularityBar({
  label,
  value,
  max,
  color,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  delay: number;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const display = value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toString();

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 capitalize">{label}</span>
        <span className="font-semibold" style={{ color }}>{display}</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}

/* ── Main component ── */
interface GameFactsProps {
  achievements: number;
  added: number;
  seriesCount: number;
  dlcCount: number;
  ratingsCount: number;
  playingNow: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playtime: string;
}

export default function GameFacts({
  achievements,
  added,
  seriesCount,
  dlcCount,
  ratingsCount,
  playingNow,
  beaten,
  toplay,
  dropped,
  playtime,
}: GameFactsProps) {
  const stats = [
    achievements > 0 && {
      icon: <Trophy className="w-3.5 h-3.5" />,
      label: "Achievements",
      value: achievements,
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.12)",
      bg: "rgba(245,158,11,0.06)",
    },
    added > 0 && {
      icon: <Users className="w-3.5 h-3.5" />,
      label: "Players Added",
      value: added,
      color: "#06b6d4",
      glow: "rgba(6,182,212,0.12)",
      bg: "rgba(6,182,212,0.06)",
    },
    seriesCount > 0 && {
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
      label: "In Series",
      value: seriesCount,
      color: "#ec4899",
      glow: "rgba(236,72,153,0.12)",
      bg: "rgba(236,72,153,0.06)",
    },
    dlcCount > 0 && {
      icon: <Package className="w-3.5 h-3.5" />,
      label: "DLC & Extras",
      value: dlcCount,
      color: "#8b5cf6",
      glow: "rgba(139,92,246,0.12)",
      bg: "rgba(139,92,246,0.06)",
    },
    ratingsCount > 0 && {
      icon: <Star className="w-3.5 h-3.5" />,
      label: "Reviews",
      value: ratingsCount,
      color: "#10b981",
      glow: "rgba(16,185,129,0.12)",
      bg: "rgba(16,185,129,0.06)",
    },
    playingNow > 0 && {
      icon: <Zap className="w-3.5 h-3.5" />,
      label: "Playing Now",
      value: playingNow,
      color: "#7c3aed",
      glow: "rgba(124,58,237,0.12)",
      bg: "rgba(124,58,237,0.06)",
    },
    beaten > 0 && {
      icon: <Trophy className="w-3.5 h-3.5" />,
      label: "Beaten",
      value: beaten,
      color: "#10b981",
      glow: "rgba(16,185,129,0.12)",
      bg: "rgba(16,185,129,0.06)",
    },
  ].filter(Boolean) as StatCardProps[];

  // Library status breakdown
  const statusData = [
    { label: "beaten",  value: beaten,     color: "#10b981" },
    { label: "playing", value: playingNow, color: "#7c3aed" },
    { label: "toplay",  value: toplay,     color: "#f59e0b" },
    { label: "dropped", value: dropped,    color: "#ef4444" },
  ].filter((s) => s.value > 0);

  const maxStatus = Math.max(...statusData.map((s) => s.value), 1);

  if (stats.length === 0 && statusData.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-2xl border border-white/[0.06] overflow-hidden flex flex-col"
      style={{ background: "rgba(13,13,20,0.85)", backdropFilter: "blur(16px)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
        <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Game Facts</span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Stat grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.07} />
            ))}
          </div>
        )}

        {/* Quick facts — Avg Playtime only */}
        {playtime !== "Unknown" && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-cyan-500/15"
            style={{ background: "rgba(6,182,212,0.06)" }}>
            <Clock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-black text-cyan-300">{playtime}</p>
              <p className="text-[10px] text-slate-600">Avg Playtime</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

type ProgressColor = "purple" | "cyan" | "pink" | "green" | "amber";

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: ProgressColor;
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  delay?: number;
  glow?: boolean;
  className?: string;
}

const colorStyles: Record<ProgressColor, string> = {
  purple: "bg-violet-500",
  cyan:   "bg-cyan-500",
  pink:   "bg-pink-500",
  green:  "bg-emerald-500",
  amber:  "bg-amber-500",
};

const glowStyles: Record<ProgressColor, string> = {
  purple: "shadow-[0_0_8px_rgba(124,58,237,0.8)]",
  cyan:   "shadow-[0_0_8px_rgba(6,182,212,0.8)]",
  pink:   "shadow-[0_0_8px_rgba(236,72,153,0.8)]",
  green:  "shadow-[0_0_8px_rgba(16,185,129,0.8)]",
  amber:  "shadow-[0_0_8px_rgba(245,158,11,0.8)]",
};

const sizeStyles = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export default function ProgressBar({
  value,
  max = 100,
  color = "purple",
  size = "md",
  label,
  showValue = false,
  animated = true,
  delay = 0,
  glow = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={clsx("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-slate-400 font-medium">{label}</span>}
          {showValue && (
            <span className="text-slate-300 font-semibold tabular-nums">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className={clsx("w-full bg-slate-800/80 rounded-full overflow-hidden", sizeStyles[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: animated ? 0.8 : 0, delay, ease: "easeOut" }}
          className={clsx(
            "h-full rounded-full",
            colorStyles[color],
            glow && glowStyles[color]
          )}
        />
      </div>
    </div>
  );
}

/* ── Circular Progress ── */
export function CircularProgress({
  value,
  size = 64,
  color = "purple",
  label,
}: {
  value: number;
  size?: number;
  color?: ProgressColor;
  label?: string;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const strokeColors: Record<ProgressColor, string> = {
    purple: "#7c3aed",
    cyan:   "#06b6d4",
    pink:   "#ec4899",
    green:  "#10b981",
    amber:  "#f59e0b",
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={6} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={strokeColors[color]}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-sm font-bold text-slate-200">{value}%</span>
        {label && <p className="text-xs text-slate-500 leading-none mt-0.5">{label}</p>}
      </div>
    </div>
  );
}

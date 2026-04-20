"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface MetacriticBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

function getScoreColor(score: number) {
  if (score >= 75) return { bg: "#66cc33", text: "#000", label: "Positive", glow: "rgba(102,204,51,0.4)" };
  if (score >= 50) return { bg: "#ffcc33", text: "#000", label: "Mixed",    glow: "rgba(255,204,51,0.4)" };
  return               { bg: "#ff0000", text: "#fff", label: "Negative",  glow: "rgba(255,0,0,0.4)" };
}

const sizeStyles = {
  sm: { box: "w-9 h-9 text-sm font-black rounded-md", label: "text-xs" },
  md: { box: "w-12 h-12 text-base font-black rounded-lg", label: "text-xs" },
  lg: { box: "w-16 h-16 text-xl font-black rounded-xl", label: "text-sm" },
};

export default function MetacriticBadge({ score, size = "md", showLabel = false }: MetacriticBadgeProps) {
  if (!score) {
    return (
      <div className={clsx(
        "flex items-center justify-center border border-slate-700 text-slate-600 font-bold",
        sizeStyles[size].box
      )}
        style={{ background: "rgba(30,30,50,0.6)" }}>
        tbd
      </div>
    );
  }

  const { bg, text, label, glow } = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        whileHover={{ scale: 1.08 }}
        className={clsx("flex items-center justify-center border-2", sizeStyles[size].box)}
        style={{
          background: bg,
          color: text,
          borderColor: bg,
          boxShadow: `0 0 16px ${glow}`,
        }}
      >
        {score}
      </motion.div>
      {showLabel && (
        <span className={clsx("text-slate-400 font-medium", sizeStyles[size].label)}>
          {label}
        </span>
      )}
    </div>
  );
}

/* ── Inline score bar ── */
export function MetacriticBar({ score }: { score: number | null }) {
  if (!score) return null;
  const { bg, label } = getScoreColor(score);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 font-medium w-20 flex-shrink-0">Metacritic</span>
      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: bg }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color: bg }}>{score}</span>
      <span className="text-xs text-slate-600 w-14">{label}</span>
    </div>
  );
}

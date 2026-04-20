"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { ReactNode } from "react";

type BadgeVariant = "purple" | "cyan" | "pink" | "green" | "amber" | "red" | "slate";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pulse?: boolean;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  purple: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  cyan:   "bg-cyan-500/15   text-cyan-300   border-cyan-500/30",
  pink:   "bg-pink-500/15   text-pink-300   border-pink-500/30",
  green:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber:  "bg-amber-500/15  text-amber-300  border-amber-500/30",
  red:    "bg-red-500/15    text-red-300    border-red-500/30",
  slate:  "bg-slate-500/15  text-slate-300  border-slate-500/30",
};

const dotColors: Record<BadgeVariant, string> = {
  purple: "bg-violet-400",
  cyan:   "bg-cyan-400",
  pink:   "bg-pink-400",
  green:  "bg-emerald-400",
  amber:  "bg-amber-400",
  red:    "bg-red-400",
  slate:  "bg-slate-400",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs rounded-md",
  md: "px-2.5 py-1 text-xs rounded-lg",
  lg: "px-3 py-1.5 text-sm rounded-lg",
};

export default function Badge({
  variant = "purple",
  size = "md",
  pulse = false,
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            dotColors[variant],
            pulse && "animate-pulse"
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ── Animated badge with glow ── */
export function GlowBadge({
  children,
  variant = "purple",
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <motion.span
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={clsx(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm border",
        variantStyles[variant]
      )}
    >
      {children}
    </motion.span>
  );
}

"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarVariant = "circle" | "rounded";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  glow?: boolean;
  glowColor?: "purple" | "cyan" | "pink";
  status?: "online" | "offline" | "away";
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

const statusDotSize: Record<AvatarSize, string> = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const glowStyles = {
  purple: "shadow-[0_0_20px_rgba(124,58,237,0.5)]",
  cyan:   "shadow-[0_0_20px_rgba(6,182,212,0.5)]",
  pink:   "shadow-[0_0_20px_rgba(236,72,153,0.5)]",
};

const statusColors = {
  online:  "bg-emerald-400",
  offline: "bg-slate-500",
  away:    "bg-amber-400",
};

export default function Avatar({
  src,
  alt = "Avatar",
  fallback,
  size = "md",
  variant = "circle",
  glow = false,
  glowColor = "purple",
  status,
  className,
}: AvatarProps) {
  const initials = fallback
    ? fallback.slice(0, 2).toUpperCase()
    : alt.slice(0, 2).toUpperCase();

  return (
    <div className="relative inline-flex flex-shrink-0">
      <motion.div
        whileHover={glow ? { scale: 1.05 } : {}}
        className={clsx(
          "flex items-center justify-center overflow-hidden",
          "bg-gradient-to-br from-violet-600 to-cyan-500",
          "font-bold text-white",
          sizeStyles[size],
          variant === "circle" ? "rounded-full" : "rounded-xl",
          glow && glowStyles[glowColor],
          className
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </motion.div>

      {status && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 rounded-full border-2 border-[#0a0a0f]",
            statusDotSize[size],
            statusColors[status],
            status === "online" && "animate-pulse"
          )}
        />
      )}
    </div>
  );
}

/* ── Avatar Group ── */
export function AvatarGroup({
  avatars,
  max = 4,
  size = "sm",
}: {
  avatars: { src?: string; alt: string; fallback?: string }[];
  max?: number;
  size?: AvatarSize;
}) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((a, i) => (
        <div key={i} className="ring-2 ring-[#0a0a0f] rounded-full">
          <Avatar src={a.src} alt={a.alt} fallback={a.fallback} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            "flex items-center justify-center rounded-full ring-2 ring-[#0a0a0f]",
            "bg-slate-800 text-slate-300 font-semibold text-xs",
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

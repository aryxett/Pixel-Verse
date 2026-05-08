"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { ReactNode } from "react";

type CardVariant = "default" | "glow" | "bordered" | "solid" | "neon";
type GlowColor = "purple" | "cyan" | "pink" | "green" | "amber";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: CardVariant;
  glowColor?: GlowColor;
  hover?: boolean;
  animate?: boolean;
  delay?: number;
  padding?: "none" | "sm" | "md" | "lg";
  children?: ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "bg-[#1a1a2e]/80 backdrop-blur-xl border border-violet-900/20",
  glow:
    "bg-[#1a1a2e]/80 backdrop-blur-xl border border-violet-500/30",
  bordered:
    "bg-[#12121a]/60 backdrop-blur-xl border border-slate-700/50",
  solid:
    "bg-[#1a1a2e] border border-slate-800",
  neon:
    "bg-[#0d0d1a]/90 backdrop-blur-xl border border-violet-500/50",
};

const glowHoverStyles: Record<GlowColor, string> = {
  purple: "hover:border-violet-500/60 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]",
  cyan:   "hover:border-cyan-500/60   hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]",
  pink:   "hover:border-pink-500/60   hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]",
  green:  "hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  amber:  "hover:border-amber-500/60  hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
};

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "default",
  glowColor = "purple",
  hover = true,
  animate = true,
  delay = 0,
  padding = "md",
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      className={clsx(
        "rounded-2xl transition-all duration-300",
        variantStyles[variant],
        hover && glowHoverStyles[glowColor],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ── Sub-components ── */

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mb-4 pb-4 border-b border-slate-700/50", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx("text-lg font-bold text-slate-100", className)}>
      {children}
    </h3>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("text-slate-400 text-sm leading-relaxed", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mt-4 pt-4 border-t border-slate-700/50 flex items-center gap-3", className)}>
      {children}
    </div>
  );
}

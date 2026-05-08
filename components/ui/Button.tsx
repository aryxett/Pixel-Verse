"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "cyan" | "pink";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  glow?: boolean;
  children?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/50 shadow-lg shadow-violet-900/40",
  secondary:
    "bg-transparent hover:bg-violet-600/10 text-violet-300 border border-violet-500/40 hover:border-violet-400",
  ghost:
    "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent hover:border-slate-700",
  danger:
    "bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 hover:border-red-400",
  cyan:
    "bg-cyan-600/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-900/30",
  pink:
    "bg-pink-600/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 hover:border-pink-400 shadow-lg shadow-pink-900/30",
};

const glowStyles: Record<ButtonVariant, string> = {
  primary: "hover:shadow-violet-500/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]",
  secondary: "hover:shadow-violet-500/30 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]",
  ghost: "",
  danger: "hover:shadow-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  cyan: "hover:shadow-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
  pink: "hover:shadow-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-7 py-3.5 text-base rounded-xl gap-2.5",
  xl: "px-9 py-4 text-lg rounded-2xl gap-3",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  glow = true,
  children,
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.03 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      disabled={disabled || loading}
      className={clsx(
        "relative inline-flex items-center justify-center font-semibold",
        "transition-all duration-200 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50",
        variantStyles[variant],
        glow && glowStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {/* Shimmer effect on primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        </span>
      )}

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
}

"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { ReactNode, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputVariant = "default" | "glow" | "minimal";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  variant?: InputVariant;
  glowColor?: "purple" | "cyan" | "pink";
}

const glowFocus: Record<string, string> = {
  purple: "focus:border-violet-500/70 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]",
  cyan:   "focus:border-cyan-500/70   focus:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]",
  pink:   "focus:border-pink-500/70   focus:shadow-[0_0_0_3px_rgba(236,72,153,0.15)]",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      icon,
      iconRight,
      variant = "default",
      glowColor = "purple",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full bg-slate-900/60 border rounded-xl text-slate-200 placeholder-slate-500",
              "transition-all duration-200 outline-none",
              "py-3 text-sm",
              icon ? "pl-10" : "pl-4",
              iconRight ? "pr-10" : "pr-4",
              error
                ? "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : clsx("border-slate-700/60", glowFocus[glowColor]),
              className
            )}
            {...props}
          />
          {iconRight && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500">
              {iconRight}
            </div>
          )}
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            ⚠ {error}
          </motion.p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-500">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ── Textarea ── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  glowColor?: "purple" | "cyan" | "pink";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, glowColor = "purple", className, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-300">{label}</label>
        )}
        <textarea
          ref={ref}
          className={clsx(
            "w-full bg-slate-900/60 border rounded-xl text-slate-200 placeholder-slate-500",
            "transition-all duration-200 outline-none resize-none",
            "px-4 py-3 text-sm",
            error
              ? "border-red-500/50 focus:border-red-500"
              : clsx("border-slate-700/60", glowFocus[glowColor]),
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/* ── Select ── */
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  glowColor?: "purple" | "cyan" | "pink";
}

export function Select({ label, options, glowColor = "purple", className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <select
        className={clsx(
          "w-full bg-slate-900/60 border rounded-xl text-slate-200",
          "transition-all duration-200 outline-none",
          "px-4 py-3 text-sm appearance-none cursor-pointer",
          "border-slate-700/60",
          glowFocus[glowColor],
          className
        )}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Need React import for Select
import React from "react";

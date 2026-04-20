"use client";

import { clsx } from "clsx";
import { ReactNode } from "react";

interface DividerProps {
  label?: ReactNode;
  color?: "default" | "purple" | "cyan";
  className?: string;
}

export default function Divider({ label, color = "default", className }: DividerProps) {
  const lineColor = {
    default: "border-slate-800",
    purple:  "border-violet-900/50",
    cyan:    "border-cyan-900/50",
  }[color];

  if (!label) {
    return <hr className={clsx("border-t", lineColor, className)} />;
  }

  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <div className={clsx("flex-1 border-t", lineColor)} />
      <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{label}</span>
      <div className={clsx("flex-1 border-t", lineColor)} />
    </div>
  );
}

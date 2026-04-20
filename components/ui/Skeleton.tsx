"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  variant?: "line" | "circle" | "rect";
  width?: string;
  height?: string;
  lines?: number;
}

export default function Skeleton({
  className,
  variant = "rect",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  if (variant === "line" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              "animate-pulse rounded-md bg-slate-800",
              i === lines - 1 ? "w-3/4" : "w-full",
              "h-4"
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "animate-pulse bg-slate-800",
        variant === "circle" ? "rounded-full" : "rounded-xl",
        className
      )}
      style={{ width, height }}
    />
  );
}

/* ── Card Skeleton ── */
export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-2/3" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
          <div className="h-5 w-16 bg-slate-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ── Profile Skeleton ── */
export function ProfileSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-800 rounded w-full" />
        <div className="h-3 bg-slate-800 rounded w-5/6" />
        <div className="h-3 bg-slate-800 rounded w-4/6" />
      </div>
    </div>
  );
}

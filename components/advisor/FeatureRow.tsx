"use client";
import React, { useRef } from "react";
import { gsap } from "../../lib/gsapSetup";
import { Lock, Brain, Zap, Gamepad2, LucideIcon } from "lucide-react";

const ACCENT_MAP: Record<string, { border: string; icon: string; glow: string }> = {
  violet: { border: "var(--border-accent)", icon: "var(--accent-400)", glow: "var(--shadow-rim-violet)" },
  ember:  { border: "rgba(251,146,60,0.35)", icon: "var(--ember-400)", glow: "var(--shadow-rim-ember)" },
  green:  { border: "rgba(74,222,128,0.35)", icon: "var(--score-green-400)", glow: "0 0 24px var(--score-green-glow)" },
  blue:   { border: "rgba(56,189,248,0.35)", icon: "var(--info-500)", glow: "0 0 24px rgba(56,189,248,0.3)" },
};

const ICON_MAP: Record<string, LucideIcon> = {
  Lock, Brain, Zap, Gamepad2
};

export default function FeatureRow({ iconName, title, description, accent }: { iconName: string, title: string, description: string, accent: string }) {
  const iconBoxRef = useRef<HTMLDivElement>(null);
  const theme = ACCENT_MAP[accent];
  const Icon = ICON_MAP[iconName];

  const handleEnter = () => {
    if(!iconBoxRef.current) return;
    gsap.to(iconBoxRef.current, {
      rotate: 8, scale: 1.08, borderColor: theme.border, boxShadow: theme.glow,
      duration: 0.4, ease: "snap",
    });
  }
  const handleLeave = () => {
    if(!iconBoxRef.current) return;
    gsap.to(iconBoxRef.current, {
      rotate: 0, scale: 1, borderColor: "var(--border-subtle)", boxShadow: "none",
      duration: 0.4, ease: "settle",
    });
  }

  return (
    <div className="feature-row" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <div ref={iconBoxRef} className="feature-row__icon-box" style={{ color: theme.icon }}>
        {Icon && <Icon size={20} strokeWidth={2} />}
      </div>
      <div>
        <h4 className="feature-row__title">{title}</h4>
        <p className="feature-row__desc">{description}</p>
      </div>
    </div>
  );
}

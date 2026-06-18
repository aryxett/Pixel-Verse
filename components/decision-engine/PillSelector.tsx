"use client";
import React, { useRef } from "react";
import { gsap } from "../../lib/gsapSetup";
import { Coffee, Swords, Trophy, Compass, Palette, Users, Ghost, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Coffee, Swords, Trophy, Compass, Palette, Users, Ghost
};

export default function PillSelector({ label, iconName, isActive, onClick }: { label: string, iconName?: string, isActive: boolean, onClick: () => void }) {
  const pillRef = useRef<HTMLButtonElement>(null);
  
  const handleEnter = () => {
    if (!pillRef.current || isActive) return;
    gsap.to(pillRef.current, { scale: 1.05, duration: 0.3, ease: "snap" });
  };
  const handleLeave = () => {
    if (!pillRef.current || isActive) return;
    gsap.to(pillRef.current, { scale: 1, duration: 0.3, ease: "settle" });
  };

  const Icon = iconName ? ICON_MAP[iconName] : null;

  return (
    <button
      ref={pillRef}
      className={`pill-selector ${isActive ? "pill-selector--active" : ""}`}
      onClick={() => {
        gsap.fromTo(pillRef.current, { scale: 0.95 }, { scale: 1, duration: 0.4, ease: "signature" });
        onClick();
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}

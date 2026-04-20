"use client";

/**
 * Icon wrapper that suppresses hydration warnings on SVG elements.
 * Dark Reader browser extension injects `data-darkreader-inline-stroke`
 * and `style` attributes into SVGs, causing React hydration mismatches.
 * Wrapping icons in this component silences those warnings.
 */

import { type LucideIcon } from "lucide-react";

interface IconProps {
  icon: LucideIcon;
  className?: string;
}

export default function Icon({ icon: LucideIconComponent, className }: IconProps) {
  return (
    <span suppressHydrationWarning style={{ display: "contents" }}>
      <LucideIconComponent className={className} suppressHydrationWarning />
    </span>
  );
}

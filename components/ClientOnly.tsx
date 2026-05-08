"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * Renders children only on the client side.
 * Prevents hydration mismatches caused by browser extensions
 * (Dark Reader, etc.) that inject attributes into the DOM before React hydrates.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}

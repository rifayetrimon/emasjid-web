"use client";

// Thin client wrapper around the themed template root. Owns the inline
// CSS-variable style attribute so the live preview overlay can merge in
// updates from postMessage without touching the rest of TemplateLayout.

import type { CSSProperties, ReactNode } from "react";
import { useOverlaidCssVars } from "@/lib/previewOverlay";

export default function ThemedShell({
  cssVars,
  bgClass,
  children,
}: {
  cssVars: CSSProperties;
  bgClass: string;
  children: ReactNode;
}) {
  const merged = useOverlaidCssVars(cssVars);
  return (
    <div style={merged} className={`${bgClass} min-h-screen flex flex-col`}>
      {children}
    </div>
  );
}

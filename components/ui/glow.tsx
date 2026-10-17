import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface GlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Rotating indigo/violet/cyan halo behind a call to action.
 * Pure CSS, so it works in Server Components and stops for reduced motion.
 */
export function Glow({ children, className }: GlowProps) {
  return (
    <span className={cn("group/glow relative isolate inline-flex rounded-lg", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[3px] -z-10 overflow-hidden rounded-[inherit] opacity-60 blur-md transition-opacity duration-500 group-hover/glow:opacity-100"
      >
        <span className="absolute top-1/2 left-1/2 aspect-square w-[max(220%,16rem)] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,var(--indigo),var(--violet),var(--cyan),var(--indigo))] motion-safe:animate-orbit" />
      </span>
      {children}
    </span>
  );
}

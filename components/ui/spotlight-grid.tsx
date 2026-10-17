"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SpotlightGridProps {
  children: ReactNode;
  className?: string;
  gridClassName?: string;
}

/**
 * A hairline matrix whose lines light up around the cursor.
 * Cells sit on a 1px gap; a radial gradient behind them shows through the gaps,
 * and each `[data-spotlight-cell]` receives local coordinates for its own inner glow.
 */
export function SpotlightGrid({ children, className, gridClassName }: SpotlightGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const root = rootRef.current;
    if (!root) return;

    const { clientX, clientY } = event;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const bounds = root.getBoundingClientRect();
      root.style.setProperty("--spot-x", `${clientX - bounds.left}px`);
      root.style.setProperty("--spot-y", `${clientY - bounds.top}px`);

      root.querySelectorAll<HTMLElement>("[data-spotlight-cell]").forEach((cell) => {
        const cellBounds = cell.getBoundingClientRect();
        cell.style.setProperty("--cell-x", `${clientX - cellBounds.left}px`);
        cell.style.setProperty("--cell-y", `${clientY - cellBounds.top}px`);
      });
    });
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      className={cn("group/spotlight relative isolate overflow-hidden rounded-2xl bg-border p-px", className)}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--spot-edge), var(--spot-edge-far) 40%, transparent 70%)",
        }}
      />
      <div className={cn("grid gap-px overflow-hidden rounded-[15px]", gridClassName)}>{children}</div>
    </div>
  );
}

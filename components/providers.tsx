"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** Motion honours the visitor's reduced-motion setting everywhere below this point. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

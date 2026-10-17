"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { TimelinePhase } from "@/lib/data/deployment";

const FRAME_BUDGET_MS = 32;

/**
 * Drives the scripted deployment. `elapsed` is milliseconds of animation time;
 * state updates are throttled to ~30fps, which is plenty for counters.
 */
export function useDeployTimeline(duration: number) {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<TimelinePhase>("queued");
  const frameRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const run = useCallback(
    ({ instant = false }: { instant?: boolean } = {}) => {
      cancel();

      if (instant) {
        setElapsed(duration);
        setPhase("done");
        return;
      }

      setElapsed(0);
      setPhase("running");

      let startedAt: number | null = null;
      let lastCommit = Number.NEGATIVE_INFINITY;

      const tick = (now: number) => {
        startedAt ??= now;
        const time = Math.min(now - startedAt, duration);

        if (time - lastCommit >= FRAME_BUDGET_MS || time === duration) {
          lastCommit = time;
          setElapsed(time);
        }

        if (time < duration) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          frameRef.current = null;
          setPhase("done");
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    },
    [cancel, duration],
  );

  useEffect(() => cancel, [cancel]);

  return { elapsed, phase, run };
}

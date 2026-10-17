"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyState = "idle" | "copied" | "selected";

/**
 * Copies text and reports what happened. When the Clipboard API is refused
 * (insecure origin, sandboxed frame), it selects `fallbackNode` so the user can copy by hand.
 */
export function useCopyToClipboard(resetAfterMs = 1800) {
  const [state, setState] = useState<CopyState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const copy = useCallback(
    async (text: string, fallbackNode?: HTMLElement | null) => {
      clearTimeout(timerRef.current);
      let next: CopyState = "copied";

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        next = "selected";
        if (fallbackNode) {
          const range = document.createRange();
          range.selectNodeContents(fallbackNode);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }

      setState(next);
      timerRef.current = setTimeout(() => setState("idle"), resetAfterMs);
    },
    [resetAfterMs],
  );

  return { state, copy };
}

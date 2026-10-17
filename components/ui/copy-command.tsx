"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, TextSelect } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useCopyToClipboard, type CopyState } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

const iconMotion = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.6 },
  transition: { duration: 0.16 },
};

const announcements: Record<CopyState, string> = {
  idle: "",
  copied: "Command copied to clipboard",
  selected: "Command selected. Press Control or Command plus C to copy it.",
};

/** Ghost button that shows a shell command and copies it. */
export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const textRef = useRef<HTMLSpanElement>(null);
  const { state, copy } = useCopyToClipboard();

  return (
    <>
      <button
        type="button"
        onClick={() => copy(command, textRef.current)}
        aria-label={`Copy command: ${command}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "gap-3 font-mono text-[14px]",
          className,
        )}
      >
        <span aria-hidden="true" className="text-subtle-foreground select-none">
          $
        </span>
        <span ref={textRef}>{command}</span>
        <span className="relative ml-1 inline-flex size-4 items-center justify-center text-muted-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            {state === "copied" ? (
              <motion.span key="copied" {...iconMotion} className="inline-flex text-live">
                <Check />
              </motion.span>
            ) : state === "selected" ? (
              <motion.span key="selected" {...iconMotion} className="inline-flex">
                <TextSelect />
              </motion.span>
            ) : (
              <motion.span key="idle" {...iconMotion} className="inline-flex">
                <Copy />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
      <span className="sr-only" aria-live="polite">
        {announcements[state]}
      </span>
    </>
  );
}

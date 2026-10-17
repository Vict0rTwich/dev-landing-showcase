"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label: string;
  className?: string;
}

/** Compact icon button with a generous hit area, for copying values inside dense UI. */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard(1600);
  const copied = state === "copied";

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center rounded-md text-subtle-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
        "after:absolute after:-inset-2.5 after:content-['']",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "copied" : "idle"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className={cn("inline-flex", copied && "text-live")}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

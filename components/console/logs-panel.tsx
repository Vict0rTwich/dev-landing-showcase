"use client";

import { useEffect, useRef } from "react";

import { deployment, logLines, type LogLevel, type TimelinePhase } from "@/lib/data/deployment";
import { cn } from "@/lib/utils";

const levelStyles: Record<LogLevel, string> = {
  info: "text-muted-foreground",
  success: "text-live",
  warn: "text-warn",
};

const levelPrefix: Record<LogLevel, string> = {
  info: "",
  success: "",
  warn: "warn ",
};

export function LogsPanel({ elapsed, phase }: { elapsed: number; phase: TimelinePhase }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const followRef = useRef(true);
  const visible = phase === "queued" ? [] : logLines.filter((line) => line.at <= elapsed);

  // Keep the newest line in view unless the reader has scrolled up.
  useEffect(() => {
    const node = scrollRef.current;
    if (node && followRef.current) node.scrollTop = node.scrollHeight;
  }, [visible.length]);

  function handleScroll() {
    const node = scrollRef.current;
    if (!node) return;
    followRef.current = node.scrollHeight - node.scrollTop - node.clientHeight < 24;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5 sm:px-6">
        <p className="font-mono text-[12px] text-subtle-foreground">
          build {deployment.commit.sha} · {deployment.environment.toLowerCase()}
        </p>
        <p className="font-mono text-[12px] text-subtle-foreground tabular-nums">
          {visible.length}/{logLines.length} lines
        </p>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        role="region"
        aria-label="Build logs"
        tabIndex={0}
        className="h-[22rem] scrollbar-thin overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-6 focus-visible:outline-offset-[-2px] sm:px-6 md:h-auto md:flex-1"
      >
        {phase === "queued" ? (
          <p className="text-subtle-foreground">
            Waiting for a build runner
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-subtle-foreground/70 motion-safe:animate-caret"
            />
          </p>
        ) : (
          <ol>
            {visible.map((line) => (
              <li key={line.at} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4">
                <time className="text-subtle-foreground select-none">{line.time}</time>
                <span className={cn("break-words", levelStyles[line.level])}>
                  {levelPrefix[line.level] && <span className="font-medium">{levelPrefix[line.level]}</span>}
                  {line.text}
                </span>
              </li>
            ))}
            {phase === "running" && (
              <li aria-hidden="true" className="pt-1">
                <span className="inline-block h-4 w-2 bg-indigo-soft/80 motion-safe:animate-caret" />
              </li>
            )}
          </ol>
        )}
      </div>
    </div>
  );
}

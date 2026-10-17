"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, CircleDashed, LoaderCircle, RotateCw } from "lucide-react";

import { AnalyticsPanel } from "@/components/console/analytics-panel";
import { DeploymentPanel } from "@/components/console/deployment-panel";
import { LogsPanel } from "@/components/console/logs-panel";
import { useDeployTimeline } from "@/components/console/use-deploy-timeline";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import {
  TIMELINE_END,
  TOTAL_REGIONS,
  countLiveRegions,
  deployment,
  getDeployStatus,
  getElapsedSeconds,
  type DeployStatusKind,
} from "@/lib/data/deployment";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "deployment", label: "Deployment" },
  { id: "logs", label: "Logs" },
  { id: "analytics", label: "Analytics" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const statusCopy: Record<DeployStatusKind, string> = {
  queued: "Queued",
  building: "Building",
  deploying: "Deploying",
  ready: "Ready",
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DeployConsole() {
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});
  const autoRunRef = useRef(false);
  const baseId = useId();
  const [tab, setTab] = useState<TabId>("deployment");
  const { elapsed, phase, run } = useDeployTimeline(TIMELINE_END);

  const status = getDeployStatus(elapsed, phase);
  const seconds = getElapsedSeconds(elapsed, phase);
  const liveRegions = countLiveRegions(elapsed, phase);

  // Play the deployment once, the first time the console is mostly on screen.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || autoRunRef.current) return;
        autoRunRef.current = true;
        observer.disconnect();
        run({ instant: prefersReducedMotion() });
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [run]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    const nextId = tabs[next].id;
    setTab(nextId);
    tabRefs.current[nextId]?.focus();
  }

  const redeploy = () => {
    autoRunRef.current = true;
    run({ instant: prefersReducedMotion() });
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Light spill beneath the window */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-16 -bottom-10 -z-10 opacity-80 blur-2xl"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 40%, var(--glow-indigo), transparent 70%), radial-gradient(35% 40% at 85% 75%, var(--glow-cyan), transparent 70%)",
        }}
      />

      <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-surface/85 shadow-[0_50px_120px_-40px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.05)] backdrop-blur-md">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
        />

        {/* Window chrome */}
        <div className="flex h-12 items-center gap-3 border-b border-border px-3 sm:px-4">
          <div aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
          </div>
          <p className="ml-1 flex min-w-0 items-center gap-1.5 text-[13px]">
            <span className="hidden text-muted-foreground sm:inline">{deployment.team}</span>
            <span aria-hidden="true" className="hidden text-subtle-foreground sm:inline">
              /
            </span>
            <span className="truncate font-medium text-foreground">{deployment.project}</span>
            <Badge tone="accent" className="ml-1.5">
              {deployment.environment}
            </Badge>
          </p>
          <button
            type="button"
            onClick={redeploy}
            disabled={phase === "running"}
            className="relative ml-auto inline-flex h-8 items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 text-[13px] text-muted-foreground transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:bg-white/[0.09] hover:text-foreground disabled:cursor-progress disabled:opacity-60"
          >
            <RotateCw
              className={cn("size-3.5", phase === "running" && "motion-safe:animate-spin")}
              aria-hidden="true"
            />
            <span>Redeploy</span>
          </button>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Deployment views"
          className="flex gap-1 border-b border-border px-1.5 sm:px-2.5"
        >
          {tabs.map((item, index) => {
            const selected = item.id === tab;
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[item.id] = node;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTab(item.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={cn(
                  "relative h-11 shrink-0 rounded-t-md px-3 text-[13px] font-medium transition-colors focus-visible:outline-offset-[-2px]",
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {selected && (
                  <motion.span
                    layoutId={`${baseId}-tab-indicator`}
                    className="absolute inset-x-2 -bottom-px h-px bg-foreground"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Panels */}
        <div className="relative md:h-[27rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              role="tabpanel"
              id={`${baseId}-panel-${tab}`}
              aria-labelledby={`${baseId}-tab-${tab}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="h-full"
            >
              {tab === "deployment" && <DeploymentPanel elapsed={elapsed} phase={phase} />}
              {tab === "logs" && <LogsPanel elapsed={elapsed} phase={phase} />}
              {tab === "analytics" && <AnalyticsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status bar */}
        <div className="flex min-h-12 items-center gap-3 border-t border-border px-3 py-2.5 text-[13px] sm:gap-4 sm:px-4">
          <StatusChip status={status} />
          <div className="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-[12px]">
            <span
              className={cn("truncate", status === "ready" ? "text-foreground" : "text-subtle-foreground")}
            >
              {deployment.url}
            </span>
            {status === "ready" && (
              <CopyButton value={`https://${deployment.url}`} label="Copy deployment URL" />
            )}
          </div>
          <span className="hidden font-mono text-[12px] text-muted-foreground tabular-nums sm:inline">
            {status === "deploying" ? `${liveRegions}/${TOTAL_REGIONS} regions · ` : ""}
            {seconds.toFixed(1)}s
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ status }: { status: DeployStatusKind }) {
  const Icon = status === "ready" ? CircleCheck : status === "queued" ? CircleDashed : LoaderCircle;
  const spinning = status === "building" || status === "deploying";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium ring-1 ring-inset",
        status === "ready" && "bg-live/10 text-live ring-live/25",
        status === "queued" && "bg-white/[0.04] text-muted-foreground ring-border",
        spinning && "bg-indigo/15 text-indigo-light ring-indigo/35",
      )}
    >
      <Icon aria-hidden="true" className={cn("size-3.5", spinning && "motion-safe:animate-spin")} />
      <span aria-live="polite">{statusCopy[status]}</span>
    </span>
  );
}

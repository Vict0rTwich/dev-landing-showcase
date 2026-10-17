"use client";

import { AnimatePresence, motion } from "motion/react";
import { Circle, CircleCheck, GitBranch, GitCommitHorizontal, LoaderCircle } from "lucide-react";

import {
  TOTAL_REGIONS,
  countLiveRegions,
  deployment,
  getRegionState,
  getStepSeconds,
  getStepState,
  pipeline,
  regionGroups,
  type EdgeRegion,
  type PipelineStep,
  type RegionState,
  type StepState,
  type TimelinePhase,
} from "@/lib/data/deployment";
import { cn } from "@/lib/utils";

interface PanelProps {
  elapsed: number;
  phase: TimelinePhase;
}

export function DeploymentPanel({ elapsed, phase }: PanelProps) {
  const liveRegions = countLiveRegions(elapsed, phase);

  return (
    <div className="grid h-full md:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
      <div className="min-w-0 p-4 sm:p-6">
        <CommitSummary />
        <ol aria-label="Pipeline" className="mt-4">
          {pipeline.map((step, index) => (
            <PipelineRow
              key={step.id}
              step={step}
              state={getStepState(step, elapsed, phase)}
              seconds={getStepSeconds(step, elapsed)}
              isLast={index === pipeline.length - 1}
            />
          ))}
        </ol>
      </div>

      <div className="min-w-0 border-t border-border p-4 sm:p-6 md:border-t-0 md:border-l">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-sm font-medium text-foreground">Edge rollout</h3>
          <p className="font-mono text-[12px] text-muted-foreground tabular-nums">
            <span className="text-foreground">{liveRegions}</span>/{TOTAL_REGIONS} regions live
          </p>
        </div>
        <div
          role="progressbar"
          aria-label="Regions live"
          aria-valuemin={0}
          aria-valuemax={TOTAL_REGIONS}
          aria-valuenow={liveRegions}
          className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]"
        >
          <div
            className="h-full origin-left rounded-full bg-[linear-gradient(90deg,var(--indigo),var(--cyan))] transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${liveRegions / TOTAL_REGIONS})` }}
          />
        </div>

        <div className="mt-5 space-y-4">
          {regionGroups.map((group) => (
            <div key={group.name}>
              <h4 className="type-label text-subtle-foreground">{group.name}</h4>
              <ul className="mt-2 grid grid-cols-4 gap-1.5 sm:gap-2">
                {group.regions.map((region) => (
                  <RegionChip
                    key={region.code}
                    region={region}
                    state={getRegionState(region, elapsed, phase)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommitSummary() {
  const { commit } = deployment;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] p-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--indigo),var(--violet))] text-[12px] font-semibold text-white"
      >
        {commit.initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{commit.message}</p>
        <p className="mt-0.5 flex items-center gap-3 font-mono text-[12px] text-subtle-foreground">
          <span className="inline-flex items-center gap-1">
            <GitBranch aria-hidden="true" className="size-3.5" />
            {commit.branch}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitCommitHorizontal aria-hidden="true" className="size-3.5" />
            {commit.sha}
          </span>
          <span className="hidden truncate sm:inline">pushed by {commit.author}</span>
        </p>
      </div>
    </div>
  );
}

function PipelineRow({
  step,
  state,
  seconds,
  isLast,
}: {
  step: PipelineStep;
  state: StepState;
  seconds: number;
  isLast: boolean;
}) {
  return (
    <li className="relative flex gap-3.5 py-2">
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-[2.125rem] bottom-[-0.375rem] left-[11px] w-px bg-border"
        >
          <span
            className="block h-full w-full origin-top bg-live/50 transition-transform duration-300 ease-out"
            style={{ transform: `scaleY(${state === "done" ? 1 : 0})` }}
          />
        </span>
      )}

      <span className="relative mt-px flex size-6 shrink-0 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={state}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.45, duration: 0.4 }}
            className="inline-flex"
          >
            {state === "done" ? (
              <CircleCheck className="size-[18px] text-live" aria-hidden="true" />
            ) : state === "running" ? (
              <LoaderCircle
                className="size-[18px] text-indigo-soft motion-safe:animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Circle className="size-[18px] text-subtle-foreground/50" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium",
            state === "queued" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {step.label}
          <span className="sr-only">
            {state === "done" ? ", complete" : state === "running" ? ", in progress" : ", queued"}
          </span>
        </p>
        <p className="truncate text-[13px] text-subtle-foreground">{step.detail}</p>
      </div>

      <span className="mt-0.5 font-mono text-[12px] text-muted-foreground tabular-nums">
        {state === "queued" ? "—" : `${seconds.toFixed(1)}s`}
      </span>
    </li>
  );
}

const regionStyles: Record<RegionState, string> = {
  pending: "border-border bg-white/[0.015]",
  syncing: "border-cyan/40 bg-cyan/[0.07]",
  live: "border-live/25 bg-live/[0.06]",
};

function RegionChip({ region, state }: { region: EdgeRegion; state: RegionState }) {
  return (
    <li
      title={`${region.city}: ${state === "live" ? `${region.latency} ms` : state}`}
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-md border px-2 py-1.5 transition-colors duration-300",
        regionStyles[state],
      )}
    >
      <span className="flex items-center justify-between gap-1">
        <span
          className={cn(
            "font-mono text-[12px] font-medium tracking-wide",
            state === "pending" ? "text-subtle-foreground" : "text-foreground",
          )}
        >
          {region.code}
        </span>
        <RegionDot state={state} />
      </span>
      <span className="truncate font-mono text-[11px] text-muted-foreground tabular-nums">
        {state === "live" ? `${region.latency} ms` : state === "syncing" ? "syncing" : "—"}
      </span>
      <span className="sr-only">
        {region.city}, {state}
      </span>
    </li>
  );
}

function RegionDot({ state }: { state: RegionState }) {
  if (state === "pending") {
    return <span aria-hidden="true" className="size-1.5 rounded-full ring-1 ring-subtle-foreground/50" />;
  }

  return (
    <span aria-hidden="true" className="relative flex size-1.5">
      {state === "syncing" && (
        <span className="absolute inset-0 rounded-full bg-cyan motion-safe:animate-ping-slow" />
      )}
      <motion.span
        key={state}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.45 }}
        className={cn(
          "relative size-1.5 rounded-full",
          state === "live" ? "bg-live shadow-[0_0_8px_rgb(52_211_153/0.8)]" : "bg-cyan",
        )}
      />
    </span>
  );
}

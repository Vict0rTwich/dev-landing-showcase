/**
 * Scripted deployment shown in the hero console. Animation time is compressed:
 * `start`/`end` are milliseconds on screen, `seconds` is the build time the UI reports.
 */

export type TimelinePhase = "queued" | "running" | "done";

export const deployment = {
  team: "acme",
  project: "storefront",
  environment: "Production",
  url: "storefront-a3f9c21.volans.app",
  commit: {
    message: "feat(checkout): stream cart totals from the edge",
    sha: "a3f9c21",
    branch: "main",
    author: "mira",
    initials: "MK",
  },
} as const;

export type StepState = "queued" | "running" | "done";

export interface PipelineStep {
  id: string;
  label: string;
  detail: string;
  start: number;
  end: number;
  seconds: number;
}

export const pipeline: PipelineStep[] = [
  {
    id: "clone",
    label: "Clone repository",
    detail: "github.com/acme/storefront",
    start: 0,
    end: 600,
    seconds: 1.2,
  },
  {
    id: "install",
    label: "Install dependencies",
    detail: "1,284 packages · 94% cache hit",
    start: 600,
    end: 1700,
    seconds: 6.8,
  },
  {
    id: "build",
    label: "Build application",
    detail: "Next.js 16 · 212 routes",
    start: 1700,
    end: 3600,
    seconds: 14.3,
  },
  {
    id: "checks",
    label: "Run checks",
    detail: "82 tests · 0 type errors",
    start: 3600,
    end: 4500,
    seconds: 4.1,
  },
  {
    id: "edge",
    label: "Deploy to edge",
    detail: "1,904 assets · 18 edge functions",
    start: 4500,
    end: 6600,
    seconds: 9.6,
  },
];

export const TIMELINE_END = 6600;
const EDGE_START = 4500;

export function getStepState(step: PipelineStep, elapsed: number, phase: TimelinePhase): StepState {
  if (phase === "queued") return "queued";
  if (elapsed >= step.end) return "done";
  if (elapsed >= step.start) return "running";
  return "queued";
}

export function getStepSeconds(step: PipelineStep, elapsed: number): number {
  if (elapsed <= step.start) return 0;
  if (elapsed >= step.end) return step.seconds;
  return ((elapsed - step.start) / (step.end - step.start)) * step.seconds;
}

export function getElapsedSeconds(elapsed: number, phase: TimelinePhase): number {
  if (phase === "queued") return 0;
  return pipeline.reduce((total, step) => total + getStepSeconds(step, elapsed), 0);
}

/* Edge regions, named by the IATA code of the nearest airport. */

export type RegionState = "pending" | "syncing" | "live";

export interface EdgeRegion {
  code: string;
  city: string;
  latency: number;
  liveAt: number;
}

export const regionGroups: { name: string; regions: EdgeRegion[] }[] = [
  {
    name: "Americas",
    regions: [
      { code: "IAD", city: "Washington, D.C.", latency: 9, liveAt: 4650 },
      { code: "SFO", city: "San Francisco", latency: 12, liveAt: 4900 },
      { code: "YYZ", city: "Toronto", latency: 14, liveAt: 4800 },
      { code: "GRU", city: "São Paulo", latency: 21, liveAt: 5450 },
    ],
  },
  {
    name: "Europe",
    regions: [
      { code: "LHR", city: "London", latency: 8, liveAt: 5000 },
      { code: "FRA", city: "Frankfurt", latency: 7, liveAt: 5080 },
      { code: "CDG", city: "Paris", latency: 9, liveAt: 5160 },
      { code: "ARN", city: "Stockholm", latency: 11, liveAt: 5300 },
    ],
  },
  {
    name: "Asia-Pacific",
    regions: [
      { code: "BOM", city: "Mumbai", latency: 18, liveAt: 5650 },
      { code: "SIN", city: "Singapore", latency: 10, liveAt: 5800 },
      { code: "NRT", city: "Tokyo", latency: 13, liveAt: 5950 },
      { code: "SYD", city: "Sydney", latency: 16, liveAt: 6150 },
    ],
  },
];

export const TOTAL_REGIONS = 34;

const visibleRegions = regionGroups.flatMap((group) => group.regions);

/* The 22 regions not drawn as chips still count toward the live total. */
const offscreenRegionTimes = Array.from(
  { length: TOTAL_REGIONS - visibleRegions.length },
  (_, index) => 4620 + Math.round(index * (1880 / 21)),
);

export function getRegionState(region: EdgeRegion, elapsed: number, phase: TimelinePhase): RegionState {
  if (phase === "queued" || elapsed < EDGE_START) return "pending";
  if (elapsed >= region.liveAt) return "live";
  if (elapsed >= region.liveAt - 280) return "syncing";
  return "pending";
}

export function countLiveRegions(elapsed: number, phase: TimelinePhase): number {
  if (phase === "queued") return 0;
  const visible = visibleRegions.filter((region) => elapsed >= region.liveAt).length;
  const offscreen = offscreenRegionTimes.filter((time) => elapsed >= time).length;
  return visible + offscreen;
}

export type DeployStatusKind = "queued" | "building" | "deploying" | "ready";

export function getDeployStatus(elapsed: number, phase: TimelinePhase): DeployStatusKind {
  if (phase === "queued") return "queued";
  if (phase === "done" || elapsed >= TIMELINE_END) return "ready";
  return elapsed >= EDGE_START ? "deploying" : "building";
}

/* Build log, streamed in sync with the pipeline. */

export type LogLevel = "info" | "success" | "warn";

export interface LogLine {
  at: number;
  time: string;
  level: LogLevel;
  text: string;
}

export const logLines: LogLine[] = [
  {
    at: 0,
    time: "14:02:07.104",
    level: "info",
    text: "Cloning github.com/acme/storefront (branch main, commit a3f9c21)",
  },
  { at: 540, time: "14:02:08.311", level: "info", text: "Cloned repository in 1.2s" },
  {
    at: 660,
    time: "14:02:08.402",
    level: "info",
    text: "Restored build cache from dpl_7Hq2Lr (94% hit)",
  },
  { at: 880, time: "14:02:09.018", level: "info", text: "Installing dependencies with pnpm 10" },
  { at: 1620, time: "14:02:15.226", level: "success", text: "Resolved 1,284 packages in 6.8s" },
  { at: 1760, time: "14:02:15.340", level: "info", text: "Running build: next build" },
  { at: 2380, time: "14:02:19.877", level: "info", text: "Compiled 212 routes" },
  {
    at: 2960,
    time: "14:02:24.513",
    level: "warn",
    text: "public/og/cart.png is 1.8 MB. Compress it to speed up first paint.",
  },
  { at: 3520, time: "14:02:29.602", level: "success", text: "Build completed in 14.3s" },
  {
    at: 3700,
    time: "14:02:29.750",
    level: "info",
    text: "Running checks: typecheck, unit, e2e smoke",
  },
  { at: 4420, time: "14:02:33.861", level: "success", text: "82 tests passed, 0 type errors" },
  {
    at: 4560,
    time: "14:02:34.012",
    level: "info",
    text: "Uploading 1,904 static assets and 18 edge functions",
  },
  { at: 5240, time: "14:02:38.447", level: "info", text: "Propagating to 34 edge regions" },
  {
    at: 6480,
    time: "14:02:43.170",
    level: "success",
    text: "Deployment ready in 36.0s at https://storefront-a3f9c21.volans.app",
  },
  {
    at: 6600,
    time: "14:02:43.204",
    level: "info",
    text: "Promoted to production. Instant rollback to dpl_6Fp1Xc is available.",
  },
];

/* Project analytics for the last 24 hours, in thousands of requests per hour. */

export interface Kpi {
  label: string;
  value: string;
  delta: string;
  trend: "good" | "neutral";
}

export const analytics = {
  kpis: [
    { label: "Requests, 24 h", value: "2.30M", delta: "+12.4%", trend: "good" },
    { label: "p95 latency", value: "41 ms", delta: "−8 ms", trend: "good" },
    { label: "Cache hit ratio", value: "96.8%", delta: "+1.2 pts", trend: "good" },
    { label: "Error rate", value: "0.02%", delta: "steady", trend: "neutral" },
  ] satisfies Kpi[],
  firstHour: 15,
  hourly: [
    121, 118, 122, 129, 136, 128, 112, 94, 76, 62, 55, 49, 46, 44, 47, 58, 74, 91, 108, 119, 126, 131, 128,
    124,
  ],
  yMax: 150,
  yTicks: [0, 50, 100, 150],
};

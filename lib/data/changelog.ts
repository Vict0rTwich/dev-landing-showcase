import type { CodeLanguage } from "@/lib/highlight";

export type ChangeKind = "new" | "improved" | "fixed";

export interface ReleaseChange {
  kind: ChangeKind;
  /** Plain text. Wrap identifiers in backticks to set them as code. */
  text: string;
}

export interface ReleaseMetric {
  label: string;
  value: string;
  unit?: string;
  note: string;
}

export interface ReleaseSnippet {
  /** File name; shell transcripts can leave it out. */
  title?: string;
  language: CodeLanguage;
  code: string;
}

export interface Release {
  /** Anchor on /changelog, so /changelog#<id> links straight to the entry. */
  id: string;
  /** The day the release finished rolling out to every region, as YYYY-MM-DD. */
  date: string;
  version: string;
  area: string;
  title: string;
  summary: string;
  changes: ReleaseChange[];
  metrics?: ReleaseMetric[];
  snippet?: ReleaseSnippet;
}

const entries: Release[] = [
  {
    // The hero's announcement pill links here.
    id: "edge-functions-2",
    date: "2026-10-14",
    version: "4.12",
    area: "Edge Functions",
    title: "Edge Functions 2.0 with 0 ms cold starts",
    summary:
      "Functions now start from a snapshot that every region keeps warm, so the first request after a deploy is served as fast as the millionth. The 2.0 runtime also doubles isolate memory and adds Python next to TypeScript and WebAssembly.",
    changes: [
      {
        kind: "new",
        text: "Snapshot-restored isolates: no cold start left to measure, in any of the 34 regions.",
      },
      {
        kind: "new",
        text: "A Python 3.13 runtime with the same request, streaming and environment APIs as TypeScript.",
      },
      {
        kind: "improved",
        text: "128 MB of memory per isolate, up from 64 MB, and 50 ms of CPU time per request.",
      },
      {
        kind: "improved",
        text: "Streaming responses send the first byte immediately instead of buffering 4 KB.",
      },
      { kind: "fixed", text: "`volans logs` no longer drops function logs written in the same millisecond." },
    ],
    metrics: [
      { label: "Cold start", value: "0", unit: "ms", note: "was 212 ms at p99" },
      { label: "Isolate memory", value: "128", unit: "MB", note: "up from 64 MB" },
      { label: "Warm regions", value: "34", note: "before the first request" },
    ],
    snippet: {
      title: "volans.toml",
      language: "toml",
      code: [
        "# Every function moves to 2.0 on its",
        "# next deploy. To stay on 1.x while",
        "# you test (until Jan 31, 2027):",
        "[functions]",
        'runtime = "edge@1"',
      ].join("\n"),
    },
  },
  {
    id: "database-branches",
    date: "2026-09-30",
    version: "4.11",
    area: "Previews",
    title: "A database branch for every preview",
    summary:
      "Preview deployments can now get their own copy-on-write branch of your production Postgres database. Reviewers test against real data, and nothing they change reaches production.",
    changes: [
      {
        kind: "new",
        text: "Branches are created from production in about two seconds at any size, and store only the rows that change.",
      },
      {
        kind: "new",
        text: "Each preview gets its own `DATABASE_URL`, and an optional seed script runs before the first request.",
      },
      {
        kind: "improved",
        text: "Idle branches pause after 14 days without a deploy and wake on the next request.",
      },
      {
        kind: "fixed",
        text: "Pull request comments now update in place instead of adding a new comment for every push.",
      },
    ],
    metrics: [
      { label: "Branch time", value: "2.1", unit: "s", note: "for a 200 GB database" },
      { label: "Extra storage", value: "0", unit: "GB", note: "until a row changes" },
      { label: "Idle pause", value: "14", unit: "days", note: "without a deploy" },
    ],
    snippet: {
      title: "volans.toml",
      language: "toml",
      code: ["[preview]", "database_branch = true", 'seed = "pnpm db:seed"'].join("\n"),
    },
  },
  {
    id: "request-tracing",
    date: "2026-09-16",
    version: "4.10",
    area: "Observability",
    title: "Request tracing from the browser to the database",
    summary:
      "Logs, traces and Web Vitals are now joined by request ID. Open a slow checkout in the dashboard and follow it from the visitor's click, through your Edge Functions, to the query that held it up.",
    changes: [
      {
        kind: "new",
        text: "Every request carries one trace ID across the edge, your functions and any service you call with `fetch`.",
      },
      { kind: "new", text: "Export spans to any OpenTelemetry-compatible backend over OTLP." },
      {
        kind: "improved",
        text: "Web Vitals are attributed to the deployment that served them, so a regression points at a commit.",
      },
      { kind: "fixed", text: "Requests retried at the edge no longer appear twice in the logs." },
    ],
    metrics: [
      { label: "Retention", value: "30", unit: "days", note: "on the Pro plan" },
      { label: "Overhead", value: "<1", unit: "ms", note: "per traced request" },
      { label: "Errors kept", value: "100", unit: "%", note: "never sampled out" },
    ],
  },
  {
    id: "instant-rollbacks",
    date: "2026-08-26",
    version: "4.9",
    area: "Deployments",
    title: "Instant rollbacks in under a second",
    summary:
      "Rolling back no longer rebuilds anything. Production is re-pointed at an earlier deployment, which is already built and stored, and every region serves it within a second.",
    changes: [
      {
        kind: "new",
        text: "`volans rollback` offers your last 20 production deployments, and `--to` takes a deployment ID or a commit SHA.",
      },
      {
        kind: "new",
        text: "A Roll back button on every production deployment in the dashboard, listing the commits it undoes.",
      },
      {
        kind: "improved",
        text: "Rollbacks keep the environment variables a deployment was built with, so old code never meets new secrets.",
      },
      { kind: "fixed", text: "Promoting a preview to production now keeps its custom domain aliases." },
    ],
    metrics: [
      { label: "Global switch", value: "412", unit: "ms", note: "median, all 34 regions" },
      { label: "Rebuilds", value: "0", note: "deployments are immutable" },
      { label: "History", value: "20", note: "deployments to choose from" },
    ],
    snippet: {
      language: "shell",
      code: [
        "$ volans rollback --to dpl_6Fp1Xc",
        "✓ Production now serves dpl_6Fp1Xc in 34 regions (412 ms)",
      ].join("\n"),
    },
  },
  {
    id: "new-regions",
    date: "2026-08-12",
    version: "4.8",
    area: "Network",
    title: "Three new regions: Johannesburg, Dubai and Seoul",
    summary:
      "JNB, DXB and ICN bring the network to 34 regions on six continents. Southern Africa and the Gulf get their first regions, and visitors in Korea no longer route through Tokyo.",
    changes: [
      {
        kind: "new",
        text: "JNB, DXB and ICN serve static assets and Edge Functions, and join automatic failover.",
      },
      {
        kind: "improved",
        text: "Failover routes traffic around a degraded region in under 10 seconds, down from 30.",
      },
      { kind: "fixed", text: "`volans regions` lists regions by measured latency from where you run it." },
    ],
    metrics: [
      { label: "Edge regions", value: "34", note: "up from 31" },
      { label: "JNB p50", value: "18", unit: "ms", note: "was 162 ms" },
      { label: "ICN p50", value: "9", unit: "ms", note: "was 31 ms via NRT" },
    ],
  },
  {
    id: "encrypted-environments",
    date: "2026-07-29",
    version: "4.7",
    area: "Security",
    title: "Encrypted environments and a full audit log",
    summary:
      "Secrets are now encrypted with a key unique to each project and scoped to preview, staging or production. Every change to a secret, a deploy or a team permission is written to an audit log you can export.",
    changes: [
      { kind: "new", text: "Per-project AES-256-GCM keys, rotated every 90 days without a redeploy." },
      { kind: "new", text: "Scope any variable to preview, staging or production with `--env`." },
      { kind: "new", text: "An exportable audit log of secret changes, deploys and permission changes." },
      { kind: "fixed", text: "`volans env pull` now writes only development values to `.env.local`." },
    ],
    metrics: [
      { label: "Key size", value: "256", unit: "bit", note: "AES-GCM, one key per project" },
      { label: "Key rotation", value: "90", unit: "days", note: "without a redeploy" },
      { label: "Audit log", value: "1", unit: "year", note: "of history on Enterprise" },
    ],
  },
];

/** Every release, newest first. */
export const releases = [...entries].sort((a, b) => b.date.localeCompare(a.date));

export const latestRelease = releases[0];

/** Link to one entry on /changelog. Throws on an unknown id, so a stale link fails the build. */
export function getReleaseHref(id: string): string {
  if (!releases.some((release) => release.id === id)) {
    throw new Error(`No changelog entry has the id "${id}".`);
  }
  return `/changelog#${id}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "2026-10-14" becomes "Oct 14, 2026". Parsed by hand rather than with a Date,
 * so the label can't shift a day with the server's time zone.
 */
export function formatReleaseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

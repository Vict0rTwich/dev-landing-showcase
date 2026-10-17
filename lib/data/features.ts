import { Activity, GitPullRequestArrow, Globe, History, KeyRound, Zap, type LucideIcon } from "lucide-react";

export interface Feature {
  title: string;
  description: string;
  spec: string;
  icon: LucideIcon;
}

export const features: Feature[] = [
  {
    title: "Preview every pull request",
    description:
      "Each pull request gets a live URL with its own database branch and threaded comments. Previews tear down when the branch merges.",
    spec: "pr-482.storefront.volans.app",
    icon: GitPullRequestArrow,
  },
  {
    title: "34 edge regions",
    description:
      "Pages and API responses are served from the region closest to each visitor, with automatic failover when a region goes dark.",
    spec: "p50 under 50 ms for 95% of users",
    icon: Globe,
  },
  {
    title: "Instant rollbacks",
    description:
      "Every deployment is immutable. Point production at any previous build in under a second, without waiting on a rebuild.",
    spec: "volans rollback --to a3f9c21",
    icon: History,
  },
  {
    title: "Request tracing",
    description:
      "Logs, traces and Web Vitals are joined per request, so you can follow a slow checkout from the browser down to the query.",
    spec: "OpenTelemetry · 30-day retention",
    icon: Activity,
  },
  {
    title: "Encrypted environments",
    description:
      "Secrets are encrypted with per-project keys and scoped to preview, staging or production. Every change lands in the audit log.",
    spec: "AES-256-GCM · SOC 2 Type II",
    icon: KeyRound,
  },
  {
    title: "Edge Functions",
    description:
      "Run TypeScript, Python or WebAssembly next to your users, with streaming responses and no cold starts to design around.",
    spec: "0 ms cold start · 128 MB isolates",
    icon: Zap,
  },
];

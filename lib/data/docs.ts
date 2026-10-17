import { siteConfig } from "@/lib/site";

export const cliVersion = "4.12.0";

export interface DocsNavItem {
  /** Id of the heading on /docs. */
  id: string;
  label: string;
  children?: DocsNavItem[];
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

/** The docs sidebar, in page order. Each label is also its section's heading. */
export const docsNav: DocsNavGroup[] = [
  {
    title: "Getting started",
    items: [
      { id: "overview", label: "Overview" },
      {
        id: "quickstart",
        label: "Quickstart",
        children: [
          { id: "install-the-cli", label: "Install the CLI" },
          { id: "link-a-project", label: "Link a project" },
          { id: "deploy-to-production", label: "Deploy to production" },
        ],
      },
      { id: "configuration", label: "Project configuration" },
    ],
  },
  {
    title: "Platform",
    items: [
      { id: "preview-deployments", label: "Preview deployments" },
      { id: "environment-variables", label: "Environment variables" },
      { id: "edge-functions", label: "Edge Functions" },
      { id: "rollbacks", label: "Instant rollbacks" },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "cli-reference", label: "CLI commands" },
      { id: "regions", label: "Edge regions" },
    ],
  },
];

const navLabels = new Map(
  docsNav
    .flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])]))
    .map((item) => [item.id, item.label]),
);

/** The sidebar label for a section id, so headings and sidebar can't drift apart. */
export function getDocsLabel(id: string): string {
  const label = navLabels.get(id);
  if (!label) throw new Error(`No docs section has the id "${id}". Add it to docsNav first.`);
  return label;
}

export const installCommands = [
  { label: "npm", code: "$ npm install --global @volans/cli" },
  { label: "pnpm", code: "$ pnpm add --global @volans/cli" },
  { label: "Bun", code: "$ bun add --global @volans/cli" },
  { label: "Homebrew", code: "$ brew install volans/tap/volans" },
];

export const cliCommands = [
  { command: "volans login", description: "Sign in and keep a token in your system keychain." },
  { command: "volans link", description: "Connect this directory and its Git repository to a project." },
  { command: "volans deploy", description: "Build the working tree and deploy it as a preview." },
  { command: siteConfig.cliCommand, description: "Build and promote straight to production." },
  { command: "volans env pull", description: "Write development variables to `.env.local`." },
  { command: "volans logs --follow", description: "Stream build, function and request logs as they happen." },
  { command: "volans rollback", description: "Point production at an earlier deployment." },
  { command: "volans domains add", description: "Attach a domain and issue its TLS certificate." },
];

export interface EdgeRegion {
  /** IATA code of the nearest airport, as used in volans.toml. */
  code: string;
  city: string;
}

/** All 34 regions. The hero console draws twelve of them. */
export const edgeRegions: { name: string; regions: EdgeRegion[] }[] = [
  {
    name: "Americas",
    regions: [
      { code: "IAD", city: "Washington, D.C." },
      { code: "SFO", city: "San Francisco" },
      { code: "YYZ", city: "Toronto" },
      { code: "GRU", city: "São Paulo" },
      { code: "ORD", city: "Chicago" },
      { code: "DFW", city: "Dallas" },
      { code: "SEA", city: "Seattle" },
      { code: "MIA", city: "Miami" },
      { code: "MEX", city: "Mexico City" },
      { code: "BOG", city: "Bogotá" },
      { code: "SCL", city: "Santiago" },
    ],
  },
  {
    name: "Europe",
    regions: [
      { code: "LHR", city: "London" },
      { code: "FRA", city: "Frankfurt" },
      { code: "CDG", city: "Paris" },
      { code: "ARN", city: "Stockholm" },
      { code: "AMS", city: "Amsterdam" },
      { code: "MAD", city: "Madrid" },
      { code: "MXP", city: "Milan" },
      { code: "ZRH", city: "Zurich" },
      { code: "WAW", city: "Warsaw" },
      { code: "DUB", city: "Dublin" },
    ],
  },
  {
    name: "Asia-Pacific",
    regions: [
      { code: "BOM", city: "Mumbai" },
      { code: "SIN", city: "Singapore" },
      { code: "NRT", city: "Tokyo" },
      { code: "SYD", city: "Sydney" },
      { code: "HKG", city: "Hong Kong" },
      { code: "ICN", city: "Seoul" },
      { code: "KIX", city: "Osaka" },
      { code: "DEL", city: "Delhi" },
      { code: "MEL", city: "Melbourne" },
      { code: "CGK", city: "Jakarta" },
      { code: "TPE", city: "Taipei" },
    ],
  },
  {
    name: "Middle East and Africa",
    regions: [
      { code: "JNB", city: "Johannesburg" },
      { code: "DXB", city: "Dubai" },
    ],
  },
];

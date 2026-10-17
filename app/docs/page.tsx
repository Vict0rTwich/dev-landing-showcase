import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowDown, ArrowRight, Hash, Lightbulb } from "lucide-react";

import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock, InlineCode, withInlineCode } from "@/components/ui/code-block";
import { CodeTabs } from "@/components/ui/code-tabs";
import { Container } from "@/components/ui/container";
import { CopyButton } from "@/components/ui/copy-button";
import { Glow } from "@/components/ui/glow";
import { Readouts } from "@/components/ui/readouts";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";
import { formatReleaseDate, getReleaseHref, latestRelease } from "@/lib/data/changelog";
import { TOTAL_REGIONS, deployment } from "@/lib/data/deployment";
import {
  cliCommands,
  cliVersion,
  docsNav,
  edgeRegions,
  getDocsLabel,
  installCommands,
} from "@/lib/data/docs";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const shareTitle = `Documentation · ${siteConfig.name}`;
const description = `Install the ${siteConfig.name} CLI, link a project and deploy to ${TOTAL_REGIONS} edge regions. Quickstart, configuration and CLI reference.`;

export const metadata: Metadata = {
  title: "Documentation",
  description,
  alternates: { canonical: "/docs" },
  openGraph: { type: "website", siteName: siteConfig.name, title: shareTitle, description, url: "/docs" },
  twitter: { card: "summary_large_image", title: shareTitle, description },
};

// The docs are the same for every visitor; fail the build if that ever changes.
export const ensureStatic = "navigation";

const { team, project, commit, url } = deployment;

// Transcripts reuse the hero console's project, so the story matches across the site.
const samples = {
  link: [
    "$ volans login",
    `✓ Signed in as ${commit.author} (${team})`,
    "$ volans link",
    `? Which team should own this project? ${team}`,
    `? Project name: ${project}`,
    `✓ Linked ${team}/${project} (Next.js detected)`,
  ].join("\n"),
  deploy: [
    `$ ${siteConfig.cliCommand}`,
    `Building ${team}/${project} from ${commit.branch} (${commit.sha})`,
    "✓ Build completed in 14.3s",
    "✓ 82 tests passed, 0 type errors",
    `Propagating to ${TOTAL_REGIONS} edge regions`,
    `✓ Ready in 36.0s at https://${url}`,
  ].join("\n"),
  config: [
    "[build]",
    'command = "pnpm build"',
    'output = ".next"',
    "",
    "[functions]",
    'runtime = "edge@2"',
    "memory_mb = 128",
    "# Run functions near your database;",
    `# assets still go to all ${TOTAL_REGIONS} regions.`,
    'regions = ["IAD", "FRA"]',
    "",
    "[preview]",
    "database_branch = true",
  ].join("\n"),
  preview: [
    "$ volans deploy",
    `Building a preview of ${team}/${project} from checkout-redesign`,
    `✓ Preview ready at https://${project}-7c1e04d.volans.app`,
  ].join("\n"),
  env: [
    "$ volans env add PAYMENTS_API_KEY --env production",
    "✓ Encrypted PAYMENTS_API_KEY for production",
    "$ volans env pull .env.local",
    "✓ Wrote 12 development variables to .env.local",
  ].join("\n"),
  edgeFunction: [
    "export default {",
    "  async fetch(request: Request): Promise<Response> {",
    '    const region = request.headers.get("x-volans-region") ?? "local";',
    '    return Response.json({ message: "Hello from the edge", region });',
    "  },",
    "};",
  ].join("\n"),
  rollback: [
    "$ volans rollback",
    "? Roll production back to which deployment? dpl_6Fp1Xc (main, 2 hours ago)",
    `✓ Production now serves dpl_6Fp1Xc in ${TOTAL_REGIONS} regions (412 ms)`,
  ].join("\n"),
};

const readouts = [
  { label: "Time to deploy", value: "5", unit: "min", note: "from an empty terminal" },
  { label: "Commands", value: "3", note: "install, link, deploy" },
  { label: "CLI", value: cliVersion, note: "macOS, Linux and Windows" },
];

const stages = [
  { title: "Build", body: "An isolated runner clones, installs and builds, with a warm dependency cache." },
  { title: "Check", body: "Your tests and type checks run next. A failing check stops the deploy." },
  {
    title: "Serve",
    body: `Assets and functions upload to all ${TOTAL_REGIONS} regions, then traffic switches over at once.`,
  },
];

export default function DocsPage() {
  return (
    <>
      <PageHeader
        titleId="docs-title"
        label="Documentation"
        meta={<Badge tone="accent">CLI {cliVersion}</Badge>}
        title={
          <>
            Three commands <span className="text-subtle-foreground">to a global deploy.</span>
          </>
        }
        description={`Install the CLI, link a repository and promote your first build to all ${TOTAL_REGIONS} edge regions. The quickstart takes about five minutes; the rest of this page is reference to come back to.`}
      >
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Glow>
            <a href="#quickstart" className={buttonVariants({ size: "lg" })}>
              Start the quickstart
              <ArrowDown aria-hidden="true" />
            </a>
          </Glow>
          <a
            href={getReleaseHref(latestRelease.id)}
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            What&apos;s new in {latestRelease.version}
          </a>
        </div>
        <Readouts items={readouts} className="mt-12 border-t border-border pt-8" />
      </PageHeader>

      <Container className="pt-10 pb-24 sm:pb-32 lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-16">
        {/* Sticky on every screen size: a bar under the header on small screens, a column on large ones. */}
        <div className="sticky top-[calc(var(--header-height)+env(safe-area-inset-top,0px)+0.75rem)] z-30 mb-8 lg:top-[calc(var(--header-height)+2.5rem)] lg:col-span-3 lg:mb-0 lg:self-start">
          <DocsSidebar groups={docsNav} footer={<LatestReleaseCard />} />
        </div>

        <div className="min-w-0 lg:col-span-9">
          <div className="divide-y divide-border">
            <DocsSection id="overview">
              <Prose>
                {siteConfig.name} builds your repository on every push, runs your checks and serves the result
                from {TOTAL_REGIONS} edge regions. Each deployment is immutable and gets its own URL, so a
                preview, production and a rollback are the same build at different addresses.
              </Prose>
              <SpotlightGrid className="my-8" gridClassName="sm:grid-cols-3">
                {stages.map((stage, index) => (
                  <div key={stage.title} data-spotlight-cell className="relative bg-surface p-5 sm:p-6">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
                      style={{
                        background:
                          "radial-gradient(280px circle at var(--cell-x, 50%) var(--cell-y, 50%), var(--glow-cell), transparent 65%)",
                      }}
                    />
                    <p className="relative font-mono text-[12px] text-indigo-light">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="relative mt-3 text-[15px] font-semibold text-foreground">{stage.title}</h3>
                    <p className="relative mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                      {stage.body}
                    </p>
                  </div>
                ))}
              </SpotlightGrid>
              <Prose>
                Next.js, Astro, SvelteKit, Remix and Nuxt are detected automatically. Anything else works with
                a build command and an output directory; see{" "}
                <TextLink href="#configuration">{getDocsLabel("configuration")}</TextLink>.
              </Prose>
            </DocsSection>

            <DocsSection id="quickstart">
              <Prose>
                You need Node.js 20.9 or later and a Git repository with a web app in it. Any framework
                starter works if you just want to try things out.
              </Prose>
              <ol className="space-y-12 pt-5">
                <Step id="install-the-cli" number={1}>
                  <Prose>Install the CLI globally with the package manager you already use.</Prose>
                  <CodeTabs label="Package manager" tabs={installCommands} />
                  <Prose>
                    Check that it worked with <InlineCode>volans --version</InlineCode>. It should print{" "}
                    <InlineCode>{cliVersion}</InlineCode> or later.
                  </Prose>
                </Step>
                <Step id="link-a-project" number={2}>
                  <Prose>
                    From your app&apos;s root directory, sign in, then link the directory to a new or existing
                    project. The CLI detects your framework and build settings and saves the link to{" "}
                    <InlineCode>.volans/project.json</InlineCode>.
                  </Prose>
                  <CodeBlock language="shell" code={samples.link} />
                </Step>
                <Step id="deploy-to-production" number={3}>
                  <Prose>
                    Deploy. The CLI uploads your source, streams the build log and prints the production URL
                    once every region is serving it.
                  </Prose>
                  <CodeBlock language="shell" code={samples.deploy} />
                  <Tip>
                    <InlineCode>volans link</InlineCode> also connected your Git repository. From now on,
                    every push to <InlineCode>{commit.branch}</InlineCode> deploys to production and every
                    other branch gets a preview URL.
                  </Tip>
                </Step>
              </ol>
            </DocsSection>

            <DocsSection id="configuration">
              <Prose>
                Most projects need no configuration. To pin build settings, runtimes or function regions, add
                a <InlineCode>volans.toml</InlineCode> to the repository root. Values in the file take
                precedence over the dashboard.
              </Prose>
              <CodeBlock language="toml" title="volans.toml" code={samples.config} />
              <Prose>
                Run <InlineCode>volans config check</InlineCode> to validate the file before you push. Region
                codes are listed under <TextLink href="#regions">{getDocsLabel("regions")}</TextLink>.
              </Prose>
            </DocsSection>

            <DocsSection id="preview-deployments">
              <Prose>
                Every push to a branch other than <InlineCode>{commit.branch}</InlineCode> builds a preview
                with its own URL. Pull requests get a comment with the link, and the preview is removed when
                the branch merges. To preview your working tree without pushing, deploy without{" "}
                <InlineCode>--prod</InlineCode>:
              </Prose>
              <CodeBlock language="shell" code={samples.preview} />
              <Prose>
                Set <InlineCode>database_branch = true</InlineCode> under <InlineCode>[preview]</InlineCode>{" "}
                to give each preview a copy-on-write branch of your production database.{" "}
                <TextLink href={getReleaseHref("database-branches")}>How database branches work</TextLink>.
              </Prose>
            </DocsSection>

            <DocsSection id="environment-variables">
              <Prose>
                Variables are encrypted with a per-project key and scoped to preview, staging or production.
                Builds and functions read them like any other environment variable, and every change is
                written to the audit log.
              </Prose>
              <CodeBlock language="shell" code={samples.env} />
              <Prose>
                <InlineCode>volans env pull</InlineCode> only ever writes development values, so production
                secrets stay off laptops.
              </Prose>
            </DocsSection>

            <DocsSection id="edge-functions">
              <Prose>
                Files in <InlineCode>functions/</InlineCode> deploy as Edge Functions and run in the region
                closest to each visitor. Since version 2.0, isolates stay warm in every region, so
                there&apos;s no cold start to design around.
              </Prose>
              <CodeBlock language="ts" title="functions/hello.ts" code={samples.edgeFunction} />
              <Prose>
                Every deployment serves this function at <InlineCode>/hello</InlineCode>. Functions can be
                written in TypeScript, Python or WebAssembly, and each isolate gets 128 MB of memory.{" "}
                <TextLink href={getReleaseHref("edge-functions-2")}>Read the 2.0 release notes</TextLink>.
              </Prose>
            </DocsSection>

            <DocsSection id="rollbacks">
              <Prose>
                Deployments never change after they&apos;re built, so a rollback re-points production at an
                earlier one instead of rebuilding it. The switch reaches every region in under a second.
              </Prose>
              <CodeBlock language="shell" code={samples.rollback} />
              <Prose>
                Pass <InlineCode>--to</InlineCode> with a deployment ID or a commit SHA to skip the prompt.
              </Prose>
            </DocsSection>

            <DocsSection id="cli-reference">
              <Prose>
                The commands you&apos;ll use most. Run <InlineCode>{"volans help <command>"}</InlineCode> for
                every flag.
              </Prose>
              <dl className="mt-7 divide-y divide-border border-y border-border">
                {cliCommands.map((item) => (
                  <div
                    key={item.command}
                    className="grid gap-1.5 py-4 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center sm:gap-6"
                  >
                    <dt className="flex min-w-0 items-center gap-2 font-mono text-[13px] text-foreground">
                      <span aria-hidden="true" className="text-subtle-foreground select-none">
                        $
                      </span>
                      <span className="min-w-0">{item.command}</span>
                      <CopyButton value={item.command} label={`Copy ${item.command}`} className="ml-auto" />
                    </dt>
                    <dd className="text-[15px] leading-relaxed text-muted-foreground">
                      {withInlineCode(item.description)}
                    </dd>
                  </div>
                ))}
              </dl>
            </DocsSection>

            <DocsSection id="regions">
              <Prose>
                Static assets and Edge Functions are served from all {TOTAL_REGIONS} regions, each named by
                the IATA code of its nearest airport. Use the codes in <InlineCode>volans.toml</InlineCode> to
                keep functions close to your data.
              </Prose>
              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {edgeRegions.map((group) => (
                  <div key={group.name}>
                    <h3 className="flex items-baseline justify-between gap-3 type-label text-subtle-foreground">
                      <span>{group.name}</span>
                      <span className="tabular-nums">{group.regions.length}</span>
                    </h3>
                    <ul className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                      {group.regions.map((region) => (
                        <li
                          key={region.code}
                          className="flex items-center gap-2 bg-surface px-3 py-2.5 last:odd:col-span-2"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-live shadow-[0_0_6px_rgb(52_211_153/0.7)]"
                          />
                          <span className="font-mono text-[13px] text-foreground">{region.code}</span>
                          <span className="min-w-0 text-[13px] leading-snug text-muted-foreground">
                            {region.city}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </DocsSection>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-8 text-[13px] text-subtle-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Updated for {siteConfig.name} {latestRelease.version} on{" "}
              <time dateTime={latestRelease.date}>{formatReleaseDate(latestRelease.date)}</time>.
            </p>
            <a
              href="/changelog"
              className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              See what changed
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}

function DocsSection({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="py-14 first:pt-0">
      <Heading id={id} />
      <div className="mt-5 max-w-3xl space-y-5">{children}</div>
    </section>
  );
}

/** A section heading that links to itself. Its text comes from the sidebar data. */
function Heading({ id, level = 2, className }: { id: string; level?: 2 | 3; className?: string }) {
  const Tag = level === 2 ? "h2" : "h3";

  return (
    <Tag
      id={id}
      className={cn(
        "scroll-mt-36 lg:scroll-mt-28",
        level === 2
          ? "text-[1.75rem] type-heading sm:text-[2rem]"
          : "text-lg font-semibold tracking-[-0.01em] text-foreground",
        className,
      )}
    >
      <a href={`#${id}`} className="group/anchor rounded-sm transition-colors hover:text-white">
        {getDocsLabel(id)}
        <Hash
          aria-hidden="true"
          className={cn(
            "ml-2 inline-block align-[-0.1em] text-subtle-foreground opacity-0 transition-opacity group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100",
            level === 2 ? "size-5" : "size-4",
          )}
        />
      </a>
    </Tag>
  );
}

/**
 * On phones the step number sits beside the heading so samples get the full width;
 * from `sm` up it hangs in a gutter, joined to the next step by a rail.
 */
function Step({ id, number, children }: { id: string; number: number; children: ReactNode }) {
  return (
    <li className="group/step relative grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:items-start sm:gap-x-5">
      <span
        aria-hidden="true"
        className="absolute top-12 -bottom-10 left-5 hidden w-px bg-border group-last/step:hidden sm:block"
      />
      <span
        aria-hidden="true"
        className="relative flex size-8 items-center justify-center rounded-full border border-border-strong bg-background-deep font-mono text-[11px] text-indigo-light shadow-[0_0_18px_-6px_var(--indigo)] sm:row-span-2 sm:size-10 sm:text-[12px]"
      >
        {String(number).padStart(2, "0")}
      </span>
      <Heading id={id} level={3} className="sm:pt-1.5" />
      <div className="col-span-2 min-w-0 space-y-4 sm:col-span-1 sm:col-start-2">{children}</div>
    </li>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return <p className="text-[16px] leading-7 text-pretty break-words text-muted-foreground">{children}</p>;
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
    >
      {children}
    </a>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="rounded-xl border border-indigo-soft/25 bg-indigo/[0.07] px-5 py-4">
      <p className="flex items-center gap-2 type-label text-indigo-light">
        <Lightbulb aria-hidden="true" className="size-3.5" />
        Tip
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-pretty text-muted-foreground">{children}</p>
    </div>
  );
}

function LatestReleaseCard() {
  return (
    <a
      href={getReleaseHref(latestRelease.id)}
      className="group mt-8 block rounded-xl border border-border bg-white/[0.02] p-4 transition-colors hover:border-border-strong hover:bg-white/[0.04]"
    >
      <span className="flex items-center gap-2 type-label text-subtle-foreground">
        <span
          aria-hidden="true"
          className="size-1.5 rounded-full bg-indigo-light shadow-[0_0_8px_var(--indigo)]"
        />
        New in {latestRelease.version}
      </span>
      <span className="mt-2 block text-[13px] leading-snug font-medium text-foreground">
        {latestRelease.title}
      </span>
      <span className="mt-3 inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors group-hover:text-foreground">
        Release notes
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </a>
  );
}

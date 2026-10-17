import type { Metadata } from "next";
import { ArrowRight, Hash } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock, withInlineCode } from "@/components/ui/code-block";
import { Container } from "@/components/ui/container";
import { Glow } from "@/components/ui/glow";
import { Readouts } from "@/components/ui/readouts";
import {
  formatReleaseDate,
  latestRelease,
  releases,
  type ChangeKind,
  type Release,
} from "@/lib/data/changelog";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const shareTitle = `Changelog · ${siteConfig.name}`;
const description = `New features, improvements and fixes across the ${siteConfig.name} platform, CLI and dashboard, newest first.`;

export const metadata: Metadata = {
  title: "Changelog",
  description,
  alternates: { canonical: "/changelog" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: shareTitle,
    description,
    url: "/changelog",
  },
  twitter: { card: "summary_large_image", title: shareTitle, description },
};

// Release notes are the same for every visitor; fail the build if that ever changes.
export const ensureStatic = "navigation";

const changeKinds: Record<ChangeKind, { label: string; className: string }> = {
  new: { label: "New", className: "text-indigo-light" },
  improved: { label: "Improved", className: "text-cyan-soft" },
  fixed: { label: "Fixed", className: "text-live" },
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        titleId="changelog-title"
        label="Changelog"
        meta={<Badge tone="live">v{latestRelease.version} is live</Badge>}
        title={
          <>
            Every release, <span className="text-subtle-foreground">with the numbers behind it.</span>
          </>
        }
        description="New features, improvements and fixes across the platform, CLI and dashboard. Each release reaches every region on the date shown, and nothing needs a migration unless its entry says so."
      />

      <Container className="pt-14 pb-24 sm:pt-20 sm:pb-32">
        <ol aria-label="Releases, newest first" className="space-y-14 lg:space-y-0">
          {releases.map((release) => (
            <li
              key={release.id}
              className="border-t border-border pt-14 first:border-t-0 first:pt-0 lg:border-t-0 lg:pt-0"
            >
              <ReleaseEntry release={release} latest={release.id === latestRelease.id} />
            </li>
          ))}
        </ol>
      </Container>

      <ChangelogCta />
    </>
  );
}

function ReleaseEntry({ release, latest }: { release: Release; latest: boolean }) {
  const titleId = `${release.id}-title`;

  return (
    <article
      id={release.id}
      aria-labelledby={titleId}
      className="group/release scroll-mt-24 lg:grid lg:grid-cols-12 lg:gap-8"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:sticky lg:top-28 lg:col-span-3 lg:flex-col lg:items-start lg:gap-2 lg:self-start lg:pt-1.5">
        <time dateTime={release.date} className="font-mono text-[13px] text-foreground">
          {formatReleaseDate(release.date)}
        </time>
        <span className="font-mono text-[12px] text-subtle-foreground">v{release.version}</span>
        <span className="flex flex-wrap gap-2 lg:mt-1">
          <Badge>{release.area}</Badge>
          {latest && <Badge tone="accent">Latest</Badge>}
        </span>
      </div>

      {/* On large screens the entries hang off a timeline rail. */}
      <div className="relative isolate mt-5 min-w-0 lg:col-span-9 lg:mt-0 lg:border-l lg:border-border lg:pb-20 lg:pl-10">
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-3 left-[-0.5px] hidden size-2 -translate-x-1/2 rounded-full ring-4 ring-background transition-[background-color,box-shadow] duration-500 lg:block",
            latest ? "bg-indigo-light shadow-[0_0_14px_var(--indigo)]" : "bg-border-strong",
            "group-target/release:bg-cyan-soft group-target/release:shadow-[0_0_16px_var(--cyan)]",
          )}
        />
        {/* Lights up the entry a link pointed at, such as the hero's announcement. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-10 -z-10 h-72 opacity-0 transition-opacity duration-700 group-target/release:opacity-100"
          style={{ background: "radial-gradient(55% 60% at 0% 0%, var(--glow-indigo), transparent 70%)" }}
        />

        <h2 id={titleId} className="text-[1.625rem] type-heading sm:text-[2rem]">
          <a href={`#${release.id}`} className="group/anchor rounded-sm transition-colors hover:text-white">
            {release.title}
            <Hash
              aria-hidden="true"
              className="ml-2 inline-block size-5 align-[-0.1em] text-subtle-foreground opacity-0 transition-opacity group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100"
            />
          </a>
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-pretty text-muted-foreground">
          {release.summary}
        </p>

        <ul className="mt-7 max-w-2xl space-y-3 border-t border-border pt-6">
          {release.changes.map((change) => {
            const kind = changeKinds[change.kind];
            return (
              <li
                key={change.text}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 text-[15px] leading-relaxed text-muted-foreground sm:grid-cols-[5.5rem_minmax(0,1fr)]"
              >
                <span className={cn("pt-1 type-label", kind.className)}>{kind.label}</span>
                <span>{withInlineCode(change.text)}</span>
              </li>
            );
          })}
        </ul>

        {release.metrics && <Readouts items={release.metrics} className="mt-8" />}
        {release.snippet && <CodeBlock className="mt-8 max-w-2xl" {...release.snippet} />}
      </div>
    </article>
  );
}

function ChangelogCta() {
  return (
    <section
      aria-labelledby="changelog-cta-title"
      className="relative isolate overflow-hidden border-t border-border"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(40% 90% at 90% 100%, var(--glow-indigo), transparent 70%)" }}
      />
      <Container className="flex flex-col gap-8 py-20 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h2 id="changelog-cta-title" className="text-[clamp(1.875rem,4vw,2.75rem)] type-heading">
            Every plan runs the latest release.
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-pretty text-muted-foreground">
            New features reach every project the day they ship, with nothing to upgrade. Start a 14-day Pro
            trial, or deploy from your terminal in about five minutes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Glow>
            <a href={siteConfig.links.trial} className={buttonVariants({ size: "lg" })}>
              Start free trial
              <ArrowRight aria-hidden="true" />
            </a>
          </Glow>
          <a href="/docs#quickstart" className={buttonVariants({ variant: "ghost", size: "lg" })}>
            Read the quickstart
          </a>
        </div>
      </Container>
    </section>
  );
}

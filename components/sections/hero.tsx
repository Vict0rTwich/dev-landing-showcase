import { ArrowRight } from "lucide-react";

import { DeployConsole } from "@/components/console/deploy-console";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CopyCommand } from "@/components/ui/copy-command";
import { Glow } from "@/components/ui/glow";
import { siteConfig } from "@/lib/site";

const readouts = [
  { label: "Median deploy", value: "38", unit: "s", note: "git push to global" },
  { label: "Edge regions", value: "34", unit: "", note: "on six continents" },
  { label: "Uptime, 90 days", value: "99.99", unit: "%", note: "across all regions" },
];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <Container className="pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-24">
        <a
          href="/changelog#edge-functions-2"
          className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-white/[0.03] py-1 pr-3 pl-1 text-[13px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
        >
          <span className="rounded-full bg-indigo/15 px-2 py-0.5 text-[11px] font-medium text-indigo-light ring-1 ring-indigo/35 ring-inset">
            New
          </span>
          Edge Functions 2.0 with 0 ms cold starts
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </a>

        <h1 id="hero-title" className="mt-7 text-[clamp(2.875rem,8.6vw,6.5rem)] type-display">
          Ship at{" "}
          <span className="block text-gradient pb-[0.06em] motion-safe:animate-gradient-pan">
            terminal velocity.
          </span>
        </h1>

        <div className="mt-10 grid gap-10 border-t border-border pt-8 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="max-w-[36rem] text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl sm:leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Glow>
                <a href={siteConfig.links.trial} className={buttonVariants({ size: "lg" })}>
                  Start free trial
                  <ArrowRight aria-hidden="true" />
                </a>
              </Glow>
              <CopyCommand command={siteConfig.cliCommand} />
            </div>
            <p className="mt-4 text-sm text-subtle-foreground">14-day Pro trial. No credit card required.</p>
          </div>

          <dl className="grid grid-cols-3 gap-3 self-end sm:gap-6 lg:col-span-5">
            {readouts.map((readout) => (
              <div key={readout.label} className="border-l border-border pl-3 sm:pl-4">
                <dt className="min-h-8 type-label text-subtle-foreground">{readout.label}</dt>
                <dd className="mt-3 text-[1.625rem] leading-none font-semibold tracking-[-0.03em] [font-stretch:112%] tabular-nums sm:text-[2rem]">
                  {readout.value}
                  <span className="text-[0.6em] text-muted-foreground">{readout.unit}</span>
                </dd>
                <dd className="mt-2 text-[13px] text-muted-foreground">{readout.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="console" className="mt-14 scroll-mt-24 sm:mt-20">
          <DeployConsole />
        </div>
      </Container>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_55%_at_40%_0%,#000_30%,transparent_78%)]" />
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(55% 42% at 16% -6%, var(--glow-indigo), transparent 70%)",
            "radial-gradient(42% 36% at 84% 6%, var(--glow-violet), transparent 70%)",
            "radial-gradient(38% 30% at 92% 62%, var(--glow-cyan), transparent 70%)",
          ].join(", "),
        }}
      />
      <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-background" />
    </div>
  );
}

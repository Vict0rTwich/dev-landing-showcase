"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Glow } from "@/components/ui/glow";
import { YEARLY_DISCOUNT_LABEL, plans, type BillingPeriod, type Plan } from "@/lib/data/pricing";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>("yearly");

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative isolate scroll-mt-16 overflow-x-clip py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-[75rem] bg-linear-to-r from-transparent via-border-strong to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[38%] left-1/2 -z-10 h-[44rem] w-[min(68rem,140vw)] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(closest-side, var(--glow-indigo), transparent)" }}
      />

      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="pricing-title" className="text-[clamp(2.125rem,4.6vw,3.5rem)] type-heading">
              Pay for your team, <span className="text-subtle-foreground">not your traffic spikes.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-pretty text-muted-foreground">
              Every plan includes unlimited preview deployments, automatic HTTPS and DDoS protection. Start
              with a 14-day Pro trial and change plans whenever you like.
            </p>
          </div>
          <BillingToggle value={period} onChange={setPeriod} />
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} period={period} />
          ))}
        </div>

        <p className="mt-10 text-sm text-subtle-foreground">
          Prices in USD, excluding taxes. Running more than 100 seats?{" "}
          <a
            href={siteConfig.links.contactSales}
            className="text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Ask about volume pricing
          </a>
          .
        </p>
      </Container>
    </section>
  );
}

function BillingToggle({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}) {
  const options: { id: BillingPeriod; label: string }[] = [
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <fieldset className="shrink-0">
      <legend className="sr-only">Billing period</legend>
      <LayoutGroup id="billing-toggle">
        <div className="inline-flex rounded-full border border-border bg-white/[0.03] p-1">
          {options.map((option) => {
            const checked = option.id === value;
            return (
              <label
                key={option.id}
                className={cn(
                  "relative isolate inline-flex h-10 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors select-none",
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                  checked ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <input
                  type="radio"
                  name="billing-period"
                  value={option.id}
                  checked={checked}
                  onChange={() => onChange(option.id)}
                  className="sr-only"
                />
                {checked && (
                  <motion.span
                    layoutId="billing-pill"
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.08] ring-1 ring-white/10 ring-inset"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                  />
                )}
                {option.label}
                {option.id === "yearly" && <Badge tone="live">{YEARLY_DISCOUNT_LABEL}</Badge>}
              </label>
            );
          })}
        </div>
      </LayoutGroup>
    </fieldset>
  );
}

function PlanCard({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const highlighted = Boolean(plan.highlighted);
  const titleId = `plan-${plan.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "relative flex flex-col rounded-2xl p-6 sm:p-8",
        highlighted
          ? "bg-surface-raised/90 shadow-[0_40px_100px_-40px_rgb(99_102_241/0.45)] backdrop-blur-md"
          : "border border-border bg-surface/60 backdrop-blur-md",
      )}
    >
      {highlighted && <AnimatedBorder />}

      <header className="relative">
        <div className="flex items-center justify-between gap-3">
          <h3 id={titleId} className="text-lg font-semibold tracking-[-0.01em] text-foreground">
            {plan.name}
          </h3>
          {highlighted && <Badge tone="accent">Most popular</Badge>}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground lg:min-h-[2.75rem]">
          {plan.tagline}
        </p>
      </header>

      <div className="relative mt-8 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Price plan={plan} period={period} />
        {plan.unit && <span className="text-sm text-muted-foreground">{plan.unit}</span>}
      </div>
      <p className="relative mt-2 h-5 text-[13px] text-subtle-foreground">{plan.billingNote[period]}</p>

      <div className="relative mt-7">
        {highlighted ? (
          <Glow className="flex w-full">
            <a href={plan.cta.href} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
              {plan.cta.label}
            </a>
          </Glow>
        ) : (
          <a href={plan.cta.href} className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "w-full")}>
            {plan.cta.label}
          </a>
        )}
      </div>

      <div className="relative mt-8 border-t border-border pt-6">
        <p className="text-[13px] font-medium text-foreground">{plan.featuresTitle}</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-2 md:gap-x-6 lg:grid-cols-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-3 text-[14px] leading-snug text-muted-foreground">
              <Check
                aria-hidden="true"
                className={cn("mt-px size-4 shrink-0", highlighted ? "text-cyan-soft" : "text-indigo-soft")}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function Price({ plan, period }: { plan: Plan; period: BillingPeriod }) {
  const priceClass =
    "relative inline-flex overflow-hidden pb-1 text-[2.75rem] leading-none font-semibold tracking-[-0.04em] tabular-nums [font-stretch:112%] sm:text-5xl";

  if (!plan.price) return <span className={priceClass}>Custom</span>;

  const amount = plan.price[period];

  return (
    <span className={priceClass}>
      <span className="sr-only">${amount}</span>
      <span aria-hidden="true" className="relative inline-flex">
        <span>$</span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={amount}
            initial={{ y: "65%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-65%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            {amount}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/** A slow conic sweep traced around the card's 1px edge. */
function AnimatedBorder() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] p-px border-mask"
      >
        <div className="absolute inset-0 bg-[linear-gradient(160deg,rgb(129_140_248/0.55),rgb(148_163_203/0.14)_45%,rgb(34_211_238/0.4))]" />
        <div className="absolute top-1/2 left-1/2 aspect-square w-[max(150%,72rem)] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,var(--indigo-light)_40deg,var(--cyan)_80deg,transparent_120deg,transparent_360deg)] motion-safe:animate-orbit motion-safe:[animation-duration:9s]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 -top-px h-px bg-linear-to-r from-transparent via-white/60 to-transparent"
      />
    </>
  );
}

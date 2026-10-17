import { Container } from "@/components/ui/container";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";
import { features, type Feature } from "@/lib/data/features";

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative isolate scroll-mt-16 py-24 sm:py-32"
    >
      <SectionRule />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_55%,#000_20%,transparent_75%)]"
      />

      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="features-title" className="text-[clamp(2.125rem,4.6vw,3.5rem)] type-heading lg:col-span-7">
            Everything between git&nbsp;push{" "}
            <span className="text-subtle-foreground">and a global edge.</span>
          </h2>
          <p className="max-w-md text-[17px] leading-relaxed text-pretty text-muted-foreground lg:col-span-5 lg:justify-self-end">
            Builds, previews, delivery and observability run on one platform, so your team spends its time in
            the code instead of the pipeline.
          </p>
        </div>

        <SpotlightGrid className="mt-14 sm:mt-16" gridClassName="sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCell key={feature.title} feature={feature} />
          ))}
        </SpotlightGrid>
      </Container>
    </section>
  );
}

function FeatureCell({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article
      data-spotlight-cell
      className="group/cell relative flex flex-col bg-surface p-6 transition-colors duration-300 hover:bg-surface-raised sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--cell-x, 50%) var(--cell-y, 50%), var(--glow-cell), transparent 65%)",
        }}
      />

      <div className="relative flex size-11 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-indigo-soft shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition duration-300 group-hover/cell:border-indigo-soft/40 group-hover/cell:text-cyan-soft group-hover/cell:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_0_28px_-6px_var(--indigo)]">
        <Icon aria-hidden="true" className="size-5" strokeWidth={1.6} />
      </div>

      <h3 className="relative mt-7 text-[17px] font-semibold tracking-[-0.01em] text-foreground">
        {feature.title}
      </h3>
      <p className="relative mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
        {feature.description}
      </p>

      <div className="relative mt-auto pt-8">
        <p className="border-t border-border pt-4 font-mono text-[12px] break-words text-subtle-foreground transition-colors duration-300 group-hover/cell:text-muted-foreground">
          {feature.spec}
        </p>
      </div>
    </article>
  );
}

function SectionRule() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 mx-auto h-px max-w-[75rem] bg-linear-to-r from-transparent via-border-strong to-transparent"
    />
  );
}

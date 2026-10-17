import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";

interface PageHeaderProps {
  /** Id for the h1, which labels the section. */
  titleId: string;
  label: string;
  /** Shown after the label, for example a version badge. */
  meta?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  children?: ReactNode;
}

/** Title band for secondary pages: the hero's grid and glow, at a quieter scale. */
export function PageHeader({ titleId, label, meta, title, description, children }: PageHeaderProps) {
  return (
    <section aria-labelledby={titleId} className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_80%_at_20%_0%,#000_30%,transparent_75%)]" />
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(50% 65% at 8% -10%, var(--glow-indigo), transparent 70%)",
              "radial-gradient(38% 50% at 88% -4%, var(--glow-violet), transparent 70%)",
            ].join(", "),
          }}
        />
        <div className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 mx-auto h-px max-w-[75rem] bg-linear-to-r from-transparent via-border-strong to-transparent" />
      </div>

      <Container className="pt-14 pb-14 sm:pt-20 sm:pb-16 lg:pt-24">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="flex items-center gap-2 type-label text-subtle-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-indigo-light shadow-[0_0_8px_var(--indigo)]"
            />
            {label}
          </p>
          {meta}
        </div>
        <h1 id={titleId} className="mt-5 max-w-4xl text-[clamp(2.5rem,6.2vw,4.5rem)] type-display">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl sm:leading-relaxed">
          {description}
        </p>
        {children}
      </Container>
    </section>
  );
}

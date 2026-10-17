import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_30%_10%,#000_30%,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 45% at 20% 0%, var(--glow-indigo), transparent 70%)" }}
      />

      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center py-24">
        <p className="font-mono text-[13px] text-subtle-foreground">
          <span className="text-warn">404</span> · route not found · served from IAD in 3 ms
        </p>
        <h1 id="not-found-title" className="mt-5 max-w-3xl text-[clamp(2.5rem,7vw,5rem)] type-display">
          This route hasn&apos;t shipped yet.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
          The page you asked for isn&apos;t deployed. Check the address, or head back to the homepage.
        </p>
        <div className="mt-10">
          <Link href="/" className={buttonVariants({ variant: "ghost", size: "lg" })}>
            <ArrowLeft aria-hidden="true" />
            Back to homepage
          </Link>
        </div>
      </Container>
    </section>
  );
}

import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

/** A faceted arrowhead in a dive, with a hot leading edge. */
export function LogoMark({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn("size-7", className)} {...props}>
      <path d="M16 2.5 4.5 12.2 16 29.5Z" className="fill-indigo-light" />
      <path d="M16 2.5 27.5 12.2 16 29.5Z" className="fill-indigo" />
      <path d="M16 18.6 19.4 15.2 16 29.5 12.6 15.2Z" className="fill-cyan" opacity="0.9" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em] [font-stretch:112%]">
        {siteConfig.name}
      </span>
    </span>
  );
}

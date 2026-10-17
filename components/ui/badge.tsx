import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] leading-4 font-medium ring-1 ring-inset",
  {
    variants: {
      tone: {
        neutral: "bg-white/[0.04] text-muted-foreground ring-border",
        accent: "bg-indigo/15 text-indigo-light ring-indigo/35",
        live: "bg-live/10 text-live ring-live/25",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

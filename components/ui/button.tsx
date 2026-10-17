import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,box-shadow,translate] duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-foreground text-background hover:bg-white",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(0_0_0/0.5)]",
        ],
        ghost: [
          "border border-border bg-white/[0.03] text-foreground",
          "hover:border-border-strong hover:bg-white/[0.07]",
        ],
        subtle: "bg-white/[0.05] text-muted-foreground hover:bg-white/[0.09] hover:text-foreground",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] [&_svg]:size-3.5",
        md: "h-11 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-5 text-[15px] [&_svg]:size-4",
        icon: "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

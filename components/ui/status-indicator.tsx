import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

interface StatusIndicatorProps {
  label?: string;
  className?: string;
}

export function StatusIndicator({ label = siteConfig.status, className }: StatusIndicatorProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-live motion-safe:animate-ping-slow" />
        <span className="relative size-2 rounded-full bg-live shadow-[0_0_10px_rgb(52_211_153/0.7)]" />
      </span>
      <span>{label}</span>
    </span>
  );
}

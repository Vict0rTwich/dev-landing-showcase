import { cn } from "@/lib/utils";

export interface Readout {
  label: string;
  value: string;
  unit?: string;
  note: string;
}

/** A row of instrument readouts: mono label, large figure, short note. */
export function Readouts({ items, className }: { items: Readout[]; className?: string }) {
  return (
    <dl className={cn("grid max-w-2xl grid-cols-3 gap-3 sm:gap-6", className)}>
      {items.map((item) => (
        <div key={item.label} className="border-l border-border pl-3 sm:pl-4">
          <dt className="min-h-8 type-label text-subtle-foreground">{item.label}</dt>
          <dd className="mt-2 text-[1.5rem] leading-none font-semibold tracking-[-0.03em] [font-stretch:112%] tabular-nums sm:text-[1.75rem]">
            {item.value}
            {item.unit && (
              <span className={cn("text-[0.6em] text-muted-foreground", item.unit !== "%" && "ml-1")}>
                {item.unit}
              </span>
            )}
          </dd>
          <dd className="mt-2 text-[13px] leading-snug text-muted-foreground">{item.note}</dd>
        </div>
      ))}
    </dl>
  );
}

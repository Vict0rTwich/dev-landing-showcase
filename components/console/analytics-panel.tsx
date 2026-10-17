"use client";

import { useId, useState, type KeyboardEvent, type PointerEvent } from "react";

import { analytics, deployment } from "@/lib/data/deployment";
import { cn } from "@/lib/utils";

type Point = readonly [x: number, y: number];

const { hourly, yMax, yTicks, firstHour } = analytics;
const lastIndex = hourly.length - 1;
const xTicks = [0, 6, 12, 18, lastIndex];

/* Chart geometry lives in a 0–100 box; the SVG stretches and strokes stay 2px. */
const points: Point[] = hourly.map((value, index) => [(index / lastIndex) * 100, 100 - (value / yMax) * 100]);
const linePath = monotonePath(points);
const areaPath = `${linePath}L100,100L0,100Z`;

function yPosition(value: number) {
  return 100 - (value / yMax) * 100;
}

function hourLabel(index: number) {
  return `${String((firstHour + index) % 24).padStart(2, "0")}:00`;
}

function tickLabel(value: number) {
  return value === 0 ? "0" : `${value}K`;
}

export function AnalyticsPanel() {
  return (
    <div className="flex h-full flex-col gap-5 p-4 sm:p-6">
      <dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {analytics.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-white/[0.02] px-3.5 py-3">
            <dt className="text-[12px] text-muted-foreground">{kpi.label}</dt>
            <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className="text-xl font-semibold tracking-tight [font-stretch:108%] tabular-nums">
                {kpi.value}
              </span>
              <span
                className={cn(
                  "font-mono text-[11px]",
                  kpi.trend === "good" ? "text-live" : "text-subtle-foreground",
                )}
              >
                {kpi.delta}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <RequestsChart />
    </div>
  );
}

function RequestsChart() {
  const [active, setActive] = useState<number | null>(null);
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradientId = `requests-fill-${reactId}`;
  const titleId = `requests-title-${reactId}`;

  function indexFromPointer(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - bounds.left) / bounds.width;
    return Math.min(lastIndex, Math.max(0, Math.round(ratio * lastIndex)));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, (current: number) => number> = {
      ArrowLeft: (current) => Math.max(0, current - 1),
      ArrowRight: (current) => Math.min(lastIndex, current + 1),
      Home: () => 0,
      End: () => lastIndex,
    };

    if (event.key === "Escape") {
      setActive(null);
      return;
    }

    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setActive((current) => move(current ?? lastIndex));
  }

  const activePoint = active === null ? null : points[active];
  const tooltipShift = activePoint === null ? 0 : activePoint[0] < 18 ? 0 : activePoint[0] > 82 ? -100 : -50;

  return (
    <figure className="flex min-h-[13.5rem] flex-1 flex-col">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span id={titleId} className="text-sm font-medium text-foreground">
          Requests per hour
        </span>
        <span className="text-[12px] text-subtle-foreground">Last 24 hours</span>
      </figcaption>

      <div className="relative mt-3 min-h-[9.5rem] flex-1">
        <div aria-hidden="true" className="absolute top-0 bottom-6 left-0 w-8">
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="absolute right-0 -translate-y-1/2 font-mono text-[11px] text-subtle-foreground tabular-nums"
              style={{ top: `${yPosition(tick)}%` }}
            >
              {tickLabel(tick)}
            </span>
          ))}
        </div>

        <div aria-hidden="true" className="absolute right-0 bottom-0 left-10 h-6">
          {xTicks.map((index) => (
            <span
              key={index}
              className={cn(
                "absolute top-1.5 font-mono text-[11px] text-subtle-foreground",
                index === 0 ? "" : index === lastIndex ? "-translate-x-full" : "-translate-x-1/2",
              )}
              style={{ left: `${(index / lastIndex) * 100}%` }}
            >
              {index === lastIndex ? "Now" : hourLabel(index)}
            </span>
          ))}
        </div>

        <div
          role="group"
          aria-roledescription="chart"
          aria-labelledby={titleId}
          aria-describedby={`${titleId}-hint`}
          tabIndex={0}
          onPointerMove={(event) => setActive(indexFromPointer(event))}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((current) => current ?? lastIndex)}
          onBlur={() => setActive(null)}
          onKeyDown={handleKeyDown}
          className="absolute top-0 right-0 bottom-6 left-10 cursor-crosshair touch-pan-y rounded-sm focus-visible:outline-offset-4"
        >
          <span id={`${titleId}-hint`} className="sr-only">
            Use the left and right arrow keys to read hourly values.
          </span>

          {yTicks.map((tick) => (
            <span
              key={tick}
              aria-hidden="true"
              className="absolute inset-x-0 h-px bg-border"
              style={{ top: `${yPosition(tick)}%` }}
            />
          ))}

          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--chart-series)", stopOpacity: 0.22 }} />
                <stop offset="100%" style={{ stopColor: "var(--chart-series)", stopOpacity: 0.02 }} />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            <path
              d={linePath}
              fill="none"
              className="stroke-chart"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Deploy marker on the newest hour */}
          <span aria-hidden="true" className="absolute top-0 right-0 bottom-0 w-px bg-indigo-soft/45" />
          <span
            aria-hidden="true"
            className="absolute -top-1 right-2 font-mono text-[10px] text-subtle-foreground"
          >
            deploy {deployment.commit.sha}
          </span>

          <span
            aria-hidden="true"
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart ring-2 ring-surface"
            style={{ left: "100%", top: `${points[lastIndex][1]}%` }}
          />

          {activePoint && active !== null && (
            <>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-0 bottom-0 w-px bg-foreground/25"
                style={{ left: `${activePoint[0]}%` }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart ring-2 ring-surface"
                style={{ left: `${activePoint[0]}%`, top: `${activePoint[1]}%` }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1 z-10 rounded-md border border-border-strong bg-surface-raised/95 px-2.5 py-1.5 whitespace-nowrap shadow-lg"
                style={{ left: `${activePoint[0]}%`, transform: `translateX(${tooltipShift}%)` }}
              >
                <p className="font-mono text-[13px] font-medium text-foreground tabular-nums">
                  {hourly[active]}K
                </p>
                <p className="text-[11px] text-muted-foreground">requests at {hourLabel(active)}</p>
              </div>
            </>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {active !== null ? `${hourLabel(active)}: ${hourly[active]} thousand requests` : ""}
        </p>
      </div>

      <table className="sr-only">
        <caption>Requests per hour over the last 24 hours, in thousands</caption>
        <thead>
          <tr>
            <th scope="col">Hour</th>
            <th scope="col">Requests (thousands)</th>
          </tr>
        </thead>
        <tbody>
          {hourly.map((value, index) => (
            <tr key={hourLabel(index)}>
              <td>{hourLabel(index)}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Monotone cubic interpolation (Fritsch–Carlson): smooth, and never overshoots the data. */
function monotonePath(input: readonly Point[]): string {
  const n = input.length;
  if (n < 2) return "";

  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    slopes.push((input[i + 1][1] - input[i][1]) / (input[i + 1][0] - input[i][0]));
  }

  const tangents: number[] = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    const before = slopes[i - 1];
    const after = slopes[i];
    tangents.push(before * after <= 0 ? 0 : (2 * before * after) / (before + after));
  }
  tangents.push(slopes[n - 2]);

  const round = (value: number) => Math.round(value * 100) / 100;
  let path = `M${round(input[0][0])},${round(input[0][1])}`;

  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = input[i];
    const [x1, y1] = input[i + 1];
    const third = (x1 - x0) / 3;
    path += `C${round(x0 + third)},${round(y0 + tangents[i] * third)} ${round(x1 - third)},${round(y1 - tangents[i + 1] * third)} ${round(x1)},${round(y1)}`;
  }

  return path;
}

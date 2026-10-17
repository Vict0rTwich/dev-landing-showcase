"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ListTree } from "lucide-react";

import type { DocsNavGroup, DocsNavItem } from "@/lib/data/docs";
import { cn } from "@/lib/utils";

interface DocsSidebarProps {
  groups: DocsNavGroup[];
  /** Shown under the links on large screens. */
  footer?: ReactNode;
}

function flatten(groups: DocsNavGroup[]): DocsNavItem[] {
  return groups.flatMap((group) => group.items.flatMap((item) => [item, ...(item.children ?? [])]));
}

/** The last heading that has scrolled up to the sticky header, measured against its scroll-margin. */
function useActiveSection(ids: string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);
  const key = ids.join(" ");

  useEffect(() => {
    const headings = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (headings.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (parseFloat(getComputedStyle(headings[0]).scrollMarginTop) || 96) + 8;
      const root = document.documentElement;
      const atBottom = window.innerHeight + Math.ceil(window.scrollY) >= root.scrollHeight - 2;

      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > offset) break;
        current = heading.id;
      }
      setActiveId(atBottom ? headings[headings.length - 1].id : current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return activeId;
}

/**
 * Section navigation for the docs page. Large screens get the full list in a sticky column;
 * small screens get a sticky bar naming the current section, which expands into the same list.
 */
export function DocsSidebar({ groups, footer }: DocsSidebarProps) {
  const items = flatten(groups);
  const activeId = useActiveSection(items.map((item) => item.id));
  const activeLabel = items.find((item) => item.id === activeId)?.label;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  return (
    <nav ref={rootRef} aria-label="Documentation">
      <div className="relative lg:hidden">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex h-12 w-full items-center gap-3 rounded-xl border border-border-strong bg-surface/85 px-4 text-left shadow-[0_18px_40px_-24px_rgb(0_0_0/0.9)] backdrop-blur-xl backdrop-saturate-150"
        >
          <ListTree aria-hidden="true" className="size-4 shrink-0 text-indigo-soft" />
          <span className="shrink-0 type-label text-subtle-foreground">On this page</span>
          <span className="min-w-0 flex-1 truncate text-sm text-foreground">{activeLabel}</span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="sections"
              id={panelId}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-0 top-full mt-2 max-h-[min(30rem,calc(100svh-var(--header-height)-6rem))] scrollbar-thin overflow-y-auto overscroll-contain rounded-xl border border-border-strong bg-surface/95 p-5 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl"
            >
              <SectionLinks groups={groups} activeId={activeId} onNavigate={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden scrollbar-thin overflow-y-auto pr-2 lg:block lg:max-h-[calc(100svh-var(--header-height)-4.5rem)]">
        <SectionLinks groups={groups} activeId={activeId} />
        {footer}
      </div>
    </nav>
  );
}

interface SectionLinksProps {
  groups: DocsNavGroup[];
  activeId: string | undefined;
  onNavigate?: () => void;
}

function SectionLinks({ groups, activeId, onNavigate }: SectionLinksProps) {
  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="type-label text-subtle-foreground">{group.title}</p>
          <ul className="mt-3 border-l border-border">
            {group.items.map((item) => (
              <li key={item.id}>
                <SectionLink
                  item={item}
                  active={item.id === activeId}
                  containsActive={item.children?.some((child) => child.id === activeId)}
                  onNavigate={onNavigate}
                />
                {item.children && (
                  <ol className="pb-1">
                    {item.children.map((child, index) => (
                      <li key={child.id}>
                        <SectionLink
                          item={child}
                          step={index + 1}
                          active={child.id === activeId}
                          onNavigate={onNavigate}
                        />
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface SectionLinkProps {
  item: DocsNavItem;
  active: boolean;
  containsActive?: boolean;
  /** Numbered sub-steps sit one level in. */
  step?: number;
  onNavigate?: () => void;
}

function SectionLink({ item, active, containsActive, step, onNavigate }: SectionLinkProps) {
  return (
    <a
      href={`#${item.id}`}
      onClick={onNavigate}
      aria-current={active ? "location" : undefined}
      className={cn(
        "relative flex items-baseline gap-2.5 py-1.5 transition-colors",
        // The lit segment of the rail marks the current section.
        "before:absolute before:inset-y-1 before:left-[-1px] before:w-px before:rounded-full before:bg-indigo-light before:opacity-0 before:shadow-[0_0_10px_1px_var(--indigo)] before:transition-opacity",
        step === undefined ? "pl-4 text-sm" : "pl-7 text-[13px]",
        active
          ? "text-foreground before:opacity-100"
          : containsActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
      )}
    >
      {step !== undefined && (
        <span aria-hidden="true" className="font-mono text-[11px] text-subtle-foreground tabular-nums">
          {String(step).padStart(2, "0")}
        </span>
      )}
      {item.label}
    </a>
  );
}

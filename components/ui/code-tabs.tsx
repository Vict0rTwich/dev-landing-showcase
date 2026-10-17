"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";

import { CodeLines, codeBodyClassName, codeFrameClassName } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { getCopyText } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export interface CodeTab {
  label: string;
  /** A shell transcript, as in CodeBlock. */
  code: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  /** Names the tab list, for example "Package manager". */
  label: string;
  className?: string;
}

/** Shell samples that differ only by tool, such as one install command per package manager. */
export function CodeTabs({ tabs, label, className }: CodeTabsProps) {
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = tabs[selected];

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;

    event.preventDefault();
    setSelected(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={cn(codeFrameClassName, className)}>
      <div
        role="tablist"
        aria-label={label}
        className="flex h-10 [scrollbar-width:none] items-stretch gap-1 overflow-x-auto border-b border-border pr-12 pl-2"
      >
        {tabs.map((tab, index) => {
          const isSelected = index === selected;
          return (
            <button
              key={tab.label}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setSelected(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "relative shrink-0 px-2.5 font-mono text-[12px] transition-colors focus-visible:outline-offset-[-2px]",
                isSelected ? "text-foreground" : "text-subtle-foreground hover:text-muted-foreground",
              )}
            >
              {tab.label}
              {isSelected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  aria-hidden="true"
                  className="absolute inset-x-2 -bottom-px h-px bg-indigo-light shadow-[0_0_8px_var(--indigo)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
            </button>
          );
        })}
      </div>
      {/* Keyed so the copied state doesn't carry over to the next tab. */}
      <CopyButton
        key={selected}
        value={getCopyText(active.code, "shell")}
        label={`Copy ${active.label} command`}
        className="absolute top-2 right-2.5"
      />
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${selected}`}>
        <pre tabIndex={0} className={codeBodyClassName}>
          <CodeLines code={active.code} language="shell" />
        </pre>
      </div>
    </div>
  );
}

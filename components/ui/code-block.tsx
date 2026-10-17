import { Fragment, type ReactNode } from "react";
import { Check, FileCode, SquareTerminal } from "lucide-react";

import { CopyButton } from "@/components/ui/copy-button";
import { getCopyText, tokenizeLine, type CodeLanguage, type TokenKind } from "@/lib/highlight";
import { cn } from "@/lib/utils";

const tokenStyles: Record<TokenKind, string | undefined> = {
  plain: undefined,
  output: "text-muted-foreground",
  prompt: "text-subtle-foreground select-none",
  flag: "text-cyan-soft",
  string: "text-cyan-soft",
  comment: "text-subtle-foreground",
  keyword: "text-violet",
  type: "text-indigo-soft",
  property: "text-indigo-light",
  number: "text-indigo-light",
  url: "text-indigo-light",
  success: "text-live",
  question: "text-cyan-soft",
};

/** Frame and body shared by single and tabbed samples, so they line up on the page. */
export const codeFrameClassName =
  "relative overflow-hidden rounded-xl border border-border bg-background-deep shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]";

export const codeBodyClassName =
  "scrollbar-thin overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-6 text-foreground focus-visible:outline-offset-[-2px]";

export function CodeLines({ code, language }: { code: string; language: CodeLanguage }) {
  return (
    <code>
      {code.split("\n").map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && "\n"}
          {tokenizeLine(line, language).map((token, tokenIndex) =>
            // An icon instead of the ✓ glyph, which the self-hosted Latin subset doesn't include.
            token.kind === "success" ? (
              <Check
                key={tokenIndex}
                aria-hidden="true"
                strokeWidth={2.5}
                className="inline-block size-3.5 align-[-0.15em] text-live"
              />
            ) : (
              <span
                key={tokenIndex}
                aria-hidden={token.kind === "prompt" || undefined}
                className={tokenStyles[token.kind]}
              >
                {token.text}
              </span>
            ),
          )}
        </Fragment>
      ))}
    </code>
  );
}

interface CodeBlockProps {
  code: string;
  language: CodeLanguage;
  /** File name for the header. Shell transcripts are labelled "Terminal". */
  title?: string;
  className?: string;
}

/** A code sample with a header and a copy button. Shell samples copy only their commands. */
export function CodeBlock({ code, language, title, className }: CodeBlockProps) {
  const shell = language === "shell";
  const label = title ?? (shell ? "Terminal" : language);
  const copyValue = getCopyText(code, language);
  const copyLabel = shell ? (copyValue.includes("\n") ? "Copy commands" : "Copy command") : `Copy ${label}`;
  const Icon = shell ? SquareTerminal : FileCode;

  return (
    <figure className={cn(codeFrameClassName, className)}>
      <figcaption className="flex h-10 items-center gap-2 border-b border-border pr-12 pl-4 font-mono text-[12px] text-subtle-foreground">
        <Icon aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </figcaption>
      <CopyButton value={copyValue} label={copyLabel} className="absolute top-2 right-2.5" />
      <pre tabIndex={0} className={codeBodyClassName}>
        <CodeLines code={code} language={language} />
      </pre>
    </figure>
  );
}

/** Doesn't wrap: a line break inside `--version` would read as two separate dashes. */
export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-md border border-border bg-white/[0.04] px-1.5 py-px font-mono text-[0.875em] whitespace-nowrap text-foreground">
      {children}
    </code>
  );
}

/** Sets the `backticked` parts of a plain string as inline code. */
export function withInlineCode(text: string): ReactNode[] {
  return text
    .split("`")
    .map((part, index) => (index % 2 === 1 ? <InlineCode key={index}>{part}</InlineCode> : part));
}

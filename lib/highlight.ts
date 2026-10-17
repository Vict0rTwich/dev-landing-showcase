/**
 * A small tokenizer for the code samples in the docs and changelog. It knows just
 * enough shell, TOML and TypeScript to tint those samples; it is not a general highlighter.
 *
 * Shell samples are terminal transcripts: lines starting with "$ " are commands,
 * everything else is output. Output lines may start with "✓ " (success) or "? " (a prompt).
 */

export type CodeLanguage = "shell" | "toml" | "ts";

export type TokenKind =
  | "plain"
  | "output"
  | "prompt"
  | "flag"
  | "string"
  | "comment"
  | "keyword"
  | "type"
  | "property"
  | "number"
  | "url"
  | "success"
  | "question";

export interface Token {
  kind: TokenKind;
  text: string;
}

interface Grammar {
  /** Alternatives in priority order, one capture group each. */
  pattern: RegExp;
  /** Token kind for each capture group, in the same order. */
  kinds: TokenKind[];
}

const grammars: Record<Exclude<CodeLanguage, "shell">, Grammar> = {
  toml: {
    pattern:
      /(#.*$)|("(?:[^"\\]|\\.)*")|^(\s*\[[^\]]*\])|^(\s*[\w.-]+)(?=\s*=)|\b(true|false)\b|\b(\d+(?:\.\d+)?)\b/g,
    kinds: ["comment", "string", "keyword", "property", "keyword", "number"],
  },
  ts: {
    pattern:
      /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(async|await|const|default|export|from|function|import|let|new|return|type)\b|\b(Promise|Request|Response)\b|([A-Za-z_$][\w$]*)(?=\s*:)|\b(\d+(?:\.\d+)?)\b/g,
    kinds: ["comment", "string", "keyword", "type", "property", "number"],
  },
};

const commandPattern = /(\s+)|(--?[A-Za-z][\w-]*(?:=\S*)?)|("[^"]*"|'[^']*')|(\S+)/g;
const urlPattern = /(https?:\/\/\S+)/;

function tokenizeWith(line: string, { pattern, kinds }: Grammar): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;

  for (const match of line.matchAll(pattern)) {
    const group = match.findIndex((value, index) => index > 0 && value !== undefined);
    if (match.index > cursor) tokens.push({ kind: "plain", text: line.slice(cursor, match.index) });
    tokens.push({ kind: kinds[group - 1] ?? "plain", text: match[0] });
    cursor = match.index + match[0].length;
  }

  if (cursor < line.length) tokens.push({ kind: "plain", text: line.slice(cursor) });
  return tokens;
}

function tokenizeCommand(command: string): Token[] {
  return Array.from(command.matchAll(commandPattern), ([text, , flag, string]) => ({
    kind: flag ? "flag" : string ? "string" : "plain",
    text,
  }));
}

function tokenizeOutput(line: string): Token[] {
  const tokens: Token[] = [];
  let rest = line;

  if (rest.startsWith("✓ ")) {
    tokens.push({ kind: "success", text: "✓" });
    rest = rest.slice(1);
  } else if (rest.startsWith("? ")) {
    tokens.push({ kind: "question", text: "?" });
    rest = rest.slice(1);
  }

  // Splitting on a capturing pattern keeps the URLs at odd indexes.
  rest.split(urlPattern).forEach((part, index) => {
    if (part) tokens.push({ kind: index % 2 === 1 ? "url" : "output", text: part });
  });
  return tokens;
}

export function tokenizeLine(line: string, language: CodeLanguage): Token[] {
  if (language !== "shell") return tokenizeWith(line, grammars[language]);
  if (line.startsWith("$ ")) return [{ kind: "prompt", text: "$ " }, ...tokenizeCommand(line.slice(2))];
  if (line.startsWith("#")) return [{ kind: "comment", text: line }];
  return tokenizeOutput(line);
}

/** What a copy button puts on the clipboard: for shell transcripts, only the commands. */
export function getCopyText(code: string, language: CodeLanguage): string {
  if (language !== "shell") return code;

  const commands = code
    .split("\n")
    .filter((line) => line.startsWith("$ "))
    .map((line) => line.slice(2));
  return commands.length > 0 ? commands.join("\n") : code;
}

import type { ReactNode } from "react";
import QuizCardNameHover from "../../components/pages/quiz/QuizCardNameHover";

export type RenderFormattedTextOptions = {
  /** Survol des [**noms**] → artwork cropped si match exact en BDD */
  enableCardHover?: boolean;
};

type MarkKind = "card" | "red" | "green" | "bold" | "underline" | "italic";

type MarkPattern = {
  kind: MarkKind;
  /** Regex with one capture group for inner text */
  re: RegExp;
};

/** Ordre important : card avant bold, couleurs avant italic */
const MARK_PATTERNS: MarkPattern[] = [
  { kind: "card", re: /\[\*\*(.+?)\*\*\]/ },
  { kind: "red", re: /\*red\*(.+?)\*red\*/i },
  { kind: "green", re: /\*green\*(.+?)\*green\*/i },
  { kind: "bold", re: /\*\*(.+?)\*\*/ },
  { kind: "underline", re: /__(.+?)__/ },
  { kind: "italic", re: /\*(.+?)\*/ },
];

function findNextMark(
  text: string,
  from: number
): { kind: MarkKind; index: number; length: number; inner: string } | null {
  let best: { kind: MarkKind; index: number; length: number; inner: string } | null =
    null;

  for (const { kind, re } of MARK_PATTERNS) {
    const sliced = text.slice(from);
    const match = re.exec(sliced);
    if (!match || match.index == null) continue;
    const absoluteIndex = from + match.index;
    if (!best || absoluteIndex < best.index) {
      best = {
        kind,
        index: absoluteIndex,
        length: match[0].length,
        inner: match[1],
      };
    }
  }

  return best;
}

/**
 * Markdown léger (sans HTML injecté) :
 * - [**carte**] : gras (+ survol artwork si enableCardHover)
 * - **gras**
 * - __souligné__
 * - *red*rouge*red* (rouge + gras)
 * - *green*vert*green* (vert + gras)
 * - *italique*
 * - nouvelle ligne = <br />
 */
function renderInlineMarks(
  text: string,
  keyPrefix: string,
  options?: RenderFormattedTextOptions
): ReactNode {
  if (!text) return text;

  const enableCardHover = Boolean(options?.enableCardHover);
  const parts: ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  while (cursor < text.length) {
    const next = findNextMark(text, cursor);
    if (!next) {
      parts.push(text.slice(cursor));
      break;
    }

    if (next.index > cursor) {
      parts.push(text.slice(cursor, next.index));
    }

    const markKey = `${keyPrefix}-${next.kind}-${key++}`;
    switch (next.kind) {
      case "card":
        if (enableCardHover) {
          parts.push(<QuizCardNameHover key={markKey} name={next.inner} />);
        } else {
          parts.push(<strong key={markKey}>{next.inner}</strong>);
        }
        break;
      case "red":
        parts.push(
          <strong key={markKey} className="text-red-600">
            {next.inner}
          </strong>
        );
        break;
      case "green":
        parts.push(
          <strong key={markKey} className="text-green-600">
            {next.inner}
          </strong>
        );
        break;
      case "bold":
        parts.push(<strong key={markKey}>{next.inner}</strong>);
        break;
      case "underline":
        parts.push(<u key={markKey}>{next.inner}</u>);
        break;
      case "italic":
        parts.push(<em key={markKey}>{next.inner}</em>);
        break;
    }

    cursor = next.index + next.length;
  }

  if (parts.length === 0) return text;
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return parts;
}

export function renderFormattedText(
  text: string,
  options?: RenderFormattedTextOptions
): ReactNode {
  if (!text) return text;

  const lines = text.split(/\r?\n/);
  if (lines.length === 1) {
    return renderInlineMarks(lines[0], "l0", options);
  }

  return lines.map((line, index) => (
    <span key={`line-${index}`}>
      {index > 0 ? <br /> : null}
      {renderInlineMarks(line, `l${index}`, options)}
    </span>
  ));
}

/** Formatage quiz (cartes [** **] avec survol). */
export function renderInlineBold(text: string): ReactNode {
  return renderFormattedText(text, { enableCardHover: true });
}

import type { ReactNode } from "react";

/**
 * Gras / italique / retours à la ligne (Markdown léger, sans HTML injecté) :
 * - **gras**
 * - *italique*
 * - nouvelle ligne = <br />
 */
function renderInlineMarks(text: string, keyPrefix: string): ReactNode {
  if (!text) return text;

  const parts: ReactNode[] = [];
  const boldRe = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  const pushPlainWithItalic = (plain: string) => {
    if (!plain) return;
    const italicRe = /\*(.+?)\*/g;
    let italicLast = 0;
    let italicMatch: RegExpExecArray | null;
    while ((italicMatch = italicRe.exec(plain)) !== null) {
      if (italicMatch.index > italicLast) {
        parts.push(plain.slice(italicLast, italicMatch.index));
      }
      parts.push(
        <em key={`${keyPrefix}-i-${key++}`}>{italicMatch[1]}</em>
      );
      italicLast = italicMatch.index + italicMatch[0].length;
    }
    if (italicLast === 0) {
      parts.push(plain);
    } else if (italicLast < plain.length) {
      parts.push(plain.slice(italicLast));
    }
  };

  while ((match = boldRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      pushPlainWithItalic(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${keyPrefix}-b-${key++}`}>{match[1]}</strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex === 0) {
    const italicOnly: ReactNode[] = [];
    const italicRe = /\*(.+?)\*/g;
    let italicLast = 0;
    let italicMatch: RegExpExecArray | null;
    let iKey = 0;
    while ((italicMatch = italicRe.exec(text)) !== null) {
      if (italicMatch.index > italicLast) {
        italicOnly.push(text.slice(italicLast, italicMatch.index));
      }
      italicOnly.push(
        <em key={`${keyPrefix}-i-${iKey++}`}>{italicMatch[1]}</em>
      );
      italicLast = italicMatch.index + italicMatch[0].length;
    }
    if (italicLast === 0) return text;
    if (italicLast < text.length) {
      italicOnly.push(text.slice(italicLast));
    }
    return italicOnly;
  }

  if (lastIndex < text.length) {
    pushPlainWithItalic(text.slice(lastIndex));
  }
  return parts;
}

export function renderFormattedText(text: string): ReactNode {
  if (!text) return text;

  const lines = text.split(/\r?\n/);
  if (lines.length === 1) {
    return renderInlineMarks(lines[0], "l0");
  }

  return lines.map((line, index) => (
    <span key={`line-${index}`}>
      {index > 0 ? <br /> : null}
      {renderInlineMarks(line, `l${index}`)}
    </span>
  ));
}

/** @deprecated Prefer renderFormattedText */
export const renderInlineBold = renderFormattedText;

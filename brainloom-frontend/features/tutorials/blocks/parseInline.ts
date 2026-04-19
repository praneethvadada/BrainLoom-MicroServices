// features/tutorials/blocks/parseInline.ts
// Parses a tiny markdown subset into React elements.
// Supported: **bold**, *italic*, `code`, [text](url)

import React from "react";

type Segment =
  | { kind: "text";   content: string }
  | { kind: "bold";   content: string }
  | { kind: "italic"; content: string }
  | { kind: "code";   content: string }
  | { kind: "link";   content: string; href: string };

const TOKEN_RE = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;

function tokenize(text: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(text)) !== null) {
    // Push plain text before this match
    if (match.index > lastIndex) {
      segments.push({ kind: "text", content: text.slice(lastIndex, match.index) });
    }

    const [full, , bold, italic, code, linkText, linkHref] = match;
    if (bold)     segments.push({ kind: "bold",   content: bold });
    else if (italic) segments.push({ kind: "italic", content: italic });
    else if (code)   segments.push({ kind: "code",   content: code });
    else if (linkText && linkHref) segments.push({ kind: "link", content: linkText, href: linkHref });

    lastIndex = match.index + full.length;
  }

  // Trailing plain text
  if (lastIndex < text.length) {
    segments.push({ kind: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

/**
 * parseInline(text) → React.ReactNode[]
 * Converts a string with inline markdown into an array of React elements.
 * Use inside <p> or <span>.
 */
export function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];
  return tokenize(text).map((seg, i) => {
    switch (seg.kind) {
      case "bold":   return React.createElement("strong", { key: i }, seg.content);
      case "italic": return React.createElement("em",     { key: i }, seg.content);
      case "code":   return React.createElement("code",   { key: i, className: "bg-gray-100 text-pink-600 px-1 py-0.5 rounded text-[0.85em] font-mono" }, seg.content);
      case "link":   return React.createElement("a",      { key: i, href: seg.href, className: "text-blue-600 hover:text-blue-800 underline underline-offset-2 transition", target: seg.href.startsWith("http") ? "_blank" : "_self", rel: "noopener noreferrer" }, seg.content);
      default:       return seg.content;
    }
  });
}

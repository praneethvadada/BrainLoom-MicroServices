"use client";
// features/tutorials/blocks/BlockRenderer.tsx
// Reads blocks array and renders the right component for each type.
// Used on /tutorials/[...slug] for both public users and admins.

import React, { useState } from "react";
import { Block } from "../block.types";
import { parseInline } from "./parseInline";

// ── Heading ───────────────────────────────────────────────────────────────────
function HeadingBlock({ data }: { data: any }) {
  const Tag = `h${data.level ?? 2}` as "h1" | "h2" | "h3";
  const cls = {
    h1: "text-3xl font-black text-gray-900 mt-8 mb-3 tracking-tight",
    h2: "text-2xl font-bold text-gray-900 mt-7 mb-2",
    h3: "text-xl font-semibold text-gray-800 mt-5 mb-2",
  }[Tag];
  return <Tag className={cls}>{parseInline(data.text)}</Tag>;
}

// ── Paragraph ─────────────────────────────────────────────────────────────────
function ParagraphBlock({ data }: { data: any }) {
  return (
    <p className="text-gray-700 leading-relaxed text-[0.95rem] mb-4">
      {parseInline(data.text)}
    </p>
  );
}

// ── Code ──────────────────────────────────────────────────────────────────────
function CodeBlock({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-gray-400 text-xs font-mono">{data.language || "code"}</span>
        <button onClick={copy} className="text-gray-400 hover:text-white text-xs transition">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 px-5 py-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{data.code}</code>
      </pre>
    </div>
  );
}

// ── Code Tabs ─────────────────────────────────────────────────────────────────
function CodeTabsBlock({ data }: { data: any }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const tabs: { lang: string; code: string }[] = data.tabs || [];
  const active = tabs[activeIdx];
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(active?.code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex items-center bg-gray-800 overflow-x-auto">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setActiveIdx(i)}
            className={`px-4 py-2 text-xs font-mono transition whitespace-nowrap ${
              i === activeIdx ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"
            }`}>
            {t.lang}
          </button>
        ))}
        <button onClick={copy} className="text-gray-400 hover:text-white text-xs transition ml-auto pr-4">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-gray-900 text-gray-100 px-5 py-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code>{active?.code || ""}</code>
      </pre>
    </div>
  );
}

// ── Image ─────────────────────────────────────────────────────────────────────
function ImageBlock({ data }: { data: any }) {
  if (!data.url) return (
    <div className="my-6 flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 text-sm">
      🖼 No image URL set
    </div>
  );
  return (
    <figure className="my-6">
      <img src={data.url} alt={data.alt || data.caption || ""} className="w-full rounded-xl border border-gray-200 shadow-sm max-h-[480px] object-contain bg-gray-50" />
      {data.caption && <figcaption className="text-center text-gray-400 text-sm mt-2">{data.caption}</figcaption>}
    </figure>
  );
}

// ── Carousel ──────────────────────────────────────────────────────────────────
function CarouselBlock({ data }: { data: any }) {
  const images: { url: string; caption?: string }[] = (data.images || []).filter((img: any) => !!img.url);
  const [idx, setIdx] = useState(0);
  if (!images.length) return (
    <div className="my-6 flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 text-sm">
      ⊞ No images added yet
    </div>
  );
  const img = images[idx];

  return (
    <figure className="my-6 select-none">
      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
        <img src={img.url} alt={img.caption || `Slide ${idx + 1}`} className="w-full max-h-[480px] object-contain" />
        {images.length > 1 && (
          <>
            <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition">‹</button>
            <button onClick={() => setIdx(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition">›</button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button key={i} onClick={() => setIdx(i)}
                  className={`w-2 h-2 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {img.caption && <figcaption className="text-center text-gray-400 text-sm mt-2">{img.caption}</figcaption>}
      {images.length > 1 && <p className="text-center text-gray-300 text-xs mt-1">{idx + 1} / {images.length}</p>}
    </figure>
  );
}

// ── Note ──────────────────────────────────────────────────────────────────────
const NOTE_STYLES = {
  info:    { bg: "bg-blue-50",   border: "border-blue-200",  icon: "ℹ️",  label: "Note",    text: "text-blue-800"  },
  warning: { bg: "bg-amber-50",  border: "border-amber-300", icon: "⚠️",  label: "Warning", text: "text-amber-800" },
  tip:     { bg: "bg-green-50",  border: "border-green-200", icon: "💡",  label: "Tip",     text: "text-green-800" },
};

function NoteBlock({ data }: { data: any }) {
  const s = NOTE_STYLES[data.variant as keyof typeof NOTE_STYLES] ?? NOTE_STYLES.info;
  return (
    <div className={`my-5 ${s.bg} border ${s.border} rounded-xl px-5 py-4`}>
      <div className={`flex items-center gap-2 font-semibold text-sm mb-1.5 ${s.text}`}>
        <span>{s.icon}</span><span>{s.label}</span>
      </div>
      <p className={`text-sm leading-relaxed ${s.text}`}>{parseInline(data.text)}</p>
    </div>
  );
}

// ── Example ───────────────────────────────────────────────────────────────────
function ExampleBlock({ data }: { data: any }) {
  return (
    <div className="my-5 bg-purple-50 border border-purple-200 rounded-xl px-5 py-4">
      {data.title && <p className="font-semibold text-purple-800 text-sm mb-1.5">✦ {data.title}</p>}
      <p className="text-purple-900 text-sm leading-relaxed">{parseInline(data.text)}</p>
    </div>
  );
}

// ── Link Block (coding problem) ───────────────────────────────────────────────
const PLATFORM_BADGE: Record<string, { label: string; color: string }> = {
  leetcode: { label: "LeetCode",  color: "bg-orange-100 text-orange-700 border-orange-200" },
  codechef: { label: "CodeChef",  color: "bg-amber-100 text-amber-700 border-amber-200"   },
  gfg:      { label: "GFG",       color: "bg-green-100 text-green-700 border-green-200"   },
  custom:   { label: "Practice",  color: "bg-blue-100 text-blue-700 border-blue-200"      },
};

function LinkBlock({ data }: { data: any }) {
  const badge = PLATFORM_BADGE[data.platform] ?? PLATFORM_BADGE.custom;
  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer"
      className="my-4 flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group block">
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${badge.color}`}>
        {badge.label}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition text-sm">{data.title}</p>
        {data.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{data.description}</p>}
        {data.tags?.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {data.tags.map((t: string, i: number) => (
              <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        )}
      </div>
      <span className="text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-0.5">→</span>
    </a>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
function DividerBlock() {
  return <hr className="my-8 border-gray-200" />;
}

// ── Main Renderer ─────────────────────────────────────────────────────────────
export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  if (!blocks.length) return null;

  return (
    <div className="block-renderer">
      {blocks.map(block => {
        switch (block.type) {
          case "heading":    return <HeadingBlock    key={block.id} data={block.data} />;
          case "paragraph":  return <ParagraphBlock  key={block.id} data={block.data} />;
          case "code":       return <CodeBlock       key={block.id} data={block.data} />;
          case "code_tabs":  return <CodeTabsBlock   key={block.id} data={block.data} />;
          case "image":      return <ImageBlock      key={block.id} data={block.data} />;
          case "carousel":   return <CarouselBlock   key={block.id} data={block.data} />;
          case "note":       return <NoteBlock       key={block.id} data={block.data} />;
          case "example":    return <ExampleBlock    key={block.id} data={block.data} />;
          case "link_block": return <LinkBlock       key={block.id} data={block.data} />;
          case "divider":    return <DividerBlock    key={block.id} />;
          default:           return null;
        }
      })}
    </div>
  );
}

// features/tutorials/block.types.ts

export type BlockType =
  | "heading"
  | "paragraph"
  | "code"
  | "code_tabs"
  | "image"
  | "carousel"
  | "note"
  | "example"
  | "link_block"
  | "divider";

export interface Block {
  id:           number;
  topic_id:     number;
  type:         BlockType;
  order_no:     number;
  data:         BlockData;
  is_published: number;
  created_at:   string;
  updated_at:   string;
}

// ── Per-type data payloads ────────────────────────────────────────────────────

export interface HeadingData    { level: 1 | 2 | 3; text: string }
export interface ParagraphData  { text: string }
export interface CodeData       { language: string; code: string }
export interface CodeTabsData   { tabs: { lang: string; code: string }[] }
export interface ImageData      { url: string; caption?: string; alt?: string }
export interface CarouselData   { images: { url: string; caption?: string }[] }
export interface NoteData       { variant: "info" | "warning" | "tip"; text: string }
export interface ExampleData    { title?: string; text: string }
export interface LinkBlockData  { platform: "leetcode" | "codechef" | "gfg" | "custom"; url: string; title: string; tags?: string[]; description?: string }
export interface DividerData    {}

export type BlockData =
  | HeadingData
  | ParagraphData
  | CodeData
  | CodeTabsData
  | ImageData
  | CarouselData
  | NoteData
  | ExampleData
  | LinkBlockData
  | DividerData;

// ── Default data for each type (used in block picker) ────────────────────────
export const BLOCK_DEFAULTS: Record<BlockType, BlockData> = {
  heading:    { level: 2, text: "" },
  paragraph:  { text: "" },
  code:       { language: "javascript", code: "" },
  code_tabs:  { tabs: [{ lang: "javascript", code: "" }] },
  image:      { url: "", caption: "", alt: "" },
  carousel:   { images: [{ url: "", caption: "" }] },
  note:       { variant: "info", text: "" },
  example:    { title: "", text: "" },
  link_block: { platform: "leetcode", url: "", title: "", tags: [], description: "" },
  divider:    {},
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading:    "Heading",
  paragraph:  "Paragraph",
  code:       "Code Block",
  code_tabs:  "Code Tabs",
  image:      "Image",
  carousel:   "Image Carousel",
  note:       "Note Box",
  example:    "Example Box",
  link_block: "Problem Link",
  divider:    "Divider",
};

export const BLOCK_ICONS: Record<BlockType, string> = {
  heading:    "H",
  paragraph:  "¶",
  code:       "</>",
  code_tabs:  "⊕",
  image:      "🖼",
  carousel:   "⊞",
  note:       "📌",
  example:    "✦",
  link_block: "🔗",
  divider:    "—",
};

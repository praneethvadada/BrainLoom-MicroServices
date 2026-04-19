"use client";
// features/tutorials/blocks/BlockEditor.tsx
// Admin-only block editor for a tutorial domain page.
// Features: add block (picker), edit inline, reorder (up/down), delete.

import React, { useState, useEffect, useCallback } from "react";
import { Block, BlockType, BlockData, BLOCK_DEFAULTS, BLOCK_LABELS, BLOCK_ICONS } from "../block.types";
import BlockRenderer from "./BlockRenderer";
import S3ImageUploader from "./S3ImageUploader";
import { api } from "@/lib/axios";

// ── API helpers ───────────────────────────────────────────────────────────────
const blockApi = {
  list:   (topicId: number) => api.get(`/topic-blocks?topic_id=${topicId}`),
  create: (payload: object) => api.post(`/topic-blocks`, payload),
  update: (id: number, payload: object) => api.put(`/topic-blocks/${id}`, payload),
  delete: (id: number) => api.delete(`/topic-blocks/${id}`),
  reorder:(updates: {id:number;order_no:number}[]) => api.patch(`/topic-blocks/reorder`, { updates }),
};

// ── Block Picker ──────────────────────────────────────────────────────────────
function BlockPicker({ onPick, onClose }: { onPick: (type: BlockType) => void; onClose: () => void }) {
  const types: BlockType[] = [
    "heading", "paragraph", "code", "code_tabs",
    "image", "carousel", "note", "example", "link_block", "divider"
  ];

  return (
    <div className="my-2 bg-white border border-blue-200 rounded-2xl shadow-lg p-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Block</p>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-xs transition">✕</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
        {types.map(t => (
          <button key={t} onClick={() => onPick(t)}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition text-center group">
            <span className="text-lg font-mono text-gray-400 group-hover:text-blue-600 transition">{BLOCK_ICONS[t]}</span>
            <span className="text-[10px] font-medium text-gray-500 group-hover:text-blue-700">{BLOCK_LABELS[t]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Individual block editors ──────────────────────────────────────────────────

function HeadingEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="flex gap-2">
      <select value={data.level} onChange={e => onChange({ ...data, level: Number(e.target.value) })}
        className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option>
      </select>
      <input type="text" value={data.text} onChange={e => onChange({ ...data, text: e.target.value })}
        placeholder="Heading text…"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
  );
}

function ParagraphEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div>
      {/* Inline format mini-toolbar */}
      <div className="flex gap-1 mb-1.5">
        {[
          { label: "B",  wrap: "**" },
          { label: "I",  wrap: "*"  },
          { label: "``", wrap: "`"  },
        ].map(({ label, wrap }) => (
          <button key={label}
            onMouseDown={e => {
              e.preventDefault();
              const ta = document.getElementById("para-editor") as HTMLTextAreaElement | null;
              if (!ta) return;
              const { selectionStart: s, selectionEnd: end } = ta;
              const selected = data.text.slice(s, end);
              const newText = data.text.slice(0, s) + wrap + selected + wrap + data.text.slice(end);
              onChange({ ...data, text: newText });
            }}
            className="px-2 py-0.5 text-xs font-bold border border-gray-200 rounded hover:bg-gray-100 text-gray-600 transition">
            {label}
          </button>
        ))}
        <button
          onMouseDown={e => {
            e.preventDefault();
            const ta = document.getElementById("para-editor") as HTMLTextAreaElement | null;
            if (!ta) return;
            const { selectionStart: s, selectionEnd: end } = ta;
            const selected = data.text.slice(s, end) || "link text";
            const url = prompt("URL:");
            if (!url) return;
            const newText = data.text.slice(0, s) + `[${selected}](${url})` + data.text.slice(end);
            onChange({ ...data, text: newText });
          }}
          className="px-2 py-0.5 text-xs border border-gray-200 rounded hover:bg-gray-100 text-blue-600 transition">🔗 Link</button>
        <span className="text-gray-300 text-xs ml-auto self-center">
          **bold** *italic* `code` [text](url)
        </span>
      </div>
      <textarea id="para-editor" value={data.text} onChange={e => onChange({ ...data, text: e.target.value })}
        rows={4} placeholder="Write paragraph text… use **bold**, *italic*, `code`, [text](url)"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none font-mono" />
    </div>
  );
}

function CodeEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <input type="text" value={data.language} onChange={e => onChange({ ...data, language: e.target.value })}
        placeholder="Language (javascript, python…)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <textarea value={data.code} onChange={e => onChange({ ...data, code: e.target.value })}
        rows={8} placeholder="// Code here…"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
    </div>
  );
}

function CodeTabsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const [active, setActive] = useState(0);
  const tabs: { lang: string; code: string }[] = data.tabs || [];

  const updateTab = (i: number, field: string, val: string) => {
    const newTabs = tabs.map((t, idx) => idx === i ? { ...t, [field]: val } : t);
    onChange({ ...data, tabs: newTabs });
  };
  const addTab = () => onChange({ ...data, tabs: [...tabs, { lang: "language", code: "" }] });
  const removeTab = (i: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((_, idx) => idx !== i);
    onChange({ ...data, tabs: newTabs });
    setActive(Math.min(active, newTabs.length - 1));
  };

  return (
    <div>
      <div className="flex gap-1 mb-2 flex-wrap">
        {tabs.map((t, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <button onClick={() => setActive(i)}
              className={`px-3 py-1 text-xs rounded-l-lg border transition ${i === active ? "bg-blue-600 text-white border-blue-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {t.lang || `Tab ${i+1}`}
            </button>
            <button onClick={() => removeTab(i)} className="px-1.5 py-1 text-xs border border-l-0 border-gray-200 rounded-r-lg text-red-400 hover:bg-red-50 transition">✕</button>
          </div>
        ))}
        <button onClick={addTab} className="px-3 py-1 text-xs border border-dashed border-blue-300 text-blue-500 rounded-lg hover:bg-blue-50 transition">+ Tab</button>
      </div>
      <input type="text" value={tabs[active]?.lang || ""} onChange={e => updateTab(active, "lang", e.target.value)}
        placeholder="Language name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <textarea value={tabs[active]?.code || ""} onChange={e => updateTab(active, "code", e.target.value)}
        rows={8} placeholder="// Code here…"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
    </div>
  );
}

function ImageEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-3">
      <S3ImageUploader
        onUploaded={url => onChange({ ...data, url })}
        currentUrl={data.url}
        label="Click to upload image"
      />
      <input
        type="text"
        value={data.caption || ""}
        onChange={e => onChange({ ...data, caption: e.target.value })}
        placeholder="Caption (optional)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        value={data.alt || ""}
        onChange={e => onChange({ ...data, alt: e.target.value })}
        placeholder="Alt text (accessibility)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function CarouselEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const images: { url: string; caption?: string }[] = data.images || [];
  const updateCaption = (i: number, caption: string) => {
    onChange({ ...data, images: images.map((img, idx) => idx === i ? { ...img, caption } : img) });
  };
  const addSlot = () => onChange({ ...data, images: [...images, { url: "", caption: "" }] });
  const remove = (i: number) => onChange({ ...data, images: images.filter((_, idx) => idx !== i) });
  const setUrl = (i: number, url: string) => {
    onChange({ ...data, images: images.map((img, idx) => idx === i ? { ...img, url } : img) });
  };

  return (
    <div className="space-y-3">
      {images.map((img, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-400">Slide {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xs transition">Remove</button>
          </div>
          <S3ImageUploader
            onUploaded={url => setUrl(i, url)}
            currentUrl={img.url}
            label={`Upload slide ${i + 1}`}
          />
          <input
            type="text"
            value={img.caption || ""}
            onChange={e => updateCaption(i, e.target.value)}
            placeholder="Caption (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      ))}
      <button
        onClick={addSlot}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition">
        + Add slide
      </button>
    </div>
  );
}

function NoteEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <select value={data.variant} onChange={e => onChange({ ...data, variant: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="info">ℹ️ Info</option>
        <option value="warning">⚠️ Warning</option>
        <option value="tip">💡 Tip</option>
      </select>
      <textarea value={data.text} onChange={e => onChange({ ...data, text: e.target.value })}
        rows={3} placeholder="Note text… supports **bold** *italic* `code` [link](url)"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
    </div>
  );
}

function ExampleEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <input type="text" value={data.title || ""} onChange={e => onChange({ ...data, title: e.target.value })}
        placeholder="Example title (optional)" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <textarea value={data.text} onChange={e => onChange({ ...data, text: e.target.value })}
        rows={4} placeholder="Example content… supports **bold** *italic* `code` [link](url)"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
    </div>
  );
}

function LinkBlockEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-2">
      <select value={data.platform} onChange={e => onChange({ ...data, platform: e.target.value })}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
        <option value="leetcode">LeetCode</option>
        <option value="codechef">CodeChef</option>
        <option value="gfg">GeeksForGeeks</option>
        <option value="custom">Custom</option>
      </select>
      <input type="text" value={data.title} onChange={e => onChange({ ...data, title: e.target.value })}
        placeholder="Problem title" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input type="url" value={data.url} onChange={e => onChange({ ...data, url: e.target.value })}
        placeholder="Problem URL" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input type="text" value={(data.tags || []).join(", ")} onChange={e => onChange({ ...data, tags: e.target.value.split(",").map((t: string) => t.trim()).filter(Boolean) })}
        placeholder="Tags (comma-separated): array, dp, greedy" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <textarea value={data.description || ""} onChange={e => onChange({ ...data, description: e.target.value })}
        rows={2} placeholder="Short description (optional)"
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
    </div>
  );
}

// ── Editor dispatcher ─────────────────────────────────────────────────────────
function BlockDataEditor({ type, data, onChange }: { type: BlockType; data: any; onChange: (d: any) => void }) {
  switch (type) {
    case "heading":    return <HeadingEditor    data={data} onChange={onChange} />;
    case "paragraph":  return <ParagraphEditor  data={data} onChange={onChange} />;
    case "code":       return <CodeEditor       data={data} onChange={onChange} />;
    case "code_tabs":  return <CodeTabsEditor   data={data} onChange={onChange} />;
    case "image":      return <ImageEditor      data={data} onChange={onChange} />;
    case "carousel":   return <CarouselEditor   data={data} onChange={onChange} />;
    case "note":       return <NoteEditor       data={data} onChange={onChange} />;
    case "example":    return <ExampleEditor    data={data} onChange={onChange} />;
    case "link_block": return <LinkBlockEditor  data={data} onChange={onChange} />;
    case "divider":    return <p className="text-gray-400 text-sm text-center py-2">— Divider (no settings) —</p>;
    default:           return <p className="text-gray-400 text-sm">Unknown block type</p>;
  }
}

// ── Single editable block card ────────────────────────────────────────────────
function EditableBlock({ block, index, total, onSave, onDelete, onMoveUp, onMoveDown }: {
  block: Block; index: number; total: number;
  onSave: (id: number, data: BlockData) => Promise<void>;
  onDelete: (id: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState<any>(block.data);
  const [saving, setSaving]   = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(block.id, draft);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="group border border-gray-200 rounded-2xl bg-white hover:border-gray-300 transition overflow-hidden">
      {/* Block header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-mono text-gray-400 bg-white border border-gray-200 px-2 py-0.5 rounded-lg">
          {BLOCK_ICONS[block.type]} {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1 ml-auto">
          {/* Reorder */}
          <button disabled={index === 0}         onClick={() => onMoveUp(index)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition border border-gray-200 rounded-lg hover:bg-white">↑</button>
          <button disabled={index === total - 1} onClick={() => onMoveDown(index)}
            className="px-2 py-1 text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30 transition border border-gray-200 rounded-lg hover:bg-white">↓</button>
          {/* Edit toggle */}
          <button onClick={() => { setEditing(e => !e); setDraft(block.data); }}
            className={`px-3 py-1 text-xs font-medium border rounded-lg transition ${editing ? "bg-amber-500 text-white border-amber-500" : "border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700"}`}>
            {editing ? "Cancel" : "Edit"}
          </button>
          {/* Delete */}
          <button onClick={() => onDelete(block.id)}
            className="px-2 py-1 text-xs text-red-400 hover:text-red-600 border border-gray-200 hover:border-red-300 rounded-lg transition">🗑</button>
        </div>
      </div>

      <div className="p-4">
        {editing ? (
          <>
            <BlockDataEditor type={block.type} data={draft} onChange={setDraft} />
            {/* Preview while editing */}
            {draft && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">Preview</p>
                <BlockRenderer blocks={[{ ...block, data: draft }]} />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(false)} className="px-4 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition">
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </>
        ) : (
          <BlockRenderer blocks={[block]} />
        )}
      </div>
    </div>
  );
}

// ── Main Block Editor ─────────────────────────────────────────────────────────
export default function BlockEditor({ topicId }: { topicId: number }) {
  const [blocks,      setBlocks]      = useState<Block[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [pickerAt,    setPickerAt]    = useState<number | null>(null); // insert-after index (-1 = top)
  const [addingType,  setAddingType]  = useState<BlockType | null>(null);
  const [newData,     setNewData]     = useState<any>({});
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await blockApi.list(topicId);
      setBlocks(res.data.blocks || []);
    } catch { setError("Failed to load blocks"); }
    finally { setLoading(false); }
  }, [topicId]);

  useEffect(() => { load(); }, [load]);

  // ── Save edit ─────────────────────────────────────────────────────────────
  const handleSave = async (id: number, data: BlockData) => {
    await blockApi.update(id, { data });
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, data } : b));
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this block?")) return;
    await blockApi.delete(id);
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  // ── Move up/down (swap order_no) ──────────────────────────────────────────
  const handleMove = async (index: number, dir: "up" | "down") => {
    const swapIdx = dir === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= blocks.length) return;

    const newBlocks  = [...blocks];
    const orderA = newBlocks[index].order_no;
    const orderB = newBlocks[swapIdx].order_no;

    // Swap order_no values
    newBlocks[index]  = { ...newBlocks[index],  order_no: orderB };
    newBlocks[swapIdx] = { ...newBlocks[swapIdx], order_no: orderA };

    setBlocks(dir === "up"
      ? [...newBlocks.slice(0, swapIdx), newBlocks[index], newBlocks[swapIdx], ...newBlocks.slice(index + 1)]
      : [...newBlocks.slice(0, index), newBlocks[swapIdx], newBlocks[index], ...newBlocks.slice(swapIdx + 1)]
    );

    await blockApi.reorder([
      { id: newBlocks[index].id,   order_no: orderB },
      { id: newBlocks[swapIdx].id, order_no: orderA },
    ]);
  };

  // ── Add block ─────────────────────────────────────────────────────────────
  const openPicker = (afterIndex: number) => {
    setPickerAt(afterIndex);
    setAddingType(null);
    setNewData({});
  };

  const pickType = (type: BlockType) => {
    setAddingType(type);
    setNewData({ ...(BLOCK_DEFAULTS[type] as any) });
  };

  const confirmAdd = async () => {
    if (!addingType || pickerAt === null) return;
    setSaving(true);
    try {
      // Compute order_no: midpoint between surrounding blocks
      let order_no = 1;
      if (pickerAt === -1) {
        order_no = blocks.length ? blocks[0].order_no - 1 : 0;
      } else if (pickerAt >= blocks.length - 1) {
        order_no = blocks.length ? blocks[blocks.length - 1].order_no + 1 : 1;
      } else {
        order_no = (blocks[pickerAt].order_no + blocks[pickerAt + 1].order_no) / 2;
      }

      const res = await blockApi.create({ topic_id: topicId, type: addingType, data: newData, order_no });
      const newBlock: Block = {
        id: res.data.id, topic_id: topicId, type: addingType,
        order_no, data: newData, is_published: 1,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };

      // Insert in the right position
      const insertIdx = pickerAt === -1 ? 0 : pickerAt + 1;
      setBlocks(prev => [...prev.slice(0, insertIdx), newBlock, ...prev.slice(insertIdx)]);
      setPickerAt(null); setAddingType(null); setNewData({});
    } catch (e: any) { setError(e?.response?.data?.message || "Failed to create block."); }
    finally { setSaving(false); }
  };

  // ── Add button ────────────────────────────────────────────────────────────
  const AddButton = ({ afterIndex }: { afterIndex: number }) => (
    <div className="flex items-center justify-center py-1">
      <button onClick={() => openPicker(afterIndex)}
        className="flex items-center gap-1 text-xs text-gray-300 hover:text-blue-500 border border-dashed border-gray-200 hover:border-blue-300 rounded-lg px-3 py-1 transition">
        + Add block
      </button>
    </div>
  );

  if (loading) return <div className="text-gray-400 text-sm animate-pulse py-8 text-center">Loading blocks…</div>;

  return (
    <div className="space-y-1">
      {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-2">{error}</p>}

      {/* Insert at top */}
      <AddButton afterIndex={-1} />
      {pickerAt === -1 && (
        <BlockPicker onPick={pickType} onClose={() => setPickerAt(null)} />
      )}
      {pickerAt === -1 && addingType && (
        <NewBlockForm type={addingType} data={newData} onChange={setNewData}
          onConfirm={confirmAdd} onCancel={() => { setPickerAt(null); setAddingType(null); }} saving={saving} />
      )}

      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm">
          No content yet — click "+ Add block" to start
        </div>
      )}

      {blocks.map((block, index) => (
        <React.Fragment key={block.id}>
          <EditableBlock
            block={block} index={index} total={blocks.length}
            onSave={handleSave} onDelete={handleDelete}
            onMoveUp={i => handleMove(i, "up")}
            onMoveDown={i => handleMove(i, "down")}
          />
          <AddButton afterIndex={index} />
          {pickerAt === index && (
            <BlockPicker onPick={pickType} onClose={() => setPickerAt(null)} />
          )}
          {pickerAt === index && addingType && (
            <NewBlockForm type={addingType} data={newData} onChange={setNewData}
              onConfirm={confirmAdd} onCancel={() => { setPickerAt(null); setAddingType(null); }} saving={saving} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── New block form (shown after picker type is selected) ──────────────────────
function NewBlockForm({ type, data, onChange, onConfirm, onCancel, saving }: {
  type: BlockType; data: any; onChange: (d: any) => void;
  onConfirm: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-700">{BLOCK_ICONS[type]} New {BLOCK_LABELS[type]}</span>
        <button onClick={onCancel} className="text-blue-400 hover:text-blue-700 text-xs">Cancel</button>
      </div>
      <BlockDataEditor type={type} data={data} onChange={onChange} />
      {data && type !== "divider" && (
        <div className="pt-2 border-t border-blue-200">
          <p className="text-[10px] text-blue-400 mb-1 uppercase tracking-wider font-semibold">Preview</p>
          <div className="bg-white rounded-xl p-3 border border-blue-100">
            <BlockRenderer blocks={[{ id: 0, topic_id: 0, type, data, order_no: 0, is_published: 1, created_at: "", updated_at: "" }]} />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-xl transition">Cancel</button>
        <button onClick={onConfirm} disabled={saving}
          className="px-6 py-1.5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition">
          {saving ? "Adding…" : "Add Block"}
        </button>
      </div>
    </div>
  );
}

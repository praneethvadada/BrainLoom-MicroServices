"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { tutorialService, Domain, titleToSlug } from "@/features/tutorials/tutorial.service";
import BlockRenderer from "@/features/tutorials/blocks/BlockRenderer";
import BlockEditor from "@/features/tutorials/blocks/BlockEditor";
import { Block } from "@/features/tutorials/block.types";
import { api } from "@/lib/axios";


// ── SVG Icons ─────────────────────────────────────────────────────────────────
// All SVG icons include width/height HTML attrs so browsers never fall back to 300×150 default
const FolderIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
  </svg>
);
const FileIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
  </svg>
);
const EditIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const PlusIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const ChevronRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Edit form ─────────────────────────────────────────────────────────────────
function EditDomainForm({ domain, onSave, onCancel }: {
  domain: Domain; onSave: (u: Partial<Domain>) => void; onCancel: () => void;
}) {
  const [title, setTitle]   = useState(domain.title);
  const [desc, setDesc]     = useState(domain.description ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const handleSave = async () => {
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true); setError("");
    try {
      await tutorialService.updateDomain(domain.id, { title: title.trim(), description: desc.trim() || undefined });
      onSave({ title: title.trim(), description: desc.trim() || null });
    } catch (e: any) { setError(e?.response?.data?.message || "Save failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <EditIcon className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">Editing: {domain.title}</span>
        </div>
        <button onClick={onCancel} className="text-amber-500 hover:text-amber-800 text-sm transition">Discard</button>
      </div>
      <div className="px-6 py-5 space-y-4">
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
          <input autoFocus type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Content <span className="normal-case font-normal text-gray-400">— up to ~100 words</span>
          </label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={6}
            placeholder="Write the content for this domain…"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition resize-none" />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onCancel} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl transition shadow-sm">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add sub-domain form ───────────────────────────────────────────────────────
function AddSubDomainForm({ parentId, onAdded, onCancel }: {
  parentId: number; onAdded: (d: Domain) => void; onCancel: () => void;
}) {
  const [title, setTitle]           = useState("");
  const [slug, setSlug]             = useState("");
  const [desc, setDesc]             = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");

  const handleTitleChange = (v: string) => { setTitle(v); if (!slugManual) setSlug(titleToSlug(v)); };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) { setError("Title and slug are required."); return; }
    setSaving(true); setError("");
    try {
      const { id } = await tutorialService.createDomain({
        parent_id: parentId, title: title.trim(), slug: slug.trim(),
        description: desc.trim() || undefined, is_published: 0,
      });
      onAdded({ id, parent_id: parentId, title: title.trim(), slug: slug.trim(),
        description: desc.trim() || null, full_path: "", order_no: 0,
        is_published: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      setTitle(""); setSlug(""); setDesc(""); setSlugManual(false);
      onCancel();
    } catch (e: any) { setError(e?.response?.data?.message || "Create failed."); }
    finally { setSaving(false); }
  };

  return (
    <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">New Sub-Domain</span>
        </div>
        <button onClick={onCancel} className="text-blue-400 hover:text-blue-700 text-sm transition">Cancel</button>
      </div>
      <div className="px-6 py-5 space-y-4">
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
            <input autoFocus type="text" value={title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="e.g. Variables"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">URL Slug</label>
            <input type="text" value={slug} onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="variables"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Content <span className="normal-case font-normal text-gray-400">(optional)</span>
          </label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
            placeholder="Brief overview of this sub-domain…"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none" />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onCancel} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-sm">
            {saving ? "Creating…" : "Create Sub-Domain"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-domain card ───────────────────────────────────────────────────────────
function SubDomainCard({ child, childHref, isAdminUser, onDelete }: {
  child: Domain; childHref: string; isAdminUser: boolean; onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl bg-white overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
      {/* Main clickable area */}
      <Link href={childHref} className="flex items-start gap-4 p-5 flex-1">
        <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <FolderIcon className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition capitalize leading-tight">
            {child.title}
          </h3>
          {child.description ? (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{child.description}</p>
          ) : (
            <p className="text-gray-300 text-xs mt-1 italic">No description</p>
          )}
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-0.5" />
      </Link>

      {/* Admin actions — only shown to admin, as a full-width bottom bar */}
      {isAdminUser && (
        <div className="flex items-center border-t border-gray-100 bg-gray-50">
          <Link
            href={childHref}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition flex-1 justify-center border-r border-gray-100"
          >
            <EditIcon className="w-3.5 h-3.5" />
            Edit
          </Link>
          <button
            onClick={() => onDelete(child.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition flex-1 justify-center"
          >
            <TrashIcon className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TutorialDomainPage() {
  const rawParams   = useParams();
  const router      = useRouter();
  const { isAdmin, scope } = useAuth();
  const isAdminUser = isAdmin && scope === "tutorial";

  const slugParts: string[] = Array.isArray(rawParams.slug)
    ? rawParams.slug
    : rawParams.slug ? [rawParams.slug as string] : [];
  const slugPath = slugParts.join("/");

  const breadcrumbs = [
    { label: "Tutorials", href: "/tutorials" },
    ...slugParts.map((part, i) => ({
      label: part.replace(/-/g, " "),
      href:  "/tutorials/" + slugParts.slice(0, i + 1).join("/"),
    })),
  ];

  const [topic,    setTopic]    = useState<Domain | null>(null);
  const [children, setChildren] = useState<Domain[]>([]);
  const [blocks,   setBlocks]   = useState<Block[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mode,     setMode]     = useState<"view" | "editing" | "adding">("view");


  const load = useCallback(async () => {
    if (!slugPath) { setNotFound(true); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await tutorialService.getBySlugPath(slugPath);
      if (!data) { setNotFound(true); return; }
      setTopic(data.topic);
      setChildren(Array.isArray(data.children) ? data.children : []);
      // Load content blocks for this topic
      try {
        const blockRes = await api.get(`/topic-blocks?topic_id=${data.topic.id}`);
        setBlocks(blockRes.data.blocks || []);
      } catch { setBlocks([]); }
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }, [slugPath]);


  useEffect(() => { load(); }, [load]);

  const handleDeleteCurrent = async () => {
    if (!topic || !confirm(`Delete "${topic.title}" and all its sub-domains? This cannot be undone.`)) return;
    await tutorialService.deleteDomain(topic.id);
    const upSlug = slugParts.slice(0, -1).join("/");
    router.push(upSlug ? `/tutorials/${upSlug}` : "/tutorials");
  };

  const handleChildDelete = async (id: number) => {
    if (!confirm("Delete this sub-domain and all its children?")) return;
    await tutorialService.deleteDomain(id);
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm animate-pulse">Loading…</p>
    </div>
  );

  if (notFound || !topic) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-2">
        <FileIcon className="w-6 h-6 text-gray-300" />
      </div>
      <h1 className="text-gray-900 font-bold text-2xl">Domain Not Found</h1>
      <p className="text-gray-400 text-sm">"{slugPath}" doesn't exist.</p>
      <Link href="/tutorials" className="mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition">
        ← Back to Tutorials
      </Link>
    </div>
  );

  const isLeaf = children.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Admin toolbar ──────────────────────────────────────────────────── */}
      {isAdminUser && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <EditIcon className="w-3 h-3" /> Admin Mode
            </span>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => setMode(mode === "editing" ? "view" : "editing")}
                className={`flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-lg border transition ${
                  mode === "editing"
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-700"
                }`}>
                <EditIcon className="w-3.5 h-3.5" />
                {mode === "editing" ? "Cancel" : "Edit Content"}
              </button>
              <button
                onClick={() => setMode(mode === "adding" ? "view" : "adding")}
                className={`flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-lg border transition ${
                  mode === "adding"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700"
                }`}>
                <PlusIcon className="w-3.5 h-3.5" />
                {mode === "adding" ? "Cancel" : "Add Sub-Domain"}
              </button>
            </div>
            <button
              onClick={handleDeleteCurrent}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-gray-200 hover:border-red-300 px-4 py-1.5 rounded-lg transition ml-auto">
              <TrashIcon className="w-3.5 h-3.5" />
              Delete This Domain
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        <nav className="flex items-center gap-1 text-sm mb-8 flex-wrap">
          {breadcrumbs.map((b, i) => (
            <span key={b.href} className="flex items-center gap-1">
              {i > 0 && <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
              {i < breadcrumbs.length - 1 ? (
                <Link href={b.href} className="text-gray-400 hover:text-blue-600 transition capitalize">{b.label}</Link>
              ) : (
                <span className="text-gray-800 font-semibold capitalize">{b.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* ── Edit form ────────────────────────────────────────────────────── */}
        {isAdminUser && mode === "editing" && (
          <EditDomainForm domain={topic}
            onSave={u => { setTopic(p => p ? { ...p, ...u } : p); setMode("view"); }}
            onCancel={() => setMode("view")} />
        )}

        {/* ── Domain header card ───────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLeaf ? "bg-purple-50" : "bg-blue-50"}`}>
              {isLeaf
                ? <FileIcon className="w-5 h-5 text-purple-500" />
                : <FolderIcon className="w-5 h-5 text-blue-500" />}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 capitalize tracking-tight">{topic.title}</h1>
              <p className="text-gray-400 text-xs font-mono mt-0.5">/{topic.full_path}</p>
            </div>
          </div>

          {/* Content */}
          {topic.description && mode !== "editing" && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-gray-600 text-sm leading-relaxed">{topic.description}</p>
            </div>
          )}
        </div>

        {/* ── Add sub-domain form ──────────────────────────────────────────── */}
        {isAdminUser && mode === "adding" && (
          <AddSubDomainForm parentId={topic.id}
            onAdded={d => { setChildren(p => [...p, d]); setMode("view"); }}
            onCancel={() => setMode("view")} />
        )}

        {/* ── Content Blocks ───────────────────────────────────────────────── */}
        {(blocks.length > 0 || isAdminUser) && (
          <section className="mb-8">
            {isAdminUser ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page Content</h2>
                </div>
                <BlockEditor topicId={topic.id} />
              </>
            ) : blocks.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <BlockRenderer blocks={blocks} />
              </div>
            ) : null}
          </section>
        )}

        {/* ── Sub-domains ──────────────────────────────────────────────────── */}
        {children.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Sub-Domains <span className="text-gray-300 font-normal">({children.length})</span>
              </h2>
              {isAdminUser && mode !== "adding" && (
                <button onClick={() => setMode("adding")}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition">
                  <PlusIcon className="w-3.5 h-3.5" /> Add
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {children.map(child => (
                <SubDomainCard
                  key={child.id}
                  child={child}
                  childHref={`/tutorials/${slugParts.join("/")}/${child.slug}`}
                  isAdminUser={isAdminUser}
                  onDelete={handleChildDelete}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {children.length === 0 && mode !== "adding" && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <FolderIcon className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {topic.description ? "No sub-domains — this is a leaf domain." : "No content or sub-domains yet."}
            </p>
            {isAdminUser && (
              <button onClick={() => setMode("adding")}
                className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition mx-auto">
                <PlusIcon className="w-4 h-4" /> Add Sub-Domain
              </button>
            )}
          </div>
        )}

        {/* ── Back navigation ──────────────────────────────────────────────── */}
        {slugParts.length > 1 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <Link href={"/tutorials/" + slugParts.slice(0, -1).join("/")}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to <span className="capitalize">{slugParts[slugParts.length - 2].replace(/-/g, " ")}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

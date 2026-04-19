"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { tutorialService, Domain, titleToSlug } from "@/features/tutorials/tutorial.service";

// ── Icons — explicit width/height prevents SVG expansion in flex containers ───
type IconProps = { className?: string; size?: number };
const FolderIcon = ({ className = "", size = 20 }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
  </svg>
);
const PlusIcon = ({ className = "", size = 14 }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const EditIcon = ({ className = "", size = 14 }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = ({ className = "", size = 14 }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ArrowRightIcon = ({ className = "", size = 16 }: IconProps) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

// ── Add root domain form ──────────────────────────────────────────────────────
function AddRootDomainForm({ onAdded, onCancel }: { onAdded: (d: Domain) => void; onCancel: () => void }) {
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
        parent_id: null, title: title.trim(), slug: slug.trim(),
        description: desc.trim() || undefined, is_published: 0,
      });
      onAdded({ id, parent_id: null, title: title.trim(), slug: slug.trim(),
        description: desc.trim() || null, full_path: slug.trim(),
        order_no: 0, is_published: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      onCancel();
    } catch (e: any) { setError(e?.response?.data?.message || "Failed to create."); }
    finally { setSaving(false); }
  };

  return (
    <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between px-6 py-4 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <PlusIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">New Root Domain</span>
        </div>
        <button onClick={onCancel} className="text-blue-400 hover:text-blue-700 text-sm transition">Cancel</button>
      </div>
      <div className="px-6 py-5 space-y-4">
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
            <input autoFocus type="text" value={title} onChange={e => handleTitleChange(e.target.value)}
              placeholder="e.g. Python" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">URL Slug</label>
            <input type="text" value={slug} onChange={e => { setSlugManual(true); setSlug(e.target.value); }}
              placeholder="python" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Content <span className="normal-case font-normal text-gray-400">(optional)</span></label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief overview…"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none" />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onCancel} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-xl transition">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-sm">
            {saving ? "Creating…" : "Create Domain"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Root domain card ──────────────────────────────────────────────────────────
function DomainCard({ domain, isAdminUser, onDelete }: {
  domain: Domain; isAdminUser: boolean; onDelete: (id: number) => void;
}) {
  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl bg-white overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
      <Link href={`/tutorials/${domain.slug}`} className="flex items-start gap-4 p-5 flex-1">
        <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <FolderIcon className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900 group-hover:text-blue-600 transition capitalize leading-tight">{domain.title}</h2>
          {domain.description ? (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">{domain.description}</p>
          ) : (
            <p className="text-gray-300 text-xs mt-1 italic">No description</p>
          )}
        </div>
        <ArrowRightIcon className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition flex-shrink-0 mt-0.5" />
      </Link>
      {isAdminUser && (
        <div className="flex items-center border-t border-gray-100 bg-gray-50">
          <Link href={`/tutorials/${domain.slug}`}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-amber-700 hover:bg-amber-50 transition flex-1 justify-center border-r border-gray-100">
            <EditIcon className="w-3.5 h-3.5" /> Edit
          </Link>
          <button onClick={() => onDelete(domain.id)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition flex-1 justify-center">
            <TrashIcon className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TutorialsPage() {
  const { isAdmin, scope } = useAuth();
  const isAdminUser = isAdmin && scope === "tutorial";

  const [domains,  setDomains]  = useState<Domain[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    tutorialService.getRootDomains()
      .then(d => setDomains(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this domain and all its sub-domains?")) return;
    await tutorialService.deleteDomain(id);
    setDomains(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin toolbar */}
      {isAdminUser && (
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <EditIcon className="w-3 h-3" /> Admin Mode
            </span>
            <button onClick={() => setShowForm(s => !s)}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-1.5 rounded-lg border transition ${
                showForm ? "bg-blue-600 border-blue-600 text-white" : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700"
              }`}>
              <PlusIcon className="w-3.5 h-3.5" />
              {showForm ? "Cancel" : "Add Root Domain"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tutorials</h1>
          <p className="text-gray-500 mt-2 text-sm">Select a domain to explore topics and sub-domains</p>
        </div>

        {isAdminUser && showForm && (
          <AddRootDomainForm
            onAdded={d => { setDomains(prev => [...prev, d]); setShowForm(false); }}
            onCancel={() => setShowForm(false)} />
        )}

        {loading && <div className="text-gray-400 text-center py-20 animate-pulse">Loading domains…</div>}

        {!loading && domains.length === 0 && !showForm && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FolderIcon className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold">No domains yet</p>
            {isAdminUser && <p className="text-gray-400 text-sm mt-1">Click "Add Root Domain" above to get started</p>}
          </div>
        )}

        {!loading && domains.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map(domain => (
              <DomainCard key={domain.id} domain={domain} isAdminUser={isAdminUser} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
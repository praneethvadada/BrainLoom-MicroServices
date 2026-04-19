"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/features/auth/auth.service";

const SCOPES = ["tutorial", "cyber", "premium", "analytics"];

const SCOPE_COLORS: Record<string, string> = {
  tutorial:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  cyber:     "bg-green-500/10 text-green-400 border-green-500/20",
  premium:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  analytics: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  all:       "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

interface AdminRecord {
  id:         number;
  name:       string;
  email:      string;
  phone:      string | null;
  scope:      string;
  is_super:   number;
  created_at: string;
}

export default function ManageAdminsPage() {
  const router = useRouter();
  const { user, isSuper, hasHydrated, logout } = useAuth();

  const [admins, setAdmins]   = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Create form
  const [showCreate, setShowCreate]     = useState(false);
  const [form, setForm]                 = useState({ name: "", email: "", password: "", scope: "tutorial", phone: "" });
  const [creating, setCreating]         = useState(false);
  const [createError, setCreateError]   = useState("");

  // Force-reset modal
  const [resetTarget, setResetTarget]   = useState<AdminRecord | null>(null);
  const [resetPass, setResetPass]       = useState("");
  const [resetting, setResetting]       = useState(false);
  const [resetError, setResetError]     = useState("");

  // ── Auth guard ─────────────────────────────────────────────
  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !isSuper) router.replace("/superadmin/login");
  }, [hasHydrated, user, isSuper]);

  // ── Data ───────────────────────────────────────────────────
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await authService.listAdmins();
      setAdmins(data ?? []);
    } catch { setError("Failed to load admins."); }
    finally   { setLoading(false); }
  };

  useEffect(() => { if (isSuper) fetchAdmins(); }, [isSuper]);

  // ── Actions ────────────────────────────────────────────────
  const handleDelete = async (admin: AdminRecord) => {
    if (!confirm(`Delete "${admin.name}" (${admin.email})? This cannot be undone.`)) return;
    try {
      await authService.deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete.");
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password || !form.scope) {
      setCreateError("Name, email, password and scope are required."); return;
    }
    setCreating(true); setCreateError("");
    try {
      await authService.createAdmin(form);
      setForm({ name: "", email: "", password: "", scope: "tutorial", phone: "" });
      setShowCreate(false);
      fetchAdmins();
    } catch (err: any) {
      setCreateError(err?.response?.data?.message || "Failed to create admin.");
    } finally { setCreating(false); }
  };

  const handleForceReset = async () => {
    if (!resetPass || resetPass.length < 8) { setResetError("Min 8 characters"); return; }
    setResetting(true); setResetError("");
    try {
      await authService.forceResetPassword(resetTarget!.id, resetPass);
      setResetTarget(null); setResetPass("");
    } catch (err: any) {
      setResetError(err?.response?.data?.message || "Failed to reset password.");
    } finally { setResetting(false); }
  };

  // ── Loading state (before hydration) ──────────────────────
  if (!hasHydrated) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-white/20 text-sm animate-pulse">Loading…</div>
    </div>
  );

  if (!user || !isSuper) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <div className="relative border-b border-white/5 bg-white/2 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/superadmin/dashboard"
              className="text-white/30 hover:text-white text-sm transition flex items-center gap-1"
            >
              ← Dashboard
            </Link>
            <span className="text-white/10">/</span>
            <span className="font-bold text-white">Manage Admins</span>
          </div>
          <button
            onClick={() => { setShowCreate(true); setCreateError(""); }}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition shadow-lg shadow-violet-600/20"
          >
            + New Admin
          </button>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Service Admins</h1>
          <p className="text-white/30 mt-1">
            All admin accounts across BrainLoom services. {admins.length > 0 && `(${admins.length} total)`}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-white/20 text-center py-20 animate-pulse">Fetching admins…</div>
        )}

        {/* Admin List */}
        {!loading && (
          <div className="space-y-3">
            {admins.length === 0 && (
              <div className="text-white/20 text-center py-16 bg-white/2 rounded-2xl border border-white/5">
                No service admins yet. Click <strong>+ New Admin</strong> to create one.
              </div>
            )}
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white/3 border border-white/8 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-lg flex-shrink-0">
                    {admin.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2 flex-wrap">
                      {admin.name}
                      {admin.is_super === 1 && (
                        <span className="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">
                          ⭐ Super Admin
                        </span>
                      )}
                    </div>
                    <div className="text-white/40 text-sm">{admin.email}</div>
                    <div className="text-white/20 text-xs mt-0.5">
                      Created {new Date(admin.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  {/* Scope badge */}
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${SCOPE_COLORS[admin.scope] ?? SCOPE_COLORS.tutorial}`}>
                    {admin.scope}
                  </span>

                  {/* Force reset */}
                  <button
                    onClick={() => { setResetTarget(admin); setResetPass(""); setResetError(""); }}
                    className="text-white/30 hover:text-yellow-400 text-sm transition px-3 py-1.5 rounded-lg hover:bg-yellow-500/10 font-medium"
                  >
                    Reset Pwd
                  </button>

                  {/* Delete — never delete super admins */}
                  {admin.is_super !== 1 && (
                    <button
                      onClick={() => handleDelete(admin)}
                      className="text-white/30 hover:text-red-400 text-sm transition px-3 py-1.5 rounded-lg hover:bg-red-500/10 font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Admin Modal ──────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black mb-1">Create Service Admin</h2>
            <p className="text-white/30 text-sm mb-6">New admin account for a specific service.</p>

            {createError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{createError}</div>
            )}

            <div className="space-y-4">
              {[
                { label: "Full Name",         key: "name",     type: "text",     placeholder: "Jane Doe" },
                { label: "Email Address",      key: "email",    type: "email",    placeholder: "admin@brainloom.com" },
                { label: "Password",           key: "password", type: "password", placeholder: "Min 8 characters" },
                { label: "Phone (optional)",   key: "phone",    type: "tel",      placeholder: "+91 9999999999" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-white/30 text-xs font-bold uppercase tracking-widest mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-white/15 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-white/30 text-xs font-bold uppercase tracking-widest mb-1.5">Service Scope</label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm((prev) => ({ ...prev, scope: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-violet-500 transition text-sm"
                >
                  {SCOPES.map((s) => (
                    <option key={s} value={s} className="bg-[#111118]">{s}</option>
                  ))}
                </select>
                <p className="text-white/20 text-xs mt-1.5">This admin can ONLY login to the {form.scope} portal.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 border border-white/10 text-white/40 hover:text-white py-3 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                {creating ? "Creating…" : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Force Reset Password Modal ──────────────────────── */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111118] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-black mb-1">Force Reset Password</h2>
            <p className="text-white/30 text-sm mb-6">
              Setting new password for{" "}
              <span className="text-white font-semibold">{resetTarget.email}</span>
            </p>

            {resetError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{resetError}</div>
            )}

            <input
              type="password"
              value={resetPass}
              onChange={(e) => setResetPass(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/15 rounded-xl px-4 py-3 outline-none focus:border-yellow-500 transition mb-4 text-sm"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 border border-white/10 text-white/40 hover:text-white py-3 rounded-xl transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleForceReset}
                disabled={resetting}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm"
              >
                {resetting ? "Resetting…" : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

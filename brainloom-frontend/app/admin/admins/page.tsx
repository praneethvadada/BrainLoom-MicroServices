"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";

const SCOPES = ["tutorial", "premium", "analytics"];

const SCOPE_COLORS: Record<string, string> = {
  tutorial:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  premium:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  analytics: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  all:       "bg-green-500/10 text-green-400 border-green-500/20",
};

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  scope: string;
  is_super: number;
  created_at: string;
}

export default function ManageAdminsPage() {
  return (
    <ProtectedRoute role="admin">
      <ManageAdminsContent />
    </ProtectedRoute>
  );
}

function ManageAdminsContent() {
  const router = useRouter();
  const { user } = useAuthStore();
  const is_super = (user as any)?.is_super;

  // Redirect non-super admins immediately
  useEffect(() => {
    if (user && !is_super) router.replace("/admin/dashboard");
  }, [user]);

  const [admins, setAdmins]   = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", scope: "tutorial", phone: "" });
  const [creating, setCreating]     = useState(false);
  const [createError, setCreateError] = useState("");

  // Force reset modal
  const [resetTarget, setResetTarget]   = useState<Admin | null>(null);
  const [resetPass, setResetPass]       = useState("");
  const [resetting, setResetting]       = useState(false);
  const [resetError, setResetError]     = useState("");

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await authService.listAdmins();
      setAdmins(data);
    } catch { setError("Failed to load admins."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Delete admin "${admin.name}" (${admin.email})? This cannot be undone.`)) return;
    try {
      await authService.deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete admin.");
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
      alert("Password reset successfully.");
    } catch (err: any) {
      setResetError(err?.response?.data?.message || "Failed to reset password.");
    } finally { setResetting(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Top Bar */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-white transition text-sm">
              ← Dashboard
            </Link>
            <span className="text-slate-600">/</span>
            <span className="font-bold">Manage Admins</span>
          </div>
          <button
            onClick={() => { setShowCreate(true); setCreateError(""); }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition"
          >
            + New Admin
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Service Admins</h1>
          <p className="text-slate-400 mt-1">All admin accounts across BrainLoom services.</p>
        </div>

        {loading && (
          <div className="text-slate-400 text-center py-20">Loading admins...</div>
        )}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-6">{error}</div>
        )}

        {!loading && (
          <div className="space-y-3">
            {admins.length === 0 && (
              <div className="text-slate-500 text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                No service admins yet. Create one above.
              </div>
            )}
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="bg-slate-800/50 border border-slate-700/40 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-bold text-lg">
                    {admin.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {admin.name}
                      {admin.is_super === 1 && (
                        <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                          ⭐ Super
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-sm">{admin.email}</div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Created {new Date(admin.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${SCOPE_COLORS[admin.scope] || SCOPE_COLORS.tutorial}`}>
                    {admin.scope}
                  </span>

                  <button
                    onClick={() => { setResetTarget(admin); setResetPass(""); setResetError(""); }}
                    className="text-slate-400 hover:text-yellow-400 text-sm transition px-3 py-1 rounded-lg hover:bg-yellow-500/10"
                  >
                    Reset Pwd
                  </button>

                  {admin.is_super !== 1 && (
                    <button
                      onClick={() => handleDelete(admin)}
                      className="text-slate-400 hover:text-red-400 text-sm transition px-3 py-1 rounded-lg hover:bg-red-500/10"
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

      {/* Create Admin Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-black mb-6">Create Service Admin</h2>
            {createError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{createError}</div>
            )}
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Jane Doe" },
                { label: "Email",     key: "email", type: "email", placeholder: "admin@brainloom.com" },
                { label: "Password",  key: "password", type: "password", placeholder: "Min 8 characters" },
                { label: "Phone (optional)", key: "phone", type: "tel", placeholder: "+91 9999999999" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Service Scope</label>
                <select
                  value={form.scope}
                  onChange={(e) => setForm((prev) => ({ ...prev, scope: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-slate-600/50 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                >
                  {SCOPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {creating ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Force Reset Password Modal */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-black mb-2">Reset Password</h2>
            <p className="text-slate-400 text-sm mb-6">
              Setting new password for <span className="text-white font-semibold">{resetTarget.email}</span>
            </p>
            {resetError && (
              <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{resetError}</div>
            )}
            <input
              type="password"
              value={resetPass}
              onChange={(e) => setResetPass(e.target.value)}
              placeholder="New password (min 8 chars)"
              className="w-full bg-slate-900/60 border border-slate-600/50 text-white placeholder-slate-500 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setResetTarget(null)}
                className="flex-1 border border-slate-600 text-slate-300 hover:text-white py-3 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleForceReset}
                disabled={resetting}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
              >
                {resetting ? "Resetting..." : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

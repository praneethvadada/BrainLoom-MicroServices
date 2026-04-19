"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuth } from "@/hooks/useAuth";

export default function TutorialAdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { user, isAdmin, scope, hasHydrated } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Already authenticated as tutorial admin → go straight to dashboard
  useEffect(() => {
    if (!hasHydrated) return;
    if (user && isAdmin && scope === "tutorial") router.replace("/tutorials/admin/dashboard");
  }, [hasHydrated, user, isAdmin, scope]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await authService.login(email, password);

      // STRICT: only admins explicitly scoped to 'tutorial' can enter this portal.
      // Super admins must use /superadmin/dashboard instead.
      if (res.scope !== "tutorial") {
        setError("Access denied. This portal is for Tutorial Service admins only.\nIf you are a Super Admin, use the Super Admin portal.");
        setLoading(false);
        return;
      }

      setAuth({
        user: {
          id:       res.adminId,
          name:     res.name,
          role:     "admin",
          scope:    res.scope,
          is_super: res.is_super,
        },
        accessToken:  res.accessToken,
        refreshToken: null,
      });

      router.push("/tutorials/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020b18] flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-blue-500/40">
              <span className="text-2xl">📚</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight">BrainLoom</h1>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mt-0.5">Tutorial Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-1">Tutorial Service Admin</h2>
          <p className="text-white/30 text-sm mb-6">Manage topics, content blocks and assessments.</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="tutorial@brainloom.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
                <Link href="/tutorials/admin/forgot-password" className="text-blue-400 text-xs hover:text-blue-300 transition">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-sm"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">BrainLoom Tutorial Service · Restricted Access</p>
      </div>
    </div>
  );
}

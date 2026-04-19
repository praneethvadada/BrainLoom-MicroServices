"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuth } from "@/hooks/useAuth";

export default function CyberAdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { user, isAdmin, scope, hasHydrated } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Already authenticated as cyber admin → go straight to dashboard
  useEffect(() => {
    if (!hasHydrated) return;
    if (user && isAdmin && scope === "cyber") router.replace("/cyber/admin/dashboard");
  }, [hasHydrated, user, isAdmin, scope]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await authService.login(email, password);

      // STRICT: only admins explicitly scoped to 'cyber' can enter this portal.
      if (res.scope !== "cyber") {
        setError("Access denied. This portal is for Cyber Security admins only.\nIf you are a Super Admin, use the Super Admin portal.");
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

      router.push("/cyber/admin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#010f08] flex items-center justify-center p-4">
      {/* Terminal grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: "linear-gradient(#0f0,transparent 1px),linear-gradient(90deg,#0f0,transparent 1px)", backgroundSize: "40px 40px" }}
      />
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-green-500/40 border border-green-500/30">
              <span className="text-2xl">🛡️</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight font-mono">CipherCampus</h1>
              <p className="text-green-400 text-xs font-bold uppercase tracking-[0.2em] mt-0.5 font-mono">Cyber Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-black/40 backdrop-blur border border-green-500/20 rounded-3xl p-8 shadow-2xl">
          {/* Terminal prompt header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-green-400 font-mono text-sm">root@ciphercampus:~$</span>
            <span className="text-green-300 font-mono text-sm animate-pulse">_</span>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-mono">
              [ERROR] {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-green-400/60 uppercase tracking-widest block mb-2 font-mono">
                --email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="admin@ciphercampus.com"
                className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm font-mono"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-green-400/60 uppercase tracking-widest font-mono">--password</label>
                <Link href="/cyber/admin/forgot-password" className="text-green-400 text-xs hover:text-green-300 transition font-mono">
                  reset?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-green-500/20 text-green-300 placeholder-green-900 rounded-xl px-4 py-3 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition text-sm font-mono"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 disabled:opacity-50 text-green-300 font-bold py-3 rounded-xl transition-all font-mono mt-2"
            >
              {loading ? "[ AUTHENTICATING... ]" : "[ EXECUTE LOGIN ]"}
            </button>
          </div>
        </div>

        <p className="text-center text-green-900 text-xs mt-6 font-mono">// authorized_access_only</p>
      </div>
    </div>
  );
}

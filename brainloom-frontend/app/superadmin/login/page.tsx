"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/features/auth/auth.service";
import { useAuthStore } from "@/features/auth/auth.store";
import { useAuth } from "@/hooks/useAuth";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { user, isSuper, hasHydrated } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Already logged in as super admin → go to dashboard
  useEffect(() => {
    if (!hasHydrated) return;
    if (user && isSuper) router.replace("/superadmin/dashboard");
  }, [hasHydrated, user, isSuper]);

  const handleLogin = async () => {
    if (!email || !password) { setError("Both fields are required."); return; }
    setLoading(true); setError("");
    try {
      const res = await authService.login(email, password);

      if (!res.is_super) {
        setError("Access denied. This portal is for Super Admins only.");
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

      router.push("/superadmin/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-600/40">
              <span className="text-2xl font-black text-white">⭐</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight">BrainLoom</h1>
              <p className="text-violet-400 text-xs font-bold uppercase tracking-[0.2em] mt-0.5">Super Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-6">Sign in as Super Admin</h2>

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
                placeholder="superadmin@brainloom.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Password</label>
                <Link href="/superadmin/forgot-password" className="text-violet-400 text-xs hover:text-violet-300 transition">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition text-sm"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">Authorized Personnel Only</p>
      </div>
    </div>
  );
}

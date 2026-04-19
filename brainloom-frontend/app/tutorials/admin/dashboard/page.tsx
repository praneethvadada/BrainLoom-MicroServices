"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function TutorialAdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, scope, hasHydrated, logout } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !isAdmin || scope !== "tutorial") {
      router.replace("/tutorials/admin/login");
    }
  }, [hasHydrated, user, isAdmin, scope]);

  const handleLogout = () => { logout(); router.push("/tutorials/admin/login"); };

  if (!hasHydrated) return (
    <div className="min-h-screen bg-[#020b18] flex items-center justify-center">
      <div className="text-white/20 text-sm animate-pulse">Loading…</div>
    </div>
  );

  if (!user || !isAdmin || scope !== "tutorial") return null;

  return (
    <div className="min-h-screen bg-[#020b18] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <div className="relative border-b border-white/5 backdrop-blur sticky top-0 z-10 bg-[#020b18]/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm shadow-lg shadow-blue-500/30">
              📚
            </div>
            <div>
              <span className="font-black text-white">BrainLoom</span>
              <span className="text-white/30 text-xs ml-2">Tutorial Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              scope: tutorial
            </span>
            <button onClick={handleLogout} className="text-white/30 hover:text-white text-sm transition">Sign out</button>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">Tutorial Service · Admin Panel</p>
          <h1 className="text-4xl font-black tracking-tight">
            {user.name ? `Hello, ${user.name.split(" ")[0]} 👋` : "Tutorial Dashboard"}
          </h1>
          <p className="text-white/40 mt-2">Manage the learning content for the BrainLoom Tutorial Service.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Your Scope",  value: "tutorial", icon: "🎯" },
            { label: "Access",      value: "Admin",    icon: "🔐" },
            { label: "Status",      value: "Active",   icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-white/30 text-xs mt-1 uppercase tracking-wider font-semibold">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Content Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { label: "Browse & Edit Tutorials", href: "/tutorials", icon: "📁", desc: "Add, edit and manage domains, sub-domains, and page content directly on the tutorial pages." },
            { label: "Reset Password",          href: "/tutorials/admin/forgot-password", icon: "🔑", desc: "Change your admin password via OTP verification." },

          ].map((a) => (
            <Link key={a.label} href={a.href} className="bg-white/3 border border-white/8 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-2xl p-6 transition-all group">
              <div className="text-3xl mb-3">{a.icon}</div>
              <div className="font-bold text-white group-hover:text-blue-400 transition mb-1">{a.label}</div>
              <div className="text-white/30 text-sm">{a.desc}</div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-sm">View Public Tutorial Site</div>
            <div className="text-white/30 text-xs mt-0.5">See how your content appears to learners.</div>
          </div>
          <Link href="/tutorials" className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition" target="_blank">
            Open Site →
          </Link>
        </div>
      </div>
    </div>
  );
}

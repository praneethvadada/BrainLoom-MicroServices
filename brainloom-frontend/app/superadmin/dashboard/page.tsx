"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/features/auth/auth.service";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const { user, isSuper, hasHydrated, logout } = useAuth();
  const [adminCount, setAdminCount] = useState<number | null>(null);

  useEffect(() => {
    // ⚡ Wait for store to hydrate from localStorage before deciding to redirect
    if (!hasHydrated) return;
    if (!user || !isSuper) {
      router.replace("/superadmin/login");
    }
  }, [hasHydrated, user, isSuper]);

  useEffect(() => {
    if (isSuper) {
      authService.listAdmins()
        .then((list) => setAdminCount(list.length))
        .catch(() => {});
    }
  }, [isSuper]);

  const handleLogout = () => { logout(); router.push("/superadmin/login"); };

  // Show nothing while hydrating — avoids flash of login redirect
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-sm font-black shadow-lg shadow-violet-600/30">
              ⭐
            </div>
            <div>
              <span className="font-black text-white">BrainLoom</span>
              <span className="text-white/30 text-xs ml-2">Super Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
              ⭐ Super Admin
            </span>
            <button onClick={handleLogout} className="text-white/30 hover:text-white text-sm transition">
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        {/* Welcome */}
        <div className="mb-12">
          <p className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-2">Super Admin Control Panel</p>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-white/40 mt-3 text-lg">
            Full control over all BrainLoom services and admin accounts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Service Admins",  value: adminCount ?? "—", icon: "👥", color: "from-violet-600 to-indigo-600" },
            { label: "Services Active", value: "3",  icon: "🔌", color: "from-blue-600 to-cyan-600" },
            { label: "Access Scope",    value: "ALL", icon: "🎯", color: "from-green-600 to-emerald-600" },
            { label: "Admin Level",     value: "L∞",  icon: "🔐", color: "from-orange-600 to-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:bg-white/5 transition">
              <div className="text-2xl mb-3">{stat.icon}</div>
              <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="text-white/30 text-xs mt-1 font-semibold uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Service Cards */}
        <h2 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Manage Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { service: "Tutorial Service", desc: "Manage topics, content blocks, MCQs and learning paths.", icon: "📚", color: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/20", link: "/tutorials/admin/dashboard", badge: "tutorial" },
            { service: "Cyber Security",   desc: "Manage CTF challenges, labs and security learning content.", icon: "🛡️", color: "from-green-600/20 to-emerald-600/20", border: "border-green-500/20", link: "/cyber/admin/dashboard", badge: "cyber" },
            { service: "Admin Accounts",   desc: "Create, modify and remove service admin accounts.", icon: "👥", color: "from-violet-600/20 to-indigo-600/20", border: "border-violet-500/20", link: "/superadmin/dashboard/admins", badge: "all" },
          ].map((s) => (
            <Link key={s.service} href={s.link} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-6 transition-all hover:scale-[1.02] group`}>
              <div className="text-3xl mb-4">{s.icon}</div>
              <div className="font-bold text-white mb-1 group-hover:text-white/90">{s.service}</div>
              <div className="text-white/40 text-sm leading-relaxed">{s.desc}</div>
              <div className="mt-4 text-xs font-bold text-white/30 uppercase tracking-widest">scope: {s.badge} →</div>
            </Link>
          ))}
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="font-bold text-white">Account Security</div>
            <div className="text-white/40 text-sm mt-1">Reset your super admin password via OTP email verification.</div>
          </div>
          <Link href="/superadmin/forgot-password" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition whitespace-nowrap">
            Reset Password →
          </Link>
        </div>
      </div>
    </div>
  );
}

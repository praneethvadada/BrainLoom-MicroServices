"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function CyberAdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, scope, hasHydrated, logout } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !isAdmin || scope !== "cyber") {
      router.replace("/cyber/admin/login");
    }
  }, [hasHydrated, user, isAdmin, scope]);

  const handleLogout = () => { logout(); router.push("/cyber/admin/login"); };

  if (!hasHydrated) return (
    <div className="min-h-screen bg-[#010f08] flex items-center justify-center">
      <div className="text-green-900 text-sm font-mono animate-pulse">// loading...</div>
    </div>
  );

  if (!user || !isAdmin || scope !== "cyber") return null;

  return (
    <div className="min-h-screen bg-[#010f08] text-green-300 font-mono">
      <div className="fixed inset-0 pointer-events-none opacity-3"
        style={{ backgroundImage: "linear-gradient(#0f0,transparent 1px),linear-gradient(90deg,#0f0,transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Bar */}
      <div className="relative border-b border-green-500/10 backdrop-blur sticky top-0 z-10 bg-[#010f08]/90">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center text-sm">🛡️</div>
            <div>
              <span className="font-black text-green-300">CipherCampus</span>
              <span className="text-green-900 text-xs ml-2">// cyber_admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">scope: cyber</span>
            <button onClick={handleLogout} className="text-green-900 hover:text-green-400 text-sm transition">logout</button>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">// cyber_security_admin_panel</p>
          <h1 className="text-4xl font-black text-green-300">
            {user.name ? `> Hello, ${user.name.split(" ")[0]}_` : "> admin_shell_active_"}
          </h1>
          <p className="text-green-700 mt-2 text-sm">Manage cyber security challenges, labs, and learning content.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
          {[
            { label: "scope_level",  value: "cyber",   icon: "🎯" },
            { label: "access_level", value: "admin",   icon: "🔐" },
            { label: "shell_status", value: "active",  icon: "✅" },
          ].map((s) => (
            <div key={s.label} className="bg-black/40 border border-green-500/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-xl font-black text-green-300">{s.value}</div>
              <div className="text-green-800 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="text-green-800 text-xs uppercase tracking-widest mb-4">// available_commands</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { label: "manage_challenges", href: "/cyber/admin/challenges", icon: "💀", desc: "Create and manage CTF challenges and lab environments." },
            { label: "reset_password",    href: "/cyber/admin/forgot-password", icon: "🔑", desc: "Rotate admin credentials via OTP email verification." },
          ].map((a) => (
            <Link key={a.label} href={a.href} className="bg-black/40 border border-green-500/10 hover:border-green-500/30 hover:bg-green-500/5 rounded-2xl p-6 transition-all group">
              <div className="text-3xl mb-3">{a.icon}</div>
              <div className="font-bold text-green-300 group-hover:text-green-200 transition mb-1">{`> ${a.label}()`}</div>
              <div className="text-green-800 text-sm">{a.desc}</div>
            </Link>
          ))}
        </div>

        <div className="text-green-900 text-xs text-center">
          {`// session_active | admin: ${user.name ?? "admin"} | scope: cyber`}
        </div>
      </div>
    </div>
  );
}

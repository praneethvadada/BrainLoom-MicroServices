"use client";

/**
 * /admin/dashboard — Legacy redirect hub.
 *
 * This page exists for backward compatibility (e.g. the public nav "Dashboard"
 * button). It reads the user's scope from the auth store and instantly
 * redirects them to the correct new portal:
 *
 *   scope "all"      → /superadmin/dashboard
 *   scope "tutorial" → /tutorials/admin/dashboard
 *   scope "cyber"    → /cyber/admin/dashboard
 *   not logged in    → /superadmin/login  (sensible default)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDashboardRedirect() {
  const router  = useRouter();
  const { user, isAdmin, scope, hasHydrated } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!user || !isAdmin) {
      // Not logged in as admin — send to super admin login as default
      router.replace("/superadmin/login");
      return;
    }

    switch (scope) {
      case "all":
        router.replace("/superadmin/dashboard");
        break;
      case "tutorial":
        router.replace("/tutorials/admin/dashboard");
        break;
      case "cyber":
        router.replace("/cyber/admin/dashboard");
        break;
      default:
        router.replace("/superadmin/login");
    }
  }, [hasHydrated, user, isAdmin, scope]);

  return (
    <div className="min-h-screen bg-[#020b18] flex items-center justify-center">
      <div className="text-white/30 text-sm animate-pulse">Redirecting to your dashboard…</div>
    </div>
  );
}
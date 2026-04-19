// 📄 /components/layout/Navbar.tsx
// Public Navbar — shown on all non-admin, non-auth pages.
// Admin/auth pages have separate segment layouts that omit this.

"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center h-16">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          BrainLoom
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/tutorials" className="hover:text-blue-600 transition-colors">
            Tutorials
          </Link>

          <Link href="/cyber" className="hover:text-blue-600 transition-colors">
            Cyber Security
          </Link>

          {isAdmin && (
            <Link href="/admin/dashboard" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
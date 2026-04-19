// 📄 /app/auth/admin-login/page.tsx
// This route is kept for backwards compatibility.
// The canonical login page is now /auth/login

"use client";

import { redirect } from "next/navigation";

export default function AdminLoginRedirect() {
  redirect("/auth/login");
}
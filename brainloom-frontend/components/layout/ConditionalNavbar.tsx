// 📄 /components/layout/ConditionalNavbar.tsx
//
// Renders the Navbar ONLY on public-facing pages.
// Admin and auth pages manage their own top bars.

"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

// All paths that should NOT show the public Navbar
const HIDDEN_ON = [
  "/superadmin",
  "/tutorials/admin",
  "/cyber/admin",
  "/auth",
];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_ON.some((prefix) => pathname.startsWith(prefix));
  if (shouldHide) return null;
  return <Navbar />;
}

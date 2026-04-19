// 📄 /components/common/ProtectedRoute.tsx

"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "admin";
}) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (role && user.role !== role) {
      router.replace("/");
    }
  }, [user]);

  if (!user) return null;

  return <>{children}</>;
}
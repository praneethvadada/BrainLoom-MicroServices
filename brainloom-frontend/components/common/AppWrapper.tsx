// 📄 /components/common/AppWrapper.tsx

"use client";

import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthBootstrap();

  return <>{children}</>;
}
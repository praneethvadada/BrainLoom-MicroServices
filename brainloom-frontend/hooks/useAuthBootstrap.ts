// 📄 /hooks/useAuthBootstrap.ts

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { authService } from "@/features/auth/auth.service";

export const useAuthBootstrap = () => {
  const { accessToken, refreshToken, setAuth, logout } =
    useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (!accessToken) return;

      try {
        const user = await authService.getProfile();

        setAuth({
          user,
          accessToken,
          refreshToken,
        });
      } catch {
        logout();
      }
    };

    init();
  }, []);
};
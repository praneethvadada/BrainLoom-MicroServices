// 📄 /hooks/useAuth.ts

import { useAuthStore } from "@/features/auth/auth.store";

export const useAuth = () => {
  const { user, setAuth, logout, _hasHydrated } = useAuthStore();

  return {
    user,
    logout,
    login:        setAuth,
    hasHydrated:  _hasHydrated,   // ← wait for this before redirecting
    isLoggedIn:   _hasHydrated && !!user,
    isAdmin:      _hasHydrated && user?.role === "admin",
    isSuper:      _hasHydrated && user?.role === "admin" && user?.is_super === true,
    scope:        user?.scope ?? "",
  };
};
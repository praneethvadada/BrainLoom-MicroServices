// 📄 /features/auth/auth.store.ts
// Zustand persist store with hydration tracking.
// _hasHydrated MUST be checked before any auth-based redirect.
// Without this, SSR renders user=null, useEffect fires, redirect happens before localStorage loads.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "./auth.types";

interface AuthState {
  user:        User | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Hydration flag — false until localStorage has been read on client
  _hasHydrated: boolean;

  setAuth: (data: {
    user:         User;
    accessToken:  string;
    refreshToken: string | null;
  }) => void;

  logout:          () => void;
  setHasHydrated:  (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      setAuth: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name:    "auth-storage",
      storage: createJSONStorage(() => localStorage),

      // Only persist auth data, NOT the hydration flag
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
      }),

      // Called as soon as localStorage has been read and state restored
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
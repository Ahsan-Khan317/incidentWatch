import { create } from "zustand";
import { AuthUser } from "@/src/features/auth/types";
import { logout as logoutApi } from "../apis/auth.api";

interface AuthState {
  user: AuthUser | null;
  token: string | null; // Keep for internal tracking if needed, but not in localStorage
  error: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
}

/**
 * Production-Level Stateful Auth Store
 * No tokens in localStorage. All auth state is managed via HttpOnly cookies
 * handled automatically by the browser and validated by Redis on the backend.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  error: null,
  isAuthenticated: false,
  isInitialized: false,

  setToken: (token) => {
    // We no longer manually store tokens in localStorage.
    // Cookies are set by the backend and sent automatically via withCredentials: true
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isInitialized: true }),

  setError: (error) => set({ error }),

  logout: async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      set({
        user: null,
        token: null,
        error: null,
        isAuthenticated: false,
        isInitialized: true,
      });
    }
  },
}));

import { create } from "zustand";
import { AuthUser } from "@/src/features/auth/types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  error: string | null;
}

interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  token: null,
  error: null,
  setToken: (token) => {
    set(() => ({ token }));
    if (typeof window !== "undefined") {
      if (token) {
        window.localStorage.setItem("authToken", token);
      } else {
        window.localStorage.removeItem("authToken");
      }
    }
  },
  setUser: (user) => set(() => ({ user })),
  setError: (error) => set(() => ({ error })),
  logout: () => {
    set(() => ({ user: null, token: null, error: null }));
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("authToken");
    }
  },
}));

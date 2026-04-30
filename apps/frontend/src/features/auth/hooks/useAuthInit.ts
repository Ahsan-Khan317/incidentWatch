"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { fetchCurrentUser } from "@/src/features/auth/apis/auth.api";

/**
 * Production-Level Session Validation Hook
 *
 * Instead of checking localStorage, it relies on the browser's HttpOnly cookies.
 * on mount, it calls /auth/getme. If the cookie is valid, the backend returns the user.
 */
export function useAuthInit() {
  const { isInitialized, setUser, setToken } = useAuthStore();

  useEffect(() => {
    // Only run once on mount
    if (isInitialized) return;

    async function validateSession() {
      try {
        console.log("🔄 useAuthInit: Validating secure session via cookies...");
        // fetchCurrentUser will include cookies because of withCredentials: true
        const user = await fetchCurrentUser(""); // token is now optional as it's in cookies
        console.log("✅ useAuthInit: Session valid", user);

        // Update store
        setUser(user);
        // Note: we might not have the raw token in JS anymore, which is safer.
        // If we still need it for some legacy reason, the login response still provides it.
      } catch (error) {
        console.log("ℹ️ useAuthInit: No active session or session expired");
        // No valid cookie/session found — mark as guest
        useAuthStore.setState({ isInitialized: true });
      }
    }

    validateSession();
  }, [isInitialized, setUser, setToken]);
}

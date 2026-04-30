"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { fetchCurrentUser } from "@/src/features/auth/apis/auth.api";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { token, setUser, logout, isInitialized } = useAuthStore();

  useEffect(() => {
    // Initialize token from localStorage if available
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      if (storedToken && !token) {
        console.log("🔄 AuthInitializer: Restoring token from localStorage");
        // setToken(storedToken); // We'll let the next effect handle user fetching
      }
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      if (token && !isInitialized) {
        console.log("🔄 AuthInitializer: Fetching user profile...");
        try {
          const user = await fetchCurrentUser(token);
          console.log("✅ AuthInitializer: Profile fetched successfully", user);
          setUser(user);
        } catch (error) {
          console.error(
            "❌ AuthInitializer: Failed to fetch user profile:",
            error,
          );
          logout();
        }
      }
    }

    if (token) {
      loadUser();
    }
  }, [token, setUser, logout, isInitialized]);

  return <>{children}</>;
}

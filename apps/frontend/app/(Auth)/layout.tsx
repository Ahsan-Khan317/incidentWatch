"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, don't allow them to see login/register
    if (isInitialized && isAuthenticated) {
      router.replace("/"); // Redirect to dashboard/home
    }
  }, [isAuthenticated, isInitialized, router]);

  // Optionally show a loader while checking auth status
  if (isInitialized && isAuthenticated) {
    return null; // Will redirect anyway
  }

  return <>{children}</>;
}

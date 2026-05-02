"use client";

import * as React from "react";
import { ThemeProvider } from "@/src/providers/theme-Provider";
import { ReactQueryProvider } from "@/src/providers/query-provider";
import { useAuthInit } from "@/src/features/auth/hooks/useAuthInit";
/**
 * Runs useAuthInit inside the provider tree (after ReactQuery is available).
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  useAuthInit();
  return <>{children}</>;
}

/**
 * MainProvider — single wrapper for all client-side providers.
 * Order: Theme → ReactQuery → AuthGate (session validation)
 */
export function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryProvider>
        <AuthGate>{children}</AuthGate>
      </ReactQueryProvider>
    </ThemeProvider>
  );
}

"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-2 rounded-md border bg-transparent px-2 py-1 text-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <Sun className="h-4 w-4 text-slate-700 dark:text-slate-200" />
      <label htmlFor="theme-select" className="sr-only">
        Toggle theme
      </label>
      <select
        id="theme-select"
        value={theme ?? "system"}
        onChange={(event) => setTheme(event.target.value)}
        className="min-w-[6rem] bg-transparent text-sm outline-none"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
      <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200" />
    </div>
  );
}

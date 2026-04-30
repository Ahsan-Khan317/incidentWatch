"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Prevent hydration mismatch
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ scale: 0.5, rotate: 45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotate: -45, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/5 transition-colors" />
    </button>
  );
}

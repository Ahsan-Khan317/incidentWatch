"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ModeToggle } from "@/src/components/theme/toggleTheme";

export const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-neutral-200/50 bg-white/70 dark:bg-neutral-950/70 dark:border-white/10 backdrop-blur-lg transition-colors duration-500"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-heading">
          IncidentWatch
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-body">
        <a href="#features" className="hover:text-primary transition-colors">
          Features
        </a>
        <a href="#workflow" className="hover:text-primary transition-colors">
          How it Works
        </a>
        <a href="#status" className="hover:text-primary transition-colors">
          Status
        </a>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <Link
          href="/login"
          className="text-sm font-bold text-heading hover:text-primary transition-colors px-4 py-2"
        >
          Login
        </Link>
        <Link href="/register" className="btn-primary btn-sm">
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
};

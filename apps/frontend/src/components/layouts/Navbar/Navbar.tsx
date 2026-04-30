"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "@/src/components/theme/toggleTheme";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

const NAV_CONFIG = {
  links: [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Anomaly Engine", href: "#engine" },
    { label: "Pricing", href: "#pricing" },
  ],
  actions: {
    login: { label: "Login", href: "/login" },
    cta: { label: "Get Started", href: "/register" },
  },
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
        scrolled
          ? "py-6 bg-surface-0/80 backdrop-blur-xl shadow-none"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="container-max flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
          <span className="font-display font-bold text-xl uppercase tracking-tighter text-heading">
            IncidentWatch
          </span>
        </Link>

        {/* Desktop Links */}
        <div
          className="hidden md:flex items-center gap-2"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {NAV_CONFIG.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(i)}
              className="text-sm font-semibold text-body hover:text-heading transition-colors relative px-4 py-2 rounded-lg"
            >
              {hoveredIndex === i && (
                <motion.div
                  layoutId="nav-highlight"
                  className="absolute inset-0 bg-surface-2/80 rounded-lg -z-10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          {!mounted ? (
            <div className="w-20 h-8 bg-surface-2 animate-pulse rounded-lg" />
          ) : !isAuthenticated ? (
            <>
              <Link
                href={NAV_CONFIG.actions.login.href}
                className="hidden md:block text-sm font-bold text-heading hover:text-primary transition-colors px-4 py-2"
              >
                {NAV_CONFIG.actions.login.label}
              </Link>
              <Link
                href={NAV_CONFIG.actions.cta.href}
                className="btn btn-primary btn-md text-lg font-bold uppercase tracking-tight"
              >
                <span className="btn-slide">
                  <span>{NAV_CONFIG.actions.cta.label}</span>
                  <span>{NAV_CONFIG.actions.cta.label}</span>
                </span>
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="btn btn-primary btn-md text-lg font-bold uppercase tracking-tight"
            >
              <span className="btn-slide">
                <span>Dashboard</span>
                <span>Dashboard</span>
              </span>
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-heading"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-surface-0 border-b border-border-soft overflow-hidden px-6 py-8 shadow-2xl"
          >
            <div className="flex flex-col gap-6">
              {NAV_CONFIG.links.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-lg font-display font-bold text-heading hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-6 border-t border-border-soft flex items-center justify-between">
                <ModeToggle />
                {mounted &&
                  (!isAuthenticated ? (
                    <Link
                      href={NAV_CONFIG.actions.login.href}
                      className="text-sm font-bold text-heading"
                    >
                      {NAV_CONFIG.actions.login.label}
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="text-sm font-bold text-primary"
                    >
                      Dashboard
                    </Link>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

"use client";

import { useAuthStore } from "@/src/features/auth/store/auth-store";
import { ChevronDown, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

const breadcrumbLabels: Record<string, string> = {
  alerts: "Alerts",
  channel: "Channel",
  apis: "APIs",
  incidents: "Incidents",
  logs: "Logs",
  analytics: "Analytics",
  "status-page": "Status Page",
  team: "Team & Access",
  billing: "Billing",
  settings: "Settings",
  services: "Service",
};

import { useViewStore } from "../store/view-store";

import { ModeToggle } from "@/src/components/theme/toggleTheme";

export default function DashboardNavbar({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const { activeView } = useViewStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const formatSlugLabel = (value: string) =>
    value
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const currentSectionLabel = useMemo(() => {
    // If we're using the state-based view switcher
    if (activeView && activeView !== "dashboard") {
      return breadcrumbLabels[activeView] || formatSlugLabel(activeView);
    }

    if (!pathname || pathname === "/dashboard") {
      return "Overview";
    }

    const segments = pathname
      .replace("/dashboard/", "")
      .split("/")
      .filter(Boolean);
    if (!segments.length) {
      return "Overview";
    }

    const primary = segments[0];
    const secondary = segments[1];
    const primaryLabel = breadcrumbLabels[primary] || formatSlugLabel(primary);

    if (!secondary) {
      return primaryLabel;
    }

    const secondaryLabel =
      breadcrumbLabels[secondary] ||
      (/^[0-9a-f]{12,}$/i.test(secondary)
        ? "Details"
        : formatSlugLabel(secondary));

    return `${primaryLabel} / ${secondaryLabel}`;
  }, [pathname, activeView]);

  const userInitials = useMemo(() => {
    const source = user?.name || "Dashboard User";

    return source
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [user]);

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-dashed border-border bg-page/90 backdrop-blur-md">
      <div className="flex h-14 sm:h-16">
        {/* Logo */}
        <div className="flex min-w-0 flex-1 items-center border-r border-dashed border-border px-4 md:w-64 md:flex-none sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-[10px] font-black text-on-primary shadow-lg shadow-primary/20 transition-transform hover:rotate-3">
              IW
            </div>
            <span className="hidden sm:block text-sm font-black tracking-tight text-heading uppercase">
              IncidentWatch
            </span>
          </Link>
        </div>

        {/* Breadcrumb */}
        <div className="hidden flex-1 items-center justify-between border-r border-dashed border-border px-4 md:flex">
          <div className="flex items-center gap-2 text-xs text-body">
            <span className="text-[0.625rem] uppercase tracking-[0.18em] text-body/45">
              Dashboard
            </span>
            <span className="text-border">/</span>
            <span className="text-body-strong">{currentSectionLabel}</span>
          </div>
        </div>

        {/* Profile Menu & Buttons */}
        <div className="flex shrink-0 items-center justify-end gap-2 px-3 sm:px-6">
          {/* Demo Account Badge */}
          {user?.role === "demo" && (
            <div className="rounded border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[0.625rem] uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Demo Account
            </div>
          )}

          {/* Menu Button */}
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center rounded border border-border px-3 py-1.5 text-body transition-colors hover:bg-surface-1 md:hidden"
          >
            <Menu size={16} />
          </button>

          {/* Theme Toggle */}
          <ModeToggle />

          <div className="mx-1 hidden h-8 w-px bg-border md:block" />

          {/* Profile Modal */}
          <div ref={profileMenuRef} className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded border border-border bg-surface-1 px-2 py-1.5 transition-colors hover:bg-surface-2"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-neutral-600 to-neutral-900 text-[0.625rem] text-white">
                {userInitials || "DU"}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[0.6875rem] text-heading">
                  {user?.name || "Workspace User"}
                </span>
                <span className="text-[0.625rem] text-body">Workspace</span>
              </div>
              <ChevronDown
                size={14}
                className={`text-body transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-56 rounded border border-border bg-surface-2 p-2 shadow-strong">
                <div className="mb-2 border-b border-border px-2 pb-2">
                  <p className="text-xs text-heading">
                    {user?.name || "Workspace User"}
                  </p>
                  <p className="text-[0.6875rem] text-body">
                    {user?.email || "Signed in"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-xs text-rose-300 transition-colors hover:bg-rose-500/10"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

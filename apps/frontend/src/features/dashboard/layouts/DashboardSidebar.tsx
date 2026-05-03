"use client";

import { authAPI } from "@/src/lib/api/api";
import {
  Activity,
  Bell,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Logs,
  Settings,
  Terminal,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/src/features/auth/store/auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ServiceDropDown from "./ServiceDropDown";

const sideNavGroups = [
  // Core
  {
    title: "Core",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutGrid },
      { label: "Incidents", href: "/dashboard/incidents", icon: TriangleAlert },
      { label: "Services", href: "/dashboard/services", icon: Activity },
      { label: "Logs", href: "/dashboard/logs", icon: Logs },
      {
        label: "Alerts",
        href: "/dashboard/alerts",
        icon: Bell,
        children: [{ label: "Channel", href: "/dashboard/alerts/channel" }],
      },
    ],
  },
  // Management
  {
    title: "System",
    items: [
      { label: "Team & member", href: "/dashboard/team", icon: Users },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

import { useViewStore } from "../store/view-store";

export default function DashboardSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const { activeView, setActiveView } = useViewStore();

  const handleLogout = async () => {
    await logout();
    onClose();
    router.replace("/login");
  };

  return (
    <>
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-dashed border-border bg-page transition-transform duration-200 md:static md:inset-auto md:h-full md:translate-x-0 overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ServiceDropDown />

        <div className="flex-1 py-4 text-xs overflow-y-auto no-scrollbar">
          {sideNavGroups.map((group) => (
            <div key={group.title} className="mb-4 px-3 last:mb-0">
              <p className="mb-2 px-3 text-[0.625rem] uppercase tracking-[0.2em] text-body/40">
                {group.title}
              </p>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const viewId = item.href
                    .replace("/dashboard/", "")
                    .replace("/dashboard", "dashboard") as any;
                  const isActive = activeView === viewId;
                  const hasChildren =
                    Array.isArray(item.children) && item.children.length > 0;

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => {
                          const finalViewId =
                            viewId === "services" ? "service-context" : viewId;
                          setActiveView(finalViewId);
                          if (window.innerWidth < 768) onClose();
                        }}
                        className={`flex w-full items-center gap-2 rounded px-3 py-2 text-[0.75rem] transition-colors ${
                          activeView ===
                            (viewId === "services"
                              ? "service-context"
                              : viewId) ||
                          (viewId === "services" &&
                            activeView === "service-details")
                            ? "bg-surface-2 text-heading"
                            : "text-body hover:bg-surface-1 hover:text-heading"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={isActive ? "text-primary" : ""}
                        />
                        <span>{item.label}</span>
                        {hasChildren ? (
                          <ChevronDown
                            size={12}
                            className="ml-auto text-body/30"
                          />
                        ) : null}
                      </button>

                      {hasChildren && isActive ? (
                        <div className="ml-6 mt-1 space-y-1 border-l border-dashed border-border pl-3">
                          {item.children?.map((child) => {
                            return (
                              <button
                                key={child.label}
                                onClick={() => {
                                  // Handle sub-views if needed
                                  if (window.innerWidth < 768) onClose();
                                }}
                                className="block w-full rounded px-2 py-1.5 text-left text-[0.6875rem] transition-colors text-body hover:bg-surface-1 hover:text-heading"
                              >
                                {child.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-auto space-y-2 border-t border-dashed border-border px-3 py-3 text-[0.625rem] text-body bg-page">
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
            className="flex w-full items-center justify-center gap-2 rounded border border-border px-2 py-2 text-xs text-body transition-colors hover:bg-surface-1"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 top-16 z-30 bg-black/50 md:hidden"
        />
      )}
    </>
  );
}

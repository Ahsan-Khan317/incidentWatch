"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  AlertTriangle,
  Globe,
  Settings,
  Terminal,
  MoreVertical,
} from "lucide-react";
import { View, TeamMember, Incident } from "./types";

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (v: boolean) => void;
  incidents: Incident[];
  team: TeamMember[];
}

const NavItem = ({
  id,
  label,
  icon: Icon,
  badge,
  active,
  onClick,
  expanded,
}: {
  id: View;
  label: string;
  icon: any;
  badge?: number;
  active: boolean;
  onClick: () => void;
  expanded: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium transition-all border-l-2 ${
      expanded ? "justify-start px-4" : "justify-center"
    } ${
      active
        ? "bg-surface-2 text-heading border-primary"
        : "text-muted border-transparent hover:bg-surface-2 hover:text-heading"
    }`}
  >
    <Icon size={14} className={active ? "text-primary" : ""} />
    {expanded && (
      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 text-left whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
    {badge !== undefined && badge > 0 && (
      <span
        className={`bg-danger/10 text-danger rounded-full font-bold ${
          expanded ? "text-[10px] px-1.5 py-0.5" : "text-[8px] px-1 py-0.5"
        }`}
      >
        {badge}
      </span>
    )}
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  isSidebarExpanded,
  setIsSidebarExpanded,
  incidents,
  team,
}) => {
  return (
    <motion.aside
      animate={{ width: isSidebarExpanded ? 192 : 56 }}
      className="bg-surface-2/50 border-r border-border-soft flex flex-col shrink-0 transition-all duration-300"
    >
      <div
        className={`h-12 border-b border-border-soft flex items-center ${isSidebarExpanded ? "px-4 justify-between" : "justify-center"}`}
      >
        {isSidebarExpanded && (
          <span className="text-sm font-display font-bold text-heading uppercase tracking-tighter">
            <span className="text-primary italic">I</span>ncidentWatch
          </span>
        )}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="p-1.5 hover:bg-surface-3 rounded-lg transition-colors text-muted hover:text-heading"
        >
          <MoreVertical
            size={14}
            className={
              isSidebarExpanded ? "" : "rotate-90 transition-transform"
            }
          />
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-x-hidden">
        <NavItem
          id="dashboard"
          label="Dashboard"
          icon={LayoutDashboard}
          active={view === "dashboard"}
          onClick={() => setView("dashboard")}
          expanded={isSidebarExpanded}
        />
        <NavItem
          id="incidents"
          label="Incidents"
          icon={AlertTriangle}
          active={view === "incidents"}
          onClick={() => setView("incidents")}
          badge={incidents.filter((i) => i.status === "open").length}
          expanded={isSidebarExpanded}
        />
        <NavItem
          id="logs"
          label="Logs"
          icon={Terminal}
          active={view === "logs"}
          onClick={() => setView("logs")}
          expanded={isSidebarExpanded}
        />
        <NavItem
          id="status"
          label="Status"
          icon={Globe}
          active={view === "status"}
          onClick={() => setView("status")}
          expanded={isSidebarExpanded}
        />
        <NavItem
          id="settings"
          label="Settings"
          icon={Settings}
          active={view === "settings"}
          onClick={() => setView("settings")}
          expanded={isSidebarExpanded}
        />

        {isSidebarExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 px-4 mb-2 text-[10px] font-bold text-muted uppercase tracking-widest"
          >
            On-Call
          </motion.div>
        )}
        <div className={`space-y-3 ${isSidebarExpanded ? "px-4" : "px-2"}`}>
          {team.map((m) => (
            <div
              key={m.id}
              className={`flex items-center gap-2 ${isSidebarExpanded ? "justify-start" : "justify-center"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${m.av}`}
              >
                {m.id}
              </div>
              {isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-[10px] font-bold text-heading truncate">
                    {m.name}
                  </p>
                  <p className="text-[8px] text-muted truncate">{m.role}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </motion.aside>
  );
};

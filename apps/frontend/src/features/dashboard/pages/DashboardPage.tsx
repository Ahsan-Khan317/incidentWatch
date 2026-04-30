"use client";
import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, UserPlus } from "lucide-react";

// Types
import { TeamMember } from "../types";

// View Components
import { OverviewView } from "../components/views/OverviewView";
import { IncidentsView } from "../components/views/IncidentsView";
import { LogsView } from "../components/views/LogsView";
import { TeamView } from "../components/views/TeamView";
import { SettingsView } from "../components/views/SettingsView";
import { AddMemberModal } from "../components/views/AddMemberModal";

export const DashboardPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Marcus Thorne",
      role: "SRE Lead",
      email: "marcus@incidentwatch.io",
      expertise: ["Kubernetes", "PostgreSQL", "AWS"],
      status: "on-duty",
      avatarColor: "bg-emerald-500/10 text-emerald-500",
    },
    {
      id: "2",
      name: "Elena Vance",
      role: "Infrastructure Engineer",
      email: "elena@incidentwatch.io",
      expertise: ["Terraform", "Go", "Docker"],
      status: "on-duty",
      avatarColor: "bg-blue-500/10 text-blue-500",
    },
    {
      id: "3",
      name: "Arjun Kumar",
      role: "Backend Architect",
      email: "arjun@incidentwatch.io",
      expertise: ["Node.js", "Redis", "Azure"],
      status: "off-duty",
      avatarColor: "bg-purple-500/10 text-purple-500",
    },
  ]);

  const handleAddMember = (
    data: Omit<TeamMember, "id" | "status" | "avatarColor">,
  ) => {
    const member: TeamMember = {
      ...data,
      id: Date.now().toString(),
      status: "off-duty",
      avatarColor: `bg-zinc-500/10 text-zinc-500`,
    };
    setTeam([...team, member]);
  };

  const removeMember = (id: string) => {
    setTeam(team.filter((m) => m.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTeam(
      team.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: m.status === "on-duty" ? "off-duty" : "on-duty",
          };
        }
        return m;
      }),
    );
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case "dashboard":
        return "System Overview";
      case "incidents":
        return "Incident Command";
      case "logs":
        return "Live Logs";
      case "team":
        return "Engineering Roster";
      case "settings":
        return "Organization Settings";
      default:
        return "Dashboard";
    }
  };

  const getHeaderDesc = () => {
    switch (activeView) {
      case "dashboard":
        return "Real-time infrastructure health and operational metrics.";
      case "incidents":
        return "Track and resolve active system alerts.";
      case "logs":
        return "Streaming real-time events from production clusters.";
      case "team":
        return "Manage your organization's engineering response team.";
      case "settings":
        return "Configure organizational protocols and integrations.";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout
      activeView={activeView}
      setActiveView={setActiveView}
      user={{ name: "Alex Chen", role: "On-Call Lead" }}
    >
      <div className="space-y-10">
        <div className="flex justify-end mb-4">
          {activeView === "team" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 text-white flex items-center gap-2.5 px-6 py-2 rounded shadow-lg hover:bg-emerald-700 transition-all font-bold text-xs uppercase"
            >
              <UserPlus size={16} />
              <span>Add Engineer</span>
            </button>
          )}
        </div>

        {/* Content Switcher */}
        <AnimatePresence mode="wait">
          {activeView === "dashboard" && <OverviewView team={team} />}
          {activeView === "incidents" && <IncidentsView />}
          {activeView === "logs" && <LogsView />}
          {activeView === "team" && (
            <TeamView
              team={team}
              removeMember={removeMember}
              toggleStatus={toggleStatus}
              setShowAddModal={setShowAddModal}
            />
          )}
          {activeView === "settings" && <SettingsView />}
        </AnimatePresence>
      </div>

      <AddMemberModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
      />
    </DashboardLayout>
  );
};

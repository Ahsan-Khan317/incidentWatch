"use client";
import React, { useState, useCallback } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { AnimatePresence, motion } from "framer-motion";
import { UserPlus } from "lucide-react";

// Types
import { TeamMember } from "../types";

// View Components
import { OverviewView } from "../components/views/OverviewView";
import { IncidentsView } from "../../incidents/IncidentsView";
import { LogsView } from "../components/views/LogsView";
import { TeamView } from "../components/views/TeamView";
import { SettingsView } from "../components/views/SettingsView";
import { AddMemberModal } from "../components/views/AddMemberModal";

// Hooks
import { useTeam } from "../hooks/useTeam";
import { useIncidents } from "../../incidents/hooks/useIncidents";

export const DashboardPage = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );

  const {
    team,
    removeMember,
    toggleStatus,
    sendInvite,
    isLoading: teamLoading,
  } = useTeam();
  const { incidents, isLoading: incidentsLoading } = useIncidents();

  const handleNavigate = useCallback((view: string, incidentId?: string) => {
    if (incidentId) {
      setSelectedIncidentId(incidentId);
    }
    setActiveView(view);
  }, []);

  const handleClearInitialIncident = useCallback(() => {
    setSelectedIncidentId(null);
  }, []);

  const handleAddMember = async (
    data: Omit<TeamMember, "id" | "status" | "avatarColor">,
  ) => {
    const success = await sendInvite(data.email, data.role);
    if (success) {
      setShowAddModal(false);
    }
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

  const isLoading = teamLoading || incidentsLoading;

  if (isLoading && activeView === "team") {
    return (
      <DashboardLayout
        activeView={activeView}
        setActiveView={setActiveView}
        user={{ name: "Alex Chen", role: "On-Call Lead" }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      activeView={activeView}
      setActiveView={handleNavigate}
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
          {activeView === "dashboard" && (
            <OverviewView
              team={team}
              incidents={incidents}
              setActiveView={handleNavigate}
            />
          )}
          {activeView === "incidents" && (
            <IncidentsView
              initialIncidentId={selectedIncidentId}
              onClearInitial={handleClearInitialIncident}
            />
          )}
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

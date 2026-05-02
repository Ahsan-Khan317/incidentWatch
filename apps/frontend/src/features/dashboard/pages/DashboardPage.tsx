"use client";
import { AnimatePresence } from "framer-motion";
import { UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Types
import { TeamMember } from "../types";

// View Components
import { IncidentsView } from "../../incidents/pages/IncidentsView";
import { LogsView } from "../../logs/pages/LogsView";
import { SettingsView } from "../../settings/pages/SettingsView";
import { TeamView } from "../../team/pages/TeamView";
import { OverviewView } from "../../overview/pages/OverviewView";

// Hooks
import { useIncidents } from "../../incidents/hooks/useIncidents";
import { AddMemberModal } from "../../team/components/AddMemberModal";
import { useTeam } from "../hooks/useTeam";
import { useViewStore } from "../store/view-store";

export const DashboardPage = () => {
  const { activeView, setActiveView, selectedId, clearSelectedId } =
    useViewStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const {
    team,
    removeMember,
    toggleStatus,
    sendInvite,
    isLoading: teamLoading,
  } = useTeam();
  const { incidents, isLoading: incidentsLoading } = useIncidents();

  const handleNavigate = useCallback(
    (view: any, incidentId?: string) => {
      setActiveView(view, incidentId);
    },
    [setActiveView],
  );

  const handleClearInitialIncident = useCallback(() => {
    clearSelectedId();
  }, [clearSelectedId]);

  const handleAddMember = async (
    data: Omit<TeamMember, "id" | "status" | "avatarColor">,
  ) => {
    const success = await sendInvite(data.email, data.role);
    if (success) {
      setShowAddModal(false);
    }
  };

  const isLoading = teamLoading || incidentsLoading;

  if (isLoading && activeView === "team") {
    return (
      <DashboardLayout user={{ name: "Alex Chen", role: "On-Call Lead" }}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      user={{ name: "Alex Chen", role: "On-Call Lead" }} // Kept for type safety if needed, but layout uses storeUser
    >
      <AnimatePresence mode="wait">
        {activeView === "dashboard" && (
          <>
            <OverviewView />
          </>
        )}
        {activeView === "incidents" && (
          <div className="">
            <IncidentsView
              initialIncidentId={selectedId}
              onClearInitial={handleClearInitialIncident}
            />
          </div>
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

      <AddMemberModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
      />
    </DashboardLayout>
  );
};

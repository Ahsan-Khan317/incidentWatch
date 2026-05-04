"use client";
import { AnimatePresence } from "framer-motion";
import { useCallback } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";

// View Components
import { IncidentsView } from "../../incidents/pages/IncidentsView";
import { LogsView } from "../../logs/pages/LogsView";
import { SettingsView } from "../../settings/pages/SettingsView";
import { TeamView } from "../../team/pages/TeamView";
import { OverviewView } from "../../overview/pages/OverviewView";
import ServicePage from "../../service/pages/ServicePage";
import { ServiceDetailView } from "../../service/pages/ServiceDetailView";

// Hooks
import { useIncidents } from "../../incidents/hooks/useIncidents";
import { useViewStore } from "../store/view-store";
import { useServiceStore } from "../store/service-store";

export const DashboardPage = () => {
  const { activeView, setActiveView, selectedId, clearSelectedId } =
    useViewStore();
  const { selectedServiceId } = useServiceStore();

  const { isLoading: incidentsLoading } = useIncidents();

  const handleNavigate = useCallback(
    (view: any, incidentId?: string) => {
      setActiveView(view, incidentId);
    },
    [setActiveView],
  );

  const handleClearInitialIncident = useCallback(() => {
    clearSelectedId();
  }, [clearSelectedId]);

  const isLoading = incidentsLoading;

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
        {activeView === "team" && <TeamView />}
        {activeView === "services" && <ServicePage />}
        {activeView === "service-context" &&
          (selectedServiceId === "all" ? (
            <ServicePage />
          ) : (
            <ServiceDetailView overrideId={selectedServiceId} />
          ))}
        {activeView === "service-details" && <ServiceDetailView />}

        {activeView === "settings" && <SettingsView />}
      </AnimatePresence>
    </DashboardLayout>
  );
};

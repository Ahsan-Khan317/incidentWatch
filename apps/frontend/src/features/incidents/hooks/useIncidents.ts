import { useState, useEffect, useCallback } from "react";
import { incidentApi } from "../api/incident.api";
import { Incident } from "../types";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await incidentApi.getAllIncidents();
      if (response.success) {
        setIncidents(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch incidents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const refresh = () => fetchIncidents();

  const acknowledgeIncident = async (id: string) => {
    try {
      const response = await incidentApi.updateStatus(id, "acknowledged");
      if (response.success) {
        await fetchIncidents();
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const resolveIncident = async (id: string) => {
    try {
      const response = await incidentApi.resolveIncident(id);
      if (response.success) {
        await fetchIncidents();
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  return {
    incidents,
    isLoading,
    error,
    refresh,
    acknowledgeIncident,
    resolveIncident,
  };
};

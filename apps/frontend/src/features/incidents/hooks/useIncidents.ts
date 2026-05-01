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

  return {
    incidents,
    isLoading,
    error,
    refresh,
  };
};

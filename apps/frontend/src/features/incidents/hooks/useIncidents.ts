import { useState, useEffect, useCallback } from "react";
import { incidentApi } from "../api/incident.api";
import { Incident } from "../types";
import { socketService, SOCKET_EVENTS } from "../../../lib/socket";

const extractId = (obj: any): string => {
  if (!obj) return "";
  const id = obj._id || obj.id;
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object") {
    // Handle Mongoose/BSON objects or custom JSON serializers
    if (id.$oid) return id.$oid;
    if (id.toString && id.toString() !== "[object Object]")
      return id.toString();
    return JSON.stringify(id);
  }
  return String(id);
};

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await incidentApi.getAllIncidents();
      if (response.success) {
        // Deduplicate incidents by robust ID extraction
        const uniqueIncidents = Array.from(
          new Map(
            response.data.map((item) => [extractId(item), item]),
          ).values(),
        );
        setIncidents(uniqueIncidents);
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

  // Real‑time updates via Socket.io
  useEffect(() => {
    const handler = (updated: any) => {
      const updatedId = extractId(updated);
      if (!updatedId) return;

      setIncidents((prev) =>
        prev.map((inc) => {
          return extractId(inc) === updatedId ? updated : inc;
        }),
      );
    };
    const socket = socketService.getSocket();
    socket.on(SOCKET_EVENTS.INCIDENT.UPDATED, handler);
    return () => {
      socket.off(SOCKET_EVENTS.INCIDENT.UPDATED, handler);
    };
  }, []);

  const refresh = () => fetchIncidents();

  const acknowledgeIncident = async (id: string) => {
    // Optimistic update
    setIncidents((prev) =>
      prev.map((inc) =>
        extractId(inc) === id ? { ...inc, status: "acknowledged" } : inc,
      ),
    );
    try {
      const response = await incidentApi.updateStatus(id, "acknowledged");
      if (response.success) {
        await fetchIncidents();
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      await fetchIncidents(); // Revert on failure
      return { success: false, message: err.message };
    }
  };

  const resolveIncident = async (id: string) => {
    // Optimistic update
    setIncidents((prev) =>
      prev.map((inc) =>
        extractId(inc) === id ? { ...inc, status: "resolved" } : inc,
      ),
    );
    try {
      const response = await incidentApi.resolveIncident(id);
      if (response.success) {
        await fetchIncidents();
      }
      return response;
    } catch (err: any) {
      setError(err.message);
      await fetchIncidents(); // Revert on failure
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

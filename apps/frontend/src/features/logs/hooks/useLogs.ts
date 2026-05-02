import { useState, useEffect } from "react";
import { logsApi, Log } from "../api/logs.api";

export const useLogs = () => {
  const [initialLogs, setInitialLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const data = await logsApi.getLogs();
        setInitialLogs(data);
      } catch (err: any) {
        console.error("Failed to fetch logs:", err);
        setError(err.message || "Failed to load historical logs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { initialLogs, isLoading, error };
};

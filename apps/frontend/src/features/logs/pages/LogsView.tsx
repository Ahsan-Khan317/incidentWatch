"use client";

import React, { useState, useEffect, useRef } from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import { Download, Pause, Play } from "lucide-react";
import LogTerminal from "../components/LogTerminal";
import LogStats from "../components/LogStats";
import { socketService } from "@/src/lib/socket";
import { useLogs } from "../hooks/useLogs";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";

export interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRIT";
  message: React.ReactNode;
  service?: string;
}

export const LogsView: React.FC = () => {
  const { selectedServiceId, services } = useServiceStore();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const selectedServiceName =
    services.find((s: any) => (s._id || s.id) === selectedServiceId)?.name ||
    "All Services";
  const { initialLogs, isLoading } = useLogs(
    selectedServiceId === "all" ? "all" : selectedServiceName,
  );
  const [lastLineNumber, setLastLineNumber] = useState(1000);

  // Helper to map MongoDB log to UI LogEntry
  const mapToLogEntry = (data: any, indexOffset: number = 0): LogEntry => {
    // Clean ANSI escape codes
    const cleanMessage =
      typeof data.message === "string"
        ? data.message.replace(/\u001b\[\d+m/g, "").replace(/\[\d+m/g, "")
        : data.message;

    return {
      id: data.id || data._id || Date.now().toString() + indexOffset,
      lineNumber: data.lineNumber || lastLineNumber + indexOffset,
      timestamp: data.timestamp
        ? new Date(data.timestamp).toLocaleTimeString([], { hour12: false })
        : new Date().toLocaleTimeString([], { hour12: false }),
      level: (data.level?.toUpperCase() || "INFO") as any,
      message: cleanMessage || "Empty log message",
      service: data.service || "SYSTEM",
    };
  };

  // Clear logs immediately when service selection changes to show loading state
  useEffect(() => {
    setLogs([]);
  }, [selectedServiceId]);

  // Load historical logs once they arrive
  useEffect(() => {
    if (initialLogs) {
      console.log("📚 Historical logs loaded:", initialLogs.length, "entries");
      // Reverse so newest is at the bottom
      const reversedLogs = [...initialLogs].reverse();
      const mapped = reversedLogs.map((log, i) => mapToLogEntry(log, i));
      setLogs(mapped);
      setLastLineNumber(1000 + mapped.length);
    }
  }, [initialLogs]);

  // Socket listener for new logs
  useEffect(() => {
    if (isPaused) return;

    const socket = socketService.getSocket();

    const handleNewLog = (data: any) => {
      // Filter logs by selected service if not "all"
      if (selectedServiceId !== "all" && data.service !== selectedServiceName) {
        return;
      }

      console.log("📥 New log received via Socket:", data);
      const newEntry = mapToLogEntry(data);
      setLogs((prev) => {
        const updated = [...prev, newEntry];
        setLastLineNumber((prev) => prev + 1);
        return updated.length > 100
          ? updated.slice(updated.length - 100)
          : updated;
      });
    };

    socket.on("log", handleNewLog);
    return () => {
      console.log("🔌 Cleaning up socket listener");
      socket.off("log", handleNewLog);
    };
  }, [isPaused, selectedServiceId, selectedServiceName]);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <SectionHeading
        title={`Live Logs: ${selectedServiceName}`}
        description={
          selectedServiceId === "all"
            ? "Real-time telemetry and system event logging across all services."
            : `Monitoring real-time telemetry specifically for ${selectedServiceName}.`
        }
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[0.6rem] font-bold text-neutral-400 uppercase">
              Database Sync
            </span>
            <span className="text-[0.7rem] font-black text-primary uppercase">
              {initialLogs?.length || 0} Logs Loaded
            </span>
          </div>
          <div className="h-8 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-xs uppercase transition-all shadow-sm ${
                isPaused
                  ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                  : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
              }`}
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button className="bg-white text-neutral-400 hover:text-neutral-700 border border-neutral-200 p-2 rounded transition-all shadow-sm">
              <Download size={16} />
            </button>
          </div>
        </div>
      </SectionHeading>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {isLoading && logs.length === 0 && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Fetching Logs...
                </span>
              </div>
            </div>
          )}
          <LogTerminal logs={logs} isPaused={isPaused} />
        </div>

        <div className="hidden w-72 flex-col gap-6 xl:flex">
          <LogStats logs={logs} isPaused={isPaused} />
        </div>
      </div>
    </Container>
  );
};

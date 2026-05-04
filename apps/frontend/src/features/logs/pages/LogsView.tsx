"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import { Download, Pause, Play } from "lucide-react";
import LogTerminal from "../components/LogTerminal";
import { socketService } from "@/src/lib/socket";
import api from "@/src/lib/api";
import { useLogs } from "../hooks/useLogs";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

export interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRIT";
  message: React.ReactNode;
  service?: string;
  data: any;
}

export const LogsView: React.FC = () => {
  const { user } = useAuthStore();
  const { selectedServiceId, services } = useServiceStore();
  const selectedService =
    services.find((s: any) => (s._id || s.id) === selectedServiceId) || null;
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [droppedCount, setDroppedCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [streamMetrics, setStreamMetrics] = useState<any>(null);
  const [liveReceived, setLiveReceived] = useState(0);
  const [liveFilteredOut, setLiveFilteredOut] = useState(0);
  const [liveLastEventAt, setLiveLastEventAt] = useState<string | null>(null);
  const isPausedRef = useRef(false);
  const lineCounterRef = useRef(1000);
  const pendingLogsRef = useRef<any[]>([]);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const flushRafRef = useRef<number | null>(null);

  const MAX_VISIBLE_LOGS = 1000;
  const MAX_FLUSH_BATCH = 500;
  const MAX_PENDING_LOGS = 5000;
  const MAX_ID_HISTORY = 5000;
  const DEBUG_POLL_MS = 5000;

  const selectedServiceName = selectedService?.name || "All Services";

  const selectedServiceFilter =
    selectedServiceId === "all"
      ? "all"
      : selectedService?.serverId ||
        selectedService?.serviceId ||
        selectedService?.name ||
        selectedServiceId;

  const { initialLogs, isLoading } = useLogs(selectedServiceFilter);

  const normalize = (value: unknown) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const selectedServiceAliases = useMemo(
    () =>
      new Set(
        [
          selectedServiceId,
          selectedServiceFilter,
          selectedService?._id,
          selectedService?.id,
          selectedService?.name,
          selectedService?.serverId,
          selectedService?.serviceId,
        ]
          .filter(Boolean)
          .map((v) => normalize(v)),
      ),
    [selectedServiceId, selectedServiceFilter, selectedService],
  );

  const shouldIncludeLiveEvent = useCallback(
    (data: any) => {
      // DEBUG LOG
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 Filtering Live Log:", {
          incomingOrg: data?.orgId,
          userOrg: user?.organizationId,
          incomingService: data?.service,
          selectedService: selectedServiceId,
          aliases: Array.from(selectedServiceAliases),
        });
      }

      const incomingOrgId = String(data?.orgId || "");
      const userOrgId = String(user?.organizationId || "");

      if (incomingOrgId && userOrgId && incomingOrgId !== userOrgId) {
        return false;
      }

      if (selectedServiceId === "all") return true;

      if (!selectedService) return true;

      const incoming = [
        data?.service,
        data?.serviceId,
        data?.metadata?.context?.service,
        data?.metadata?.context?.serverId,
      ]
        .filter(Boolean)
        .map((v) => normalize(v));

      // 1. Direct Alias Match (ID, Name, or serverId)
      const hasAliasMatch = incoming.some((v) => selectedServiceAliases.has(v));
      if (hasAliasMatch) return true;

      // 2. Extra Name Match (Case-insensitive check against the selected service object)
      if (selectedService?.name) {
        const normalizedName = normalize(selectedService.name);
        if (incoming.includes(normalizedName)) return true;
      }

      return false;
    },
    [user?.organizationId, selectedServiceId, selectedServiceAliases],
  );
  const flushPendingLogs = () => {
    flushRafRef.current = null;

    if (isPausedRef.current || pendingLogsRef.current.length === 0) {
      return;
    }

    const nextBatch = pendingLogsRef.current.splice(0, MAX_FLUSH_BATCH);

    setLogs((prev) => {
      const mappedBatch = nextBatch.map((entry) => {
        lineCounterRef.current += 1;
        return mapToLogEntry(entry, lineCounterRef.current);
      });

      console.log(`🎨 [LogsView] Flushing ${mappedBatch.length} logs to UI`);
      const updated = [...prev, ...mappedBatch];
      return updated.length > MAX_VISIBLE_LOGS
        ? updated.slice(updated.length - MAX_VISIBLE_LOGS)
        : updated;
    });

    if (pendingLogsRef.current.length > 0) {
      flushRafRef.current = requestAnimationFrame(flushPendingLogs);
    }
  };

  const scheduleFlush = () => {
    if (flushRafRef.current !== null) return;
    flushRafRef.current = requestAnimationFrame(flushPendingLogs);
  };

  // Helper to map MongoDB log to UI LogEntry
  const mapToLogEntry = (data: any, lineNumber?: number): LogEntry => {
    const cleanMessage = data.message; // Keep ANSI codes for rendering

    return {
      id:
        data.id ||
        data._id ||
        `${Date.now().toString()}-${Math.random().toString(36).slice(2, 8)}`,
      lineNumber: data.lineNumber || lineNumber || lineCounterRef.current,
      timestamp: data.timestamp
        ? new Date(data.timestamp).toLocaleTimeString([], { hour12: false })
        : new Date().toLocaleTimeString([], { hour12: false }),
      level: (data.level?.toUpperCase() || "INFO") as any,
      message: cleanMessage || "Empty log message",
      service: data.service || "SYSTEM",
      data: data,
    };
  };

  // Clear logs immediately when service selection changes to show loading state
  useEffect(() => {
    setLogs([]);
    setDroppedCount(0);
    setLiveReceived(0);
    setLiveFilteredOut(0);
    setLiveLastEventAt(null);
    lineCounterRef.current = 1000;
    pendingLogsRef.current = [];
  }, [selectedServiceId]);

  // Load historical logs once they arrive
  useEffect(() => {
    if (initialLogs) {
      console.log("📚 Historical logs loaded:", initialLogs.length, "entries");
      // Reverse so newest is at the bottom
      const reversedLogs = [...initialLogs].reverse();
      let currentLine = 1000;
      const mapped = reversedLogs.map((log) => {
        const logId = log.id || log._id || log.streamId;
        if (logId) seenIdsRef.current.add(logId);
        currentLine += 1;
        return mapToLogEntry(log, currentLine);
      });
      setLogs(mapped);
      lineCounterRef.current = currentLine;
    }
  }, [initialLogs]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused) {
      scheduleFlush();
    }
  }, [isPaused]);

  // Socket listener for new logs
  useEffect(() => {
    let mounted = true;

    const fetchStreamMetrics = async () => {
      try {
        const response = await api.get("/status/stream");
        if (!mounted) return;
        setStreamMetrics(response?.data?.data || null);
      } catch {
        if (!mounted) return;
        setStreamMetrics(null);
      }
    };

    fetchStreamMetrics();
    const timer = window.setInterval(fetchStreamMetrics, DEBUG_POLL_MS);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const socket = socketService.getSocket();
    const serviceFilter =
      selectedServiceId === "all" ? undefined : selectedServiceFilter;

    setSocketConnected(socket.connected);

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const subscriptionPayload = {
      orgId: user?.organizationId,
      service: selectedServiceId === "all" ? undefined : selectedServiceFilter,
    };

    console.log("🔌 Subscribing to logs:", subscriptionPayload);
    socketService.subscribeLogs(subscriptionPayload);

    const handleNewLog = (data: any, batchMode = false) => {
      const logId = data.id || data._id || data.streamId;

      if (logId && seenIdsRef.current.has(logId)) {
        return;
      }

      if (logId) {
        seenIdsRef.current.add(logId);
        if (seenIdsRef.current.size > MAX_ID_HISTORY) {
          const iterator = seenIdsRef.current.values();
          for (let i = 0; i < 1000; i++) {
            const val = iterator.next().value;
            if (val) seenIdsRef.current.delete(val);
          }
        }
      }

      setLiveReceived((prev) => prev + 1);

      if (!shouldIncludeLiveEvent(data)) {
        setLiveFilteredOut((prev) => prev + 1);
        return;
      }

      setLiveLastEventAt(new Date().toISOString());
      pendingLogsRef.current.push(data);

      if (pendingLogsRef.current.length > MAX_PENDING_LOGS) {
        const overflow = pendingLogsRef.current.length - MAX_PENDING_LOGS;
        setDroppedCount((prev) => prev + overflow);
        pendingLogsRef.current = pendingLogsRef.current.slice(overflow);
      }

      if (!isPausedRef.current && !batchMode) {
        scheduleFlush();
      }
    };

    const handleBatch = (batch: any[]) => {
      if (Array.isArray(batch)) {
        batch.forEach((log) => handleNewLog(log, true));
        if (!isPausedRef.current) {
          scheduleFlush();
        }
      }
    };

    socket.on("logs:stream", (data) => {
      console.log("📩 [Socket] Received logs:stream event", data);
      handleNewLog(data);
    });

    socket.on("logs:batch", (batch) => {
      console.log(
        `📩 [Socket] Received logs:batch event (${batch?.length ?? 0} items)`,
      );
      handleBatch(batch);
    });

    return () => {
      console.log("🔌 Cleaning up socket listener");
      socketService.unsubscribeLogs({
        orgId: user?.organizationId,
        service:
          selectedServiceId === "all" ? undefined : selectedServiceFilter,
      });
      socket.off("logs:stream", handleNewLog);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);

      if (flushRafRef.current !== null) {
        cancelAnimationFrame(flushRafRef.current);
        flushRafRef.current = null;
      }
    };
  }, [
    selectedServiceId,
    selectedServiceName,
    selectedServiceFilter,
    user?.organizationId,
    shouldIncludeLiveEvent,
  ]);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <SectionHeading
        title={`Live Logs: ${selectedServiceName}`}
        description={
          selectedServiceId === "all"
            ? "Real-time telemetry and system event logging across all active services."
            : `Monitoring real-time telemetry stream specifically for ${selectedServiceName}.`
        }
      >
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[0.6rem] font-bold text-muted uppercase">
                Live Debug
              </span>
              <span
                className={`text-[0.7rem] font-black uppercase ${socketConnected ? "text-success" : "text-danger"}`}
              >
                {socketConnected ? "SOCKET UP" : "SOCKET DOWN"}
              </span>
              <span className="text-[0.6rem] font-bold uppercase text-muted/60">
                IN {liveReceived} / PASS {liveReceived - liveFilteredOut}
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-end">
              <span className="text-[0.6rem] font-bold text-muted uppercase">
                Stream Buffer
              </span>
              <span className="text-[0.7rem] font-black text-primary uppercase">
                {initialLogs?.length || 0} Recent Events
              </span>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="flex flex-col items-end">
              <span className="text-[0.6rem] font-bold text-muted uppercase">
                Stream Bus
              </span>
              <span className="text-[0.7rem] font-black text-primary uppercase">
                PUB {streamMetrics?.bus?.published ?? 0} / CONS{" "}
                {streamMetrics?.bus?.consumed ?? 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center gap-2 px-4 py-2 rounded-none font-black text-[10px] uppercase transition-all shadow-sm border ${
                isPaused
                  ? "bg-warning/10 text-warning border-warning/30"
                  : "bg-success/10 text-success border-success/30"
              }`}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button className="bg-surface-2 text-muted hover:text-heading border border-border p-2 rounded-none transition-all shadow-sm">
              <Download size={14} />
            </button>
          </div>
        </div>
      </SectionHeading>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        <div className="flex flex-1 flex-col overflow-hidden relative">
          {liveLastEventAt && (
            <div className="mb-2 rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wide text-neutral-500">
              Last live event:{" "}
              {new Date(liveLastEventAt).toLocaleTimeString([], {
                hour12: false,
              })}
              {liveFilteredOut > 0 ? ` | Filtered out: ${liveFilteredOut}` : ""}
            </div>
          )}
          {isLoading && logs.length === 0 && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  Connecting to Stream...
                </span>
              </div>
            </div>
          )}
          <LogTerminal
            logs={logs}
            isPaused={isPaused}
            droppedCount={droppedCount}
          />
        </div>
      </div>
    </Container>
  );
};

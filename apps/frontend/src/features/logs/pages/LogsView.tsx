"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import { Download, Pause, Play, Terminal } from "lucide-react";
import LogTerminal from "../components/LogTerminal";
import LogStats from "../components/LogStats";

export interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRIT";
  message: React.ReactNode;
}

const LOG_TEMPLATES = [
  {
    level: "INFO",
    message: (id: string) => (
      <>
        Incoming <span className="text-primary">GET</span> request from{" "}
        <span className="text-muted">
          192.168.1.{Math.floor(Math.random() * 255)}
        </span>{" "}
        - <span className="text-info">request_id</span>="req_{id}"
      </>
    ),
  },
  {
    level: "INFO",
    message: (id: string) => (
      <>
        <span className="text-primary">POST</span> /api/v1/auth/login{" "}
        <span className="text-info">user_id</span>="usr_{id}"{" "}
        <span className="text-emerald-400 font-bold">status_code</span>="200"
      </>
    ),
  },
  {
    level: "WARN",
    message: () => (
      <>
        High latency detected on <span className="text-info">service</span>
        ="auth-gateway". Duration:{" "}
        <span className="text-amber-400 font-bold">
          {Math.floor(Math.random() * 2000)}ms
        </span>
      </>
    ),
  },
  {
    level: "ERROR",
    message: () => (
      <>
        Database connection timeout for{" "}
        <span className="text-info">
          shard_0{Math.floor(Math.random() * 9)}
        </span>
        . Retrying in 500ms...{" "}
        <span className="text-rose-500 font-bold">504</span>
      </>
    ),
  },
  {
    level: "CRIT",
    message: () => (
      <>
        OOM Exception in <span className="text-info">worker-pool</span>.{" "}
        <span className="text-rose-600 font-bold">SIGKILL</span> issued to
        process {Math.floor(Math.random() * 9000)}
      </>
    ),
  },
];

export const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [nextId, setNextId] = useState(1015);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialLogs: LogEntry[] = Array.from({ length: 15 }).map((_, i) => {
      const template =
        LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const id = Math.random().toString(36).substr(2, 6);
      return {
        id: `init-${i}`,
        lineNumber: 1000 + i,
        timestamp: new Date(Date.now() - (15 - i) * 2000).toLocaleTimeString(
          [],
          { hour12: false },
        ),
        level: template.level as any,
        message: template.message(id),
      };
    });
    setLogs(initialLogs);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(
      () => {
        setLogs((prev) => {
          const template =
            LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
          const randomId = Math.random().toString(36).substr(2, 6);
          const newLog: LogEntry = {
            id: Date.now().toString(),
            lineNumber: nextId,
            timestamp: new Date().toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            level: template.level as any,
            message: template.message(randomId),
          };

          setNextId((prev) => prev + 1);
          const updated = [...prev, newLog];
          return updated.length > 100
            ? updated.slice(updated.length - 100)
            : updated;
        });
      },
      1200 + Math.random() * 1000,
    );

    return () => clearInterval(interval);
  }, [isPaused, nextId]);

  return (
    <Container className="flex flex-col h-full overflow-hidden">
      <SectionHeading
        title="Live Logs"
        description="Real-time telemetry and system event logging across all services."
      >
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

          <button className="bg-surface-2 text-muted hover:text-heading border border-border p-2 rounded transition-all">
            <Download size={16} />
          </button>
        </div>
      </SectionHeading>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        <div className="flex flex-1 flex-col overflow-hidden">
          <LogTerminal logs={logs} isPaused={isPaused} />
        </div>

        <div className="hidden w-72 flex-col gap-6 xl:flex">
          <LogStats logs={logs} isPaused={isPaused} />
        </div>
      </div>
    </Container>
  );
};

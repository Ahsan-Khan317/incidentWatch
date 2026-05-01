"use client";
import React from "react";
import { motion } from "framer-motion";
import { Server } from "../types";

interface ServerCardProps {
  server: Server;
  isActive: boolean;
  onClick: () => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isActive,
  onClick,
}) => {
  const statusColor =
    server.status === "online"
      ? "text-success"
      : server.status === "degraded"
        ? "text-warning"
        : "text-danger";

  const statusBg =
    server.status === "online"
      ? "bg-success"
      : server.status === "degraded"
        ? "bg-warning"
        : "bg-danger";

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}
      whileTap={{ scale: 0.98 }}
      className={`group relative p-6 rounded-md border cursor-pointer transition-all duration-300 overflow-hidden ${
        isActive
          ? "bg-surface-2 border-primary shadow-[0_0_20px_rgba(74,222,128,0.15)]"
          : "bg-surface-1 border-border-soft hover:border-primary/50"
      }`}
    >
      {/* Dynamic Glow Background */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[60px] opacity-10 transition-colors ${statusBg}`}
      />

      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-2.5 h-2.5 rounded-full ${statusBg} ${server.status === "online" ? "animate-pulse" : ""}`}
            />
            <div
              className={`absolute inset-0 rounded-full blur-[4px] ${statusBg} ${server.status === "online" ? "animate-ping" : ""}`}
            />
          </div>
          <div>
            <h3 className="font-display font-bold text-heading tracking-tight text-lg group-hover:text-primary transition-colors">
              {server.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                {server.region}
              </span>
              <span className="w-1 h-1 rounded-full bg-border-strong" />
              <span className="text-[10px] font-mono font-medium text-muted">
                {server.lastPulse}
              </span>
            </div>
          </div>
        </div>
        <div
          className={`px-2 py-0.5 rounded-[4px] border ${server.status === "online" ? "border-success/30 bg-success-soft" : "border-warning/30 bg-warning-soft"} text-[9px] font-black uppercase tracking-tighter ${statusColor}`}
        >
          {server.status}
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center gap-2 bg-surface-0/50 p-2 rounded border border-border-soft/50">
          <span className="material-symbols-outlined text-muted text-sm">
            link
          </span>
          <p className="text-[11px] font-mono text-muted truncate">
            {server.url}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-black uppercase tracking-widest block opacity-60">
              Active Alerts
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-display font-bold leading-none ${server.incidentCount > 0 ? "text-danger" : "text-heading"}`}
              >
                {server.incidentCount.toString().padStart(2, "0")}
              </span>
              {server.incidentCount > 0 && (
                <div className="w-2 h-2 rounded-full bg-danger animate-bounce" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 text-muted group-hover:text-primary transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Inspect
            </span>
            <span className="material-symbols-outlined text-sm">
              arrow_forward_ios
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-border-soft">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: server.status === "online" ? "100%" : "70%" }}
          className={`h-full ${statusBg} opacity-50`}
        />
      </div>
    </motion.div>
  );
};

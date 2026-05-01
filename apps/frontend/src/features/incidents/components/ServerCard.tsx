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
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      className={`p-5 rounded-md border cursor-pointer transition-all ${
        isActive
          ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(98,223,125,0.15)]"
          : "bg-surface-1 border-border-soft hover:border-primary/40 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              server.status === "online"
                ? "bg-success animate-pulse"
                : server.status === "degraded"
                  ? "bg-warning"
                  : "bg-danger"
            }`}
          />
          <h3 className="font-display font-bold text-heading tracking-tight text-lg">
            {server.name}
          </h3>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono text-muted">{server.url}</p>
        <div className="flex justify-between items-end mt-4">
          <div>
            <span className="text-[10px] text-muted font-bold uppercase block">
              Active Incidents
            </span>
            <span
              className={`text-xl font-display font-bold ${server.incidentCount > 0 ? "text-danger" : "text-heading"}`}
            >
              {server.incidentCount.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="material-symbols-outlined text-muted">
            chevron_right
          </span>
        </div>
      </div>
    </motion.div>
  );
};

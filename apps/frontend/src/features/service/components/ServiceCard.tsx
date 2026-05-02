"use client";
import React from "react";
import { Activity, Globe, Shield, Trash2, Edit2, Clock } from "lucide-react";
import { Service } from "../types";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-success bg-success/10 border-success/20";
      case "error":
        return "text-danger bg-danger/10 border-danger/20";
      default:
        return "text-muted bg-surface-2 border-border-soft";
    }
  };

  const getEnvColor = (env: string) => {
    switch (env) {
      case "production":
        return "text-warning bg-warning/10 border-warning/20";
      case "staging":
        return "text-primary bg-primary/10 border-primary/20";
      default:
        return "text-zinc-500 bg-surface-2 border-border-soft";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-surface-1 border border-border-soft rounded-md p-6 hover:border-primary/30 transition-all shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-md border ${getStatusColor(service.status)}`}
          >
            <Activity size={20} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-heading uppercase tracking-tight group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getEnvColor(service.environment)}`}
              >
                {service.environment}
              </span>
              <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium uppercase tracking-wider">
                <Clock size={10} />
                Last Heartbeat:{" "}
                {new Date(service.lastHeartbeat).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(service)}
            className="p-2 rounded-md hover:bg-surface-2 text-muted hover:text-primary transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="p-2 rounded-md hover:bg-danger/10 text-muted hover:text-danger transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="bg-surface-0/50 rounded-md p-3 border border-border-soft/50">
          <div className="flex items-center gap-2 mb-1">
            <Shield size={12} className="text-primary" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Routing
            </span>
          </div>
          <p className="text-xs text-heading font-medium">
            {service.autoAssignEnabled
              ? `${service.assignmentRules.length} Active Rules`
              : "Manual Assignment"}
          </p>
        </div>
        <div className="bg-surface-0/50 rounded-md p-3 border border-border-soft/50">
          <div className="flex items-center gap-2 mb-1">
            <Globe size={12} className="text-zinc-500" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              Metatada
            </span>
          </div>
          <p className="text-xs text-heading font-medium">
            {Object.keys(service.metadata).length} Attributes
          </p>
        </div>
      </div>

      {service.members.length > 0 && (
        <div className="mt-6 flex items-center gap-2">
          <div className="flex -space-x-2">
            {service.members.slice(0, 3).map((member) => (
              <div
                key={member._id}
                className="w-6 h-6 rounded-full border-2 border-surface-1 bg-surface-2 flex items-center justify-center overflow-hidden"
                title={member.name}
              >
                {member.profileImage ? (
                  <img
                    src={member.profileImage}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[8px] font-bold text-muted">
                    {member.name.charAt(0)}
                  </span>
                )}
              </div>
            ))}
          </div>
          {service.members.length > 3 && (
            <span className="text-[9px] text-zinc-500 font-bold">
              +{service.members.length - 3} More
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

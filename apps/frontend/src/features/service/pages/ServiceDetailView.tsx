"use client";
import React from "react";
import {
  ArrowLeft,
  Activity,
  Globe,
  Shield,
  Clock,
  Users,
  Zap,
  Terminal,
  Server,
} from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useServiceStore } from "../../dashboard/store/service-store";
import { useViewStore } from "../../dashboard/store/view-store";
import { formatDate } from "../components/ServiceTable";

interface ServiceDetailViewProps {
  overrideId?: string | null;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  overrideId,
}) => {
  const { selectedId: viewSelectedId, setActiveView } = useViewStore();
  const { selectedServiceId } = useServiceStore();
  const effectiveId = overrideId || viewSelectedId || selectedServiceId;

  const { data: services, isLoading } = useServices();

  const service = services?.find((s: any) => s._id === effectiveId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted">Service not found.</p>
        <button
          onClick={() => setActiveView("services")}
          className="mt-4 text-primary hover:underline"
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("services")}
            className="p-2 hover:bg-surface-2 rounded-none border border-border text-muted transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white uppercase tracking-tight">
                {service.name}
              </h1>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
                  service.status === "active"
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-danger/30 bg-danger/10 text-danger"
                }`}
              >
                {service.status}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 uppercase tracking-widest font-medium">
              Service Infrastructure Details
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-surface-1 border border-border p-6 rounded-none">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Activity size={14} /> Service Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  Environment
                </p>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-primary" />
                  <p className="text-sm text-heading font-medium capitalize">
                    {service.environment}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  Base URL
                </p>
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-zinc-500" />
                  <p className="text-sm text-heading font-mono">
                    {service.baseUrl || "No URL provided"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  Auto-Assignment
                </p>
                <div className="flex items-center gap-2">
                  <Zap
                    size={14}
                    className={
                      service.autoAssignEnabled
                        ? "text-warning"
                        : "text-zinc-500"
                    }
                  />
                  <p className="text-sm text-heading font-medium">
                    {service.autoAssignEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold">
                  Created On
                </p>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-zinc-500" />
                  <p className="text-sm text-heading font-medium">
                    {formatDate(service.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2">
                Description
              </p>
              <p className="text-sm text-body leading-relaxed">
                {service.description ||
                  "No description provided for this service."}
              </p>
            </div>
          </div>

          {/* Assigned Team */}
          <div className="bg-surface-1 border border-border p-6 rounded-none">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Users size={14} /> Assigned Service Team
            </h3>

            {service.members?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.members.map((member: any) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 p-3 bg-surface-2 border border-border/50"
                  >
                    <div className="h-8 w-8 flex items-center justify-center bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {member.name?.[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-muted truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-dashed border-border">
                <p className="text-[10px] text-muted uppercase tracking-widest">
                  No specific members assigned
                </p>
                <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-tighter italic">
                  Org-wide fallback will be used
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Stats */}
        <div className="space-y-6">
          <div className="bg-surface-1 border border-border p-6 rounded-none">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">
              Service Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-2 border border-border/40">
                <div className="flex items-center gap-2">
                  <Server size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Heartbeat
                  </span>
                </div>
                <span className="text-[10px] text-success font-bold">
                  ALIVE
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-2 border border-border/40">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-primary" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Health
                  </span>
                </div>
                <span className="text-[10px] text-success font-bold">100%</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-6 rounded-none">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Zap size={16} />
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Quick Action
              </h4>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed mb-4 uppercase tracking-wider">
              Need to modify this service configuration or team assignments?
            </p>
            <button
              onClick={() => setActiveView("services")}
              className="w-full py-2 bg-primary text-black text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
            >
              Update Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

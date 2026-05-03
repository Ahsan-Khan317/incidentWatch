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
import DashboardButton from "@/src/components/ui/DashboardButton";
import { useAuthStore } from "@/src/features/auth/store/auth-store";

interface ServiceDetailViewProps {
  overrideId?: string | null;
}

export const ServiceDetailView: React.FC<ServiceDetailViewProps> = ({
  overrideId,
}) => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

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
    <div className="space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-purple-500/20 blur-xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface-1 border border-border p-6 md:p-8 rounded-none">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView("services")}
              className="group/back flex h-12 w-12 items-center justify-center bg-surface-2 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              title="Back to Services"
            >
              <ArrowLeft
                size={20}
                className="text-muted group-hover/back:text-primary transition-colors"
              />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-heading uppercase tracking-tighter">
                  {service.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg ${
                      service.status === "active"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-danger/30 bg-danger/10 text-danger"
                    }`}
                  >
                    {service.status}
                  </span>
                  {service.environment === "production" && (
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-warning/30 bg-warning/10 text-warning">
                      PROD
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] text-muted uppercase tracking-[0.3em] font-bold">
                  Active Monitoring System
                </p>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-3 self-end md:self-center">
              <DashboardButton
                variant="secondary"
                onClick={() => setActiveView("services", service._id)}
                className="border-border/50 hover:border-primary/40 text-[10px] font-bold uppercase tracking-widest px-6"
              >
                Configure Service
              </DashboardButton>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Pane */}
        <div className="lg:col-span-8 space-y-8">
          {/* Detailed Info Card */}
          <div className="bg-surface-1 border border-border overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-heading">
              <Server size={120} />
            </div>

            <div className="px-6 py-4 border-b border-border bg-surface-2/30 flex items-center gap-3">
              <Activity size={14} className="text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                System Parameters
              </h3>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <div className="space-y-2 group/item">
                  <label className="text-[9px] text-muted uppercase tracking-[0.2em] font-black group-hover/item:text-primary transition-colors">
                    Deployment Environment
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-surface-2/50 border border-border group-hover/item:border-primary/30 transition-all">
                    <Globe size={18} className="text-primary" />
                    <p className="text-sm text-heading font-bold uppercase tracking-widest">
                      {service.environment}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 group/item">
                  <label className="text-[9px] text-muted uppercase tracking-[0.2em] font-black group-hover/item:text-primary transition-colors">
                    Service Endpoint
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-surface-2/50 border border-border group-hover/item:border-primary/30 transition-all">
                    <Terminal size={18} className="text-zinc-500" />
                    <p className="text-sm text-heading font-mono truncate max-w-[200px]">
                      {service.baseUrl || "NULL_POINTER"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 group/item">
                  <label className="text-[9px] text-muted uppercase tracking-[0.2em] font-black group-hover/item:text-primary transition-colors">
                    Incident Routing
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-surface-2/50 border border-border group-hover/item:border-primary/30 transition-all">
                    <Zap
                      size={18}
                      className={
                        service.autoAssignEnabled
                          ? "text-warning"
                          : "text-zinc-600"
                      }
                    />
                    <p className="text-sm text-heading font-bold uppercase tracking-widest">
                      {service.autoAssignEnabled ? "AUTOMATED" : "MANUAL"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 group/item">
                  <label className="text-[9px] text-muted uppercase tracking-[0.2em] font-black group-hover/item:text-primary transition-colors">
                    Registry Date
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-surface-2/50 border border-border group-hover/item:border-primary/30 transition-all">
                    <Clock size={18} className="text-zinc-500" />
                    <p className="text-sm text-heading font-bold uppercase tracking-widest tabular-nums">
                      {formatDate(service.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-border">
                <label className="text-[9px] text-muted uppercase tracking-[0.2em] font-black mb-4 block">
                  Service Intelligence & Description
                </label>
                <div className="bg-surface-2/50 border border-border p-6 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                  <p className="text-sm text-body leading-relaxed font-medium italic">
                    {service.description ||
                      "No extended intelligence provided for this node."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Team Section */}
          <div className="bg-surface-1 border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-2/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={14} className="text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Assigned Response Team
                </h3>
              </div>
              <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                {service.members?.length || 0} Operators
              </span>
            </div>

            <div className="p-8">
              {service.members?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.members.map((member: any) => (
                    <div
                      key={member._id}
                      className="group/member flex items-center gap-4 p-4 bg-surface-2 border border-border/50 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="relative">
                        <div className="h-12 w-12 flex items-center justify-center bg-primary text-on-primary text-xs font-black border border-primary/20 group-hover/member:scale-105 transition-transform duration-300">
                          {member.name?.[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-success rounded-full border-2 border-surface-2" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-heading uppercase tracking-wider truncate">
                          {member.name}
                        </p>
                        <p className="text-[9px] text-muted truncate uppercase tracking-tighter mt-0.5">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border border-dashed border-border/60 bg-surface-2/20">
                  <div className="flex justify-center mb-4">
                    <Shield size={32} className="text-muted/30" />
                  </div>
                  <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-black">
                    No dedicated operators assigned
                  </p>
                  <p className="text-[9px] text-zinc-600 mt-2 uppercase tracking-widest font-medium italic">
                    Utilizing Organizational Expertise Fallback
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Diagnostics */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface-1 border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-surface-2/30">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Node Diagnostics
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-2 border border-border/40 group hover:border-success/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 text-success border border-success/20">
                    <Zap size={14} />
                  </div>
                  <span className="text-[10px] font-black text-heading uppercase tracking-widest">
                    Heartbeat
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  <span className="text-[10px] text-success font-black tracking-widest">
                    STABLE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-2 border border-border/40 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary border border-primary/20">
                    <Shield size={14} />
                  </div>
                  <span className="text-[10px] font-black text-heading uppercase tracking-widest">
                    Health Score
                  </span>
                </div>
                <span className="text-[10px] text-primary font-black tracking-widest">
                  100%
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-2 border border-border/40 group hover:border-warning/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 text-warning border border-warning/20">
                    <Activity size={14} />
                  </div>
                  <span className="text-[10px] font-black text-heading uppercase tracking-widest">
                    Error Rate
                  </span>
                </div>
                <span className="text-[10px] text-warning font-black tracking-widest">
                  0.00%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Pane */}
          <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-surface-1 border border-primary/30 p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                  <Zap size={32} />
                </div>
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-heading mb-3">
                System Management
              </h4>
              <p className="text-[10px] text-muted leading-relaxed mb-8 uppercase tracking-widest font-medium">
                Adjust infrastructure parameters, reassess response teams, or
                decommission this node.
              </p>
              {isAdmin && (
                <button
                  onClick={() => setActiveView("services", service._id)}
                  className="w-full py-4 bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary-hover transition-all duration-300 shadow-xl shadow-primary/10"
                >
                  Enter Control Plane
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

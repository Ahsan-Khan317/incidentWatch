"use client";
import React from "react";
import { Eye, Pencil, Trash2, Shield } from "lucide-react";
import DashboardButton from "@/src/components/ui/DashboardButton";
import { Service } from "../types";
import { ServiceSkeleton } from "./ServiceSkeleton";
import { useViewStore } from "../../dashboard/store/view-store";

export function formatDate(dateValue: string | Date) {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

interface ServiceTableProps {
  services: Service[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  isLoading,
  isError,
  error,
  onEdit,
  onDelete,
}) => {
  const { setActiveView } = useViewStore();

  return (
    <div className="group/table overflow-hidden border border-dashed border-border bg-surface-1 rounded-none shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-surface-0/50">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-heading">
            Infastructure Registry
          </h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted tabular-nums">
          {Array.isArray(services) ? services.length : 0} Services Active
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-2/30 text-[0.625rem] uppercase tracking-[0.2em] text-muted">
              <th className="px-6 py-4 font-bold">Service Identity</th>
              <th className="px-6 py-4 font-bold">Node Environment</th>
              <th className="px-6 py-4 font-bold">Operational Status</th>
              <th className="px-6 py-4 font-bold">Deployment Date</th>
              <th className="px-6 py-4 font-bold text-right">Control Plane</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? <ServiceSkeleton /> : null}

            {isError ? (
              <tr>
                <td className="px-6 py-12 text-danger text-center" colSpan={5}>
                  <p className="text-xs uppercase tracking-widest font-bold">
                    {error?.message || "Failed to synchronize services."}
                  </p>
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && services.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-12 text-muted text-center italic"
                  colSpan={5}
                >
                  <p className="text-xs uppercase tracking-[0.2em]">
                    No active infrastructure detected.
                  </p>
                </td>
              </tr>
            ) : null}

            {Array.isArray(services) &&
              services.map((service) => (
                <tr
                  key={service._id}
                  className="group/row hover:bg-primary/5 transition-all duration-300"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="p-2.5 bg-surface-2 rounded-none border border-border group-hover/row:border-primary/50 group-hover/row:text-primary transition-all duration-300">
                          <Shield size={16} />
                        </div>
                        {service.autoAssignEnabled && (
                          <div
                            className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-warning border-2 border-surface-1"
                            title="Auto-assignment active"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-heading transition-colors">
                          {service.name || "-"}
                        </p>

                        <p className="mt-1 text-[9px] text-muted uppercase tracking-[0.15em] font-medium">
                          {service.autoAssignEnabled
                            ? "Dynamic Incident Routing"
                            : "Manual Triage Only"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          service.environment === "production"
                            ? "bg-warning"
                            : service.environment === "staging"
                              ? "bg-primary"
                              : "bg-zinc-500"
                        }`}
                      />
                      <span className="uppercase text-[10px] font-bold tracking-widest text-body">
                        {service.environment || "-"}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] rounded-none border ${
                        service.status === "active"
                          ? "border-success/20 bg-success/5 text-success"
                          : service.status === "error"
                            ? "border-danger/20 bg-danger/5 text-danger"
                            : "border-zinc-500/20 bg-zinc-500/5 text-zinc-500"
                      }`}
                    >
                      {service.status || "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-[10px] font-medium text-body tabular-nums tracking-wider uppercase">
                      {formatDate(service.createdAt)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover/row:opacity-100 transition-all duration-300 translate-x-2 group-hover/row:translate-x-0">
                      <DashboardButton
                        variant="secondary"
                        onClick={() =>
                          setActiveView("service-details", service._id)
                        }
                        className="h-8 px-4 rounded-none border-border/50 hover:border-primary hover:bg-primary/10 hover:text-primary text-[9px] font-bold uppercase tracking-widest transition-all focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        <Eye size={12} className="mr-2" />
                        Details
                      </DashboardButton>

                      <button
                        onClick={() => onEdit(service)}
                        className="p-2 text-muted hover:text-heading hover:bg-surface-3 transition-all rounded-none border border-transparent hover:border-border focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        title="Configuration"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => onDelete(service)}
                        className="p-2 text-muted hover:text-danger hover:bg-danger/10 transition-all rounded-none border border-transparent hover:border-danger/20 focus:ring-2 focus:ring-danger/20 focus:outline-none"
                        title="Decommission"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

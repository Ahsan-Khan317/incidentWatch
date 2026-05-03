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
    <div className="overflow-hidden border border-dashed border-border bg-surface-1 rounded-none">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm uppercase tracking-[0.12em] text-heading">
          All Services
        </h2>
        <span className="text-[0.6875rem] text-body">
          {Array.isArray(services) ? services.length : 0} total
        </span>
      </div>

      <div className="max-h-[60vh] overflow-auto scrollbar-hide">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Environment</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Created</th>
              <th className="px-4 py-3 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <ServiceSkeleton /> : null}

            {isError ? (
              <tr>
                <td className="px-4 py-6 text-danger" colSpan={5}>
                  {error?.message || "Could not load services."}
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && services.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-body italic" colSpan={5}>
                  No services yet. Create your first service above.
                </td>
              </tr>
            ) : null}

            {Array.isArray(services) &&
              services.map((service) => (
                <tr
                  key={service._id}
                  className="border-b border-border/60 last:border-b-0 hover:bg-surface-2/50 transition-colors"
                >
                  <td className="px-4 py-4 text-heading">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 rounded-none border border-primary/10 text-primary">
                        <Shield size={14} />
                      </div>
                      <div>
                        <p className="font-medium">{service.name || "-"}</p>
                        <p className="mt-0.5 text-[10px] text-body uppercase tracking-wider">
                          {service.autoAssignEnabled
                            ? "Auto-Routing"
                            : "Manual"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="capitalize text-body text-xs font-medium">
                      {service.environment || "-"}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex border px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-widest rounded-none ${
                        service.status === "active"
                          ? "border-success/30 bg-success/10 text-success"
                          : service.status === "error"
                            ? "border-danger/30 bg-danger/10 text-danger"
                            : "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
                      }`}
                    >
                      {service.status || "Inactive"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-body text-xs">
                    {formatDate(service.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <DashboardButton
                        variant="secondary"
                        onClick={() =>
                          setActiveView("service-details", service._id)
                        }
                        className="h-8 px-3 rounded-none border-border/50 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
                      >
                        <Eye size={12} className="mr-2" />
                        Details
                      </DashboardButton>

                      <button
                        onClick={() => onEdit(service)}
                        className="p-2 text-muted hover:text-primary hover:bg-surface-2 transition-all"
                        title="Edit Service"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => onDelete(service)}
                        className="p-2 text-muted hover:text-danger hover:bg-danger/5 transition-all"
                        title="Delete Service"
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

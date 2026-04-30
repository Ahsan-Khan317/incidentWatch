"use client";
import React from "react";

export const IncidentsView: React.FC = () => {
  const incidents = [
    {
      id: "INC-442",
      severity: "critical",
      service: "DB-CLUSTER-01",
      responder: "Marcus Thorne",
      status: "Investigating",
      duration: "14m",
    },
    {
      id: "INC-441",
      severity: "high",
      service: "AUTH-SERVICE",
      responder: "Sarah Liao",
      status: "Monitoring",
      duration: "1h 45m",
    },
    {
      id: "INC-440",
      severity: "medium",
      service: "API-GATEWAY",
      responder: "James Dean",
      status: "Resolved",
      duration: "42m",
    },
    {
      id: "INC-439",
      severity: "critical",
      service: "PAYMENT-V2",
      responder: "Elena Kostas",
      status: "Resolved",
      duration: "2h 15m",
    },
    {
      id: "INC-438",
      severity: "low",
      service: "UI-ASSETS",
      responder: "Unassigned",
      status: "Identified",
      duration: "4m",
    },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger-soft border-danger-border text-danger";
      case "high":
        return "bg-warning-soft border-warning-border text-warning";
      case "medium":
        return "bg-info-soft border-info-border text-info";
      case "low":
        return "bg-surface-3 border-border text-muted";
      default:
        return "bg-surface-3 border-border text-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Investigating":
        return (
          <span className="material-symbols-outlined text-sm animate-spin text-primary">
            progress_activity
          </span>
        );
      case "Monitoring":
        return (
          <span className="material-symbols-outlined text-sm text-warning">
            visibility
          </span>
        );
      case "Resolved":
        return (
          <span className="material-symbols-outlined text-sm text-success">
            check_circle
          </span>
        );
      case "Identified":
        return (
          <span className="material-symbols-outlined text-sm text-info">
            search
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      {/* Stats Overview Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">
            Active Now
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-heading">
              04
            </span>
            <span className="text-xs text-danger font-medium">+1 vs avg</span>
          </div>
        </div>
        <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">
            Avg Response
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-heading">
              12m
            </span>
            <span className="text-xs text-success font-medium">-4m vs avg</span>
          </div>
        </div>
        <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-bold text-muted uppercase tracking-widest">
            Uptime (24h)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display font-bold text-heading">
              99.98%
            </span>
          </div>
        </div>
        <div className="bg-success-soft border border-success-border p-4 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-xs font-bold text-success uppercase tracking-widest">
            Global Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-success shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
            <span className="text-sm font-bold text-success-text">
              Operational
            </span>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-surface-1 p-1 rounded-md border border-border-soft w-fit shadow-sm">
          <button className="px-3 py-1.5 text-xs font-bold rounded-md bg-surface-3 text-heading">
            All Incidents
          </button>
          <button className="px-3 py-1.5 text-xs font-bold rounded-md text-muted hover:text-heading transition-colors">
            Active
          </button>
          <button className="px-3 py-1.5 text-xs font-bold rounded-md text-muted hover:text-heading transition-colors">
            Resolved
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-sm">
              search
            </span>
            <input
              className="bg-surface-1 border border-border-soft rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary transition-colors text-heading w-full md:w-64 shadow-sm"
              placeholder="Search incidents..."
              type="text"
            />
          </div>
          <button className="p-1.5 border border-border-soft rounded-md hover:bg-surface-1 text-muted shadow-sm transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              filter_list
            </span>
          </button>
        </div>
      </div>

      {/* Incident Table */}
      <div className="bg-surface-1 rounded-md overflow-hidden border border-border-soft shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-soft bg-surface-2">
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Incident ID
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Severity
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Service
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Responder
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-widest">
                  Duration
                </th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {incidents.map((incident, idx) => (
                <tr
                  key={incident.id}
                  className="hover:bg-surface-2 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-heading text-sm font-bold">
                      {incident.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-md border w-fit shadow-sm ${getSeverityStyles(incident.severity)}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-sm ${
                          incident.severity === "critical"
                            ? "bg-danger shadow-[0_0_8px_rgba(220,38,38,0.6)]"
                            : incident.severity === "high"
                              ? "bg-warning"
                              : incident.severity === "medium"
                                ? "bg-info"
                                : "bg-muted"
                        }`}
                      ></div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {incident.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md border border-border-soft bg-surface-3 text-[10px] font-bold font-mono text-muted uppercase">
                      {incident.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {incident.responder === "Unassigned" ? (
                        <div className="w-6 h-6 rounded-md bg-surface-3 border border-border-soft flex items-center justify-center">
                          <span className="text-[10px] font-bold text-muted">
                            ?
                          </span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-primary-soft border border-primary-muted text-primary flex items-center justify-center text-xs font-bold">
                          {incident.responder
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                      <span
                        className={`text-sm font-bold ${incident.responder === "Unassigned" ? "text-muted italic" : "text-heading"}`}
                      >
                        {incident.responder}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-heading">
                      {getStatusIcon(incident.status)}
                      <span className="text-xs font-bold">
                        {incident.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-muted">
                      {incident.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-heading">
                      <span className="material-symbols-outlined text-[20px]">
                        chevron_right
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-soft flex items-center justify-between bg-surface-2">
          <span className="text-xs font-bold text-muted">
            Showing 5 of 124 incidents
          </span>
          <div className="flex items-center gap-2">
            <button className="p-1 text-muted hover:text-heading transition-colors">
              <span className="material-symbols-outlined text-xl">
                chevron_left
              </span>
            </button>
            <span className="text-xs font-mono font-bold text-heading px-2">
              1 / 25
            </span>
            <button className="p-1 text-muted hover:text-heading transition-colors">
              <span className="material-symbols-outlined text-xl">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Incident History Chart (Mini) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-heading tracking-tight">
              Mean Time to Resolve (MTTR)
            </h3>
            <span className="text-[10px] font-mono font-bold text-muted tracking-widest">
              LAST 7 DAYS
            </span>
          </div>
          <div className="h-32 flex items-end gap-2 px-2 border-b border-border-soft pb-1">
            {[40, 60, 30, 85, 50, 45, 20].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all cursor-help relative group ${
                  h === 85
                    ? "bg-primary-soft border-t-2 border-primary hover:bg-primary/30 h-[85%]"
                    : "bg-surface-3 hover:bg-surface-2 h-[" + h + "%]"
                }`}
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-heading tracking-tight">
              Incident Distribution
            </h3>
            <span className="text-[10px] font-mono font-bold text-muted tracking-widest">
              BY SERVICE
            </span>
          </div>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-muted">DATABASE</span>
                <span className="text-heading">42%</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-md overflow-hidden border border-border-soft">
                <div className="h-full bg-danger w-[42%] rounded-md"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-muted">API GATEWAY</span>
                <span className="text-heading">28%</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-md overflow-hidden border border-border-soft">
                <div className="h-full bg-primary w-[28%] rounded-md"></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-muted">AUTH SERVICE</span>
                <span className="text-heading">15%</span>
              </div>
              <div className="h-2 w-full bg-surface-2 rounded-md overflow-hidden border border-border-soft">
                <div className="h-full bg-warning w-[15%] rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

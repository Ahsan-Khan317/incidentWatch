"use client";
import React from "react";
import { motion } from "framer-motion";
import { TeamMember } from "../../types";

interface OverviewViewProps {
  team: TeamMember[];
  incidents: any[];
  setActiveView: (view: string, targetId?: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  team,
  incidents,
  setActiveView,
}) => {
  // --- Dynamic Logic ---
  const activeIncidents = incidents.filter((inc) => inc.status !== "resolved");
  const criticalIncidents = activeIncidents.filter(
    (inc) => inc.severity === "critical",
  );
  const highIncidents = activeIncidents.filter(
    (inc) => inc.severity === "high",
  );

  // Calculate System Health: Start at 100%, subtract for each active issue
  const healthPenalty =
    criticalIncidents.length * 15 + highIncidents.length * 5;
  const systemHealth = Math.max(0, 100 - healthPenalty).toFixed(1);
  const healthColor =
    parseFloat(systemHealth) > 90
      ? "text-success"
      : parseFloat(systemHealth) > 70
        ? "text-warning"
        : "text-danger";
  const healthBarColor =
    parseFloat(systemHealth) > 90
      ? "bg-success"
      : parseFloat(systemHealth) > 70
        ? "bg-warning"
        : "bg-danger";

  // Format recent events for the timeline (limit to last 5)
  const recentEvents = [...incidents]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical":
        return "border-danger text-danger bg-danger/10";
      case "high":
        return "border-warning text-warning bg-warning/10";
      case "medium":
        return "border-info text-info bg-info/10";
      default:
        return "border-muted text-muted bg-muted/10";
    }
  };

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Metric Cards Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => setActiveView("incidents")}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              Active Incidents
            </span>
            <span
              className={`material-symbols-outlined ${activeIncidents.length > 0 ? "text-danger" : "text-success"}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {activeIncidents.length > 0 ? "warning" : "check_circle"}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-heading tracking-tight">
              {activeIncidents.length}
            </span>
            {criticalIncidents.length > 0 && (
              <span className="text-danger font-mono text-[13px] px-2 py-0.5 bg-danger-soft rounded border border-danger-border font-bold animate-pulse">
                {criticalIncidents.length} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-muted font-medium mt-2">
            {incidents.filter((inc) => inc.status === "resolved").length}{" "}
            Resolved in history
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              Average Severity
            </span>
            <span className="material-symbols-outlined text-info">
              analytics
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-display font-bold text-heading tracking-tight uppercase">
              {highIncidents.length > 0
                ? "High"
                : activeIncidents.length > 0
                  ? "Moderate"
                  : "Nominal"}
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-2">
            Based on current fleet state
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => setActiveView("team")}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              On-Call Engineers
            </span>
            <span className="material-symbols-outlined text-info">
              engineering
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-heading tracking-tight">
              {team.filter((m) => m.status === "on-duty").length}
            </span>
            <span className="text-info font-mono text-[13px] px-2 py-0.5 bg-info-soft rounded border border-info-border font-bold">
              Active
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-2">
            {team.length} total responders
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              System Health
            </span>
            <span className={`material-symbols-outlined ${healthColor}`}>
              bolt
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-display font-bold ${healthColor} tracking-tight`}
            >
              {systemHealth}
            </span>
            <span className="text-muted font-mono text-[13px]">%</span>
          </div>
          <div className="w-full bg-surface-2 h-1.5 mt-2 rounded-md overflow-hidden border border-border-soft">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${systemHealth}%` }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              className={`${healthBarColor} h-full rounded-md`}
            />
          </div>
        </motion.div>
      </div>

      {/* Dashboard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Team Roster Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-display font-bold text-heading tracking-tight">
              Team Roster
            </h3>
            <button
              onClick={() => setActiveView("team")}
              className="text-primary text-sm font-bold hover:text-primary-hover transition-colors"
            >
              View All
            </button>
          </div>
          <div className="bg-surface-1 border border-border-soft overflow-hidden rounded-md shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-2 border-b border-border-soft">
                  <th className="px-6 py-4 text-[11px] font-bold tracking-widest text-muted uppercase">
                    Engineer
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold tracking-widest text-muted uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold tracking-widest text-muted uppercase">
                    Expertise
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold tracking-widest text-muted uppercase">
                    Load
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {team.slice(0, 5).map((member, i) => (
                  <tr
                    key={member.id}
                    onClick={() => setActiveView("team")}
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-md ${member.status === "on-duty" ? "bg-info-soft border-info-border text-info" : "bg-surface-3 border-border text-muted"} border flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform`}
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-heading">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted font-medium">
                          {member.role}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {member.status === "on-duty" ? (
                        <span className="px-2.5 py-1 bg-info-soft text-info text-[10px] font-bold uppercase rounded-md border border-info-border tracking-wider shadow-sm">
                          On-Call
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-success-soft text-success text-[10px] font-bold uppercase rounded-md border border-success-border tracking-wider shadow-sm">
                          Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {member.expertise.slice(0, 2).map((exp) => (
                          <span
                            key={exp}
                            className="px-1.5 py-0.5 bg-surface-2 border border-border-soft text-[9px] text-muted rounded uppercase font-bold"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 bg-surface-3 border border-border-soft h-1.5 rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md ${member.status === "on-duty" ? "bg-info w-[65%]" : "bg-muted opacity-30 w-[10%]"}`}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Trends Visualization (Static Placeholder with Dynamic Context) */}
          <div className="mt-4 p-8 bg-surface-1 border border-border-soft rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-display font-bold text-lg text-heading tracking-tight">
                System Activity (24h)
              </h4>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-xs font-bold text-muted">
                  {incidents.length} Events Logged
                </span>
              </div>
            </div>
            <div className="h-32 flex items-end gap-1 px-2 border-b border-border-soft pb-1">
              {[
                60, 45, 90, 32, 55, 100, 48, 99, 40, 70, 85, 30, 45, 60, 20, 10,
              ].map((h, i) => (
                <div
                  key={`chart-${i}`}
                  className={`flex-1 ${h > 80 ? "bg-danger/40" : "bg-primary/20"} border-t border-border-soft rounded-t-sm transition-all`}
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-[11px] font-bold text-muted font-mono px-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        {/* Right: System Events Timeline */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-display font-bold text-heading tracking-tight">
              Recent Activity
            </h3>
            <span className="material-symbols-outlined text-muted text-sm cursor-pointer hover:text-heading">
              history
            </span>
          </div>
          <div className="bg-surface-1 border border-border-soft p-8 rounded-md shadow-sm h-full relative overflow-hidden">
            <div className="absolute left-10 top-10 bottom-10 w-px bg-border-soft"></div>
            <div className="flex flex-col gap-8 relative z-10">
              {recentEvents.length > 0 ? (
                recentEvents.map((event, idx) => (
                  <div
                    key={event._id || idx}
                    onClick={() => setActiveView("incidents", event._id)}
                    className="flex gap-5 relative group cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md bg-surface-1 border-2 ${event.status === "resolved" ? "border-success" : "border-danger"} z-10 flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform`}
                    >
                      {event.status === "resolved" ? (
                        <span className="material-symbols-outlined text-[12px] text-success font-bold">
                          check
                        </span>
                      ) : (
                        <div
                          className={`w-1.5 h-1.5 rounded-sm ${event.severity === "critical" ? "bg-danger animate-pulse" : "bg-warning"}`}
                        ></div>
                      )}
                    </div>
                    <div className="flex-1 -mt-1">
                      <div className="flex justify-between items-start mb-1.5">
                        <p className="text-sm font-bold text-heading line-clamp-1">
                          {event.title}
                        </p>
                        <span className="text-[9px] font-mono font-bold text-muted whitespace-nowrap ml-2">
                          {new Date(event.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-body font-medium leading-relaxed mb-3 line-clamp-2">
                        {event.description || "No description provided."}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 border rounded text-[9px] font-bold font-mono uppercase ${getSeverityColor(event.severity)}`}
                        >
                          {event.severity}
                        </span>
                        <span className="px-2 py-0.5 bg-surface-2 border border-border-soft text-muted text-[9px] font-bold font-mono rounded uppercase">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <span className="material-symbols-outlined text-4xl mb-2">
                    visibility_off
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No Recent Activity
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setActiveView("logs")}
              className="w-full mt-10 py-3 text-xs font-bold text-muted border border-border-soft rounded-md hover:bg-surface-2 hover:text-heading transition-colors"
            >
              View Activity Log
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

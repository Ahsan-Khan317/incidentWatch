"use client";
import React from "react";
import { motion } from "framer-motion";
import { TeamMember } from "../../types";

interface OverviewViewProps {
  team: TeamMember[];
}

export const OverviewView: React.FC<OverviewViewProps> = ({ team }) => {
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
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              Active Incidents
            </span>
            <span
              className="material-symbols-outlined text-danger"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-heading tracking-tight">
              2
            </span>
            <span className="text-danger font-mono text-[13px] px-2 py-0.5 bg-danger-soft rounded border border-danger-border font-bold">
              Critical
            </span>
          </div>
          <p className="text-xs text-muted font-medium mt-2">
            1 Resolved in last 12h
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
        >
          <div className="flex justify-between items-start">
            <span className="text-muted text-[12px] font-bold tracking-widest uppercase">
              MTTR
            </span>
            <span className="material-symbols-outlined text-success">
              timer
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-heading tracking-tight">
              14
            </span>
            <span className="text-muted font-mono text-[13px]">mins</span>
          </div>
          <p className="text-xs text-success font-medium mt-2">
            ↓ 4.2% from average
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="bg-surface-1 border border-border-soft p-6 flex flex-col gap-2 rounded-md shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-default"
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
            Next rotation in 4h
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
            <span className="material-symbols-outlined text-success">bolt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-heading tracking-tight">
              99.9
            </span>
            <span className="text-muted font-mono text-[13px]">%</span>
          </div>
          <div className="w-full bg-surface-2 h-1.5 mt-2 rounded-md overflow-hidden border border-border-soft">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "99.9%" }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
              className="bg-success h-full rounded-md"
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
            <button className="text-primary text-sm font-bold hover:text-primary-hover transition-colors">
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
                    Assigned
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold tracking-widest text-muted uppercase">
                    Load
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {team.map((member, i) => (
                  <tr
                    key={member.id}
                    className="hover:bg-primary/5 transition-colors group"
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
                    <td className="px-6 py-4 text-sm font-medium text-body">
                      {member.status === "on-duty"
                        ? "1 Incident"
                        : "0 Incidents"}
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

          {/* System Health Chart Simulation */}
          <div className="mt-4 p-8 bg-surface-1 border border-border-soft rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-display font-bold text-lg text-heading tracking-tight">
                Regional Infrastructure Health
              </h4>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-xs font-bold text-muted">
                  <span className="w-2.5 h-2.5 rounded-sm bg-success shadow-sm"></span>{" "}
                  US-East
                </span>
                <span className="flex items-center gap-2 text-xs font-bold text-muted">
                  <span className="w-2.5 h-2.5 rounded-sm bg-info shadow-sm"></span>{" "}
                  EU-West
                </span>
              </div>
            </div>
            <div className="h-32 flex items-end gap-1 px-2 border-b border-border-soft pb-1">
              {[80, 85, 90, 92, 95, 100, 98, 99].map((h, i) => (
                <div
                  key={`us-${i}`}
                  className="flex-1 bg-success-soft hover:bg-success border-t border-success-border rounded-t-sm transition-all"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
              {[70, 75, 85, 82, 90, 88, 92, 91].map((h, i) => (
                <div
                  key={`eu-${i}`}
                  className="flex-1 bg-info-soft hover:bg-info border-t border-info-border rounded-t-sm transition-all"
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
              System Events
            </h3>
            <span className="material-symbols-outlined text-muted text-sm cursor-pointer hover:text-heading">
              filter_list
            </span>
          </div>
          <div className="bg-surface-1 border border-border-soft p-8 rounded-md shadow-sm h-full relative overflow-hidden">
            <div className="absolute left-10 top-10 bottom-10 w-px bg-border-soft"></div>
            <div className="flex flex-col gap-8 relative z-10">
              {/* Event 1 */}
              <div className="flex gap-5 relative group">
                <div className="w-5 h-5 rounded-md bg-surface-1 border-2 border-danger z-10 flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-sm bg-danger animate-pulse"></div>
                </div>
                <div className="flex-1 -mt-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-sm font-bold text-heading">
                      Critical: API Latency Spike
                    </p>
                    <span className="text-[10px] font-mono font-bold text-muted">
                      14m ago
                    </span>
                  </div>
                  <p className="text-xs text-body font-medium leading-relaxed mb-3">
                    P95 latency exceeded 1500ms in us-east-1 region. Traffic
                    rerouted to secondary cluster.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-surface-2 border border-border-soft text-muted text-[10px] font-bold font-mono rounded">
                      us-east-1
                    </span>
                    <span className="px-2.5 py-1 bg-surface-2 border border-border-soft text-muted text-[10px] font-bold font-mono rounded">
                      LB-02
                    </span>
                  </div>
                </div>
              </div>

              {/* Event 2 */}
              <div className="flex gap-5 relative group">
                <div className="w-5 h-5 rounded-md bg-surface-1 border-2 border-success z-10 flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform">
                  <span className="material-symbols-outlined text-[12px] text-success font-bold">
                    check
                  </span>
                </div>
                <div className="flex-1 -mt-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-sm font-bold text-heading">
                      Resolved: Database Lock
                    </p>
                    <span className="text-[10px] font-mono font-bold text-muted">
                      2h ago
                    </span>
                  </div>
                  <p className="text-xs text-body font-medium leading-relaxed mb-2">
                    Deadlock cleared on master node. Performance returned to
                    baseline levels.
                  </p>
                </div>
              </div>

              {/* Event 3 */}
              <div className="flex gap-5 relative group">
                <div className="w-5 h-5 rounded-md bg-surface-1 border-2 border-info z-10 flex items-center justify-center shadow-sm group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-sm bg-info"></div>
                </div>
                <div className="flex-1 -mt-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-sm font-bold text-heading">
                      Info: Scheduled Maintenance
                    </p>
                    <span className="text-[10px] font-mono font-bold text-muted">
                      4h ago
                    </span>
                  </div>
                  <p className="text-xs text-body font-medium leading-relaxed mb-3">
                    Automated patch deployment initiated for
                    kubernetes-cluster-04.
                  </p>
                  <span className="px-2.5 py-1 bg-info-soft border border-info-border text-info text-[10px] font-bold tracking-wider rounded">
                    AUTOMATED
                  </span>
                </div>
              </div>

              {/* Event 4 */}
              <div className="flex gap-5 relative group">
                <div className="w-5 h-5 rounded-md bg-surface-1 border-2 border-muted opacity-60 z-10 flex items-center justify-center group-hover:scale-125 transition-transform group-hover:opacity-100">
                  <div className="w-1.5 h-1.5 rounded-sm bg-muted"></div>
                </div>
                <div className="flex-1 -mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-between items-start mb-1.5">
                    <p className="text-sm font-bold text-heading">
                      Audit: Settings Changed
                    </p>
                    <span className="text-[10px] font-mono font-bold text-muted">
                      Yesterday
                    </span>
                  </div>
                  <p className="text-xs text-body font-medium leading-relaxed">
                    Alert thresholds modified for 'Internal Services' dashboard.
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-10 py-3 text-xs font-bold text-muted border border-border-soft rounded-md hover:bg-surface-2 hover:text-heading transition-colors">
              Load Older Activity
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

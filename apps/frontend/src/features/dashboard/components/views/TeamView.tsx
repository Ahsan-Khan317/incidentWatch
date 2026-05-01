"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  Briefcase,
  Mail,
  Plus,
  Shield,
  ExternalLink,
  Search,
  Grid,
  List,
} from "lucide-react";
import { TeamMember } from "../../types";

interface TeamViewProps {
  team: TeamMember[];
  removeMember: (id: string) => void;
  toggleStatus: (id: string) => void;
  setShowAddModal: (show: boolean) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  team,
  removeMember,
  toggleStatus,
  setShowAddModal,
}) => {
  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-8"
    >
      {/* Dashboard Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
            On-Call Primary
          </span>
          <span className="text-2xl font-bold text-primary">Marcus Thorne</span>
          <span className="text-xs text-muted">Shift ends in 4h 22m</span>
        </div>
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
            Secondary
          </span>
          <span className="text-2xl font-bold text-heading">
            Elena Rodriguez
          </span>
          <span className="text-xs text-muted">Response time: 4.2m</span>
        </div>
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
            Avg Availability
          </span>
          <span className="text-2xl font-bold text-heading">99.98%</span>
          <span className="text-xs font-bold text-primary">
            ↑ 0.02% vs last week
          </span>
        </div>
        <div className="bg-surface-1 border border-border-soft p-6 rounded-md flex flex-col gap-1 shadow-sm">
          <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
            Current Incident
          </span>
          <span className="text-2xl font-bold text-success">None</span>
          <span className="text-xs text-muted">Stable operations</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-surface-2 p-3 border border-border-soft rounded-md shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={14}
            />
            <input
              className="bg-surface-1 border border-border-soft text-xs text-heading pl-9 pr-4 py-2 w-64 rounded-md focus:outline-none focus:border-primary transition-all shadow-sm"
              placeholder="Search engineers..."
              type="text"
            />
          </div>
          <div className="flex gap-2">
            <span className="text-xs bg-primary-soft border border-primary text-primary px-3 py-1 rounded-md cursor-pointer font-bold">
              All Teams
            </span>
            <span className="text-xs bg-surface-3 border border-border-soft text-muted px-3 py-1 rounded-md cursor-pointer hover:border-border transition-colors font-bold">
              SRE
            </span>
            <span className="text-xs bg-surface-3 border border-border-soft text-muted px-3 py-1 rounded-md cursor-pointer hover:border-border transition-colors font-bold">
              Platform
            </span>
            <span className="text-xs bg-surface-3 border border-border-soft text-muted px-3 py-1 rounded-md cursor-pointer hover:border-border transition-colors font-bold">
              Security
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-muted hover:text-heading transition-colors bg-surface-3 rounded-md shadow-sm border border-border-soft">
            <Grid size={16} />
          </button>
          <button className="p-1.5 text-muted hover:text-heading transition-colors bg-surface-1 rounded-md border border-transparent">
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Engineering Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {team.map((member) => (
          <motion.div
            layout
            key={member.id}
            className="group bg-surface-1 border border-border-soft rounded-md overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm relative flex flex-col"
          >
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="relative">
                  <div
                    className={`w-14 h-14 rounded-md flex items-center justify-center text-xl font-bold ${member.avatarColor} border border-border-soft shadow-sm opacity-80 group-hover:opacity-100 transition-all`}
                  >
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-surface-1 rounded-sm shadow-sm ${member.status === "on-duty" ? "bg-success" : "bg-surface-3"}`}
                    title={member.status.toUpperCase()}
                  />
                </div>
                {member.status === "on-duty" ? (
                  <span className="text-[9px] font-mono font-bold text-success border border-success/30 bg-success-soft px-2 py-0.5 rounded-sm tracking-tighter uppercase shadow-sm">
                    ON-CALL
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-bold text-muted border border-border-soft bg-surface-3 px-2 py-0.5 rounded-sm tracking-tighter uppercase shadow-sm">
                    AVAILABLE
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-heading flex items-center justify-between">
                  {member.name}
                  <button
                    onClick={() => removeMember(member.id)}
                    className="p-1 rounded-md text-muted hover:text-danger hover:bg-danger-soft transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </h3>
                <p className="text-xs text-muted font-medium mt-0.5">
                  {member.role}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted font-mono">
                  <Mail size={10} />
                  {member.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {member.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="text-[10px] font-mono font-bold bg-surface-3 text-muted px-2 py-0.5 rounded-sm border border-border-soft shadow-sm"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-5 py-3 bg-surface-2 border-t border-border-soft flex justify-between items-center mt-auto">
              <span className="text-[10px] font-mono font-bold text-muted uppercase tracking-widest">
                Tier {Math.floor(Math.random() * 3) + 1}
              </span>
              <button
                onClick={() => toggleStatus(member.id)}
                className={`text-[9px] font-bold uppercase tracking-widest hover:text-heading transition-colors ${member.status === "on-duty" ? "text-success" : "text-muted"}`}
              >
                {member.status === "on-duty" ? "End Shift" : "Start Shift"}
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add Card Placeholder */}
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-surface-0 border-2 border-dashed border-border-soft rounded-md flex flex-col items-center justify-center p-8 group cursor-pointer hover:border-primary/50 transition-all shadow-sm min-h-[260px]"
        >
          <div className="w-12 h-12 rounded-md border border-border-soft flex items-center justify-center text-muted group-hover:text-primary group-hover:border-primary bg-surface-1 transition-all shadow-sm">
            <Plus size={24} />
          </div>
          <p className="mt-4 text-xs font-mono font-bold text-muted uppercase tracking-widest group-hover:text-primary transition-colors">
            New Engineer
          </p>
        </button>
      </div>

      {/* Roster History Table */}
      <div className="mt-12 bg-surface-1 border border-border-soft rounded-md overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-border-soft flex justify-between items-center">
          <h3 className="font-bold text-base text-heading">
            Recent On-Call Activity
          </h3>
          <span className="text-[10px] font-mono font-bold text-primary cursor-pointer hover:underline uppercase tracking-wider">
            Export Logs
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-2 text-muted uppercase text-[10px] font-mono font-bold tracking-widest border-b border-border-soft">
              <tr>
                <th className="px-6 py-3">Engineer</th>
                <th className="px-6 py-3">Duty Cycle</th>
                <th className="px-6 py-3">Resolved</th>
                <th className="px-6 py-3">Escalated</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="px-6 py-3 text-heading font-bold">
                  Marcus Thorne
                </td>
                <td className="px-6 py-3 text-muted">Oct 12 - Oct 19</td>
                <td className="px-6 py-3 text-success font-bold">14</td>
                <td className="px-6 py-3 text-muted">1</td>
                <td className="px-6 py-3 text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-success-soft border border-success-border text-success font-bold uppercase shadow-sm">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-surface-2 transition-colors">
                <td className="px-6 py-3 text-heading font-bold">
                  Elena Rodriguez
                </td>
                <td className="px-6 py-3 text-muted">Oct 05 - Oct 12</td>
                <td className="px-6 py-3 text-success font-bold">22</td>
                <td className="px-6 py-3 text-muted">0</td>
                <td className="px-6 py-3 text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface-3 border border-border-soft text-muted font-bold uppercase shadow-sm">
                    Closed
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-primary/5 transition-colors">
                <td className="px-6 py-3 text-heading font-bold">
                  Julian Vance
                </td>
                <td className="px-6 py-3 text-muted">Sep 28 - Oct 05</td>
                <td className="px-6 py-3 text-success font-bold">9</td>
                <td className="px-6 py-3 text-danger font-bold">4</td>
                <td className="px-6 py-3 text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-surface-3 border border-border-soft text-muted font-bold uppercase shadow-sm">
                    Closed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

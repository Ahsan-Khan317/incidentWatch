import React from "react";
import { motion } from "framer-motion";
import { Mail, Trash2 } from "lucide-react";
import { TeamMember } from "../../dashboard/types";

interface TeamMemberCardProps {
  member: TeamMember;
  removeMember: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  removeMember,
  toggleStatus,
}) => {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      layout
      className="group relative flex flex-col rounded border border-border bg-surface-1 transition-all hover:border-primary/50 shadow-sm"
    >
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between">
          <div className="relative">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded border border-border bg-surface-2 text-xl font-bold shadow-sm transition-all group-hover:scale-105 ${member.avatarColor}`}
            >
              {initials}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-sm border-2 border-surface-1 shadow-sm ${
                member.status === "on-duty" ? "bg-emerald-500" : "bg-surface-3"
              }`}
            />
          </div>
          <span
            className={`rounded border px-2 py-0.5 font-mono text-[0.5625rem] font-bold uppercase tracking-tight shadow-sm ${
              member.status === "on-duty"
                ? "border-success-border bg-success-soft text-success"
                : "border-border bg-surface-3 text-muted"
            }`}
          >
            {member.status === "on-duty" ? "ON-CALL" : "AVAILABLE"}
          </span>
        </div>

        <div>
          <h3 className="flex items-center justify-between text-base font-bold text-heading">
            {member.name}
            <button
              onClick={() => removeMember(member.id)}
              className="rounded p-1 text-muted transition-all opacity-0 hover:bg-danger-soft hover:text-danger group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </h3>
          <p className="text-[0.6875rem] font-medium text-muted">
            {member.role}
          </p>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[0.625rem] text-body">
            <Mail size={10} className="text-body/30" />
            {member.email}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {member.expertise.map((exp) => (
            <span
              key={exp}
              className="rounded border border-border bg-surface-3 px-1.5 py-0.5 font-mono text-[0.5625rem] font-bold text-muted uppercase shadow-sm"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-surface-2 px-5 py-3 mt-auto">
        <span className="font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted">
          Tier {Math.floor(Math.random() * 3) + 1}
        </span>
        <button
          onClick={() => toggleStatus(member.id)}
          className={`text-[0.5625rem] font-bold uppercase tracking-widest transition-colors hover:text-heading ${
            member.status === "on-duty" ? "text-primary" : "text-muted"
          }`}
        >
          {member.status === "on-duty" ? "End Shift" : "Start Shift"}
        </button>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;

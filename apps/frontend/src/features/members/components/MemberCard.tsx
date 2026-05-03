import React from "react";
import { motion } from "framer-motion";
import { Edit2, Mail, Trash2, User, ShieldAlert } from "lucide-react";
import { TeamMember } from "../../dashboard/types";

interface MemberCardProps {
  member: TeamMember;
  removeMember: (id: string) => void;
  toggleStatus: (id: string) => void;
  onEdit: (member: TeamMember) => void;
  onClick: (member: TeamMember) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  removeMember,
  toggleStatus,
  onEdit,
  onClick,
}) => {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={() => onClick(member)}
      className="group relative bg-surface-1 border border-border p-5 transition-all hover:border-primary/30 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center border border-border text-sm font-bold tracking-tighter ${member.avatarColor}`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="flex items-center justify-between text-sm font-bold text-heading uppercase tracking-tight min-w-0">
              <span className="truncate">{member.name}</span>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(member);
                  }}
                  className="rounded-none p-1 text-muted hover:bg-surface-3 hover:text-primary transition-all"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeMember(member.id);
                  }}
                  className="rounded-none p-1 text-muted hover:bg-danger-soft hover:text-danger transition-all"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </h3>
            <p className="text-[0.625rem] font-bold uppercase tracking-widest text-muted/60 mt-0.5">
              {member.role}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {member.expertise.map((tag) => (
          <span
            key={tag}
            className="border border-border bg-surface-2/50 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-widest text-muted/50"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              member.status === "on-duty"
                ? "bg-primary animate-pulse"
                : "bg-muted/20"
            }`}
          />
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted/50">
            {member.status === "on-duty" ? "Active Ops" : "Off-Duty"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStatus(member.id);
          }}
          className={`text-[0.625rem] font-bold uppercase tracking-[0.2em] transition-all hover:underline ${
            member.status === "on-duty"
              ? "text-primary"
              : "text-muted/40 hover:text-muted"
          }`}
        >
          {member.status === "on-duty" ? "Relieve Duty" : "Assign Ops"}
        </button>
      </div>
    </motion.div>
  );
};

export default MemberCard;

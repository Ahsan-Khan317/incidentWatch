import React from "react";
import {
  Search,
  Filter,
  Shield,
  Edit2,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { TeamMember } from "../../dashboard/types";

interface MemberDirectoryProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}

const MemberDirectory: React.FC<MemberDirectoryProps> = ({
  members,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = React.useState("");

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mt-8 border border-border bg-surface-1 overflow-hidden shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-border gap-4 bg-surface-2/30">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50"
            size={16}
          />
          <input
            type="text"
            placeholder="Search member by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-1 border border-border rounded-none py-2.5 pl-12 pr-4 text-xs text-heading focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30 uppercase tracking-widest font-bold"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-border bg-surface-1 text-[10px] font-bold uppercase tracking-widest text-muted/60">
            <Filter size={14} />
            Filter
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted/40 px-2">
            {filteredMembers.length} members Synchronized
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-2/50 border-b border-border">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60">
                member Profile
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 hidden md:table-cell">
                Access Permissions
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 hidden lg:table-cell">
                Specialization
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 hidden sm:table-cell">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/60 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {filteredMembers.map((member) => (
              <tr
                key={member.id}
                className="group hover:bg-surface-2/30 transition-colors"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 border border-border flex items-center justify-center text-xs font-bold ${member.avatarColor}`}
                    >
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-heading uppercase tracking-tight">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-muted font-mono mt-0.5">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 flex items-center gap-1.5">
                      <Shield size={10} /> {member.role}
                    </span>
                    <span className="text-[9px] font-bold text-muted/50 uppercase tracking-wider">
                      Tier {member.tier || 1} • Level 4 Access
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                    {member.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 border border-border bg-surface-2/50 text-[9px] font-bold text-muted/60 uppercase tracking-wider"
                      >
                        {exp}
                      </span>
                    ))}
                    {member.expertise.length === 0 && (
                      <span className="text-[9px] italic text-muted/30 uppercase tracking-widest">
                        Unassigned
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 hidden sm:table-cell">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${member.status === "on-duty" ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted/30"}`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${member.status === "on-duty" ? "text-emerald-500/80" : "text-muted/50"}`}
                    >
                      {member.status === "on-duty"
                        ? "Tactical Duty"
                        : "Offline"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all lg:translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 border border-border bg-surface-1 text-muted hover:text-primary hover:border-primary/30 transition-all"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="p-2 border border-border bg-surface-1 text-muted hover:text-danger hover:border-danger/30 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="p-2 border border-border bg-surface-1 text-muted">
                      <ChevronRight size={12} />
                    </div>
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

export default MemberDirectory;

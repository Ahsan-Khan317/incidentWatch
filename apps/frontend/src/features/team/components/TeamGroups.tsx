import React from "react";
import { Users, Trash2, Edit2, ShieldAlert } from "lucide-react";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import DashboardButton from "@/src/components/ui/DashboardButton";

interface TeamGroup {
  _id: string;
  name: string;
  description?: string;
  color: string;
  members: any[];
}

interface TeamGroupsProps {
  teams: TeamGroup[];
  onCreateClick: () => void;
  onDelete: (id: string) => void;
  onEdit: (team: TeamGroup) => void;
}

const TeamGroups: React.FC<TeamGroupsProps> = ({
  teams,
  onCreateClick,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="mt-12">
      <SectionHeading
        title="Operation Teams"
        description="Organize engineers into specialized tactical units for focused incident response."
      >
        <DashboardButton
          variant="secondary"
          onClick={onCreateClick}
          className="h-9 px-4 text-[10px]"
        >
          <Users size={14} />
          Create Team
        </DashboardButton>
      </SectionHeading>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team._id}
            className="group relative flex flex-col rounded-none border border-border bg-surface-1 transition-all hover:border-primary/30"
          >
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-heading uppercase tracking-tight">
                    {team.name}
                  </h3>
                  <p className="mt-1 text-[10px] text-muted line-clamp-2">
                    {team.description ||
                      "No tactical briefing provided for this unit."}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(team._id)}
                  className="rounded-none p-1 text-muted/30 transition-all hover:bg-danger/10 hover:text-danger opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted/50">
                  <span>Team Composition</span>
                  <span>{team.members?.length || 0} members</span>
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {team.members?.slice(0, 5).map((member, i) => (
                    <div
                      key={member._id || i}
                      title={member.name}
                      className="inline-block h-7 w-7 rounded-none border border-surface-1 bg-surface-3 text-[10px] font-bold flex items-center justify-center uppercase ring-1 ring-border"
                      style={{
                        backgroundColor: `${team.color}10`,
                        color: team.color,
                      }}
                    >
                      {member.name?.[0] || "U"}
                    </div>
                  ))}
                  {(team.members?.length || 0) > 5 && (
                    <div className="inline-block h-7 w-7 rounded-none border border-surface-1 bg-surface-2 text-[8px] font-bold flex items-center justify-center uppercase ring-1 ring-border text-muted">
                      +{(team.members?.length || 0) - 5}
                    </div>
                  )}
                  {(team.members?.length || 0) === 0 && (
                    <div className="flex items-center gap-2 text-[9px] text-danger/50 italic font-medium">
                      <ShieldAlert size={12} /> Unmanned Unit
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border bg-surface-2/50 px-6 py-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted/40">
                Unit ID: {team._id.slice(-6).toUpperCase()}
              </span>
              <button
                onClick={() => onEdit(team)}
                className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary/60 hover:text-primary transition-colors"
              >
                Configure
              </button>
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <button
            onClick={onCreateClick}
            className="flex min-h-[180px] flex-col items-center justify-center rounded-none border border-dashed border-border bg-surface-1/30 p-8 transition-all hover:border-primary/50 hover:bg-surface-2 group"
          >
            <Users className="h-8 w-8 text-muted/20 group-hover:text-primary/40 transition-colors mb-3" />
            <p className="text-[10px] font-bold text-muted/40 uppercase tracking-[0.2em] group-hover:text-primary/60">
              Initialize First Team
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamGroups;

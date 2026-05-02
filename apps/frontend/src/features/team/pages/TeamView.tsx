"use client";

import React from "react";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import { UserPlus } from "lucide-react";
import { TeamMember } from "../../dashboard/types";
import TeamStats from "../components/TeamStats";
import TeamMemberCard from "../components/TeamMemberCard";
import TeamRosterHistory from "../components/TeamRosterHistory";

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
    <Container>
      <SectionHeading
        title="Engineering Team"
        description="Manage your on-call roster, engineer availability, and expertise mapping."
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-black flex items-center gap-2 px-4 py-2 rounded shadow-primary hover:scale-105 transition-all font-bold text-xs uppercase"
        >
          <UserPlus size={16} />
          <span>Add Engineer</span>
        </button>
      </SectionHeading>

      <TeamStats />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {team.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            removeMember={removeMember}
            toggleStatus={toggleStatus}
          />
        ))}

        {/* Add Card Placeholder */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex min-h-[260px] flex-col items-center justify-center rounded border-2 border-dashed border-border bg-surface-1/50 p-8 transition-all hover:border-primary/50 hover:bg-surface-2 group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded border border-border bg-surface-2 text-muted transition-all group-hover:border-primary group-hover:text-primary">
            <UserPlus size={24} />
          </div>
          <p className="mt-4 text-[0.625rem] font-bold uppercase tracking-widest text-muted group-hover:text-primary">
            New Engineer
          </p>
        </button>
      </div>

      <TeamRosterHistory />
    </Container>
  );
};

"use client";

import { ConfirmationModal } from "@/src/components/common/ConfirmationModal";
import Container from "@/src/components/dashboard/common/Container";
import SectionHeading from "@/src/components/dashboard/common/SectionHeading";
import DashboardButton from "@/src/components/ui/DashboardButton";
import { Activity, ShieldCheck, UserPlus, Users, Clock } from "lucide-react";
import React from "react";
import PendingInvites from "../../invite/components/PendingInvites";
import { useInvite } from "../../invite/hooks/useInvite";
import { useMembers } from "../../members/hooks/useMembers";
import OverviewMetricCard from "../../overview/components/OverviewMetricCard";
import { CreateTeamModal } from "../components/CreateTeamModal";
import { EditMemberModal } from "../../members/components/EditMemberModal";
import TeamGroups from "../components/TeamGroups";
import MemberCard from "../../members/components/MemberCard";
import MemberSkeleton from "../../members/components/MemberSkeleton";
import TeamRosterHistory from "../components/TeamRosterHistory";
import { useTeam } from "../hooks/useTeam";
import { InviteModal } from "../../invite/components/InviteModal";
import MemberDirectory from "../../members/components/MemberDirectory";

type TeamViewTab = "roster" | "directory";

export const TeamView: React.FC = () => {
  const {
    teams,
    isLoading: isTeamLoading,
    createTeam,
    updateTeam,
    deleteTeam,
  } = useTeam();
  const {
    members,
    stats,
    isLoading: isMembersLoading,
    toggleStatus,
    updateMember,
    deleteMember,
  } = useMembers();
  const {
    invites,
    sendInvite,
    revokeInvite,
    isLoading: isInviteLoading,
  } = useInvite();

  const [activeTab, setActiveTab] = React.useState<TeamViewTab>("roster");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = React.useState(false);
  const [editingTeam, setEditingTeam] = React.useState<any>(null);
  const [editingMember, setEditingMember] = React.useState<any>(null);
  const [confirmation, setConfirmation] = React.useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleAddMember = async (data: any) => {
    const success = await sendInvite(data);
    if (success) {
      setShowAddModal(false);
    }
    return success;
  };

  const handleTeamSubmit = async (data: any) => {
    let success;
    if (editingTeam) {
      success = await updateTeam(editingTeam._id, data);
    } else {
      success = await createTeam(data);
    }

    if (success) {
      setShowCreateTeamModal(false);
      setEditingTeam(null);
    }
  };

  const handleEditTeam = (team: any) => {
    setEditingTeam(team);
    setShowCreateTeamModal(true);
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
  };

  const handleUpdateMember = async (data: any) => {
    if (editingMember) {
      await updateMember(editingMember.id, data);
      setEditingMember(null);
    }
  };

  const handleRevokeInvite = (id: string) => {
    setConfirmation({
      isOpen: true,
      title: "Revoke Invitation",
      description:
        "Are you sure you want to cancel this pending invitation? The member will no longer be able to use the link to join your organization.",
      onConfirm: () => {
        revokeInvite(id);
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const confirmDeleteTeam = (id: string) => {
    setConfirmation({
      isOpen: true,
      title: "Decommission Team",
      description:
        "Are you sure you want to disband this tactical unit? This action will remove the team structure but keep the individual engineers in the roster.",
      onConfirm: () => {
        deleteTeam(id);
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const isLoading = isTeamLoading || isMembersLoading || isInviteLoading;

  const confirmRemoveMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    setConfirmation({
      isOpen: true,
      title: "Relieve from Duty",
      description: `Are you sure you want to remove ${member?.name || "this engineer"} from the organization? This will revoke all access and on-call responsibilities.`,
      onConfirm: () => {
        deleteMember(id);
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isLoading && members.length === 0) {
    return (
      <Container>
        <SectionHeading
          title="Engineering Command"
          description="Manage your on-call roster, engineer availability, and tactical Team formation."
        >
          <div className="h-9 w-32 bg-surface-2 animate-pulse" />
        </SectionHeading>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-surface-1 border border-border p-5 relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="h-3 w-24 bg-surface-2 animate-pulse" />
                <div className="h-6 w-6 bg-surface-2 animate-pulse" />
              </div>
              <div className="h-8 w-16 bg-surface-2 mb-2 animate-pulse" />
              <div className="h-3 w-32 bg-surface-2 opacity-50 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <MemberSkeleton key={i} />
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <SectionHeading
        title="Engineering Command"
        description="Manage your on-call roster, engineer availability, and tactical Team formation."
      >
        <DashboardButton
          variant="primary"
          icon={UserPlus}
          onClick={() => setShowAddModal(true)}
        >
          Invite member
        </DashboardButton>
      </SectionHeading>

      {/* Strategic Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewMetricCard
          title="Active members"
          value={stats?.totalMembers || stats?.totalEngineers || 0}
          icon={Users}
          meta="Total synchronized personnel"
        />
        <OverviewMetricCard
          title="On-Call Response"
          value={stats?.onCallCount || stats?.onCallNow || 0}
          icon={Activity}
          tone="success"
          meta="Tactical units active"
        />
        <OverviewMetricCard
          title="Active Incidents"
          value={stats?.activeIncidents || 0}
          icon={ShieldCheck}
          tone={stats?.activeIncidents > 0 ? "warning" : "success"}
          meta="Operations in progress"
        />
        <OverviewMetricCard
          title="Pending Syncs"
          value={stats?.pendingInvites || 0}
          icon={Clock}
          meta="Awaiting deployment"
        />
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center gap-1 border-b border-border mb-8">
        <button
          onClick={() => setActiveTab("roster")}
          className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
            activeTab === "roster"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted/50 hover:text-muted hover:bg-surface-2"
          }`}
        >
          Tactical Roster
        </button>
        <button
          onClick={() => setActiveTab("directory")}
          className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all border-b-2 ${
            activeTab === "directory"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted/50 hover:text-muted hover:bg-surface-2"
          }`}
        >
          member Directory
        </button>
      </div>

      {activeTab === "roster" ? (
        <>
          {/* Teams Management */}
          <TeamGroups
            teams={teams}
            onCreateClick={() => {
              setEditingTeam(null);
              setShowCreateTeamModal(true);
            }}
            onDelete={confirmDeleteTeam}
            onEdit={handleEditTeam}
          />

          {/* Pending Invites */}
          <PendingInvites invites={invites} onRevoke={handleRevokeInvite} />

          <div className="mt-12">
            <SectionHeading
              title="Engineer Roster"
              description="Individual member status and specialized expertise mapping."
            />
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  removeMember={confirmRemoveMember}
                  toggleStatus={toggleStatus}
                  onEdit={handleEditMember}
                />
              ))}

              <DashboardButton
                variant="ghost"
                icon={UserPlus}
                className="h-full min-h-[160px] border-dashed border-2 hover:border-primary/50 hover:bg-primary/5"
                onClick={() => setShowAddModal(true)}
              >
                Deploy New member
              </DashboardButton>
            </div>
          </div>
        </>
      ) : (
        <MemberDirectory
          members={members}
          onEdit={handleEditMember}
          onDelete={confirmRemoveMember}
        />
      )}

      <TeamRosterHistory activity={stats?.recentActivity} />

      {/* Modals */}
      <InviteModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onInvite={handleAddMember}
        isLoading={isInviteLoading}
      />

      <CreateTeamModal
        show={showCreateTeamModal}
        onClose={() => {
          setShowCreateTeamModal(false);
          setEditingTeam(null);
        }}
        onAdd={handleTeamSubmit}
        availableMembers={members}
        initialData={editingTeam}
      />

      <EditMemberModal
        show={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleUpdateMember}
        member={editingMember}
      />

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        onClose={() => setConfirmation((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        description={confirmation.description}
      />
    </Container>
  );
};

import { useState, useEffect, useCallback } from "react";
import { memberApi } from "../api/member.api";
import { inviteApi } from "../api/invite.api";
import { TeamMember } from "../types";

export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await memberApi.getMembers();
      if (response.success) {
        // Map backend users to TeamMember type
        const mappedMembers: TeamMember[] = response.data.map((m: any) => ({
          id: m._id,
          name: m.name || "Pending User",
          role: m.role,
          email: m.email,
          expertise: ["SRE", "Infrastructure"], // Mocking expertise for now
          status: m.oncall ? "on-duty" : "off-duty",
          avatarColor: `bg-blue-500/10 text-blue-500`,
        }));
        setTeam(mappedMembers);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch team roster");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const sendInvite = async (email: string, role: string) => {
    try {
      const response = await inviteApi.sendInvite(email, role);
      if (response.success) {
        // Refresh the team list to show the new invitation if backend creates a user record
        // or just notify success.
        await fetchTeam();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || "Failed to send invitation");
      return false;
    }
  };

  const removeMember = async (id: string) => {
    try {
      const response = await memberApi.deleteMember(id);
      if (response.success) {
        setTeam((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      setError(err.message || "Failed to remove member");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const member = team.find((m) => m.id === id);
      if (!member) return;

      const newStatus = member.status === "on-duty" ? "off-duty" : "on-duty";
      // Update local state optimisticially
      setTeam((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      );

      // Call backend
      await memberApi.toggleOnCall(id, newStatus === "on-duty").catch(() => {
        // Revert on failure
        setTeam((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: member.status } : m)),
        );
      });
    } catch (err: any) {
      setError(err.message || "Failed to toggle status");
    }
  };

  return {
    team,
    isLoading,
    error,
    sendInvite,
    removeMember,
    toggleStatus,
    refresh: fetchTeam,
  };
};

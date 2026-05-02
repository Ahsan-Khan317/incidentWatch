import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "../api/members.api";
import { TeamMember } from "../../dashboard/types";

export const useMembers = () => {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await membersApi.getMembers();
      if (!response.success) throw new Error(response.message);

      return response.data.map((m: any) => ({
        id: m._id,
        userId: m.userId,
        name: m.name || "Pending User",
        role: m.role,
        email: m.email,
        expertise: m.expertise || [],
        tier: m.tier || 1,
        status: m.oncall ? "on-duty" : "off-duty",
        avatarColor: m.avatarColor,
      })) as TeamMember[];
    },
  });

  const statsQuery = useQuery({
    queryKey: ["member-stats"],
    queryFn: async () => {
      const response = await membersApi.getStats();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      membersApi.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member-stats"] });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => membersApi.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member-stats"] });
    },
  });

  const toggleOnCallMutation = useMutation({
    mutationFn: ({ id, oncall }: { id: string; oncall: boolean }) =>
      membersApi.toggleOnCall(id, oncall),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member-stats"] });
    },
  });

  return {
    members: membersQuery.data || [],
    stats: statsQuery.data,
    isLoading: membersQuery.isLoading || statsQuery.isLoading,
    updateMember: async (id: string, data: any) => {
      const result = await updateMemberMutation.mutateAsync({ id, data });
      return result.success;
    },
    deleteMember: (id: string) => deleteMemberMutation.mutate(id),
    toggleStatus: (id: string) => {
      const member = membersQuery.data?.find((m) => m.id === id);
      if (member) {
        toggleOnCallMutation.mutate({
          id,
          oncall: member.status !== "on-duty",
        });
      }
    },
    refresh: () => {
      membersQuery.refetch();
      statsQuery.refetch();
    },
  };
};

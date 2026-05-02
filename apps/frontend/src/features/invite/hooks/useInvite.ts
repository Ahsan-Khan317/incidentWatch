import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inviteApi } from "../api/invite.api";

export const useInvite = () => {
  const queryClient = useQueryClient();

  const invitesQuery = useQuery({
    queryKey: ["invites"],
    queryFn: async () => {
      const response = await inviteApi.getInvites();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const sendInviteMutation = useMutation({
    mutationFn: (data: any) => inviteApi.sendInvite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["members", "stats"] });
    },
  });

  const revokeInviteMutation = useMutation({
    mutationFn: (id: string) => inviteApi.revokeInvite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["members", "stats"] });
    },
  });

  return {
    invites: invitesQuery.data || [],
    isLoading: invitesQuery.isLoading,
    sendInvite: async (data: any) => {
      const result = await sendInviteMutation.mutateAsync(data);
      return result.success;
    },
    revokeInvite: (id: string) => revokeInviteMutation.mutate(id),
    refresh: () => invitesQuery.refetch(),
  };
};

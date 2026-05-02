import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamApi } from "../api/team.api";

export const useTeam = () => {
  const queryClient = useQueryClient();

  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await teamApi.getTeams();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: (data: any) => teamApi.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => teamApi.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      teamApi.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });

  return {
    teams: teamsQuery.data || [],
    isLoading: teamsQuery.isLoading,
    isError: teamsQuery.isError,
    error: teamsQuery.error,
    createTeam: async (data: any) => {
      const result = await createTeamMutation.mutateAsync(data);
      return result.success;
    },
    deleteTeam: (id: string) => deleteTeamMutation.mutate(id),
    updateTeam: async (id: string, data: any) => {
      const result = await updateTeamMutation.mutateAsync({ id, data });
      return result.success;
    },
    refresh: () => {
      teamsQuery.refetch();
    },
  };
};

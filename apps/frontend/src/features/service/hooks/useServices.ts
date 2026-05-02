import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/serviceApi";
import { CreateServiceInput, UpdateServiceInput } from "../types";
import { useServiceStore } from "../../dashboard/store/service-store";
import { useEffect } from "react";

export const useServices = () => {
  const { setServices, setServicesLoading, setServicesError } =
    useServiceStore();

  const query = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const data = await serviceApi.getServices();
      // Handle different response structures
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object") {
        const nested =
          (data as any).service?.services || (data as any).services;
        if (Array.isArray(nested)) return nested;
      }
      return [];
    },
    staleTime: 30000, // Keep data fresh for 30 seconds
    refetchOnMount: true,
  });

  useEffect(() => {
    if (query.data) {
      setServices(query.data);
    }
    setServicesLoading(query.isLoading);
    if (query.error) {
      setServicesError(query.error);
    }
  }, [
    query.data,
    query.isLoading,
    query.error,
    setServices,
    setServicesLoading,
    setServicesError,
  ]);

  return query;
};

export const useService = (name: string) => {
  return useQuery({
    queryKey: ["service", name],
    queryFn: () => serviceApi.getServiceDetails(name),
    enabled: !!name,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateServiceInput) => serviceApi.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceInput }) =>
      serviceApi.updateService(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", data.name] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: serviceApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

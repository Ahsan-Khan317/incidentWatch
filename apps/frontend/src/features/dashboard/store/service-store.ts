import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ServiceState {
  selectedServiceId: string;
  selectedService: any;
  services: any[];
  servicesLoading: boolean;
  servicesError: any;
}

interface ServiceActions {
  setSelectedServiceId: (id: string) => void;
  setSelectedService: (service: any) => void;
  setServices: (services: any[]) => void;
  setServicesLoading: (loading: boolean) => void;
  setServicesError: (error: any) => void;
}

export const useServiceStore = create<ServiceState & ServiceActions>()(
  persist(
    (set) => ({
      selectedServiceId: "all",
      selectedService: null,
      services: [],
      servicesLoading: false,
      servicesError: null,

      setSelectedServiceId: (id) => set({ selectedServiceId: id }),
      setSelectedService: (service) => set({ selectedService: service }),
      setServices: (services) => set({ services }),
      setServicesLoading: (loading) => set({ servicesLoading: loading }),
      setServicesError: (error) => set({ servicesError: error }),
    }),
    {
      name: "dashboard-service-storage",
      partialize: (state) => ({
        selectedServiceId: state.selectedServiceId,
        selectedService: state.selectedService,
      }),
    },
  ),
);

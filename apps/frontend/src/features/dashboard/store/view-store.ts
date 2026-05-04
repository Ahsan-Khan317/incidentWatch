import { create } from "zustand";
import { persist } from "zustand/middleware";

type View =
  | "dashboard"
  | "apis"
  | "incidents"
  | "logs"
  | "alerts"
  | "analytics"
  | "status-page"
  | "team"
  | "services"
  | "service-context"
  | "service-details"
  | "billing"
  | "settings";

interface ViewState {
  activeView: View;
  selectedId: string | null;
}

interface ViewActions {
  setActiveView: (view: View, id?: string | null) => void;
  clearSelectedId: () => void;
}

export const useViewStore = create<ViewState & ViewActions>()(
  persist(
    (set) => ({
      activeView: "dashboard",
      selectedId: null,

      setActiveView: (view, id = null) =>
        set({ activeView: view, selectedId: id }),
      clearSelectedId: () => set({ selectedId: null }),
    }),
    {
      name: "dashboard-view-storage",
    },
  ),
);

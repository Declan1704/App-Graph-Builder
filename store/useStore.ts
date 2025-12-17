import { create } from "zustand";
import { InspectorTab } from "../types";

interface AppState {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;

  setSelectedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  toggleMobilePanel: (isOpen?: boolean) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
}

export const useStore = create<AppState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: InspectorTab.Config,

  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) =>
    set({ selectedNodeId: id, isMobilePanelOpen: !!id }),
  toggleMobilePanel: (isOpen) =>
    set((state) => ({
      isMobilePanelOpen: isOpen ?? !state.isMobilePanelOpen,
    })),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}));

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

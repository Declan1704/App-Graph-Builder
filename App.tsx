import React from "react";
import { useStore } from "./store/useStore";
import { useReactFlow } from "reactflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNodeInDb } from "./services/api";
import { ServiceNode } from "./types";
import {
  Box,
  Settings,
  Github,
  Menu,
  Layers,
  Search,
  Plus,
  Maximize,
} from "lucide-react";
import { Button } from "./components/ui";
import GraphCanvas from "./components/GraphCanvas";
import NodeInspector from "./components/NodeInspector";
import AppSelector from "./components/AppSelector";
import { cn } from "./components/ui";

function App() {
  const {
    isMobilePanelOpen,
    toggleMobilePanel,
    selectedNodeId,
    selectedAppId,
  } = useStore();

  const { fitView, addNodes } = useReactFlow();
  const queryClient = useQueryClient();

  const addNodeMutation = useMutation({
    mutationFn: (newNode: ServiceNode) => {
      if (!selectedAppId) throw new Error("No app selected");
      return createNodeInDb(selectedAppId, newNode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graph", selectedAppId] });
    },
  });
  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      Hi
    </div>
  );
}

export default App;

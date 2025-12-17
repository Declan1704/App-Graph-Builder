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

  // We can use useReactFlow here because App is inside ReactFlowProvider in index.tsx
  const { fitView, addNodes } = useReactFlow();
  const queryClient = useQueryClient();

  const addNodeMutation = useMutation({
    mutationFn: (newNode: ServiceNode) => {
      if (!selectedAppId) throw new Error("No app selected");
      return createNodeInDb(selectedAppId, newNode);
    },
    onSuccess: () => {
      // Invalidate to ensure consistency, though we also add visually
      queryClient.invalidateQueries({ queryKey: ["graph", selectedAppId] });
    },
  });

  const handleAddNode = () => {
    if (!selectedAppId) return;

    const newNode: ServiceNode = {
      id: `node-${Date.now()}`,
      type: "service",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: "New Service",
        status: "Healthy",
        cpuLimit: 50,
        memory: "512MB",
        icon: "🆕",
      },
    };

    addNodes(newNode);
    addNodeMutation.mutate(newNode);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground p-1 rounded">
              <Layers className="h-5 w-5" />
            </div>
            <span>AppGraph</span>
          </div>

          {selectedAppId && (
            <div className="hidden md:flex items-center gap-2 ml-4 border-l border-border pl-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddNode}
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add Service
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => fitView({ padding: 0.2, duration: 400 })}
                title="Fit View"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex relative mr-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Github className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          {/* Mobile Menu Toggle */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden ml-2"
            onClick={() => toggleMobilePanel()}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Rail (Static) */}
        <aside className="hidden md:flex w-16 flex-col items-center border-r border-border bg-card py-4 gap-4 shrink-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl bg-accent/50 text-accent-foreground"
          >
            <Box className="h-6 w-6" />
          </Button>
          <div className="w-8 h-[1px] bg-border my-2" />
          <Button
            variant="ghost"
            size="icon"
            className="opacity-50 hover:opacity-100"
          >
            <div className="h-5 w-5 rounded-full border-2 border-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-50 hover:opacity-100"
          >
            <div className="h-5 w-5 rounded-full border-2 border-blue-500" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5 opacity-50" />
          </Button>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 relative bg-black/50">
          <GraphCanvas />

          {/* Mobile Floating Action Button for Adding Nodes */}
          {selectedAppId && (
            <button
              onClick={handleAddNode}
              className="md:hidden absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40"
            >
              <Plus className="h-6 w-6" />
            </button>
          )}
        </main>

        {/* Right Panel (Desktop: Sidebar, Mobile: Drawer) */}
        <div
          className={cn(
            "fixed inset-y-0 right-0 w-80 bg-card border-l border-border transform transition-transform duration-300 ease-in-out z-30 shadow-2xl",
            isMobilePanelOpen ? "translate-x-0" : "translate-x-full",
            "md:relative md:translate-x-0 md:shadow-none"
          )}
        >
          {/* If a node is selected, show inspector. Otherwise show App List */}
          {selectedNodeId ? (
            <NodeInspector />
          ) : (
            <div className="h-full flex flex-col">
              <AppSelector />
              {!selectedAppId && (
                <div className="mt-auto p-4 border-t border-border">
                  <Button className="w-full gap-2">
                    <Plus className="h-4 w-4" /> Create New App
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {isMobilePanelOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => toggleMobilePanel(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;

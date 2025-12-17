import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../store/useStore";
import { useReactFlow, Node } from "reactflow";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNodeInDb } from "../services/api";
import { InspectorTab, ServiceNodeData, NodeStatus } from "../types";
import {
  Badge,
  Button,
  Input,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui";
import {
  Settings,
  Activity,
  Cpu,
  HardDrive,
  Server,
  X,
  Save,
  Loader2,
} from "lucide-react";

const NodeInspector: React.FC = () => {
  const {
    selectedNodeId,
    selectedAppId,
    activeInspectorTab,
    setActiveInspectorTab,
    toggleMobilePanel,
  } = useStore();
  const { getNode, setNodes } = useReactFlow();
  const queryClient = useQueryClient();

  const [currentNode, setCurrentNode] = useState<
    Node<ServiceNodeData> | undefined
  >(undefined);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedNodeId) {
      const node = getNode(selectedNodeId);
      setCurrentNode(node);
    } else {
      setCurrentNode(undefined);
    }
  }, [selectedNodeId, getNode, activeInspectorTab]);

  const updateMutation = useMutation({
    mutationFn: (node: Node<ServiceNodeData>) => {
      if (!selectedAppId) throw new Error("No app selected");
      return updateNodeInDb(selectedAppId, node);
    },
    onSuccess: () => {},
  });

  const handleUpdate = (field: keyof ServiceNodeData, value: any) => {
    if (!selectedNodeId) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const updatedNode = {
            ...node,
            data: { ...node.data, [field]: value },
          };
          setCurrentNode(updatedNode);

          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          debounceTimer.current = setTimeout(() => {
            updateMutation.mutate(updatedNode);
          }, 500);

          return updatedNode;
        }
        return node;
      })
    );
  };

  if (!selectedNodeId || !currentNode) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <Server className="mb-4 h-12 w-12 opacity-20" />
        <p>Select a node to view its configuration.</p>
      </div>
    );
  }

  const { data } = currentNode;

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case "Healthy":
        return "success";
      case "Degraded":
        return "warning";
      case "Down":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-2xl">
            {data.icon || "📦"}
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-none mb-1">
              {data.label}
            </h2>
            <Badge variant={getStatusColor(data.status)}>{data.status}</Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleMobilePanel(false)}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs className="w-full">
          <TabsList>
            <TabsTrigger
              active={activeInspectorTab === InspectorTab.Config}
              onClick={() => setActiveInspectorTab(InspectorTab.Config)}
            >
              <Settings className="mr-2 h-4 w-4" />
              Config
            </TabsTrigger>
            <TabsTrigger
              active={activeInspectorTab === InspectorTab.Runtime}
              onClick={() => setActiveInspectorTab(InspectorTab.Runtime)}
            >
              <Activity className="mr-2 h-4 w-4" />
              Runtime
            </TabsTrigger>
          </TabsList>

          <TabsContent active={activeInspectorTab === InspectorTab.Config}>
            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Node Name
                </label>
                <Input
                  value={data.label}
                  onChange={(e) => handleUpdate("label", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="flex gap-2">
                  {(["Healthy", "Degraded", "Down"] as NodeStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdate("status", status)}
                        className={`px-3 py-1 rounded text-xs border ${
                          data.status === status
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Memory Allocation
                </label>
                <div className="flex items-center rounded-md border border-input bg-card px-3 py-2">
                  <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="border-0 p-0 h-auto focus-visible:ring-0"
                    value={data.memory}
                    onChange={(e) => handleUpdate("memory", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Add a description..."
                  value={data.description || ""}
                  onChange={(e) => handleUpdate("description", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent active={activeInspectorTab === InspectorTab.Runtime}>
            <div className="space-y-6 pt-4">
              <div className="space-y-4 rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm font-medium">
                    <Cpu className="mr-2 h-4 w-4 text-primary" />
                    CPU Limit
                  </label>
                  <span className="text-sm font-mono">{data.cpuLimit}%</span>
                </div>

                <div className="flex gap-4 items-center">
                  <Slider
                    value={data.cpuLimit}
                    onValueChange={(val) => handleUpdate("cpuLimit", val)}
                    max={100}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    className="w-20 font-mono"
                    min={0}
                    max={100}
                    value={data.cpuLimit}
                    onChange={(e) => {
                      const val = Math.min(
                        100,
                        Math.max(0, Number(e.target.value))
                      );
                      handleUpdate("cpuLimit", val);
                    }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 bg-muted/20">
                <h4 className="text-sm font-semibold mb-2">Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-2 bg-background rounded border border-border">
                    <div className="text-xs text-muted-foreground">Uptime</div>
                    <div className="font-mono text-sm">14d 2h</div>
                  </div>
                  <div className="p-2 bg-background rounded border border-border">
                    <div className="text-xs text-muted-foreground">
                      Requests
                    </div>
                    <div className="font-mono text-sm">2.4k/s</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="mt-4 text-xs text-muted-foreground flex items-center justify-center gap-1">
          {updateMutation.isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          {updateMutation.isPending ? "Saving..." : "Changes saved"}
        </div>
      </div>
    </div>
  );
};

export default NodeInspector;

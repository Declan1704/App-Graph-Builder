import React, { useCallback, useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  BackgroundVariant,
  ConnectionMode,
  NodeTypes,
} from "reactflow";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAppGraph, deleteNodeFromDb } from "../services/api";
import { useStore } from "../store/useStore";
import { ServiceNodeData } from "../types";
import { Loader2 } from "lucide-react";
import ServiceNode from "./ServiceNode";

const GraphCanvas: React.FC = () => {
  const { selectedAppId, setSelectedNodeId, selectedNodeId } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();
  const queryClient = useQueryClient();

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      service: ServiceNode,
    }),
    []
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["graph", selectedAppId],
    queryFn: () => (selectedAppId ? fetchAppGraph(selectedAppId) : null),
    enabled: !!selectedAppId,
    staleTime: 0,
  });

  const deleteMutation = useMutation({
    mutationFn: (nodeId: string) => {
      if (!selectedAppId) throw new Error("No app selected");
      return deleteNodeFromDb(selectedAppId, nodeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["graph", selectedAppId] });
    },
  });

  useEffect(() => {
    if (data) {
      setNodes(data.nodes);
      setEdges(data.edges);

      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 50);
    }
  }, [data, setNodes, setEdges, fitView]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      if (deleted.some((n) => n.id === selectedNodeId)) {
        setSelectedNodeId(null);
      }

      deleted.forEach((node) => {
        deleteMutation.mutate(node.id);
      });
    },
    [selectedNodeId, setSelectedNodeId, deleteMutation]
  );

  if (!selectedAppId) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background text-muted-foreground">
        <p>Select an app from the right panel to view its graph.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background text-red-500 gap-4">
        <p>Failed to load graph data.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black/95">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        className="bg-background"
        minZoom={0.2}
        maxZoom={4}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#333"
        />
        <Controls className="fill-foreground text-foreground border-border bg-card" />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;

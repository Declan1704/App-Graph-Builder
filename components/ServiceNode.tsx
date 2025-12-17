import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { ServiceNodeData, NodeStatus } from "../types";
import { cn } from "./ui";
import { Activity, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

const StatusIcon = ({ status }: { status: NodeStatus }) => {
  switch (status) {
    case "Healthy":
      return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    case "Degraded":
      return <AlertCircle className="h-3 w-3 text-yellow-500" />;
    case "Down":
      return <XCircle className="h-3 w-3 text-red-500" />;
    default:
      return <Activity className="h-3 w-3 text-muted-foreground" />;
  }
};

const ServiceNode = memo(({ data, selected }: NodeProps<ServiceNodeData>) => {
  const statusColors = {
    Healthy: "border-green-500/50 hover:border-green-500",
    Degraded: "border-yellow-500/50 hover:border-yellow-500",
    Down: "border-red-500/50 hover:border-red-500",
  };

  return (
    <div
      className={cn(
        "relative min-w-[180px] rounded-lg border-2 bg-card px-4 py-3 shadow-md transition-all",
        statusColors[data.status],
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
          : "border-border"
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-muted-foreground"
      />

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-xl">
          {data.icon || "📦"}
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="truncate text-sm font-bold leading-none mb-1">
            {data.label}
          </div>
          <div className="flex items-center gap-1.5">
            <StatusIcon status={data.status} />
            <span className="text-xs text-muted-foreground">{data.status}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            CPU
          </span>
          <span className="text-xs font-mono font-medium">
            {data.cpuLimit}%
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            MEM
          </span>
          <span className="text-xs font-mono font-medium">{data.memory}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-muted-foreground"
      />
    </div>
  );
});

ServiceNode.displayName = "ServiceNode";
export default ServiceNode;

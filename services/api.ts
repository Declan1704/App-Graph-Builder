import {
  AppEntity,
  GraphResponse,
  ServiceNodeData,
  ServiceNode,
} from "../types";
import { Node, Edge } from "reactflow";

const MOCK_APPS: AppEntity[] = [
  {
    id: "app-1",
    name: "Supertokens Golang",
    description: "Authentication service",
    icon: "GO",
  },
  {
    id: "app-2",
    name: "E-commerce Core",
    description: "Main shopping logic",
    icon: "TS",
  },
  {
    id: "app-3",
    name: "Analytics Pipeline",
    description: "Data processing",
    icon: "PY",
  },
];

const createInitialGraph = (appId: string): GraphResponse => {
  const nodes: ServiceNode[] = [
    {
      id: `node-${appId}-1`,
      type: "service",
      position: { x: 100, y: 100 },
      data: {
        label: "API Gateway",
        status: "Healthy",
        cpuLimit: 45,
        memory: "512MB",
        icon: "🌐",
      },
    },
    {
      id: `node-${appId}-2`,
      type: "service",
      position: { x: 400, y: 100 },
      data: {
        label: "Auth Service",
        status: "Degraded",
        cpuLimit: 80,
        memory: "1GB",
        icon: "🔒",
      },
    },
    {
      id: `node-${appId}-3`,
      type: "service",
      position: { x: 250, y: 300 },
      data: {
        label: "Postgres DB",
        status: "Healthy",
        cpuLimit: 20,
        memory: "2GB",
        icon: "🐘",
      },
    },
  ];

  const edges: Edge[] = [
    {
      id: `e-${appId}-1-2`,
      source: `node-${appId}-1`,
      target: `node-${appId}-2`,
      animated: true,
    },
    {
      id: `e-${appId}-2-3`,
      source: `node-${appId}-2`,
      target: `node-${appId}-3`,
    },
  ];

  if (appId === "app-2") {
    nodes.push({
      id: `node-${appId}-4`,
      type: "service",
      position: { x: 500, y: 300 },
      data: {
        label: "Redis Cache",
        status: "Down",
        cpuLimit: 95,
        memory: "256MB",
        icon: "🟥",
      },
    });
    edges.push({
      id: `e-${appId}-2-4`,
      source: `node-${appId}-2`,
      target: `node-${appId}-4`,
      animated: true,
    });
  }

  return { nodes, edges };
};

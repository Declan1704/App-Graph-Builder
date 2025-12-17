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

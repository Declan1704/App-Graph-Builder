import { Node, Edge } from 'reactflow';

export interface AppEntity {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down';

export interface ServiceNodeData {
  label: string;
  status: NodeStatus;
  cpuLimit: number; // 0-100
  memory: string;
  description?: string;
  icon?: string;
}

export type ServiceNode = Node<ServiceNodeData>;

export interface GraphResponse {
  nodes: ServiceNode[];
  edges: Edge[];
}

export enum InspectorTab {
  Config = 'Config',
  Runtime = 'Runtime',
}

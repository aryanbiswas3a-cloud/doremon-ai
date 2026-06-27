import type { Node, Edge } from "@xyflow/react";

export type NodeShape =
  | "rectangle"
  | "diamond"
  | "circle"
  | "pill"
  | "cylinder"
  | "hexagon";

export type NodeData = {
  label: string;
  color?: string;
  shape?: NodeShape;
};

export type CanvasNode = Node<NodeData, "canvasNode">;
export type CanvasEdge = Edge<{ label?: string }, "canvasEdge">;

export interface NodeColorPair {
  fill: string;
  text: string;
  name: string;
}

export const NODE_COLORS: NodeColorPair[] = [
  { fill: "#1F1F1F", text: "#EDEDED", name: "Charcoal" },
  { fill: "#10233D", text: "#52A8FF", name: "Navy" },
  { fill: "#2E1938", text: "#BF7AF0", name: "Purple" },
  { fill: "#331B00", text: "#FF990A", name: "Amber" },
  { fill: "#3C1618", text: "#FF6166", name: "Red" },
  { fill: "#3A1726", text: "#F75F8F", name: "Pink" },
  { fill: "#0F2E18", text: "#62C073", name: "Green" },
  { fill: "#062822", text: "#0AC7B4", name: "Teal" },
];

export const NODE_SHAPES: NodeShape[] = [
  "rectangle",
  "diamond",
  "circle",
  "pill",
  "cylinder",
  "hexagon",
];

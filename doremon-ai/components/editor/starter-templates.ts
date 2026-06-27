import type { CanvasNode, CanvasEdge, NodeShape } from "@/types/canvas";

export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

function n(
  id: string,
  label: string,
  x: number,
  y: number,
  shape: NodeShape,
  color: string,
  width = 130,
  height = 50
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    style: { width, height },
    data: { label, color, shape },
  };
}

function e(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
  };
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "API gateway routing traffic to independent services with separate data stores.",
    nodes: [
      n("ms-gateway",    "API Gateway",      70,   0, "rectangle", "#10233D", 160, 50),
      n("ms-user",       "User Service",      0, 110, "rectangle", "#2E1938", 130, 50),
      n("ms-product",    "Product Service", 185, 110, "rectangle", "#0F2E18", 130, 50),
      n("ms-order",      "Order Service",   370, 110, "rectangle", "#331B00", 130, 50),
      n("ms-user-db",    "Users DB",          0, 240, "cylinder",  "#10233D", 100, 70),
      n("ms-product-db", "Products DB",     185, 240, "cylinder",  "#0F2E18", 100, 70),
      n("ms-queue",      "Msg Queue",        370, 240, "hexagon",   "#3C1618", 120, 70),
    ],
    edges: [
      e("ms-e1", "ms-gateway",   "ms-user"),
      e("ms-e2", "ms-gateway",   "ms-product"),
      e("ms-e3", "ms-gateway",   "ms-order"),
      e("ms-e4", "ms-user",      "ms-user-db"),
      e("ms-e5", "ms-product",   "ms-product-db"),
      e("ms-e6", "ms-order",     "ms-queue"),
    ],
  },
  {
    id: "cicd",
    name: "CI/CD Pipeline",
    description: "Automated build, test, and deploy workflow from source to production.",
    nodes: [
      n("ci-code",  "Source Control",   0,   0, "rectangle", "#1F1F1F", 130, 50),
      n("ci-build", "Build",          195,   0, "rectangle", "#10233D", 110, 50),
      n("ci-test",  "Test Suite",     360,   0, "rectangle", "#0F2E18", 110, 50),
      n("ci-stage", "Staging",        525,   0, "rectangle", "#331B00", 110, 50),
      n("ci-gate",  "Approval Gate",  525, 110, "diamond",   "#2E1938", 130, 80),
      n("ci-prod",  "Production",     705,  55, "rectangle", "#3C1618", 110, 50),
    ],
    edges: [
      e("ci-e1", "ci-code",  "ci-build"),
      e("ci-e2", "ci-build", "ci-test"),
      e("ci-e3", "ci-test",  "ci-stage"),
      e("ci-e4", "ci-stage", "ci-gate"),
      e("ci-e5", "ci-gate",  "ci-prod"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "Producers emit events to a central bus, which fans out to independent consumers.",
    nodes: [
      n("ev-prod-a", "Producer A",   0,   0, "pill",      "#10233D", 120, 50),
      n("ev-prod-b", "Producer B",   0, 110, "pill",      "#10233D", 120, 50),
      n("ev-bus",    "Event Bus",  235,  45, "hexagon",   "#331B00", 130, 70),
      n("ev-cons-1", "Consumer 1", 470,   0, "rectangle", "#0F2E18", 120, 50),
      n("ev-cons-2", "Consumer 2", 470,  80, "rectangle", "#0F2E18", 120, 50),
      n("ev-cons-3", "Consumer 3", 470, 160, "rectangle", "#0F2E18", 120, 50),
      n("ev-db",     "Store",      650,  80, "cylinder",  "#062822", 100, 70),
    ],
    edges: [
      e("ev-e1", "ev-prod-a", "ev-bus"),
      e("ev-e2", "ev-prod-b", "ev-bus"),
      e("ev-e3", "ev-bus",    "ev-cons-1"),
      e("ev-e4", "ev-bus",    "ev-cons-2"),
      e("ev-e5", "ev-bus",    "ev-cons-3"),
      e("ev-e6", "ev-cons-2", "ev-db"),
    ],
  },
];

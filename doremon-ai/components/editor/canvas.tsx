"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  MiniMap,
  Panel,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  useReactFlow,
  type NodeTypes,
  type EdgeTypes,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react";
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { ShapePanel } from "@/components/editor/shape-panel";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { CanvasTemplate } from "@/components/editor/starter-templates";

const nodeTypes: NodeTypes = {
  canvasNode: CanvasNodeComponent,
};

const edgeTypes: EdgeTypes = {
  canvasEdge: CanvasEdgeComponent,
};

const defaultEdgeOptions = {
  type: "canvasEdge",
  markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12 },
  data: { label: "" },
};

let nodeIdCounter = 0;

function generateId(shape: string): string {
  return `${shape}-${Date.now()}-${++nodeIdCounter}`;
}

function CtrlButton({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

interface CanvasFlowProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onDelete: (params: { nodes: Node[]; edges: Edge[] }) => void;
  isTemplatesOpen: boolean;
  onTemplatesClose: () => void;
}

function CanvasFlow({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDelete,
  isTemplatesOpen,
  onTemplatesClose,
}: CanvasFlowProps) {
  const flow = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  useKeyboardShortcuts(undo, redo);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/doremon-shape");
      if (!raw) return;

      const { shape, width, height } = JSON.parse(raw) as {
        shape: string;
        width: number;
        height: number;
      };

      const position = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY });

      const newNode: Node = {
        id: generateId(shape),
        type: "canvasNode",
        position: {
          x: position.x - width / 2,
          y: position.y - height / 2,
        },
        style: { width, height },
        data: {
          label: "",
          color: "#1F1F1F",
          shape,
        },
      };

      onNodesChange([{ type: "add", item: newNode }]);
    },
    [flow, onNodesChange]
  );

  const handleImport = useCallback(
    (template: CanvasTemplate) => {
      if (nodes.length > 0) {
        onNodesChange(nodes.map((nd) => ({ type: "remove" as const, id: nd.id })));
      }
      if (edges.length > 0) {
        onEdgesChange(edges.map((eg) => ({ type: "remove" as const, id: eg.id })));
      }
      onNodesChange(template.nodes.map((nd) => ({ type: "add" as const, item: nd as Node })));
      onEdgesChange(template.edges.map((eg) => ({ type: "add" as const, item: eg as Edge })));
      onTemplatesClose();
      setTimeout(() => flow.fitView({ duration: 300 }), 50);
    },
    [nodes, edges, onNodesChange, onEdgesChange, flow, onTemplatesClose]
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Cursors />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="bottom-left" className="mb-4 ml-4">
          <div className="flex items-center px-1 py-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full shadow-lg">
            <CtrlButton onClick={() => flow.zoomOut({ duration: 200 })} title="Zoom out (-)">
              <ZoomOut className="w-4 h-4" />
            </CtrlButton>
            <CtrlButton onClick={() => flow.fitView({ duration: 300 })} title="Fit view">
              <Maximize2 className="w-4 h-4" />
            </CtrlButton>
            <CtrlButton onClick={() => flow.zoomIn({ duration: 200 })} title="Zoom in (+)">
              <ZoomIn className="w-4 h-4" />
            </CtrlButton>
            <div className="w-px h-4 bg-[var(--border-default)] mx-0.5 flex-shrink-0" />
            <CtrlButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)">
              <Undo2 className="w-4 h-4" />
            </CtrlButton>
            <CtrlButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)">
              <Redo2 className="w-4 h-4" />
            </CtrlButton>
          </div>
        </Panel>
      </ReactFlow>
      <ShapePanel />
      <StarterTemplatesModal
        open={isTemplatesOpen}
        onOpenChange={(o) => { if (!o) onTemplatesClose(); }}
        onImport={handleImport}
      />
    </div>
  );
}

interface CanvasProps {
  isTemplatesOpen: boolean;
  onTemplatesClose: () => void;
}

export function Canvas({ isTemplatesOpen, onTemplatesClose }: CanvasProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<Node, Edge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  return (
    <ReactFlowProvider>
      <CanvasFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        isTemplatesOpen={isTemplatesOpen}
        onTemplatesClose={onTemplatesClose}
      />
    </ReactFlowProvider>
  );
}

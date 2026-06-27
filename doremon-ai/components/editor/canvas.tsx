"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { useUndo, useRedo, useCanUndo, useCanRedo, useUpdateMyPresence, useOther } from "@liveblocks/react";
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2 } from "lucide-react";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

import { CanvasNodeComponent } from "@/components/editor/canvas-node";
import { CanvasEdgeComponent } from "@/components/editor/canvas-edge";
import { ShapePanel } from "@/components/editor/shape-panel";
import { StarterTemplatesModal } from "@/components/editor/starter-templates-modal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { PresenceAvatars } from "@/components/editor/presence-avatars";
import { useCanvasAutosave, type SaveStatus } from "@/hooks/useCanvasAutosave";
import type { CanvasTemplate } from "@/components/editor/starter-templates";
import type { NodeShape } from "@/types/canvas";

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

function trimDisplayName(name: string): string {
  return name.split(" - ")[0].trim().split(" ")[0];
}

function CustomCursor({ connectionId }: { connectionId: number; userId: string }) {
  const other = useOther(connectionId, (o) => ({
    color: o.info?.color ?? "#6366f1",
    name: o.info?.name ?? "User",
  }));

  if (!other) return null;

  const label = trimDisplayName(other.name);

  return (
    <div style={{ pointerEvents: "none", userSelect: "none" }}>
      <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L0 14L4 10.5L6.5 17L8.5 16L6 9.5L11 9.5L0 0Z"
          fill={other.color}
          stroke="white"
          strokeWidth="1"
        />
      </svg>
      <div
        style={{
          marginTop: 4,
          marginLeft: 12,
          backgroundColor: other.color,
          color: "#ffffff",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1,
          padding: "3px 7px",
          borderRadius: 9999,
          whiteSpace: "nowrap",
          display: "inline-block",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      >
        {label}
      </div>
    </div>
  );
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
  saveStatus: SaveStatus;
  fitViewTrigger: number;
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
  saveStatus,
  fitViewTrigger,
}: CanvasFlowProps) {
  const flow = useReactFlow();
  const undo = useUndo();
  const redo = useRedo();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const updateMyPresence = useUpdateMyPresence();
  useEffect(() => {
    if (fitViewTrigger > 0) {
      flow.fitView({ duration: 300 });
    }
  }, [fitViewTrigger, flow]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) return;

      const selectedNodes = flow.getNodes().filter((n) => n.selected);
      const selectedEdges = flow.getEdges().filter((eg) => eg.selected);

      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
        onDelete({ nodes: selectedNodes, edges: selectedEdges });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [flow, onDelete]);

  useKeyboardShortcuts(undo, redo);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      updateMyPresence({ cursor: { x: pos.x, y: pos.y } });
    },
    [flow, updateMyPresence]
  );

  const handleMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

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

  const handleAddShape = useCallback(
    (shape: NodeShape, width: number, height: number) => {
      const position = flow.screenToFlowPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        deleteKeyCode={null}
      >
        <Cursors components={{ Cursor: CustomCursor }} />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} />
        <Panel position="top-right" className="mr-3 mt-3">
          <div className="flex items-center rounded-full px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] shadow-md pointer-events-none">
            <PresenceAvatars />
          </div>
        </Panel>
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
            {saveStatus !== "idle" && (
              <>
                <div className="w-px h-4 bg-[var(--border-default)] mx-0.5 flex-shrink-0" />
                <span
                  className={`text-xs px-2 whitespace-nowrap ${
                    saveStatus === "error"
                      ? "text-red-400"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {saveStatus === "saving"
                    ? "Saving…"
                    : saveStatus === "saved"
                    ? "Saved"
                    : "Save failed"}
                </span>
              </>
            )}
          </div>
        </Panel>
      </ReactFlow>
      <ShapePanel onAddShape={handleAddShape} />
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
  projectId: string;
  onSaveStatusChange: (status: SaveStatus) => void;
  onRegisterSave?: (fn: () => void) => void;
}

export function Canvas({ isTemplatesOpen, onTemplatesClose, projectId, onSaveStatusChange, onRegisterSave }: CanvasProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<Node, Edge>({
      suspense: true,
      nodes: { initial: [] },
      edges: { initial: [] },
    });

  const [autosaveEnabled, setAutosaveEnabled] = useState(false);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (nodes.length > 0 || edges.length > 0) {
      setAutosaveEnabled(true);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const savedNodes: Node[] = data?.canvas?.nodes ?? [];
        const savedEdges: Edge[] = data?.canvas?.edges ?? [];
        if (savedNodes.length) {
          onNodesChange(savedNodes.map((n) => ({ type: "add" as const, item: n })));
          setFitViewTrigger((t) => t + 1);
        }
        if (savedEdges.length) {
          onEdgesChange(savedEdges.map((e) => ({ type: "add" as const, item: e })));
        }
      } catch {
        // ignore load errors
      } finally {
        if (!cancelled) setAutosaveEnabled(true);
      }
    })();

    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { status: saveStatus, saveNow } = useCanvasAutosave(projectId, nodes, edges, autosaveEnabled);

  useEffect(() => {
    onSaveStatusChange(saveStatus);
  }, [saveStatus, onSaveStatusChange]);

  useEffect(() => {
    onRegisterSave?.(saveNow);
  }, [saveNow, onRegisterSave]);

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
        saveStatus={saveStatus}
        fitViewTrigger={fitViewTrigger}
      />
    </ReactFlowProvider>
  );
}

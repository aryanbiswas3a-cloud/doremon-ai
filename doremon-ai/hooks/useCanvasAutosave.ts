import { useEffect, useRef, useState, useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useCanvasAutosave(
  projectId: string,
  nodes: Node[],
  edges: Edge[],
  enabled: boolean
): { status: SaveStatus; saveNow: () => void } {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { edgesRef.current = edges; }, [edges]);

  const save = useCallback(async () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setStatus("saving");
    try {
      const res = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes: nodesRef.current, edges: edgesRef.current }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
    resetTimerRef.current = setTimeout(() => setStatus("idle"), 2000);
  }, [projectId]);

  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 2000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, enabled, save]);

  return { status, saveNow: save };
}

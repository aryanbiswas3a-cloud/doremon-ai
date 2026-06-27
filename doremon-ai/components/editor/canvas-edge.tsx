"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import type { CanvasEdge } from "@/types/canvas";

export function CanvasEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  markerEnd,
}: EdgeProps<CanvasEdge>) {
  const { updateEdgeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [inputWidth, setInputWidth] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);
  const escapedRef = useRef(false);
  const committedRef = useRef(false);

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = data?.label ?? "";

  useEffect(() => {
    if (editing) {
      committedRef.current = false;
      setInputWidth(Math.max(60, label.length * 8 + 20));
      requestAnimationFrame(() => {
        inputRef.current?.select();
      });
    }
    // intentionally exclude label — only sync width when edit session opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const startEditing = useCallback(() => {
    escapedRef.current = false;
    setEditing(true);
  }, []);

  const commit = useCallback(() => {
    if (committedRef.current) return;
    committedRef.current = true;
    if (escapedRef.current) {
      escapedRef.current = false;
      setEditing(false);
      return;
    }
    const next = inputRef.current?.value ?? "";
    setEditing(false);
    updateEdgeData(id, { label: next });
  }, [id, updateEdgeData]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "Escape") {
        e.stopPropagation();
        if (e.key === "Escape") escapedRef.current = true;
        commit();
      }
    },
    [commit]
  );

  return (
    <>
      {/* Transparent wider stroke: makes the edge easier to hover and click */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: "pointer" }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          startEditing();
        }}
      />
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: selected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
          strokeWidth: 1.5,
          strokeLinecap: "round",
          transition: "stroke 0.15s ease",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {editing ? (
            <input
              ref={inputRef}
              defaultValue={label}
              autoFocus
              aria-label="Edge label"
              onChange={(e) =>
                setInputWidth(Math.max(60, e.target.value.length * 8 + 20))
              }
              onBlur={commit}
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="nodrag nopan text-xs px-2 py-0.5 rounded outline-none bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)]"
              style={{ width: inputWidth }}
            />
          ) : label ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Edit edge label"
              className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border-default)] cursor-text select-none"
              onDoubleClick={startEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "F2") {
                  e.preventDefault();
                  e.stopPropagation();
                  startEditing();
                }
              }}
            >
              {label}
            </span>
          ) : selected ? (
            <span
              role="button"
              tabIndex={0}
              aria-label="Edit edge label"
              className="text-xs px-2 py-0.5 rounded-full text-[var(--text-muted)] cursor-text select-none"
              style={{ opacity: 0.4 }}
              onDoubleClick={startEditing}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "F2") {
                  e.preventDefault();
                  e.stopPropagation();
                  startEditing();
                }
              }}
            >
              label…
            </span>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

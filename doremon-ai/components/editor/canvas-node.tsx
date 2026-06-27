"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow, type NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function getColorPair(fill?: string) {
  return NODE_COLORS.find((c) => c.fill === fill) ?? NODE_COLORS[0];
}

const HANDLE_CLASS =
  "!opacity-0 group-hover:!opacity-100 !transition-opacity !bg-white !rounded-full !w-2.5 !h-2.5 !border-2 !border-gray-900";

function Handles() {
  return (
    <>
      <Handle type="source" id="top-s" position={Position.Top} className={HANDLE_CLASS} />
      <Handle type="target" id="top-t" position={Position.Top} className={HANDLE_CLASS} />
      <Handle type="source" id="left-s" position={Position.Left} className={HANDLE_CLASS} />
      <Handle type="target" id="left-t" position={Position.Left} className={HANDLE_CLASS} />
      <Handle type="source" id="bottom-s" position={Position.Bottom} className={HANDLE_CLASS} />
      <Handle type="target" id="bottom-t" position={Position.Bottom} className={HANDLE_CLASS} />
      <Handle type="source" id="right-s" position={Position.Right} className={HANDLE_CLASS} />
      <Handle type="target" id="right-t" position={Position.Right} className={HANDLE_CLASS} />
    </>
  );
}

const MIN_SIZES: Record<string, { width: number; height: number }> = {
  rectangle: { width: 80, height: 40 },
  pill:      { width: 80, height: 40 },
  circle:    { width: 60, height: 60 },
  diamond:   { width: 80, height: 80 },
  hexagon:   { width: 80, height: 80 },
  cylinder:  { width: 80, height: 80 },
};

const RESIZER_LINE_STYLE: React.CSSProperties = {
  borderColor: "rgba(0, 136, 255, 0.25)",
};

const RESIZER_HANDLE_STYLE: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 2,
  backgroundColor: "#18181c",
  border: "1.5px solid rgba(0, 136, 255, 0.7)",
};

function ColorToolbar({ id, activeColor, isVisible }: { id: string; activeColor: string; isVisible: boolean }) {
  const { updateNodeData } = useReactFlow();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <NodeToolbar isVisible={isVisible} position={Position.Top} offset={10}>
      <div
        className="nodrag nopan flex items-center gap-1 px-2 py-1.5 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full shadow-lg"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {NODE_COLORS.map((pair, idx) => {
          const isActive = pair.fill === activeColor;
          const isHovered = hoveredIdx === idx;
          return (
            <button
              key={pair.fill}
              className="nodrag nopan w-5 h-5 rounded-full focus:outline-none"
              style={{
                backgroundColor: pair.fill,
                border: isActive ? `2px solid ${pair.text}` : "2px solid transparent",
                boxShadow: isActive
                  ? `0 0 0 1.5px ${pair.text}50`
                  : isHovered
                  ? `0 0 5px 2px ${pair.text}55`
                  : "none",
                transform: isHovered ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.1s ease, box-shadow 0.1s ease",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                updateNodeData(id, { color: pair.fill });
              }}
            />
          );
        })}
      </div>
    </NodeToolbar>
  );
}

export function CanvasNodeComponent({ id, data, selected }: NodeProps<CanvasNode>) {
  const { updateNodeData } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const escapedRef = useRef(false);

  const pair = getColorPair(data.color);
  const shape = data.shape ?? "rectangle";
  const borderColor = selected ? "var(--accent-primary)" : "var(--border-default)";
  const minSize = MIN_SIZES[shape] ?? { width: 80, height: 40 };

  // Set initial content and select all text when editing starts.
  // Omitting data.label from deps is intentional: we only want this to run
  // once when the editing session opens, not on every external label change.
  useEffect(() => {
    if (!editing || !editableRef.current) return;
    const el = editableRef.current;
    el.textContent = data.label ?? "";
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const startEditing = useCallback(() => {
    escapedRef.current = false;
    setEditing(true);
  }, []);

  const commitEdit = useCallback(() => {
    if (escapedRef.current) {
      escapedRef.current = false;
      return;
    }
    setEditing(false);
    const text = editableRef.current?.textContent ?? "";
    updateNodeData(id, { label: text });
  }, [id, updateNodeData]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      escapedRef.current = true;
      setEditing(false);
    }
  }

  const resizer = (
    <NodeResizer
      isVisible={selected}
      minWidth={minSize.width}
      minHeight={minSize.height}
      lineStyle={RESIZER_LINE_STYLE}
      handleStyle={RESIZER_HANDLE_STYLE}
    />
  );

  const labelOverlay = editing ? (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        className="nodrag nopan w-full px-2 text-center text-sm font-medium leading-snug break-words outline-none"
        style={{ color: pair.text, cursor: "text", minHeight: "1em" }}
        onBlur={commitEdit}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => e.stopPropagation()}
      />
    </div>
  ) : (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span
        className="px-2 text-center break-words leading-snug text-sm font-medium select-none"
        style={{ color: pair.text, pointerEvents: "auto" }}
        onDoubleClick={startEditing}
      >
        {data.label ? data.label : <span style={{ opacity: 0.4 }}>Label...</span>}
      </span>
    </div>
  );

  const colorToolbar = (
    <ColorToolbar
      id={id}
      activeColor={data.color ?? NODE_COLORS[0].fill}
      isVisible={!!selected}
    />
  );

  if (shape === "rectangle") {
    return (
      <>
        {colorToolbar}
        <div className="relative group w-full h-full select-none">
          {resizer}
          <Handles />
          <div
            className="absolute inset-0 rounded-xl border"
            style={{ backgroundColor: pair.fill, borderColor }}
          />
          {labelOverlay}
        </div>
      </>
    );
  }

  if (shape === "pill") {
    return (
      <>
        {colorToolbar}
        <div className="relative group w-full h-full select-none">
          {resizer}
          <Handles />
          <div
            className="absolute inset-0 rounded-full border"
            style={{ backgroundColor: pair.fill, borderColor }}
          />
          {labelOverlay}
        </div>
      </>
    );
  }

  if (shape === "circle") {
    return (
      <>
        {colorToolbar}
        <div className="relative group w-full h-full select-none">
          <NodeResizer
            isVisible={selected}
            minWidth={minSize.width}
            minHeight={minSize.height}
            lineStyle={RESIZER_LINE_STYLE}
            handleStyle={RESIZER_HANDLE_STYLE}
            keepAspectRatio
          />
          <Handles />
          <div
            className="absolute inset-0 rounded-full border"
            style={{ backgroundColor: pair.fill, borderColor }}
          />
          {labelOverlay}
        </div>
      </>
    );
  }

  // SVG-based shapes: diamond, hexagon, cylinder
  let svgContent: React.ReactNode;

  if (shape === "diamond") {
    svgContent = (
      <svg
        width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <polygon points="50,2 98,50 50,98 2,50" fill={pair.fill} stroke={borderColor} strokeWidth="2" />
      </svg>
    );
  } else if (shape === "hexagon") {
    svgContent = (
      <svg
        width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <polygon points="50,2 95,26 95,74 50,98 5,74 5,26" fill={pair.fill} stroke={borderColor} strokeWidth="2" />
      </svg>
    );
  } else {
    // cylinder
    svgContent = (
      <svg
        width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <rect x="2" y="20" width="96" height="60" fill={pair.fill} />
        <line x1="2" y1="20" x2="2" y2="80" stroke={borderColor} strokeWidth="2" />
        <line x1="98" y1="20" x2="98" y2="80" stroke={borderColor} strokeWidth="2" />
        <ellipse cx="50" cy="80" rx="48" ry="14" fill={pair.fill} stroke={borderColor} strokeWidth="2" />
        <ellipse cx="50" cy="20" rx="48" ry="14" fill={pair.fill} stroke={borderColor} strokeWidth="2" />
      </svg>
    );
  }

  return (
    <>
      {colorToolbar}
      <div className="relative group w-full h-full select-none" style={{ color: pair.text }}>
        {resizer}
        <Handles />
        {svgContent}
        {labelOverlay}
      </div>
    </>
  );
}

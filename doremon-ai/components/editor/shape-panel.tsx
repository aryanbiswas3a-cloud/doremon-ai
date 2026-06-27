"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { NodeShape } from "@/types/canvas";

interface ShapeConfig {
  shape: NodeShape;
  label: string;
  width: number;
  height: number;
}

const SHAPES: ShapeConfig[] = [
  { shape: "rectangle", label: "Rectangle", width: 160, height: 80 },
  { shape: "diamond",   label: "Diamond",   width: 140, height: 140 },
  { shape: "circle",    label: "Circle",    width: 100, height: 100 },
  { shape: "pill",      label: "Pill",      width: 160, height: 70  },
  { shape: "cylinder",  label: "Cylinder",  width: 120, height: 100 },
  { shape: "hexagon",   label: "Hexagon",   width: 130, height: 130 },
];

const SVG_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ShapeIcon({ shape }: { shape: NodeShape }) {
  switch (shape) {
    case "rectangle":
      return <svg {...SVG_PROPS}><rect x="2" y="5" width="16" height="10" rx="1" /></svg>;
    case "diamond":
      return <svg {...SVG_PROPS}><polygon points="10,2 18,10 10,18 2,10" /></svg>;
    case "circle":
      return <svg {...SVG_PROPS}><circle cx="10" cy="10" r="8" /></svg>;
    case "pill":
      return <svg {...SVG_PROPS}><rect x="2" y="6" width="16" height="8" rx="4" /></svg>;
    case "cylinder":
      return (
        <svg {...SVG_PROPS}>
          <ellipse cx="10" cy="5" rx="7" ry="2.5" />
          <ellipse cx="10" cy="15" rx="7" ry="2.5" />
          <line x1="3" y1="5" x2="3" y2="15" />
          <line x1="17" y1="5" x2="17" y2="15" />
        </svg>
      );
    case "hexagon":
      return <svg {...SVG_PROPS}><polygon points="10,2 17.7,6 17.7,14 10,18 2.3,14 2.3,6" /></svg>;
  }
}

interface DragState {
  shape: NodeShape;
  x: number;
  y: number;
  width: number;
  height: number;
}

const GHOST_FILL = "rgba(31,31,31,0.65)";
const GHOST_STROKE = "rgba(90,90,110,0.9)";

function ShapeGhost({ state }: { state: DragState }) {
  const { shape, x, y, width, height } = state;

  let inner: React.ReactNode;

  if (shape === "rectangle") {
    inner = (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0.75rem",
          border: `2px dashed ${GHOST_STROKE}`,
          backgroundColor: GHOST_FILL,
        }}
      />
    );
  } else if (shape === "pill") {
    inner = (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          border: `2px dashed ${GHOST_STROKE}`,
          backgroundColor: GHOST_FILL,
        }}
      />
    );
  } else if (shape === "circle") {
    inner = (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "9999px",
          border: `2px dashed ${GHOST_STROKE}`,
          backgroundColor: GHOST_FILL,
        }}
      />
    );
  } else if (shape === "diamond") {
    inner = (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 98,50 50,98 2,50"
          fill={GHOST_FILL}
          stroke={GHOST_STROKE}
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
      </svg>
    );
  } else if (shape === "hexagon") {
    inner = (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          points="50,2 95,26 95,74 50,98 5,74 5,26"
          fill={GHOST_FILL}
          stroke={GHOST_STROKE}
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
      </svg>
    );
  } else {
    // cylinder
    inner = (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect x="2" y="20" width="96" height="60" fill={GHOST_FILL} />
        <line x1="2" y1="20" x2="2" y2="80" stroke={GHOST_STROKE} strokeWidth="2.5" strokeDasharray="6 3" />
        <line x1="98" y1="20" x2="98" y2="80" stroke={GHOST_STROKE} strokeWidth="2.5" strokeDasharray="6 3" />
        <ellipse cx="50" cy="80" rx="48" ry="14" fill={GHOST_FILL} stroke={GHOST_STROKE} strokeWidth="2.5" strokeDasharray="6 3" />
        <ellipse cx="50" cy="20" rx="48" ry="14" fill={GHOST_FILL} stroke={GHOST_STROKE} strokeWidth="2.5" strokeDasharray="6 3" />
      </svg>
    );
  }

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: x - width / 2,
        top: y - height / 2,
        width,
        height,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {inner}
    </div>,
    document.body
  );
}

export function ShapePanel() {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [mounted, setMounted] = useState(false);
  const ghostImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    ghostImgRef.current = img;
  }, []);

  function handleDragStart(e: React.DragEvent, config: ShapeConfig) {
    e.dataTransfer.setData(
      "application/doremon-shape",
      JSON.stringify({ shape: config.shape, width: config.width, height: config.height })
    );
    e.dataTransfer.effectAllowed = "move";

    if (ghostImgRef.current) {
      e.dataTransfer.setDragImage(ghostImgRef.current, 0, 0);
    }

    setDragState({
      shape: config.shape,
      x: e.clientX,
      y: e.clientY,
      width: config.width,
      height: config.height,
    });
  }

  function handleDrag(e: React.DragEvent) {
    if (e.clientX === 0 && e.clientY === 0) return;
    setDragState((prev) =>
      prev ? { ...prev, x: e.clientX, y: e.clientY } : null
    );
  }

  function handleDragEnd() {
    setDragState(null);
  }

  return (
    <>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full shadow-lg">
        {SHAPES.map((config) => (
          <button
            key={config.shape}
            draggable
            onDragStart={(e) => handleDragStart(e, config)}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            title={config.label}
            className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-grab active:cursor-grabbing"
          >
            <ShapeIcon shape={config.shape} />
          </button>
        ))}
      </div>
      {mounted && dragState && <ShapeGhost state={dragState} />}
    </>
  );
}

"use client";

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

export function ShapePanel() {
  function handleDragStart(e: React.DragEvent, config: ShapeConfig) {
    e.dataTransfer.setData(
      "application/doremon-shape",
      JSON.stringify({ shape: config.shape, width: config.width, height: config.height })
    );
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-full shadow-lg">
      {SHAPES.map((config) => (
        <button
          key={config.shape}
          draggable
          onDragStart={(e) => handleDragStart(e, config)}
          title={config.label}
          className="flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors cursor-grab active:cursor-grabbing"
        >
          <ShapeIcon shape={config.shape} />
        </button>
      ))}
    </div>
  );
}

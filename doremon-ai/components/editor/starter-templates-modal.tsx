"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-templates";
import { NODE_COLORS, type NodeShape } from "@/types/canvas";

const PREVIEW_W = 240;
const PREVIEW_H = 140;
const PREVIEW_PAD = 10;

function getColorPair(fill?: string) {
  return NODE_COLORS.find((c) => c.fill === fill) ?? NODE_COLORS[0];
}

function NodeShape({
  shape,
  x,
  y,
  w,
  h,
  fill,
  stroke,
}: {
  shape: NodeShape;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  stroke: string;
}) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  if (shape === "pill") {
    return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={stroke} strokeWidth={0.5} />;
  }
  if (shape === "circle") {
    return <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth={0.5} />;
  }
  if (shape === "diamond") {
    const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={0.5} />;
  }
  if (shape === "hexagon") {
    const pts = [
      [x + w * 0.25, y],
      [x + w * 0.75, y],
      [x + w, cy],
      [x + w * 0.75, y + h],
      [x + w * 0.25, y + h],
      [x, cy],
    ]
      .map(([px, py]) => `${px},${py}`)
      .join(" ");
    return <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={0.5} />;
  }
  if (shape === "cylinder") {
    const ry = Math.max(2, Math.min(h * 0.14, 6));
    return (
      <g>
        <rect x={x} y={y + ry} width={w} height={h - ry * 1.5} fill={fill} stroke="none" />
        <ellipse cx={cx} cy={y + ry} rx={w / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={0.5} />
        <ellipse cx={cx} cy={y + h - ry * 0.5} rx={w / 2} ry={ry} fill={fill} stroke={stroke} strokeWidth={0.5} />
        <line x1={x} y1={y + ry} x2={x} y2={y + h - ry * 0.5} stroke={stroke} strokeWidth={0.5} />
        <line x1={x + w} y1={y + ry} x2={x + w} y2={y + h - ry * 0.5} stroke={stroke} strokeWidth={0.5} />
      </g>
    );
  }
  // default: rectangle
  return <rect x={x} y={y} width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={0.5} />;
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, edges } = template;
  if (nodes.length === 0) return null;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const nd of nodes) {
    const w = (nd.style?.width as number) ?? 120;
    const h = (nd.style?.height as number) ?? 50;
    minX = Math.min(minX, nd.position.x);
    minY = Math.min(minY, nd.position.y);
    maxX = Math.max(maxX, nd.position.x + w);
    maxY = Math.max(maxY, nd.position.y + h);
  }

  const contentW = maxX - minX;
  const contentH = maxY - minY;
  const availW = PREVIEW_W - 2 * PREVIEW_PAD;
  const availH = PREVIEW_H - 2 * PREVIEW_PAD;
  const scale = Math.min(availW / contentW, availH / contentH);

  const scaledW = contentW * scale;
  const scaledH = contentH * scale;
  const ox = PREVIEW_PAD + (availW - scaledW) / 2;
  const oy = PREVIEW_PAD + (availH - scaledH) / 2;

  const toVx = (x: number) => ox + (x - minX) * scale;
  const toVy = (y: number) => oy + (y - minY) * scale;

  const centers = new Map<string, { x: number; y: number }>();
  for (const nd of nodes) {
    const w = (nd.style?.width as number) ?? 120;
    const h = (nd.style?.height as number) ?? 50;
    centers.set(nd.id, {
      x: toVx(nd.position.x + w / 2),
      y: toVy(nd.position.y + h / 2),
    });
  }

  return (
    <svg
      width={PREVIEW_W}
      height={PREVIEW_H}
      viewBox={`0 0 ${PREVIEW_W} ${PREVIEW_H}`}
      className="w-full h-full"
    >
      <rect width={PREVIEW_W} height={PREVIEW_H} fill="var(--bg-base)" rx={4} />
      {edges.map((eg) => {
        const src = centers.get(eg.source);
        const tgt = centers.get(eg.target);
        if (!src || !tgt) return null;
        return (
          <line
            key={eg.id}
            x1={src.x}
            y1={src.y}
            x2={tgt.x}
            y2={tgt.y}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.8}
          />
        );
      })}
      {nodes.map((nd) => {
        const w = (nd.style?.width as number) ?? 120;
        const h = (nd.style?.height as number) ?? 50;
        const vx = toVx(nd.position.x);
        const vy = toVy(nd.position.y);
        const vw = w * scale;
        const vh = h * scale;
        const pair = getColorPair(nd.data.color);
        return (
          <NodeShape
            key={nd.id}
            shape={nd.data.shape ?? "rectangle"}
            x={vx}
            y={vy}
            w={vw}
            h={vh}
            fill={pair.fill}
            stroke="rgba(255,255,255,0.12)"
          />
        );
      })}
    </svg>
  );
}

interface StarterTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (template: CanvasTemplate) => void;
}

export function StarterTemplatesModal({
  open,
  onOpenChange,
  onImport,
}: StarterTemplatesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-[var(--bg-surface)] border-[var(--border-default)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Starter Templates</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[65vh] overflow-y-auto pr-1 pb-1">
          {CANVAS_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="flex flex-col rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] overflow-hidden"
            >
              <div className="h-32 w-full bg-[var(--bg-base)] shrink-0">
                <TemplatePreview template={template} />
              </div>
              <div className="flex flex-col gap-1 p-3">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {template.name}
                </span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {template.description}
                </p>
                <Button
                  size="sm"
                  className="mt-2 h-7 text-xs"
                  onClick={() => onImport(template)}
                >
                  Import
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

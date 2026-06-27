"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

function getColorPair(fill?: string) {
  return NODE_COLORS.find((c) => c.fill === fill) ?? NODE_COLORS[0];
}

export function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
  const pair = getColorPair(data.color);

  return (
    <div
      className="relative group flex items-center justify-center w-full h-full rounded-xl border border-[var(--border-default)] text-sm font-medium select-none overflow-hidden"
      style={{ backgroundColor: pair.fill, color: pair.text }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity !bg-white !rounded-full !w-2 !h-2 !border-0"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity !bg-white !rounded-full !w-2 !h-2 !border-0"
      />
      <span className="px-2 text-center break-words leading-snug">
        {data.label}
      </span>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity !bg-white !rounded-full !w-2 !h-2 !border-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!opacity-0 group-hover:!opacity-100 !transition-opacity !bg-white !rounded-full !w-2 !h-2 !border-0"
      />
    </div>
  );
}

import "server-only";
import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#F44E5A",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F59E0B",
];

export function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

declare const globalThis: typeof global & { _liveblocks?: Liveblocks };

export function getLiveblocksClient(): Liveblocks {
  if (process.env.NODE_ENV === "production") {
    return new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
  }
  return (globalThis._liveblocks ??= new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
  }));
}

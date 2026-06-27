"use client";

import { useEffect } from "react";
import { useReactFlow } from "@xyflow/react";

function isEditable(e: KeyboardEvent): boolean {
  const el = e.target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
}

export function useKeyboardShortcuts(onUndo: () => void, onRedo: () => void) {
  const flow = useReactFlow();

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (isEditable(e)) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.shiftKey && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        onRedo();
        return;
      }
      if (ctrl && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        onRedo();
        return;
      }
      if (ctrl && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        onUndo();
        return;
      }
      if (!ctrl && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        flow.zoomIn({ duration: 200 });
        return;
      }
      if (!ctrl && e.key === "-") {
        e.preventDefault();
        flow.zoomOut({ duration: 200 });
        return;
      }
    }

    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [flow, onUndo, onRedo]);
}

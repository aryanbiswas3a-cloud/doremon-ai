"use client";

import React, { Component, type ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { Canvas } from "@/components/editor/canvas";
import type { SaveStatus } from "@/hooks/useCanvasAutosave";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class LiveblocksErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full items-center justify-center bg-[var(--bg-base)]">
          <p className="text-sm text-[var(--text-muted)]">
            Could not connect to the canvas. Please refresh the page.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface CanvasWrapperProps {
  roomId: string;
  isTemplatesOpen: boolean;
  onTemplatesClose: () => void;
  onSaveStatusChange: (status: SaveStatus) => void;
  onRegisterSave?: (fn: () => void) => void;
}

export function CanvasWrapper({ roomId, isTemplatesOpen, onTemplatesClose, onSaveStatusChange, onRegisterSave }: CanvasWrapperProps) {
  return (
    <div className="w-full h-full">
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, thinking: false }}
      >
        <LiveblocksErrorBoundary>
          <ClientSideSuspense
            fallback={
              <div className="flex h-full items-center justify-center bg-[var(--bg-base)]">
                <p className="text-sm text-[var(--text-muted)]">Loading canvas…</p>
              </div>
            }
          >
            <Canvas
              isTemplatesOpen={isTemplatesOpen}
              onTemplatesClose={onTemplatesClose}
              projectId={roomId}
              onSaveStatusChange={onSaveStatusChange}
              onRegisterSave={onRegisterSave}
            />
          </ClientSideSuspense>
        </LiveblocksErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
    </div>
  );
}

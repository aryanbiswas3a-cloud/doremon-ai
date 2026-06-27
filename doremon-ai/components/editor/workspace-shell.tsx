"use client";

import { useState, useCallback, useRef } from "react";
import { Bot, LayoutTemplate, Share2 } from "lucide-react";
import type { SaveStatus } from "@/hooks/useCanvasAutosave";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";
import { AiSidebar } from "@/components/editor/ai-sidebar";

interface WorkspaceProject {
  id: string;
  name: string;
  isOwner: boolean;
}

interface WorkspaceShellProps {
  project: WorkspaceProject;
}

export function WorkspaceShell({ project }: WorkspaceShellProps) {
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const handleSaveStatusChange = useCallback((s: SaveStatus) => setSaveStatus(s), []);
  const manualSaveRef = useRef<(() => void) | null>(null);
  const handleRegisterSave = useCallback((fn: () => void) => { manualSaveRef.current = fn; }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Workspace header */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {project.name}
          </h1>
          {saveStatus === "saving" && (
            <span className="text-xs text-[var(--text-muted)] shrink-0">Saving…</span>
          )}
          {saveStatus === "saved" && (
            <span className="text-xs text-[var(--text-muted)] shrink-0">Saved</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-red-400 shrink-0">Save failed</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => manualSaveRef.current?.()}
            disabled={saveStatus === "saving"}
            className="h-7 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)]"
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved" : saveStatus === "error" ? "Error" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTemplatesOpen(true)}
            className="h-7 gap-1.5 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)]"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            Templates
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
            className="h-7 gap-1.5 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-xs text-[var(--text-secondary)]"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <ShareDialog
            projectId={project.id}
            isOwner={project.isOwner}
            open={isShareOpen}
            onOpenChange={setIsShareOpen}
          />
          <Button
            variant={isAISidebarOpen ? "default" : "outline"}
            size="icon"
            onClick={() => setIsAISidebarOpen((prev) => !prev)}
            className="h-7 w-7 border-[var(--border-subtle)]"
            aria-label="Toggle AI sidebar"
          >
            <Bot className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas */}
        <div className="flex flex-1 overflow-hidden">
          <CanvasWrapper
            roomId={project.id}
            isTemplatesOpen={isTemplatesOpen}
            onTemplatesClose={() => setIsTemplatesOpen(false)}
            onSaveStatusChange={handleSaveStatusChange}
            onRegisterSave={handleRegisterSave}
          />
        </div>
      </div>

      {/* Floating AI sidebar */}
      <AiSidebar
        open={isAISidebarOpen}
        onClose={() => setIsAISidebarOpen(false)}
      />
    </div>
  );
}

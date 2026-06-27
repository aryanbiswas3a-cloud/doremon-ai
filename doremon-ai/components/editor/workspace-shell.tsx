"use client";

import { useState } from "react";
import { Bot, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareDialog } from "@/components/editor/share-dialog";
import { CanvasWrapper } from "@/components/editor/canvas-wrapper";

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

  return (
    <div className="flex h-full flex-col">
      {/* Workspace header */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-4">
        <h1 className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {project.name}
        </h1>
        <div className="flex items-center gap-2">
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
          <CanvasWrapper roomId={project.id} />
        </div>

        {/* AI sidebar placeholder */}
        {isAISidebarOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-[var(--border-default)] bg-[var(--bg-surface)]">
            <div className="flex h-11 items-center border-b border-[var(--border-default)] px-4">
              <span className="text-sm font-semibold text-[var(--accent-ai-text)]">
                AI Assistant
              </span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-[var(--text-muted)]">Coming soon</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

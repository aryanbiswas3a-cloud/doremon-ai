"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectDialogs } from "@/hooks/use-project-dialogs";

export function CreateProjectDialog({ dialogs }: { dialogs: ProjectDialogs }) {
  const { createOpen, setCreateOpen, createName, setCreateName, createSlug, isLoading, submitCreate } = dialogs;

  return (
    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>Give your architecture workspace a name.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Project name"
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitCreate()}
            autoFocus
          />
          <p className="font-mono text-xs text-[var(--text-faint)]">
            room:{" "}
            <span className="text-[var(--text-muted)]">{createSlug || "—"}</span>
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setCreateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submitCreate} disabled={!createName.trim() || isLoading}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RenameProjectDialog({ dialogs }: { dialogs: ProjectDialogs }) {
  const { renameTarget, setRenameTarget, renameName, setRenameName, submitRename } = dialogs;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameTarget) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [renameTarget]);

  return (
    <Dialog open={!!renameTarget} onOpenChange={(open) => { if (!open) setRenameTarget(null); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          {renameTarget && (
            <DialogDescription>Current name: {renameTarget.name}</DialogDescription>
          )}
        </DialogHeader>

        <Input
          ref={inputRef}
          placeholder="New name"
          value={renameName}
          onChange={(e) => setRenameName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitRename()}
        />

        <DialogFooter>
          <Button variant="ghost" onClick={() => setRenameTarget(null)}>
            Cancel
          </Button>
          <Button onClick={submitRename} disabled={!renameName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteProjectDialog({ dialogs }: { dialogs: ProjectDialogs }) {
  const { deleteTarget, setDeleteTarget, submitDelete } = dialogs;

  return (
    <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={submitDelete}
            className="bg-[var(--state-error)] text-white hover:bg-[var(--state-error)]/90"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

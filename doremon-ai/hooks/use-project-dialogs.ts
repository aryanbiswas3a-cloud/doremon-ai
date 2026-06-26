"use client";

import { useState } from "react";
import { MOCK_PROJECTS, toSlug } from "@/lib/mock-data";
import type { Project } from "@/lib/mock-data";

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createSlug = toSlug(createName);

  function openCreate() {
    setCreateName("");
    setCreateOpen(true);
  }

  function openRename(project: Project) {
    setRenameTarget(project);
    setRenameName(project.name);
  }

  function openDelete(project: Project) {
    setDeleteTarget(project);
  }

  function submitCreate() {
    if (!createName.trim()) return;
    setIsLoading(true);
    setProjects((prev) => [
      ...prev,
      { id: Date.now().toString(), name: createName.trim(), slug: createSlug, isOwner: true },
    ]);
    setCreateOpen(false);
    setCreateName("");
    setIsLoading(false);
  }

  function submitRename() {
    if (!renameTarget || !renameName.trim()) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === renameTarget.id
          ? { ...p, name: renameName.trim(), slug: toSlug(renameName.trim()) }
          : p
      )
    );
    setRenameTarget(null);
    setRenameName("");
  }

  function submitDelete() {
    if (!deleteTarget) return;
    setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return {
    projects,
    createOpen,
    setCreateOpen,
    renameTarget,
    setRenameTarget,
    deleteTarget,
    setDeleteTarget,
    createName,
    setCreateName,
    createSlug,
    renameName,
    setRenameName,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    submitCreate,
    submitRename,
    submitDelete,
  };
}

export type ProjectDialogs = ReturnType<typeof useProjectDialogs>;

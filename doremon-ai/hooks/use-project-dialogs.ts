"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProjectSummary } from "@/lib/projects";
import { toSlug } from "@/lib/slug";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

interface UseProjectDialogsProps {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function useProjectDialogs({ ownedProjects, sharedProjects }: UseProjectDialogsProps) {
  const router = useRouter();

  const [createOpen, setCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<ProjectSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);

  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suffixRef = useRef(randomSuffix());

  const slug = toSlug(createName);
  const createSlug = slug ? `${slug}-${suffixRef.current}` : "";

  const projects: ProjectSummary[] = [...ownedProjects, ...sharedProjects];

  function openCreate() {
    suffixRef.current = randomSuffix();
    setCreateName("");
    setCreateOpen(true);
  }

  function openRename(project: ProjectSummary) {
    setRenameTarget(project);
    setRenameName(project.name);
  }

  function openDelete(project: ProjectSummary) {
    setDeleteTarget(project);
  }

  async function submitCreate() {
    if (!createName.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const { project } = await res.json();
      setCreateOpen(false);
      setCreateName("");
      router.push(`/editor/${project.id}`);
    } catch {
      // keep dialog open on error
    } finally {
      setIsLoading(false);
    }
  }

  async function submitRename() {
    if (!renameTarget || !renameName.trim()) return;
    try {
      const res = await fetch(`/api/project/${renameTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename");
      setRenameTarget(null);
      setRenameName("");
      router.refresh();
    } catch {
      // keep dialog open on error
    }
  }

  async function submitDelete() {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    setDeleteTarget(null);
    const res = await fetch(`/api/project/${targetId}`, { method: "DELETE" });
    if (!res.ok) return;
    if (window.location.pathname.startsWith(`/editor/${targetId}`)) {
      router.push("/editor");
    } else {
      router.refresh();
    }
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

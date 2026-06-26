"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import {
  CreateProjectDialog,
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/components/editor/project-dialogs";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { ProjectDialogContext } from "@/contexts/project-dialog-context";
import type { ProjectSummary } from "@/lib/projects";


interface EditorShellProps {
  children: React.ReactNode;
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function EditorShell({ children, ownedProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dialogs = useProjectDialogs({ ownedProjects, sharedProjects });

  return (
    <ProjectDialogContext.Provider value={{ openCreate: dialogs.openCreate }}>
      <div className="relative h-screen overflow-hidden bg-[var(--bg-base)]">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
          />
        )}

        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          projects={dialogs.projects}
          onNewProject={dialogs.openCreate}
          onRename={dialogs.openRename}
          onDelete={dialogs.openDelete}
        />

        <main className="h-full pt-12">{children}</main>

        <CreateProjectDialog dialogs={dialogs} />
        <RenameProjectDialog dialogs={dialogs} />
        <DeleteProjectDialog dialogs={dialogs} />
      </div>
    </ProjectDialogContext.Provider>
  );
}

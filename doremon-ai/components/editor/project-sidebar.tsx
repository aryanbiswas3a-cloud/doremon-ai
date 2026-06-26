"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project } from "@/lib/mock-data";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onNewProject: () => void;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRename,
  onDelete,
}: ProjectSidebarProps) {
  const myProjects = projects.filter((p) => p.isOwner);
  const sharedProjects = projects.filter((p) => !p.isOwner);

  return (
    <aside
      className={`fixed bottom-0 left-0 top-12 z-50 flex w-72 flex-col border-r border-[var(--border-default)] bg-[var(--bg-surface)] transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Projects</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden px-3 py-3">
        <Tabs defaultValue="my-projects" className="flex flex-1 flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="mt-2 flex-1 overflow-hidden">
            {myProjects.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">No projects yet</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-0.5">
                  {myProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-2 flex-1 overflow-hidden">
            {sharedProjects.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-[var(--text-muted)]">No shared projects</p>
              </div>
            ) : (
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-0.5">
                  {sharedProjects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      project={project}
                      onRename={onRename}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-default)] p-3">
        <Button
          variant="outline"
          onClick={onNewProject}
          className="w-full border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>
    </aside>
  );
}

interface ProjectItemProps {
  project: Project;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  return (
    <div className="group flex items-center gap-1 rounded-xl px-2 py-2 hover:bg-[var(--bg-elevated)]">
      <span className="flex-1 truncate text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
        {project.name}
      </span>
      <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 motion-safe:group-hover:opacity-100 sm:opacity-100">
        {project.isOwner && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
              onClick={(e) => { e.stopPropagation(); onRename(project); }}
              aria-label={`Rename ${project.name}`}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[var(--text-muted)] hover:bg-[var(--state-error)]/10 hover:text-[var(--state-error)]"
              onClick={(e) => { e.stopPropagation(); onDelete(project); }}
              aria-label={`Delete ${project.name}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

import { NewProjectButton } from "@/components/editor/new-project-button";

export default function EditorPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Start a new architecture workspace or choose a project from the sidebar
        </p>
      </div>
      <NewProjectButton />
    </div>
  );
}

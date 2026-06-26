"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectDialogContext } from "@/contexts/project-dialog-context";

export function NewProjectButton() {
  const { openCreate } = useProjectDialogContext();
  return (
    <Button onClick={openCreate}>
      <Plus className="h-4 w-4" />
      New project
    </Button>
  );
}

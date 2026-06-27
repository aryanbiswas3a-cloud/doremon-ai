import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectAccess } from "@/lib/project-access";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";

type Props = { params: Promise<{ roomId: string }> };

export default async function WorkspacePage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { roomId } = await params;
  const project = await getProjectAccess(roomId);

  if (!project) return <AccessDenied />;

  return <WorkspaceShell project={project} />;
}

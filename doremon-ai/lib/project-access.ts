import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export interface ProjectAccess {
  id: string;
  name: string;
  isOwner: boolean;
}

export async function getCurrentIdentity(): Promise<{
  userId: string;
  email: string | null;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const primaryEntry = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  );
  const email = (primaryEntry ?? user?.emailAddresses[0])?.emailAddress ?? null;
  return { userId, email };
}

export async function getProjectAccess(
  projectId: string
): Promise<ProjectAccess | null> {
  const identity = await getCurrentIdentity();
  if (!identity) return null;
  const { userId, email } = identity;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: { select: { email: true } },
    },
  });

  if (!project) return null;

  const isOwner = project.ownerId === userId;
  const isCollaborator = email
    ? project.collaborators.some((c) => c.email.toLowerCase() === email.toLowerCase())
    : false;

  if (!isOwner && !isCollaborator) return null;

  return { id: project.id, name: project.name, isOwner };
}

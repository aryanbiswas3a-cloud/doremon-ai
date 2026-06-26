import "server-only";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export interface ProjectSummary {
  id: string;
  name: string;
  isOwner: boolean;
}

export async function getProjectsForUser(): Promise<{
  owned: ProjectSummary[];
  shared: ProjectSummary[];
}> {
  const { userId } = await auth();
  if (!userId) return { owned: [], shared: [] };

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? null;

  const [owned, sharedRows] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true },
    }),
    email
      ? prisma.projectCollaborator.findMany({
          where: { email },
          include: { project: { select: { id: true, name: true } } },
        })
      : Promise.resolve([]),
  ]);

  return {
    owned: owned.map((p) => ({ ...p, isOwner: true })),
    shared: sharedRows.map((c) => ({ ...c.project, isOwner: false })),
  };
}

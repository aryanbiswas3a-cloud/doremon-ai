import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { getCurrentIdentity } from "@/lib/project-access";
import prisma from "@/lib/prisma";

type RouteContext = { params: Promise<{ projectId: string }> };

interface EnrichedCollaborator {
  email: string;
  name: string | null;
  avatar: string | null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function enrichEmails(emails: string[]): Promise<EnrichedCollaborator[]> {
  const base: EnrichedCollaborator[] = emails.map((email) => ({
    email,
    name: null,
    avatar: null,
  }));
  if (emails.length === 0) return base;

  try {
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList({
      emailAddress: emails,
      limit: 100,
    });

    const map = new Map<string, { name: string | null; avatar: string | null }>();
    for (const user of users) {
      const primary = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId
      );
      const userEmail = primary?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
      if (!userEmail) continue;
      const firstName = user.firstName ?? "";
      const lastName = user.lastName ?? "";
      const name = [firstName, lastName].filter(Boolean).join(" ") || null;
      map.set(userEmail.toLowerCase(), { name, avatar: user.imageUrl ?? null });
    }

    return base.map((c) => ({
      ...c,
      ...(map.get(c.email.toLowerCase()) ?? {}),
    }));
  } catch {
    return base;
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const identity = await getCurrentIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const { userId, email: callerEmail } = identity;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: { select: { email: true } },
    },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  const isOwner = project.ownerId === userId;
  const isCollaborator = callerEmail
    ? project.collaborators.some((c) => c.email === callerEmail)
    : false;

  if (!isOwner && !isCollaborator) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const emails = project.collaborators.map((c) => c.email);
  const collaborators = await enrichEmails(emails);

  return Response.json({ collaborators });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const identity = await getCurrentIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const { userId } = identity;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const rawEmail: unknown = body?.email;
  if (typeof rawEmail !== "string" || !EMAIL_RE.test(rawEmail.trim())) {
    return Response.json({ error: "Valid email is required" }, { status: 400 });
  }
  const email = rawEmail.trim();

  if (identity.email?.toLowerCase() === email.toLowerCase()) {
    return Response.json({ error: "You are already the owner" }, { status: 409 });
  }

  try {
    await prisma.projectCollaborator.create({
      data: { projectId, email },
    });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return Response.json({ error: "Already a collaborator" }, { status: 409 });
    }
    throw err;
  }

  return Response.json({ success: true }, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const identity = await getCurrentIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;
  const { userId } = identity;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));
  const rawEmail: unknown = body?.email;
  if (typeof rawEmail !== "string" || !rawEmail.trim()) {
    return Response.json({ error: "email is required" }, { status: 400 });
  }
  const email = rawEmail.trim();

  await prisma.projectCollaborator.deleteMany({
    where: { projectId, email },
  });

  return new Response(null, { status: 204 });
}

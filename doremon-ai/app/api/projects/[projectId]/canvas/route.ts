import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { put, get } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { getProjectAccess } from "@/lib/project-access";

type RouteContext = { params: Promise<{ projectId: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getProjectAccess(projectId);
  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { canvasJsonPath: true },
  });

  if (!project?.canvasJsonPath) {
    return Response.json({ canvas: null });
  }

  const result = await get(project.canvasJsonPath, { access: "private" });
  if (!result || result.stream === null) {
    return Response.json({ canvas: null });
  }

  const canvas = await new Response(result.stream).json();
  return Response.json({ canvas });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const access = await getProjectAccess(projectId);
  if (!access) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const blob = await put(
    `projects/${projectId}/canvas.json`,
    JSON.stringify(body),
    { access: "private", contentType: "application/json", allowOverwrite: true }
  );

  await prisma.project.update({
    where: { id: projectId },
    data: { canvasJsonPath: blob.url },
  });

  return Response.json({ url: blob.url });
}

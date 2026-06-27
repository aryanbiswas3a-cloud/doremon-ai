import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { getLiveblocksClient, getUserColor } from "@/lib/liveblocks";
import { getProjectAccess } from "@/lib/project-access";

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const roomId: unknown = body?.room;
  if (typeof roomId !== "string" || !roomId.trim()) {
    return new Response("room is required", { status: 400 });
  }

  const projectId = roomId.trim();
  const access = await getProjectAccess(projectId);
  if (!access) {
    return new Response("Forbidden", { status: 403 });
  }

  const client = getLiveblocksClient();

  await client.getOrCreateRoom(projectId, {
    defaultAccesses: ["room:write"],
  });

  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || user.username || "Anonymous";
  const avatar = user.imageUrl ?? "";
  const color = getUserColor(user.id);

  const { status, body: responseBody } = await client.identifyUser(
    { userId: user.id, groupIds: [] },
    { userInfo: { name, avatar, color } }
  );

  return new Response(responseBody, { status });
}

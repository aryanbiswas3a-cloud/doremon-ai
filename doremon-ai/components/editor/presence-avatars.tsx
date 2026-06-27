"use client";

import { useOthers } from "@liveblocks/react";
import { useUser, UserButton } from "@clerk/nextjs";

const AVATAR_SIZE = 28;
const MAX_VISIBLE = 5;
const TRUSTED_AVATAR_HOSTS = ["img.clerk.com"];

function isTrustedAvatarUrl(url: string): boolean {
  try {
    return TRUSTED_AVATAR_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

function CollaboratorAvatar({
  name,
  imageUrl,
  color,
}: {
  name: string;
  imageUrl?: string;
  color: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      aria-label={name}
      title={name}
      style={{
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: "50%",
        overflow: "hidden",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 600,
        color: "#ffffff",
        flexShrink: 0,
        boxShadow: "0 0 0 2px var(--bg-base)",
      }}
    >
      {imageUrl && isTrustedAvatarUrl(imageUrl) ? (
        <img
          src={imageUrl}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

export function PresenceAvatars() {
  const { user } = useUser();
  const others = useOthers();

  const collaborators = others.filter((other) => other.id !== user?.id);
  const visible = collaborators.slice(0, MAX_VISIBLE);
  const overflow = collaborators.length - MAX_VISIBLE;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {visible.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            {visible.map((other, i) => (
              <div
                key={other.connectionId}
                style={{
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: MAX_VISIBLE - i,
                  position: "relative",
                }}
              >
                <CollaboratorAvatar
                  name={other.info?.name ?? "User"}
                  imageUrl={other.info?.avatar}
                  color={other.info?.color ?? "#6366f1"}
                />
              </div>
            ))}
            {overflow > 0 && (
              <div
                title={`+${overflow} more`}
                style={{
                  marginLeft: -8,
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: "50%",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  boxShadow: "0 0 0 2px var(--bg-base)",
                  zIndex: 0,
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                +{overflow}
              </div>
            )}
          </div>
          <div
            style={{
              width: 1,
              height: 18,
              backgroundColor: "var(--border-default)",
              flexShrink: 0,
            }}
          />
        </>
      )}
      <div style={{ pointerEvents: "auto" }}>
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

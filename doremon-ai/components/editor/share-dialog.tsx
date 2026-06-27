"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, UserMinus, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Collaborator {
  email: string;
  name: string | null;
  avatar: string | null;
}

interface ShareDialogProps {
  projectId: string;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({
  projectId,
  isOwner,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/project/${projectId}/collaborators`);
      if (res.ok) {
        const data = await res.json() as { collaborators: Collaborator[] };
        setCollaborators(data.collaborators);
      }
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      void fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/project/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      if (res.ok) {
        setInviteEmail("");
        await fetchCollaborators();
      } else {
        const data = await res.json() as { error?: string };
        setInviteError(data.error ?? "Failed to invite");
      }
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    await fetch(`/api/project/${projectId}/collaborators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    await fetchCollaborators();
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-[var(--border-default)] bg-[var(--bg-surface)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">
            Share project
          </DialogTitle>
        </DialogHeader>

        {isOwner && (
          <form onSubmit={(e) => void handleInvite(e)} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setInviteError(null);
              }}
              className="flex-1 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              disabled={inviteLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={inviteLoading || !inviteEmail.trim()}
              className="h-9 gap-1.5"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite
            </Button>
          </form>
        )}

        {inviteError && (
          <p className="text-xs text-red-400">{inviteError}</p>
        )}

        <div className="space-y-1">
          {loading ? (
            <p className="py-2 text-xs text-[var(--text-muted)]">Loading…</p>
          ) : collaborators.length === 0 ? (
            <p className="py-2 text-xs text-[var(--text-muted)]">
              No collaborators yet
            </p>
          ) : (
            <>
              <p className="mb-1 text-xs font-medium text-[var(--text-muted)]">
                Collaborators
              </p>
              {collaborators.map((c) => (
                <div key={c.email} className="flex items-center gap-2.5 py-1">
                  <CollaboratorAvatar
                    email={c.email}
                    name={c.name}
                    avatar={c.avatar}
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    {c.name && (
                      <span className="truncate text-sm text-[var(--text-primary)]">
                        {c.name}
                      </span>
                    )}
                    <span
                      className={
                        c.name
                          ? "truncate text-xs text-[var(--text-muted)]"
                          : "truncate text-sm text-[var(--text-primary)]"
                      }
                    >
                      {c.email}
                    </span>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleRemove(c.email)}
                      className="h-6 w-6 shrink-0 text-[var(--text-muted)] hover:text-red-400"
                      aria-label={`Remove ${c.email}`}
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        <div className="border-t border-[var(--border-default)] pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="w-full gap-2 border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
          >
            <Link2 className="h-3.5 w-3.5" />
            {copied ? "Copied!" : "Copy link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CollaboratorAvatar({
  email,
  name,
  avatar,
}: {
  email: string;
  name: string | null;
  avatar: string | null;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const display = name ?? email;
  const initials = display[0].toUpperCase();

  if (avatar && !imgFailed) {
    return (
      <img
        src={avatar}
        alt={display}
        className="h-7 w-7 shrink-0 rounded-full object-cover"
        onError={() => setImgFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-xs font-medium text-[var(--text-secondary)]">
      {initials}
    </div>
  );
}

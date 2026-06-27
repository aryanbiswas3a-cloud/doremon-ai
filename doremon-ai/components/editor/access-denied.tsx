import Link from "next/link";
import { Lock } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Lock className="h-8 w-8 text-[var(--text-muted)]" />
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Access denied
        </p>
        <p className="text-sm text-[var(--text-muted)]">
          This project doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Link
        href="/editor"
        className="text-sm text-[var(--accent-primary)] hover:underline"
      >
        Back to projects
      </Link>
    </div>
  );
}

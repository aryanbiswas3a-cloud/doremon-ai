"use client";

import { Show, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();

  return (
    <main>
      <Show when="signed-in" fallback={<p>Please sign in to continue.</p>}>
        <p>Welcome back, {user?.firstName ?? 'there'}!</p>
      </Show>
    </main>
  );
}

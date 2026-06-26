# Caching with Auth

**CRITICAL**: Cache keys MUST include userId/orgId to prevent data leaking between users.

## User-Scoped Cache

```typescript
import { auth } from '@clerk/nextjs/server';
import { cache } from 'react';

const cachedGetUserData = cache(async (id: string) => getUserData(id));

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) return <div>Not signed in</div>;

  const userData = await cachedGetUserData(userId);
  return <div>{userData.name}</div>;
}
```

## Revalidate After Updates

```typescript
'use server';
import { revalidateTag } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function updateProfile(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const name = formData.get('name');
  if (typeof name !== 'string' || !name) throw new Error('Invalid name');

  await db.users.update({
    where: { id: userId },
    data: { name },
  });
  revalidateTag(`user-${userId}`);
}
```

## Org-Scoped Cache

```typescript
export default async function OrgDashboard() {
  const { orgId } = await auth();
  if (!orgId) return <div>No organization selected</div>;

  const getOrgData = cache(async (id: string) =>
    db.orgData.findMany({ where: { organizationId: id } })
  );

  const orgData = await getOrgData(orgId);
  return <div>{orgData.length} items</div>;
}
```

[Docs](https://nextjs.org/docs/app/building-your-application/caching)

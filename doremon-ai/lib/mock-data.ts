export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-commerce Platform", slug: "e-commerce-platform", isOwner: true },
  { id: "2", name: "Auth Service", slug: "auth-service", isOwner: true },
  { id: "3", name: "Shared Design System", slug: "shared-design-system", isOwner: false },
];

# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 12: Shape Panel — Completed

## Current Goal

- None.

## Completed

- **12-shape-panel**: `types/canvas.ts` updated with `NodeShape` union type, `NodeColorPair` interface, `NODE_COLORS` (8 fill/text pairs), and `NODE_SHAPES` array. `components/editor/canvas-node.tsx` (client; custom `canvasNode` type renderer; bordered rectangle with centered label; 4 `Handle` components top/left/right/bottom, hidden by default, revealed on node group hover). `components/editor/shape-panel.tsx` (client; floating pill toolbar fixed at bottom-center of canvas; 6 draggable buttons with inline SVG icons; drag payload is JSON with `shape`, `width`, `height` under MIME type `application/doremon-shape`). `components/editor/canvas.tsx` refactored: `useLiveblocksFlow<Node, Edge>` with explicit generics to avoid `never` inference; wrapped in `ReactFlowProvider` + inner `CanvasFlow` component that calls `useReactFlow()` for `screenToFlowPosition`; `onDragOver`/`onDrop` on `<ReactFlow>`; drop handler reads payload, converts screen→canvas coords, creates a new `canvasNode` via `onNodesChange([{ type: "add", item: newNode }])`; node IDs formatted as `${shape}-${timestamp}-${counter}`; `nodeTypes` wired with `CanvasNodeComponent`. `npm run build` passes.
- **11-base-canvas**: `types/canvas.ts` defines `NodeData` (`label`, `color`, `shape`), `CanvasNode` (`Node<NodeData, "canvasNode">`), and `CanvasEdge` (`Edge<{}, "canvasEdge">`). `components/editor/canvas-wrapper.tsx` (client; `LiveblocksProvider` with `/api/liveblocks-auth`; `RoomProvider` with `initialPresence: { cursor: null, isThinking: false }`; class-based `LiveblocksErrorBoundary` with connection error message; `ClientSideSuspense` with loading state). `components/editor/canvas.tsx` (client; `useLiveblocksFlow` with suspense and empty initial nodes/edges; `ReactFlow` with `ConnectionMode.Loose`, `fitView`, `Cursors`, `MiniMap`, dot `Background`). `components/editor/workspace-shell.tsx` updated to replace canvas placeholder with `<CanvasWrapper roomId={project.id} />`. Installed `@liveblocks/react`, `@liveblocks/react-ui`, `@liveblocks/react-flow`, `@xyflow/react`. `npm run build` passes.
- **10-liveblocks-setup**: `liveblocks.config.ts` at repo root defines `Presence` (`cursor: { x, y } | null`, `isThinking: boolean`) and `UserMeta` (`id`, `info.name`, `info.avatar`, `info.color`). `doremon-ai/tsconfig.json` updated to include `"../liveblocks.config.ts"`. `@liveblocks/node` installed in `doremon-ai`. `lib/liveblocks.ts` exports `getLiveblocksClient()` (lazy singleton, avoids build-time init failure) and `getUserColor(userId)` (deterministic hash into 10-color palette). `app/api/liveblocks-auth/route.ts` (POST; requires Clerk session; reads `room` from body as project ID; returns 403 if `getProjectAccess` fails; calls `getOrCreateRoom` with `defaultAccesses: ["room:write"]`; issues ID token with `identifyUser` carrying name, avatar, and color). `npm run build` passes.
- **09-share-dialog**: `app/api/project/[projectId]/collaborators/route.ts` (GET lists collaborators enriched with Clerk display name and avatar via `clerkClient().users.getUserList`; POST invites by email, owner-only, rejects duplicates with 409; DELETE removes by email from request body, owner-only, uses `deleteMany`). `components/editor/share-dialog.tsx` (client; fetches collaborators on dialog open; owners see invite form + remove buttons; collaborators see list only; `CollaboratorAvatar` renders Clerk avatar image with initials fallback; Copy link button with 2 s "Copied!" feedback). `components/editor/workspace-shell.tsx` updated: Share button is now active and opens `ShareDialog`. `npm run build` passes.
- **08-editor-workspace-shell**: `lib/project-access.ts` (server-only; `getCurrentIdentity` returns `{ userId, email }` from Clerk; `getProjectAccess` checks owner or collaborator access and returns `ProjectAccess | null`). `components/editor/access-denied.tsx` (centered lock icon, message, link back to `/editor`). `components/editor/workspace-shell.tsx` (client; renders workspace header with project name, disabled Share button, AI sidebar toggle; canvas placeholder; collapsible right AI sidebar placeholder). `app/editor/[roomId]/page.tsx` (server component; redirects unauthenticated users to `/sign-in`; returns `AccessDenied` for missing or unauthorized projects; renders `WorkspaceShell` for authorized access). `components/editor/project-sidebar.tsx` updated: `usePathname()` extracts active project ID from the URL, passes `isActive` to each `ProjectItem`; project names are now `Link` elements navigating to `/editor/{id}`; active item gets bold text and persistent background highlight. `npm run build` passes.
- **07-wire-editor-home**: `lib/projects.ts` (server-only helper with `getProjectsForUser` using Clerk `auth` + `currentUser` for owned/shared queries; `ProjectSummary` interface). `lib/slug.ts` extracted with `toSlug` (client-safe). `hooks/use-project-dialogs.ts` replaced mock mutations with real fetch calls (`POST /api/projects` → navigate, `PATCH /api/project/[id]` → refresh, `DELETE /api/project/[id]` → redirect or refresh); accepts `ownedProjects`/`sharedProjects` props; generates a stable random suffix per dialog open for the room-id preview. `app/editor/layout.tsx` is now an async server component that calls `getProjectsForUser` and passes results to `EditorShell`. `EditorShell` accepts `ownedProjects`/`sharedProjects` and forwards them to the hook. `components/editor/new-project-button.tsx` is a small client component so `app/editor/page.tsx` can be a server component. Create dialog now shows `room:` preview. `npm run build` passes.
- **06-projects-api**: `app/api/projects/route.ts` (GET list, POST create) and `app/api/project/[projectId]/route.ts` (PATCH rename, DELETE delete). All routes authenticate via Clerk `userId`; unauthenticated requests return 401; ownership enforced on mutations with 403 for non-owners; missing project name defaults to "Untitled project"; IDs are Prisma-generated (no sequential override); DELETE returns 204 No Content.
- **05-prisma**: `prisma/models/project.prisma` created with `Project` and `ProjectCollaborator` models. `prisma.config.ts` updated to load `doremon-ai/.env.local` and expose the datasource URL. Migration `20260626120041_init` applied to Prisma Postgres. Client generated to `doremon-ai/app/generated/prisma`. `doremon-ai/lib/prisma.ts` exports a cached singleton that branches on `DATABASE_URL` — `prisma+postgres://` uses `accelerateUrl`, all other URLs use `@prisma/adapter-pg`. `npm run build` passes.
- **04-project-dialogs**: Editor home screen, Create/Rename/Delete project dialogs, sidebar project items with rename/delete actions, mobile backdrop scrim, `useProjectDialogs` hook for dialog/form/loading state, mock project data only.
- **01-design-system**: shadcn/ui installed and configured (Tailwind v4), UI primitives added (button, card, dialog, input, tabs, textarea, scroll-area), lucide-react installed, lib/utils.ts with cn() helper created, dark theme CSS variables defined in globals.css.
- **02-editor-chrome**: EditorNavbar and ProjectSidebar shell components created. Navbar is fixed-height with PanelLeftOpen/PanelLeftClose toggle. Sidebar floats above canvas (fixed position, does not push content), slides in from left via CSS transform, includes shadcn Tabs (My Projects / Shared) with empty placeholder states and a full-width New Project button.
- **03-auth**: Clerk auth fully wired. `@clerk/nextjs` and `@clerk/ui` installed. `ClerkProvider` wraps root layout with `dark` theme and CSS variable overrides. `proxy.ts` at project root uses protected-first strategy — all routes locked except `/sign-in` and `/sign-up` (read from env vars). Sign-in and sign-up pages use a two-column layout (logo + tagline left, Clerk form right; form-only on mobile). `app/page.tsx` redirects authenticated users to `/editor` and unauthenticated users to `/sign-in`. `UserButton` added to editor navbar right section.

## In Progress

- None.

## Next Up

- Nothing defined yet.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- Prisma v7 schema split: `prisma/schema.prisma` holds generator + datasource (provider only); models live in `prisma/models/project.prisma`. Connection URL moved to `prisma.config.ts` per Prisma v7 requirement. Prisma.config.ts loads `doremon-ai/.env.local` and normalizes `Database_URL` → `DATABASE_URL` for cross-platform safety.
- `PrismaClient` in v7 requires exactly one of `{ adapter }` or `{ accelerateUrl }` — no zero-arg constructor. The singleton uses `accelerateUrl` for `prisma+postgres://` and `@prisma/adapter-pg` for all other URLs.
- shadcn/ui initialized manually (components.json created by hand) because the CLI's interactive init prompt does not work in non-TTY environments. `npx shadcn@latest add` was used to scaffold all component files.
- "schoolarea" in 01-design-system.md was interpreted as shadcn's scroll-area component.
- tw-animate-css was not installed; animations can be added when needed by a specific feature.
- Dialog pattern (Feature 02): The existing shadcn Dialog, DialogHeader, DialogTitle, DialogDescription, and DialogFooter components already satisfy the pattern. All tokens are mapped in globals.css. No new dialog component was created.
- CSS token usage: Current chrome components reference design tokens via `var()` arbitrary values (e.g. `bg-[var(--bg-surface)]`). This deviates from `code-standards.md` and `ui-context.md`, which require utility names like `bg-base`, `text-brand`, `border-surface-border`. The arbitrary-value approach was a short-term workaround; components should be migrated to the standard utility names when next touched. See [[code-standards]] and [[ui-context]].
- Auth (Feature 03): In Next.js 16, middleware is renamed to Proxy — `proxy.ts` is the correct file name. Clerk's `ClerkProvider` appearance takes `theme` (not `baseTheme`) to apply a prebuilt theme. Clerk `Variables` uses `colorInput`/`colorInputForeground`/`colorForeground`/`colorMutedForeground` (not the older `colorInputBackground`/`colorText`/`colorTextSecondary`). `.env.local` must be at the project root, not inside `public/`.

## Session Notes

- components/ui/* files are generated and must not be modified directly.
- All shadcn tokens (--color-background, --color-primary, etc.) are mapped to the project's dark theme variables in globals.css via @theme inline.
- components/editor/* are project-level chrome components — safe to modify.

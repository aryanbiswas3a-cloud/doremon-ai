Add autosave and loading for the collaborative canvas so project state is persisted before adding AI generation Canvas JSON should be stored in Vercel Blob, and the saved blob URL should be stored on the Prisma project record.

## What to Install

- `@vercel/blob`

## Implementation

1. Check the existing project schema.
   - review `prisma/model/project.prisma`
   - add or reuse a field for the canvas blob URL
   - keep Prisma responsible for metadata only

2. Add canvas save/load API routes.
   Create: `PUT /api/projects/[projectId]/canvas`
   This route should:
   - require Clerk authentication via `auth()` — return 401 if no userId
   - verify the authenticated user has access to the Prisma project record via `getProjectAccess(projectId)` — return 404 if not found
   - receive the latest canvas JSON
   - upload the JSON to Vercel Blob
   - store the returned blob URL on the matching Prisma project record

   Create: `GET /api/projects/[projectId]/canvas`
   This route should:
   - require Clerk authentication via `auth()` — return 401 if no userId
   - verify the authenticated user has access to the Prisma project record via `getProjectAccess(projectId)` — return 404 if not found
   - read the project’s saved blob URL from Prisma
   - fetch the saved canvas JSON from Vercel Blob
   - return the canvas state to the editor

   These endpoints are not public. Both routes must authenticate with Clerk and confirm project access before reading or writing any canvas data.

3. Add an autosave hook in the `/hook` folder.
   - watch the canvas nodes and edges
   - debounce saves to avoid excessive writes
   - save through the canvas API route
   - track save status: saving, saved, error

4. Load saved canvas state in the editor.
   - when the editor loads, check if the Liveblocks room has any existing nodes or edges
   - if the room is empty and the project has a saved canvas blob URL, fetch and load the saved canvas state
   - if the room already has nodes or edges, skip the load entirely to avoid overwriting active collaboration

5. Add a small save status indicator in the editor Save button.
   - show saving, saved, or error states

## Storage Pattern

- Prisma stores project metadata and the canvas blob URL.
- Vercel Blob stores the actual canvas JSON.

## Check When Done

- `@vercel/blob` is installed.
- Project schema supports storing the canvas blob URL.
- Save/load routes use Prisma for metadata and Vercel Blob for canvas JSON.
- Autosave hook debounces canvas saves.
- Editor shows save status.
- Saved canvas does not load if the room already has
  active nodes or edges
- `npm run build` passes.

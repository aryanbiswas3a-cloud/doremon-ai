The database schema is ready. Build a backend project API routes only. 

### Routes

Create REST Endpoints for:

- `GET/api/projects`, list current user's project
- `Push/api/projects`, Create project
- `Patch/api/project/[projectId]`, Rename project. 
- `Delete/api/project/[projectId]`, Delete project. 

## Rules

Use the Authentication Clerk User ID as `OwnerID`. 

when creating:

- Default missing project name to "untitled project". 
- Use the schema's existing ID strategy. Do not add Sequential in the IDs. 

Security:

- unauthenticed request return `401`.
- Only the project owners can rename or delete. 
- Non honored multition return `403`.

Keep this backend only. Do not wire the UI yet. 


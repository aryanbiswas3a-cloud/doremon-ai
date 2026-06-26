Prisma is already installed at the project data models. Prisma client singleton and first migration.

### Models

create `prisma/models/project.prisma`.

add `project`:

- owner ID mapped to clerk user 
- name
- optional description
- status enum: `Draft`, `ARCHIVED`
- `CanvasJSONPath` For future Canvas blog Storage 
- timestamps
- indexes on owner ID and creation data 

Do not add extra films unless required by Prisma. 

add `proectcollaborator`:

- Project relation with cascade delete
- Collaborative emails 
- Create timestamp 
- Unique constraint on project/email.
- Index is on email and project/data.


Do not add extra fields unless required by Prisma. 



### prisma client

create `lib/prisma.ts` as a cached singleton.

branch by `DATABASE_URL`:

- If it starts with `Prisma+Progress://`,Use Accelerate. 
- Otherwise, she was direct`@prisma/adapter-pg`

Catch the client on `global` in development for hot reloads. 

## MIGRATION

Run the migration and generate the client. 

## dependences

Already installed:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

## check when done

- Schema has both models with correct relations and indexes. 
- `lib/prisma.ts` Exports one caught Prisma instance 
- Migration run successfully. 
- `npm run build` passes
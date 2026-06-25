1.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In @.agents/skills/clerk-nextjs-patterns/evals/evals.json around lines 45 - 54,
The middleware eval currently makes only / and /sign-in public, but /sign-up
must also remain public for onboarding. Update the middleware in the
clerkMiddleware/createRouteMatcher setup to add /sign-up to the public routes
list while keeping auth.protect() for all other routes, and ensure the existing
clerkMiddleware wrapper and protection for /dashboard subroutes remain
unchanged.

2.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In @.agents/skills/clerk-nextjs-patterns/references/api-routes.md around lines
40 - 47, The GET route handler is treating route params synchronously, but in
Next.js 15 `params` is a Promise. Update the handler signature to use a promised
params type in the GET function and await it before reading `orgId`, replacing
any direct `params.orgId` access with the awaited value; use the existing GET
handler and auth/db flow as the place to apply the change.

3.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In @.agents/skills/clerk-nextjs-patterns/evals/evals.json around lines 70 - 79,
The manual JWT eval is missing issuer/audience binding, so it can still accept a
valid signature from the wrong Clerk app or tenant. Update the eval in the
evals.json entry for the standalone Node.js API prompt by expanding the
expected_output/assertions to require validation of iss and aud (or Clerk’s
equivalent app-binding claim) in addition to signature, exp, and nbf checks.
Make sure the assertions explicitly reject tokens with mismatched issuer or
audience and still keep the 401 behavior for invalid tokens.

4.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In @.agents/skills/clerk-nextjs-patterns/references/caching-auth.md around lines
33 - 40, The updateProfile action is persisting formData.get('name') with only a
type assertion, which can still be null or a File at runtime. In updateProfile,
validate the retrieved name value before calling db.users.update, and only pass
a confirmed string after checking it is present and of the expected type;
otherwise reject the request or return an error.

5.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In @.claude/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/proxy.ts
around lines 1 - 10, The proxy setup only calls clerkMiddleware(), which injects
Clerk context but does not actually enforce access control on the matched
routes. Update the proxy.ts template to use createRouteMatcher with
auth.protect() inside the middleware, or define an explicit public-route
allowlist and protect the remaining routes, so paths like /, /api, and /trpc are
authenticated rather than public.

6.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
@.claude/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/tsconfig.json
around lines 17 - 19, The tsconfig path alias is pointing to the wrong tree for
this template: `@/*` currently resolves to `./src/*`, but the scaffold uses a
root-level `app/` layout. Update the `paths` mapping in `tsconfig.json` so `@/`
targets the actual template structure, and keep the alias consistent with how
the rest of the Next.js basic auth scaffold imports modules.

7.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@doremon-ai/app/layout.tsx` around lines 28 - 52, The root layout currently
wraps <html> with ClerkProvider, which should instead live inside the body so
<html> and <body> remain the outermost nodes. Update the layout component by
moving ClerkProvider from around the entire document to inside the <body>
element in app/layout.tsx, keeping the existing appearance props unchanged and
preserving the html/body structure.

8.Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@doremon-ai/app/sign-up/`[[...sign-up]]/page.tsx around lines 24 - 60, The
sign-up page layout in the page component uses a fixed `h-screen` shell and
vertically centered content, which can clip the form on short viewports and
mobile keyboards. Update the main wrapper and the right-side container around
`SignUp` so the page can expand naturally and scroll when the Clerk form grows.
Keep the left branding panel behavior intact, but make the form column use
flexible/min-height sizing instead of hard centering that prevents access to
lower fields and controls.
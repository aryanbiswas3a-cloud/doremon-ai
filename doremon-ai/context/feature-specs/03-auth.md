Clerk is already installed and connected .Wire it into next.js app: provider of pages, redirects, route, production, and user manu.

### Design 

Use clerk's `dark` theme from `@clerk/ui/themes`as the base.

Override clerk appearance variables using the app's existing CSS variables. Do not hardcode colors. 

### Sign-in and sign-out pages 

- Large screen, simple layout
- left compared logo and tagline, short text only, feature list 
- right centered Clerk form
-  small screens;form only only
- no gradients, 
- no oversized hero section,
- no feature cards, 
- no scroll-heavy layout

Keep the layout minimal and professional. 

### Implementation 

Wrap the root Layout with `ClerkProvider` using clerk `dark` theme.

Create Sign In and Sign Up Pages using Clerk Components. 

Use `proxy.ts` at the project root, not `middleware.ts`. 

Define public routes using the existing sign-in and sign-up env vars to protect everything else by default. 

update `/`:

- Authenticated user direct to `/editor`
- Unauthenticated user direct to `/sign-in`

Add Clerk's built-in `userbutton` to the editor navbar right section for Profile setting and lagout.

Keep Clerk default user menu and profile flow intact. Do not rebuild heavily customized Clerk internals. 

Use existing clerk env vars. to not rename or reinvent new ones. 

### Dependencies

install: @clerk/ui

### check when done

- `Proxy.ts` exists at the root. 
- All routes are protected except public auth paths. 
- Auth pages use CSS variables with no hardcoded color. 
- Clerk provider wraps the root. 
- `npm run build`will pass. 


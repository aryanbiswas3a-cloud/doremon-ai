# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Feature 02: Editor Chrome — Completed

## Current Goal

- Define the immediate implementation goal here.

## Completed

- **01-design-system**: shadcn/ui installed and configured (Tailwind v4), UI primitives added (button, card, dialog, input, tabs, textarea, scroll-area), lucide-react installed, lib/utils.ts with cn() helper created, dark theme CSS variables defined in globals.css.
- **02-editor-chrome**: EditorNavbar and ProjectSidebar shell components created. Navbar is fixed-height with PanelLeftOpen/PanelLeftClose toggle. Sidebar floats above canvas (fixed position, does not push content), slides in from left via CSS transform, includes shadcn Tabs (My Projects / Shared) with empty placeholder states and a full-width New Project button.

## In Progress

- None.

## Next Up

- Add the next planned feature unit here.

## Open Questions

- Add unresolved product or implementation questions here.

## Architecture Decisions

- shadcn/ui initialized manually (components.json created by hand) because the CLI's interactive init prompt does not work in non-TTY environments. `npx shadcn@latest add` was used to scaffold all component files.
- "schoolarea" in 01-design-system.md was interpreted as shadcn's scroll-area component.
- tw-animate-css was not installed; animations can be added when needed by a specific feature.
- Dialog pattern (Feature 02): The existing shadcn Dialog, DialogHeader, DialogTitle, DialogDescription, and DialogFooter components already satisfy the pattern. All tokens are mapped in globals.css. No new dialog component was created.
- CSS token usage: Project design tokens (--bg-surface, --border-default, etc.) are referenced via `var()` arbitrary values in Tailwind classes rather than generated utility names, to avoid any Tailwind v4 utility resolution ambiguity.

## Session Notes

- components/ui/* files are generated and must not be modified directly.
- All shadcn tokens (--color-background, --color-primary, etc.) are mapped to the project's dark theme variables in globals.css via @theme inline.
- components/editor/* are project-level chrome components — safe to modify.

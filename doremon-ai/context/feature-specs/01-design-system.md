READ 'AGENTS.md' before starting.

Adding the design system and UI primitive component 

Install and configure 'shadcn/ui'.

Add this shadcn in components. 
- button
- card
- dialog
- input
- tabs
- textarea
- scroll-area

Do not modify generated 'components/ui/*' files after installation. 

Also install 'lucide-react'.

create 'lib/utils.ts' with our reusable 'cn()' helper for merging Tailwind classes.

Ensure all components match the existing dark theme in 'globals.css'.

# check when done

- All components import without errors.
- 'cn()' works properly.
- No broken styling or missing tokens.

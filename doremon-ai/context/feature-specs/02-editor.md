We need the base Chrome components that frame every Editor screen: the top navbar and left sidebar shell. This will be re-used and extended in every chapter that follows. 

### editor navbar

create 'components/editor/editor-navbar.tsx

Requirements:

- fixed-height top navbar
- left Center and right section 
- Left section contains the sidebar toggle button. 
- use 'panelLeftOpen, / 'panelLeftClose' icons based on sidebar state.
- The right section stays empty for now. 
- Dark background with subtle button border.



### Project Sidebar 

create 'components/editor/project-sidebar.tsx',

Requirement:

- Slide bar should float above the edited canvas.
- Opening it should not push page content.
- Slides in from the left. 
- accepts 'isOpen' prop
- Header with 'projects' title + close button 
- shadcn 'tabs';
    - My project 
    - shared
- Both tabs show  empty placeholder state. 
- Full-width 'New project' Button at the bottom with 'plus' icon 

### Dialog pattern

Use the existing color token from 'global.css' from dialog styling.
- Support Title,
- Description,
- footer actions.

 Do not build actual dialog yet. 

### Check when done

 - New components compile without TypeScript errors.
 - No lint errors.
 - Dialog pattern is ready for future use. 
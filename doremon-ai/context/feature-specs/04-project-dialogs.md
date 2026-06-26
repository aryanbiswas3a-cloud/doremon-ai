### Goal

build the `/editor` home screen and add projectdialogs/sidebar action. no api calls or persistance yet.

## Editor Home

Reuse the existing Editor Layout. Do not modify the navbar or sidebar behavior. 

In the center of a page add:

- Heading: `Create a project or open an existing one`
- Description : `Start a new architecture workspace or choose a project from the sidebar`. 
- `new project` Button with a plus icon.


Keep the layout minimal. Do not wrap this content in cards.

 Clicking "New Project" should open the create project dialog. 

 ## dialogs

 ### Create project 

 - Project name input 
 - live slung preview based on the name. 
 - Preview update as a user type. 

 ### rename Project 

 - prefilled project input 
 - Current project name: show in the description. 
 - Input Auto Focuses
 - Enter Submit 

 ### Delete Project 

 - Destructive confirmation only 
 - No input 
 - Confirm button uses destructive styling. 

 ### Sidebar 

 Add project item action 

 - rename 
 - Delete 

 Show access only for owned project. 

 Hide action from for shared/collaborator Project.

 On mobile:

 - Tapping outside the side bar, closing it 
 - Add a backdrop scrim.

### Implementation 

Create a dedicated hook to manage:

- DIALOGUE STATE 
- Form state 
- Loading state

wire:

- Editor home `new project` =>create dialog 
- Sidebar create =>Create dialog 
- Sidebar rename =>rename dialog
- Sidebar delete =>Delete dialog

Use Mooc Project Data only. Do not add API calls or persistence. 

### Check went done 
- Sidebar actions are wired.
- Slug Preview Works.
- No TypeScript error 
- No lint errors. 
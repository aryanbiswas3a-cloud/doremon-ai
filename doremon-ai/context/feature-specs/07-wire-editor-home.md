Wire the editor home sidebar and dialog to the real project API. 

### Data Fetching 

The editor home page is a server component. 

fetch owned and share project server-site using existing project data helper, and pass both lists to the sidebar. 

No client-side caching for Initial load 

### `Use Project actions`

Create a hook in `hooks/` manages dialog state and project mutations. 

***create***

- Manage Create dialog state. 
- Manage Project Name Input 
- Generate a short unique suffix. 
- Slugify the need to create a room ID. 
- call `post /api/project`
- Navigate to the new workspace. 

The project ID and live blocks room ID should stay aligned. 

***Rename***

- store Target project id + current name 
- Call `Patch/api/project/[id]`
- Refresh on success 

***Delete***

- Store target project 
- call`Delete /api/project/[id]`
- redirect to `/editor` If deleting the active workspace.
- Otherwise, refresh. 

### wiring 

Connect the hook to the sidebar and dialogs. 

- Create dialog, shows room, id preview .
- Rename dialog pre-fills current name. 
- Delete dialog shows project name. 


### check when done 

- Create future real project data. 
- Create navigates to workspace. 
- Rename update correctly. 
- Deleter fashis or redirects Correctly 
- `npm run build` passes
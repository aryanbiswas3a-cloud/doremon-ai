Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@doremon-ai/components/editor/canvas-edge.tsx` around lines 93 - 96, The edge
rename flow in canvas-edge.tsx is only reachable through the
non-keyboard-friendly onDoubleClick handler, so make the edge label/trigger
focusable and wire keyboard activation (for example Enter/F2) to startEditing
alongside the existing mouse path. Update the relevant edge
interaction/rendering in the canvas-edge component so the rename affordance
behaves like a button for keyboard users, and add an accessible name to the
editor input with an aria-label when it opens. Keep the same editing behavior,
but expose it through the trigger and editor elements referenced by startEditing
and the edge label rendering around the existing double-click handling.



Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@doremon-ai/components/editor/canvas-node.tsx` around lines 66 - 88, The color
swatch buttons in canvas-node.tsx are unnamed icon-only controls, so update the
swatch button rendering to include an accessible label for each pair.fill option
and expose the current selection with aria-pressed (or an equivalent
selected-state attribute) based on isActive. Keep the existing
click/updateNodeData behavior intact while ensuring each swatch’s accessible
name reflects its color and the active swatch is announced as selected.


Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@doremon-ai/components/editor/canvas-node.tsx` around lines 156 - 177, Node
renaming is currently only triggered by mouse double-click on the label, so
keyboard and screen-reader users cannot start editing reliably. Update the label
overlay in canvas-node.tsx around startEditing/handleKeyDown so the non-editing
trigger is focusable and can open editing via keyboard (for example from
Enter/Space), and ensure the contentEditable editor exposes proper textbox
semantics with role="textbox" and an accessible name tied to the node label.
Keep the existing editing flow intact while making both the trigger and editable
surface reachable without a mouse.
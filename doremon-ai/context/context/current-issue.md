This is an issue in my local host popping up. 
 Runtime Error



./doremon-ai/components/editor/canvas-wrapper.tsx:65:1
Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
  63 |     </LiveblocksProvider>
  64 |   );
> 65 | }
     | ^
  66 |

Parsing ecmascript source code failed

Import traces:
  Client Component Browser:
    ./doremon-ai/components/editor/canvas-wrapper.tsx [Client Component Browser]
    ./doremon-ai/components/editor/workspace-shell.tsx [Client Component Browser]
    ./doremon-ai/components/editor/workspace-shell.tsx [Server Component]
    ./doremon-ai/app/editor/[roomId]/page.tsx [Server Component]

  Client Component SSR:
    ./doremon-ai/components/editor/canvas-wrapper.tsx [Client Component SSR]
    ./doremon-ai/components/editor/workspace-shell.tsx [Client Component SSR]
    ./doremon-ai/components/editor/workspace-shell.tsx [Server Component]
    ./doremon-ai/app/editor/[roomId]/page.tsx [Server Component]
Call Stack
7

Show 5 ignore-listed frame(s)
<unknown>
error: ./doremon-ai/components/editor/canvas-wrapper.tsx (65:1)
<unknown> (Error:
./doremon-ai/components/editor/canvas-wrapper.tsx (65:1)
1
2

---
title: vim
order: 20
icon: edit
---

# vim

Modal text editor. Most commands work in normal mode unless noted.

## Modes

:::entries
i                     >>  Insert before cursor
I                     >>  Insert at start of line
a                     >>  Append after cursor
A                     >>  Append at end of line
o                     >>  Open new line below
O                     >>  Open new line above
v                     >>  Visual mode (character)
V                     >>  Visual mode (line)
Ctrl+v                >>  Visual mode (block)
Esc                   >>  Return to normal mode
:                     >>  Command mode
:::

## Motion

:::entries
h j k l               >>  Left, down, up, right
w / W                 >>  Word forward (W = WORD)
b / B                 >>  Word backward
e / E                 >>  End of word
0                     >>  Start of line
^                     >>  First non-blank of line
$                     >>  End of line
gg                    >>  First line of file
G                     >>  Last line of file
:n                    >>  Jump to line n
Ctrl+u / Ctrl+d       >>  Half-page up / down
Ctrl+b / Ctrl+f       >>  Full page up / down
%                     >>  Matching bracket
{ / }                 >>  Previous / next paragraph
:::

## Editing

:::entries
x                     >>  Delete character under cursor
dd                    >>  Delete line
dw                    >>  Delete word
d$                    >>  Delete to end of line
yy                    >>  Yank (copy) line
yw                    >>  Yank word
p                     >>  Paste after cursor
P                     >>  Paste before cursor
u                     >>  Undo
Ctrl+r                >>  Redo
.                     >>  Repeat last change
r                     >>  Replace single character
cw                    >>  Change word
cc                    >>  Change line
:::

## Search and replace

:::entries
/pattern              >>  Search forward
?pattern              >>  Search backward
n / N                 >>  Next / previous match
*                     >>  Search word under cursor (forward)
#                     >>  Search word under cursor (backward)
:%s/old/new/g         >>  Replace all in file
:%s/old/new/gc        >>  Replace all with confirm
:s/old/new/g          >>  Replace all on current line
:::

## Files and buffers

:::entries
:w                    >>  Save
:w filename           >>  Save as
:q                    >>  Quit
:q!                   >>  Quit without saving
:wq                   >>  Save and quit
:x                    >>  Save and quit (only if changed)
:e file               >>  Edit file
:bn / :bp             >>  Next / previous buffer
:bd                   >>  Close buffer
:ls                   >>  List buffers
:::

## Windows and tabs

:::entries
Ctrl+w s              >>  Split horizontally
Ctrl+w v              >>  Split vertically
Ctrl+w h j k l        >>  Move between splits
Ctrl+w c              >>  Close split
Ctrl+w o              >>  Close all other splits
:tabnew               >>  New tab
gt / gT               >>  Next / previous tab
:::

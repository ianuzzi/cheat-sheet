---
title: tmux
order: 10
icon: terminal
---

# tmux

Terminal multiplexer. The prefix is `Ctrl+B` by default; everything below assumes you press the prefix first unless noted.

## Sessions

::: entries
tmux                  >>  Start a new session
tmux new -s name      >>  Start a named session
tmux attach           >>  Attach to the most recent session
tmux attach -t name   >>  Attach to a named session
tmux ls               >>  List sessions
tmux kill-session -t name  >>  Kill a named session
Ctrl+B d              >>  Detach from current session
Ctrl+B s              >>  List sessions interactively
Ctrl+B $              >>  Rename current session
:::

## Windows

::: entries
Ctrl+B c              >>  Create a new window
Ctrl+B ,              >>  Rename current window
Ctrl+B &              >>  Close current window
Ctrl+B n              >>  Next window
Ctrl+B p              >>  Previous window
Ctrl+B 0...9          >>  Switch to window by number
Ctrl+B w              >>  List windows interactively
Ctrl+B f              >>  Find window by name
:::

## Panes

::: entries
Ctrl+B %              >>  Split pane vertically
Ctrl+B "              >>  Split pane horizontally
Ctrl+B o              >>  Cycle through panes
Ctrl+B ;              >>  Toggle last active pane
Ctrl+B x              >>  Close current pane
Ctrl+B z              >>  Toggle pane zoom
Ctrl+B Space          >>  Cycle pane layouts
Ctrl+B {              >>  Move pane left
Ctrl+B }              >>  Move pane right
Ctrl+B Arrow          >>  Move focus to pane in arrow direction
Ctrl+B q              >>  Show pane numbers (press number to jump)
:::

## Copy mode

::: entries
Ctrl+B [              >>  Enter copy mode
Space                 >>  Begin selection (in copy mode)
Enter                 >>  Copy selection and exit
Ctrl+B ]              >>  Paste most recent buffer
Ctrl+B =              >>  Choose buffer to paste
:::

## Misc

::: entries
Ctrl+B ?              >>  List all keybindings
Ctrl+B :              >>  Command prompt
Ctrl+B t              >>  Show clock
:::

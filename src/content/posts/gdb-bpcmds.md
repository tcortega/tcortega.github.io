---
title: "TIL: gdb can hook commands onto breakpoints"
name: "til — gdb can hook a command list onto a breakpoint, so it does the poking for you"
author: unstripped
pubDatetime: 2026-06-09T12:00:00Z
description: "gdb breakpoint commands can run a script every hit — dump registers, continue, and leave you the log."
category: til
tags:
  - gdb
  - debugging
---

You already know breakpoints stop the inferior. Less obvious: gdb will run a
list of commands *for you* every time one hits, then continue without waiting.

```bash title="gdb"
(gdb) break *0x401234
(gdb) commands
Type commands for breakpoint(s) 1, one per line.
End with a line saying just "end".
>silent
>printf "hit rax=%p\n", $rax
>continue
>end
```

`silent` keeps the usual "Breakpoint 1, ..." spam off the terminal. Pair it with
`commands` on a hardware watchpoint when a protector rewrites its own code and
you only care about the moment a flag flips.

---
title: "Anti-debug bingo: PEB.BeingDebugged & friends"
author: unstripped
pubDatetime: 2026-05-21T12:00:00Z
description: "The PEB flags every protector checks first, and how they look from a static dump."
category: re
tags:
  - anti-debug
  - peb
  - windows
---

Before Themida's VM, before a timing loop, almost every Windows protector reads
the Process Environment Block. The field names are stable; the access patterns
are not.

## The usual suspects

| Field | Offset (x64) | Meaning |
|---|---|---|
| `BeingDebugged` | `0x02` | Set when a debugger is attached |
| `NtGlobalFlag` | `0xBC` | Heap debug flags when started under a debugger |
| `ProcessHeap.Flags` | via heap | Similar heap-debug residue |

```asm title="peb-check.asm"
mov   rax, gs:[0x60]      ; PEB
cmp   byte ptr [rax+2], 0 ; BeingDebugged
jne   anti_debug_path
```

## Static reading tip

If you only have a dump, look for `gs:[60h]` / `fs:[30h]` loads followed by a
byte compare against offset `+2`. That is almost always `BeingDebugged`, not a
clever custom structure.

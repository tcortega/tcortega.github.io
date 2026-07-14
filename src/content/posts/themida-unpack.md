---
title: "Unpacking a Themida binary without a debugger"
name: "themida-unpack — reconstruct a Themida-protected binary's original entry point and imports, statically"
author: unstripped
pubDatetime: 2026-06-28T12:00:00Z
description: "Reconstruct a Themida-protected binary's OEP and import table without running the unpacking stub."
category: re
synopsis: "themida-unpack [--no-vm] [--rebuild-iat] target.exe"
tags:
  - themida
  - unpacking
  - iat
  - oep
---

Themida wraps a program in layers of virtualization, mutation and anti-analysis.
The usual advice is to run it, wait for the unpacking stub to hand control to the
real code, then dump memory. That works — until the target notices it is being
watched. This note takes the opposite route: reconstruct the original binary
*without* ever letting it execute.

The payoff is a sample you can analyse in a disassembler with a real import table
and a sane entry point, and a process that never got to run its timing checks.

## Why not just dump it live?

Because the stub is looking back at you. Themida fingerprints debuggers through
`PEB.BeingDebugged`, timing deltas around `rdtsc`, and a VM that will happily
branch into garbage if a flag looks off. Every one of those checks is dead weight
if the code never executes.

## Locating the OEP

The tail of the stub is a tail-jump into the original entry point. Find the last
transfer that lands inside the first section and you have your OEP candidate.
In this sample the stub reg-relative jump resolves the classic compiler prologue:

```text title="hexdump · .text @ oep"
00401000  55 8b ec 83 ec 20 53 56  57 e8 00 00 00 00 5d 81
00401010  ed 05 10 40 00 8d 85 7c  ff ff ff 50 ff 15 04 60
00401020  40 00 85 c0 74 09 68 e8  03 00 00 e8 3a 00 00 00
```

`55 8b ec` — `push ebp; mov ebp, esp` — is the fingerprint of a real function
start, not stub scaffolding. Set the entry point here and rebase.

## Rebuilding the IAT

Themida redirects each import through a per-API stub, so the on-disk thunks point
at the protector, not at the real function. Walk the thunk table, follow each
redirector to its resolved target, and name it. A first pass in IDAPython:

```python title="rebuild_iat.py"
# walk the thunk table, resolve Themida's redirectors
for ea in thunks(0x00460000, 0x004603F0):
    tgt = resolve_stub(get_wide_dword(ea))   # follow the jump chain
    idc.create_dword(ea)
    idc.op_plain_offset(ea, 0, 0)
    set_name(tgt, import_name(tgt))          # kernel32_CreateFileW, ...
```

## What still breaks

- Virtualized functions stay virtualized — static recovery gives you the CFG, not the devirtualized source.
- TLS callbacks run before the entry point; check the directory or you will miss init code.
- Relocations are stripped from packed sections; if you rebase, fix them by hand or the IAT drifts.

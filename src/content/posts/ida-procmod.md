---
title: "Writing your first IDA processor module"
name: "ida-procmod — writing your first IDA processor module"
author: unstripped
pubDatetime: 2026-05-30T12:00:00Z
description: "Skeleton of an IDA processor module: register the arch, feed the decoder, and stop guessing at unknown opcodes."
category: tut
synopsis: "ida-procmod init [--sdk=9] name"
tags:
  - ida
  - processor-module
  - tutorial
---

IDA ships decoders for the arches you already know. The day you meet a custom
DSP or a game's VM bytecode, you write a processor module.

## Minimal surface

A processor module is three things:

1. A register / segment description
2. An instruction decoder (`ana`)
3. An emitter that turns decoded ops into IDA's internal insn form (`emu` + `out`)

```c title="ana.cpp"
int idaapi ana(insn_t *insn) {
  uchar op = get_byte(insn->ea);
  insn->itype = decode_op(op);
  insn->size = 1;
  return insn->size;
}
```

Start with linear decode and a flat address space. Fancy delay slots and
banked registers can wait until the listing is readable.

## Checklist

- Register every mnemonic you emit, or auto-analysis will treat them as data
- Mark call / ret / jump carefully — the xref graph is only as good as your flags
- Ship a small sample binary with the module so future-you can retest after SDK bumps

# Custom Shiki/TextMate grammars

Languages registered with Expressive Code in `ec.config.mjs` because the Shiki
bundle does not ship them.

## `armasm.tmLanguage.json` — ARM assembly

- **Source:** [dan-c-underwood/vscode-arm](https://github.com/dan-c-underwood/vscode-arm) (`syntaxes/arm.tmlanguage.json`)
- **License:** MIT
- **scopeName:** `source.arm`
- Registered with `name: "armasm"` (alias `arm`) so posts can use ` ```armasm ` fences.

To update, re-download the upstream file into this directory under the same name.

## Fallbacks (no reliable grammar)

- **Hex dumps:** no mainstream TextMate grammar exists — use a plain ` ```text `
  (or ` ```ansi `) fence.
- **x86 / NASM-style:** use ` ```asm ` (bundled); ` ```nasm ` and ` ```x86asm `
  are aliased to it in `ec.config.mjs`.

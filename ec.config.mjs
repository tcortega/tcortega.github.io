import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginCollapsibleSections } from "@expressive-code/plugin-collapsible-sections";
import { readFileSync } from "node:fs";

// ARM assembly TextMate grammar — Shiki bundles no ARM grammar.
// Source: github.com/dan-c-underwood/vscode-arm (MIT). See src/grammars/README.md.
const armGrammar = JSON.parse(
  readFileSync(
    new URL("./src/grammars/armasm.tmLanguage.json", import.meta.url),
    "utf8"
  )
);

export default defineEcConfig({
  // Dual themes matching AstroPaper's Shiki palette. Both are bundled Shiki
  // themes, so no extra install. min-light.type === "light", night-owl.type === "dark".
  themes: ["min-light", "night-owl"],

  // AstroPaper toggles <html data-theme="light|dark">. EC's default selector
  // keys off the theme *name* ([data-theme="min-light"]) which would never
  // match — key off the theme *type* instead so EC switches with the toggle.
  themeCssSelector: theme => `[data-theme='${theme.type}']`,
  // AstroPaper drives the theme explicitly via a pre-paint script; don't let EC
  // also react to the OS prefers-color-scheme media query (they would fight).
  useDarkModeMediaQuery: false,

  defaultProps: {
    // The line-numbers plugin is ON by default — make it opt-in per block
    // with ```lang showLineNumbers.
    showLineNumbers: false,
    wrap: false,
  },

  // Frames (editor + terminal window chrome) and text/line markers are built in
  // and enabled by default. Keep EC's own copy button (AstroPaper's was removed).
  frames: {
    showCopyToClipboardButton: true,
  },

  // Align EC's chrome with AstroPaper design tokens.
  styleOverrides: {
    borderColor: "var(--border)",
    borderRadius: "0.375rem",
    codeFontFamily: "var(--font-google-sans-code)",
    uiFontFamily: "var(--font-google-sans-code)",
  },

  // Reverse-engineering languages. 'asm' is bundled (x86/x86-64 NASM-style);
  // alias the common dialects onto it. ARM has no bundled grammar, so register
  // the custom one — usable as ```armasm or ```arm.
  shiki: {
    langAlias: {
      nasm: "asm",
      x86asm: "asm",
    },
    langs: [{ ...armGrammar, name: "armasm", aliases: ["arm"] }],
  },

  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
});

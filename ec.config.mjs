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
  // Warm light + dark pair that sits near the paper/ink palette.
  themes: ["rose-pine-dawn", "rose-pine-moon"],

  // unstripped toggles <html data-theme="light|dark">.
  themeCssSelector: theme => `[data-theme='${theme.type}']`,
  useDarkModeMediaQuery: false,

  defaultProps: {
    showLineNumbers: false,
    wrap: false,
  },

  frames: {
    showCopyToClipboardButton: true,
  },

  styleOverrides: {
    borderColor: "var(--panel-line)",
    borderRadius: "6px",
    codeFontFamily: "var(--font-ibm-plex-mono)",
    uiFontFamily: "var(--font-ibm-plex-mono)",
    frames: {
      frameBoxShadowCssValue: "none",
      editorBackground: "var(--panel)",
      terminalBackground: "var(--panel)",
      editorTabBarBackground: "var(--panel)",
      editorActiveTabBackground: "var(--panel)",
      terminalTitlebarBackground: "var(--panel)",
      // Header reads as a flat listing bar (like the unstripped hexdump header):
      // a hairline divider under a muted title, no tab indicator or window dots.
      editorTabBarBorderBottomColor: "var(--panel-line)",
      editorActiveTabBorderColor: "transparent",
      editorActiveTabIndicatorTopColor: "transparent",
      editorActiveTabIndicatorBottomColor: "transparent",
      editorActiveTabForeground: "var(--muted)",
      terminalTitlebarBorderBottomColor: "var(--panel-line)",
      terminalTitlebarForeground: "var(--muted)",
      terminalTitlebarDotsOpacity: "0",
    },
    textMarkers: {
      markBackground: "rgba(162, 87, 26, 0.15)",
      markBorderColor: "rgba(162, 87, 26, 0.55)",
      insBackground: "rgba(63, 125, 78, 0.15)",
      insBorderColor: "rgba(63, 125, 78, 0.55)",
      delBackground: "rgba(178, 58, 91, 0.15)",
      delBorderColor: "rgba(178, 58, 91, 0.55)",
    },
  },

  shiki: {
    langAlias: {
      nasm: "asm",
      x86asm: "asm",
    },
    langs: [{ ...armGrammar, name: "armasm", aliases: ["arm"] }],
  },

  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
});

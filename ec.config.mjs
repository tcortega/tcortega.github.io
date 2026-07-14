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

/*
 * unstripped syntax palette. Warm, earthy tokens tuned to the paper/ink theme
 * and its burnt-orange accent — rust keywords, olive strings, mauve numbers,
 * amber functions, teal types — so highlighting reads clearly without fighting
 * the brand (the bundled cool themes washed out on our warm surfaces). One
 * builder, two lightness-adjusted palettes.
 */
function unstrippedTheme(name, type, p) {
  return {
    name,
    type,
    colors: { "editor.background": p.bg, "editor.foreground": p.fg },
    settings: [
      { settings: { foreground: p.fg, background: p.bg } },
      {
        scope: ["comment", "punctuation.definition.comment", "string.comment"],
        settings: { foreground: p.comment, fontStyle: "italic" },
      },
      {
        scope: [
          "keyword",
          "keyword.control",
          "keyword.other",
          "keyword.operator.expression",
          "keyword.operator.new",
          "keyword.operator.logical",
          "storage",
          "storage.type",
          "storage.modifier",
          "variable.language",
          // asm instruction mnemonics + directives (more specific than the
          // keyword.operator punctuation rule below, so these win).
          "keyword.operator.word.mnemonic",
          "keyword.operator.word.pseudo-mnemonic",
          "entity.directive",
          "entity.name.section",
        ],
        settings: { foreground: p.keyword },
      },
      {
        scope: [
          "string",
          "string.quoted",
          "string.template",
          "string.regexp",
          "constant.other.symbol",
        ],
        settings: { foreground: p.string },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
          "constant.other",
          "support.constant",
        ],
        settings: { foreground: p.number },
      },
      {
        // asm registers (more specific than constant.language above).
        scope: ["constant.language.register"],
        settings: { foreground: p.type },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call",
          "variable.function",
        ],
        settings: { foreground: p.func },
      },
      {
        scope: [
          "entity.name.type",
          "entity.name.class",
          "entity.other.inherited-class",
          "support.type",
          "support.class",
          "storage.type.class",
          "entity.name.namespace",
        ],
        settings: { foreground: p.type },
      },
      {
        scope: [
          "keyword.operator",
          "punctuation",
          "punctuation.separator",
          "punctuation.terminator",
          "meta.brace",
        ],
        settings: { foreground: p.punct },
      },
      {
        scope: ["entity.name.tag", "punctuation.definition.tag"],
        settings: { foreground: p.keyword },
      },
      {
        scope: ["entity.other.attribute-name"],
        settings: { foreground: p.func },
      },
      {
        scope: ["support.type.property-name", "meta.object-literal.key"],
        settings: { foreground: p.type },
      },
      {
        scope: [
          "entity.name.function.decorator",
          "meta.decorator",
          "punctuation.decorator",
        ],
        settings: { foreground: p.accent },
      },
    ],
  };
}

const unstrippedLight = unstrippedTheme("unstripped-light", "light", {
  bg: "#e9e4d7",
  fg: "#1c1a16",
  comment: "#98917d",
  keyword: "#b0472b",
  string: "#5f7530",
  number: "#8a4a6a",
  func: "#a97b16",
  type: "#3c7a6b",
  punct: "#6b655b",
  accent: "#a2571a",
});

const unstrippedDark = unstrippedTheme("unstripped-dark", "dark", {
  bg: "#241f18",
  fg: "#ece5d5",
  comment: "#7f7662",
  keyword: "#e28c60",
  string: "#a1b465",
  number: "#cb92af",
  func: "#d9ac4f",
  type: "#6fb3a2",
  punct: "#a79d89",
  accent: "#cc7a3c",
});

export default defineEcConfig({
  // Custom warm light + dark syntax themes (defined above).
  themes: [unstrippedLight, unstrippedDark],

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

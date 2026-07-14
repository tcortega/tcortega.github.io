import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import mermaid from "astro-mermaid";
import astroExpressiveCode from "astro-expressive-code";
import config from "./astro-paper.config";

export default defineConfig({
  // `site` is read from astro-paper.config.ts (https://unstripped.dev/).
  // No `base` is set: custom domain serves at the root.
  site: config.site.url,
  integrations: [
    // Must run before mdx() so the mermaid-augmented markdown processor is in
    // place. autoTheme watches <html data-theme="light|dark"> and re-renders.
    mermaid({
      theme: "default",
      autoTheme: true,
    }),
    // Must be registered BEFORE mdx() (EC throws an "Incorrect integration
    // order" error otherwise) so it takes over code-block rendering for both
    // .md and .mdx. Config lives in ec.config.mjs; EC sets
    // markdown.syntaxHighlight=false, so the old shikiConfig is gone.
    astroExpressiveCode(),
    mdx({
      // The custom markdown.processor below only governs .md files; give MDX
      // the same math plugins so equations also render in .mdx posts.
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap({
      filter: page =>
        config.features?.showArchives !== false || !page.endsWith("/archives/"),
    }),
  ],
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    // Code-block syntax highlighting is handled by Expressive Code (ec.config.mjs),
    // which sets markdown.syntaxHighlight=false. The unified() processor still
    // owns TOC / collapse / callouts / math; EC composes its rehype step into it.
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
        remarkMath,
      ],
      rehypePlugins: [rehypeCallouts, rehypeKatex],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      name: "IBM Plex Mono",
      cssVariable: "--font-ibm-plex-mono",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});

# Astro Dev Blog — Clean 2026 Setup (Claude Code Playbook)

A copy-paste sequence for standing up a technical / reverse-engineering blog on **AstroPaper v6** (Astro 6.3, Tailwind v4, TypeScript 6, Content Layer API) with **math, diagrams, great code blocks**, deployed to **GitHub Pages**.

> Paste each prompt into Claude Code **one at a time**. After each, confirm the "✅ Done when" check before continuing.

---

## The stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 6.3** | Zero-JS by default, fastest content builds, current major |
| Theme | **AstroPaper v6** | Minimal/clean, on the 2026 stack, ships search + RSS + SEO + OG images |
| Styling | **Tailwind v4** (CSS-first) | Already wired into AstroPaper |
| Content | **Content Layer API** (`glob()` loader) | The current, typed collections approach |
| Math | **remark-math + rehype-katex** | Build-time LaTeX, no heavy client JS |
| Diagrams | **astro-mermaid** | Intercepts ```` ```mermaid ```` fences, auto light/dark |
| Code blocks | **Shiki** (built in) → optionally **Expressive Code** | Native is great; EC adds frames/line-markers/diffs |
| Host | **GitHub Pages** via GitHub Actions | Free, dead-simple, all static |

---

## Prerequisites (do these yourself, once)

- **Node 22.12.0+** (`node -v`). Astro 6 dropped Node 18 & 20.
- **Git** + a **GitHub account**.
- **Claude Code** installed and authenticated.
- An **empty folder** created, with Claude Code opened inside it.
- Decide your final URL (affects `base` — see Prompt 5).

`npm` is used below for universality; `pnpm` is equally fine (AstroPaper's docs lead with it).

---

## Prompt 1 — Scaffold & first run

```text
You're helping me set up a technical blog with Astro. Work from the current Astro 6 and AstroPaper v6 docs, not memory — you can read https://docs.astro.build/llms.txt and append .md to any docs page, and check the AstroPaper repo at https://github.com/satnaing/astro-paper.

Do the following, in this directory:
1. Verify my Node version is 22.12.0 or higher; if not, stop and tell me.
2. Scaffold a new project from the AstroPaper theme (template: satnaing/astro-paper) into the CURRENT directory, non-interactively. Use whatever current `create astro` flags achieve that.
3. Pin the Node version: add a .nvmrc containing "22".
4. Install dependencies, then run a production build (astro build) to confirm it compiles cleanly. Then briefly start the dev server to confirm it serves, and stop it.
5. If git isn't already initialized, initialize it and make a single clean initial commit. Confirm node_modules/ and dist/ are gitignored.
6. Give me a short tour (5-10 lines) of the files I'll actually touch: astro-paper.config.ts, astro.config.ts, src/content.config.ts, src/content/posts/, src/content/pages/, and src/styles/.

Don't customize content or config yet — just get a clean, building baseline. Report the exact commands you ran.
```

**✅ Done when:** `astro build` exits 0, the dev server serves the AstroPaper demo at `localhost:4321`, and you have an initial git commit. You understand where posts live (`src/content/posts/`).

---

## Prompt 2 — Make it yours (config + about page)

Fill in your details inside the prompt before pasting.

```text
Personalize the AstroPaper config. Open astro-paper.config.ts (the unified root config in v6) and set:

- Site title: "<YOUR BLOG TITLE>"
- Description: "<ONE-LINE DESCRIPTION>"
- Author: "<YOUR NAME>"
- Site URL: "<https://your-final-url>"   (leave base alone for now; we handle it at deploy)
- Locale / timezone: <e.g. en, Asia/Bangkok>
- Social links: <GitHub: ..., X: ..., Mastodon: ..., email: ...>  (remove any I didn't give)
- Posts per page: <e.g. 6>
- Default theme: <light | dark | system>

Then:
1. Update the About page at src/content/pages/about.md with a short bio placeholder I can edit later.
2. Point or remove the "edit/suggest changes" link so it doesn't reference the original template repo.
3. Remove the demo posts EXCEPT keep one as a formatting reference, renamed to src/content/posts/_reference.md with draft: true so it never publishes.
4. Show me the exact frontmatter schema this version expects for a post (the fields and types from src/content.config.ts), so I know what every new post needs.
5. Rebuild to confirm no schema/type errors, and commit.

Keep changes minimal and idiomatic to AstroPaper v6 — don't restructure the theme.
```

**✅ Done when:** Your name/title/socials show on the running site, the About page is yours, only your reference draft remains in `posts/`, and you've been shown the exact post frontmatter schema.

---

## Prompt 3 — Math + diagrams

```text
Add math and diagram support to my AstroPaper v6 blog. Use current APIs (check docs/llms.txt and each package's README).

MATH (KaTeX, build-time):
1. Install remark-math and rehype-katex, and wire them into the markdown pipeline in astro.config.ts (remarkPlugins / rehypePlugins).
2. Ensure the KaTeX stylesheet is loaded site-wide (install katex and import its CSS in the base layout, or link it) so equations aren't unstyled.
3. Confirm it works in BOTH light and dark mode (KaTeX color should follow the theme's foreground).

DIAGRAMS (Mermaid):
4. Add the astro-mermaid integration (plus the mermaid package it needs). Configure it to auto-follow AstroPaper's light/dark theme toggle. It must intercept ```mermaid fenced blocks BEFORE Shiki tries to syntax-highlight them.

VERIFY:
5. Create src/content/posts/_render-test.md with draft: true containing: inline math ($E=mc^2$), a block equation ($$ ... $$), a ```mermaid flowchart, plus a normal ```python and ```bash code block.
6. Run astro build and start preview; confirm math renders, the diagram renders, code highlights, and nothing errors. Then commit.

If astro-mermaid conflicts with the theme's code styling, resolve it cleanly and tell me what you changed.
```

**✅ Done when:** In `npm run preview`, the test post shows rendered inline + block math, a real Mermaid diagram (correct in both themes), and highlighted code — with a clean `astro build`.

---

## Prompt 4 — *(Optional)* Fancier code blocks (Expressive Code)

AstroPaper already styles code well with Shiki (dual light/dark, and a copy button). Expressive Code adds **editor/terminal frames, line highlighting, text markers, diffs, line numbers, and collapsible sections** — genuinely useful for RE write-ups (pointing at a specific offset, showing before/after). The tradeoff: it replaces how *all* code blocks render, so it may need a little CSS reconciliation with the theme. Skip this if you want zero fuss.

```text
Add astro-expressive-code to my AstroPaper v6 blog as an enhancement to code blocks.

1. Install and register astro-expressive-code (it must run before/instead of the default Shiki markdown highlighting).
2. Configure dual themes that match AstroPaper's light and dark palettes so code blocks look consistent with the site.
3. Enable: the frames plugin (editor + terminal window chrome via the "title" / file-name meta and the "frame" meta), text & line markers (highlight, ins, del), line numbers (off by default, opt-in per block), and collapsible sections.
4. Reconcile any CSS conflicts with AstroPaper's existing pre/code styling so there's no double-padding, double-background, or broken copy button. Tell me exactly what you changed.
5. For my reverse-engineering content: check whether Shiki (which EC uses) bundles grammars for assembly and hex dumps. Add custom TextMate grammars for `hexdump` and ARM assembly (`armasm`) ONLY if they're missing and a reliable grammar exists; otherwise document the closest working fence (e.g. `asm`, `nasm`) as a fallback. Don't block the setup on this.
6. Update _render-test.md to demonstrate: a titled editor frame, a terminal frame, line highlighting, a diff (ins/del), and line numbers. Rebuild, preview, confirm, commit.
```

**✅ Done when:** Code blocks render with frames/line-markers/diffs, light + dark stay consistent with the theme, and the copy button still works. (Asm/hexdump grammars are a bonus, not a blocker.)

---

## Prompt 5 — Deploy to GitHub Pages

### Do these yourself first
1. **Create a GitHub repo** (must be **public** for free Pages). The name decides your URL:
   - Repo named **`<username>.github.io`** → served at `https://<username>.github.io` (no base path).
   - **Custom domain** → no base path; you'll add a `CNAME`.
   - Any other repo name (e.g. `blog`) → served at `https://<username>.github.io/blog` (needs `base: '/blog'`).
2. **Push your local repo** to that GitHub repo (Claude Code can do the `git remote add` + `git push`, or do it yourself).
3. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Then paste this
```text
Set up GitHub Pages deployment for this Astro site via GitHub Actions.

My URL situation: <pick ONE>
  (a) repo is named <username>.github.io  → no base path
  (b) custom domain <blog.example.com>     → no base path, add a public/CNAME with that domain
  (c) project repo named "<repo>"          → set base: "/<repo>"

1. In astro.config.ts set `site` to my final URL, and set `base` per the case above (omit base for a/b).
2. Add .github/workflows/deploy.yml using the official withastro/action, pinned to Node 22, building on pushes to main and on manual dispatch. (Verify the current major versions of withastro/action and actions/deploy-pages.)
3. Make sure the build includes Pagefind search index generation and the dynamic OG image step (they run during `astro build`, so confirm they're produced in dist/).
4. If case (b), also confirm the CNAME ends up in the published output.
5. Commit and push. Tell me what to expect in the Actions tab and the final live URL.
```

**Reference workflow** (Claude Code will generate its own — this is your sanity check):

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3   # installs deps + runs `astro build` + uploads artifact
        with:
          node-version: 22
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**✅ Done when:** The Action goes green and your site is live at the expected URL — CSS, search, RSS, and OG images all working. If CSS/links 404, your `site`/`base` is almost certainly the culprit (see Gotchas).

> **Alternative host — Cloudflare:** unlimited bandwidth, but Cloudflare Pages is now in maintenance mode; new projects should use **Workers static assets**. In the Cloudflare dashboard: connect the repo, framework preset **Astro**, build command `astro build`, output dir `dist`. No `base` path needed (served at root). Keep GitHub for source control.

---

## Your day-to-day writing workflow

```bash
npm run dev            # write + live-preview at localhost:4321
# ...create a post, see it update live...
git add -A
git commit -m "post: reversing the X firmware"
git push               # GitHub Action builds + deploys automatically
```

**New post:** create `src/content/posts/my-slug.md` (use **`.mdx`** only if you want to embed components). Frontmatter follows the schema Prompt 2 surfaced — typically:

```yaml
---
title: "Reversing the X Firmware Bootloader"
pubDatetime: 2026-06-29T10:00:00Z
description: "Walking the loader from reset vector to decrypt routine."
tags: ["reverse-engineering", "arm", "firmware"]
draft: false           # true = stays out of production builds
featured: false        # optional
# ogImage: ./cover.png # optional; otherwise auto-generated
---
```

Then in the body:
- **Code:** ```` ```c ````, ```` ```python ````, ```` ```bash ````, ```` ```nasm ````, ```` ```asm ```` …
- **Math:** `$inline$` and `$$ block $$`
- **Diagrams:** a ```` ```mermaid ```` fenced block
- **Images:** drop them next to the post or in `src/assets/` and reference with a relative path — images under `src/` are auto-optimized (resized, modern formats) by Astro. Keep source files reasonably sized; Astro generates the responsive variants.

---

## Gotchas & tips

- **Node version must match everywhere.** 22.12+ locally *and* in CI. The `.nvmrc` + `node-version: 22` in the workflow keep them aligned. Most "works locally, fails on Actions" cases are this.
- **`base` path mismatch = broken CSS/links** on project-repo Pages. If the live site loads HTML but no styles, set `base` correctly and ensure internal links use it (AstroPaper v6 supports subdirectory deploys, but `site`/`base` must be right).
- **KaTeX needs its stylesheet.** Equations rendering as raw markup means the CSS import is missing.
- **Mermaid vs Shiki.** ```` ```mermaid ```` must be intercepted by `astro-mermaid` *before* Shiki highlights it — if you see a syntax-highlighted code block instead of a diagram, the integration order/registration is off.
- **Drafts.** `draft: true` keeps a post out of production. Great for the `_reference.md` and `_render-test.md` files.
- **Search & OG images are build-time.** Pagefind's index and the Satori OG images are produced by `astro build`, so test them in `npm run preview` (or on the deployed site), not always in `dev`.
- **Expressive Code (if added)** is the one piece most likely to need CSS reconciliation with the theme — if blocks look double-bordered or oddly padded, that's where to look.
- **Don't commit `dist/` or `node_modules/`.** AstroPaper's `.gitignore` already handles this.
- **Custom domain:** the `public/CNAME` file (single line, your domain) must survive into `dist/`, plus set the domain in repo Settings → Pages and add the DNS records at your registrar.

---

## If something breaks

Hand Claude Code the actual error and context, e.g.:

```text
`astro build` fails / the Action is red / math isn't rendering. Here's the full output:
<paste>
Diagnose against current Astro 6 / AstroPaper v6 behavior (read docs/llms.txt if needed) and fix it. Explain the root cause in one or two sentences.
```
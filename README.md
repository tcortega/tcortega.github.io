# unstripped.dev

Reverse engineering notes, symbols included.

A working notebook for taking software apart: long-form reverse-engineering
write-ups, short notes from the debugger, and the occasional tutorial.

Built with [Astro](https://astro.build), KaTeX, Mermaid, and Expressive Code.

## Develop

```bash
npm install
npm run dev       # live preview at http://localhost:4321
npm run build     # production build (+ Pagefind index + OG images)
npm run preview   # serve the production build locally
```

- Posts live in `src/content/posts/` (`title`, `description`, `pubDatetime` required).
  Optional: `category` (`re` | `til` | `tut`), `synopsis`, `tags`.
  Files prefixed with `_` or marked `draft: true` are excluded from the build.
- Deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
- Custom domain: `unstripped.dev` (`public/CNAME`).

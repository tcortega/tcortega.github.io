# .text

Notes from the executable section — a developer & reverse-engineering blog.

Built with [Astro](https://astro.build) and the [AstroPaper](https://github.com/satnaing/astro-paper)
theme, plus KaTeX math, Mermaid diagrams, and Expressive Code.

## Develop

```bash
npm install
npm run dev       # live preview at http://localhost:4321
npm run build     # production build (+ Pagefind index + OG images)
npm run preview   # serve the production build locally
```

- Posts live in `src/content/posts/` (`title`, `description`, `pubDatetime` required).
  Files prefixed with `_` or marked `draft: true` are excluded from the build.
- Deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

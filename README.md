# Lounas Gana — Portfolio

Production build of the `Portfolio.html` design: Vite + React 18 + Three.js, warm-paper aesthetic, three interactive WebGL sims (A\* grid planner, potential-field quadrotor, 4-DOF manipulator IK).

## Stack

- **Vite 5** — dev server + production bundling (code-split: `three`, `react`, app)
- **React 18** (ES modules, not CDN dev builds)
- **Three.js 0.160** (npm, tree-shakeable import)
- Google Fonts: Space Grotesk · Inter Tight · JetBrains Mono

## Dev

```bash
npm install
npm run dev        # http://localhost:5173
```

## Production build

```bash
npm run build      # → dist/
npm run preview    # serve dist/ locally on :4173
```

The `dist/` folder is a fully static bundle — deploy to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, nginx, S3+CF). No server runtime needed.

## Project layout

```
.
├── index.html              # HTML shell, meta tags, font preconnect
├── vite.config.js          # bundling + manualChunks split
├── public/assets/
│   ├── reports/*.pdf       # served as-is (no hashing)
│   └── videos/*.mp4
└── src/
    ├── main.jsx            # React root
    ├── App.jsx             # all sections (Nav, Hero, Stats, Projects, Sims, Experience, Skills, About, Contact)
    ├── data.js             # PROFILE / PROJECTS / EXPERIENCE / EDUCATION / SKILL_GROUPS
    ├── sims.js             # Three.js sims (hero, astar, quad, manip)
    └── styles.css
```

## Changes from the design prototype

- ES-module bundling instead of in-browser Babel + CDN React dev builds
- `window.Nav` / `window.Hero` / … globals replaced by normal React components
- Removed the `TweaksPanel` + `__edit_mode_*` postMessage plumbing (design-tool-only)
- Fixed `<window.App />` → `<App />` in the render root
- Added `<meta>` tags (description, Open Graph, theme-color), inline SVG favicon
- Keyboard-accessible project cards (Enter / Space), `aria-expanded`
- `@media print` rules for clean `⌘P → Save as PDF`
- Assets self-hosted under `public/assets/`; paths in `data.js` unchanged

## Editing content

All copy lives in `src/data.js`. The sims are self-contained in `src/sims.js` — see the `SIMS.hero`, `SIMS.astar`, `SIMS.quad`, `SIMS.manip` exports.

## License

Personal portfolio content — © Lounas Gana 2026.

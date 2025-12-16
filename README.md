# EraSwap — Frontend Website

A modern, responsive marketing and app frontend for the EraSwap project built with Vite and React (TypeScript JSX). This repository contains the UI used for the EraSwap website, including reusable components, themes, and example pages.

## Key Features

- Responsive design and component-driven UI
- Built with Vite + React and Radix UI primitives
- Tailwind-friendly styling and utility-first structure
- Reusable UI components in `src/components`

## Tech Stack

- Runtime: Node.js
- Bundler: Vite
- Framework: React (TSX files present)
- UI primitives: Radix UI
- Styling: Tailwind CSS (project contains Tailwind-style classes)

## Quick Start

Prerequisites:

- Node.js 18+ recommended
- npm, yarn or pnpm

Install dependencies:

```bash
npm install
# or yarn
# yarn
# or pnpm
# pnpm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build (example using `serve`):

```bash
# install serve if you don't have it
npm install -g serve
serve -s dist
```

Note: `package.json` contains the following useful scripts:

- `dev` — starts Vite development server
- `build` — produces the production `dist` folder

## Project Structure (important files)

- `index.html` — App entry
- `src/main.tsx` — App bootstrap
- `src/App.tsx` — Root application component
- `src/components/` — Reusable UI components (where most UI work happens)
- `src/pages/` — Example pages and routing targets
- `public/` — Static assets served as-is
- `vite.config.ts` — Vite configuration

Explore `src/components` to find the UI building blocks (many components include paired files with "2" suffix — those may be alternatives or drafts).

## Development Notes

- The codebase uses `.tsx` files — TypeScript with JSX. If you need to add types or fix TS issues, install `@types/*` packages as necessary.
- Components are organized to be composable; prefer adding small, focused components rather than large page-level components.

## Contributing

If you'd like to contribute:

1. Fork the repository and create a feature branch.
2. Run the dev server and confirm visual/functional changes.
3. Open a PR with a clear description of your change.

Please add any screenshots or GIFs in the PR description for UI changes.

## Deployment

This project builds to a static bundle under `dist/`. Deploy the contents of `dist/` to any static hosting service (Netlify, Vercel, GitHub Pages, S3 + CloudFront, etc.). If you use Vercel, add a simple project that runs `npm run build` and serves the output.

## License

Add a license file (`LICENSE`) to define how this project may be used. If you're unsure, use `MIT` for permissive open-source distribution.

## Contact

If you want me to include project-specific badges, a live demo link, or screenshots, tell me the URLs and assets and I'll add them to this README.

---

Generated and maintained by the EraSwap frontend team.

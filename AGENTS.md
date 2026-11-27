# Fenmyr Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
```

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. `npm run start` runs in production mode without a separate build step.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.tsx` wires routes to controllers, installs the standard Remix component renderer used by actions, and renders the 404 page for unmatched URLs
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router test
- `app/actions/document.tsx` is the document shell: global stylesheet, font preloads, favicon and meta description
- `app/actions/home/page.tsx` renders the home page; `app/actions/home/sections.tsx` is the ordered section registry that drives page order, anchor ids, header nav and the test
- `app/actions/not-found-page.tsx` renders the 404 page
- `app/actions/public/` contains the browser runtime entry
- `app/ui/` holds shared layout pieces: `section.tsx`, `site-header.tsx`, `site-footer.tsx`, `button-link.tsx` and `screenshot.tsx`
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root: `styles.css` holds the fonts, colour tokens and base styles, with Fenmyr's fonts in `public/fonts/` and pictures in `public/images/`. Component styles use `css()` mixins

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, and `test/` only when you need them.

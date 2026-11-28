# Fenmyr Agent Guide

Read the Purpose section in `README.md` before changing the site. Every change serves it.

## Rules

Each rule names the check that enforces it. `npm run check` runs every check that exists today.

1. **A rule comes with its check.** When a decision becomes a rule, the same change adds what keeps it true. If nothing can check it, the rule says so.
2. **Strict TypeScript.** No `any`. No `as`, except right after parsing outside data. Outside data stays `unknown` until it is checked where it enters. Check: `tsc` and the budget's `any` and `casts` counts.
3. **Colours come from tokens.** Use `var(--token)`. Make a shade with `color-mix()` of tokens. A new colour becomes a token first: in `public/styles.css` when every theme shares it, or in the `tokens` list of `tools/themes.ts` when a theme changes it. Shadows use `rgba(var(--sh), …)`. Check: the budget's `rawColours` count.
4. **No dead code.** Check: `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`. Unused files, exports and dependencies with knip: not checked yet, [#6](https://github.com/chiangs/fenmyr-web/issues/6).
5. **Small modules.** One area per file, at most 400 lines. Check: the budget's `longFiles` count.
6. **Copy follows the Words rules in the app's [DESIGN.md](https://github.com/chiangs/fenmyr/blob/main/DESIGN.md).** British English. ✦ at most once, and only in Myra's voice. The tagline at most once per page. No long dashes, and no brackets inside sentences. Check: `app/actions/copy.test.ts`. Myra's voice versus the neutral voice: nothing checks it; review does.
7. **Page weight rises only on purpose.** Each page has a budget of compressed bytes per type. A change that adds weight raises the line in the same commit. Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
8. **No third-party requests.** Check: the same-origin test in `app/actions/copy.test.ts`, on `src`, `srcset` and `<link href>` in the HTML. The live browser check: not checked yet, [#5](https://github.com/chiangs/fenmyr-web/issues/5).
9. **Reduced motion stops motion.** With reduce-motion on, no animation runs and no video plays. Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
10. **WCAG 2.2 AA.** Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
11. **A visual change shows before-and-after screenshots.** Light and dark, at 390 px and 1440 px. Nothing checks it; review does. The screenshot script: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
12. **Every page is findable and previews well.** A page is indexed with a canonical URL, a link preview and a sitemap entry, or marked `noindex`. Titles and descriptions stay within what results show. The skill in `.agents/skills/seo/SKILL.md` says what each page needs and why. Check: `npm run seo`, on the built site. Rich results and previews on the live site: nothing checks them; the skill lists the manual checks.

`tools/budget.json` holds the budget's counts, all zero today. `npm run budget` fails when a count rises above its line and says when one can be lowered. Raw colours are hex, `rgb()`, `rgba()`, `hsl()` and `hsla()` in `public/styles.css`, `public/themes.css` and string literals under `app/`. Two forms are allowed: a custom property defined in a `:root` or `[data-theme="…"]` block, and `rgb(var(--sh) …)` or `rgba(var(--sh), …)`.

## Practices

- **Commits.** Start the subject, and a pull request's title, with a conventional prefix such as `feat:`, `fix:`, `docs:` or `chore:`, then a plain sentence. Sign off every commit with `git commit -s` to agree to the [Developer Certificate of Origin](https://developercertificate.org). This includes commits Claude makes for you. Check: the `title` and `sign-off` jobs in `.github/workflows/check.yml`, on the title and every commit in a pull request.
- **Branches.** Make each new branch in its own worktree: `git worktree add .claude/worktrees/<name> -b <branch> origin/main`. Link `node_modules` from the main checkout, or run `npm ci` in the worktree. Remove the worktree with `git worktree remove .claude/worktrees/<name>` once the branch is merged.
- **Pull requests.** Every change reaches `main` through a pull request, squash-merged. Run `/code-review` on the pull request and fix the real findings before a person reviews it. Check: the `main` ruleset in the repository settings. It allows no direct pushes, force-pushes or deletion, and only squash merges. A pull request merges once it is up to date with `main`, its conversations are resolved and four checks pass: `npm run check`, `sign-off` and `title` from `.github/workflows/check.yml`, and Vercel's deployment. Use Update branch when `main` has moved. It asks for no approving review, since the owner merges their own pull requests.
- **Issues.** Ideas and later work go in [GitHub issues](https://github.com/chiangs/fenmyr-web/issues), not in code. Give every issue the labels that fit. The labels mirror the app's.
- **Dependencies.** A new dependency needs one sentence in the pull request on why the platform or `remix` can't do the job.
- **Licence and assets.** The code is under the EUPL-1.2, in `LICENSE`. Fenmyr's name, Myra and her art, the logo and the icons are reserved, as the app's [TRADEMARKS.md](https://github.com/chiangs/fenmyr/blob/main/TRADEMARKS.md) explains. Assets come only from the app repository, never from Mochiboard. The one exception is another tool's logo, which comes from that tool's official source, sits in `public/images/logos/`, and is named in `NOTICE` with its source and licence. Show it unchanged, except resized, or in one colour where that brand's rules allow it, as GitHub's do. A test fails when a logo there is missing from `NOTICE`. Claude Code is shown with a plain icon, since Anthropic allows its logo only in materials it approves.

The ruleset and the workflow check commit sign-offs, prefixes and how pull requests merge. Nothing checks the branches, `/code-review`, issues, dependencies or assets; review does.

## Patterns

- **Styles.** `public/styles.css` holds only the tokens every theme shares, `@font-face` and base element rules. A component's look is a `css()` mixin beside its markup. `css()` reads a key as a nested selector only when it starts with `&`, `:`, `[` or `.`, so write `:is(ol) &`, not `ol &`. It drops a selector nested inside two at-rules. Each mixin sits in its own cascade layer, so when two mixins on one element set the same property, the later layer wins, not the more specific selector.
- **Themes.** The app's six themes are listed once in `app/ui/themes.ts`, which the picker, the generator and the tests read. `npm run themes` writes `public/themes.css` from the app's own theme files at the commit pinned in `tools/themes.ts`; never edit it by hand. It fails when a page-level rule it doesn't read, such as a comma list or `html.dark`, sets a token it tracks. The head script and the picker set `data-theme` and `data-mode` on `<html>`, and with neither the page follows the system. Choosing a theme cross-fades the page in a view transition, after the other mode's screenshots near the viewport have decoded; with reduced motion, or without view transitions, it changes at once. Screenshots, and later videos, render a light and a dark version and show the one that matches `data-mode`. Check: `app/ui/themes.test.ts`, offline. `npm run themes -- --check` fails when `public/themes.css` differs from the pinned app commit. It needs the network, so it isn't part of `npm run check`.
- **Words.** Every user-facing string lives in `app/content/en.tsx` and the two files it spreads into its sections, `en-showcase.tsx` and `en-details.tsx`, typed by `Content` in `app/content/content.ts`. Components read from it and hold no copy. Shell commands and URLs are not copy and stay in components. A new language is another file of the same type, [#3](https://github.com/chiangs/fenmyr-web/issues/3).
- **Sections.** The home page renders the registry in `app/actions/home/sections.tsx`. Page order, anchors, header links and tests come from it. Add a section by adding an entry.
- **Tiles.** A feature is shown as a tile: a small drawing, a title and a sentence. The drawings are HTML and CSS in `app/ui/tile-art.tsx`, coloured with the card tokens, so they follow every theme and weigh almost nothing. Their words come from `app/content/en.tsx` like any other copy. A section's tiles are a `Record` in its copy, and `app/actions/home/home-tiles.tsx` sets their order, tone and drawing.
- **Islands.** An interactive piece is a `clientEntry()` component. Its file lives in a `public/` folder beside its narrowest owner, as the Remix guide's project tour says. An island used by one section goes in `app/actions/home/public/`. One used across the site goes in `app/ui/public/`. Everything else renders on the server, and every page loads the small Remix client runtime, which handles in-place navigation and starts islands.
- **Motion.** Use the platform first: CSS transitions and keyframes, the Web Animations API, view transitions and canvas, wrapped in small mixins. Consider Motion or GSAP when the result isn't good enough or a library removes real complexity, and say which in the pull request. Every animation stops with reduced motion.
- **Myra.** Myra is one canvas island, `app/ui/public/myra.tsx`, ported from the app's `src/web/goo.ts`, [#7](https://github.com/chiangs/fenmyr-web/issues/7). Another island makes her move by sending the event in `app/ui/public/myra-event.ts`, never by reaching into her canvas, and the event reports whether she moved. She only has the hello and love poses and the hop, so the site never claims a move she can't show. Nothing checks these two; review does.
- **Images.** A screenshot renders a `<picture>` per mode, each serving AVIF, then WebP, then PNG, and CSS shows the one that matches `data-mode`. Both are lazy, so the hidden one is never fetched. A page names its first-screen screenshot as `Document`'s `hero` and gives it `priority`; the head script then preloads that screenshot's AVIF in the mode it resolved, so its fetch doesn't wait for layout. Set the real width and height. A screenshot is a light and a dark PNG in `public/images/` plus an entry in `app/ui/screenshots.ts`, which lists its size, the widths to serve and its `sizes`. After adding or changing a source PNG or that table, run `npm run images` and commit the AVIF and WebP files it writes beside the PNG. Check: `app/ui/screenshot.test.ts` fails when the page points at an image that is not in `public/`, or when a screenshot lacks its AVIF, WebP or light and dark PNG. Nothing checks that the AVIF and WebP files match a changed PNG; review does.
- **Video.** Use muted, self-hosted clips of up to 20 seconds, as AV1 WebM with an H.264 MP4 fallback and a poster. App footage is always a real recording, never generated. Each clip has a light and a dark version, and the page shows the one that matches the active theme's mode. Playback starts when the video scrolls into view, and never with reduced motion.
- **Metadata.** `Document` writes the title, description, canonical URL, Open Graph tags and `noindex` from its `path` prop, with the site's origin and the preview image from `app/site.ts`. The home page adds JSON-LD from `app/actions/home/structured-data.tsx`. `public/robots.txt` and `public/sitemap.xml` are plain files. `npm run images` makes the preview image, `public/images/og.jpg`; nothing checks that it matches a changed `board-light.png`, review does. The seo skill has the details.
- **Outside data.** Data from the network or from files stays `unknown` until it is parsed where it enters, as rule 2 says.

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
npm run budget
npm run images
npm run themes
npm run build
npm run seo
npm run check
```

Use `npm run hmr` for live server and browser updates; `npm run dev` only watches and restarts the server. `npm run start` runs in production mode without a separate build step. `npm run build` writes the static site that Vercel deploys, `npm run seo` audits it, and `npm run check` runs both last.

## Deploy

The site deploys on Vercel as static files. The Vercel project uses the preset "Other", the repository root as Root Directory, `npm ci` as Install Command, `npm run build` as Build Command and Node 26, with the Output Directory override off.

`npm run build` runs `tools/build.ts`. It renders each page in its `pages` list through `router.fetch`, follows every `/assets/` URL the pages and their modules reference, copies `public/`, and writes Vercel's Build Output API folder `.vercel/output/`. Its `config.json` serves the `.ts` and `.tsx` modules as JavaScript, adds `X-Content-Type-Options: nosniff` as the server does, and answers unknown paths with `404.html` at status 404. Vercel's default caching applies; a long cache for fingerprinted assets is [#19](https://github.com/chiangs/fenmyr-web/issues/19). A new page is a new entry in `pages`.

The build checks itself. It fails when a route in `app/routes.ts` has no entry in `pages`, when a page answers with the wrong status, when an asset answers anything but 200, or when a `public/` file would overwrite a rendered one. Two builds of the same commit should be byte-identical; nothing checks it yet.

Every page is rendered once, at build time, so nothing may depend on the request. Nothing checks this; review does. A route that must run per request, such as a form handler, needs a Vercel Function: have the build write one under `.vercel/output/functions/` that serves `router.fetch`, and route its path to it in `config.json`.

`tools/build.ts` is the code React Router's `prerender` option would have provided, in 99 lines.

## Building Features

Refer to ./.agents/skills/remix/SKILL.md for the Remix mental model and how to find guides and API READMEs through `node_modules/remix/INDEX.md`, and to ./.agents/skills/seo/SKILL.md for page metadata.

## Starter Layout

- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs
- `app/router.tsx` wires routes to controllers, installs the standard Remix component renderer used by actions, and renders the 404 page for unmatched URLs
- Put top-level route actions in `app/actions/controller.tsx`; add `app/actions/<route-key>/controller.tsx` for nested route maps. `app/actions/controller.test.ts` is the root controller's router test
- `app/actions/document.tsx` is the document shell: the theme script, which also preloads the hero screenshot, the stylesheets, font preloads, favicon and meta description
- `app/actions/home/page.tsx` renders the home page; `app/actions/home/sections.tsx` is the ordered section registry that drives page order, anchor ids, header nav and the test; `app/actions/home/timer-card.tsx` draws the timer card in Ideas and the work around them, after the app's own timer chip and Myra's glow
- `app/actions/not-found-page.tsx` renders the 404 page
- `app/content/content.ts` defines `Content`, the shape of every user-facing string, and `SectionId`; `app/content/en.tsx` holds the British English copy that pages and `app/ui/` read
- `app/site.ts` holds the site's origin and the link preview image; `app/actions/home/structured-data.tsx` is the home page's JSON-LD
- `app/actions/copy.test.ts` checks the copy and same-origin resources of every page; `tools/budget.ts` counts against `tools/budget.json`; `tools/images.ts` makes the AVIF and WebP screenshots from the PNGs; `tools/themes.ts` writes `public/themes.css` from the app's themes; `tools/build.ts` writes the static site to `.vercel/output/`; `tools/seo.ts` audits its metadata, robots.txt and sitemap
- `app/actions/public/` contains the browser runtime entry
- `app/ui/` holds shared layout pieces: `section.tsx`, `site-header.tsx`, `site-footer.tsx`, `button-link.tsx`, `mark.tsx`, the logo, which shows only its outline in dark mode, `mode-variant.ts`, the mixin that shows the light or dark version of a picture, `screenshot.tsx` with its table of images in `screenshots.ts`, `tile.tsx`, the grid of feature tiles, and `tile-art.tsx`, the small drawings in them, with `card.ts`, the card look they share with the other sections, and `themes.ts`, the theme registry. Its islands are in `app/ui/public/`: `myra.tsx`; `site-menu.tsx`, the header's menu button and popover on narrow screens; and `theme-picker.tsx`, the header's theme button and popover, which share `icon-button.ts`
- `app/actions/home/public/slash-demo.tsx` is the island for Type / for the quick things: Myra's thirteen commands, filtered as you type, with her bubble answering. `/animate hop` sends the event in `app/ui/public/myra-event.ts`, and every Myra on screen and moving hops twice, as in the app
- `app/actions/home/connections.tsx` draws Works with what you already use, one card per tool with its logo; `app/actions/home/home-tiles.tsx` lists each section's tiles with their tone and drawing
- `app/actions/home/public/template-gallery.tsx` is the island for Fifteen ways to start: the app's templates in its picker's order and groups, with a chip for each role that filters them. Without JavaScript all fifteen show
- `app/actions/home/ripe-path.tsx` draws From raw to ripe: Myra's bubble and the four steps, whose cloudberries ripen from red to gold as they scroll into view
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root: `styles.css` holds the fonts, shared tokens and base styles, `themes.css` the generated theme tokens, with Fenmyr's fonts in `public/fonts/` and pictures in `public/images/`. Component styles use `css()` mixins

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, and `test/` only when you need them.

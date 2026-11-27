# Fenmyr Agent Guide

Read the Purpose section in `README.md` before changing the site. Every change serves it.

## Rules

Each rule names the check that enforces it. `npm run check` runs every check that exists today.

1. **A rule comes with its check.** When a decision becomes a rule, the same change adds what keeps it true. If nothing can check it, the rule says so.
2. **Strict TypeScript.** No `any`. No `as`, except right after parsing outside data. Outside data stays `unknown` until it is checked where it enters. Check: `tsc` and the budget's `any` and `casts` counts.
3. **Colours come from tokens.** Use `var(--token)`. Make a shade with `color-mix()` of tokens. A new colour becomes a token in `public/styles.css` first. Shadows use `rgba(var(--sh), …)`. Check: the budget's `rawColours` count.
4. **No dead code.** Check: `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`. Unused files, exports and dependencies with knip: not checked yet, [#6](https://github.com/chiangs/fenmyr-web/issues/6).
5. **Small modules.** One area per file, at most 400 lines. Check: the budget's `longFiles` count.
6. **Copy follows the Words rules in the app's [DESIGN.md](https://github.com/chiangs/fenmyr/blob/main/DESIGN.md).** British English. ✦ at most once, and only in Myra's voice. The tagline at most once per page. No long dashes, and no brackets inside sentences. Check: `app/actions/copy.test.ts`. Myra's voice versus the neutral voice: nothing checks it; review does.
7. **Page weight rises only on purpose.** Each page has a budget of compressed bytes per type. A change that adds weight raises the line in the same commit. Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
8. **No third-party requests.** Check: the same-origin test in `app/actions/copy.test.ts`, on `src`, `srcset` and `<link href>` in the HTML. The live browser check: not checked yet, [#5](https://github.com/chiangs/fenmyr-web/issues/5).
9. **Reduced motion stops motion.** With reduce-motion on, no animation runs and no video plays. Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
10. **WCAG 2.2 AA.** Not checked yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
11. **A visual change shows before-and-after screenshots.** Light and dark, at 390 px and 1440 px. Nothing checks it; review does. The screenshot script: [#5](https://github.com/chiangs/fenmyr-web/issues/5).

`tools/budget.json` holds the budget's counts, all zero today. `npm run budget` fails when a count rises above its line and says when one can be lowered. Raw colours are hex, `rgb()`, `rgba()`, `hsl()` and `hsla()` in `public/styles.css` and in string literals under `app/`. Two forms are allowed: a custom property defined in a `:root` block, and `rgb(var(--sh) …)` or `rgba(var(--sh), …)`.

## Practices

- **Commits.** Start the subject with a conventional prefix such as `feat:`, `fix:`, `docs:` or `chore:`, then a plain sentence. Sign off every commit with `git commit -s` to agree to the [Developer Certificate of Origin](https://developercertificate.org). This includes commits Claude makes for you.
- **Branches.** Make each new branch in its own worktree: `git worktree add .claude/worktrees/<name> -b <branch> origin/main`. Link `node_modules` from the main checkout, or run `npm ci` in the worktree. Remove the worktree with `git worktree remove .claude/worktrees/<name>` once the branch is merged.
- **Pull requests.** Every change reaches `main` through a pull request, squash-merged. Run `/code-review` on the pull request and fix the real findings before a person reviews it.
- **Issues.** Ideas and later work go in [GitHub issues](https://github.com/chiangs/fenmyr-web/issues), not in code. Give every issue the labels that fit. The labels mirror the app's.
- **Dependencies.** A new dependency needs one sentence in the pull request on why the platform or `remix` can't do the job.
- **Licence and assets.** The code is under the EUPL-1.2, in `LICENSE`. Fenmyr's name, Myra and her art, the logo and the icons are reserved, as the app's [TRADEMARKS.md](https://github.com/chiangs/fenmyr/blob/main/TRADEMARKS.md) explains. Assets come only from the app repository, never from Mochiboard.

Nothing checks these practices automatically. Review does.

## Patterns

- **Styles.** `public/styles.css` holds only tokens, `@font-face` and base element rules. A component's look is a `css()` mixin beside its markup.
- **Words.** Every user-facing string lives in `app/content/en.tsx`, typed by `Content` in `app/content/content.ts`. Components read from it and hold no copy. Shell commands and URLs are not copy and stay in components. A new language is another file of the same type, [#3](https://github.com/chiangs/fenmyr-web/issues/3).
- **Sections.** The home page renders the registry in `app/actions/home/sections.tsx`. Page order, anchors, header links and tests come from it. Add a section by adding an entry.
- **Islands.** An interactive piece is a `clientEntry()` component. Its file lives in a `public/` folder beside its narrowest owner, as the Remix guide's project tour says. An island used by one section goes in `app/actions/home/public/`. One used across the site goes in `app/ui/public/`. Everything else renders on the server, and every page loads the small Remix client runtime, which handles in-place navigation and starts islands.
- **Motion.** Use the platform first: CSS transitions and keyframes, the Web Animations API, view transitions and canvas, wrapped in small mixins. Consider Motion or GSAP when the result isn't good enough or a library removes real complexity, and say which in the pull request. Every animation stops with reduced motion.
- **Myra.** Myra is one canvas island, `app/ui/public/myra.tsx`, ported from the app's `src/web/goo.ts`, [#7](https://github.com/chiangs/fenmyr-web/issues/7).
- **Images.** `<picture>` serves AVIF, then WebP, then PNG, with a dark source for each light and dark pair. Set the real width and height. Use `fetchpriority="high"` on the first screen and `loading="lazy"` below it. A screenshot is a light and a dark PNG in `public/images/` plus an entry in `app/ui/screenshots.ts`, which lists its size, the widths to serve and its `sizes`. After adding or changing a source PNG or that table, run `npm run images` and commit the AVIF and WebP files it writes beside the PNG. Check: `app/ui/screenshot.test.ts` fails when the page points at an image that is not in `public/`.
- **Video.** Use muted loops of 5 to 10 seconds, self-hosted, as AV1 WebM with an H.264 MP4 fallback and a poster. Playback starts when the video scrolls into view, and never with reduced motion.
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
npm run check
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
- `app/content/content.ts` defines `Content`, the shape of every user-facing string, and `SectionId`; `app/content/en.tsx` holds the British English copy that pages and `app/ui/` read
- `app/actions/copy.test.ts` checks the copy and same-origin resources of every page; `tools/budget.ts` counts against `tools/budget.json`; `tools/images.ts` makes the AVIF and WebP screenshots from the PNGs
- `app/actions/public/` contains the browser runtime entry
- `app/ui/` holds shared layout pieces: `section.tsx`, `site-header.tsx`, `site-footer.tsx`, `button-link.tsx`, and `screenshot.tsx` with its table of images in `screenshots.ts`
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware
- Root `public/` contains static files served unchanged from the app root: `styles.css` holds the fonts, colour tokens and base styles, with Fenmyr's fonts in `public/fonts/` and pictures in `public/images/`. Component styles use `css()` mixins

This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, and `test/` only when you need them.

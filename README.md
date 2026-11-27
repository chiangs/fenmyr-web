# Fenmyr

The marketing homepage for Fenmyr, a free open-source canvas app for Linux and macOS, built on Remix 3. The page is server-rendered from a section registry in `app/actions/home/sections.tsx`.

## Purpose

fenmyr.com markets and showcases Fenmyr for anyone curious about it. A visit should end with the visitor installing Fenmyr. Starring the repository and sponsoring come second.

The one thing to remember is this. Fenmyr gets you from an idea to a rapid prototype you can experiment with and test, faster.

The site shows that in three ways:

- Short looping videos of real features, and small interactive demos.
- Myra guides the visitor through the page in short bubbles, in her own voice.
- A calm base of Fenmyr's Nordic paper look, with playful moments from Myra, the videos and the demos.

The site is not documentation. Install details, shortcuts and troubleshooting stay in the [app repository](https://github.com/chiangs/fenmyr).

Scope:

- The first public version is the homepage only. What's new, a web demo and later ideas are [GitHub issues](https://github.com/chiangs/fenmyr-web/issues) in this repository.
- The site is in English first, in British English. It is built so other languages can be added later.
- There is no launch date yet.

Success is measured with GitHub's own numbers: stars, release downloads and traffic. The site has no tracking.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/actions/home/` renders the home page from its section registry, `app/actions/not-found-page.tsx` the 404 page, and `app/actions/document.tsx` the document shell.
- `app/ui/` holds the shared section, header, footer, button link and screenshot pieces.
- `app/actions/public/` contains the browser runtime entry.
- `app/routes.ts` defines the shared route contract used by server and browser modules for type-safe hrefs.
- `app/router.tsx` wires routes to handlers, renders the 404 page and installs the standard Remix component renderer used by actions.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and render middleware.
- Root `public/` contains static files served unchanged from the app root, including `styles.css`, the fonts and the images.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.

## Commands

```sh
npm i
npm run dev
npm run hmr
npm run start
npm test
npm run typecheck
npm run budget
npm run check
```

## Licence

The code is open source under the [European Union Public Licence v. 1.2](LICENSE) (EUPL-1.2), the same licence as the app. The names Fenmyr and Myra, Myra's art, the logo and the icons are not part of the code licence. They are reserved, as the app's [TRADEMARKS.md](https://github.com/chiangs/fenmyr/blob/main/TRADEMARKS.md) explains. The fonts in `public/fonts/` are under the SIL Open Font License, in `public/fonts/OFL.txt`.

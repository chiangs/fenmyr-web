<p align="center">
  <img src="public/images/icon.png" width="96" alt="Fenmyr's icon">
</p>

<h1 align="center">fenmyr.com</h1>

<p align="center">The code for fenmyr.com, the homepage for <a href="https://github.com/chiangs/fenmyr">Fenmyr</a>.<br>
Fenmyr is a free, open-source canvas for Linux and macOS, with Myra the cloudberry to help.</p>

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

## How the site is built

The site runs on [Remix 3](https://remix.run) and renders on the server. The home page comes from a list of sections in `app/actions/home/sections.tsx`, and every word on it lives in `app/content/en.tsx`. Interactive pieces are built as small islands. Every page also loads the small Remix client runtime, which handles in-place navigation.

[AGENTS.md](AGENTS.md) holds the rules and the check that enforces each one, how changes reach `main`, the code patterns and where each file lives. Read it before you change the site.

## Run it

You need Node.js 24.3 or newer.

```sh
npm install
npm run hmr
```

| Command | What it does |
|---|---|
| `npm run hmr` | Runs the site with live updates in the browser |
| `npm run dev` | Runs the site and restarts the server when a file changes |
| `npm start` | Runs the site in production mode |
| `npm run check` | Runs the typecheck, the budget and the tests |
| `npm run budget` | Counts `any`, casts, raw colours and long files against `tools/budget.json` |
| `npm test` | Runs the tests |
| `npm run typecheck` | Checks the types |

## Support Fenmyr

Fenmyr is free and made in spare hours. If it helps you think, you can help it grow:

- **[Sponsor on GitHub](https://github.com/sponsors/chiangs)**
- Star the [app repository](https://github.com/chiangs/fenmyr), so others find it.

## Licence

The code is open source under the [European Union Public Licence v. 1.2](LICENSE) (EUPL-1.2), the same licence as the app. The names Fenmyr and Myra, Myra's art, the logo and the icons are not part of the code licence. They are reserved, as the app's [TRADEMARKS.md](https://github.com/chiangs/fenmyr/blob/main/TRADEMARKS.md) explains. The fonts in `public/fonts/` are under the SIL Open Font License, in `public/fonts/OFL.txt`.

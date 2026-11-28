# fenmyr.com design

This file holds the site's visual and copy rules. The site follows the app's [DESIGN.md](https://github.com/chiangs/fenmyr/blob/main/DESIGN.md) for Fenmyr's brand: the feel, the colours and themes, the fonts, Myra and the Words rules. This file records only what the site adds or does differently. For the rules' checks, how changes land and where files live, see [AGENTS.md](AGENTS.md).

The values below come from the code: `public/styles.css`, `app/ui/` and `app/actions/home/`. If they disagree with this file, the code is correct, so fix this file. A new pattern lands here in the same pull request that adds it.

## The feel

The site is the app's calm Nordic paper, with playful moments from Myra and the demos. Most of the page is quiet: dotted board, white cards, warm shadows. The colour and motion go where they explain something. It stays light and fast, and nothing moves without a reason.

Every section answers one question a visitor has, in the order they would ask it, and shows rather than tells: a drawing, a demo, a real screenshot.

## Page structure

- **One column,** at most `72rem` wide, with `clamp(1rem, 4vw, 2rem)` at the sides. The header and footer share the width.
- **A section** is a `<section>` from `app/ui/section.tsx`: an `h2`, then its content, `1.75rem` apart, with `clamp(3rem, 8vw, 5.5rem)` above and below.
- **Most sections open with a Lead:** a `3rem` squircle in a card tone holding the section's icon, and one sentence beside it, at most `44rem` wide. The icon is a mask filled with `--card-butter-ink`.
- **After the Lead comes the section's content,** in this order. A main visual, such as a screenshot, a demo or a card, may come first. Then the feature list: tiles, points or cards. Links and buttons that lead on come last. A section has one feature list.
- **The order, anchors and header links** come from the registry in `app/actions/home/sections.tsx`. A section is added there, not in the page.
- **Breakpoints:** `52rem` turns two-column layouts into one and swaps the header links for the menu. `34rem` shrinks tile drawings. Between `52rem` and `64rem` the header tightens so its links stay on one row.

Check: a test in `app/actions/controller.test.ts` checks that every section in the registry is on the page, with its title and anchor. Nothing checks the rest of this structure; review does.

## Colour

The app's token system applies as it is. `public/themes.css` is generated from the app's six themes by `npm run themes` and is never edited by hand. A component takes every colour from a token, and a shade is a `color-mix()` of tokens.

The site's own colour tokens, in `public/styles.css`, are the same in every theme:

| Token | Use |
|---|---|
| `--logo-tile`, `--logo-ink` | The tile behind another tool's logo, white so the logo keeps its brand colours, and the ink for logos drawn as masks |
| `--glow-red`, `--glow-green` | Myra's glow on the timer card, as in the app |
| `--paper`, `--paper-ink` | A sheet of paper and the pen on it, as in the Start on paper drawing. White and dark in every theme, as real paper is |
| `--myra-*` | Myra's pixels. Nothing else uses them |

The same file also defines `--font` and `--hand`, the two font stacks, `--pill-r`, the `12px` corner for buttons and small squares, and `--header-h`, the header's height on narrow screens.

How the colours are used:

- **The accent,** `--pink-deep`, fills primary buttons and marks the one thing that matters in a drawing: the newest capture, the slider's handle, the last commit. As text, the accent is `--accent-text`.
- **Card tones,** `--card-<tone>`, fill tile drawings and Lead icons. Within one section's tiles, each tone appears once.
- **Text on a tone** is `--card-butter-ink`, which reads on every pastel tone in both modes. Text on a card is `--card-white-ink`, or `--card-white-soft` for the quieter line.
- **Shadows** are `rgba(var(--sh), …)` scaled by `--sh-k`, so they stay warm in light mode and dim in dark mode.
- **Text sits on solid colour.** A translucent card lets the page through, and its text can fall below contrast.

Checks: the budget's `rawColours` count, `app/ui/themes.test.ts` for tokens that are used but not defined, and `npm run themes -- --check` against the app.

## Type

- **Figtree** for everything people read. Body text is `1.0625rem` with a line height of 1.6.
- **Headings** are weight 800, line height 1.1, tracking `-0.03em`, and balanced.
  - The hero's `h1`: `clamp(2.75rem, 9vw, 5.25rem)`, tracked tighter at `-0.045em`.
  - A section's `h2`: `clamp(1.875rem, 4.5vw, 2.75rem)`.
  - A card's `h3`: `1.125rem` in tiles, points and logo cards. A large card that stands alone, such as an install option, uses `1.375rem`.
- **A Lead** is `clamp(1.0625rem, 2vw, 1.1875rem)`. **Card text** is `0.96875rem` with a line height of 1.5.
- **Small labels** above a group are `0.6875rem` to `0.75rem`, weight 600, uppercase, tracked `0.06em`.
- **Shantell Sans,** `--hand`, is for Myra's bubbles and the From raw to ripe step names only. It is never body text.
- **Monospace** is for commands, slash commands and code, at `0.9em`.

Nothing checks these sizes; review does.

## Shape and space

- **Cards** use `cardStyle` from `app/ui/card.ts`: a `24px` squircle, `--card-white`, two warm shadows, and `--card-edge`, the outline that Clear and Lantern add.
- **Buttons** are `ButtonLink`: at least `2.75rem` tall, `--pill-r` squircle corners, and weight 600.
  - The primary button is the accent fill, and a section has at most one.
  - `quiet` is the white secondary button.
- **Text links** that lead on end with ` →`, as in "How to connect each one →".
- **Small squares:**
  - Lead icons are `3rem` with `--pill-r` corners.
  - Logo tiles are `3.25rem` with `14px` corners, in `--logo-tile`.
  - Tile drawings sit in a box `6.5rem` tall with `16px` corners. It shrinks to `5.5rem`, and the drawing to 80%, under `34rem`.
- **Myra's bubble** is `--card-butter` with `--hand` at about `1.0625rem` and a soft shadow. Its corners are a `20px` to `24px` squircle. A bubble that speaks from beside Myra, as in From raw to ripe, keeps one small corner, `6px`, as its tail.
- **Filter chips and pills** are fully round, `999px`.
- **Something not here yet** gets a dashed outline and no shadow, on solid paper, as with More to come in Connections.

Nothing checks these shapes; review does.

## Building blocks

Reach for these before making something new.

| Block | Where | Use it for |
|---|---|---|
| Tiles | `app/ui/tile.tsx`, drawings in `app/ui/tile-art/` | A set of features. Each tile has a drawing, a title and one or two sentences |
| Points | `Points` in `sections.tsx` | Three or four short claims, each led by a bold phrase |
| Logo cards | `app/actions/home/connections.tsx` | Other tools Fenmyr works with |
| Screenshot | `app/ui/screenshot.tsx` | A real screen of the app, light and dark |
| Demo | an island in `app/actions/home/public/` | Something visitors try: the slash commands, the template filter |
| Myra with a bubble | `app/ui/public/myra.tsx` | Myra saying one thing, in her voice |
| Maker's note | the `figure` in Built to last | The maker speaking for himself, signed |
| KeyCap | `app/ui/tile-art/key-cap.tsx` | A key or a button's name inside a drawing |

Tiles come in sets that fill their rows. At `1440px`, `Tiles` lays out three columns, so use three or six tiles. With `narrow`, it lays out four, for a set of four. To add one to a full set, merge two that belong together rather than leave a gap. Nothing checks this; review does.

## Drawings

Tile drawings are HTML, CSS and inline SVG in `app/ui/tile-art/`, one file per section, with what they share in `base.ts`. They weigh almost nothing and follow every theme.

- **Draw the feature's own shape, simplified:** the phone preview, the slider, the commits on a line. A visitor should recognise it in the app.
- **Line work** is `--card-butter-ink`. Quiet parts are mixes of `--card-white-ink`, at 22% for faint and 45% for soft. The accent marks one thing. Paper is the one exception: it uses `--paper` and `--paper-ink`, so it stays white in dark mode.
- **Words inside a drawing** come from the copy, like any other text.
- **Icons** are Phosphor, regular weight, taken from the app's own icon pack into `app/ui/pack-icons.ts`. A section's icon is an SVG in `public/images/`, used as a mask.
- **A sparkle means AI,** so it appears only where the AI itself is the subject, as on AI only when you ask. For anything else, use a concrete object or Myra herself.

Check: `app/ui/screenshot.test.ts` fails when the page points at a picture that isn't in `public/`. Nothing checks that a drawing matches the app; review does.

## Myra on the site

The app's DESIGN.md describes who Myra is. On the site:

- **She has only the hello and love poses, and the hop.** No copy or alt text claims anything else, such as a wave.
- **Every Myra has a label in the copy.** A test in `app/actions/controller.test.ts` checks the labels it lists, so a new Myra adds hers to that list.
- **Keep her pixels whole.** Her canvas is 17 art units wide, so widths in multiples of 17 px stay crisp: `2.125rem`, `4.25rem` or `6.375rem`. A size that grows with the screen starts on one of these. Nothing checks this; review does.
- **She speaks only in bubbles,** in her voice, with ✦ at most once. Everywhere else the page uses the neutral voice.
- **Another piece makes her move** by sending `MyraMoveEvent` from `app/ui/public/myra-event.ts`, never by reaching into her canvas.
- **With reduced motion,** she is a still picture.

## Motion

- **Use the platform first:** CSS transitions and keyframes, scroll-driven animation, the Web Animations API, view transitions, and canvas for Myra. AGENTS.md's Motion pattern says when a library is worth it. Changing the theme cross-fades for `350ms`.
- **Motion explains something:** berries ripen as the steps scroll in, Myra's glow pulses on the timer, Myra hops when asked.
- **Reduced motion stops all of it.** Nothing checks this yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).
- **Nothing shifts the layout:**
  - A demo renders on the server at its full size, and hides what needs JavaScript with `:root:not([data-js]) &`.
  - A list that filters keeps its size. Inside a box, it keeps the box the same height and fills it from the bottom, as the slash demo does. In a grid, every item stays in place and the ones that don't match fade, as the template gallery does. Only where the grid is one column, on a phone, do the matches move to the top, with no fade, since moving and fading at once flashes. Nothing checks this; review does.
  - A box whose rows move sets `overflow-anchor: none`.
  - Measure in a browser before saying a layout holds still.

### Tile drawings in motion

- **A drawing plays its feature once,** when its tile scrolls into view, and again when the pointer or focus comes to the tile. The slider's handles try values, captures appear one by one. It never loops.
- **`playOnSeen` in `app/ui/tile-art/base.ts` does the waiting.** `app/ui/public/tile-motion.tsx` marks a tile `data-seen` when 60% of it is on screen, and keeps the mark through an in-place navigation. Until then, once that island is watching, the drawing waits in its first frame. With reduced motion, without the island, or in print, it is the still drawing.
- **Every animation ends on the still drawing,** with fill-mode `both`, so after its motion a drawing looks exactly as it does with reduced motion or without JavaScript. Before it is seen, it may wait in a first frame that hides the parts it is about to draw, such as the pen lines on the paper.
- **About 1.5 to 2.5 seconds,** eased, with nothing faster than the eye can follow.
- **Only transforms, opacity and SVG stroke drawing move.** A moving part rides on a layer moved by `translate` or grows by `scale`, as the slider's handles and fills do, so nothing reflows.
- **`@keyframes` names start with `tile-`** and the drawing's name, since keyframe names are global.

Check: nothing in `npm run check` runs the motion. Review measures it in a browser for each drawing: it waits until seen, plays once, ends on the still drawing as the reduced-motion page shows it, replays on hover, and stays still with reduced motion. A drawing with no part that moves meaningfully, such as the file icon, stays still.

## Images and video

- **App screenshots are real,** with a light and a dark version, served as AVIF, WebP and PNG. AGENTS.md's Images pattern has the details.
- **App footage is always a real recording, never generated.** The video plan is [#23](https://github.com/chiangs/fenmyr-web/issues/23).
- **The link preview,** `public/images/og.jpg`, is cropped from the light board screenshot by `npm run images`.
- **Other tools' logos** come only from their owners, unchanged except for size or one colour where their brand rules allow it. Each is listed in NOTICE.

## Words

The app's Words rules apply: British English, one thought per sentence, no long dashes, no brackets inside sentences, ✦ at most once and only from Myra, and the tagline at most once a page. On top of those:

- **Lead with what the visitor gets, then the proof.** "Your work survives a crash", then how. Not the technique first.
- **Claim only what the app does.** Check each claim in the app's code before it goes on the page, and name the file in the pull request. "See that version run again" is not "restore that version".
- **Section titles name the benefit,** in sentence case: "Works with what you already use", "Built to last".
- **One exception to the two voices:** a note signed by the maker speaks as "I".
- **Commands and URLs are not copy.** They stay in components. Everything else is in `app/content/`.

Check: `app/actions/copy.test.ts` checks British spelling, long dashes, brackets, ✦ and the tagline. Voice and accuracy: nothing checks them; review does.

## Accessibility

The site holds WCAG 2.2 AA. Nothing checks it yet: [#5](https://github.com/chiangs/fenmyr-web/issues/5).

- **Focus** shows as a `2px` `--select` outline, `3px` out.
- **Touch targets** are at least `2.75rem`.
- **Pictures:**
  - Every `<img>` has `alt`, empty when it is decoration.
  - Drawings are `aria-hidden`, since the tile's title and text say what they show.
- **Demos:** a demo that changes a list says so in a live region, such as "6 templates shown".
- **Colour is never the only signal,** and text keeps its contrast in all six themes, light and dark.

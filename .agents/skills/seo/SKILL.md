---
name: seo
description: What fenmyr.com's pages need so search engines list them well and shared links show a good preview, where each piece lives, and how `npm run seo` checks it. Use when adding a page, changing a title, description or the hero, changing the link preview image, or asked about SEO, metadata, Open Graph, structured data, robots.txt or the sitemap.
---

# SEO for fenmyr.com

The site exists to get people to install Fenmyr, and most of them arrive from a search or a shared link. Read the Purpose section in `README.md` first. SEO here stays pragmatic: honest words that match what people search for, clean metadata, a fast page. No keyword stuffing, no pages that exist only for search engines, no hidden text.

## What every page has

| Piece | Where | Why |
|---|---|---|
| `<html lang="en-GB">` | `app/actions/document.tsx` | The copy is British English. |
| `<title>`, 15 to 60 characters, unique | `en.document.title`, or `Document`'s `title` | The blue link in results. Put the brand first and say what Fenmyr is, in words people search for. |
| Meta description, 70 to 160 characters | `en.document.description` | The line under the link. Results cut it off past about 160 characters. |
| One `<h1>`, and headings that never skip a level | the page | The page's outline. The home page's `<h1>` is the tagline, and the title carries the keywords. |
| `alt` on every `<img>` | the component | Image search and screen readers. Use `alt=""` for decoration. |

## What an indexed page adds

A page that passes `path` to `Document` is indexed. It gets these from `SearchMeta` in `app/actions/document.tsx`:

- A canonical link to its address on `https://www.fenmyr.com`. The origin lives in `app/site.ts`, because every page is rendered once at build time and the request can't supply it. `fenmyr.com` and `fenmyr.no` redirect to `www`.
- Open Graph tags for link previews in chats and social apps: title, description, URL, site name, `en_GB` locale and the image with its size and alt text. `twitter:card` is `summary_large_image`, and X reads the rest from Open Graph.

A page without `path`, such as the 404 page, gets `<meta name="robots" content="noindex">` and no preview tags.

The home page also carries schema.org JSON-LD in `app/actions/home/structured-data.tsx`: a `WebSite`, for the site name in results, and a `SoftwareApplication` that is free, open source, for Linux and macOS, and has a download link. Google shows no rich result for an app without ratings, but the data still tells search engines what Fenmyr is. Keep it true: change it when the platforms, the licence or the download change.

## The preview image

`public/images/og.jpg` is 1200 × 630, the size Open Graph previews expect. `npm run images` crops it from the top of the light board screenshot. `preview` in `app/site.ts` names its source and size. Keep it under 300 kB so every chat app shows it. It is a real screenshot, like all app footage on the site.

## robots.txt and the sitemap

`public/robots.txt` allows everything and points at `public/sitemap.xml`. The sitemap lists every indexed page by its canonical URL and leaves out `lastmod`, since a stale date is worse than none. Vercel marks preview deployments `noindex` on its own.

## Adding a page

1. Add the route and its entry in `pages` in `tools/build.ts`, as AGENTS.md says.
2. Pass `path` and a `title` to `Document`. Give it its own description when the page is about something else.
3. Add its canonical URL to `public/sitemap.xml`.
4. Run `npm run check`.

A second language, [#3](https://github.com/chiangs/fenmyr-web/issues/3), adds `hreflang` alternate links on every page and in the sitemap.

## The check

`npm run seo` runs `tools/seo.ts` on the built site in `.vercel/output/static`, so it checks the files Vercel serves. `npm run check` runs it after the build. It fails when:

- robots.txt is missing, blocks the site, or doesn't name the sitemap
- a sitemap URL isn't a built page, or a noindex page is in it
- a page has no language tag or no title, or an image has no `alt`
- an indexed page's title or description is out of range, or its title is shared with another page
- an indexed page has no canonical URL, a canonical URL that isn't its own address, or a canonical URL that isn't in the sitemap
- an indexed page has anything but one `<h1>`, or a heading skips a level
- an Open Graph tag is missing, or `og:url` and `og:title` differ from the canonical URL and the title
- the preview image is missing, the wrong size, or over 300 kB
- the Twitter card is wrong, or the JSON-LD doesn't parse or lacks the schema.org context

The copy test in `app/actions/copy.test.ts` checks the words in the title, description and Open Graph text like any other copy. The same-origin test skips the canonical link, since it names an address and loads nothing.

## Checked by hand after a deploy

Nothing automated reaches these, and they need the live site:

- Google's [Rich Results Test](https://search.google.com/test/rich-results) on `https://www.fenmyr.com/`, for the JSON-LD.
- A link pasted in a chat app, for the preview.
- Google Search Console and Bing Webmaster Tools. The owner verifies the domain and submits the sitemap once.
- PageSpeed Insights. Speed and layout shift count in ranking, and AGENTS.md rules 7 to 10 cover them.

# Quadron Studios: static site

A static rebuild of www.quadronstudios.com with no Wix runtime. It uses the same URLs, navigation, layout, fonts, motion and media as the live site.

## What's here

| URL | Source |
| --- | --- |
| `/` | Hand-built (`src/pages/home.html`) |
| `/about-1` `/ikenga` `/skelebe` `/projects` `/services` `/xr` `/academy` `/outsource` `/partnership` `/contact` | Generated from the live Wix layout |
| `/blog`, `/blog/tags/<tag>` (51 tags), `/post/<slug>` (3 posts) | Generated from the live Wix Blog |
| `/members`, `/forum`, `/profile/*` | Retired. Redirects to `/blog` (`_redirects` plus HTML redirect stubs) |
| `/404.html`, `/robots.txt`, `/sitemap.xml` (index) + `pages-`, `blog-posts-`, `blog-categories-sitemap.xml`, `/blog-feed.xml` (RSS) | Generated |

Blog posts show the article, tags and recent posts. Like buttons, view and comment counts, comments and share menus were removed on purpose. One spam comment on the live site was not carried over.

## Build

```
python3 tools/capture_seo.py  # re-capture the live SEO surface into tools/data/seo.json
python3 tools/patch_data.py   # once, after re-capturing data
python3 tools/build.py        # writes everything into ./site and downloads any missing media
python3 -m http.server 8080 --directory site
```

- `tools/data/*.json`: layout and content captured from the live site with Playwright, as desktop at 1440px and 1920px plus the Wix mobile layout.
- `tools/data/seo.json`: the live site's SEO, captured over plain HTTP (Wix renders it server-side): each page's title, description, canonical, Open Graph / Twitter / `article:` tags, robots, Google and Bing verification, RSS link, JSON-LD, image alt text and video titles, plus the RSS feed and sitemap dates. `build.py` writes these into every page as they are. Deliberate differences: JSON-LD drops the WebSite search action (no `/search` page) and the author links to retired profiles, and the HBCU video points at the self-hosted MP4; the home press logos keep their descriptive alt text instead of the live filenames; retired member, forum and profile URLs are left out of the sitemaps.
- `tools/gen_pages.py`: places each Wix component at its exact desktop coordinates, anchored left, right, centred or proportionally as Wix does. On mobile it uses the 320px Wix grid (`--u = 100vw / 320`). It copies Wix's own entrance-animation keyframes and parallax speeds.
- `css/styles.css` and `js/main.js` hold the shared header, footer, buttons, players, the Projects channel and lightbox, the blog and the forms. Per-page geometry is in `css/pages/*.css`. Don't edit those generated files by hand; change the generator and rebuild.

## Before going live

1. **Font licences.** Proxima Nova, plus the Futura and Helvetica cuts used by the forms and the Projects video channel, are commercial fonts that Wix licenses for Wix-hosted sites only. Licence them for self-hosting (Adobe Fonts covers Proxima Nova and Futura) or swap the `@font-face` files. Montserrat is open source (OFL).
2. **Forms.** Every form (contact, partnership, outsource, academy registration and the footer newsletter) posts to one endpoint. Set `<meta name="qs-form-endpoint" content="…">` in `tools/build.py`, for example to a Formspree or Netlify Forms URL, then rebuild. Until then, submitting shows a "not connected yet" message.
3. **Chat.** Wix Chat doesn't run off Wix. "Let's Chat!" and the mobile "•••" button link to `/contact`.
4. **Redirects.** `_redirects` is in Netlify / Cloudflare Pages format. On another host, the HTML redirect stubs still work.
5. **Videos.** These are already compressed with H.264 and faststart, at an SSIM of at least 0.99 against the source, and the silent background loops have no audio track. The originals are in `../video-originals/`, outside the deployed folder.
6. **SEO.** Keep the Google (`google-site-verification`) and Bing (`msvalidate.01`) tags in place so Search Console and Bing Webmaster Tools stay verified. Serve pages at `/about-1` with no trailing slash, as Wix does: the canonicals and sitemaps use that form. Turn off any host setting that redirects `/about-1` to `/about-1/`. Open Graph, schema and image-sitemap images still point at `static.wixstatic.com`, so they stop working if the Wix media is deleted.
7. **Live-site quirks kept for parity.** Fix them in the generator if you want:
   - text runs off the right edge on XR (Trader Moni) and on the home page's partnership paragraph;
   - the About team-card social icons link to Wix's own Facebook, Twitter and LinkedIn (template placeholders).

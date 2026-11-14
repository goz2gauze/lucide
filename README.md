# Lucide — static recreation

A front-end recreation of [lucideon.top](https://lucideon.top): the browser-style shell, animated purple background, sidebar, tabs, bookmarks, AI page, Education games page, Settings, Account, and Lucide Plus.

It is plain HTML, CSS, and ES modules. There is no build step and no backend.

## Run it

ES modules do not load from `file://`, so serve the folder:

```bash
cd lucideon
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Configuration

Everything editable lives in `config.js` at the site root. It is a plain script loaded before the app — edit it, save, and reload.

```js
window.LUCIDE_CONFIG = {
  ai: false,
  games: false,
  account: false,
  roblox: false,

  wisp: "",
  proxyEnabled: true,

  aiApi: "",
  gamesApi: "",
  accountApi: "",
  creditUrl: "https://discord.gg/",
  checkoutUrl: "",
  robloxClient: "",
};
```

- `ai` / `games` / `account` / `roblox` — `false` keeps that page on its "isn't available at the moment" notice. `true` turns on the local mock demo for that page so you can preview the interface.
- `checkoutUrl` — when set, the Plus button opens this URL in a new tab. When empty, the button shows the notification **“Checkout is not configured in config.js.”**
- `wisp` / `proxyEnabled` — turn on the in-app proxy. See below.
- `creditUrl` — where the **recreated by goz!** pill links. Keep it on a Discord invite: the integrity guard checks for one.
- `aiApi`, `gamesApi`, `accountApi`, `robloxClient` — placeholders for your own integrations. This front end does not call them.

The Settings and home pages are always available, and their stored preferences work without any config.

## Credit pill

Every page shows a small **recreated by goz!** pill at the bottom, linking to the `creditUrl` Discord invite.

`js/app.js` runs an integrity guard on boot and watches the DOM for changes. The link must stay present, keep exactly the text `recreated by goz!`, and keep a Discord invite URL. If any of that is removed or edited, the site replaces itself with an `ERR_CREDIT_MISSING` screen and refuses to run.

This is a client-side check only. On a static site, anyone who edits the JavaScript can bypass it.

## Font obfuscation

Visible text is scrambled with a fixed cipher and drawn with a locally hosted, glyph-remapped font, so the page looks normal while the DOM contains rotated text. Letters rotate by 13 and digits by 5; the font maps each rotated codepoint back to the original glyph.

- `js/obfuscate.js` checks `assets/fonts/lucide-obfuscated.json` against the cipher, waits for the font to load, then scrambles text nodes and keeps watching for new ones.
- The body font is `assets/fonts/lucide-obfuscated.woff2`, built from Geist. It is preloaded in `index.html` and used through the `html.font-obfuscated` rules in `css/style.css`.
- The wordmark uses a second mapped font, `assets/fonts/lucide-obfuscated-display.woff2`, built from Manrope so it keeps its original typeface. If it fails to load, the wordmark falls back to the verified body font rather than showing cipher text.
- Form fields, the **recreated by goz!** credit, and the integrity error screen stay on the normal font so they remain usable and readable.
- If the font or manifest fails to load, the page stays in normal text instead of showing cipher. This is a client-side obfuscation, not encryption: screenshots, OCR, and a determined scraper can still recover the text.

To rebuild the font after changing the cipher or source font:

```bash
python3 -m pip install fonttools brotli
python3 tools/build-obfuscation-font.py /path/to/Geist[wght].ttf
python3 tools/build-obfuscation-display-font.py /path/to/Manrope[wght].ttf
```

The build verifies every scrambled glyph against the source outlines before writing the manifest.

## In-app proxy (Wisp)

When `wisp` is set, typing a URL or a search in the omnibox opens it inside a Lucide tab using [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet), with requests carried over Wisp by the bundled libcurl transport.

```js
wisp: "wss://wisp.example.com/",
proxyEnabled: true,
```

Use `wss://` when the site is served over HTTPS (and `ws://` for local HTTP). A trailing slash is added automatically. Set `proxyEnabled: false` to turn the in-app browser off while keeping the URL in the config.

When `wisp` is empty the omnibox falls back to opening normal browser tabs and explains why once. Proxied tabs get a globe icon, the site title, the URL in the omnibox, and the reload control.

**You need your own Wisp server.** This is a static site, so there is nothing here to terminate the WebSocket. Any Wisp implementation works, for example `@mercuryworkshop/wisp-js`:

```js
import { createServer } from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const server = createServer(/* your normal static file handler */);
server.on("upgrade", (req, socket, head) => {
  if (new URL(req.url, "http://localhost").pathname !== "/wisp/") return socket.end();
  wisp.routeRequest(req, socket, head);
});
server.listen(8080);
```

Point `wisp` at that endpoint (`wss://your-host/wisp/`). The browser connects to it directly, so it must be publicly reachable once the site is deployed. Service workers, and therefore the proxy, only run over HTTPS or `localhost`.

Proxying limitations are the same as the original stack: sites that actively detect proxies, need a login the proxy cannot replay, or rely on unsupported browser features may still fail.

## What works

- Sidebar collapse, tabs, New tab, bookmarks (add and remove), and omnibox search with an optional in-app proxy.
- Hash routing: `#/` home, `#/a` AI, `#/g` Education, `#/roblox`, `#/u` Account, `#/s` Settings, `#/p` Plus.
- Settings persist in `localStorage` under `lucide.recreation.v1`: search engine, suggestions flag, restore tabs, theme (dark/light/Halloween), background mode, accent color, adblock flag, API host fields, tab disguise/title/favicon, quick-exit key and URL, confirm-leave, and clear-data.
- Ads notice, dismissible Plus toast, and the Plus marketing page.
- With the matching flags on: local mock AI chat (canned replies, threads, model picker), game grid and detail modal, account create/activate/sign-in, and the Roblox placeholder page.
- Font obfuscation is always on: the DOM holds rotated text while the remapped local font draws normal glyphs.

## Deliberate limitations

- The real AI service, account API, payments, ad network, CAPTCHA/anti-bot scripts, analytics, and Roblox/LucideBlox client are not included.
- AI, Education, Roblox, and Account are off by default, with their unavailable notices shown instead.
- Game cover art is replaced with gradient tiles and emoji so copyrighted artwork is not redistributed. The game names are kept from the original directory.
- "Search suggestions" is a stored setting only; there is no remote suggestions service.
- The ordinary UI fonts are loaded from jsDelivr (Geist and Manrope via Fontsource). The obfuscated font is local. Icons are inline SVG.
- The layout and copy were rebuilt from the public site. No original JavaScript or CSS bundle is copied.

## Files

- `config.js` — the only file you need to edit: feature flags, Wisp URL, checkout URL, and credit link.
- `index.html` — app shell.
- `css/style.css` — all styling and themes.
- `js/config.js` — reads `config.js` for the app.
- `js/data.js` — engines, themes, backgrounds, models, canned replies, games.
- `js/app.js` — state, routing, pages, dialogs, proxy tabs, and interactions.
- `js/proxy.js` — Ultraviolet/Wisp boot, URL encoding, and proxied tabs.
- `js/obfuscate.js` — the cipher, font verification, and text-node scrambling.
- `assets/fonts/` — the remapped Geist body font and Manrope display font, their manifests, and their OFL licenses.
- `tools/build-obfuscation-font.py` — rebuilds the body font and manifest.
- `tools/build-obfuscation-display-font.py` — rebuilds the Manrope wordmark font and manifest.
- `proxy/` — Ultraviolet, bare-mux, and the libcurl transport, with their licenses.
- `assets/mark.svg` — favicon.

## Credits and licenses

This is an independent, non-commercial front-end recreation for learning, based on the public interface of [lucideon.top](https://lucideon.top). It is not affiliated with or endorsed by Lucide.

The obfuscation fonts are subsets of [Geist](https://github.com/vercel/geist-font) by Vercel and [Manrope](https://github.com/googlefonts/manrope) by the Manrope Project Authors, both used under the SIL Open Font License. Their licenses are in `assets/fonts/OFL.txt` and `assets/fonts/OFL-Manrope.txt`.

The in-app browser vendors [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet) (`proxy/uv`), [bare-mux](https://github.com/MercuryWorkshop/bare-mux) (`proxy/baremux`) and the [libcurl transport](https://github.com/MercuryWorkshop/libcurl-transport) (`proxy/libcurl`). Each directory keeps its upstream license file, and the transport and service-worker code are AGPL-3.0; review those licenses before publishing. A small compatibility patch in `proxy/libcurl/index.mjs` accepts the plain-object header maps passed by newer bare-mux versions.

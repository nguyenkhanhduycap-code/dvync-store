# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, multi-page demo store for "D'Vync" (a screenless wearable health band sold as annual memberships plus bands/accessories). Plain HTML + CSS + vanilla JS (ES5-style IIFEs, no modules). There is **no build step, package manager, linter or test suite**. No real orders are placed; the cart and "orders" live in the browser's `localStorage`.

## Running it

Open any `.html` file directly, or serve the folder over HTTP (preferred, so `URLSearchParams`/relative asset paths behave like production), e.g. `python -m http.server 8000` from the repo root. Verify changes by loading the page in a browser (Playwright / Chrome MCP tools are available); there is nothing to compile or run in CI.

Third-party libraries load from CDNs at runtime (Lenis via unpkg on every page, GSAP + ScrollTrigger from cdnjs on the home page only), plus Google Fonts.

## Architecture

**Script load order matters** — every page includes, in this order: `data.js`, `layout.js`, `cart.js`, (Lenis / GSAP), `site.js`, then one page-specific script (e.g. `shop.js`, `product.js`, `checkout.js`). Each script is an IIFE that communicates through `window` globals:

- [js/data.js](js/data.js) — the single source of truth. Defines `DV_PRODUCTS` (memberships `one`/`peak`/`life` hand-written; bands generated from `DV_FAMILIES` via the `band(id, family, color, images, studio, extra)` helper and concatenated on), `DV_BAND_GROUPS`, `DV_CATEGORIES`, `DV_STORE` (currency, tax rate, shipping options, promo codes, free-shipping threshold), `DV_PLAN_COMPARE`, blog `DV_POSTS`/`DV_AUTHORS`, and lookup helpers (`DV_findProduct`, `DV_family`, `DV_bandGroup`, `DV_inCategory`). Change prices, stock, copy and promo codes here, not in HTML (exception: the plan prices are also written as text in `index.html`, `how-it-works.html`, `one/peak/life.html` and their meta descriptions, plus the shipping amounts in `shipping.html`, `faq.html`, `layout.js` and `product.js`). Prices are whole VND with VAT included (`taxRate` is 0); `Cart.money` appends " VND".
- [js/layout.js](js/layout.js) — injects the shared promo bar, header (including the Memberships mega-menu built from `DV_PRODUCTS`) and footer by replacing `<div data-include="promo|header|footer">` placeholders. Nav/footer edits happen here once, not in each HTML file.
- [js/cart.js](js/cart.js) — `window.Cart` is the only cart API. Lines are keyed `id|option`, persisted to `localStorage` (`dvync-cart`, `dvync-promo`), re-normalized against the current catalogue on load (stale products/options dropped, quantities clamped to `stock`), and every change dispatches a `cart:change` document event (also synced across tabs via `storage`). Cart-count badges use `[data-cart-count]`.
- [js/site.js](js/site.js) — behaviour shared by all pages: Lenis smooth scroll (synced to GSAP ticker when present; disabled for `prefers-reduced-motion`), mobile nav, dropdowns, sticky header, toast, accordions, `[data-reveal]` scroll reveals, and the `window.DV` helper object (`DV.esc`, etc.) that page scripts use.
- Page scripts render into root elements (`#product-root`, `#checkout-root`, …) from the data above. Query-string routing is used instead of per-product pages: `product.html?id=…`, `shop.html?cat=memberships|bands|…&family=…`. The three memberships have dedicated pages (`one.html`, `peak.html`, `life.html`, sharing `js/one.js` and keyed by `<body data-plan="…">`).
- Checkout ([js/checkout.js](js/checkout.js)) is simulated: it validates the form, writes the order to `localStorage` key `dvync-last-order`, and `thank-you.html` reads it back.

**Per-page styling hooks:** each page's `<body>` carries `data-page="…"`; inner pages use `class="light"` (home/how-it-works/why/membership pages are dark). CSS is split into `css/style.css` (global, loaded everywhere) plus page-group files (`pages.css`, `one.css`, `blog.css`, `hiw.css`, `why.css`).

## Conventions and gotchas

- Adding a page: copy an existing HTML file, use the `data-include` placeholders, keep the script order above, and add nav/footer links in `layout.js`.
- Adding a product: add it to `data.js` (a new band colourway goes through `band(...)`); image paths are relative to the `material/` asset folder (`var M = 'material/'`), and filenames there contain spaces and parentheses, so match them exactly.
- `material/` holds all images/video (large; the repo-root `material.zip` is an untracked archive of it — don't commit it). `.claude/` and `.playwright-mcp/` are gitignored.
- Product reviews and blog posts are sample content for the demo.

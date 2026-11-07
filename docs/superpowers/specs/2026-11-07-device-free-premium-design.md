# Design: Replace One/Peak/Life memberships with Device + Free/Premium

## Intent and why

`project_report.md`'s final version ("Revenue Model & Unit Economics", p.9–11) commits the business to a **single hardware SKU + two-tier freemium subscription** model:

- Hardware: 1,490,000 VND, one-time, VAT included.
- Free tier (lifetime): pulse, steps, sleep duration.
- Premium: 59,000 VND/month or 499,000 VND/year (≈41,583 VND/mo), AI analysis + trend reports.

The site currently sells three paid annual memberships (One 990,000 / Peak 1,290,000 / Life 1,890,000 VND/yr) that each bundle a sensor + band, with no device-only purchase and no free tier. The user asked me to make the website match the report's Revenue Model section and to use my own judgment on the rest ("hãy theo phương án của bạn").

This file is the record of that judgment, written before touching code, per the brainstorming skill's gate.

## Goals

- The site sells exactly one hardware product (the band/sensor) and one subscription with two tiers (Free, Premium), matching the report's prices and tier contents.
- Every page that currently references One/Peak/Life no longer does, and nothing links to a dead page.
- The existing architecture (`DV_PRODUCTS`, `Cart`, `DV_PLAN_COMPARE`, the `one.js` comparison-table component) is reused, not replaced, wherever it reasonably fits.
- Site stays internally consistent: homepage, how-it-works, about, nav/footer, shop, cart, checkout, blog cross-links.

## Non-goals

- Not implementing real VietQR/MoMo/ZaloPay payment gateways (checkout stays a simulated form; report's "domestic gateways" claim is a report-only aspiration already flagged as unverified infrastructure).
- Not rebuilding the product-detail component system or the cart/option mechanism.
- Not chasing every other report/web mismatch found in earlier conversation turns (tagline text, laptop-only viewport claim, GitHub repo, checkout payment rails) — those are separate from "memberships don't match" and out of scope for this change.
- Not deleting `life.html`'s content outright — superseded, not needed in nav, but no reason to destroy it mid-project.

## Anti-goals

- Would fail even if it "works": leaving `DV_PLAN_COMPARE`'s 4-column One/Peak/Life/Free structure in place and just relabeling it — the report explicitly describes a 2-column Free vs Premium comparison, and keeping 4 columns misrepresents the business model the report commits to.
- Would fail: a device page that lets you "buy a plan" (conflates the one-time hardware purchase with the subscription) — the report is explicit these are two separate revenue lines.

## Constraints

- No build step; everything is static HTML + the existing vanilla-JS data layer (`js/data.js` is the single source of truth per CLAUDE.md).
- Prices are stored as whole VND numbers; `Cart.money` appends "VND" (no `$`, no decimals) — already true after the earlier VND migration, reuse as-is.
- `taxRate` stays 0 (VAT already included in listed prices), consistent with the report's "VAT incl." pricing and the earlier project decision.
- Image assets must come from the existing `material/` folder; no new files to fetch or generate.

## Decisions made (mine, since the user deferred to my judgment)

1. **File renames:** `one.html` → `device.html` (the hardware product page), `peak.html` → `premium.html` (the subscription page). The user confirmed wanting renamed files over reusing `one.html`/`peak.html` are the way to go: "Đổi tên file (vd: device.html, premium.html)".
2. **`life.html` is retired from navigation** (menu, footer, homepage plan grid, how-it-works plan grid, about.html timeline mention) but the file is left in place, unlinked, rather than deleted — avoids destructive action beyond what's needed and leaves a trivially-reversible trace if the team wants it back.
3. **`js/one.js` is renamed `js/membership.js`** and generalized: instead of a `data-plan` with 3-4 values driving an N-column `DV_PLAN_COMPARE` table, it drives a 2-column (Free vs Premium) table. The auto-advancing feature-list, sticky floating button, and parallax hero code are kept as-is (they're plan-agnostic).
4. **`DV_PRODUCTS`:** the `memberships` category becomes exactly two entries:
   - `id: 'device'` — one-time hardware, `price: 1490000`, no `billing` field (one-time, not recurring) — `Cart`/checkout's billing-agnostic rendering already handles products without `billing` (membership cards show `/year` only `if (p.billing)`).
   - `id: 'premium'` — subscription, `price: 499000, billing: 'year'` (the annual price is the one sold; monthly equivalent noted in copy, not sold as a separate SKU, to avoid extending the cart/option system for a second price point).
   - A free tier is represented in `DV_PLAN_COMPARE` only (title "Free", price "Free forever", CTA "Start free") — not a real line a customer purchases, since there's nothing to transact for 0 VND. Clicking its CTA routes to the device page (you need the hardware to use any tier).
5. **`DV_PLAN_COMPARE`:** two columns, `device`+`free` bundled under one "what you get free" column vs `premium`. Concretely: column 1 = "Free" (includes the device purchase + free-tier software), column 2 = "Premium" (device purchase + premium software). This avoids implying Premium is itself a piece of hardware. Rows trimmed to only the two tiers' actual feature differences per the report (Free: pulse, steps, sleep duration; Premium: adds AI analysis, sleep/recovery recommendations, long-term trend reports) — the current 14-row Whoop-style feature list (HSA/FSA, VO2 max, ECG, blood pressure…) is cut because none of those are mentioned in the report's 2-tier description and they belonged to the old Peak/Life hardware differentiation, not a software tier difference.
6. **Homepage / how-it-works plan grids:** 3-card grid (One/Peak/Life) becomes a 2-card grid (Device / Premium). **Correction from builder review:** `css/style.css`'s `.plan-grid` is `grid-template-columns: repeat(3, 1fr)`, a hardcoded 3-column grid, not auto-fit — my original claim that it "already supports fewer cards" was wrong. The builder must add a 2-column variant (e.g. a `.plan-grid-2` modifier class, or override `grid-template-columns: repeat(2, 1fr)` scoped to wherever this grid is reused) so two cards don't leave a lopsided empty third column.
7. **Nav + footer (`js/layout.js`) and category label/id:** "Memberships" is renamed to **"Device & Premium"** everywhere it's a user-facing label — the mega-menu heading, footer section heading, `DV_CATEGORIES`'s `memberships` entry label, and the shop page's eyebrow/title text for that category. The category `id` in code can stay `memberships` internally (it's just a key), but every string a visitor reads changes. The mega-menu/footer show 2 cards (Device, Premium) instead of 3. Footer's "Compare all" link keeps pointing at `shop.html?cat=memberships` (still valid — just now lists 2 products instead of 3); no special-casing needed since `DV_inCategory` is data-driven.
8. **`about.html` timeline line** ("D'Vync One, Peak and Life arrive, bundling the band with the app") is rewritten to the new story (device + freemium software launch) rather than deleted, to keep the timeline's narrative arc intact.
9. **Checkout/cart line items, copy about "every membership includes the band, free shipping and your first month on us"** — this free-month framing belonged to the old annual-membership model; it's replaced with copy matching the new model (device ships with Free tier included; Premium is the add-on, sold separately). Exact wording is left to the builder, constrained only by: no unmodeled claims (no promising a trial period the report didn't commit to). **This also covers `js/shop.js`'s `SECTIONS` copy** (`SECTIONS.all.text` and `SECTIONS.memberships.text`), found by builder review to contain the same "every membership includes the band... first month" framing — missed in the first pass because `js/shop.js` wasn't in the original file list.
10. **Free-tier CTA behavior:** builder review found the current `js/one.js` `join()` function hardcodes `var planId = id === 'free' ? 'one' : id;` — clicking "Start your free month" silently adds the "one" product to the cart via a toast; it does not navigate anywhere. Per the user's decision, this changes: **the Free column's CTA becomes a plain link to `device.html`** (not an add-to-cart action), since Free is 0 VND and there's nothing to transact — a visitor needs to buy the device first, then they get Free-tier software access at no extra cost. Implementation: in the renamed `js/membership.js`, the Free column's CTA renders as `<a href="device.html" class="btn ...">Start free</a>` rather than `<button data-join="free">`; the `join()` function's `id === 'free'` special case is removed entirely (no longer reachable).
11. **`how-it-works.html`'s Blood Pressure section and the Heart/ECG "on-demand ECG" accordion item** (previously pitched as "Available with D'Vync Life") are **deleted** per the user's decision — neither blood pressure insights nor on-demand ECG are part of the report's two-tier (Free: pulse/steps/sleep; Premium: AI analysis/recommendations/trend reports) feature split, and Life is being retired from sale. Delete the Blood Pressure section (`how-it-works.html` ~line 198-207, including its "Explore D'Vync Life" CTA) and the ECG accordion item (~line 209-224) rather than repurposing them, so the page doesn't describe capabilities nothing sells.
12. **`js/one.js`'s `CURRENT` fallback** (`document.body.dataset.plan || 'one'`) becomes `document.body.dataset.plan || 'device'` in the renamed `js/membership.js`, so a page missing a `data-plan` attribute defaults sensibly to the hardware page rather than a now-nonexistent `'one'`.
13. **`DV_PLAN_COMPARE`'s Free column price string** (currently `'30 days free, then 990,000 VND/yr'`) is rewritten to reflect a lifetime free tier with no conversion to paid — e.g. `'Free forever'` — not just a number swap, since the entire 30-day-trial-then-bill concept no longer applies.
14. **Free→Device product mapping for display purposes:** `js/one.js`'s existing pattern of mapping the `'free'` column id to a real product for image/price lookups (`window.DV_findProduct(col.id === 'free' ? 'one' : col.id)`) is preserved but repointed: `col.id === 'free' ? 'device' : col.id`, so the Free column's product image/details come from the device product.
15. **`life.html`:** if it contains internal links to `one.html` or `peak.html` (self-referential plan-switcher links, e.g. "Compare with Peak"), those links are updated to the renamed `device.html`/`premium.html` so they don't 404. The page's own body copy describing the old 3-tier Life plan is left as-is (unlinked-from, not rewritten) per the non-goal of not deleting/rewriting its content.

## What's left to the builder

- Exact final English copy for device.html, premium.html, homepage plan cards, and nav labels (just needs to stay truthful to: device 1,490,000 VND one-time; Premium 499,000 VND/year or ~41,583/mo equivalent, sold as the annual SKU; Free tier is lifetime and free, requires owning the device).
- Whether `shop.html?cat=memberships` category filtering needs any code change beyond the data now returning 2 products instead of 3 (likely none — `DV_inCategory` is data-driven); the category `id` stays `memberships`, only its visible label becomes "Device & Premium".
- The exact CSS approach for the 2-column plan grid (new modifier class vs. scoped override) — either is fine as long as two cards don't render in a 3-column track.
- Image selection for the device/premium hero and card images from existing `material/` assets (reuse the current One/Peak images where sensible; the device page is the old "One" imagery since One was the base hardware-focused page).
- Running the full manual QA pass in a browser afterward (homepage, nav, device.html, premium.html, shop, cart, checkout, about, how-it-works) — per CLAUDE.md's "verify changes by loading the page in a browser" guidance, and because this touches ~10 files (adds `js/shop.js` and the `how-it-works.html` BP/ECG sections to the originally-scoped list).

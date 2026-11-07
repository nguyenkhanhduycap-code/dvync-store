# Device + Free/Premium Membership Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's three paid annual memberships (One/Peak/Life) with the report's model: one hardware product (device.html, 1,490,000 VND one-time) plus a two-tier subscription shown via a Free-vs-Premium comparison (premium.html, 499,000 VND/year), with every page, nav entry, and cross-link updated to match.

**Architecture:** This is a content/data migration inside an existing static-site architecture, not a new system. `js/data.js` (`DV_PRODUCTS`, `DV_PLAN_COMPARE`, `DV_CATEGORIES`) stays the single source of truth; `one.html`/`peak.html` are renamed and re-skinned using their own existing template structure (they are near-identical HTML today, per the diff in the design doc); `js/one.js` is renamed `js/membership.js` and its comparison-table/join logic is generalized from N columns to 2. No new JS modules, no build step, no new dependencies.

**Tech Stack:** Static HTML + vanilla ES5-style JS (existing), manual browser verification via Playwright MCP tools (no test framework in this repo — "tests" in this plan mean scripted browser checks, not an automated test suite).

**Spec:** `docs/superpowers/specs/2026-11-07-device-free-premium-design.md`

## Global Constraints

- No build step; plain HTML/CSS/vanilla JS only (CLAUDE.md).
- `js/data.js` is the single source of truth for products/prices; HTML pages also hardcode plan prices/names in several places and must be kept in sync by hand (CLAUDE.md, confirmed in this plan's file survey).
- Prices are whole VND integers; `Cart.money(n)` formats as `"<n with thousands separators> VND"` — never prepend `$` or add decimals.
- `DV_STORE.taxRate` stays `0` (VAT is pre-included in listed prices) — do not touch.
- Device: `price: 1490000`, one-time (no `billing` field). Premium: `price: 499000, billing: 'year'`.
- Free tier is not a purchasable `DV_PRODUCTS` entry — it exists only as a `DV_PLAN_COMPARE` column and its CTA is a plain link to `device.html`, never an add-to-cart action.
- Image assets: reuse existing files under `material/` only; do not fetch or invent new ones.
- Every string a visitor reads under the old "Memberships" label becomes "Device & Premium"; the internal category `id` stays `'memberships'` (just a data key, not shown).

## Review Focus

- **A visitor on `device.html` or `premium.html` who scrolls to the comparison table expects to see themselves represented correctly** (which column has "cur" styling) — the old `CURRENT` plan-matching logic must still highlight the right column for 2 plans, not silently stop highlighting anything.
- **A visitor who clicks "Start free" on the comparison table expects to land on the device page**, not see an "Added to cart" toast for a product that no longer makes sense (the old `id === 'free' → 'one'` special case must be fully removed, not left as dead code that still fires).
- **A visitor who follows an old bookmark or a leftover internal link to `one.html` or `peak.html`** (e.g. from `life.html` if it cross-links) should not hit a 404 — every internal link to the renamed pages must be updated, and this is checked explicitly since file rename is the single most error-prone step here.
- **A visitor browsing on a narrow viewport** sees the 2-card plan grid without an empty gap where a third card used to be — the `.plan-grid` CSS fix must be verified at both desktop and the existing mobile breakpoint, not just desktop.
- **Someone reading `how-it-works.html` top to bottom after the Blood Pressure/ECG sections are deleted** should not land on an orphaned heading, a dangling "Explore D'Vync Life" button, or a renumbered-but-still-"01/02/03" accordion that now starts mid-story — deleting a section from the middle of a scrollytelling page can leave visual or numbering seams if done carelessly.

---

## File Structure

Files modified (no new files created except the rename targets):

- `js/data.js` — `DV_PRODUCTS` memberships section (3→2 entries), `DV_PLAN_COMPARE` (4-col→2-col), `DV_CATEGORIES` label, FAQ/copy strings mentioning "membership"/"free month".
- `js/one.js` → renamed `js/membership.js` — generalized comparison-table rendering, `join()` simplified, `CURRENT` fallback updated.
- `js/layout.js` — mega-menu heading text, footer "Memberships" heading + 3 links → 2.
- `js/shop.js` — `SECTIONS.all`/`SECTIONS.memberships` copy.
- `js/cart-page.js` — empty-cart copy (minor wording, "membership" → "device").
- `one.html` → renamed `device.html` — re-skinned for the hardware product.
- `peak.html` → renamed `premium.html` — re-skinned for the subscription.
- `life.html` — unlinked from nav/footer/other pages; internal self-links (if any) repointed; body content otherwise untouched.
- `index.html` — plan grid section (3 cards → 2), script tag updated (`js/one.js` → `js/membership.js` is N/A here since index.html doesn't load it — confirm at implementation time).
- `how-it-works.html` — plan grid section (3→2 cards), Blood Pressure section deleted, ECG accordion item deleted, closing CTA/script tag reference to `js/hiw.js` unaffected.
- `about.html` — timeline line rewritten.
- `css/style.css` — `.plan-grid` given a 2-column mode.

## Task 1: Data layer — `DV_PRODUCTS`, `DV_PLAN_COMPARE`, `DV_CATEGORIES`

**Files:**
- Modify: `js/data.js:33-79` (the `DV_PRODUCTS` memberships array), `js/data.js:178-183` (`DV_CATEGORIES`), `js/data.js:207-230ish` (`DV_PLAN_COMPARE`), `js/data.js:9-13` (`membershipFaq`)

**Interfaces:**
- Produces: `window.DV_PRODUCTS` containing exactly two `category: 'memberships'` entries with `id: 'device'` and `id: 'premium'`; `window.DV_PLAN_COMPARE.columns` containing exactly two entries `id: 'free'` and `id: 'premium'`; `window.DV_CATEGORIES`'s `memberships` entry with `label: 'Device & Premium'`. These exact ids (`device`, `premium`, `free`) are consumed by Task 2 (`js/membership.js`), Task 3 (HTML pages' `data-join`/`data-plan` attributes), and Task 4 (`js/layout.js`'s `memCards()`, which filters `DV_PRODUCTS` by `category === 'memberships'` — unchanged function, just now sees 2 products instead of 3).

- [ ] **Step 1: Replace the `DV_PRODUCTS` memberships array** (`js/data.js:33-79`) with two entries:
  - `{ id: 'device', category: 'memberships', name: 'D\'Vync Device', badge: null, tier: 'Device', page: 'device.html', navImage: ..., compareImage: ..., price: 1490000, stock: 180, images: [...], video: ..., short: 'The screenless sensor and band. One purchase, wear it every day.', description: [...], features: [...], rating: 4.7, reviewCount: 1284, faq: membershipFaq, reviews: sampleReviews.membership }` — no `billing` field (one-time purchase). Reuse the old `one` entry's `navImage`, `compareImage`, `images`, `video` values (same hardware photography applies). Builder writes final `short`/`description`/`features` copy, constrained to: device-only claims, no mention of tiers or subscriptions.
  - `{ id: 'premium', category: 'memberships', name: 'D\'Vync Premium', badge: null, tier: 'Premium', page: 'premium.html', navImage: ..., compareImage: ..., price: 499000, billing: 'year', stock: 999, images: [...], video: ..., short: 'AI analysis, recovery recommendations and long-term trend reports.', description: [...], features: [...], rating: 4.8, reviewCount: 2310, faq: membershipFaq, reviews: sampleReviews.membership }` — reuse the old `peak` entry's imagery (closest visual match to "advanced software insights"). `stock: 999` (or similar high number) since a subscription isn't physically limited stock the way hardware is — builder's call on exact value, just must not read as a hardware scarcity signal.
- [ ] **Step 2: Update `membershipFaq`** (`js/data.js:9-13`): rewrite the "What happens after the free month?" entry — there is no free-month-then-bill concept anymore. Replace with an entry answering "What's the difference between Free and Premium?" (Free: pulse, steps, sleep duration, forever; Premium: adds AI analysis, recovery recommendations, long-term trend reports, 499,000 VND/year). Keep the other 3 FAQ entries (band included, switch plans, works with phone) — still accurate, only reword "membership" → "Premium subscription" if the entry's wording specifically says "membership" in a way that no longer parses (check each).
- [ ] **Step 3: Replace `DV_CATEGORIES`'s `memberships` entry label** (`js/data.js:180`): `{ id: 'memberships', label: 'Device & Premium' }` — id unchanged, label changed.
- [ ] **Step 4: Replace `DV_PLAN_COMPARE`** (`js/data.js:207-?`) with:
  ```js
  window.DV_PLAN_COMPARE = {
    columns: [
      { id: 'free', title: 'Free', includes: 'D\'Vync sensor and band (sold separately)', cta: 'Start free', price: 'Free forever' },
      { id: 'premium', includes: 'D\'Vync sensor and band (sold separately)', cta: 'Start with Premium' }
    ],
    rows: [
      { icon: 'pulse', label: 'Heart rate', in: ['free', 'premium'] },
      { icon: 'steps', label: 'Step count', in: ['free', 'premium'] },
      { icon: 'gauge', label: 'Sleep duration', in: ['free', 'premium'] },
      { icon: 'coach', label: 'AI-driven deep analysis', in: ['premium'] },
      { icon: 'battery', label: 'Recovery & sleep recommendations', in: ['premium'] },
      { icon: 'clock', label: 'Long-term trend reports', in: ['premium'] }
    ]
  };
  ```
  Row icon names must come from the `icons` map already defined in `js/one.js`/`js/membership.js` (Task 2) — `pulse`, `steps`, `gauge`, `coach`, `battery`, `clock` all already exist in that map (verified: lines 36-49 of current `js/one.js`), so no new icon paths need drawing. The `premium` column has no `price` field (falls through to the existing `'Available at ' + money + '/yr'` default — this already matches "499,000 VND/yr" once Task 2's lookup is repointed).
- [ ] **Step 5: Verify by loading `index.html` in a browser** (Playwright `browser_navigate` + `browser_evaluate`) and running `window.DV_PRODUCTS.filter(p => p.category === 'memberships')` in the console — confirm exactly 2 results with ids `device` and `premium`, correct prices. Also run `window.DV_PLAN_COMPARE.columns.map(c => c.id)` — confirm `['free', 'premium']`.
- [ ] **Step 6: Commit**

```bash
git add js/data.js
git commit -m "data: replace One/Peak/Life memberships with Device + Free/Premium"
```

## Task 2: `js/one.js` → `js/membership.js` — generalize the comparison table and join logic

**Files:**
- Create: `js/membership.js` (copy of `js/one.js` with the changes below)
- Delete: `js/one.js` (after confirming no other file references it — checked in Task 3)

**Interfaces:**
- Consumes: `window.DV_PLAN_COMPARE` (Task 1's 2-column shape), `window.DV_PRODUCTS` (Task 1's `device`/`premium` entries), `document.body.dataset.plan` (set by `device.html`/`premium.html` in Task 3 to `'device'` or `'premium'`).
- Produces: same public surface as before (an IIFE with no exports — DOM side effects only), so Task 3's HTML pages need no interface changes beyond `<script src="js/membership.js">` and `data-plan="device"`/`data-plan="premium"`.

- [ ] **Step 1: Copy `js/one.js` to `js/membership.js`**, update the file's header comment to describe both pages it now serves (device.html, premium.html) instead of "D'Vync One" specifically.
- [ ] **Step 2: Change the `CURRENT` fallback** (`js/membership.js`, was line 8): `var CURRENT = document.body.dataset.plan || 'device';` (was `|| 'one'`).
- [ ] **Step 3: Simplify `join(id, btn)`** (was lines 11-28): remove the `var planId = id === 'free' ? 'one' : id;` special case entirely — replace with `var planId = id;` (the function is now only ever called with a real product id, since the Free CTA is no longer a `[data-join]` button — see Step 5). Keep the rest of the function body unchanged (cart add, toast, button "Added" state).
- [ ] **Step 4: Repoint the free→product lookup used for the comparison table's image/price columns** (was line 60): `var p = window.DV_findProduct(col.id === 'free' ? 'device' : col.id);` (was `'one'`).
- [ ] **Step 5: Change the Free column's CTA rendering** in the `cmp-cta` row builder (was lines 74-78):
  ```js
  html += rowOf('cmp-cta', function (c) {
    if (c.col.id === 'free') return '<a class="btn btn-white" href="device.html">' + esc(c.col.cta) + '</a>';
    return c.col.id === CURRENT
      ? '<button class="btn btn-white" data-join="' + c.col.id + '">' + esc(c.col.cta) + '</button>'
      : '<a class="btn btn-white" href="' + (c.p.page || 'product.html?id=' + c.p.id) + '">' + esc(c.col.cta) + '</a>';
  });
  ```
  (The old code's `c.col.id === CURRENT || c.col.id === 'free'` branch always rendered a `data-join` button for both the current plan and 'free'; now 'free' is its own branch rendering a plain link, and the remaining logic is unchanged for the non-free column.)
- [ ] **Step 6: Leave everything else unchanged** — the icons map, `icon()` helper, feature-list auto-advance, hero parallax, sticky floating button, and scroll-tied `updateCmp()` sticky-table logic are all plan-agnostic and require no edits (confirmed by reading the full file in this plan's research phase).
- [ ] **Step 7: Delete `js/one.js`** only after Task 3 confirms every `<script src="js/one.js">` reference has been changed to `js/membership.js` (do this step last, after Task 3's Step 1).
- [ ] **Step 8: Verify** by loading `device.html` (once Task 3 exists) in a browser, opening dev tools console, confirming no JS errors, and confirming the comparison table renders with exactly 2 columns (`document.querySelectorAll('.cmp-head').length === 1` since `.cmp-head` cells render per-column via `rowOf` — check `document.querySelectorAll('#m-compare .cmp-cell.cmp-head').length === 2`).
- [ ] **Step 9: Commit**

```bash
git add js/membership.js
git rm js/one.js
git commit -m "feat: generalize membership landing page script for Free/Premium (was One/Peak/Life)"
```

## Task 3: Rename and re-skin `one.html` → `device.html`, `peak.html` → `premium.html`

**Files:**
- Create: `device.html` (renamed+edited `one.html`)
- Create: `premium.html` (renamed+edited `peak.html`)
- Delete: `one.html`, `peak.html`
- Modify: `life.html` (only if it contains internal links to `one.html`/`peak.html`)

**Interfaces:**
- Consumes: `js/membership.js` (Task 2), `window.DV_PRODUCTS` ids `device`/`premium` (Task 1).
- Produces: two URLs (`device.html`, `premium.html`) that Task 4 (`js/layout.js`), Task 5 (`index.html`, `how-it-works.html`), and Task 1's `page:` fields must point to consistently.

- [ ] **Step 1: Rename `one.html` to `device.html`**; rename `peak.html` to `premium.html` (`git mv`, preserves history).
- [ ] **Step 2: In `device.html`**, update every One-specific string:
  - `<title>` and `<meta name="description">`: device-focused copy, truthful to "1,490,000 VND, one-time" (no "a year").
  - `<body data-page="one" data-plan="one">` → `<body data-page="device" data-plan="device">`.
  - Hero `<h1>D'Vync One</h1>` → `<h1>D'Vync Device</h1>` (or final copy decision — must not say "One" since that plan no longer exists); hero body copy rewritten to describe the hardware itself, not a membership tier.
  - "3. Buy box" section: `<h3 class="spaced">One</h3>` → `Device`; price line → `1,490,000 VND` with **no** `/yr` suffix (one-time purchase — this is a hard content constraint, not a copy preference); `<button class="btn btn-white btn-block" data-join="one">` → `data-join="device"`, button label → `Join with D'Vync Device` or similar one-time-purchase phrasing (avoid "Join" if it reads as a subscription verb — builder's call, but must not imply recurring billing).
  - `<section class="wrap-m m-compare-wrap">` heading `Compare memberships` → keep or reword to `Free vs Premium` (table itself is now 2-column per Task 1/2).
  - "5. Features" section heading and `role="tablist" aria-label` → drop "One membership" wording.
  - "6. Closing CTA banner": `<h2>Try it free for 30 days.</h2>` and `<button data-join="free">Start your free month</button>` — **replace this entire CTA block**. There is no trial in this model, so the "30 days free" heading is removed. Replace the button with `<a href="premium.html" class="btn btn-white">See Premium</a>` (a plain link, not a `[data-join]` button). This is a hard correctness requirement, not a style choice: Task 2 Step 3 removes `join()`'s `id === 'free'` special case entirely, so **any** `data-join="free"` button left anywhere in the HTML (`device.html`, `premium.html`, or missed elsewhere) would call `window.DV_findProduct('free')`, get `undefined`, and throw inside `join()` when it tries to read `p.images[0]` — a page-breaking JS error, not a silent no-op. Step 7's browser verification must include checking the browser console for exactly this failure mode.
  - "7. Notes" section: drop HSA/FSA-only-if-relevant wording if it was membership-specific; otherwise leave factual disclaimers.
  - Floating sticky button: `data-join="one"` → `data-join="device"`, `aria-label` updated.
  - `<script src="js/one.js">` → `<script src="js/membership.js">`.
- [ ] **Step 3: In `premium.html`**, apply the equivalent edits from the Peak-specific content (per the Task 1 research diff): title/meta → Premium subscription copy (499,000 VND a year); `data-page="premium" data-plan="premium"`; hero/buy-box copy rewritten to describe the software subscription (AI analysis, recovery recommendations, trend reports) rather than a hardware tier; buy-box price `1,290,000 VND/yr` → `499,000 VND/yr`; `data-join="peak"` → `data-join="premium"` (both in the buy box and the sticky footer button); feature-list tab content rewritten to the 3 Premium capabilities from the report (AI analysis, sleep/recovery recommendations, trend reports) instead of Peak's healthspan/stress/health-monitor trio; closing CTA reworded (no "30 days free" framing — Premium has no trial per the report); `<script src="js/one.js">` → `<script src="js/membership.js">`.
- [ ] **Step 4: Check `life.html` for internal links** to `one.html`/`peak.html` (`grep -n "one.html\|peak.html" life.html`); if any exist, repoint them to `device.html`/`premium.html`. If none exist, no edit needed — note this explicitly rather than skipping the check.
- [ ] **Step 5: Verify** by loading `device.html` and `premium.html` directly in a browser (`http://localhost:PORT/device.html`), confirming: page loads with no console errors, title bar shows correct text, buy-box price matches Task 1's data, clicking the primary buy button adds the correct product to cart (check via `Cart.items()`), the comparison table shows 2 columns with the current page's column visually marked (`.cur` class present on exactly one column matching `data-plan`).
- [ ] **Step 6: Commit**

```bash
git add device.html premium.html life.html
git rm one.html peak.html
git commit -m "feat: rename and rewrite membership pages as device.html and premium.html"
```

## Task 4: Navigation, footer, and category copy — `js/layout.js`, `js/shop.js`, `js/cart-page.js`

**Files:**
- Modify: `js/layout.js:31` (mega-menu button text), `js/layout.js:58-62` (footer Memberships block)
- Modify: `js/shop.js:19-23` (`SECTIONS.memberships` object; also review `SECTIONS.all.text`)
- Modify: `js/cart-page.js:31` (empty-cart copy)

**Interfaces:**
- Consumes: Task 1's `DV_PRODUCTS` (via the existing, unchanged `memCards()` function, which is data-driven and needs no edit itself), Task 3's `device.html`/`premium.html` URLs.
- Produces: nav/footer links visible on every page.

- [ ] **Step 1: In `js/layout.js`**, change the mega-menu button text (was `'Memberships ' + chevron`) to `'Device & Premium ' + chevron`. `memCards()` itself needs **no code change** — it already derives its 2 (now) cards from `DV_PRODUCTS` filtered by `category === 'memberships'`, so it automatically shows Device and Premium once Task 1 lands.
- [ ] **Step 2: In `js/layout.js`**'s footer block (was lines 58-62), change the heading `<h4>Memberships</h4>` to `<h4>Device & Premium</h4>` and replace the 3 hardcoded `<li>` links with 2:
  ```js
  '<div><h4>Device &amp; Premium</h4><ul>' +
    '<li><a href="device.html">D\'Vync Device</a></li>' +
    '<li><a href="premium.html">D\'Vync Premium</a></li>' +
    '<li><a href="shop.html?cat=memberships">Compare</a></li>' +
  '</ul></div>' +
  ```
  (Dropped the old 3rd plan link since there are now only 2 products; kept a "Compare" link to the shop filter since that still functions.)
- [ ] **Step 3: In `js/shop.js`**, update `SECTIONS.memberships`: `eyebrow: 'Device & Premium'`, title and `text` reworded to drop "every membership"/"first month free" framing — e.g. `text: 'One device, one subscription. See what Free and Premium each include.'` (builder's exact wording, constrained to: no trial/first-month-free claim, no plural "memberships"). Also check `SECTIONS.all.text` ("Start with a membership. Every one includes the band...") — reword similarly since "a membership" implies multiple tiers to choose from; e.g. `'Start with the device. Then make it yours with straps and accessories.'`
- [ ] **Step 4: In `js/cart-page.js:31`**, change `'<p>Start with a membership. The band is included.</p>'` to wording that doesn't imply multiple membership tiers — e.g. `'<p>Start with the device.</p>'` — the band is part of the device purchase per Task 1, so "the band is included" no longer needs stating separately (device.html itself should clarify what's in the box, per Task 3).
- [ ] **Step 5: Verify** by loading any page in a browser, opening the header mega-menu, confirming it shows "Device & Premium" with exactly 2 cards (Device, Premium) linking to `device.html`/`premium.html`; scrolling to the footer, confirming the same heading and 2 links; visiting `shop.html?cat=memberships`, confirming the eyebrow/title/text no longer says "membership" (plural framing) and exactly 2 products are listed in the grid.
- [ ] **Step 6: Commit**

```bash
git add js/layout.js js/shop.js js/cart-page.js
git commit -m "feat: update nav, footer and shop copy for Device & Premium"
```

## Task 5: Homepage, How It Works, and About page content

**Files:**
- Modify: `index.html:150-199` (plan grid section)
- Modify: `how-it-works.html:198-224` (delete Blood Pressure section + ECG accordion item), `how-it-works.html:306-344` (plan grid section)
- Modify: `about.html:76` (timeline line)
- Modify: `css/style.css:189` (`.plan-grid` 2-column support)

**Interfaces:**
- Consumes: Task 1's `device`/`premium` product data (for prices quoted in static HTML — these are hand-copied, not rendered from `DV_PRODUCTS`, per the CLAUDE.md note that plan prices are duplicated in HTML), Task 3's `device.html`/`premium.html` filenames.

- [ ] **Step 1: In `css/style.css`**, add a 2-column variant of `.plan-grid`. Simplest approach matching the codebase's existing modifier-class pattern (seen elsewhere, e.g. `.plan.featured`): add a new rule `.plan-grid-2 { grid-template-columns: repeat(2, 1fr); }` immediately after the existing `.plan-grid` rule (`css/style.css:189`), and in the same mobile-breakpoint block that already collapses `.plan-grid` to 1 column (`css/style.css:271`, `.plan-grid, .steps { grid-template-columns: 1fr; }`), add `.plan-grid-2` to that selector list so it also collapses on mobile.
- [ ] **Step 2: In `index.html`**, replace the 3-card `<div class="plan-grid">` (lines ~151-199) with a 2-card `<div class="plan-grid plan-grid-2">` containing a Device card and a Premium card, each with: image (reuse old One/Peak card images), name, one-line description, price (`1,490,000 VND` with no `/year` for Device; `499,000<small> VND/year</small>` for Premium), and a button linking to `device.html`/`premium.html`. Update the section's `<h2>`/`<p>` intro copy (was "Find the membership for you" / "Every membership includes the band, free shipping and your first month on us.") to match the new 2-product reality — no "first month on us" claim (no trial exists in this model).
- [ ] **Step 3: In `how-it-works.html`**, delete the entire "5. Blood pressure" `<section class="wrap-h hiw-split">` block (lines ~198-207) including its "Explore D'Vync Life" CTA. In the "6. Heart" section's accordion (lines ~218-221), delete the `01` item ("Take an ECG anytime... Available with D'Vync Life") and renumber the remaining two items' `<span class="nacc-n">` values from `02`/`03` to `01`/`02`, and change whichever remaining item was `is-open` so exactly one item still has `class="nacc-item is-open"` / `aria-expanded="true"` (the deleted `01` item currently holds that state — move it to the new first item so the accordion still opens with something visible on page load).
- [ ] **Step 4: In `how-it-works.html`**'s "10. Memberships" section (lines ~306-344), apply the same 2-card replacement as Step 2 (reuse the same Device/Premium card markup, adjusted for this page's class names — confirm whether `how-it-works.html` uses the identical `.plan-grid`/`.plan` classes as `index.html`, which the file read in this plan's research confirmed it does), and add `plan-grid-2`. Update the section's intro copy (was "Pick your membership." / "Every plan includes the band, the app and free shipping.") similarly.
- [ ] **Step 5: In `about.html:76`**, rewrite the timeline line. Was: `<li data-reveal="180"><span class="tl-year">2025</span><h3>Memberships launch</h3><p>D'Vync One, Peak and Life arrive, bundling the band with the app, so every member gets free hardware upgrades instead of buying a new device each year.</p></li>`. New copy must describe the device + freemium software launch instead (no mention of One/Peak/Life, no "free hardware upgrades" claim that contradicts a one-time hardware purchase). Exact wording left to the builder, constrained to: truthful to a single hardware SKU + Free/Premium software launching together.
- [ ] **Step 6: Also in `about.html`**, check the following line (`2026` entry, `D'Vync Age, blood pressure insights and on-demand ECG join the app...`) — since Task 5 Step 3 removes blood pressure/ECG from `how-it-works.html` as unsupported-by-the-report features, decide whether this `about.html` line needs the same treatment. **This is left to the builder as a judgment call**: either remove "blood pressure insights and on-demand ECG" from this sentence (consistent with Step 3's reasoning) or leave it as a stated future-roadmap item distinct from what's sold today (the sentence is phrased as a past/ongoing product evolution, not a current purchasable feature, so it's not automatically a mismatch) — but the decision must be made deliberately, not skipped.
- [ ] **Step 7: Verify** by loading `index.html`, `how-it-works.html`, and `about.html` in a browser at both desktop (e.g. 1440px) and a mobile width (e.g. 390px) — confirm the plan grids show exactly 2 cards with no empty third column or awkward gap at either width; confirm `how-it-works.html`'s accordion still opens with one item expanded and no numbering gap; confirm no remaining visible text says "One", "Peak", or "Life" as a product name anywhere on these three pages (`document.body.innerText` search for these strings, allowing for the fact "Life" and "One" are common English words — search specifically for `"D'Vync One"`, `"D'Vync Peak"`, `"D'Vync Life"` as exact substrings instead).
- [ ] **Step 8: Commit**

```bash
git add index.html how-it-works.html about.html css/style.css
git commit -m "feat: update homepage, how-it-works and about page for Device + Free/Premium"
```

## Task 6: Full-site consistency sweep and manual QA

**Files:**
- No new modifications expected; this task is verification and any small fixes it surfaces.

**Interfaces:**
- Consumes: everything from Tasks 1-5.

- [ ] **Step 1: Repo-wide grep for leftover references** — run `grep -rn "D'Vync One\|D'Vync Peak\|D'Vync Life\|one\.html\|peak\.html" --include=*.html --include=*.js .` from the repo root (excluding `material/`, `.git/`, `node_modules/` if present) and confirm the only remaining hits are inside `life.html` itself (its own retained body copy, per the design doc's non-goal) and nowhere else. Fix any other hit found.
- [ ] **Step 2: Start a local server** (`python -m http.server PORT` from the repo root, per CLAUDE.md) and, using the Playwright MCP tools, walk the full path a real visitor would take: homepage → click "Device & Premium" mega-menu → click Device card → `device.html` loads → scroll to comparison table → click "Start free" → lands on `device.html` (itself, confirming the link works and doesn't error) → go back → click the Device buy button → confirm toast/cart badge updates → go to `premium.html` directly → confirm its buy button adds `premium` to cart → go to `cart.html` → confirm both line items show correct VND prices and names → go to `checkout.html` → confirm the order summary totals correctly.
- [ ] **Step 3: Visit `shop.html?cat=memberships`** and confirm exactly 2 products render, both linking correctly.
- [ ] **Step 4: Visit `how-it-works.html` and `about.html`** end to end, confirming the Review Focus item about the ECG accordion/BP section deletion reads cleanly with no orphaned headings or broken numbering.
- [ ] **Step 5: Resize the browser to a mobile width (390px)** and repeat a quick pass over `index.html`, `how-it-works.html`, `device.html`, `premium.html` confirming no horizontal overflow and the 2-card grids collapse to 1 column per Task 5's CSS change.
- [ ] **Step 6: Fix anything Steps 1-5 surface**, then commit any resulting fixes separately from the task commits above.

```bash
git add -A
git commit -m "fix: address issues found in full-site QA pass for Device/Premium migration"
```
(Only run if Step 6 found something to fix; otherwise this task produces no commit of its own.)

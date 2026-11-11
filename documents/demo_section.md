
### Script

[Slide 16 – Live demo: D'Vync website prototype. Browser ready on localhost, cart empty. Speaker's laptop, one tab per page – see the demo checklist.]

[9:00 – Transition in]

Every stage of that funnel leads to one place: our website. It has three jobs: communication, capturing leads, and conversion. Let me show you how it does all three.

[9:10 – Customer journey and homepage]

[SWITCH: to the browser, homepage tab] Imagine I watched a creator's daily routine video on TikTok and tapped the link. [PAUSE – page loads] I land on the homepage, and it must pass the Grunt Test in seconds. What is it? [POINT: hero headline "The proven wearable for better health and performance"] A wearable for better health and performance. How does it help me? [POINT: "Know your body every day. Free to start, with Premium when you want more."] I can know my body every day, free to start. What do I do next? [POINT: header "Device & Premium" menu] One clear menu: Device and Premium. That is communication: the page explains itself. [SCROLL: down to the 01 Wear / 02 Learn / 03 Improve steps] Below, three steps sum it up: Wear, Learn, Improve.

[9:52 – Site hierarchy]

[POINT: header menu – Device & Premium, Accessories, How it works, Why D'Vync?, Blog, Help] Now notice the menu: only six items. That keeps the site simple and scalable, and every main page stays within three clicks of the homepage.

[10:04 – Design]

[POINT: header logo – circle with lime dot] The design follows our brand kit: a circle logo, black, off-white and one lime accent, Barlow Condensed for headings and Montserrat for everything else, [SCROLL: down to the "Free to start, Premium when you want more" section] and our tagline, "Made to be worn. Made to be forgotten." Sporty for athletes, calm for minimalists.

[10:17 – Key pages and the path to checkout]

Let's follow the journey. [CLICK: How it works] [PAUSE – page loads] One click, and How it works explains the device in plain words. [CLICK: Device & Premium ▾ → D'Vync Premium] [PAUSE – page loads] Two clicks, and I reach Premium, [SCROLL: to the Free vs Premium table] with two columns: Free and Premium, side by side. [POINT: Monthly/Yearly toggle above the buy button] Premium comes in two billing options, monthly or yearly, so it fits different budgets. [SCROLL: show the floating "Start Premium" button] As I scroll, the button follows me. I click it, [CLICK: Start Premium] then the cart icon, [CLICK: cart icon in the header] then Checkout. [CLICK: Checkout] [PAUSE – page loads] Just three steps from plan to payment. [POINT: "Demo checkout" banner] The form is short: contact, address, delivery and payment. [FILL: email, phone, first and last name, address, city, region, postal code, country = Vietnam (the list starts with United States, so pick it); then test card 4242 4242 4242 4242, expiry 12/30, CVC 123 – keep talking while you type] This is capturing: we collect the customer's details. It is a demo, so I use the test card and no real money moves. [CLICK: Place order] [PAUSE – about 2 seconds, the thank-you page loads] And here is the thank-you page, with my order number: conversion, a visitor becomes a customer. [POINT: "Thank you for your order!" and the order number]

[10:55 – Pricing note]

[POINT: order total on the thank-you page] Prices are in dong, with VAT included. Premium is 59,000 dong a month, or 499,000 dong a year if you pay yearly. The device itself is 1,490,000 dong, one time, sold separately.

[11:05 – Product page, trust pages, mobile]

We also sell accessories. [CLICK: Accessories] [SCROLL: the "New arrivals" row sideways with the arrow button to the last card] [CLICK: Halo Mesh Band – Rose Gold] [PAUSE – page loads] Two clicks take me to a product page, with photos, an Add to cart button, the stock level, reviews, an FAQ, and shipping and returns. [POINT: gallery, "Add to cart", "Only 6 left in stock"; OPEN accordions: Shipping, FAQ, Reviews] The reviews are samples for now. [SCROLL: to footer – Shipping, Returns & refunds, Health data privacy, Contact us] Our trust pages sit in the footer. And since many visitors arrive on their phones, the site works on mobile too. [SWITCH: mobile view in browser developer tools, 2 seconds, then back]

[11:55 – Infrastructure]

[NO CLICKS – stay on the page, look at the audience] A quick word on infrastructure. Today this runs as a local prototype: no live domain yet. At launch we need four things: a domain name, web hosting, this same software, and tools like a payment gateway and analytics.

[12:09 – Why our website is stronger]

[NO CLICKS – stay on the page, look at the audience] One point makes our website stronger: its design. Many shop sites interrupt you with pop-ups and flashing banners. Ours stays calm, just like our device: lots of space, big photos, and no pop-up unless you click. A site that never interrupts you, for a device that never interrupts you.

[12:28 – Transition out]

From a TikTok video to checkout, in just a few clicks. Now let me bring everything together. [SWITCH: back to slides]

## 3. Cue card

| Step | Do | Keywords |
| --- | --- | --- |
| 1. Transition in | Look at the audience, switch to browser | funnel → website · 3 jobs |
| 2. Journey + Grunt Test | Homepage tab; point at headline, lead, menu; scroll to Wear/Learn/Improve | TikTok link · Grunt Test · "Device & Premium" menu |
| 3. Hierarchy | Point at the header menu | 6 menu items · simple + scalable · 3-click rule |
| 4. Design | Point at logo; scroll to tagline section | black + off-white · lime · Barlow Condensed/Montserrat · tagline |
| 5. Key pages + checkout | How it works → Device & Premium ▾ → Premium → Free vs Premium table → point at Monthly/Yearly toggle → Start Premium → cart icon → Checkout → fill form → Place order | 1 click · 2 clicks · Free vs Premium · Monthly/Yearly toggle · 3 steps to payment · demo checkout |
| 6. Pricing note | Point at order total | VND · VAT included · 59,000/mo or 499,000/yr Premium · 1,490,000 device |
| 7. Product + trust + mobile | Accessories → Rose Gold band; accordions; footer; phone view | 2 clicks · "Only 6 left" · sample reviews · footer policies · phone |
| 8. Infrastructure | Stay on the page or switch to slides | prototype · laptop · HTML/CSS/JS · domain · hosting · software · tools |
| 9. Why stronger | Stay on the page | design · no pop-ups · calm |
| 10. Transition out | Switch back to slides | video → checkout · bring it together |

## 4. Demo checklist

**Before the presentation**
- Start the local server from the project folder, for example `python -m http.server 8000`, then open `http://localhost:8000/index.html`. `[VERIFY: your real localhost address and how you start the site]`
- Empty the cart: browser console → `localStorage.clear()` or `Cart.clear()`. The cart badge in the header must show nothing.
- Browser zoom 100%, full screen, bookmarks bar hidden, notifications off, sound off.
- Do not open the `material/` folder on screen: several file names still contain "WHOOP".
- Prepare the phone view once (developer tools, device toolbar, a phone size) so it switches in about 2 seconds.

**Tabs to open in advance (in this order)**
1. `index.html` (homepage), the starting tab
2. `premium.html` (backup if the menu is slow)
3. `product.html?id=mesh-rose-gold` (backup for the product page)
4. `checkout.html` (backup; it needs something in the cart to show a summary)
5. The slides

**Exact click path (localhost, re-verified 7 Nov 2026)**

| Click | Where | Page |
| --- | --- | --- |
| 0 | Open homepage | `index.html` |
| 1 | Menu: How it works | `how-it-works.html` |
| 2 | Menu: Device & Premium ▾ → D'Vync Premium | `premium.html` |
| 3 | (Optional) click "Yearly" in the Monthly/Yearly toggle, above the buy button, if you want to demo the 499,000 VND/year plan instead of the default monthly one | `premium.html` |
| 4 | Floating "Start Premium" (adds Premium to cart at whichever billing cycle is selected, a pop-up appears, you stay on the page) | `premium.html` |
| 5 | Cart icon in the header | `cart.html` |
| 6 | "Checkout" | `checkout.html` (stop here until you fill the form; "Demo checkout" banner) |
| — | Menu: Accessories | `accessories.html` |
| — | Scroll "New arrivals" row to the last card, click "Halo Mesh Band – Rose Gold" | `product.html?id=mesh-rose-gold` ("Only 6 left in stock") |

The Device & Premium menu opens on hover on desktop; click it if it does not. The billing toggle defaults to Monthly every time the page loads (it does not remember your last choice), so click "Yearly" again if you reload the page and want the yearly price. The toast pop-up in step 4 disappears after about 3 seconds — if it's gone, the cart icon (step 5) still works the same.

**Screenshot backups (if the local server fails)**
1. Homepage hero with "Device & Premium" menu open
2. Homepage Wear / Learn / Improve steps
3. Premium page, Free vs Premium comparison table with the Monthly/Yearly toggle and the floating "Start Premium"
4. Cart with Premium in it (59,000 VND for monthly, or 499,000 VND if you switched to yearly)
5. Checkout with the "Demo checkout" banner
6. Thank-you page with an order number
7. Accessories, New arrivals row
8. Rose Gold product page with "Only 6 left in stock" and the open accordions
9. Footer (Shipping, Returns & refunds, Health data privacy, Contact us)
10. Homepage in phone view

## 5. Likely lecturer questions

**1. Why is the site not online yet, and how will you launch it?**
It is a working prototype on a local computer. To launch we need the four elements from the course: a domain name, web hosting, the website software, and tools such as payment and analytics. `[VERIFY: domain name, registrar, hosting provider, payment gateway]`

**2. Why does the device cost 1,490,000 VND but the site doesn't let me buy it with a discount or trial?**
The device is a one-time hardware purchase, separate from the software. Free comes with the device at no extra cost for as long as you own it; Premium is 59,000 VND a month or 499,000 VND a year (about a 30% saving if you pay yearly) and can be cancelled any time, with no trial period in this model.

**3. Is every page really within three clicks of the homepage?**
Content pages are: one click from the menu or footer, two for the Premium page or a band. Buying takes a few more clicks because cart and checkout are separate steps.

## 6. Items to verify

1. Your real localhost address and how you start the site.
2. Launch plan: domain name, registrar, hosting provider, payment and analytics tools. None of these are in the code.
3. Battery: the script's other slides may still say "5 to 7 days"; the site says "5-day battery". No conflict in this demo section since it doesn't mention battery.
4. The stock message "Only 6 left in stock" comes from the sample data file. Check it still shows before presenting.
5. Several image and video files carry "WHOOP" in their names. Don't zoom into the `material/` folder on screen.
6. Timing: as written, this section runs about 478 spoken words (≈221 seconds), over the 180-second slot even before clicking time. Rehearse with a timer and trim "Key pages and the path to checkout" or "Product page, trust pages, mobile" first if you need to cut.
7. Premium billing toggle (added 8 Nov 2026): the toggle resets to Monthly on every page load/reload — it does not remember a prior choice. If your rehearsal relies on the floating "Start Premium" adding the yearly plan, you must click "Yearly" every time right before you click "Start Premium," including after any page refresh during the live demo.

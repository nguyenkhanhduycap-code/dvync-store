== Website Storefront & Infrastructure
- *Source Code Repository:* #link("https://github.com/nguyenkhanhduycap-code/dvync-store")[github.com/nguyenkhanhduycap-code/dvync-store]
- *Technical Stack & Implementation:* 100% custom-coded by the technical taskforce from first principles without drag-and-drop website builders (e.g., Wix, Shopify). Built on a high-efficiency *Vanilla Web Architecture* (Semantic HTML5, Modular CSS3 with Custom Design Tokens, and Vanilla JavaScript ES6+), ensuring zero framework overhead, instant DOM hydration, and sub-0.8s load times.
- *Information Architecture & Navigation Engine:*
  - *Dynamic Component Ingestion (`layout.js`):* Injects the global announcement bar, header with interactive multi-tier mega-menu, and footer across all 15+ pages.
  - *Centralized Catalog Database (`data.js`):* Serves as the single source of truth managing SKUs, real-time pricing for the device and the Premium subscription, accessories, and customer reviews.
  - *Persistent E-Commerce Pipeline (`cart.js`, `checkout.js`):* Handles client-side cart mutation via `localStorage`, promo code evaluation, and a simulated checkout form, with domestic payment gateways (VietQR, MoMo, ZaloPay) planned for launch.
- *Calm Technology & Responsive Viewport:* Built with *Calm Technology* (Weiser & Brown, 1996) in mind: D'Vync operates with *zero mobile app* to protect users from smartphone notification loops, and biometric telemetry and recovery graphs are synced directly via the web portal. The storefront itself is responsive and tested on both laptop (13"--16" at 1080p/Retina) and phone viewports, since many visitors arrive from social media on mobile.

#v(50pt)
#align(center)[
  #block(
    stroke: 0.8pt + c-gray.lighten(40%),
    radius: 6pt,
    inset: 2pt,
    fill: white,
    image("sitemap.svg", width: 100%)
  )
  #v(4pt)
  #text(size: 8.5pt, fill: c-gray.darken(20%), style: "italic")[
    Figure 4: D'Vync Storefront Information Architecture & Sitemap Tree Hierarchy
  ]
]

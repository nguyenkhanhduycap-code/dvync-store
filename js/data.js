/* D'Vync catalog, store settings and blog content.
   Every page reads from here, so edit products, prices and stock in one place.
   Reviews are sample content for this demo store. */
(function () {
  'use strict';

  var M = 'material/';

  var membershipFaq = [
    { q: 'Is the band included with a membership?', a: 'Yes. Every membership ships with the D\'Vync band, a knit strap and a charger at no extra cost. When you renew, you keep the same band.' },
    { q: 'Can I switch plans later?', a: 'You can upgrade at any time and only pay the difference for the rest of your term. Downgrades take effect at your next renewal.' },
    { q: 'What happens after the free month?', a: 'Your annual membership starts automatically on day 31. Cancel any time before then and you won\'t be charged. Just return the band within 30 days.' },
    { q: 'Does it work with my phone?', a: 'D\'Vync works with iOS 16+ and Android 10+ through the free D\'Vync app. It also syncs with Apple Health, Google Health Connect and Strava.' }
  ];
  var bandFaq = [
    { q: 'What size should I get?', a: 'Every band is one size fits all. The adjustable fit suits wrists from about 13 to 21 cm.' },
    { q: 'Is it compatible with every D\'Vync sensor?', a: 'Yes. All bands use the same quick-release clasp and fit every D\'Vync sensor.' },
    { q: 'How do I clean it?', a: 'Hand-wash with mild soap and cool water, then let it air dry. Avoid the dryer and direct heat.' }
  ];

  var sampleReviews = {
    membership: [
      { name: 'Linh T.', rating: 5, date: '2026-09-02', title: 'Changed how I plan my week', text: 'I was skeptical of the recovery score at first, but after a month it lined up with how I actually felt. I now plan hard sessions around it.' },
      { name: 'Marcus B.', rating: 4, date: '2026-08-18', title: 'Great sleep coaching', text: 'Sleep target alone was worth it. Battery lasts about five days for me. Wish the app had a few more widgets.' },
      { name: 'Aiko S.', rating: 5, date: '2026-07-29', title: 'No screen is a feature', text: 'I stopped checking my wrist mid-workout. The data waits for me in the app and the band is comfortable enough to forget.' }
    ],
    band: [
      { name: 'Priya K.', rating: 5, date: '2026-09-10', title: 'Soft and secure', text: 'Comfortable to sleep in, dries fast after workouts and the clasp has never slipped.' },
      { name: 'Daniel R.', rating: 4, date: '2026-08-03', title: 'Looks great', text: 'Colour is exactly like the photos. Runs slightly large, so I sized down.' }
    ]
  };

  window.DV_PRODUCTS = [
    {
      id: 'one', category: 'memberships', name: 'D\'Vync One', badge: null, tier: 'One', page: 'one.html',
      navImage: M + 'Frame_2085654392-1__1_ (1).webp',
      compareImage: M + 'One__2_.webp',
      price: 990000, billing: 'year', stock: 120,
      images: [M + 'plan-one.webp', M + 'Quantify_how_your_body_is_feeling__fr___1_.webp', M + 'dv-Strain__fr_.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'Quality fitness tracking and coaching at the best price.',
      description: [
        'D\'Vync One gives you the essentials: a daily recovery score, sleep tracking and a strain target that adapts to how ready your body is.',
        'It\'s the simplest way to stop guessing. Wear the band around the clock and open the app each morning for a clear plan.'
      ],
      features: ['Recovery, sleep and strain scores', 'Personalised daily coaching', 'Workout auto-detection', 'Community challenges', 'Band, knit strap and charger included'],
      rating: 4.7, reviewCount: 1284, faq: membershipFaq, reviews: sampleReviews.membership
    },
    {
      id: 'peak', category: 'memberships', name: 'D\'Vync Peak', badge: 'Most popular', tier: 'Peak', page: 'peak.html',
      navImage: M + 'Frame_2085654392__4_.webp',
      compareImage: M + 'Peak__3_.webp',
      price: 1290000, billing: 'year', stock: 64,
      images: [M + 'plan-peak.webp', M + 'dv-Extend_your_prime-fr.webp', M + 'Optimize_your_sleep__fr_.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'Key health and longevity insights to perform for the long run.',
      description: [
        'Peak adds the long view: healthspan and pace-of-aging insights, heart screening with alerts and cycle-aware coaching.',
        'It\'s built for people who want to perform today without trading away tomorrow.'
      ],
      features: ['Everything in One', 'Healthspan & pace of aging', 'Heart screener & irregular rhythm alerts', 'Cycle insights', 'Monthly performance report'],
      rating: 4.8, reviewCount: 2310, faq: membershipFaq, reviews: sampleReviews.membership
    },
    {
      id: 'life', category: 'memberships', name: 'D\'Vync Life', badge: 'Low stock', tier: 'Life', page: 'life.html',
      navImage: M + 'LIFE__1_ (1).webp',
      compareImage: M + 'Life__2_.webp',
      price: 1890000, billing: 'year', stock: 8,
      images: [M + 'plan-life.webp', M + 'Health_monitor__fr_.webp', M + 'Get_daily_Blood_Pressure_Insights.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'Our most powerful sensor for clinical-grade health data.',
      description: [
        'Life pairs our most advanced sensor with the deepest insights: blood pressure trends, on-demand ECG and priority support.',
        'If you want the most complete picture of your health on your wrist, this is it.'
      ],
      features: ['Everything in Peak', 'Blood pressure insights', 'On-demand ECG', 'Premium Luxe clasp', 'Priority member support'],
      rating: 4.9, reviewCount: 812, faq: membershipFaq, reviews: sampleReviews.membership
    }
  ];

  // ---------------- Bands (Accessories) ----------------
  // Six band families, like the Whoop shop's "Shop by band". Each family sets the
  // price, copy and features; each colourway lists its images in this order:
  // transparent studio shots first (render, then flat lay), then lifestyle photos.
  window.DV_FAMILIES = [
    { id: 'knit', label: 'AeroKnit', name: 'AeroKnit Band', price: 490000, image: M + 'Midnight_MG-8oJ5TTln-large.png',
      short: 'Soft, breathable knit made for 24/7 wear.',
      description: ['Our everyday band. A lightweight knit that breathes during training, stays soft through the night and dries fast after a shower.'],
      features: ['Breathable recycled-yarn knit', 'Quick-release clasp', 'Hand-wash and air dry'] },
    { id: 'reflective', label: 'AeroKnit Reflective', name: 'AeroKnit Reflective Band', price: 590000, image: M + 'reflective 5.0eclips-eC-_Dpdd-large.png', studioTile: true,
      short: 'Knit with reflective stripes that light up in headlights.',
      description: ['The same soft knit, woven with reflective stripes so you stay visible on early runs and late rides.'],
      features: ['Reflective woven stripes', 'Breathable knit', 'Quick-release clasp'] },
    { id: 'sport', label: 'Velocity', name: 'Velocity Band', price: 590000, image: M + 'gravity lifestyle 2-rxHjpgvR-large.png',
      short: 'Smooth, sweat-proof silicone with airflow channels.',
      description: ['Built for the hardest sessions. Flexible silicone with ventilated channels that keep the sensor in place when you sweat.'],
      features: ['Sweat- and water-proof silicone', 'Ventilated airflow channels', 'Wipe clean in seconds'] },
    { id: 'trail', label: 'Summit', name: 'Summit Band', price: 790000, image: M + 'PDP_Navigator_Evergr-jcYqI868-large.png',
      short: 'Hook-and-loop band built for the outdoors.',
      description: ['A rugged, adjustable hook-and-loop band with a reinforced edge, made for climbing, hiking and everything in between.'],
      features: ['Infinitely adjustable fit', 'Abrasion-resistant weave', 'Reinforced contrast edge'] },
    { id: 'mesh', label: 'Halo', name: 'Halo Mesh Band', price: 1490000, image: M + 'PDP_Meridian_Gold_2 -dzqNTzPn-large.jpeg',
      short: 'Fine stainless-steel mesh with a sliding clasp.',
      description: ['Polished stainless-steel mesh that drapes like fabric and adjusts with a sliding clasp. Made to go from the office to dinner.'],
      features: ['Stainless-steel mesh', 'Sliding adjustable clasp', 'Polished finish'] },
    { id: 'leather', label: 'Heritage', name: 'Heritage Leather Band', price: 1290000, image: M + '3 (1)-ToWZysso-large.png',
      short: 'Smooth full-grain leather with a classic buckle.',
      description: ['Full-grain leather that softens with wear, finished with a metal buckle and keeper for a timeless look.'],
      features: ['Full-grain leather', 'Metal buckle and keeper', 'Wipe with a dry cloth'] }
  ];
  window.DV_family = function (id) {
    return window.DV_FAMILIES.filter(function (f) { return f.id === id; })[0] || null;
  };

  // "Shop by band" groups, organised the way the Whoop shop groups its bands:
  // reflective knit sits inside the Knit group. Order matches the shop page.
  window.DV_BAND_GROUPS = [
    { id: 'knit', label: 'AeroKnit', families: ['knit', 'reflective'], image: M + 'Midnight_MG-8oJ5TTln-large.png',
      description: 'Soft, breathable knit for 24/7 wear, including reflective styles for early runs and late rides.' },
    { id: 'mesh', label: 'Halo', families: ['mesh'], image: M + 'PDP_Meridian_Gold_2 -dzqNTzPn-large.jpeg',
      description: 'Polished stainless-steel mesh with a sliding clasp, made to go from the office to dinner.' },
    { id: 'trail', label: 'Summit', families: ['trail'], image: M + 'PDP_Navigator_Evergr-jcYqI868-large.png',
      description: 'Rugged hook-and-loop bands built for climbing, hiking and everything outdoors.' },
    { id: 'leather', label: 'Heritage', families: ['leather'], image: M + 'Camel_MG-4fios4u5-large.png',
      description: 'Full-grain leather with a classic buckle that softens the more you wear it.' },
    { id: 'sport', label: 'Velocity', families: ['sport'], image: M + 'gravity lifestyle 2-rxHjpgvR-large.png',
      description: 'Sweat-proof silicone with airflow channels for your hardest sessions.' }
  ];
  // Group by id, or the group that contains a family id (so family=reflective still works)
  window.DV_bandGroup = function (id) {
    return window.DV_BAND_GROUPS.filter(function (g) { return g.id === id || g.families.indexOf(id) > -1; })[0] || null;
  };

  // id, family, colour, images, number of transparent studio images at the start, extra fields
  function band(id, family, color, images, studio, extra) {
    var f = window.DV_family(family);
    var p = {
      id: id, category: 'bands', family: family, color: color, name: f.name + ' – ' + color, badge: null,
      price: f.price, stock: 40, option: null,   // bands are one size fits all
      images: images.map(function (n) { return M + n; }), studio: studio,
      short: f.short, description: f.description, features: f.features,
      rating: 4.7, reviewCount: 180, faq: bandFaq, reviews: sampleReviews.band
    };
    for (var k in extra || {}) p[k] = extra[k];
    return p;
  }

  var BANDS = [
    band('reflective-night', 'reflective', 'Night', ['reflective 5.0eclips-eC-_Dpdd-large.png', 'PDP_Eclipse-2-SCloxQeK-large.png'], 2, { isNew: true, badge: 'Reflective', rating: 4.8, reviewCount: 64 }),
    band('reflective-red', 'reflective', 'Red', ['mg relfective solar-xsBTEe39-large.png', 'PDP_Solar-2 (1)--HsZWjSV-large.png'], 2, { isNew: true, badge: 'Reflective', rating: 4.8, reviewCount: 41 }),
    band('knit-forest', 'knit', 'Forest', ['Niall render 2 5-m_zuq9VQ-large.png', 'Niall 5 flat 2-FKOT68Bn-large.png'], 2, { isNew: true, badge: 'New', rating: 4.9, reviewCount: 37 }),
    band('knit-coffee', 'knit', 'Coffee', ['PDP_Coffee-39ePZKHd-large.png', 'Coffee MG horizontal-MPXoLgE7-large.png'], 2, { isNew: true, badge: 'New', reviewCount: 52 }),
    band('knit-coffee-gold', 'knit', 'Coffee & Gold', ['mg coffee and golds-FfxYkqOz-large.png', 'Coffee with Gold MG -BGVFwfXE-large.png'], 2, { price: 590000, reviewCount: 88 }),
    band('knit-navy', 'knit', 'Navy', ['Render_R_1300x1500_5-kRT-flaM-large.png', 'Flat_overlay_2-52ruFqFW-large.png', 'Midnight_MG-8oJ5TTln-large.png'], 2, { bestSeller: true, rating: 4.8, reviewCount: 612 }),
    band('knit-graphite', 'knit', 'Graphite', ['grpahtie titanium mg-G_aBiby1-large.png', 'MG graphite with tia-eZQlh-Pj-large.png'], 2, { bestSeller: true, reviewCount: 455 }),
    band('knit-matte-black', 'knit', 'Matte Black', ['matte black-xea3HZW5-large.png'], 1, { stock: 4, reviewCount: 301 }),
    band('knit-lagoon', 'knit', 'Lagoon', ['Render R 1300x1500 T-va19SwU7-large.png', 'Render Flat overlay -vQQfSSxP-large.png', 'Tide Lifestyle 1-L3nPOxkj-large.png'], 2, { isNew: true, badge: 'New', reviewCount: 29 }),
    band('sport-cloud', 'sport', 'Cloud', ['Render R 1300x1500 (-6ERujYmb-large.png', 'Flat overlay (1)-fmBAlD-R-large.png', 'Lifestyle-loRDxBJm-large.png'], 2, { bestSeller: true, rating: 4.8, reviewCount: 534 }),
    band('sport-carbon', 'sport', 'Carbon', ['Render_R_1300x1500_7-tSASCoss-large.png', 'Flat_overlay_30-k2f7DWbY-large.png', 'gravity lifestyle 2-rxHjpgvR-large.png'], 2, { bestSeller: true, rating: 4.9, reviewCount: 1208 }),
    band('sport-butter', 'sport', 'Butter', ['Render_R_1300x1500_8-5-8bPe5x-large.png', 'whisper_Flat overlay-RjFL5amZ-large.png'], 2, { isNew: true, badge: 'New', reviewCount: 23 }),
    band('sport-blush', 'sport', 'Blush', ['Render_R_1300x1500_8-g4BxEYy3-large.png', 'bloomflatsf-W3xUEBAz-large.png'], 2, { isNew: true, badge: 'New', reviewCount: 31 }),
    band('trail-forest', 'trail', 'Forest', ['PDP_Navigator_Evergr-vyU0bVod-large.png', 'PDP_Navigator_5.0_Ev-0n3YmtxI-large.png', 'PDP_Navigator_Evergr-jcYqI868-large.png', 'PDP_Navigator_Evergr-Z3hIaRdY-large.png', 'PDP_Navigator_Evergr-mpCWv7S2-large.png'], 2, { bestSeller: true, rating: 4.8, reviewCount: 389 }),
    band('trail-ridge', 'trail', 'Ridge', ['PDP_Navigator_Ridgel-O1RoezIx-large.png', 'PDP_Navigator_5.0_Ri-geUuTIPC-large.png', 'PDP_Navigator_Ridgel-hUjuEARt-large.png', 'PDP_Navigator_Ridgel-IbG8kpch-large.png'], 2, { reviewCount: 214 }),
    band('mesh-silver', 'mesh', 'Silver', ['PDP_Meridian_Alloy (-i2MGGAZ4-large.png', 'PDP_Meridian_Alloy 1-ZfIfVbae-large.png', 'PDP_Meridian_Alloy_2-3wM1kAVF-large.jpeg'], 2, { bestSeller: true, rating: 4.8, reviewCount: 176 }),
    band('mesh-black', 'mesh', 'Black', ['PDP_Meridian_Black 1-jYFuojOq-large.png', 'PDP_Meridian_Black_1-a5lA6P_8-large.jpeg'], 1, { reviewCount: 98 }),
    band('mesh-gold', 'mesh', 'Gold', ['PDP_Meridian_Gold-u5zlIqnt-large.png', 'PDP_Layflat_Stack 1-V3QAyvDP-large.png', 'PDP_Meridian_Gold_2 -dzqNTzPn-large.jpeg'], 2, { rating: 4.9, reviewCount: 143 }),
    band('mesh-rose-gold', 'mesh', 'Rose Gold', ['PDP_Meridian_RG (3)-NBWe4Vi1-large.png', 'PDP_Meridian_RG 1-vZ0JNjSg-large.png', 'PDP_Meridian_Rose-Go-4b1GA-5K-large.jpeg'], 2, { isNew: true, badge: 'New', stock: 6, reviewCount: 18 }),
    band('leather-black', 'leather', 'Black', ['black_black_black le-tg8yOETl-large.png', 'LL Black 14mm MG-LPK30W9s-large.png'], 2, { reviewCount: 120 }),
    band('leather-black-gold', 'leather', 'Black & Gold', ['LL Black Gold 14mm M-_mVQPvEE-large.png', 'LL Black Gold 14mm M-OSP5ggLr-large.png', '1-Ej0kBDm2-large.png', '3 (1)-ToWZysso-large.png'], 2, { bestSeller: true, rating: 4.9, reviewCount: 266 }),
    band('leather-cognac', 'leather', 'Cognac', ['Render R 1300x1500 --49SCkdIb-large.png', 'Camel_MG-4fios4u5-large.png'], 1, { bestSeller: true, rating: 4.8, reviewCount: 197 })
  ];
  window.DV_PRODUCTS = window.DV_PRODUCTS.concat(BANDS);


  // Like Whoop: two top-level sections, Memberships and Accessories.
  // Accessories is a group of categories (currently just Bands); add a category
  // here and to its group to give Accessories a sub-filter again.
  window.DV_CATEGORIES = [
    { id: 'all', label: 'All products' },
    { id: 'memberships', label: 'Memberships' },
    { id: 'accessories', label: 'Accessories', group: ['bands'] },
    { id: 'bands', label: 'Bands', parent: 'accessories' }
  ];
  window.DV_category = function (id) {
    return window.DV_CATEGORIES.filter(function (c) { return c.id === id; })[0] || null;
  };
  // Does product p belong to category id (including group categories like Accessories)?
  window.DV_inCategory = function (p, id) {
    var c = window.DV_category(id);
    if (!c || id === 'all') return true;
    return c.group ? c.group.indexOf(p.category) > -1 : p.category === id;
  };

  window.DV_STORE = {
    currency: 'VND',
    freeShippingMin: 750000,
    taxRate: 0,   // VAT is already included in every VND price
    shipping: [
      { id: 'standard', label: 'Standard', detail: '3–5 business days', price: 30000 },
      { id: 'express', label: 'Express', detail: '1–2 business days', price: 60000 }
    ],
    promos: { DVYNC10: 0.10, WELCOME15: 0.15 }
  };

  // Membership comparison (used by the membership landing pages).
  // Columns: the three plans plus the free month; each row says which columns include it.
  window.DV_PLAN_COMPARE = {
    columns: [
      { id: 'one', includes: 'D\'Vync sensor, wired charger, Onyx knit band', cta: 'Start with One' },
      { id: 'peak', includes: 'D\'Vync sensor, Power Pack, Onyx knit band', cta: 'Start with Peak' },
      { id: 'life', includes: 'D\'Vync Pro sensor, Power Pack, Luxe band', cta: 'Start with Life' },
      { id: 'free', title: 'Free month', includes: 'D\'Vync sensor, wired charger, Onyx knit band', cta: 'Start free month', price: '30 days free, then 990,000 VND/yr' }
    ],
    rows: [
      { icon: 'card', label: 'HSA/FSA eligible', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'battery', label: '5-day battery life', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'charge', label: 'Charge while you wear it', in: ['peak', 'life'] },
      { icon: 'gauge', label: 'Recovery, sleep & strain scores', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'coach', label: 'Personalised daily coaching', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'steps', label: 'Steps & activity tracking', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'alarm', label: 'Smart vibration alarm', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'cycle', label: 'Cycle insights', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'heart', label: 'Heart rate zones & VO₂ max', in: ['one', 'peak', 'life', 'free'] },
      { icon: 'clock', label: 'Healthspan & pace of aging', in: ['peak', 'life'] },
      { icon: 'stress', label: 'Stress monitor', in: ['peak', 'life'] },
      { icon: 'pulse', label: 'Heart screener & alerts', in: ['peak', 'life'] },
      { icon: 'drop', label: 'Blood pressure insights', in: ['life'] },
      { icon: 'ecg', label: 'On-demand ECG', in: ['life'] }
    ]
  };

  window.DV_POSTS = [
    {
      slug: 'hrv-explained', image: M + 'Quantify_how_your_body_is_feeling__fr___1_.webp',
      title: 'What your HRV is really telling you', date: '2026-09-22', read: '6 min read', tag: 'Recovery',
      excerpt: 'Heart rate variability is the single best signal of how ready you are. Here\'s how to read it without overthinking it.',
      author: 'theo',
      takeaways: ['Compare HRV with your own baseline', 'Look at trends, not single nights', 'Sleep timing moves it most'],
      body: [
        ['p', 'Heart rate variability (HRV) is the tiny variation in time between one heartbeat and the next. A healthy, rested nervous system doesn\'t beat like a metronome. It constantly adjusts, and that flexibility shows up as higher variability.'],
        ['h2', 'Why it matters'],
        ['p', 'When you\'re stressed, under-slept or fighting off illness, your body leans on its "fight or flight" side and HRV tends to drop. When you\'re recovered, it tends to rise. That\'s why D\'Vync weighs HRV heavily in your morning recovery score.'],
        ['h2', 'Compare yourself to yourself'],
        ['p', 'HRV varies hugely between people. A value of 45 ms can be excellent for one person and low for another. What matters is your trend against your own 30-day baseline, not someone else\'s number.'],
        ['h2', 'Three habits that move it most'],
        ['ul', ['Keep a consistent bedtime, even on weekends.', 'Finish alcohol at least three hours before sleep, or skip it.', 'Balance hard training days with genuinely easy ones.']],
        ['p', 'Give any change two to three weeks before judging it. HRV responds to patterns, not single nights.']
      ]
    },
    {
      slug: 'sleep-consistency', image: M + 'Optimize_your_sleep__fr_.webp',
      title: 'Sleep consistency beats sleep duration (most of the time)', date: '2026-08-30', read: '5 min read', tag: 'Sleep',
      excerpt: 'Eight hours at random times can leave you more tired than seven hours on a schedule. Here\'s why your body clock cares.',
      author: 'nora',
      takeaways: ['Keep one wake time all week', 'Get daylight early', 'Dim the last hour of the evening'],
      body: [
        ['p', 'Most people chase more hours of sleep. Fewer pay attention to when those hours happen, yet timing is one of the strongest predictors of how restored you feel.'],
        ['h2', 'Your body runs on a clock'],
        ['p', 'Hormones that make you alert in the morning and sleepy at night follow a roughly 24-hour rhythm. Shifting your sleep window around forces that rhythm to keep adjusting, a bit like mild jet lag every week.'],
        ['h2', 'How D\'Vync measures it'],
        ['p', 'Your sleep consistency score compares the start and end of each night with the previous four. A score above 80% usually means your body clock knows what to expect.'],
        ['h2', 'Make it easier'],
        ['ul', ['Pick a wake time you can keep seven days a week.', 'Get daylight within an hour of waking.', 'Dim screens and lights for the last hour of the evening.']],
        ['p', 'Duration still matters. Once your timing is steady, the extra hours count for more.']
      ]
    },
    {
      slug: 'train-without-burnout', image: M + 'dv-Strain__fr_.webp',
      title: 'How to train hard without burning out', date: '2026-08-12', read: '7 min read', tag: 'Training',
      excerpt: 'Progress comes from matching effort to recovery. A simple framework for pushing on good days and backing off on the rest.',
      author: 'maya',
      takeaways: ['Check recovery before you train', 'Stay inside your strain target', 'Back off when two signs line up'],
      body: [
        ['p', 'Training doesn\'t make you fitter. Recovering from training does. The workout is the stimulus; adaptation happens in the hours and days after, if you let it.'],
        ['h2', 'Read the day before you train'],
        ['p', 'On high-recovery days your body can absorb more load, so that\'s the time for intervals, heavy lifts or long efforts. On low-recovery days, the same session costs more and returns less.'],
        ['h2', 'Use your strain target'],
        ['p', 'D\'Vync sets a daily strain range from your recovery. Landing inside it most days builds fitness steadily. Repeatedly blowing past it while recovery is low is the classic route to stalling out.'],
        ['h2', 'Watch for the warning signs'],
        ['ul', ['Resting heart rate creeping up several days in a row.', 'HRV trending down for more than a week.', 'Workouts that usually feel easy suddenly feel hard.']],
        ['p', 'If two of these show up together, take two lighter days. You\'ll lose nothing, and usually come back stronger.']
      ]
    },
    {
      slug: 'stress-reset', image: M + 'hiw/Wear_it_24_7__4_.webp',
      title: 'A two-minute reset for stressful days', date: '2026-08-02', read: '4 min read', tag: 'Stress',
      excerpt: 'You can\'t always remove the stress, but you can change how your body responds to it. Start with your breathing.',
      author: 'nora',
      takeaways: ['Slow exhales calm your heart', 'Two minutes is enough to help', 'Use it before, not after, the spike'],
      body: [
        ['p', 'Stress isn\'t only in your head. It shows up as a faster heart rate, shallower breathing and lower heart rate variability, and D\'Vync\'s stress monitor sees all three.'],
        ['h2', 'Why breathing works'],
        ['p', 'Breathing is the one part of your stress response you can steer on purpose. Long, slow exhales nudge your nervous system towards its calmer side within a minute or two.'],
        ['h2', 'Try this'],
        ['ul', ['Breathe in through your nose for four seconds.', 'Breathe out slowly for six to eight seconds.', 'Repeat for two minutes, then check how you feel.']],
        ['p', 'The best time to use it is just before a stressful moment, like a big meeting or a hard conversation, rather than after it.']
      ]
    },
    {
      slug: 'resting-heart-rate', image: M + 'Health_monitor__fr_.webp',
      title: 'Resting heart rate: the quiet signal worth watching', date: '2026-07-21', read: '5 min read', tag: 'Heart',
      excerpt: 'Your heart rate at rest says a lot about fitness, sleep and stress. Here\'s what a rise or a fall usually means.',
      author: 'theo',
      takeaways: ['Lower usually means fitter', 'A sudden rise often means strain or illness', 'Measure it during sleep for accuracy'],
      body: [
        ['p', 'Resting heart rate (RHR) is how many times your heart beats each minute when you\'re fully at rest. D\'Vync measures it during deep sleep, when it\'s least affected by coffee, movement or nerves.'],
        ['h2', 'What a lower number means'],
        ['p', 'As your aerobic fitness improves, your heart pumps more blood with each beat, so it needs fewer beats at rest. A slow drop over months is a good sign your training is working.'],
        ['h2', 'What a sudden rise means'],
        ['p', 'A jump of five or more beats above your normal often points to hard training, poor sleep, alcohol, dehydration or the start of an illness. It\'s worth easing off for a day or two.'],
        ['ul', ['Look at your 30-day trend, not one night.', 'Note what changed the day before a spike.', 'Talk to a doctor about a high RHR that doesn\'t settle.']]
      ]
    },
    {
      slug: 'training-with-your-cycle', image: M + 'hiw/Women-s_Health_2__2_.webp',
      title: 'Training with your cycle, not against it', date: '2026-07-08', read: '6 min read', tag: 'Women\'s health',
      excerpt: 'Hormones shift your recovery, sleep and energy across the month. Small changes to your plan can make each phase feel easier.',
      author: 'maya',
      takeaways: ['Recovery naturally dips before your period', 'Plan harder sessions where you feel strongest', 'Track a few cycles before changing much'],
      body: [
        ['p', 'Across a menstrual cycle, changing hormone levels affect body temperature, heart rate variability and sleep. Many people notice they recover more easily in some weeks than others.'],
        ['h2', 'What tends to happen'],
        ['p', 'In the days before a period, resting heart rate and skin temperature often rise slightly and HRV dips. It\'s normal, and D\'Vync adjusts its expectations so your recovery score stays fair.'],
        ['h2', 'Make the most of each phase'],
        ['ul', ['Schedule key sessions in the weeks you usually feel strongest.', 'Give yourself extra sleep in the days before your period.', 'Log symptoms so patterns become clear after two or three cycles.']],
        ['p', 'Everyone\'s cycle is different, so use your own data rather than a rigid calendar.']
      ]
    },
    {
      slug: 'eat-for-recovery', image: M + 'why/Track_Every_Metric_-_Desktop.webp',
      title: 'What to eat when your recovery is low', date: '2026-06-26', read: '5 min read', tag: 'Nutrition',
      excerpt: 'A red recovery day is a cue to refuel, not to restrict. Three simple priorities for your plate.',
      author: 'ana',
      takeaways: ['Don\'t under-eat on hard days', 'Spread protein across meals', 'Eat dinner a few hours before bed'],
      body: [
        ['p', 'When recovery is low, your body is still repairing from recent strain. Food is part of that repair, and skimping on it usually makes the next day worse.'],
        ['h2', 'Three priorities'],
        ['ul', ['Enough total energy, especially after a hard session.', 'Protein at every meal, around 20 to 40 grams each time.', 'Plenty of fluids, with some salt if you sweat a lot.']],
        ['h2', 'Mind the timing'],
        ['p', 'Large, late meals raise your heart rate during the first part of the night. Finishing dinner two to three hours before bed often shows up as better sleep and a higher recovery the next morning.']
      ]
    },
    {
      slug: 'healthspan-habits', image: M + 'dv-Extend_your_prime-fr.webp',
      title: 'Five habits that add healthy years', date: '2026-06-10', read: '7 min read', tag: 'Longevity',
      excerpt: 'Living longer matters most if those years are healthy ones. The habits with the strongest evidence are refreshingly simple.',
      author: 'theo', featured: true,
      takeaways: ['Aerobic fitness is a powerful lever', 'Strength protects you as you age', 'Sleep and social ties count too'],
      body: [
        ['p', 'Healthspan is the number of years you live in good health. Unlike your genes, the biggest drivers of it are things you do every day.'],
        ['h2', 'The five with the best evidence'],
        ['ul', ['Build your aerobic fitness with regular zone 2 and some harder efforts.', 'Lift weights two or three times a week.', 'Sleep seven to nine hours on a steady schedule.', 'Eat mostly whole foods with plenty of plants and protein.', 'Stay connected with friends and family.']],
        ['h2', 'Measure what you can'],
        ['p', 'D\'Vync\'s Healthspan view brings these together into a single D\'Vync Age, so you can see which habit will move it most this month.']
      ]
    },
    {
      slug: 'alcohol-and-sleep', image: M + 'why/Learn-Exactly-What-Works-Desktop.webp',
      title: 'What one drink really does to your sleep', date: '2026-05-28', read: '4 min read', tag: 'Sleep',
      excerpt: 'Alcohol helps you fall asleep faster, then quietly takes it back. Here\'s what the data usually shows the next morning.',
      author: 'nora',
      takeaways: ['Even one drink can raise your heart rate overnight', 'Earlier is better than later', 'Watch your own HRV the next day'],
      body: [
        ['p', 'Alcohol is a sedative, so it can make you drowsy. But as your body processes it, your heart rate rises and your sleep becomes lighter and more broken in the second half of the night.'],
        ['h2', 'What D\'Vync members often see'],
        ['p', 'A higher resting heart rate, lower HRV and a lower recovery score the next morning, even after one or two drinks.'],
        ['h2', 'If you do drink'],
        ['ul', ['Finish at least three hours before bed.', 'Alternate with water.', 'Log it in your journal to see your own effect.']]
      ]
    }
  ];

  // Writers for the blog (fictional team)
  window.DV_AUTHORS = {
    theo: { name: 'Theo Marsh', role: 'Exercise physiologist', bio: 'Turns heart and recovery science into plain-English advice.' },
    nora: { name: 'Nora Lind', role: 'Sleep and stress coach', bio: 'Helps busy people sleep better and handle pressure.' },
    maya: { name: 'Maya Okoro', role: 'Performance coach', bio: 'Builds training plans that respect recovery.' },
    ana:  { name: 'Ana Ruiz', role: 'Sports nutritionist', bio: 'Writes about fuelling for energy, training and sleep.' }
  };

  window.DV_findProduct = function (id) {
    for (var i = 0; i < window.DV_PRODUCTS.length; i++) if (window.DV_PRODUCTS[i].id === id) return window.DV_PRODUCTS[i];
    return null;
  };
})();

/* D'Vync catalog, store settings and blog content.
   Every page reads from here, so edit products, prices and stock in one place.
   Reviews are sample content for this demo store. */
(function () {
  'use strict';

  var M = 'material/';

  var membershipFaq = [
    { q: 'Is the band included?', a: 'Yes. The D\'Vync device ships with the band and a charger at no extra cost. There\'s no separate band purchase required to get started.' },
    { q: 'What\'s the difference between Free and Premium?', a: 'Free gives you heart rate, step count and sleep duration, for as long as you own the device, at no cost. Premium adds AI-driven deep analysis, sleep and recovery recommendations, and long-term trend reports for 499,000 VND a year.' },
    { q: 'Can I switch between Free and Premium later?', a: 'Yes. You can start on Free and upgrade to Premium at any time, or cancel Premium and keep using the device on the Free tier.' },
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
      id: 'device', category: 'memberships', name: 'D\'Vync Device', badge: null, tier: 'Device', page: 'device.html',
      navImage: M + 'Frame_2085654392-1__1_ (1).webp',
      compareImage: M + 'One__2_.webp',
      price: 1490000, stock: 180,
      images: [M + 'One__2_.webp', M + 'Quantify_how_your_body_is_feeling__fr___1_.webp', M + 'dv-Strain__fr_.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'The screenless sensor and band. One purchase, wear it every day.',
      description: [
        'D\'Vync is a screenless wearable that tracks your heart rate, steps and sleep around the clock, with no display, no vibration and no notifications.',
        'Buy it once. The band and charger are included, and you choose a Free or Premium plan for the app afterwards.'
      ],
      features: ['5-day battery, no screen to charge', 'Continuous heart rate, step and sleep tracking', 'Band, knit strap and charger included', 'Works with the free D\'Vync app', 'Choose Free or Premium after setup'],
      rating: 4.7, reviewCount: 1284, faq: membershipFaq, reviews: sampleReviews.membership
    },
    {
      id: 'premium', category: 'memberships', name: 'D\'Vync Premium', badge: 'Most popular', tier: 'Premium', page: 'premium.html',
      navImage: M + 'Frame_2085654392__4_.webp',
      compareImage: M + 'Peak__3_.webp',
      price: 499000, billing: 'year', stock: 999,
      images: [M + 'plan-year.webp', M + 'dv-Extend_your_prime-fr.webp', M + 'Optimize_your_sleep__fr_.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'AI analysis, recovery recommendations and long-term trend reports.',
      description: [
        'Premium adds AI-driven analysis on top of your Free data: sleep and recovery recommendations, and weekly and monthly trend reports.',
        'Requires a D\'Vync device. Cancel any time and keep using Free at no extra cost.'
      ],
      features: ['Everything in Free', 'AI-driven deep analysis', 'Sleep and recovery recommendations', 'Weekly and monthly trend reports', '499,000 VND a year'],
      rating: 4.8, reviewCount: 2310, faq: membershipFaq, reviews: sampleReviews.membership
    },
    // Same plan as 'premium', billed monthly instead of yearly. Hidden from the shop grid and
    // nav menu (see DV_PRODUCTS.filter(hideFromListings) in shop.js/layout.js) so Premium only
    // shows once there; the premium.html billing toggle switches which of the two ids gets added.
    {
      id: 'premium-monthly', category: 'memberships', hideFromListings: true, name: 'D\'Vync Premium', badge: 'Most popular', tier: 'Premium', page: 'premium.html',
      navImage: M + 'Frame_2085654392__4_.webp',
      compareImage: M + 'Peak__3_.webp',
      price: 59000, billing: 'month', stock: 999,
      images: [M + 'plan-month.webp', M + 'dv-Extend_your_prime-fr.webp', M + 'Optimize_your_sleep__fr_.webp'],
      video: M + 'DifferentbyDesign_4x3_01_Final__1___1___1_.mp4',
      short: 'AI analysis, recovery recommendations and long-term trend reports.',
      description: [
        'Premium adds AI-driven analysis on top of your Free data: sleep and recovery recommendations, and weekly and monthly trend reports.',
        'Requires a D\'Vync device. Cancel any time and keep using Free at no extra cost.'
      ],
      features: ['Everything in Free', 'AI-driven deep analysis', 'Sleep and recovery recommendations', 'Weekly and monthly trend reports', '59,000 VND a month'],
      rating: 4.8, reviewCount: 2310, faq: membershipFaq, reviews: sampleReviews.membership
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
    { id: 'memberships', label: 'Device & Premium' },
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

  // Free vs Premium software comparison (used by the device and premium landing pages).
  // Both require owning the D'Vync device; each row says which column includes it.
  window.DV_PLAN_COMPARE = {
    columns: [
      { id: 'free', title: 'Free', includes: 'D\'Vync sensor and band (sold separately)', cta: 'Start free', price: 'Free forever' },
      { id: 'premium', includes: 'D\'Vync sensor and band (sold separately)', cta: 'Start with Premium', price: '59,000 VND/mo or 499,000 VND/yr' }
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

  window.DV_POSTS = [
    {
      slug: 'what-is-hrv-heart-rate-variability', image: M + 'Quantify_how_your_body_is_feeling__fr___1_.webp',
      title: 'What your HRV is really telling you', date: '2026-09-22', read: '3 min read', tag: 'Recovery',
      excerpt: 'Heart rate variability is one useful signal of how well your body is coping. Here is how to read it without overthinking it.',
      author: 'team',
      takeaways: ['Compare HRV with your own baseline, not with other people’s numbers', 'Look at trends over weeks, not single nights', 'Sleep and alcohol are two common reasons it moves'],
      body: [
        ['p', 'Heart rate variability (HRV) is the small variation in time between one heartbeat and the next. A healthy heart does not tick like a metronome. Harvard Health explains that HRV reflects your autonomic nervous system, the part of your body that runs heart rate, breathing, blood pressure and digestion on autopilot, and that fitter people generally show more variability.'],
        ['h2', 'Why it matters'],
        ['p', 'When you are stressed, under-slept or unwell, your body tends to lean toward its “fight or flight” side and HRV tends to fall. When you are rested, it tends to rise. That makes HRV a useful clue about how well you are recovering. It is a clue, not a diagnosis, and it can move for many reasons.'],
        ['h2', 'Compare yourself with yourself'],
        ['p', 'HRV differs a lot from person to person, so a number that is high for one person can be low for another. Cardiologists quoted by U.S. News advise watching the trend more than any single value.'],
        ['p', 'Imagine your overnight HRV usually sits around 50 ms. Over a week it drifts into the low 40s while you sleep less and have two late nights. That pattern tells you far more than one low reading. (The numbers here are an illustration, not a target.)'],
        ['p', 'D’Vync is designed around your own baseline. Premium’s weekly and monthly reports are designed to show how your HRV trend moves over time.'],
        ['h2', 'Why overnight readings help'],
        ['p', 'HRV is most reliable when you are still. D’Vync is designed to capture it during deep sleep, using a sensor that keeps sampling through the night. Because the band has no screen to power, it is built for 5 to 7 days between charges, so charging does not leave gaps in your overnight data.'],
        ['h2', 'Three habits that tend to move it'],
        ['ul', ['Keep a steady bedtime and wake time, even on weekends.', 'Go easy on alcohol, especially close to bed. In a study of 4,098 people, Pietilä and colleagues found that alcohol was linked to a higher heart rate and lower HRV-based recovery in the first hours of sleep, and the effect grew with the amount.', 'Balance hard training days with genuinely easy ones.']],
        ['p', 'Give any change two to three weeks before judging it. HRV responds to patterns, not single nights.'],
        ['h2', 'What HRV cannot tell you'],
        ['p', 'HRV does not diagnose a condition. If a reading worries you, or you feel unwell, talk to a doctor.'],
        ['h2', 'Sources'],
        ['ul', ['Harvard Health: What is heart rate variability?', 'U.S. News via WTOP: Heart rate variability, what it is and how to track it', 'Pietilä et al. (2018), JMIR Mental Health: Acute effect of alcohol intake on cardiovascular autonomic regulation during the first hours of sleep']]
      ]
    },
    {
      slug: 'sleep-consistency-vs-sleep-duration', image: M + 'Optimize_your_sleep__fr_.webp',
      title: 'Why sleep consistency matters as much as sleep duration', date: '2026-08-30', read: '3 min read', tag: 'Sleep',
      excerpt: 'Eight hours at random times may serve you worse than seven on a schedule. Here is what research suggests and how to build a steadier routine.',
      author: 'team',
      takeaways: ['Aim for at least seven hours, and keep the timing steady', 'Keep one wake time all week', 'Morning daylight and dimmer evenings help anchor your body clock'],
      body: [
        ['p', 'Most people chase more hours of sleep. Fewer pay attention to when those hours happen. A large study suggests timing deserves more attention than it gets.'],
        ['h2', 'What the research says'],
        ['p', 'In a study of about 61,000 adults in the UK Biobank, who wore movement sensors for a week, researchers measured how regular each person’s sleep and wake times were. Windred and colleagues (2024) found that more regular sleep was linked to a lower risk of death from any cause, and that regularity predicted risk more strongly than sleep duration did. This kind of study shows an association, not proof that irregular sleep causes harm.'],
        ['p', 'Duration still matters. The American Academy of Sleep Medicine and Sleep Research Society recommend that adults sleep seven or more hours per night on a regular basis.'],
        ['h2', 'Your body runs on a clock'],
        ['p', 'Hormones that make you alert in the morning and sleepy at night follow a roughly 24-hour rhythm. When your sleep window keeps moving, that rhythm has to keep adjusting, a bit like mild jet lag. Disrupted body-clock timing is one possible explanation for why irregular sleep goes with poorer health, although researchers are still working this out.'],
        ['h2', 'Where D’Vync fits'],
        ['p', 'The Free tier shows your sleep duration each night. Premium is designed to add deeper sleep analysis and recommendations. Because the band has no screen and is built for 5 to 7 days between charges, it is designed to keep recording without gaps, which makes it easier to compare how your nights line up over a week or a month.'],
        ['h2', 'Make it easier'],
        ['ul', ['Pick a wake time you can keep seven days a week.', 'Get outside in daylight soon after waking.', 'Dim screens and lights for the last hour of the evening.', 'Shift your bedtime in small steps, about 15 minutes at a time, rather than all at once. (A practical suggestion rather than a tested protocol.)']],
        ['p', 'If you often cannot sleep, or you feel unrefreshed after seven or more hours, speak to a doctor. Sleep problems can have medical causes.'],
        ['h2', 'Sources'],
        ['ul', ['Windred et al. (2024), Sleep: Sleep regularity is a stronger predictor of mortality risk than sleep duration', 'Watson et al. (2015), Sleep: Recommended amount of sleep for a healthy adult, AASM and SRS consensus statement']]
      ]
    },
    {
      slug: 'train-hard-without-burning-out', image: M + 'dv-Strain__fr_.webp',
      title: 'How to train hard without burning out', date: '2026-08-12', read: '3 min read', tag: 'Training',
      excerpt: 'Progress comes from balancing effort and recovery. A simple way to push on good days and back off on the rest.',
      author: 'team',
      takeaways: ['Fitness is built in the recovery that follows the workout', 'Read several signals together: sleep, resting heart rate, HRV and how you feel', 'Back off when two or more warning signs show up together'],
      body: [
        ['p', 'Training does not make you fitter on its own. The workout is the stimulus; adaptation happens in the hours and days after, if you let it. A joint consensus statement from the European College of Sport Science and the American College of Sports Medicine puts it plainly: successful training needs overload, but it must avoid excessive overload combined with inadequate recovery.'],
        ['h2', 'Short dips are normal, long ones are not'],
        ['p', 'The same consensus describes a short-term drop in performance that improves after rest, called functional overreaching. When the balance between training and recovery is not respected, it can slide into non-functional overreaching, where recovery takes longer. In more severe cases it can take weeks to restore performance.'],
        ['h2', 'Check in before you train'],
        ['p', 'Before a hard session, look at three things together.'],
        ['ul', ['Sleep: did you sleep roughly your normal amount, at your normal time?', 'Heart signals: are your resting heart rate and HRV close to your own baseline?', 'How you feel: is the warm-up easy or does it feel heavy?']],
        ['p', 'If all three look good, it is a sensible day for intervals, heavy lifts or a long effort. If they do not, the same session costs more and returns less, and an easier day is a better investment.'],
        ['h2', 'Watch for the warning signs'],
        ['ul', ['Resting heart rate creeping up for several days in a row.', 'HRV trending down for a week or more.', 'Workouts that usually feel easy suddenly feel hard.', 'Worse mood, sleep or motivation than usual.']],
        ['p', 'Sports medicine researchers stress that no single marker reliably flags overtraining, so look for signs that line up. If two or more appear together, a reasonable rule of thumb is two lighter days. It is a practical guideline, not a scientific rule.'],
        ['p', 'If tiredness and poor performance last for weeks, talk to a doctor or a qualified coach. Other causes, such as illness or not eating enough, need to be ruled out.'],
        ['h2', 'Where D’Vync fits'],
        ['p', 'The Free tier shows your heart rate, steps and sleep duration. Premium is designed to add deeper analysis and recommendations to help you balance sleep, training and recovery, plus weekly and monthly trend reports. The band has no screen, so it will not interrupt a workout.'],
        ['h2', 'Sources'],
        ['ul', ['Meeusen et al. (2013), Medicine & Science in Sports & Exercise: Overtraining syndrome, ECSS and ACSM consensus statement']]
      ]
    },
    {
      slug: 'two-minute-breathing-reset-for-stress', image: M + 'hiw/Wear_it_24_7__4_.webp',
      title: 'A two-minute breathing reset for stressful days', date: '2026-08-02', read: '3 min read', tag: 'Stress',
      excerpt: 'You cannot always remove the stress, but slow breathing can change how your body responds to it.',
      author: 'team',
      takeaways: ['Slow, controlled breathing is linked to higher HRV in a review of 223 studies', 'Two minutes is a practical starting point', 'Use it before a stressful moment, not only after'],
      body: [
        ['p', 'Stress is not only in your head. It can show up as a faster heart rate, shallower breathing and a lower HRV. Breathing is the one part of that response you can steer on purpose.'],
        ['h2', 'Why slow breathing may help'],
        ['p', 'A 2022 systematic review and meta-analysis by Laborde and colleagues pulled together 223 studies of voluntary slow breathing. It found increases in vagally mediated HRV, a marker linked to the calming branch of your nervous system, during the breathing session, right after one session and after a multi-session programme. The authors suggest slow breathing is a low-cost, low-tech technique with few adverse effects expected. Protocols differed a lot between studies, so there is no single proven recipe.'],
        ['h2', 'Try this'],
        ['ul', ['Breathe in through your nose for four seconds.', 'Breathe out slowly for six to eight seconds.', 'Repeat for about two minutes, then notice how you feel.']],
        ['p', 'Two minutes is a practical starting point rather than a tested dose. If you feel lightheaded, go back to normal breathing. If you have a heart or lung condition, ask your doctor before trying breathing exercises.'],
        ['h2', 'When to use it'],
        ['p', 'The best time is just before a stressful moment, such as a big meeting or a hard conversation. Many people also find it a useful way to wind down in the evening.'],
        ['h2', 'Where D’Vync fits'],
        ['p', 'D’Vync has no screen, no light, no vibration and no notifications, so it will never interrupt you mid-meeting. Instead, Premium’s weekly and monthly reports are designed to help you see which days or weeks were heavier for your body, so you can plan breaks and recovery.'],
        ['p', 'If stress or anxiety feels constant or overwhelming, a breathing exercise is not a substitute for professional support.'],
        ['h2', 'Sources'],
        ['ul', ['Laborde et al. (2022), Neuroscience & Biobehavioral Reviews: Effects of voluntary slow breathing on heart rate and heart rate variability', 'Harvard Health: What is heart rate variability?']]
      ]
    },
    {
      slug: 'resting-heart-rate-what-it-means', image: M + 'Health_monitor__fr_.webp',
      title: 'Resting heart rate: the quiet signal worth watching', date: '2026-07-21', read: '3 min read', tag: 'Heart',
      excerpt: 'Your heart rate at rest reflects fitness, sleep and stress. Here is what a drift up or down can mean.',
      author: 'team',
      takeaways: ['A normal resting heart rate for most adults is 60 to 100 beats per minute', 'Lower often goes with better fitness, but your own trend matters most', 'A rise that lasts several days is a cue to look at sleep, stress and training'],
      body: [
        ['p', 'Resting heart rate (RHR) is how many times your heart beats each minute when you are fully at rest. The Mayo Clinic and the American Heart Association both describe 60 to 100 beats per minute as the normal range for most adults. Very fit athletes can sit closer to 40.'],
        ['h2', 'What a lower number can mean'],
        ['p', 'As your aerobic fitness improves, your heart usually pumps more blood with each beat, so it needs fewer beats at rest. Mayo Clinic notes that a lower resting heart rate can go with better fitness. A slow drop over months is often a sign that training is working.'],
        ['p', 'The same page advises talking to a health professional if you are not a trained athlete and your resting heart rate is often below 60.'],
        ['h2', 'What a rise can mean'],
        ['p', 'A resting heart rate that stays above your own normal for several days can reflect hard training, poor sleep, alcohol, dehydration, stress or the start of an illness. It is a reason to ease off and check the basics, not a reason to panic.'],
        ['p', 'No single number settles the question. A joint consensus statement from sports medicine bodies notes that none of the markers used to detect overtraining is accepted as reliable on its own. So read your heart rate together with how you feel, how you slept and what you have been doing.'],
        ['h2', 'Why measure it during sleep'],
        ['p', 'Coffee, movement, a hurried walk or a stressful email can all lift your heart rate during the day. Overnight readings are far less affected. D’Vync is designed to record your heart rate while you sleep and, because the band needs charging only every 5 to 7 days, to keep your overnight record unbroken. The Free tier shows your heart rate; Premium’s long-term trend reports are designed to show how it moves over months.'],
        ['h2', 'Three ways to use it'],
        ['ul', ['Look at your 30-day trend, not one night.', 'Note what changed the day before a spike: a late meal, a hard session, a poor night.', 'Talk to a doctor if a high resting heart rate does not settle, or if you also feel dizzy, breathless or have chest pain.']],
        ['h2', 'Sources'],
        ['ul', ['Mayo Clinic: Heart rate, what’s normal?', 'American Heart Association: Target heart rates chart', 'Meeusen et al. (2013), Medicine & Science in Sports & Exercise: Overtraining syndrome, ECSS and ACSM consensus statement']]
      ]
    },
    {
      slug: 'training-with-your-menstrual-cycle', image: M + 'hiw/Women-s_Health_2__2_.webp',
      title: 'Training with your cycle, not against it', date: '2026-07-08', read: '3 min read', tag: 'Women’s health',
      excerpt: 'Hormones shift across the month, and so can recovery signals like HRV. Small adjustments can make each phase feel easier.',
      author: 'team',
      takeaways: ['On average, HRV is lower in the second half of the cycle than in the first', 'Everyone’s pattern differs, so track your own over a few cycles', 'Plan your hardest sessions for the weeks you tend to feel strongest'],
      body: [
        ['p', 'The menstrual cycle involves regular swings in the hormones estradiol and progesterone. They influence more than periods, including how your nervous system regulates your heart.'],
        ['h2', 'What the research shows'],
        ['p', 'A 2019 systematic review and meta-analysis by Schmalenberger and colleagues combined 37 studies and 1,004 women. It found that cardiac vagal activity, mostly measured as HRV, fell on average from the follicular phase (before ovulation) to the luteal phase (after ovulation). The effect was small to moderate. A smaller group of studies found a larger drop between the menstrual and premenstrual phases. A follow-up study linked the changes more closely to progesterone than to estradiol.'],
        ['p', 'These are averages. Some people show a clear pattern and others barely any. The reviewers recommend that researchers account for cycle phase, which is a good reason to keep it in mind when you read your own HRV.'],
        ['h2', 'What this can mean for you'],
        ['p', 'A lower HRV in the days before your period may reflect your cycle, not poor recovery or overtraining. Looking at your own HRV against your cycle for a few months helps you tell the difference.'],
        ['h2', 'Make the most of each phase'],
        ['p', 'These are general ideas, not a prescription.'],
        ['ul', ['Schedule your most demanding sessions in the weeks you usually feel strongest.', 'Plan a lighter day or an earlier night when you usually feel flat.', 'Keep a short note on your phone: cycle day, energy, sleep and symptoms. After two or three cycles, patterns tend to show.']],
        ['p', 'D’Vync does not track your cycle, so a simple note is enough to compare against the HRV and resting heart rate trends the band is designed to record each night. Premium’s trend reports are designed to make those comparisons easier.'],
        ['p', 'If your periods are irregular, very painful, or stop, talk to a doctor.'],
        ['h2', 'Sources'],
        ['ul', ['Schmalenberger et al. (2019), Journal of Clinical Medicine: Within-person changes in cardiac vagal activity across the menstrual cycle, a systematic review and meta-analysis', 'Schmalenberger et al. (2020), Clinical Medicine: Menstrual cycle changes in vagally mediated HRV are associated with progesterone']]
      ]
    },
    {
      slug: 'what-to-eat-when-recovery-is-low', image: M + 'why/Track_Every_Metric_-_Desktop.webp',
      title: 'What to eat when your recovery looks low', date: '2026-06-26', read: '3 min read', tag: 'Nutrition',
      excerpt: 'A rough night or a hard week is a cue to refuel, not to restrict. Three simple priorities for your plate.',
      author: 'team',
      takeaways: ['Do not under-eat on demanding days', 'Spread protein across the day instead of saving it for dinner', 'Try finishing dinner a few hours before bed and see how you sleep'],
      body: [
        ['p', 'When your sleep or heart signals look off, your body is still repairing from recent stress. Food is part of that repair. Skimping on it usually makes the next day harder, not easier. The sports medicine consensus on overtraining lists dietary energy restriction and too little carbohydrate or protein among the factors to rule out when an athlete is persistently tired and underperforming.'],
        ['h2', 'Three priorities'],
        ['ul', ['Enough total energy, especially after a hard session. Eating less to “fix” a bad day tends to backfire.', 'Protein at each meal. A review by Schoenfeld and Aragon (2018) concluded that, for people who lift weights and want to maximise muscle gain, a target of about 0.4 g of protein per kilogram of body weight per meal, across at least four meals, reaches a daily minimum of 1.6 g/kg. For a 60 kg person that is about 24 g per meal, and for a 75 kg person about 30 g. Needs are lower for people who do not train with weights.', 'Fluids, with some salt if you sweat a lot. In hot, humid weather this matters more.']],
        ['p', 'Good protein sources in everyday Vietnamese meals include eggs, tofu (đậu hũ), fish such as cá kho, chicken with rice (cơm gà), and a bowl of phở bò with extra beef. Exact amounts vary by recipe, so check labels or a reliable food database if you want precise numbers.'],
        ['h2', 'Mind the timing'],
        ['p', 'A 2026 study in Nature Health followed 3,598 healthy adults with wearables and food logs. As reported by Olive Oil Times, heavier evening meals went with a slightly higher nighttime heart rate, about 0.7 beats per minute, even though people slept a few minutes longer. The effect is small, so treat “finish dinner two to three hours before bed” as a simple experiment to try, not a rule.'],
        ['p', 'If you try it, compare your resting heart rate and sleep on those nights with your usual nights. D’Vync’s Free tier shows heart rate and sleep duration, and Premium is designed to add deeper analysis and trend reports.'],
        ['p', 'If you notice yourself restricting food to make up for a bad day, or you have a medical condition that affects what you can eat, talk to a doctor or a registered dietitian.'],
        ['h2', 'Sources'],
        ['ul', ['Schoenfeld & Aragon (2018), Journal of the International Society of Sports Nutrition: How much protein can the body use in a single meal for muscle-building?', 'Meeusen et al. (2013), Medicine & Science in Sports & Exercise: Overtraining syndrome, ECSS and ACSM consensus statement', 'Olive Oil Times: Fiber-rich, plant-forward diet linked to better sleep (report on the Nature Health study; check the original paper before publishing)']]
      ]
    },
    {
      slug: 'five-habits-that-add-healthy-years', image: M + 'dv-Extend_your_prime-fr.webp',
      title: 'Five habits that add healthy years', date: '2026-06-10', read: '3 min read', tag: 'Longevity',
      excerpt: 'Living longer matters most when those years are healthy ones. The habits with the most consistent support are refreshingly simple.',
      author: 'team', featured: true,
      takeaways: ['Move regularly: the WHO advises 150 to 300 minutes of moderate activity a week', 'Strength training on at least two days a week', 'Regular sleep, whole-food meals and good relationships all count'],
      body: [
        ['p', 'Healthspan is the number of years you live in good health. Unlike your genes, many of its drivers are things you do every day. None of the habits below is a guarantee, but each has consistent support from guidelines or large studies.'],
        ['h2', 'The five habits'],
        ['ul', ['Build your aerobic fitness. The World Health Organization advises adults to do 150 to 300 minutes of moderate-intensity aerobic activity a week, or 75 to 150 minutes of vigorous activity, or an equivalent mix. Brisk walking, cycling and badminton all count.', 'Train your muscles. The same WHO guidance recommends muscle-strengthening activity involving all major muscle groups on two or more days a week.', 'Sleep enough, and regularly. Adults should sleep seven or more hours on a regular basis, according to the AASM and SRS consensus. A large UK study also linked steadier sleep timing to lower mortality risk.', 'Eat mostly whole foods. Build meals around vegetables, fruit, whole grains and enough protein.', 'Stay connected. A meta-analysis of 148 studies and 308,849 people found that people with stronger social relationships had about a 50% higher likelihood of survival over the follow-up periods. The authors compared this influence with well-known risk factors such as smoking and alcohol. It is an association, not proof of cause.']],
        ['h2', 'Measure what you can'],
        ['p', 'Habits take weeks to show up in your body. D’Vync Premium is designed to give weekly and monthly trend reports, so you can see whether changes in sleep, activity and routine are moving your resting heart rate and HRV in a direction you like. The Free tier shows heart rate, steps and sleep duration.'],
        ['p', 'If you are new to exercise or have a health condition, check with your doctor before increasing your activity.'],
        ['h2', 'Sources'],
        ['ul', ['World Health Organization: Physical activity fact sheet', 'Watson et al. (2015), Sleep: Recommended amount of sleep for a healthy adult', 'Windred et al. (2024), Sleep: Sleep regularity is a stronger predictor of mortality risk than sleep duration', 'Holt-Lunstad et al. (2010), PLoS Medicine: Social relationships and mortality risk']]
      ]
    },
    {
      slug: 'what-one-drink-does-to-your-sleep', image: M + 'why/Learn-Exactly-What-Works-Desktop.webp',
      title: 'What one drink can do to your sleep', date: '2026-05-28', read: '3 min read', tag: 'Sleep',
      excerpt: 'Alcohol can make you drowsy, but research suggests it disturbs how well your body recovers overnight.',
      author: 'team',
      takeaways: ['Even a low amount of alcohol was linked to lower HRV-based recovery in one large study', 'The effect grew with the amount', 'Earlier is better than later; watch your own trend'],
      body: [
        ['p', 'Alcohol is a sedative, so it can make you feel sleepy. What happens afterwards is less welcome.'],
        ['h2', 'What the study found'],
        ['p', 'In 2018, Pietilä and colleagues analysed 4,098 Finnish employees who wore beat-to-beat heart recorders in everyday life and reported their alcohol intake. In the first three hours of sleep, alcohol was linked to a higher heart rate and lower HRV, in a dose-dependent way. Their HRV-based measure of physiological recovery fell by 9.3 percentage points on average with low intake, 24.0 with moderate intake and 39.2 with high intake.'],
        ['p', 'The low group was up to 0.25 grams of pure alcohol per kilogram of body weight. For a 70 kg adult that is roughly one standard drink (our approximation). The effects were similar for men and women and for active and sedentary people, and were stronger in younger participants. Because people reported their own intake in daily life, this is an association rather than a controlled experiment.'],
        ['h2', 'What you may notice on your own data'],
        ['p', 'D’Vync is designed to measure heart rate and HRV during sleep, so comparing nights with and without alcohol is something you can try yourself. The Free tier shows heart rate and sleep duration; Premium is designed to add deeper analysis and trend reports. A simple note on your phone saying which nights you drank makes the comparison easy.'],
        ['h2', 'If you do drink'],
        ['ul', ['Finish earlier rather than later. Three hours before bed is a common rule of thumb, not a proven threshold.', 'Alternate alcohol with water.', 'Pay attention to your own pattern over several weeks.']],
        ['p', 'If you are worried about how much you drink, talk to a doctor.'],
        ['h2', 'Sources'],
        ['ul', ['Pietilä et al. (2018), JMIR Mental Health: Acute effect of alcohol intake on cardiovascular autonomic regulation during the first hours of sleep']]
      ]
    },
    {
      slug: 'why-your-wrist-doesnt-need-a-screen', image: M + 'hiw/Wear_it_24_7.webp',
      title: 'Why your wrist doesn’t need a screen', date: '', read: '3 min read', tag: 'Screen-free living',
      excerpt: 'Constant alerts cost focus and calm. Here is what research on interruptions says, and why D’Vync is built to stay quiet.',
      author: 'team',
      takeaways: ['In one lab study, interrupted work was finished faster but felt more stressful and effortful', 'A band with no screen, light, vibration or notifications removes one source of interruptions', 'Health tracking does not have to mean another thing demanding your attention'],
      body: [
        ['p', 'Many people buy a smartwatch to look after their health and end up with one more thing that taps them on the wrist. D’Vync is designed around a different idea: collect the data quietly, and let you look at it when you choose.'],
        ['h2', 'What research says about interruptions'],
        ['p', 'In a 2008 experiment, Mark, Gudith and Klocke had people do office-style tasks with and without interruptions. The interrupted group finished faster, but reported more stress, frustration, time pressure and effort. In other words, people speed up to cope, and pay for it in strain.'],
        ['p', 'You may also have seen a claim that it takes 23 minutes to refocus after every interruption. Silicon Canals points out that this figure comes from Mark’s workplace observation of professionals, and it is the average time before they returned to the interrupted work, including time spent handling the interruption and doing other tasks. It is not a clean measure of how long it takes to concentrate again. The safer takeaway is simpler: frequent interruptions have a cost, and it shows up as stress and effort.'],
        ['h2', 'Built to stay quiet'],
        ['p', 'D’Vync’s band has no display, no light, no vibration alerts and no notifications. It collects data in the background. The Free tier shows heart rate, steps and sleep duration, and you review them in the app when you decide to, not when the band decides.'],
        ['h2', 'Try a lower-interruption routine'],
        ['p', 'These are practical suggestions, not tested protocols.'],
        ['ul', ['Check your data once a day at a set time, such as with your morning coffee, instead of all day. Premium’s weekly and monthly reports are designed for this slower rhythm.', 'Turn off phone notifications you do not need.', 'Keep one block of the day for focused work with notifications off.']],
        ['h2', 'Not an anti-technology message'],
        ['p', 'The aim is not to give up data. It is to separate collecting your data from being interrupted by it. You still get a picture of your sleep, heart rate and recovery trends, without a glowing screen on your wrist.'],
        ['p', 'A quieter wrist is not a treatment for stress or anxiety. If either feels constant or overwhelming, talk to a doctor or a mental health professional.'],
        ['h2', 'Sources'],
        ['ul', ['Mark, Gudith & Klocke (2008), CHI 2008: The cost of interrupted work, more speed and stress', 'Silicon Canals: What the 23-minute interruption figure actually measures']]
      ]
    },
    {
      slug: 'wear-a-screenless-band-with-a-classic-watch', image: M + 'why/Get-Coached-Desktop.webp',
      title: 'Can you wear a screenless band with a classic watch?', date: '', read: '3 min read', tag: 'Screen-free living',
      excerpt: 'A minimalist band can sit beside the watch you love and keep tracking while you work, train and sleep.',
      author: 'team',
      takeaways: ['D’Vync is designed to be worn alone or alongside a traditional watch', 'No screen, light, vibration or notifications, so it stays out of the way', 'A 5 to 7 day battery means you do not have to take it off every night to charge'],
      body: [
        ['p', 'For many watch lovers, a watch is a style choice, a gift or an heirloom. Nobody wants to replace it with a glowing screen. The good news is that you do not have to choose between your favourite watch and tracking your health.'],
        ['h2', 'Two watches, two jobs'],
        ['p', 'Your classic watch tells the time and says something about you. D’Vync is designed to do a different job quietly: record heart rate and sleep in the background. Because the band has no display, nothing competes with your watch dial, and nothing buzzes in a meeting.'],
        ['h2', 'Why battery life matters for your data'],
        ['p', 'The most useful readings, such as overnight heart rate and HRV, only exist if you wear the band through the night. A device you must charge every evening leaves a gap exactly when it matters. With no screen to power, D’Vync is designed for 5 to 7 days between charges, so you can keep wearing it while you sleep.'],
        ['h2', 'Practical tips'],
        ['p', 'These are general tips for wrist-based optical sensors. Follow the instructions that come with your band.'],
        ['ul', ['Wear it snug but comfortable, with the sensor resting against your skin.', 'Keep the sensor and your skin clean and dry.', 'Wear it day and night. Many people swap their dress watch for something casual in the evening; the band simply stays on.', 'Pick a strap to suit your day. Interchangeable straps are part of the design.', 'Look at trends rather than single numbers. Like every wrist-based sensor, D’Vync’s readings can be affected by movement and fit.']],
        ['h2', 'A weekly check-in is enough'],
        ['p', 'You do not need to look at your data every day. Premium’s weekly and monthly reports are designed for a once-a-week check-in, so your wrist, and your attention, stay with the watch you chose. The Free tier shows heart rate, steps and sleep duration if you only want the basics.'],
        ['h2', 'Sources'],
        ['ul', ['Product information from the D’Vync business plan. No external sources are needed for this post.']]
      ]
    }
  ];

  // Writers for the blog
  window.DV_AUTHORS = {
    team: { name: 'D’Vync Team' }
  };

  window.DV_findProduct = function (id) {
    for (var i = 0; i < window.DV_PRODUCTS.length; i++) if (window.DV_PRODUCTS[i].id === id) return window.DV_PRODUCTS[i];
    return null;
  };
})();

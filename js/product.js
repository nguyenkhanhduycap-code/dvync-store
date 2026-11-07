/* Product page, laid out like a store product page:
   left  – vertical thumbnails + a swipeable square gallery (zoom, dots), sticky on desktop;
   right – name, price, rating, low-stock note, colour swatches (switch colourway in place),
           Add to cart / Buy it now, feature bullets, description, accordions (incl. reviews).
   Bands are one size, so they have no size picker. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc, money = window.Cart.money;
  var root = document.getElementById('product-root');

  var icons = {
    zoom: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>',
    play: '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
    arrow: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    close: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    left: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>'
  };

  // Accordion copy per band family (material and care); memberships get their own
  var MATERIAL = {
    knit: 'Recycled-yarn knit with an elastic weave, a stainless-steel clasp and a soft brushed underside.',
    reflective: 'Recycled-yarn knit woven with retro-reflective stripes, a stainless-steel clasp and a soft brushed underside.',
    sport: 'Soft-touch silicone with ventilation channels and stainless-steel clasp components.',
    trail: 'Abrasion-resistant woven nylon with a hook-and-loop closure and a reinforced contrast edge.',
    mesh: 'Fine stainless-steel mesh with a sliding stainless-steel clasp and a polished finish.',
    leather: 'Full-grain leather with a stitched edge, metal buckle and keeper.'
  };
  var CARE = {
    knit: 'Hand-wash with mild soap and cool water, rinse well and let it air dry. Avoid the dryer and direct heat.',
    reflective: 'Hand-wash with mild soap and cool water and air dry. Don\'t scrub the reflective stripes.',
    sport: 'Rinse with water after workouts and wipe dry. Use mild soap to remove sunscreen or dirt.',
    trail: 'Open the closure, rinse with fresh water and air dry. Brush off dried mud before washing.',
    mesh: 'Wipe with a soft dry cloth. Remove before swimming in salt or chlorinated water.',
    leather: 'Wipe with a dry cloth and keep it away from long soaks. Let it air dry naturally if it gets wet.'
  };
  var RETURNS = '<p><strong>30-day returns.</strong> Not for you? Send it back within 30 days of delivery for a full refund, even if you\'ve worn it. ' +
    'Hardware has a 1-year limited warranty.</p><p>Read our <a class="link" href="returns.html">returns &amp; refunds policy</a>.</p>';
  var SHIPPING = '<p><strong>Free standard shipping</strong> on orders over ' + window.Cart.money(window.DV_STORE.freeShippingMin) + '. Memberships always ship free.</p>' +
    '<ul><li>Standard: 3–5 business days (30,000 VND under 750,000 VND)</li><li>Express: 1–2 business days (60,000 VND)</li><li>Orders placed before 2 pm ship the same day.</li></ul>' +
    '<p>See the full <a class="link" href="shipping.html">shipping policy</a>.</p>';

  function acc(title, body, open, id) {
    return '<details class="acc"' + (id ? ' id="' + id + '"' : '') + (open ? ' open' : '') + '><summary>' + title + '</summary><div class="acc-body"><div>' + body + '</div></div></details>';
  }

  // ----- Reviews: sample reviews from data.js plus any the visitor writes (kept in this browser) -----
  var REVIEW_KEY = 'dvync-reviews';
  function userReviews(id) {
    try { return (JSON.parse(localStorage.getItem(REVIEW_KEY)) || {})[id] || []; } catch (e) { return []; }
  }
  function saveReview(id, r) {
    try {
      var all = JSON.parse(localStorage.getItem(REVIEW_KEY)) || {};
      (all[id] = all[id] || []).unshift(r);
      localStorage.setItem(REVIEW_KEY, JSON.stringify(all));
    } catch (e) { /* storage blocked: the review shows until the page reloads */ }
  }
  // Rating and count shown on the page: the catalogue figures, nudged by the visitor's own reviews
  function reviewStats(p) {
    var mine = userReviews(p.id);
    var count = (p.reviewCount || 0) + mine.length;
    var sum = (p.rating || 0) * (p.reviewCount || 0) + mine.reduce(function (s, r) { return s + r.rating; }, 0);
    var avg = count ? Math.round(sum / count * 10) / 10 : 0;
    // star distribution: an even spread around the average, for the bars
    var dist = [5, 4, 3, 2, 1].map(function (s) {
      var w = Math.max(0, 1 - Math.abs(avg - s) / 2.2);
      return { s: s, w: w };
    });
    var total = dist.reduce(function (t, d) { return t + d.w; }, 0) || 1;
    dist.forEach(function (d) { d.pct = Math.round(d.w / total * 100); });
    return { avg: avg, count: count, dist: dist, list: mine.concat(p.reviews || []) };
  }
  function reviewItem(r) {
    return '<article class="review">' + DV.stars(r.rating) +
      '<h4>' + esc(r.title) + '</h4><p>' + esc(r.text) + '</p>' +
      '<div class="who">' + esc(r.name) + ' · ' + DV.formatDate(r.date) + (r.mine ? '' : '<span class="verified">Verified buyer</span>') + '</div></article>';
  }
  function reviewsHtml(p) {
    var st = reviewStats(p);
    return '<div class="pdp-rev-sum"><div class="score-big">' + st.avg.toFixed(1) + '</div>' + DV.stars(st.avg) +
        '<p class="small muted">Based on ' + st.count.toLocaleString('en-US') + ' reviews</p></div>' +
      '<div class="dist">' + st.dist.map(function (d) {
        return '<div><span>' + d.s + ' ★</span><i style="--w:' + d.pct + '%"></i><span>' + d.pct + '%</span></div>';
      }).join('') + '</div>' +
      '<div class="review-list pdp-rev-list">' + st.list.map(reviewItem).join('') + '</div>' +
      '<form class="review-form" id="review-form" novalidate>' +
        '<strong>Write a review</strong>' +
        '<div class="star-input" role="radiogroup" aria-label="Your rating">' +
          [5, 4, 3, 2, 1].map(function (n) {
            return '<input type="radio" name="rating" id="rv' + n + '" value="' + n + '"><label for="rv' + n + '" title="' + n + ' star' + (n > 1 ? 's' : '') + '"><span class="sr-only">' + n + ' stars</span></label>';
          }).join('') + '</div>' +
        '<label class="sr-only" for="rv-name">Your name</label><input id="rv-name" placeholder="Your name" maxlength="40" required>' +
        '<label class="sr-only" for="rv-title">Title</label><input id="rv-title" placeholder="Title" maxlength="80" required>' +
        '<label class="sr-only" for="rv-text">Review</label><textarea id="rv-text" rows="3" placeholder="What did you think?" maxlength="600" required></textarea>' +
        '<p class="opt-error" id="rv-error" aria-live="polite"></p>' +
        '<button class="pdp-btn solid" type="submit">Post review</button>' +
        '<p class="demo-note">Demo store: reviews you post are saved only in this browser.</p>' +
      '</form>';
  }

  // Stock line: shown only when it matters (low or sold out)
  function stockHtml(p) {
    if (p.stock <= 0) return '<p class="pdp-stock out"><i></i>Sold out — back soon</p>';
    if (p.stock <= 10) return '<p class="pdp-stock low"><i></i>Only ' + p.stock + ' left in stock</p>';
    return '';
  }

  var lightbox = null;   // built once, reused across colour switches

  function render(id) {
    var p = window.DV_findProduct(id || '');
    if (!p) {
      root.innerHTML = '<div class="wrap cart-empty"><h2>We couldn\'t find that product.</h2>' +
        '<p>It may have moved or sold out for good.</p><a class="btn btn-dark" href="shop.html">Back to shop</a></div>';
      return;
    }
    document.title = p.name + ' | D\'Vync';

    var family = p.family ? window.DV_family(p.family) : null;
    var title = family ? family.name : p.name;
    var siblings = p.family ? window.DV_PRODUCTS.filter(function (x) { return x.family === p.family; }) : [p];

    // Media: images (first p.studio are transparent studio shots), then the product video if any
    var media = p.images.map(function (src, i) { return { type: 'img', src: src, studio: i < (p.studio || 0) || p.category === 'memberships' }; });
    if (p.video) media.push({ type: 'video', src: p.video, poster: p.images[0] });

    function slide(m, i) {
      var inner = m.type === 'video'
        ? '<video src="' + esc(m.src) + '" poster="' + esc(m.poster) + '" muted playsinline loop controls preload="metadata" aria-label="' + esc(p.name) + ' video"></video>'
        : '<img src="' + esc(m.src) + '" alt="' + esc(p.name) + ' image ' + (i + 1) + ' of ' + media.length + '"' + (i ? ' loading="lazy"' : '') + '>';
      return '<div class="pdp-slide' + (m.studio ? ' studio' : '') + (m.type === 'video' ? ' is-video' : '') + '" data-i="' + i + '">' + inner + '</div>';
    }
    function thumb(m, i) {
      var img = m.type === 'video' ? m.poster : m.src;
      return '<button class="pdp-thumb' + (m.studio ? ' studio' : '') + '" data-i="' + i + '" aria-label="' + (m.type === 'video' ? 'Play video' : 'Show image ' + (i + 1)) + '" aria-current="' + (i === 0) + '">' +
        '<img src="' + esc(img) + '" alt="">' + (m.type === 'video' ? '<span class="play">' + icons.play + '</span>' : '') + '</button>';
    }
    function swatch(s) {
      var img = s.images[s.studio > 1 ? 1 : 0];
      return '<button class="swatch" data-id="' + esc(s.id) + '" aria-label="' + esc(s.color) + '" title="' + esc(s.color) + '" aria-pressed="' + (s.id === p.id) + '">' +
        '<img src="' + esc(img) + '" alt="">' + (s.stock <= 0 ? '<i class="swatch-out" aria-hidden="true"></i>' : '') + '</button>';
    }

    var bullets = (p.features || []).concat(p.category === 'bands' ? ['One size fits all', 'Fits every D\'Vync sensor'] : []);

    root.innerHTML =
      '<div class="wrap">' +
        '<nav class="crumbs pdp-crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span>' +
          (p.category === 'bands' ? '<a href="accessories.html">Accessories</a><span>/</span>' : '<a href="shop.html?cat=' + p.category + '">' + esc(window.DV_category(p.category).label) + '</a><span>/</span>') +
          '<span aria-current="page">' + esc(title) + '</span></nav>' +
        '<section class="pdp">' +
          // ---- Gallery ----
          '<div class="pdp-gallery">' +
            (media.length > 1 ? '<div class="pdp-thumbs" aria-label="Product media">' + media.map(thumb).join('') + '</div>' : '') +
            '<div class="pdp-stage">' +
              '<div class="pdp-track" tabindex="0" aria-label="Product images">' + media.map(slide).join('') + '</div>' +
              '<button class="pdp-zoom" aria-label="Zoom image">' + icons.zoom + '</button>' +
              (media.length > 1 ? '<div class="pdp-dots">' + media.map(function (m, i) { return '<i data-i="' + i + '"' + (i ? '' : ' class="on"') + '></i>'; }).join('') + '</div>' : '') +
            '</div>' +
          '</div>' +
          // ---- Buy box ----
          '<div class="pdp-info">' +
            '<h1>' + esc(title) + '</h1>' +
            '<div class="pdp-price">' + money(p.price).replace('.00', '') + (p.billing ? '<small> / ' + p.billing + '</small>' : '') + '</div>' +
            (function () { var st = reviewStats(p); return '<a class="pdp-rating" href="#reviews">' + DV.stars(st.avg) + '<span>' + st.avg.toFixed(1) + '</span><span class="muted">(' + st.count.toLocaleString('en-US') + ' reviews)</span></a>'; })() +
            stockHtml(p) +
            (p.color ? '<div class="pdp-label"><strong>Color</strong> <span>' + esc(p.color) + '</span></div>' +
              (siblings.length > 1 ? '<div class="swatches" role="group" aria-label="Colour">' + siblings.map(swatch).join('') + '</div>' : '') : '') +
            (p.option ?
              '<div class="pdp-label"><strong id="opt-label">' + esc(p.option.label) + '</strong></div>' +
              '<div class="opt-row" role="radiogroup" aria-labelledby="opt-label">' + p.option.values.map(function (v) {
                return '<button class="opt" role="radio" aria-checked="false" data-v="' + esc(v) + '">' + esc(v) + '</button>';
              }).join('') + '</div><div class="opt-error" id="opt-error" aria-live="polite"></div>' : '') +
            '<div class="pdp-actions">' +
              '<button class="pdp-btn solid" id="add-btn"' + (p.stock <= 0 ? ' disabled' : '') + '>' + (p.stock <= 0 ? 'Sold out' : 'Add to cart ' + icons.arrow) + '</button>' +
              '<button class="pdp-btn outline" id="buy-btn"' + (p.stock <= 0 ? ' disabled' : '') + '>Buy it now ' + icons.arrow + '</button>' +
            '</div>' +
            '<ul class="pdp-bullets">' + bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
            (p.description || []).map(function (d) { return '<p class="pdp-desc">' + esc(d) + '</p>'; }).join('') +
            '<div class="acc-list pdp-acc">' +
              acc('Return policy', RETURNS) +
              (p.family ? acc('Material', '<p>' + esc(MATERIAL[p.family] || '') + '</p>') : '') +
              (p.family ? acc('Wear and care', '<p>' + esc(CARE[p.family] || '') + '</p>') : '') +
              acc('Shipping', SHIPPING) +
              acc('FAQ', (p.faq || []).map(function (f) { return '<p><strong>' + esc(f.q) + '</strong><br>' + esc(f.a) + '</p>'; }).join('')) +
              acc('Reviews (' + reviewStats(p).count.toLocaleString('en-US') + ')', reviewsHtml(p), false, 'reviews') +
            '</div>' +
          '</div>' +
        '</section>' +
      '</div>';

    // Entrance animation on the first visit only (colour switches redraw without replaying it)
    if (!render.entered && !DV.reduceMotion) {
      root.classList.add('pdp-enter');
      setTimeout(function () { root.classList.remove('pdp-enter'); }, 1600);
    }
    render.entered = true;

    DV.refresh(root);

    // ----- Gallery: thumbnails, swipe, dots, zoom -----
    var track = root.querySelector('.pdp-track');
    var thumbs = root.querySelectorAll('.pdp-thumb');
    var dots = root.querySelectorAll('.pdp-dots i');
    var current = 0;
    // Animate the slide ourselves: native smooth scrolling on a scroll-snap strip can be
    // cancelled by the snap in some browsers, which left thumbnail clicks doing nothing.
    var anim = 0, settle = 0, animating = false;
    function goTo(i, smooth) {
      var target = Math.max(0, Math.min(media.length - 1, i));
      var to = Math.max(0, Math.min(target * track.clientWidth, track.scrollWidth - track.clientWidth));
      var from = track.scrollLeft;
      setActive(target);                               // highlight thumb + dot right away
      cancelAnimationFrame(anim);
      clearTimeout(settle);
      if (smooth === false || DV.reduceMotion || Math.abs(to - from) < 1) { track.scrollLeft = to; return; }
      var dur = 520, start = null;
      animating = true;                                // scroll events mustn't move the highlight meanwhile
      track.classList.add('dragging');                 // snap off while animating
      function finish() {
        cancelAnimationFrame(anim); clearTimeout(settle);
        track.scrollLeft = to; track.classList.remove('dragging');
        animating = false; setActive(target);
      }
      anim = requestAnimationFrame(function tick(now) {
        if (start === null) start = now;
        var t = Math.min(1, (now - start) / dur);
        track.scrollLeft = from + (to - from) * (1 - Math.pow(1 - t, 3));   // ease-out cubic
        if (t < 1) anim = requestAnimationFrame(tick); else finish();
      });
      // safety net: always land on the slide and restore snap, even if frames are throttled
      settle = setTimeout(finish, dur + 120);
    }
    function setActive(i) {
      if (i === current) return;
      current = i;
      thumbs.forEach(function (t, n) { t.setAttribute('aria-current', String(n === i)); });
      dots.forEach(function (d, n) { d.classList.toggle('on', n === i); });
      track.querySelectorAll('video').forEach(function (v) { v.pause(); });
      var v = track.children[i] && track.children[i].querySelector('video');
      if (v) v.play().catch(function () {});
    }
    thumbs.forEach(function (t) { t.addEventListener('click', function () { goTo(+t.dataset.i); }); });
    dots.forEach(function (d) { d.addEventListener('click', function () { goTo(+d.dataset.i); }); });
    // user swipes/drags update the highlight; programmatic slides set it themselves
    track.addEventListener('scroll', function () {
      if (animating) return;
      requestAnimationFrame(function () { if (!animating) setActive(Math.round(track.scrollLeft / track.clientWidth)); });
    }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(media.length - 1, current + 1)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, current - 1)); }
    });
    // mouse drag on desktop
    var drag = null;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('video')) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
      track.classList.add('dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      track.scrollLeft = drag.left - dx;
    });
    function endDrag() {
      if (!drag) return;
      var target = Math.round(track.scrollLeft / track.clientWidth);
      var moved = drag.moved;
      var dx = track.scrollLeft - drag.left;
      if (moved && Math.abs(dx) > track.clientWidth * 0.12) target = dx > 0 ? Math.ceil(drag.left / track.clientWidth + 0.01) : Math.floor(drag.left / track.clientWidth - 0.01);
      drag = null;
      track.classList.remove('dragging');
      goTo(Math.max(0, Math.min(media.length - 1, target)));
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    root.querySelector('.pdp-zoom').addEventListener('click', function () { openLightbox(media, current); });
    track.addEventListener('dblclick', function () { openLightbox(media, current); });

    // ----- Colour swatches: switch colourway in place -----
    root.querySelectorAll('.swatch').forEach(function (s) {
      s.addEventListener('click', function () {
        if (s.dataset.id === p.id) return;
        var y = window.scrollY;
        history.replaceState(null, '', 'product.html?id=' + encodeURIComponent(s.dataset.id));
        render(s.dataset.id);
        window.scrollTo(0, y);
      });
    });

    // ----- Size -----
    var chosen = '';
    var optErr = document.getElementById('opt-error');
    root.querySelectorAll('.opt').forEach(function (o) {
      o.addEventListener('click', function () {
        chosen = o.dataset.v;
        root.querySelectorAll('.opt').forEach(function (x) { x.setAttribute('aria-checked', String(x === o)); });
        if (optErr) optErr.textContent = '';
      });
    });

    // ----- Add to cart / Buy it now -----
    function addToCart() {
      if (p.option && !chosen) {
        optErr.textContent = 'Please choose a ' + p.option.label.toLowerCase() + '.';
        root.querySelector('.opt').focus();
        return false;
      }
      if (!window.Cart.add(p.id, 1, chosen)) return false;
      document.querySelectorAll('[data-cart-count]').forEach(function (b) {
        b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      });
      return true;
    }
    document.getElementById('add-btn').addEventListener('click', function () {
      if (addToCart()) DV.addedToast(p, 1);
    });
    document.getElementById('buy-btn').addEventListener('click', function () {
      if (addToCart()) location.href = 'checkout.html';
    });

    // ----- Rating link: open the Reviews accordion and scroll to it -----
    var revAcc = document.getElementById('reviews');
    root.querySelector('.pdp-rating').addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();   // handled here, not by site.js's in-page link scrolling
      if (!revAcc.open) revAcc.querySelector('summary').click();
      var y = revAcc.getBoundingClientRect().top + window.scrollY - (document.querySelector('.site-header').offsetHeight + 16);
      if (DV.lenis) { DV.lenis.scrollTo(window.scrollY, { immediate: true }); DV.lenis.scrollTo(y, { duration: 1.1 }); }
      else window.scrollTo({ top: y, behavior: DV.reduceMotion ? 'auto' : 'smooth' });
    });

    // ----- Write a review -----
    var form = document.getElementById('review-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = document.getElementById('rv-error');
      var rating = +((form.querySelector('input[name="rating"]:checked') || {}).value || 0);
      var name = document.getElementById('rv-name').value.trim();
      var title = document.getElementById('rv-title').value.trim();
      var text = document.getElementById('rv-text').value.trim();
      if (!rating) { err.textContent = 'Please choose a star rating.'; return; }
      if (!name || !title || text.length < 10) { err.textContent = 'Please add your name, a title and a few words (10+ characters).'; return; }
      var today = new Date();
      var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
      saveReview(p.id, { name: name, rating: rating, title: title, text: text, date: iso, mine: true });
      var y = window.scrollY;
      render(p.id);                                  // redraw with the new review and updated score
      var acc2 = document.getElementById('reviews');
      acc2.open = true; acc2.classList.add('is-open');
      window.scrollTo(0, y);
      DV.toast('<div><strong>Thanks for your review!</strong><span>It now appears on this page.</span></div>');
    });
  }

  // ----- Lightbox (zoomed image viewer) -----
  function openLightbox(media, start) {
    var items = media.filter(function (m) { return m.type === 'img'; });
    if (!items.length) return;
    var idx = Math.max(0, items.indexOf(media[start]));
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Image viewer');
      lightbox.innerHTML = '<button class="lb-close" aria-label="Close">' + icons.close + '</button>' +
        '<button class="lb-nav prev" aria-label="Previous image">' + icons.left + '</button>' +
        '<figure class="lb-stage"><img alt=""></figure>' +
        '<button class="lb-nav next" aria-label="Next image">' + icons.right + '</button>';
      document.body.appendChild(lightbox);
    }
    var img = lightbox.querySelector('img');
    function show(i) {
      idx = (i + items.length) % items.length;
      img.src = items[idx].src;
      lightbox.classList.toggle('studio', !!items[idx].studio);
    }
    function close() {
      lightbox.classList.remove('open');
      document.removeEventListener('keydown', onKey);
      if (DV.lenis) DV.lenis.start();
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'ArrowLeft') show(idx - 1);
    }
    lightbox.querySelector('.lb-close').onclick = close;
    lightbox.querySelector('.prev').onclick = function () { show(idx - 1); };
    lightbox.querySelector('.next').onclick = function () { show(idx + 1); };
    lightbox.onclick = function (e) { if (e.target === lightbox || e.target.classList.contains('lb-stage')) close(); };
    lightbox.querySelectorAll('.lb-nav').forEach(function (b) { b.hidden = items.length < 2; });
    show(idx);
    lightbox.classList.add('open');
    document.addEventListener('keydown', onKey);
    if (DV.lenis) DV.lenis.stop();
    lightbox.querySelector('.lb-close').focus();
  }

  render(DV.param('id'));
})();

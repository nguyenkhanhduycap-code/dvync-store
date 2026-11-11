/* Device and Premium landing pages: Free-vs-Premium comparison table, auto-advancing
   feature list, join buttons (add the product and go to the cart) and the floating
   join button. Shared by device.html and premium.html. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc;
  // Which page this is (device.html or premium.html set <body data-plan>)
  var CURRENT = document.body.dataset.plan || 'device';

  // ----- Join: add the product once and confirm with a toast; the visitor stays on the page -----
  function join(id, btn) {
    var planId = id;
    var p = window.DV_findProduct(planId);
    var inCart = window.Cart.items().some(function (i) { return i.id === planId; });
    if (!inCart) {
      window.Cart.add(planId, 1);
      DV.addedToast(p, 1);
    } else {
      DV.toast('<img src="' + esc(p.images[0]) + '" alt=""><div><strong>Already in your cart</strong><span>' + esc(p.name) + '</span></div><a href="cart.html" class="btn btn-primary btn-sm">View cart</a>');
    }
    // brief "Added" state on the button that was pressed
    if (btn && !btn.classList.contains('is-added')) {
      var label = btn.innerHTML;
      btn.classList.add('is-added');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>' + (inCart ? 'In your cart' : 'Added to cart');
      setTimeout(function () { btn.innerHTML = label; btn.classList.remove('is-added'); }, 1800);
    }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-join]');
    if (b) join(b.dataset.join, b);
  });

  // ----- Billing toggle (Premium only): switches which plan id "Start Premium" adds -----
  var billingToggle = document.querySelector('.m-billing-toggle');
  if (billingToggle) {
    var priceEl = document.querySelector('[data-billing-price]');
    var buyBtn = document.querySelector('.m-buy [data-join]');
    var stickyBtn = document.querySelector('.sticky-join[data-join]');
    var plans = { month: window.DV_findProduct('premium-monthly'), year: window.DV_findProduct('premium') };
    billingToggle.addEventListener('click', function (e) {
      var b = e.target.closest('[data-billing]');
      if (!b) return;
      var cycle = b.dataset.billing, p = plans[cycle];
      Array.prototype.forEach.call(billingToggle.children, function (c) {
        c.classList.toggle('is-active', c === b);
        c.setAttribute('aria-pressed', String(c === b));
      });
      if (priceEl) priceEl.innerHTML = 'AI analysis, recovery recommendations and trend reports: <strong>' + esc(window.Cart.money(p.price)) + '/' + (cycle === 'month' ? 'mo' : 'yr') + '</strong>.';
      if (buyBtn) buyBtn.dataset.join = p.id;
      if (stickyBtn) stickyBtn.dataset.join = p.id;
    });
  }

  // ----- Comparison table -----
  var icons = {
    card: '<path d="M3 7h18v10H3zM3 10h18"/>',
    battery: '<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2M6 11v2M9 11v2"/>',
    charge: '<rect x="6" y="4" width="12" height="16" rx="3"/><path d="M12.5 8l-2.5 4h4l-2.5 4"/>',
    gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>',
    coach: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    ecg: '<path d="M3 13h3l2-6 3 12 3-9 2 3h5"/>',
    steps: '<path d="M7 4c2 0 3 2 3 5s-1 5-3 5-2-3-2-5 0-5 2-5zM6 17h4v3H6zM16 7c2 0 2 2 2 4s-1 4-3 4-2-3-2-4 1-4 3-4zM14 18h4v2h-4z"/>',
    alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M5 4L3 6M19 4l2 2"/>',
    cycle: '<circle cx="12" cy="12" r="8" stroke-dasharray="3 2.2"/><circle cx="12" cy="12" r="2.5"/>',
    stress: '<path d="M4 15a8 8 0 0 1 16 0"/><path d="M12 15l-3-4"/><path d="M4 19h16"/>'
  };
  function icon(name) {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[name] || '') + '</svg>';
  }

  var cmp = window.DV_PLAN_COMPARE;
  var compareEl = document.getElementById('m-compare');
  if (compareEl && cmp) {
    // One grid, row by row, so cells line up across plans and the title row can be sticky
    var cols = cmp.columns.map(function (col) {
      // The premium column shows the monthly plan's product id (same features, lower sticker price)
      var p = window.DV_findProduct(col.id === 'free' ? 'device' : col.id === 'premium' ? 'premium-monthly' : col.id);
      // A device.html visitor (no software tier chosen yet) sees the Free column highlighted,
      // since Free is what you get with just the device.
      var isCur = col.id === CURRENT || (CURRENT === 'device' && col.id === 'free');
      return { col: col, p: p, cur: isCur ? ' cur' : '' };
    });
    var rowOf = function (cls, fn) {
      return cols.map(function (c) { return '<div class="cmp-cell ' + cls + c.cur + '">' + fn(c) + '</div>'; }).join('');
    };
    var html = '';
    html += rowOf('cmp-head', function (c) { return '<h3 class="spaced">' + esc(c.col.title || c.p.tier) + '</h3>'; });
    html += rowOf('cmp-inc', function (c) { return 'Includes ' + esc(c.col.includes); });
    // Band + charger render on a transparent background (falls back to the product photo)
    html += rowOf('cmp-img', function (c) {
      return '<div><img src="' + esc(c.p.compareImage || c.p.images[0]) + '" alt="' + esc((c.p.tier || c.p.name) + ' band and charger') + '" loading="lazy"></div>';
    });
    html += rowOf('cmp-price', function (c) { return esc(c.col.price || ('Available at ' + window.Cart.money(c.p.price) + '/yr')); });
    html += rowOf('cmp-cta', function (c) {
      if (c.col.id === 'free') return '<a class="btn btn-white" href="device.html">' + esc(c.col.cta) + '</a>';
      return c.col.id === CURRENT
        ? '<button class="btn btn-white" data-join="' + c.p.id + '">' + esc(c.col.cta) + '</button>'
        : '<a class="btn btn-white" href="' + (c.p.page || 'product.html?id=' + c.p.id) + '">' + esc(c.col.cta) + '</a>';
    });
    cmp.rows.forEach(function (row, ri) {
      var last = ri === cmp.rows.length - 1 ? ' cmp-last' : '';
      html += cols.map(function (c) {
        var on = row.in.indexOf(c.col.id) > -1;
        // Like Whoop: included features show icon + label; missing ones show only a dash
        return '<div class="cmp-cell cmp-row' + (on ? '' : ' off') + last + c.cur + '">' +
          (on ? icon(row.icon) + '<span>' + esc(row.label) + '</span>'
              : '<span class="cmp-dash" aria-hidden="true"></span><span class="sr-only">' + esc(row.label) + ': not included</span>') +
          '</div>';
      }).join('');
    });
    compareEl.innerHTML = '<div class="cmp-scroll"><div class="cmp" data-reveal style="--cmp-cols:' + cmp.columns.length + '">' + html + '</div></div>' +
      '<p class="cmp-foot">See product notes below.</p>';
    DV.refresh(compareEl);
  }

  // ----- Feature list: click to switch, auto-advances while on screen -----
  var feats = Array.prototype.slice.call(document.querySelectorAll('.m-feat'));
  var pics = Array.prototype.slice.call(document.querySelectorAll('.m-feat-media img'));
  var active = 0;
  var autoplay = !DV.reduceMotion;
  function show(i) {
    active = (i + feats.length) % feats.length;
    feats.forEach(function (f, n) {
      var on = n === active;
      f.classList.toggle('is-active', on);
      f.setAttribute('aria-selected', String(on));
    });
    pics.forEach(function (img, n) { img.classList.toggle('is-active', n === active); });
  }
  feats.forEach(function (f, n) {
    // a click takes over: stop auto-advancing and show the chosen item's bar full
    f.addEventListener('click', function () { autoplay = false; f.parentElement.classList.add('manual'); show(n); });
    // the progress bar finishing moves to the next item
    f.addEventListener('animationend', function () { if (autoplay && n === active) show(active + 1); });
  });
  if ('IntersectionObserver' in window && feats.length) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        feats.forEach(function (f) { f.classList.toggle('paused', !en.isIntersecting || !autoplay); });
      });
    }, { threshold: 0.35 }).observe(document.querySelector('.m-feat-grid'));
  }

  // ----- Hero: photo layer drifts up at 1/6 scroll speed and darkens as the page slides over it -----
  var layer = document.querySelector('.m-hero-layer');
  var dim = document.querySelector('.m-hero-dim');
  var copy = document.querySelector('.m-hero-copy');
  function heroFx(y, vh) {
    if (DV.reduceMotion || y > vh * 1.4) return;          // off-screen: do nothing
    var p = Math.min(1, y / vh);
    layer.style.transform = 'translate3d(0,' + (-y / 6).toFixed(1) + 'px,0)';
    dim.style.opacity = (p * 0.65).toFixed(3);
    copy.style.opacity = Math.max(0, 1 - p * 1.1).toFixed(3);
  }

  // ----- Floating join button: after the hero, hidden over the footer -----
  var sticky = document.querySelector('.sticky-join');
  var footer = document.querySelector('.site-footer');
  function updateSticky(y, vh) {
    var pastHero = y > vh * 0.75;
    var atFooter = footer && footer.getBoundingClientRect().top < vh - 40;
    sticky.classList.toggle('show', pastHero && !atFooter);
  }

  // ----- Comparison: mark the table while its title row is stuck -----
  var cmpGrid = document.querySelector('.cmp');
  var cmpHead = document.querySelector('.cmp-head');
  function updateCmp() {
    if (!cmpGrid || !cmpHead) return;
    var g = cmpGrid.getBoundingClientRect();
    var stuck = g.top < parseFloat(getComputedStyle(cmpHead).top) - 1 && g.bottom > cmpHead.offsetHeight + 120;
    cmpGrid.classList.toggle('stuck', stuck);
  }

  var tick = false;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    heroFx(y, vh);
    updateSticky(y, vh);
    updateCmp();
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { requestAnimationFrame(frame); tick = true; }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();
})();

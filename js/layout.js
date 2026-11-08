/* Shared promo bar, header and footer, injected into every page so the
   navigation only lives in one place. Load this before site.js. */
(function () {
  'use strict';

  var chevron = '<svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  var mark = '<svg class="logo-mark" viewBox="0 0 100 100" aria-hidden="true"><path d="M73.3 12.7A44 44 0 1 1 26.7 12.7" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/><circle cx="50" cy="50" r="11" fill="var(--brand)"/></svg>';
  var cartIcon = '<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.2 11.1A2 2 0 0 1 15.8 20H8.2a2 2 0 0 1-2-1.9L5 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

  // Membership cards for the Memberships menu: lifestyle photo, spaced-out tier name, arrow, one-line pitch
  var memProducts = window.DV_PRODUCTS.filter(function (p) { return p.category === 'memberships'; });
  function memCards() {
    var arrow = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return memProducts.map(function (p) {
      return '<a class="mem-card" href="' + (p.page || 'product.html?id=' + encodeURIComponent(p.id)) + '">' +
        '<span class="mem-img"><img src="' + (p.navImage || p.images[0]) + '" alt="" loading="lazy"></span>' +
        '<span class="mem-body"><span class="mem-name">' + (p.tier || p.name) + arrow + '</span>' +
        '<span class="mem-desc">' + p.short + '</span></span></a>';
    }).join('');
  }

  var promo =
    '<div class="promo"><p>Free shipping on orders over 750,000 VND &mdash; plus 30-day returns. <a href="shop.html">Shop now</a></p></div>';

  var header =
    '<header class="site-header" id="top">' +
      '<div class="header-inner">' +
        '<a href="index.html" class="logo" aria-label="D\'Vync home">' + mark + '<span class="logo-word">D\'Vync</span></a>' +
        '<div class="header-actions">' +
          '<a href="cart.html" class="cart-link" aria-label="Cart">' + cartIcon + '<span class="cart-count" data-cart-count hidden>0</span></a>' +
          '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button>' +
        '</div>' +
        '<nav class="main-nav" id="main-nav" aria-label="Main" data-lenis-prevent>' +
          '<ul>' +
            '<li class="has-menu mega">' +
              '<button class="menu-btn" aria-expanded="false">Device &amp; Premium ' + chevron + '</button>' +
              '<div class="dropdown dropdown-mem" style="--mem-count:' + memProducts.length + '">' +
                '<div class="mem-cards">' + memCards() + '</div>' +
              '</div>' +
            '</li>' +
            '<li><a href="accessories.html">Accessories</a></li>' +
            '<li><a href="how-it-works.html">How it works</a></li>' +
            '<li><a href="why-dvync.html">Why D\'Vync?</a></li>' +
            '<li><a href="blog.html">Blog</a></li>' +
            '<li><a href="faq.html">Help</a></li>' +
          '</ul>' +
          '<a href="shop.html?cat=memberships" class="btn btn-primary btn-sm">Join now</a>' +
        '</nav>' +
      '</div>' +
    '</header>';

  var footer =
    '<footer class="site-footer">' +
      '<div class="container footer-grid">' +
        '<div class="footer-brand">' +
          '<a href="index.html" class="logo" aria-label="D\'Vync home">' + mark + '<span class="logo-word">D\'Vync</span></a>' +
          '<p>Wearable health, without the screen.</p>' +
        '</div>' +
        '<div><h4>Device &amp; Premium</h4><ul>' +
          '<li><a href="device.html">D\'Vync Device</a></li>' +
          '<li><a href="premium.html">D\'Vync Premium</a></li>' +
          '<li><a href="shop.html?cat=memberships">Compare</a></li>' +
        '</ul></div>' +
        '<div><h4>Accessories</h4><ul>' +
          '<li><a href="shop.html?cat=bands">Bands</a></li>' +
          '<li><a href="accessories.html">All accessories</a></li>' +
        '</ul></div>' +
        '<div><h4>Help</h4><ul>' +
          '<li><a href="faq.html">FAQ</a></li>' +
          '<li><a href="contact.html">Contact us</a></li>' +
          '<li><a href="cart.html">Your cart</a></li>' +
        '</ul></div>' +
        '<div><h4>Policies</h4><ul>' +
          '<li><a href="shipping.html">Shipping</a></li>' +
          '<li><a href="returns.html">Returns &amp; refunds</a></li>' +
          '<li><a href="privacy.html">Health data privacy</a></li>' +
        '</ul></div>' +
        '<div><h4>Company</h4><ul>' +
          '<li><a href="about.html">About us</a></li>' +
          '<li><a href="how-it-works.html">How it works</a></li>' +
          '<li><a href="blog.html">Blog</a></li>' +
          '<li><a href="contact.html">Press &amp; partnerships</a></li>' +
        '</ul></div>' +
      '</div>' +
      '<div class="container footer-bottom">' +
        '<p>&copy; <span id="year">2026</span> D\'Vync. All rights reserved. Demo store &mdash; no real orders are placed.</p>' +
        '<p>D\'Vync is not a medical device and is not intended to diagnose or treat any condition.</p>' +
      '</div>' +
    '</footer>';

  function inject(selector, html) {
    var slot = document.querySelector(selector);
    if (slot) slot.outerHTML = html;
  }
  inject('[data-include="promo"]', promo);
  inject('[data-include="header"]', header);
  inject('[data-include="footer"]', footer);

  // Mark the current page's nav link
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav > ul > li > a').forEach(function (a) {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });
})();

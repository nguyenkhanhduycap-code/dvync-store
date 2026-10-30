/* Behaviour shared by every page: smooth scroll, menus, sticky header, toast,
   accordions, reveals and small helpers. Exposes window.DV for page scripts.
   Load order: data.js, layout.js, cart.js, (Lenis/GSAP), site.js, page script. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var desktop = window.matchMedia('(min-width: 981px)');
  var lenis = null;

  // ----- Smooth scroll (Lenis), synced with GSAP's ticker when GSAP is on the page -----
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  // Smooth jumps for links to a section on the current page (e.g. "index.html#plans" on the homepage)
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || a.target === '_blank') return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash || url.hash.length < 2) return;
    var target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: url.hash === '#top' ? 0 : -72, duration: 1.5 });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    history.replaceState(null, '', url.hash);
    if (target.matches('details')) target.open = true;
  });

  // ----- Mobile menu -----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setNav(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
    if (lenis) open ? lenis.stop() : lenis.start();
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  }

  // ----- Dropdown menus (click-toggle; hover on desktop) -----
  var menus = document.querySelectorAll('.has-menu');
  function closeMenus(except) {
    menus.forEach(function (m) {
      if (m !== except) {
        m.classList.remove('open');
        m.querySelector('.menu-btn').setAttribute('aria-expanded', 'false');
      }
    });
  }
  menus.forEach(function (m) {
    var btn = m.querySelector('.menu-btn');
    btn.addEventListener('click', function () {
      var open = !m.classList.contains('open');
      closeMenus(m);
      m.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    m.addEventListener('mouseenter', function () {
      if (desktop.matches) { closeMenus(m); m.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    });
    m.addEventListener('mouseleave', function () { if (desktop.matches) closeMenus(); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.has-menu')) closeMenus(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenus(); setNav(false); } });

  // ----- Header: hide on scroll down, show on scroll up -----
  var header = document.querySelector('.site-header');
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var menuOpen = (nav && nav.classList.contains('open')) || document.querySelector('.has-menu.open');
    header.classList.toggle('scrolled', y > 10);
    if (!menuOpen && !reduceMotion) {
      if (y > lastY && y > 200) header.classList.add('hide');
      else if (y < lastY - 4) header.classList.remove('hide');
    }
    lastY = y;
    ticking = false;
  }
  if (header) {
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
  }

  // ----- Images fade in once loaded -----
  document.querySelectorAll('main img').forEach(function (img) {
    if (img.complete && img.naturalWidth) return;
    img.classList.add('fade-img');
    function done() { img.classList.add('loaded'); }
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });

  // ----- Reveal on scroll for inner pages ([data-reveal]) -----
  // Down: rise in. Up: come into focus. Resets once fully off-screen.
  function observeReveals(root) {
    var els = (root || document).querySelectorAll('[data-reveal]:not(.rv)');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      els.forEach(function (el) { el.classList.add('rv', 'in'); });
      return;
    }
    // Start hidden with no transition (otherwise content already on screen fades out and straight
    // back in, so the first screen never visibly animates), then let the observer reveal it.
    els.forEach(function (el) {
      el.classList.add('rv', 'rv-init');
      if (el.dataset.reveal) el.style.setProperty('--rv-delay', el.dataset.reveal + 'ms');
    });
    void document.body.offsetHeight;   // commit the hidden state
    requestAnimationFrame(function () {
      els.forEach(function (el) { el.classList.remove('rv-init'); revealIO.observe(el); });
    });
  }
  var lastScrollY = window.scrollY, scrollingUp = false;
  window.addEventListener('scroll', function () {
    scrollingUp = window.scrollY < lastScrollY; lastScrollY = window.scrollY;
  }, { passive: true });
  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var el = en.target;
      if (en.isIntersecting) {
        el.classList.toggle('from-up', scrollingUp);
        el.classList.add('in');
      } else if (en.boundingClientRect.bottom < 0 || en.boundingClientRect.top > window.innerHeight) {
        el.classList.remove('in');
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;

  // ----- Accordions: animate <details class="acc"> open/close -----
  function wireAccordions(root) {
    (root || document).querySelectorAll('details.acc:not([data-wired])').forEach(function (d) {
      d.setAttribute('data-wired', '');
      var summary = d.querySelector('summary');
      var body = d.querySelector('.acc-body');
      if (!summary || !body || reduceMotion) return;
      summary.addEventListener('click', function (e) {
        e.preventDefault();
        if (d.open) {
          body.style.height = body.scrollHeight + 'px';
          requestAnimationFrame(function () { body.style.height = '0px'; });
          d.classList.remove('is-open');
          body.addEventListener('transitionend', function te() { d.open = false; body.style.height = ''; body.removeEventListener('transitionend', te); });
        } else {
          d.open = true;
          d.classList.add('is-open');
          body.style.height = '0px';
          requestAnimationFrame(function () { body.style.height = body.scrollHeight + 'px'; });
          body.addEventListener('transitionend', function te() { body.style.height = ''; body.removeEventListener('transitionend', te); });
        }
      });
    });
  }

  // ----- Toast ("Added to cart") -----
  var toastEl = null, toastTimer = null;
  function toast(html) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  // ----- Helpers for page scripts -----
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function stars(rating) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      var fill = Math.max(0, Math.min(1, rating - (i - 1)));
      out += '<span class="star" style="--f:' + Math.round(fill * 100) + '%"></span>';
    }
    return '<span class="stars" role="img" aria-label="' + rating + ' out of 5 stars">' + out + '</span>';
  }
  function param(name) { return new URLSearchParams(location.search).get(name); }
  function stockInfo(p) {
    if (p.stock <= 0) return { cls: 'out', text: 'Out of stock' };
    if (p.stock <= 10) return { cls: 'low', text: 'Only ' + p.stock + ' left in stock' };
    return { cls: 'in', text: 'In stock — ships in 1–2 business days' };
  }
  function addedToast(p, qty) {
    toast('<img src="' + esc(p.images[0]) + '" alt=""><div><strong>Added to cart</strong><span>' + esc(p.name) + (qty > 1 ? ' × ' + qty : '') + '</span></div><a href="cart.html" class="btn btn-primary btn-sm">View cart</a>');
  }
  function formatDate(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  window.DV = {
    lenis: lenis, reduceMotion: reduceMotion, hasGsap: hasGsap, desktop: desktop,
    esc: esc, stars: stars, param: param, stockInfo: stockInfo, toast: toast, addedToast: addedToast,
    formatDate: formatDate, refresh: function (root) { observeReveals(root); wireAccordions(root); }
  };

  observeReveals();
  wireAccordions();

  // Safety net: anything marked data-reveal that no script picked up still shows
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.rv)').forEach(function (el) { el.classList.add('rv', 'in'); });
    }, 1500);
  });
})();

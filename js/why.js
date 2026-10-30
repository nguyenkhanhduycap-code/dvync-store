/* Why D'Vync page: hero drift and dim, the sticky section nav (follows the section in view,
   click jumps below the bars), statement words that light up on scroll, floating join button. */
(function () {
  'use strict';

  var DV = window.DV;
  var reduce = DV.reduceMotion;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ----- Statement: wrap each word (line by line) so it can light up -----
  var fill = document.querySelector('[data-fill]');
  var words = [];
  if (fill) {
    fill.querySelectorAll('.line').forEach(function (line) {
      line.innerHTML = line.textContent.trim().split(/\s+/).map(function (w) {
        return '<span class="w">' + DV.esc(w) + '</span>';
      }).join(' ');
    });
    words = Array.prototype.slice.call(fill.querySelectorAll('.w'));
  }
  function updateFill(vh) {
    if (!fill || reduce) return;
    var r = fill.getBoundingClientRect();
    var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
    var lit = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
  }

  // ----- Section nav -----
  var nav = document.querySelector('.why-nav');
  var links = Array.prototype.slice.call(document.querySelectorAll('.why-nav a'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  function setActive(id) {
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      // keep the current label in view when the row scrolls sideways on phones
      var track = a.parentElement;
      if (on && track.scrollWidth > track.clientWidth) {
        track.scrollTo({ left: a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();   // handled here instead of site.js, to clear the nav bar too
      var rectTop = target.getBoundingClientRect().top;
      // scrolling up brings the header back, so leave room for it as well
      var gap = nav.offsetHeight + (rectTop < 0 ? document.querySelector('.site-header').offsetHeight : 0);
      var y = rectTop + window.scrollY - gap;
      if (DV.lenis) {
        DV.lenis.scrollTo(window.scrollY, { immediate: true });   // resync Lenis with the real position
        DV.lenis.scrollTo(y, { duration: 1.4 });
      } else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      setActive(target.id);
    });
  }

  // ----- Hero: photo drifts up slowly and darkens as the page slides over it -----
  var layer = document.querySelector('.why-hero-layer');
  var dim = document.querySelector('.why-hero-dim');
  var copy = document.querySelector('.why-hero-copy');
  function heroFx(y, vh) {
    if (reduce || !layer || y > vh * 1.4) return;
    var p = Math.min(1, y / vh);
    layer.style.transform = 'translate3d(0,' + (-y / 6).toFixed(1) + 'px,0)';
    dim.style.opacity = (p * 0.7).toFixed(3);
    copy.style.opacity = Math.max(0, 1 - p * 1.2).toFixed(3);
    copy.style.transform = 'translate3d(0,' + (-y * 0.15).toFixed(1) + 'px,0)';
  }

  // ----- Hero video: plays while the hero is in view, pause button -----
  var heroVid = document.querySelector('.why-hero-video');
  var heroBtn = document.querySelector('.why-hero-toggle');
  var heroPausedByUser = reduce;   // with reduced motion it waits for the play button
  var heroInView = true;
  function syncHero() {
    if (!heroVid) return;
    if (heroInView && !heroPausedByUser) { var p = heroVid.play(); if (p && p.catch) p.catch(function () {}); }
    else heroVid.pause();
    heroBtn.setAttribute('aria-pressed', String(heroPausedByUser));
    heroBtn.setAttribute('aria-label', heroPausedByUser ? 'Play video' : 'Pause video');
  }
  if (heroBtn) heroBtn.addEventListener('click', function () { heroPausedByUser = !heroPausedByUser; syncHero(); });
  syncHero();
  function updateHeroVideo(y, vh) {
    var inView = y < vh * 1.1;   // covered by the page after that
    if (inView !== heroInView) { heroInView = inView; syncHero(); }
  }

  // ----- Floating join button: after the hero, hidden over the footer -----
  var join = document.querySelector('.why-join');
  var footer = document.querySelector('.site-footer');
  function updateJoin(y, vh) {
    if (!join) return;
    var atFooter = footer && footer.getBoundingClientRect().top < vh - 40;
    join.classList.toggle('show', y > vh * 0.7 && !atFooter);
  }

  var tick = false;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    heroFx(y, vh);
    updateHeroVideo(y, vh);
    updateFill(vh);
    updateJoin(y, vh);
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { requestAnimationFrame(frame); tick = true; }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();
})();

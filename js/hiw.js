/* How it works page: hero parallax, statement words that light up on scroll,
   the "What D'Vync measures" tabs and numbered accordions (which swap the phone screen),
   the first-30-days progress line and the healthspan video. */
(function () {
  'use strict';

  var DV = window.DV;
  var reduce = DV.reduceMotion;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // ----- Statement: wrap each word so it can light up -----
  var fill = document.querySelector('[data-fill]');
  var words = [];
  if (fill) {
    fill.innerHTML = fill.textContent.trim().split(/\s+/).map(function (w) {
      return '<span class="w">' + DV.esc(w) + '</span>';
    }).join(' ');
    words = Array.prototype.slice.call(fill.querySelectorAll('.w'));
  }
  function updateFill(vh) {
    if (!fill || reduce) return;
    var r = fill.getBoundingClientRect();
    // starts when the paragraph enters the lower part of the screen, done by the time it reaches the upper third
    var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.4), 0, 1);
    var lit = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
  }

  // ----- Numbered accordions: one item open at a time; the open item picks the screen -----
  document.querySelectorAll('[data-nacc]').forEach(function (box) {
    var items = Array.prototype.slice.call(box.querySelectorAll('.nacc-item'));
    var shots = Array.prototype.slice.call(box.querySelectorAll('.nacc-media img'));
    items.forEach(function (item, i) {
      item.querySelector('.nacc-btn').addEventListener('click', function () {
        if (item.classList.contains('is-open')) return;   // like Whoop: something always stays open
        items.forEach(function (it, n) {
          it.classList.toggle('is-open', n === i);
          it.querySelector('.nacc-btn').setAttribute('aria-expanded', String(n === i));
        });
        shots.forEach(function (img, n) { img.classList.toggle('is-active', n === Math.min(i, shots.length - 1)); });
      });
    });
  });

  // ----- What D'Vync measures: pill tabs switch the panel (arrow keys move between tabs) -----
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.m-tab'));
  function selectTab(i, focus) {
    tabs.forEach(function (t, n) {
      var on = n === i;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    var tab = tabs[i];
    if (focus) tab.focus();
    // keep the chosen tab in view when the row scrolls sideways on phones
    var row = tab.parentElement;
    if (row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: tab.offsetLeft - row.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(i); });
    t.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); selectTab((i + k + tabs.length) % tabs.length, true); }
      else if (e.key === 'Home') { e.preventDefault(); selectTab(0, true); }
      else if (e.key === 'End') { e.preventDefault(); selectTab(tabs.length - 1, true); }
    });
  });

  // ----- First 30 days: the line fills and each day lights up in turn -----
  var days = document.querySelector('[data-days]');
  var dayEls = days ? Array.prototype.slice.call(days.querySelectorAll('.day')) : [];
  function updateDays(vh) {
    if (!days) return;
    var r = days.getBoundingClientRect();
    var p = reduce ? 1 : clamp((vh * 0.85 - r.top) / (vh * 0.55), 0, 1);
    days.style.setProperty('--p', p.toFixed(3));
    dayEls.forEach(function (d, i) { d.classList.toggle('lit', p >= i / dayEls.length + 0.02); });
  }

  // ----- Healthspan video: plays while on screen, pause button, label that follows the clip's zoom -----
  var ageBox = document.querySelector('.age-video');
  if (ageBox) {
    var ageVid = ageBox.querySelector('video');
    var ageLabel = ageBox.querySelector('.age-label');
    var ageBtn = ageBox.querySelector('.age-toggle');
    var userPaused = reduce;   // with reduced motion it waits for the play button
    var onScreen = false;
    function setBtn(paused) {
      ageBtn.setAttribute('aria-pressed', String(paused));
      ageBtn.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    }
    function syncPlay() {
      if (onScreen && !userPaused) { var p = ageVid.play(); if (p && p.catch) p.catch(function () {}); }
      else ageVid.pause();
      setBtn(userPaused);
    }
    ageBtn.addEventListener('click', function () { userPaused = !userPaused; syncPlay(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; syncPlay(); }, { threshold: 0.25 }).observe(ageBox);
    } else { onScreen = true; syncPlay(); }

    // The clip zooms in slowly over its 10 s loop; measured on the 1920x1080 frames, its label grows
    // from 199 px to 268 px wide (~3.7% a second) and drifts down ~0.105% of the height a second.
    // The background behind the label shifts from deep teal to dark amber mid-clip, so the patch
    // samples the dark pixels just above and below the label and takes their average colour.
    var probe = document.createElement('canvas');
    probe.width = 64; probe.height = 8;
    var pctx = probe.getContext('2d', { willReadFrequently: true });
    function sampleBg() {
      if (ageVid.readyState < 2) return;
      try {
        var vw = ageVid.videoWidth / 1920, vh = ageVid.videoHeight / 1080;
        pctx.drawImage(ageVid, 830 * vw, 538 * vh, 260 * vw, 12 * vh, 0, 0, 64, 4);
        pctx.drawImage(ageVid, 830 * vw, 604 * vh, 260 * vw, 12 * vh, 0, 4, 64, 4);
        var d = pctx.getImageData(0, 0, 64, 8).data, r = 0, g = 0, b = 0, n = 0;
        for (var i = 0; i < d.length; i += 4) {
          if (Math.max(d[i], d[i + 1], d[i + 2]) < 70) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
        }
        if (n) ageLabel.style.setProperty('--bg', 'rgb(' + Math.round(r / n) + ',' + Math.round(g / n) + ',' + Math.round(b / n) + ')');
      } catch (e) { /* canvas unavailable: keep the CSS default colour */ }
    }
    function placeLabel() {
      var t = ageVid.currentTime || 0;
      ageLabel.style.setProperty('--s', (1 + 0.0372 * t).toFixed(4));
      ageLabel.style.setProperty('--dy', (0.105 * t).toFixed(3) + '%');
      sampleBg();
    }
    var frameN = 0;
    (function loop() {
      if (!ageVid.paused && onScreen) {
        var t = ageVid.currentTime || 0;
        ageLabel.style.setProperty('--s', (1 + 0.0372 * t).toFixed(4));
        ageLabel.style.setProperty('--dy', (0.105 * t).toFixed(3) + '%');
        if (++frameN % 4 === 0) sampleBg();   // colour changes slowly; every 4th frame is plenty
      }
      requestAnimationFrame(loop);
    })();
    ageVid.addEventListener('seeked', placeLabel);
    ageVid.addEventListener('loadeddata', placeLabel);
  }

  // ----- Hero: photo drifts up slowly, copy fades as you scroll away -----
  var layer = document.querySelector('.hiw-hero-layer');
  var copy = document.querySelector('.hiw-hero-copy');
  function heroFx(y, vh) {
    if (reduce || !layer || y > vh * 1.2) return;
    var p = Math.min(1, y / vh);
    layer.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(1) + 'px,0)';
    copy.style.opacity = Math.max(0, 1 - p * 1.3).toFixed(3);
    copy.style.transform = 'translate3d(0,' + (-y * 0.12).toFixed(1) + 'px,0)';
  }

  var tick = false;
  function frame() {
    var y = window.scrollY, vh = window.innerHeight;
    heroFx(y, vh);
    updateFill(vh);
    updateDays(vh);
    tick = false;
  }
  window.addEventListener('scroll', function () {
    if (!tick) { requestAnimationFrame(frame); tick = true; }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();
})();

/* Homepage only: features carousel, scroll-linked scenes, signup and hero video.
   Shared behaviour (smooth scroll, menus, header, cart) lives in site.js. */
(function () {
  'use strict';

  var reduceMotion = window.DV.reduceMotion;
  var hasGsap = window.DV.hasGsap;
  var desktop = window.DV.desktop;

  // ----- Features carousel -----
  var track = document.querySelector('.carousel-track');
  if (track) {
    var cards = Array.prototype.slice.call(track.querySelectorAll('.fcard'));
    var prevBtn = document.querySelector('.car-btn.prev');
    var nextBtn = document.querySelector('.car-btn.next');
    var dotsWrap = document.querySelector('.car-dots');
    var behavior = reduceMotion ? 'auto' : 'smooth';

    var cardStep = function () {
      return cards[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    };
    var maxScroll = function () { return track.scrollWidth - track.clientWidth; };
    var pageWidth = function () {
      var perView = Math.max(1, Math.floor((track.clientWidth - 48) / cardStep()));
      return perView * cardStep();
    };
    var pageCount = function () { return Math.max(1, Math.ceil(maxScroll() / pageWidth() - 0.05) + 1); };

    var buildDots = function () {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pageCount(); i++) {
        var d = document.createElement('button');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.dataset.page = i;
        dotsWrap.appendChild(d);
      }
      updateUI();
    };
    var updateUI = function () {
      var x = track.scrollLeft, max = maxScroll();
      prevBtn.disabled = x <= 2;
      nextBtn.disabled = x >= max - 2;
      var pages = dotsWrap.children.length;
      var active = x >= max - 2 ? pages - 1 : Math.round(x / pageWidth());
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
        d.setAttribute('aria-current', String(i === active));
      });
    };

    prevBtn.addEventListener('click', function () { track.scrollBy({ left: -cardStep(), behavior: behavior }); });
    nextBtn.addEventListener('click', function () { track.scrollBy({ left: cardStep(), behavior: behavior }); });
    dotsWrap.addEventListener('click', function (e) {
      var d = e.target.closest('button');
      if (d) track.scrollTo({ left: Math.min(maxScroll(), d.dataset.page * pageWidth()), behavior: behavior });
    });

    var uiTick = false;
    track.addEventListener('scroll', function () {
      if (!uiTick) { requestAnimationFrame(function () { updateUI(); uiTick = false; }); uiTick = true; }
    }, { passive: true });
    window.addEventListener('resize', buildDots);
    buildDots();

    // Mouse drag with momentum, then settle on the nearest card
    var drag = null, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return;
      drag = { x: e.clientX, left: track.scrollLeft, lastX: e.clientX, lastT: performance.now(), v: 0 };
      moved = false;
      track.setPointerCapture(e.pointerId);
      track.classList.add('dragging');
    });
    track.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = drag.left - dx;
      var now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
      drag.lastX = e.clientX; drag.lastT = now;
    });
    var endDrag = function () {
      if (!drag) return;
      var step = cardStep();
      var target = Math.round((track.scrollLeft - drag.v * 180) / step) * step;
      drag = null;
      track.classList.remove('dragging');
      track.scrollTo({ left: Math.max(0, Math.min(maxScroll(), target)), behavior: behavior });
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);

    // "+" opens the card's detail panel
    cards.forEach(function (card) {
      var btn = card.querySelector('.fcard-toggle');
      var detail = card.querySelector('.fcard-detail');
      var label = btn.getAttribute('aria-label');
      btn.addEventListener('click', function () {
        var open = !card.classList.contains('open');
        card.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close' : label);
        detail.setAttribute('aria-hidden', String(!open));
      });
    });
  }

  // ----- Scroll-linked animation (GSAP + ScrollTrigger) -----
  if (hasGsap && !reduceMotion) {

    // Hero: shrinks into a rounded card and the copy drifts up as you scroll away
    gsap.to('.hero-media', {
      scale: 0.9, borderRadius: 32, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-content', {
      yPercent: -35, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: '65% top', scrub: true }
    });

    // Intro: words light up one by one as you read
    var introH2 = document.querySelector('.intro h2');
    if (introH2) {
      var words = introH2.textContent.trim().split(/\s+/);
      introH2.textContent = '';
      words.forEach(function (w, i) {
        var span = document.createElement('span');
        span.className = 'w';
        span.textContent = w;
        introH2.appendChild(span);
        if (i < words.length - 1) introH2.appendChild(document.createTextNode(' '));
      });
      gsap.fromTo(introH2.querySelectorAll('.w'), { opacity: 0.14 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: introH2, start: 'top 82%', end: 'bottom 42%', scrub: 0.6 }
      });
    }

    // Fade-up reveals, batched so groups stagger in together
    var up = gsap.utils.toArray(
      '.intro .eyebrow, .steps li, .section-title, .section-sub, .feature-head > *, .banner-copy > *, ' +
      '.plan, .gallery figure, .lifestyle-copy > *, .labs-inner > div > *, ' +
      '.markers, .cta h2, .cta p, .signup, .footer-grid > div'
    );
    // Two different entrances depending on scroll direction:
    //  - scrolling down (new content): rises up from below with a staggered cascade
    //  - scrolling up (content you've seen): quietly comes back into focus,
    //    with a slight scale and blur and no vertical movement
    // Elements reset off-screen into whichever state the next entrance needs.
    var downReady = { opacity: 0, y: 60, scale: 1, filter: 'blur(0px)' };
    var upReady = { opacity: 0, y: 0, scale: 0.96, filter: 'blur(6px)' };
    // Fast flicks can deliver enter/leave callbacks out of order, so an entrance
    // only runs for elements that are actually on screen when it fires.
    var onScreen = function (batch) { return batch.filter(function (el) { return ScrollTrigger.isInViewport(el); }); };
    // One tween per element (with a growing delay for the cascade) instead of a
    // single staggered tween, so any element's entrance can be cancelled cleanly.
    var cascade = function (els, from, to, gap) {
      els.forEach(function (el, i) {
        gsap.killTweensOf(el);
        gsap.fromTo(el, from, Object.assign({ delay: i * gap, overwrite: true, clearProps: 'transform,filter' }, to));
      });
    };
    var revealDown = function (batch) {
      cascade(onScreen(batch), downReady, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.1);
    };
    var revealUp = function (batch) {
      cascade(onScreen(batch), upReady, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 0.03);
    };
    var resetTo = function (batch, state) {
      gsap.killTweensOf(batch);
      gsap.set(batch, state);
    };
    var batchVars = {
      interval: 0.05,
      start: 'top 92%',
      end: 'bottom 8%',
      onEnter: revealDown,
      onEnterBack: revealUp,
      onLeave: function (b) { resetTo(b, upReady); },       // passed it going down; next entrance is from above
      onLeaveBack: function (b) { resetTo(b, downReady); }  // passed it going up; next entrance is from below
    };
    gsap.set(up, downReady);
    ScrollTrigger.batch(up, batchVars);

    // The design copy sits inside the area pinned for the band rotation on desktop,
    // where per-element triggers would think it scrolled away. There it's revealed by
    // a trigger spanning the whole pin (set up with the rotation below); on mobile the
    // copy isn't pinned, so the normal batch works.
    var designCopy = gsap.utils.toArray('.design-copy > *');
    gsap.set(designCopy, downReady);
    var designCopyPinned = desktop.matches && !!document.querySelector('.scrub-video');
    if (!designCopyPinned) ScrollTrigger.batch(designCopy, batchVars);

    // Feature cards: glide in from the right going down, come into focus together going up
    var fcards = gsap.utils.toArray('.fcard');
    gsap.set(fcards, { opacity: 0, x: 160 });
    ScrollTrigger.create({
      trigger: '.carousel', start: 'top 88%', end: 'bottom 12%',
      onEnter: function () {
        cascade(fcards, { opacity: 0, x: 160, scale: 1, filter: 'blur(0px)' },
          { opacity: 1, x: 0, duration: 1.3, ease: 'expo.out' }, 0.08);
      },
      onEnterBack: function () {
        cascade(fcards, { opacity: 0, x: 0, scale: 0.96, filter: 'blur(6px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 0.03);
      },
      onLeave: function () { resetTo(fcards, { opacity: 0 }); },
      onLeaveBack: function () { resetTo(fcards, { opacity: 0, x: 160 }); }
    });

    // Habits banner: opens from an inset frame to full width while the photo settles
    gsap.fromTo('.banner-card',
      { clipPath: 'inset(7% 7% 7% 7% round 28px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
        scrollTrigger: { trigger: '.banner-card', start: 'top 95%', end: 'top 30%', scrub: true } });
    gsap.fromTo('.banner-card img', { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.banner-card', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Design video grows into place
    gsap.fromTo('.design-video', { scale: 0.84 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.design-video', start: 'top bottom', end: 'center 55%', scrub: true }
    });

    // Band rotation scrubbed by scroll: the section pins while the first ROTATE_END
    // seconds of the clip play forward (scroll down) or backward (scroll up).
    // Frames are pre-captured to a canvas for smooth scrubbing; until they're ready,
    // the video element is seeked directly as a fallback.
    var scrubVideo = document.querySelector('.scrub-video');
    var scrubCanvas = document.querySelector('.scrub-canvas');
    if (scrubVideo && scrubCanvas) {
      var ROTATE_END = 2.0;                       // seconds of the clip containing the rotation
      var FRAME_COUNT = desktop.matches ? 40 : 24;
      var frames = [];
      var framesReady = false;
      var lastFrame = -1;
      var ctx2d = scrubCanvas.getContext('2d');
      var scrub = { p: 0 };

      var render = function () {
        if (framesReady) {
          var i = Math.round(scrub.p * (FRAME_COUNT - 1));
          if (i !== lastFrame) {
            ctx2d.drawImage(frames[i], 0, 0, scrubCanvas.width, scrubCanvas.height);
            lastFrame = i;
          }
        } else if (!scrubVideo.seeking && scrubVideo.readyState >= 1) {
          scrubVideo.currentTime = scrub.p * ROTATE_END;
        }
      };

      // Capture frames from a separate, off-screen copy so the visible video never jumps
      var captureFrames = function () {
        var src = document.createElement('video');
        src.muted = true;
        src.preload = 'auto';
        src.src = scrubVideo.currentSrc || scrubVideo.src;
        src.addEventListener('loadeddata', async function () {
          try {
            for (var f = 0; f < FRAME_COUNT; f++) {
              src.currentTime = (f / (FRAME_COUNT - 1)) * ROTATE_END;
              await new Promise(function (r) { src.addEventListener('seeked', r, { once: true }); });
              frames[f] = await createImageBitmap(src, {
                resizeWidth: scrubCanvas.width, resizeHeight: scrubCanvas.height, resizeQuality: 'high'
              });
            }
            framesReady = true;
            lastFrame = -1;
            render();
            scrubCanvas.classList.add('ready');
          } catch (err) {
            // createImageBitmap unsupported: keep seeking the video directly
          }
        }, { once: true });
      };
      if ('createImageBitmap' in window) {
        ScrollTrigger.create({
          trigger: '.design', start: 'top 300%', once: true, onEnter: captureFrames
        });
      }

      var rotateTween = gsap.to(scrub, {
        p: 1, ease: 'none', onUpdate: render,
        scrollTrigger: {
          trigger: '.design-inner',
          pin: desktop.matches ? '.design-inner' : '.design-video',
          start: 'center center',
          end: '+=110%',
          scrub: 0.6
        }
      });

      // Design copy (desktop): visible from arrival until it scrolls off after the pin
      if (designCopyPinned) {
        ScrollTrigger.create({
          trigger: '.design-inner',
          start: 'top 70%',
          end: function () { return rotateTween.scrollTrigger.end + window.innerHeight * 0.7; },
          // whole group at once (no on-screen filter: lower lines may still be just below the fold)
          onEnter: function () {
            cascade(designCopy, downReady, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 0.1);
          },
          onEnterBack: function () {
            cascade(designCopy, upReady, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 0.03);
          },
          onLeave: function () { resetTo(designCopy, upReady); },
          onLeaveBack: function () { resetTo(designCopy, downReady); }
        });
      }
    }

    // Gallery photos zoom out with scroll
    gsap.utils.toArray('.gallery figure').forEach(function (fig) {
      gsap.fromTo(fig.querySelector('img'), { scale: 1.3 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom 40%', scrub: true }
      });
    });

    // Lifestyle photo parallax
    gsap.fromTo('.lifestyle img', { yPercent: -9 }, {
      yPercent: 9, ease: 'none',
      scrollTrigger: { trigger: '.lifestyle', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // Lab bars grow while visible, and reset when off-screen so they grow again
    var markers = document.querySelector('.markers');
    if (markers) {
      markers.classList.add('anim');
      ScrollTrigger.create({
        trigger: markers, start: 'top 85%', end: 'bottom 15%',
        toggleClass: { targets: markers, className: 'on' }
      });
    }

    // Background flow: blend the page color from one section's data-bg to the next,
    // scrubbed over the stretch where the next section moves up the screen.
    var flowSections = gsap.utils.toArray('main > section[data-bg]');
    if (flowSections.length > 1) {
      document.documentElement.classList.add('bg-flow');
      gsap.set(document.body, { backgroundColor: flowSections[0].dataset.bg });
      for (var s = 1; s < flowSections.length; s++) {
        var fromBg = flowSections[s - 1].dataset.bg;
        var toBg = flowSections[s].dataset.bg;
        if (fromBg.toLowerCase() === toBg.toLowerCase()) continue;
        gsap.fromTo(document.body, { backgroundColor: fromBg }, {
          backgroundColor: toBg, ease: 'none', immediateRender: false,
          scrollTrigger: { trigger: flowSections[s], start: 'top 90%', end: 'top 40%', scrub: true }
        });
      }
    }

    // Recalculate positions once everything (images, fonts) has loaded
    // (sorted by page position first, because the pinned design section adds scroll
    // space that triggers further down must account for)
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener('load', function () { ScrollTrigger.sort(); ScrollTrigger.refresh(); });
  }

  // ----- Email signup (front-end only; wire to a backend later) -----
  var form = document.getElementById('signup');
  var msg = document.getElementById('form-msg');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    msg.className = 'form-msg ' + (valid ? 'ok' : 'err');
    msg.textContent = valid ? "Thanks! We'll be in touch at " + email + '.' : 'Please enter a valid email address.';
    if (valid) form.reset();
  });

  // ----- Hero video play/pause -----
  var heroVideo = document.querySelector('.hero-video');
  var videoBtn = document.querySelector('.video-toggle');
  if (heroVideo && videoBtn) {
    if (reduceMotion) heroVideo.pause();
    var syncVideoBtn = function () {
      videoBtn.setAttribute('aria-pressed', String(heroVideo.paused));
      videoBtn.setAttribute('aria-label', heroVideo.paused ? 'Play video' : 'Pause video');
    };
    videoBtn.addEventListener('click', function () {
      if (heroVideo.paused) heroVideo.play(); else heroVideo.pause();
    });
    heroVideo.addEventListener('play', syncVideoBtn);
    heroVideo.addEventListener('pause', syncVideoBtn);
    syncVideoBtn();
  }
})();

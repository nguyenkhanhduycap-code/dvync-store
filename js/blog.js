/* The D'Vync Journal: builds the topic marquee, latest posts, editor's pick, filterable library,
   and most-read strip from DV_POSTS / DV_AUTHORS, and wires filters, newsletter and the
   floating button. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc;
  var reduce = DV.reduceMotion;
  var posts = window.DV_POSTS.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var authors = window.DV_AUTHORS || {};
  function url(p) { return 'post.html?slug=' + encodeURIComponent(p.slug); }
  function $(id) { return document.getElementById(id); }

  // Topics in the order they first appear (newest first)
  var topics = [];
  posts.forEach(function (p) { if (topics.indexOf(p.tag) < 0) topics.push(p.tag); });

  // ----- Hero stats -----
  var sp = document.querySelector('[data-stat="posts"]'), st = document.querySelector('[data-stat="topics"]');
  if (sp) sp.textContent = posts.length;
  if (st) st.textContent = topics.length;

  // ----- Hero backdrop: three slowly flowing bands drawn with WebGL -----
  // Top: red fluid with dark cores on white. Middle: soft grey smoke. Bottom: white contour lines
  // and dots on black, like a moving terrain scan. Falls back to the still image if WebGL is missing.
  (function heroFlow() {
    var hero = document.querySelector('.jr-hero');
    var canvas = hero && hero.querySelector('.jr-hero-canvas');
    if (!canvas || reduce) return;
    var gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    var vert = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
    var frag = [
      '#ifdef GL_FRAGMENT_PRECISION_HIGH',
      'precision highp float;',
      '#else',
      'precision mediump float;',
      '#endif',
      'uniform vec2 res; uniform float t;',
      // 2D simplex noise (after Ashima Arts / Stefan Gustavson, MIT): smooth, no grid-aligned creases
      'vec3 perm(vec3 x){ return mod(((x * 34.0) + 1.0) * x, 289.0); }',
      'float snoise(vec2 v){',
      '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
      '  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);',
      '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
      '  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);',
      '  vec3 p = perm(perm(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
      '  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0); m = m * m; m = m * m;',
      '  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;',
      '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
      '  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
      '  return 130.0 * dot(m, g); }',
      'float noise(vec2 p){ return 0.5 + 0.5 * snoise(p); }',
      'float fbm(vec2 p){ float v = 0.0, a = 0.55; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);',
      '  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.45; } return v; }',
      // domain-warped field: folds back on itself, which gives the liquid look
      'float warp(vec2 p, float s){ vec2 q = vec2(fbm(p + vec2(0.0, s)), fbm(p + vec2(5.2, 1.3 - s)));',
      '  vec2 r = vec2(fbm(p + 1.7 * q + vec2(1.7, 9.2) + 0.2 * s), fbm(p + 1.7 * q + vec2(8.3, 2.8) - 0.17 * s));',
      '  return fbm(p + 1.5 * r); }',
      // gradient noise clusters around 0.5; stretch it to use the full 0..1 range
      'float stretch(float v, float k){ return clamp((v - 0.5) * k + 0.5, 0.0, 1.0); }',
      'void main(){',
      '  vec2 frag = gl_FragCoord.xy;',
      '  vec2 uv = frag / res.y;',          // aspect-correct, height = 1
      '  float y = frag.y / res.y;',         // 0 bottom .. 1 top
      '  vec3 col;',
      '  if (y > 0.71) {',                   // top band: red fluid
      '    float v = stretch(warp(uv * 0.5 + vec2(t * 0.03, 0.0), t * 0.08), 1.7);',
      '    vec3 white = vec3(0.97, 0.95, 0.95), pink = vec3(0.95, 0.58, 0.6), red = vec3(0.87, 0.3, 0.36), plum = vec3(0.34, 0.18, 0.34);',
      '    col = mix(white, pink, smoothstep(0.3, 0.34, v));',
      '    col = mix(col, red, smoothstep(0.42, 0.6, v));',
      '    col = mix(col, plum, smoothstep(0.84, 0.95, v));',
      '    float edge = 1.0 - smoothstep(0.004, 0.02, abs(v - 0.315));',   // thin dark outline at the fluid edge
      '    col = mix(col, vec3(0.3, 0.1, 0.16), edge * 0.8);',
      '  } else if (y > 0.3) {',             // middle band: grey smoke
      '    float v = stretch(warp(uv * 0.42 + vec2(-t * 0.025, 3.0), t * 0.06 + 4.0), 1.3);',
      '    float g = smoothstep(0.15, 0.9, v);',
      '    col = vec3(mix(0.07, 0.72, g));',
      '  } else {',                          // bottom band: contour lines and dots on black
      // smoother terrain: one gentle warp of low-frequency noise, so contours run in long lines
      '    vec2 bp = uv * 0.55 + vec2(t * 0.02, 7.0);',
      '    float h = stretch(fbm(bp + 0.8 * vec2(fbm(bp + t * 0.03), fbm(bp + vec2(3.1, 1.7) - t * 0.03))), 1.4);',
      '    float c = fract(h * 18.0);',
      '    float line = 1.0 - smoothstep(0.03, 0.12, min(c, 1.0 - c));',
      '    vec2 cell = fract(frag / 3.0) - 0.5;',
      '    float dots = (1.0 - smoothstep(0.1, 0.22, length(cell))) * smoothstep(0.62, 0.85, h);',
      '    col = vec3(0.9) * (line * smoothstep(0.25, 0.7, h) + dots * 0.3);',
      '  }',
      '  gl_FragColor = vec4(col, 1.0);',
      '}'
    ].join('\n');

    function shader(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = shader(gl.VERTEX_SHADER, vert), fs = shader(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // one big triangle
    var loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var uRes = gl.getUniformLocation(prog, 'res'), uT = gl.getUniformLocation(prog, 't');

    // Draw at reduced resolution: the bands are soft, and it keeps the GPU cost low
    var SCALE = Math.min(0.8, 1100 / Math.max(1, hero.clientWidth));   // ~1100px wide at most
    function size() {
      var w = Math.max(1, Math.round(canvas.clientWidth * SCALE)), h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    }
    var visible = true, start = performance.now(), offset = Math.random() * 20;
    function draw(now) {
      if (visible && window.scrollY < window.innerHeight * 1.4) {   // sticky hero: pause once covered
        size();
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uT, offset + (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(draw);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
    }
    requestAnimationFrame(function (now) { draw(now); hero.classList.add('gl'); });
  })();

  // ----- Topic marquee: keywords that each open a topic -----
  var keywords = [
    ['Heart rate variability', 'Recovery'], ['Deep sleep', 'Sleep'], ['Zone 2', 'Training'], ['Breathwork', 'Stress'],
    ['Resting heart rate', 'Heart'], ['Protein', 'Nutrition'], ['Menstrual cycle', "Women's health"], ['VO₂ max', 'Longevity'],
    ['Sleep debt', 'Sleep'], ['Recovery score', 'Recovery'], ['Strength training', 'Training'], ['Cortisol', 'Stress'],
    ['Hydration', 'Nutrition'], ['Alcohol', 'Sleep'], ['Healthspan', 'Longevity'], ['Skin temperature', "Women's health"],
    ['Caffeine', 'Sleep'], ['Day strain', 'Training'], ['Naps', 'Sleep'], ['Blood pressure', 'Heart'], ['Pregnancy', "Women's health"]
  ];
  var rowsEl = $('jr-rows');
  if (rowsEl) {
    var html = '';
    for (var r = 0; r < 3; r++) {
      // each row gets its own slice of keywords, offset so the rows don't line up
      var row = keywords.slice(r * 7).concat(keywords.slice(0, r * 7));
      var pills = row.map(function (k) {
        return '<button type="button" class="jr-pill" data-filter="' + esc(k[1]) + '">' + esc(k[0]) + '</button>';
      }).join('');
      // the content is doubled so the loop can wrap seamlessly
      html += '<div class="jr-row' + (r % 2 ? ' rev' : '') + '" style="--dur:' + (46 + r * 8) + 's"><div class="jr-row-inner">' + pills + pills + '</div></div>';
    }
    rowsEl.innerHTML = html;
  }

  // ----- Latest: three newest, with key takeaways -----
  var latestEl = $('jr-latest');
  if (latestEl) {
    latestEl.innerHTML = posts.slice(0, 3).map(function (p, i) {
      return '<li class="lt" data-reveal="' + i * 80 + '"><a href="' + url(p) + '">' +
        '<div class="lt-img"><img src="' + esc(p.image) + '" alt="" loading="lazy"></div>' +
        '<span class="jr-tag">' + esc(p.tag) + '</span>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p>' + esc(p.excerpt) + '</p>' +
        '<ul class="jr-dots">' + (p.takeaways || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '</a></li>';
    }).join('');
  }

  // ----- Editor's pick -----
  var pickEl = $('jr-pick');
  var pick = posts.filter(function (p) { return p.featured; })[0] || posts[0];
  if (pickEl && pick) {
    var au = authors[pick.author];
    pickEl.innerHTML =
      '<div class="jr-split-copy">' +
        '<span class="jr-tag" data-reveal>Editor\'s pick</span>' +
        '<h2 class="jr-h2" data-reveal="60">' + esc(pick.title) + '</h2>' +
        '<p class="jr-lead" data-reveal="120">' + esc(pick.excerpt) + '</p>' +
        '<p class="jr-byline" data-reveal="160">' + (au ? 'By ' + esc(au.name) + ' &middot; ' : '') + esc(pick.read) + '</p>' +
        '<a href="' + url(pick) + '" class="btn btn-dark jr-btn" data-reveal="200">Read the article</a>' +
      '</div>' +
      '<div class="jr-split-img" data-reveal="100"><img src="' + esc(pick.image) + '" alt="" loading="lazy"></div>';
  }

  // ----- Library with topic filter -----
  var libEl = $('jr-lib'), filtersEl = $('jr-filters'), emptyEl = $('jr-empty');
  var current = 'All';
  if (filtersEl) {
    filtersEl.innerHTML = ['All'].concat(topics).map(function (t) {
      return '<button type="button" class="jr-chip' + (t === 'All' ? ' is-active' : '') + '" data-filter="' + esc(t) + '" aria-pressed="' + (t === 'All') + '">' + esc(t) + '</button>';
    }).join('');
  }
  function renderLib() {
    var list = posts.filter(function (p) { return current === 'All' || p.tag === current; });
    libEl.innerHTML = list.map(function (p) {
      return '<li class="lib-item"><a class="lib" href="' + url(p) + '">' +
        '<img src="' + esc(p.image) + '" alt="" loading="lazy">' +
        '<div class="lib-top"><p>' + esc(p.tag) + '</p><p>' + esc(p.read) + '</p></div>' +
        '<p class="lib-title">' + esc(p.title) + '</p>' +
        '</a></li>';
    }).join('') +
      (list.length ? '<li class="lib-item"><a class="lib lib-end" href="#newsletter"><p>Get new guides every Sunday</p><span aria-hidden="true">&rarr;</span></a></li>' : '');
    emptyEl.hidden = list.length > 0;
    filtersEl.querySelectorAll('.jr-chip').forEach(function (c) {
      var on = c.dataset.filter === current;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
    // replay a short fade on the cards
    if (!reduce) libEl.querySelectorAll('.lib-item').forEach(function (li, i) {
      li.style.animationDelay = (i * 50) + 'ms';
      li.classList.remove('pop'); void li.offsetWidth; li.classList.add('pop');
    });
  }
  if (libEl) renderLib();

  function scrollToEl(el, extra) {
    var y = el.getBoundingClientRect().top + window.scrollY - (extra || 0);
    if (DV.lenis) {
      DV.lenis.scrollTo(window.scrollY, { immediate: true });   // resync Lenis with the real position first
      DV.lenis.scrollTo(y, { duration: 1.3 });
    } else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }

  // Any [data-filter] (marquee pill, goal card, chip, empty-state link) picks a topic
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    var t = b.dataset.filter;
    current = topics.indexOf(t) > -1 ? t : 'All';
    renderLib();
    if (!b.classList.contains('jr-chip')) scrollToEl($('library'), document.querySelector('.site-header').offsetHeight + 20);
  }, true);

  // ----- Most read this week -----
  var popEl = $('jr-popular');
  if (popEl) {
    var picks = ['hrv-explained', 'alcohol-and-sleep', 'sleep-consistency'].map(function (s) {
      return posts.filter(function (p) { return p.slug === s; })[0];
    }).filter(Boolean);
    popEl.innerHTML = '<p class="jr-pop-label" data-reveal>Most read this week</p>' + picks.map(function (p, i) {
      return '<a class="jr-pop" href="' + url(p) + '" data-reveal="' + (i + 1) * 60 + '"><span class="n">0' + (i + 1) + '</span><span class="t">' + esc(p.title) + '</span><span class="m">' + esc(p.tag) + ' &middot; ' + esc(p.read) + '</span></a>';
    }).join('');
  }

  // ----- Newsletter -----
  var form = $('jr-form'), msg = $('jr-form-msg');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = $('jr-email').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      msg.textContent = 'Please enter a valid email address.';
      msg.className = 'jr-form-msg err';
      return;
    }
    msg.textContent = 'You\'re in. Your first Sunday Reset arrives this weekend.';
    msg.className = 'jr-form-msg ok';
    form.reset();
  });

  DV.refresh(document.querySelector('main'));

  // ----- Floating button: after the hero, hidden at the newsletter and the footer -----
  var fab = document.querySelector('.jr-float');
  var hero = document.querySelector('.jr-hero');
  var news = $('newsletter');
  var footer = document.querySelector('.site-footer');
  // ----- Hero: stays put while the page slides over it; the backdrop drifts up and darkens -----
  var heroLayerEls = hero.querySelectorAll('.jr-hero-bg, .jr-hero-canvas');
  var heroDim = hero.querySelector('.jr-hero-dim');
  var heroText = hero.querySelectorAll('.jr-hero-copy, .jr-hero-stats');
  function heroFx(y, vh) {
    if (reduce || y > vh * 1.4) return;
    if (y <= 0) {   // at the top: leave the entrance (reveal) animation in charge
      heroLayerEls.forEach(function (el) { el.style.transform = ''; });
      heroDim.style.opacity = 0;
      heroText.forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
      return;
    }
    var p = Math.min(1, y / vh);
    heroLayerEls.forEach(function (el) { el.style.transform = 'translate3d(0,' + (-y / 6).toFixed(1) + 'px,0)'; });
    heroDim.style.opacity = (p * 0.7).toFixed(3);
    heroText.forEach(function (el) {
      el.style.opacity = Math.max(0, 1 - p * 1.3).toFixed(3);
      el.style.transform = 'translate3d(0,' + (-y * 0.15).toFixed(1) + 'px,0)';
    });
  }

  var tick = false;
  function frame() {
    var vh = window.innerHeight;
    heroFx(window.scrollY, vh);
    var past = window.scrollY > vh * 0.7;   // the hero is sticky, so use scroll distance
    var nr = news.getBoundingClientRect();
    var atNews = nr.top < vh && nr.bottom > 0;
    var atFooter = footer && footer.getBoundingClientRect().top < vh - 40;
    fab.classList.toggle('show', past && !atNews && !atFooter);
    tick = false;
  }
  window.addEventListener('scroll', function () { if (!tick) { requestAnimationFrame(frame); tick = true; } }, { passive: true });
  frame();
})();

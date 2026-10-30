/* Accessories landing page: New arrivals and Best sellers product rows, Shop by band
   tiles, and the arrow buttons that scroll each row. Data comes from data.js. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc, money = window.Cart.money;
  var bands = window.DV_PRODUCTS.filter(function (p) { return p.category === 'bands'; });

  // Product card: studio render on a light grey tile, flat lay on hover, name/price/colour below
  function card(p) {
    var alt = p.studio > 1 ? '<img class="alt" src="' + esc(p.images[1]) + '" alt="" loading="lazy">' : '';
    var badge = p.stock <= 0 ? '<span class="badge-tag out">Sold out</span>'
      : p.badge ? '<span class="badge-tag dark">' + esc(p.badge) + '</span>'
      : p.stock <= 10 ? '<span class="badge-tag warn">Only ' + p.stock + ' left</span>' : '';
    return '<a class="scard" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="scard-media">' + badge +
        '<img class="main" src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" loading="lazy">' + alt +
      '</div>' +
      '<div class="scard-info">' +
        '<div><strong>' + esc(window.DV_family(p.family).name) + '</strong><span>' + esc(p.color) + '</span></div>' +
        '<span class="scard-price">' + money(p.price).replace('.00', '') + '</span>' +
      '</div></a>';
  }

  // Shop-by-band tile: lifestyle photo with the group name over it (bottom left) and a
  // NEW badge when the group has a new arrival
  function groupTile(g) {
    var items = bands.filter(function (b) { return g.families.indexOf(b.family) > -1; });
    if (!items.length) return '';
    var hasNew = items.some(function (b) { return b.isNew; });
    return '<a class="ftile" href="shop.html?cat=bands&amp;family=' + encodeURIComponent(g.id) + '" aria-label="Shop ' + esc(g.label) + ' bands">' +
      '<div class="ftile-media">' + (hasNew ? '<span class="badge-tag dark">New</span>' : '') +
        '<img src="' + esc(g.image) + '" alt="" loading="lazy">' +
        '<span class="ftile-label">' + esc(g.label) + '</span></div></a>';
  }

  // Cards rise in one after another as each row scrolls into view (like the other pages)
  function stagger(html, i) { return html.replace(/^<a /, '<a data-reveal="' + Math.min(i, 5) * 70 + '" '); }
  document.getElementById('row-new').innerHTML = bands.filter(function (p) { return p.isNew; }).map(card).map(stagger).join('');
  document.getElementById('row-best').innerHTML = bands.filter(function (p) { return p.bestSeller; }).map(card).map(stagger).join('');
  document.getElementById('row-band').innerHTML = window.DV_BAND_GROUPS.map(groupTile).filter(Boolean).map(stagger).join('');

  // ----- Row arrows: scroll one card at a time; hide the arrow at each end -----
  document.querySelectorAll('.row-nav').forEach(function (nav) {
    var track = document.getElementById(nav.dataset.for);
    var prev = nav.querySelector('.prev'), next = nav.querySelector('.next');
    function step() {
      var first = track.firstElementChild;
      return first ? first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : 300;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
      nav.hidden = max <= 2;            // everything fits: no arrows needed
    }
    prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: DV.reduceMotion ? 'auto' : 'smooth' }); });
    next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: DV.reduceMotion ? 'auto' : 'smooth' }); });
    track.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  DV.refresh(document.querySelector('main'));

  // The page-wide reveal only watches vertical scrolling, so cards that start outside a row
  // (to the right) would stay hidden after the arrows scroll them in. Reveal whole rows instead:
  // once a row is on screen every card in it is shown (the stagger delays still apply).
  if ('IntersectionObserver' in window) {
    var rowIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Array.prototype.forEach.call(en.target.children, function (c) { c.classList.add('in'); });
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.row-track').forEach(function (t) {
      rowIO.observe(t);
      // and whenever the row is scrolled sideways
      t.addEventListener('scroll', function () {
        Array.prototype.forEach.call(t.children, function (c) { c.classList.add('in'); });
      }, { passive: true });
    });
  }
})();

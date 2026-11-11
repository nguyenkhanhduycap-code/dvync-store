/* Shop page: sections (All / Memberships / Accessories, like Whoop), band-family
   filter (Knit, Sport, …) under Accessories, sort, product grid with quick add. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc;
  var grid = document.getElementById('product-grid');
  var chips = document.getElementById('cat-chips');
  var subChips = document.getElementById('sub-chips');
  var sortSel = document.getElementById('sort');
  var countEl = document.getElementById('result-count');

  var SECTIONS = {
    all: {
      eyebrow: 'Shop', title: 'Everything you need to <br>know your body.',
      text: 'Start with the device. Then make it yours with straps and accessories.',
      doc: 'Shop'
    },
    memberships: {
      eyebrow: 'Device & Premium', title: 'The device, and <br>the Premium subscription.',
      text: 'One device, one subscription. See what Free and Premium each include.',
      doc: 'Device & Premium'
    },
    accessories: {
      eyebrow: 'Accessories', title: 'Make it yours.',
      text: 'Knit, reflective, sport, trail, mesh and leather bands. Every band fits every D\'Vync sensor and swaps in seconds.',
      doc: 'Accessories'
    }
  };

  var requestedCat = DV.param('cat');
  var requestedFamily = DV.param('family');
  var state = {
    cat: window.DV_category(requestedCat) ? requestedCat : 'all',
    // ?family= takes a band group (knit, mesh, …); a family id inside a group maps to that group
    family: window.DV_bandGroup(requestedFamily) ? window.DV_bandGroup(requestedFamily).id : '',
    sort: DV.param('sort') || 'featured'
  };
  if (state.family && state.cat === 'all') state.cat = 'bands';
  sortSel.value = state.sort;

  // Which top-level section a category belongs to (bands live under Accessories)
  function sectionOf(cat) {
    var c = window.DV_category(cat);
    return c && c.parent ? c.parent : cat;
  }
  function inView(p) {
    return !p.hideFromListings && window.DV_inCategory(p, state.cat) &&
      (!state.family || window.DV_bandGroup(state.family).families.indexOf(p.family) > -1);
  }
  function countIn(cat) {
    return window.DV_PRODUCTS.filter(function (p) { return !p.hideFromListings && window.DV_inCategory(p, cat); }).length;
  }
  function chip(attrs, label, count, pressed) {
    return '<button class="chip" ' + attrs + ' aria-pressed="' + pressed + '">' + esc(label) + '<small>' + count + '</small></button>';
  }

  function renderChips() {
    var section = sectionOf(state.cat);
    chips.innerHTML = ['all', 'memberships', 'accessories'].map(function (id) {
      return chip('data-cat="' + id + '"', window.DV_category(id).label, countIn(id), id === section);
    }).join('');
    // Under Accessories, a second row filters by band group (Knit, Mesh, Trail, Leather, Sport)
    var showSub = section === 'accessories';
    subChips.hidden = !showSub;
    if (showSub) {
      subChips.innerHTML = chip('data-family=""', 'All bands', countIn('bands'), !state.family) +
        window.DV_BAND_GROUPS.map(function (g) {
          var n = window.DV_PRODUCTS.filter(function (p) { return g.families.indexOf(p.family) > -1; }).length;
          return n ? chip('data-family="' + g.id + '"', g.label, n, state.family === g.id) : '';
        }).join('');
    }
  }

  function renderHeading() {
    var section = sectionOf(state.cat);
    var s = SECTIONS[section] || SECTIONS.all;
    var g = state.family && window.DV_bandGroup(state.family);
    document.getElementById('sec-eyebrow').textContent = g ? 'Accessories' : s.eyebrow;
    document.getElementById('sec-title').innerHTML = g ? esc(g.label) + ' bands' : s.title;
    document.getElementById('sec-text').textContent = g ? g.description : s.text;
    document.title = (g ? g.label + ' bands' : s.doc) + ' | D\'Vync';
  }

  function badgeFor(p) {
    if (p.stock <= 0) return '<span class="badge-tag out">Sold out</span>';
    if (p.badge === 'Most popular' || p.badge === 'New') return '<span class="badge-tag hot">' + esc(p.badge) + '</span>';
    if (p.badge) return '<span class="badge-tag dark">' + esc(p.badge) + '</span>';
    if (p.stock <= 10) return '<span class="badge-tag warn">Only ' + p.stock + ' left</span>';
    return '';
  }

  function card(p, i) {
    var url = p.page || 'product.html?id=' + encodeURIComponent(p.id);
    // memberships: white tile; bands with studio shots: light grey tile, flat lay on hover
    var media = p.category === 'memberships' ? ' contain' : p.studio ? ' studio' : '';
    var alt = p.studio > 1 ? '<img class="alt" src="' + esc(p.images[1]) + '" alt="" loading="lazy">' : '';
    var quick;
    if (p.stock <= 0) quick = '<span class="btn btn-dark is-disabled">Sold out</span>';
    else if (p.option) quick = '<a class="btn btn-dark" href="' + url + '">Choose ' + esc(p.option.label.toLowerCase()) + '</a>';
    else quick = '<button class="btn btn-dark" data-add="' + esc(p.id) + '">Add to cart</button>';
    var catLabel = p.family ? window.DV_family(p.family).label : window.DV_category(p.category).label;
    return '<article class="pcard" data-reveal="' + (i % 3) * 80 + '">' +
      '<div class="pcard-media' + media + '">' + badgeFor(p) +
        '<img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" loading="lazy">' + alt +
        '<div class="pcard-quick">' + quick + '</div>' +
      '</div>' +
      '<div class="pcard-body">' +
        '<span class="pcard-cat">' + esc(catLabel) + '</span>' +
        '<h3><a href="' + url + '">' + esc(p.name) + '</a></h3>' +
        '<p class="pcard-short">' + esc(p.short) + '</p>' +
        '<div class="pcard-meta">' +
          '<span class="price">' + window.Cart.money(p.price) + (p.billing ? '<small> /' + p.billing + '</small>' : '') + '</span>' +
          '<span class="rating-line">' + DV.stars(p.rating) + ' ' + p.rating + '</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function sorted(list) {
    var l = list.slice();
    if (state.sort === 'price-asc') l.sort(function (a, b) { return a.price - b.price; });
    if (state.sort === 'price-desc') l.sort(function (a, b) { return b.price - a.price; });
    if (state.sort === 'rating') l.sort(function (a, b) { return b.rating - a.rating; });
    return l;
  }

  function render() {
    var list = sorted(window.DV_PRODUCTS.filter(inView));
    grid.innerHTML = list.length ? list.map(card).join('') : '<p class="empty-state">No products here yet.</p>';
    countEl.textContent = list.length + (list.length === 1 ? ' product' : ' products');
    renderChips();
    renderHeading();
    DV.refresh(grid);
  }

  function syncUrl() {
    var q = new URLSearchParams();
    if (state.cat !== 'all') q.set('cat', state.cat);
    if (state.family) q.set('family', state.family);
    if (state.sort !== 'featured') q.set('sort', state.sort);
    history.replaceState(null, '', 'shop.html' + (q.toString() ? '?' + q : ''));
  }

  chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (!b || (b.dataset.cat === state.cat && !state.family)) return;
    state.cat = b.dataset.cat;
    state.family = '';
    syncUrl();
    render();
  });
  subChips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-family]');
    if (!b || b.dataset.family === state.family) return;
    state.family = b.dataset.family;
    state.cat = 'bands';
    syncUrl();
    render();
  });
  sortSel.addEventListener('change', function () {
    state.sort = sortSel.value;
    syncUrl();
    render();
  });
  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var p = window.DV_findProduct(b.dataset.add);
    if (window.Cart.add(p.id, 1)) DV.addedToast(p, 1);
  });

  render();
})();

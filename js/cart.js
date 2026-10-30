/* Cart stored in this browser (localStorage), shared by every page.
   Window.Cart is the only API pages use; it fires a "cart:change" event on updates. */
(function () {
  'use strict';

  var KEY = 'dvync-cart';
  var PROMO_KEY = 'dvync-promo';
  var store = window.DV_STORE;

  function read(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode: cart lasts for this page only */ }
  }

  function lineKey(id, option) { return id + '|' + (option || ''); }

  // Bring a saved cart in line with the current catalogue: drop products that no longer exist,
  // drop options a product no longer has (e.g. bands became one size), and merge lines that
  // end up with the same key.
  function normalize(lines) {
    var out = [], byKey = {};
    (Array.isArray(lines) ? lines : []).forEach(function (l) {
      var p = l && window.DV_findProduct(l.id);
      if (!p) return;
      var opt = l.option || '';
      if (!p.option || (opt && p.option.values && p.option.values.indexOf(opt) < 0)) opt = '';
      var key = lineKey(l.id, opt);
      var qty = Math.max(1, parseInt(l.qty, 10) || 1);
      if (byKey[key]) byKey[key].qty = Math.min(byKey[key].qty + qty, p.stock || Infinity);
      else { byKey[key] = { key: key, id: l.id, option: opt, qty: Math.min(qty, p.stock || qty) }; out.push(byKey[key]); }
    });
    return out;
  }

  var stored = read(KEY, []);
  var memory = normalize(stored);
  if (JSON.stringify(memory) !== JSON.stringify(stored)) write(KEY, memory);

  function save() {
    write(KEY, memory);
    document.dispatchEvent(new CustomEvent('cart:change'));
  }

  var Cart = {
    // Lines with their product attached; lines whose product no longer exists are dropped
    items: function () {
      return memory.map(function (l) {
        var p = window.DV_findProduct(l.id);
        return p ? { key: l.key, id: l.id, option: l.option, qty: l.qty, product: p, total: p.price * l.qty } : null;
      }).filter(Boolean);
    },
    add: function (id, qty, option) {
      var p = window.DV_findProduct(id);
      if (!p || p.stock <= 0) return false;
      var key = lineKey(id, option);
      var line = memory.filter(function (l) { return l.key === key; })[0];
      var next = (line ? line.qty : 0) + (qty || 1);
      next = Math.min(next, p.stock);
      if (line) line.qty = next;
      else memory.push({ key: key, id: id, option: option || '', qty: next });
      save();
      return true;
    },
    setQty: function (key, qty) {
      var line = memory.filter(function (l) { return l.key === key; })[0];
      if (!line) return;
      var p = window.DV_findProduct(line.id);
      line.qty = Math.max(1, Math.min(qty, p ? p.stock : qty));
      save();
    },
    remove: function (key) {
      memory = memory.filter(function (l) { return l.key !== key; });
      save();
    },
    clear: function () { memory = []; write(PROMO_KEY, ''); save(); },
    count: function () { return memory.reduce(function (n, l) { return n + l.qty; }, 0); },

    promo: function () { return read(PROMO_KEY, ''); },
    applyPromo: function (code) {
      code = String(code || '').trim().toUpperCase();
      if (!code) { write(PROMO_KEY, ''); save(); return true; }
      if (!store.promos[code]) return false;
      write(PROMO_KEY, code); save(); return true;
    },

    // All money maths in one place
    totals: function (shippingId) {
      var items = this.items();
      var subtotal = items.reduce(function (s, i) { return s + i.total; }, 0);
      var code = this.promo();
      var discount = code ? round(subtotal * store.promos[code]) : 0;
      var afterDiscount = subtotal - discount;
      var method = store.shipping.filter(function (m) { return m.id === (shippingId || 'standard'); })[0] || store.shipping[0];
      var shipping = 0;
      if (items.length) {
        shipping = method.price;
        if (method.id === 'standard' && afterDiscount >= store.freeShippingMin) shipping = 0;
      }
      var tax = round(afterDiscount * store.taxRate);
      return {
        subtotal: subtotal, discount: discount, promo: code, shipping: shipping, shippingMethod: method,
        tax: tax, total: round(afterDiscount + shipping + tax),
        toFreeShipping: Math.max(0, store.freeShippingMin - afterDiscount)
      };
    }
  };

  function round(n) { return Math.round(n * 100) / 100; }

  Cart.money = function (n) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Keep every cart badge on the page in sync
  function paintBadges() {
    var n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }
  document.addEventListener('cart:change', paintBadges);
  document.addEventListener('DOMContentLoaded', paintBadges);
  // Another tab changed the cart
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) { memory = normalize(read(KEY, [])); document.dispatchEvent(new CustomEvent('cart:change')); }
  });

  window.Cart = Cart;
})();

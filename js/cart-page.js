/* Cart page: line items, quantity, remove, free-shipping bar, promo code, totals. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc, Cart = window.Cart, money = Cart.money;
  var root = document.getElementById('cart-root');

  function lineHtml(i) {
    var p = i.product;
    return '<div class="line" data-key="' + esc(i.key) + '">' +
      '<a class="line-img" href="product.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '"></a>' +
      '<div>' +
        '<h3><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a></h3>' +
        '<div class="meta">' + (i.option && p.option ? esc(p.option.label) + ': ' + esc(i.option) + ' · ' : '') +
          money(p.price) + (p.billing ? ' / ' + p.billing : '') + (p.stock <= 10 ? ' · Only ' + p.stock + ' left' : '') + '</div>' +
        '<div class="line-actions">' +
          '<div class="qty"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button>' +
            '<input type="number" min="1" max="' + p.stock + '" value="' + i.qty + '" aria-label="Quantity for ' + esc(p.name) + '">' +
            '<button type="button" data-step="1" aria-label="Increase quantity"' + (i.qty >= p.stock ? ' disabled' : '') + '>+</button></div>' +
          '<button class="remove" type="button">Remove</button>' +
        '</div>' +
      '</div>' +
      '<div class="line-total">' + money(i.total) + '</div>' +
    '</div>';
  }

  function render() {
    var items = Cart.items();
    if (!items.length) {
      root.innerHTML = '<div class="cart-empty" data-reveal><h2>Your cart is empty.</h2>' +
        '<p>Start with a membership. The band is included.</p>' +
        '<a class="btn btn-primary" href="shop.html?cat=memberships">Shop memberships</a> ' +
        '<a class="btn btn-ghost" href="shop.html">Browse all</a></div>';
      DV.refresh(root);
      return;
    }
    var t = Cart.totals('standard');
    var pct = Math.min(100, Math.round(((t.subtotal - t.discount) / window.DV_STORE.freeShippingMin) * 100));
    root.innerHTML =
      '<div class="cart-layout">' +
        '<section aria-label="Items in your cart">' +
          '<div class="free-ship">' + (t.toFreeShipping > 0
            ? 'You\'re <strong>' + money(t.toFreeShipping) + '</strong> away from free standard shipping.'
            : '<strong>You\'ve unlocked free standard shipping.</strong>') +
            '<i style="--w:' + pct + '%"></i></div>' +
          items.map(lineHtml).join('') +
          '<p style="margin-top:24px"><a class="link" href="shop.html">← Continue shopping</a></p>' +
        '</section>' +
        '<aside class="summary" aria-label="Order summary">' +
          '<h2>Order summary</h2>' +
          '<div class="sum-row"><span>Subtotal (' + Cart.count() + ' items)</span><span>' + money(t.subtotal) + '</span></div>' +
          (t.discount ? '<div class="sum-row discount"><span>Promo ' + esc(t.promo) + '</span><span>−' + money(t.discount) + '</span></div>' : '') +
          '<div class="sum-row"><span>Shipping (standard)</span><span>' + (t.shipping ? money(t.shipping) : 'Free') + '</span></div>' +
          '<div class="sum-row"><span>Estimated tax</span><span>' + money(t.tax) + '</span></div>' +
          '<div class="sum-row total"><span>Total</span><span>' + money(t.total) + '</span></div>' +
          '<form class="promo-form" id="promo-form"><label class="sr-only" for="promo">Promo code</label>' +
            '<input id="promo" placeholder="Promo code" value="' + esc(t.promo) + '" autocomplete="off">' +
            '<button class="btn btn-ghost" type="submit">' + (t.promo ? 'Update' : 'Apply') + '</button></form>' +
          '<div class="promo-msg" id="promo-msg" aria-live="polite">' + (t.promo ? '' : 'Try <strong>DVYNC10</strong> for 10% off.') + '</div>' +
          '<a class="btn btn-primary btn-block" href="checkout.html">Checkout</a>' +
          '<div class="secure"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Secure checkout · 30-day returns</div>' +
        '</aside>' +
      '</div>';
    // First paint only: lines and summary rise in one after another (quantity changes redraw quietly)
    if (!render.entered && !DV.reduceMotion) {
      root.querySelectorAll('.free-ship, .line, .summary').forEach(function (el, i) {
        el.classList.add('enter-rise');
        el.style.animationDelay = Math.min(i, 6) * 70 + 'ms';
      });
    }
    render.entered = true;
  }

  root.addEventListener('click', function (e) {
    var line = e.target.closest('.line');
    if (!line) return;
    var key = line.dataset.key;
    var input = line.querySelector('input');
    var step = e.target.closest('[data-step]');
    if (step) { Cart.setQty(key, (parseInt(input.value, 10) || 1) + (+step.dataset.step)); return; }
    if (e.target.closest('.remove')) {
      line.classList.add('leaving');
      setTimeout(function () { Cart.remove(key); }, 300);
    }
  });
  root.addEventListener('change', function (e) {
    var line = e.target.closest('.line');
    if (line && e.target.matches('input')) Cart.setQty(line.dataset.key, parseInt(e.target.value, 10) || 1);
  });
  root.addEventListener('submit', function (e) {
    if (e.target.id !== 'promo-form') return;
    e.preventDefault();
    var code = document.getElementById('promo').value;
    var ok = Cart.applyPromo(code);
    if (!ok) {
      var msg = document.getElementById('promo-msg');
      msg.className = 'promo-msg err';
      msg.textContent = 'That code isn\'t valid.';
    }
  });

  document.addEventListener('cart:change', function () {
    render();
    var code = Cart.promo();
    if (code) {
      var msg = document.getElementById('promo-msg');
      if (msg) { msg.className = 'promo-msg ok'; msg.textContent = code + ' applied — ' + Math.round(window.DV_STORE.promos[code] * 100) + '% off.'; }
    }
  });
  render();
})();

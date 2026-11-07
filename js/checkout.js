/* Simulated checkout: validates the form, "places" the order in this browser,
   empties the cart and goes to the thank-you page. Nothing is sent anywhere. */
(function () {
  'use strict';

  var DV = window.DV, esc = DV.esc, Cart = window.Cart, money = Cart.money;
  var form = document.getElementById('checkout-form');

  if (!Cart.items().length) {
    document.getElementById('checkout-root').innerHTML =
      '<div class="cart-empty"><h2>Your cart is empty.</h2><p>Add something before checking out.</p>' +
      '<a class="btn btn-primary" href="shop.html">Go to shop</a></div>';
    return;
  }

  var shipWrap = document.getElementById('ship-options');
  var shippingId = 'standard';

  function renderShipping() {
    var t = Cart.totals('standard');
    shipWrap.innerHTML = window.DV_STORE.shipping.map(function (m) {
      var free = m.id === 'standard' && t.toFreeShipping === 0;
      return '<label class="ship-opt"><input type="radio" name="ship" value="' + m.id + '"' + (m.id === shippingId ? ' checked' : '') + '>' +
        '<span>' + esc(m.label) + '<small>' + esc(m.detail) + '</small></span><strong>' + (free ? 'Free' : money(m.price)) + '</strong></label>';
    }).join('');
  }

  function renderSummary() {
    var items = Cart.items();
    var t = Cart.totals(shippingId);
    document.getElementById('co-lines').innerHTML = items.map(function (i) {
      return '<div class="mini-line"><div class="mini-img"><img src="' + esc(i.product.images[0]) + '" alt=""><b>' + i.qty + '</b></div>' +
        '<div><div>' + esc(i.product.name) + '</div><div class="meta">' + (i.option && i.product.option ? esc(i.product.option.label) + ': ' + esc(i.option) : (i.product.billing ? 'Billed yearly' : '')) + '</div></div>' +
        '<div>' + money(i.total) + '</div></div>';
    }).join('');
    document.getElementById('co-totals').innerHTML =
      '<div class="sum-row" style="margin-top:12px"><span>Subtotal</span><span>' + money(t.subtotal) + '</span></div>' +
      (t.discount ? '<div class="sum-row discount"><span>Promo ' + esc(t.promo) + '</span><span>−' + money(t.discount) + '</span></div>' : '') +
      '<div class="sum-row"><span>Shipping (' + esc(t.shippingMethod.label.toLowerCase()) + ')</span><span>' + (t.shipping ? money(t.shipping) : 'Free') + '</span></div>' +
      '<div class="sum-row"><span>VAT</span><span>Included</span></div>' +
      '<div class="sum-row total"><span>Total</span><span>' + money(t.total) + '</span></div>';
    return t;
  }

  shipWrap.addEventListener('change', function (e) {
    if (e.target.name === 'ship') { shippingId = e.target.value; renderSummary(); }
  });

  // ----- Input formatting -----
  var card = document.getElementById('card');
  var exp = document.getElementById('exp');
  var cvc = document.getElementById('cvc');
  card.addEventListener('input', function () {
    var d = card.value.replace(/\D/g, '').slice(0, 19);
    card.value = d.replace(/(.{4})/g, '$1 ').trim();
  });
  exp.addEventListener('input', function () {
    var d = exp.value.replace(/\D/g, '').slice(0, 4);
    exp.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  });
  cvc.addEventListener('input', function () { cvc.value = cvc.value.replace(/\D/g, '').slice(0, 4); });

  // ----- Validation -----
  function luhn(num) {
    var sum = 0, dbl = false;
    for (var i = num.length - 1; i >= 0; i--) {
      var n = +num[i];
      if (dbl) { n *= 2; if (n > 9) n -= 9; }
      sum += n; dbl = !dbl;
    }
    return num.length >= 13 && sum % 10 === 0;
  }
  var rules = {
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 8 || 'Enter a phone number with at least 8 digits.'; },
    first: function (v) { return !!v || 'Enter your first name.'; },
    last: function (v) { return !!v || 'Enter your last name.'; },
    address: function (v) { return v.length >= 5 || 'Enter your street address.'; },
    city: function (v) { return !!v || 'Enter your city.'; },
    region: function (v) { return !!v || 'Required.'; },
    zip: function (v) { return /^[A-Za-z0-9 -]{3,10}$/.test(v) || 'Enter a valid postal code.'; },
    country: function (v) { return !!v || 'Choose a country.'; },
    cardName: function (v) { return !!v || 'Enter the name on the card.'; },
    card: function (v) { return luhn(v.replace(/\D/g, '')) || 'That card number isn\'t valid. Try 4242 4242 4242 4242.'; },
    exp: function (v) {
      var m = /^(\d{2})\/(\d{2})$/.exec(v);
      if (!m || +m[1] < 1 || +m[1] > 12) return 'Use MM/YY.';
      var end = new Date(2000 + +m[2], +m[1], 0, 23, 59);
      return end >= new Date() || 'This card has expired.';
    },
    cvc: function (v) { return /^\d{3,4}$/.test(v) || 'Enter 3 or 4 digits.'; }
  };
  function check(input) {
    var rule = rules[input.name];
    if (!rule) return true;
    var res = rule(input.value.trim());
    var field = input.closest('.field');
    var ok = res === true;
    field.classList.toggle('invalid', !ok);
    field.querySelector('.err').textContent = ok ? '' : res;
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  form.addEventListener('blur', function (e) { if (e.target.name && e.target.value) check(e.target); }, true);
  form.addEventListener('input', function (e) {
    if (e.target.closest('.field.invalid')) check(e.target);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name && rules[el.name] && !check(el) && !firstBad) firstBad = el;
    });
    if (firstBad) {
      if (DV.lenis) DV.lenis.scrollTo(firstBad, { offset: -140 }); else firstBad.scrollIntoView({ block: 'center' });
      firstBad.focus({ preventScroll: true });
      return;
    }

    var btn = document.getElementById('place-btn');
    btn.classList.add('loading');
    var t = Cart.totals(shippingId);
    var v = function (n) { return form.elements[n].value.trim(); };
    var order = {
      number: 'DV-' + Date.now().toString(36).toUpperCase().slice(-6),
      date: new Date().toISOString(),
      email: v('email'),
      name: v('first') + ' ' + v('last'),
      address: [v('address'), v('address2'), v('city') + ', ' + v('region') + ' ' + v('zip'), v('country')].filter(Boolean),
      shipping: t.shippingMethod,
      card: '•••• ' + v('card').replace(/\D/g, '').slice(-4),
      items: Cart.items().map(function (i) {
        return { name: i.product.name, option: i.option, qty: i.qty, total: i.total, image: i.product.images[0] };
      }),
      totals: t
    };
    // Pretend to talk to a payment provider
    setTimeout(function () {
      try { localStorage.setItem('dvync-last-order', JSON.stringify(order)); } catch (err) { /* thank-you page will show a generic message */ }
      Cart.clear();
      location.href = 'thank-you.html';
    }, 1200);
  });

  renderShipping();
  renderSummary();
  document.addEventListener('cart:change', function () { renderShipping(); renderSummary(); });
})();

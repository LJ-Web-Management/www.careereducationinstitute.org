// Partner course checkout: Stripe card payment + provider LMS order (course id).
// Flow mirrors datacentertraining.us: createPaymentMethod -> add_new_user -> add_order -> confirmCardPayment.
(function () {
  var form = document.getElementById('checkoutForm');
  var dataEl = document.getElementById('checkout-data');
  if (!form || !dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var $ = function (s) { return document.querySelector(s); };
  var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var errBox = $('#checkoutError'), payBtn = $('#payBtn');
  var fmt = function (n) { return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };

  var params = new URLSearchParams(location.search);
  var slug = params.get('course');
  var course = D.courses[slug];
  if (!course) {
    form.hidden = true;
    var p = document.createElement('div');
    p.className = 'callout';
    p.innerHTML = 'Please choose a course first. <a href="' + (window.MP ? window.MP.base : '') + '/courses/">Browse courses</a>.';
    form.parentNode.insertBefore(p, form);
    return;
  }
  var seatsEl = $('#seats');
  if (parseInt(params.get('seats'), 10) > 0) seatsEl.value = params.get('seats');
  var seats = function () { var n = parseInt(seatsEl.value, 10); return n > 0 ? Math.min(n, 1000) : 1; };
  var tierFor = function (n) { for (var i = D.tiers.length - 1; i >= 0; i--) if (n >= D.tiers[i].min) return D.tiers[i]; return D.tiers[0]; };
  var totals = function () {
    var n = seats(), t = tierFor(n);
    var sub = Math.round(course.p * n * 100) / 100;
    var unit = Math.round(course.p * (1 - t.discount) * 100) / 100;
    var total = Math.round(unit * n * 100) / 100;
    return { n: n, t: t, sub: sub, total: total, disc: Math.round((sub - total) * 100) / 100 };
  };
  var set = function (sel, t) { var el = $('[' + sel + ']'); if (el) el.textContent = t; };
  var render = function () {
    var r = totals();
    set('data-sum-name', course.t);
    set('data-sum-meta', course.h + ' · online, self-paced');
    set('data-sum-qty', r.n + (r.n === 1 ? ' learner' : ' learners') + ' × ' + fmt(course.p));
    set('data-sum-sub', fmt(r.sub));
    set('data-sum-discount-label', 'Volume discount (' + Math.round(r.t.discount * 100) + '%)');
    set('data-sum-discount', '-' + fmt(r.disc));
    var row = $('[data-sum-discount-row]'); if (row) row.hidden = !(r.disc > 0);
    set('data-sum-total', fmt(r.total));
    var link = $('[data-sum-link]'); if (link) link.href = course.u;
    payBtn.textContent = 'Pay ' + fmt(r.total);
    return r;
  };
  seatsEl.addEventListener('input', render);
  render();

  // Stripe card element
  var stripe = null, card = null;
  var s = document.createElement('script');
  s.src = 'https://js.stripe.com/v3/';
  s.onload = function () {
    stripe = window.Stripe(D.key);
    card = stripe.elements().create('card', { hidePostalCode: true, style: { base: { fontSize: '16px', color: '#1d2433', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', '::placeholder': { color: '#8a93a6' } }, invalid: { color: '#b42318' } } });
    var holder = $('#card-element'); holder.textContent = '';
    card.mount('#card-element');
  };
  s.onerror = function () { $('#card-element').textContent = 'The secure card form could not load. Please refresh, or call ' + D.phone + ' to order by phone.'; };
  document.head.appendChild(s);

  var fail = function (msg) {
    errBox.textContent = msg || 'Payment could not be completed. Please check your details and try again.';
    errBox.hidden = false;
    payBtn.disabled = false;
    render();
    errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  var msgOf = function (e) {
    if (!e) return '';
    if (typeof e === 'string') return e;
    if (typeof e.message === 'string') return e.message;
    if (typeof e.error === 'string') return e.error;
    if (e.error && typeof e.error.message === 'string') return e.error.message;
    return '';
  };

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errBox.hidden = true;
    var bad = [].filter.call(form.querySelectorAll('[required]'), function (el) {
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
      if (ok && el.id === 'zip') ok = /^\d{5}(-\d{4})?$/.test(el.value.trim());
      if (ok && el.type === 'tel') ok = el.value.replace(/\D/g, '').length >= 10;
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      return !ok;
    });
    if (bad.length) { bad[0].focus(); return fail('Please complete the highlighted fields (check your email, phone and 5-digit ZIP code).'); }
    if (!stripe || !card) return fail('The secure card form is still loading. Please wait a moment and try again.');

    payBtn.disabled = true;
    payBtn.textContent = 'Processing…';
    var r = totals();
    var first = val('firstName'), last = val('lastName'), email = val('email'), phone = val('phone'), company = val('company');
    var addr = { line1: val('address1'), line2: val('address2'), city: val('city'), state: val('state'), postal_code: val('zip'), country: 'US' };

    // 1) Card -> payment method
    var pm = await stripe.createPaymentMethod({ type: 'card', card: card, billing_details: { name: first + ' ' + last, email: email, phone: phone, address: addr } });
    if (pm.error) return fail(msgOf(pm.error));

    // 2) Learner account in the provider LMS
    var customerId = 0;
    try {
      var u = await fetch(D.api + '/add_new_user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ first_name: first, last_name: last, email: email, user_name: first + ' ' + last, user_role_id: 2, phone: phone }) });
      if (u.ok) {
        var ud = await u.json();
        customerId = ud.user_id || (ud.data && ud.data.user_id) || (ud.success && ud.success.user_id) || (ud.user && ud.user.user_id) || (ud.is_duplicate && Number(ud.existing_email)) || 0;
      }
    } catch (x) { /* order can still be placed without a customer id */ }

    // 3) Order with the LMS course id
    var orderRef = '';
    try {
      var order = {
        customer_id: customerId, payment_method: 'stripe', payment_method_id: pm.paymentMethod.id,
        order_type: 'normal', order_status: 'pending', order_from: D.from,
        billing_first_name: first, billing_last_name: last, billing_name: first + ' ' + last, billing_email: email, billing_phone: phone,
        billing_company: company, reg_company: company,
        billing_address_1: addr.line1, billing_address_2: addr.line2, billing_city: addr.city, billing_state: addr.state, billing_postcode: addr.postal_code, billing_country: 'US',
        shipping_address_1: addr.line1, shipping_address_2: addr.line2, shipping_city: addr.city, shipping_state: addr.state, shipping_postcode: addr.postal_code, shipping_country: 'US',
        courses: [{ course_id: course.id, quantity: r.n, users: [{ first_name: first, last_name: last, email: email, user_name: '' }] }]
      };
      var res = await fetch(D.api + '/add_order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
      var od = await res.json().catch(function () { return {}; });
      if (!res.ok || od.success === false || od.error) return fail(msgOf(od.error || od) || 'Your order could not be placed. Please try again or call ' + D.phone + ' and we will help you finish enrolling.');
      if (od.order_id || od.id) orderRef = '#' + (od.order_id || od.id);
      if (od.clientSecret) {
        var cf = await stripe.confirmCardPayment(od.clientSecret, { payment_method: pm.paymentMethod.id });
        if (cf.error) return fail(msgOf(cf.error));
      }
    } catch (x) {
      return fail('We could not reach the enrollment system. Please try again or call ' + D.phone + '.');
    }

    form.hidden = true;
    var ok = $('#checkoutSuccess');
    $('[data-order-ref]').textContent = orderRef || 'MP-' + Date.now().toString().slice(-6);
    $('[data-order-email]').textContent = email;
    ok.hidden = false;
    ok.focus();
    ok.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

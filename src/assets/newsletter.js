// Newsletter sign-up popup on the blog home page and blog posts. It opens once per browser,
// then stays hidden until a hard refresh, a different browser or cleared site data.
(function () {
  var d = document, KEY = 'cei-newsletter-popup', MP = window.MP || {}, base = MP.base || '';
  // On the blog's own site, MP.main is the main site's address and MP.blogBase the blog's base path.
  var main = MP.main || base, swBase = MP.blogBase != null ? MP.blogBase : base + '/blog';
  if (!window.HTMLDialogElement) return;
  // If storage is blocked we cannot remember the popup, so never show it rather than nag.
  var seen = function () { try { return !!localStorage.getItem(KEY); } catch (e) { return true; } };
  var mark = function (on) { try { if (on) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch (e) {} };

  // Browsers skip the service worker only on a hard refresh (Shift+Reload, Ctrl+F5), so a
  // reload that its active worker does not control is a hard refresh: show the popup again.
  var ready = Promise.resolve();
  var sw = navigator.serviceWorker;
  if (sw) {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var reload = nav ? nav.type === 'reload' : !!(performance.navigation && performance.navigation.type === 1);
    ready = sw.getRegistration().then(function (reg) {
      if (reload && reg && reg.active && !sw.controller) mark(false);
      if (!reg) return sw.register(swBase + '/sw.js', { scope: swBase + '/' });
    }).catch(function () {});
  }

  var open = function () {
    if (seen()) return;
    mark(true);
    var dlg = d.createElement('dialog');
    dlg.className = 'nl-pop';
    dlg.setAttribute('aria-labelledby', 'nl-pop-h');
    dlg.innerHTML = '<div class="nl-pop-in"><p class="eyebrow">Free newsletter</p><h2 id="nl-pop-h">Get new career articles by email</h2>' +
      '<p>Career advice, salary updates, training tips and hiring insights from our blog, sent to your inbox.</p>' +
      '<div class="btn-row"><a class="btn btn-primary" href="' + main + '/newsletter/" autofocus>Sign up for the newsletter</a><button class="btn" type="button" data-close>No thanks</button></div></div>' +
      '<button class="nl-pop-x" type="button" aria-label="Close" data-close><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>';
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || (e.target.closest && e.target.closest('[data-close]'))) dlg.close();
    });
    dlg.addEventListener('close', function () { dlg.remove(); });
    d.body.appendChild(dlg);
    dlg.showModal();
  };
  ready.then(function () { if (!seen()) setTimeout(open, 1200); });
})();

(function () {
  var forms = document.querySelectorAll('form[data-enroll]');
  // Preselect a course from ?course=Slug-Title on the general enroll page
  try {
    var want = new URLSearchParams(location.search).get('course');
    if (want) [].forEach.call(document.querySelectorAll('select[name="Course"]'), function (s) {
      [].forEach.call(s.options, function (o) { if (o.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').indexOf(want) === 0) s.value = o.value; });
    });
  } catch (e) {}

  [].forEach.call(forms, function (form) {
    var box = form.parentNode, notice = box.querySelector('.notice'), err = form.querySelector('.err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = [];
      [].forEach.call(form.querySelectorAll('[required]'), function (el) {
        var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
        if (ok && el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) bad.push(el);
      });
      if (bad.length) {
        err.hidden = false;
        err.textContent = 'Please complete the required fields' + (bad.some(function (b) { return b.type === 'email' && b.value; }) ? ' and check your email address.' : '.');
        bad[0].focus();
        return;
      }
      err.hidden = true;
      var v = function (n) { var el = form.elements[n]; return el ? String(el.value || '').trim() : ''; };
      var kind = form.dataset.kind;
      var course = v('Course');
      var subject = kind === 'contact' ? 'Website inquiry: ' + v('Topic') + ' — ' + v('Name')
        : (kind === 'employer' ? 'Group training request: ' : 'Enrollment request: ') + (course || 'Course') + ' — ' + v('Name');
      var lines = [
        kind === 'contact' ? 'Hello MrPress Education team,' : 'Hello MrPress Education team, I would like to enroll.',
        '',
        'Name: ' + v('Name'),
        'Email: ' + v('Email'),
        'Phone: ' + (v('Phone') || '—'),
        'State: ' + v('State')
      ];
      if (kind === 'contact') lines.push('Topic: ' + v('Topic'));
      else {
        lines.push('Course: ' + course, 'Enrolling: ' + v('Enrolling'), 'Number of learners: ' + (v('Learners') || '1'));
        if (v('Organization')) lines.push('Organization: ' + v('Organization'));
        lines.push('Preferred start: ' + v('Start'));
      }
      lines.push('', (kind === 'contact' ? 'Message: ' : 'Notes: ') + (v('Message') || '—'), '', 'Age confirmation: 18+ or parent/guardian — confirmed', 'Contact consent: agreed to Terms of Use and Privacy Policy', 'Sent from: ' + location.href);
      var body = lines.join('\n');
      var url = 'mailto:' + form.dataset.to + '?cc=' + encodeURIComponent(form.dataset.cc) + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      notice.querySelector('pre').textContent = 'To: ' + form.dataset.to + '\nCc: ' + form.dataset.cc + '\nSubject: ' + subject + '\n\n' + body;
      notice.classList.add('show');
      window.MP_LAST_MAILTO = url;
      if (!window.MP_NO_MAILTO) window.location.href = url;
      setTimeout(function () { notice.focus(); }, 300);
    });
    var copy = box.querySelector('[data-copy]');
    if (copy) copy.addEventListener('click', function () {
      var t = notice.querySelector('pre').textContent;
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { copy.textContent = 'Copied!'; });
    });
  });
})();

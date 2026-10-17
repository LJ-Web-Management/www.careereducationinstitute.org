(function () {
  var forms = document.querySelectorAll('form[data-enroll]');
  [].forEach.call(forms, function (form) {
    var box = form.parentNode, notice = box.querySelector('.notice'), err = form.querySelector('.err');
    // Fill in a partner discount code remembered from a partner's share link
    var codeField = form.elements.Code;
    if (codeField && form.dataset.kind === 'enroll' && !codeField.value && window.MP && MP.code) codeField.value = MP.code();
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
      var subject, lines;
      var consent = 'Contact consent: agreed to Terms of Use and Privacy Policy';
      if (kind === 'partner') {
        subject = 'Partner program sign-up: ' + v('Organization') + ' (' + v('Type') + ')';
        lines = [
          'Hello Career Education Institute team, we would like to join the partner discount program.',
          '',
          'Organization: ' + v('Organization'),
          'Organization type: ' + v('Type'),
          'Website: ' + (v('Website') || 'Not provided'),
          'Contact name: ' + v('Name'),
          'Title or role: ' + (v('Role') || 'Not provided'),
          'Email: ' + v('Email'),
          'Phone: ' + (v('Phone') || 'Not provided'),
          'State: ' + v('State'),
          'People who could use the code: ' + (v('Reach') || 'Not provided'),
          'Preferred code: ' + (v('Code') || 'No preference'),
          '',
          'How we plan to share the code: ' + (v('Message') || 'Not provided'),
          '',
          'Authorization: authorized to sign up on behalf of this organization (confirmed)',
          consent
        ];
      } else {
        subject = kind === 'employer' ? 'Group training request: ' + (v('Organization') || v('Name')) : 'Enrollment request: ' + course + ' (' + v('Name') + ')';
        lines = [
          kind === 'employer' ? 'Hello Career Education Institute team, we would like pricing for group training.' : 'Hello Career Education Institute team, I would like to enroll.',
          '',
          'Name: ' + v('Name'),
          'Email: ' + v('Email'),
          'Phone: ' + (v('Phone') || 'Not provided'),
          'State: ' + v('State')
        ];
        var courseEl = form.elements.Course;
        var listPrice = courseEl && courseEl.getAttribute('data-price');
        if (course) lines.push('Course: ' + course + (listPrice ? ' (list price $' + Number(listPrice).toFixed(2) + ' per learner)' : ''));
        if (v('Organization')) lines.push('Organization: ' + v('Organization'));
        if (v('Trainings')) lines.push('Roles or trainings of interest: ' + v('Trainings'));
        lines.push('Enrolling: ' + v('Enrolling'), 'Number of learners: ' + (v('Learners') || '1'));
        if (v('Code')) lines.push('Partner discount code: ' + v('Code').toUpperCase());
        lines.push('', 'Notes: ' + (v('Message') || 'None'), '', 'Age confirmation: 18 or older, or parent/guardian (confirmed)', consent);
      }
      lines.push('Sent from: ' + location.href);
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

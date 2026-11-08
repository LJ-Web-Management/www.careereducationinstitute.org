(function () {
  var forms = document.querySelectorAll('form[data-enroll]');
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
      var subject, lines;
      var consent = 'Contact consent: agreed to Terms of Use and Privacy Policy';
      if (kind === 'subscription') {
        var program = form.dataset.program || 'Jobs/Workforce';
        subject = program + ' subscription request: ' + v('Seats') + (v('Seats') === '1' ? ' seat' : ' seats') + ' per month, ' + v('Billing').toLowerCase() + ' (' + (v('Organization') || v('Name')) + ')';
        lines = [
          'Hello Career Education Institute team, I would like a quote for a ' + program + ' subscription.',
          '',
          v('Organization') ? 'Organization: ' + v('Organization') : null,
          'Program: ' + program,
          v('Type') ? 'Type: ' + v('Type') : null,
          'Name: ' + v('Name'),
          'Email: ' + v('Email'),
          'Phone: ' + (v('Phone') || 'Not provided'),
          'State: ' + v('State'),
          'Seats per month: ' + v('Seats'),
          'Billing: ' + v('Billing'),
          'White label: ' + (v('WhiteLabel') || 'No'),
          'Trainings of interest: ' + (v('Trainings') || 'Not sure yet'),
          '',
          'Notes: ' + (v('Message') || 'None'),
          '',
          v('Organization') ? 'Authorization: authorized to request for this organization (confirmed)' : 'Age confirmation: 18 or older, or parent/guardian (confirmed)',
          consent
        ].filter(function (l) { return l !== null; });
      } else {
        subject = kind === 'employer' ? 'Group training request: ' + (v('Organization') || v('Name')) : kind === 'cart' ? 'Enrollment request: ' + v('CartCount') + (v('CartCount') === '1' ? ' training (' : ' trainings (') + v('Name') + ')' : 'Enrollment request: ' + course + ' (' + v('Name') + ')';
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
        if (kind === 'cart') lines.push('', 'Trainings in my cart:', v('Cart'), '');
        lines.push('Enrolling: ' + v('Enrolling'));
        if (kind !== 'cart') lines.push('Number of learners: ' + (v('Learners') || '1'));
        lines.push('', 'Notes: ' + (v('Message') || 'None'), '', 'Age confirmation: 18 or older, or parent/guardian (confirmed)', consent);
      }
      lines.push('Sent from: ' + location.href);
      var body = lines.join('\n');
      var url = 'mailto:' + form.dataset.to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      notice.querySelector('pre').textContent = 'To: ' + form.dataset.to + '\nSubject: ' + subject + '\n\n' + body;
      notice.classList.add('show');
      window.MP_LAST_MAILTO = url;
      if (!window.MP_NO_MAILTO) window.location.href = url;
      setTimeout(function () { notice.focus(); }, 300);
    });
    var copy = box.querySelector('[data-copy]');
    if (copy) copy.addEventListener('click', function () {
      var t = notice.querySelector('pre').textContent;
      var pre = notice.querySelector('pre');
      (window.MP && MP.copyText ? MP.copyText(t, pre) : Promise.resolve(false)).then(function (ok) { copy.textContent = ok ? 'Copied! Paste it into an email to ' + form.dataset.to : 'Select the message above and copy it'; });
    });
  });
})();

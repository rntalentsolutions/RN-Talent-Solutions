(() => {
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      toggle.textContent = '☰';
    }));
  }
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  const makeMailtoForm = (formId, statusId, subjectLabel, fields, fileInputId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = fields.map(([label, key]) => `${label}: ${data.get(key) || 'Not provided'}`);
      let fileName = '';
      if (fileInputId) {
        const file = document.getElementById(fileInputId)?.files?.[0];
        if (file) fileName = `\nSelected resume filename: ${file.name}\nPlease attach this file manually before sending.`;
      }
      const subject = encodeURIComponent(`[RN Talent Solutions] ${subjectLabel}`);
      const bodyText = lines.join('\n') + fileName;
      const status = document.getElementById(statusId);
      status.textContent = fileInputId
        ? 'Your email app should open with your profile details. Attach your resume file before sending.'
        : 'Your email app should open with the requirement details. Review the message and send it to complete your inquiry.';
      status.classList.add('show');
      window.location.href = `mailto:rntalentsolutions@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    });
  };

  makeMailtoForm('requirement-form', 'requirement-status', 'New job requirement / vendor partnership', [
    ['Contact name', 'name'], ['Email', 'email'], ['Company', 'company'],
    ['Partner type', 'partnerType'], ['Job title', 'jobTitle'], ['Location', 'location'],
    ['Engagement type', 'engagement'], ['Pay rate / salary range', 'rate'],
    ['Job description / requirements', 'details']
  ]);

  makeMailtoForm('resume-form', 'resume-status', 'Candidate resume / profile submission', [
    ['Candidate name', 'name'], ['Email', 'email'], ['Phone', 'phone'],
    ['Target role', 'targetRole'], ['Preferred location', 'location'],
    ['Preferred work type', 'workType'], ['Key skills / experience', 'skills']
  ], 'candidate-resume');

})();
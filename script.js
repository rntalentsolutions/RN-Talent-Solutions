const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const clientForm = document.getElementById('clientForm');
clientForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(clientForm);
  const subject = encodeURIComponent(`IT Staffing Requirement - ${data.get('company')}`);
  const body = encodeURIComponent(
`Company / Organization: ${data.get('company')}
Hiring Need: ${data.get('role')}
Location: ${data.get('location') || ''}
Engagement: ${data.get('engagement') || ''}

Message:
${data.get('message') || ''}

Sent from RN Talent Solutions website.`
  );
  window.location.href = `mailto:rntalentsolutions@gmail.com?subject=${subject}&body=${body}`;
});

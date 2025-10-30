(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const yearEl = document.getElementById('year');

  // Year in footer
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Theme persistence
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
    if (themeToggle) themeToggle.textContent = stored === 'light' ? '🌙' : '☀️';
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    if (themeToggle) themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
  }
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Mobile nav
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash.length <= 1) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
    });
  });

  // Section reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Contact form validation and mock submit
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement} */ (document.getElementById('name'));
      const email = /** @type {HTMLInputElement} */ (document.getElementById('email'));
      const message = /** @type {HTMLTextAreaElement} */ (document.getElementById('message'));
      const status = document.getElementById('form-status');

      clearErrors(form);
      const errors = validate({ name, email, message });
      if (errors.length) {
        errors.forEach(({ field, message: msg }) => setFieldError(field, msg));
        if (status) status.textContent = 'Please fix the highlighted fields.';
        return;
      }

      if (status) status.textContent = 'Sending...';
      await new Promise((r) => setTimeout(r, 800));
      if (status) status.textContent = 'Thanks! I will get back to you soon.';
      form.reset();
    });
  }

  function clearErrors(formEl) {
    formEl.querySelectorAll('.error').forEach((el) => (el.textContent = ''));
  }

  function setFieldError(inputEl, message) {
    const field = inputEl.closest('.field');
    if (!field) return;
    const err = field.querySelector('.error');
    if (err) err.textContent = message;
  }

  function validate({ name, email, message }) {
    /** @type {{ field: HTMLElement, message: string }[]} */
    const errs = [];
    if (!name.value.trim()) errs.push({ field: name, message: 'Name is required' });
    if (!email.value.trim()) errs.push({ field: email, message: 'Email is required' });
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) errs.push({ field: email, message: 'Enter a valid email' });
    if (!message.value.trim()) errs.push({ field: message, message: 'Message is required' });
    return errs;
  }
})();



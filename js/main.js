/* main.js – Behaviour for personal resume site */

(function () {
  'use strict';

  /* ── Helpers ────────────────────────────────────────────── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Footer year ────────────────────────────────────────── */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Mobile navigation toggle ───────────────────────────── */
  const toggle  = qs('#nav-toggle');
  const navList = qs('#nav-list');

  function openMenu() {
    navList.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    navList.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close menu when a nav link is clicked
    qsa('.nav__link', navList).forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Sticky header shadow ───────────────────────────────── */
  const header = qs('#site-header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Scroll-spy: highlight active nav link ──────────────── */
  const sections  = qsa('main section[id]');
  const navLinks  = qsa('.nav__link');

  function updateActiveLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop    = section.offsetTop - 80;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + section.id
          );
        });
      }
    });
  }

  /* ── Skill bars: animate on first view ──────────────────── */
  const skillBars = qsa('.skill-bar__fill');

  function animateSkillBars(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const level = el.dataset.level || '0';
      el.style.width = level + '%';
      observer.unobserve(el);
    });
  }

  if ('IntersectionObserver' in window && skillBars.length) {
    const barObserver = new IntersectionObserver(animateSkillBars, {
      threshold: 0.3,
    });
    skillBars.forEach(bar => barObserver.observe(bar));
  } else {
    // Fallback: set widths immediately
    skillBars.forEach(bar => {
      bar.style.width = (bar.dataset.level || '0') + '%';
    });
  }

  /* ── Scroll-reveal: fade-in on scroll ───────────────────── */
  const revealEls = qsa(
    '.timeline__item, .skill-card, .edu-card, .contact-card, .about__grid > *'
  );
  revealEls.forEach(el => el.classList.add('reveal'));

  function handleReveal(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(handleReveal, {
      threshold: 0.15,
    });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

})();

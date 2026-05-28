/* === pictan LP — interactive bits === */
(function () {
  'use strict';

  /* ---------- Language: manual switch ---------- */
  // First-visit auto-redirect lives in an inline <head> script on the English
  // root, so it fires before paint. This handler only records the user's
  // explicit choice so we never auto-redirect again.
  document.querySelectorAll('[data-lang-switch]').forEach((btn) => {
    btn.addEventListener('click', () => {
      try { localStorage.setItem('pictan_lang_pref', btn.getAttribute('data-lang-switch') + '-manual'); } catch (_) {}
    });
  });

  /* ---------- Demo: side-by-side phases ---------- */
  // The demo section is now a static guess→reveal pair of real screenshots,
  // so there is no JS state to manage. Left in place as an anchor in case
  // future hover or in-view animations are added.

  /* ---------- FAQ accordion ---------- */
  // Single-open behavior matching the React prototype.
  const faqItems = document.querySelectorAll('[data-faq-item]');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-item__q');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const wasOpen = item.classList.contains('faq-item--open');
      faqItems.forEach((el) => el.classList.remove('faq-item--open'));
      if (!wasOpen) item.classList.add('faq-item--open');
    });
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  // Honors prefers-reduced-motion via CSS scroll-behavior; this is a graceful
  // additive override so older Safari versions also feel polished.
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

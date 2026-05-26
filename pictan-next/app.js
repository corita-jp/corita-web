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

  /* ---------- Demo card (3-phase flashcard) ---------- */
  // phase 0 = guess (definition only, "タップして答え合わせ")
  // phase 1 = revealed (spell + example + audio + 判定ボタン)
  // phase 2 = result   ("記録しました。次のカードへ。")
  const demoCard = document.querySelector('[data-demo-card]');
  if (demoCard) {
    const steps = document.querySelectorAll('[data-demo-step]');
    const image = demoCard.querySelector('.demo-card__image');
    const guessHint = demoCard.querySelector('.demo-card__bottom--guess');
    const actionBtns = demoCard.querySelectorAll('.demo-card__btn');
    const resetBtn = document.querySelector('[data-demo-reset]');

    function setPhase(next) {
      demoCard.dataset.phase = String(next);
      steps.forEach((el) => {
        el.classList.toggle('demo-step--active', Number(el.dataset.demoStep) === next);
      });
    }

    function reveal() {
      if (demoCard.dataset.phase === '0') setPhase(1);
    }
    function judge() {
      if (demoCard.dataset.phase === '1') setPhase(2);
    }

    image && image.addEventListener('click', reveal);
    guessHint && guessHint.addEventListener('click', reveal);
    actionBtns.forEach((btn) => btn.addEventListener('click', judge));
    resetBtn && resetBtn.addEventListener('click', () => setPhase(0));
  }

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

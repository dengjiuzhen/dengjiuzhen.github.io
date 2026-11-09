/* =====================================================
   PROJECT AUTO-FIT — 17:11 LANDSCAPE CARDS
   Shared by Garden, Penguin, and future project pages.
   Shrinks content only when needed; never clips intentionally.
===================================================== */
(() => {
  'use strict';

  const CARD_SELECTOR = 'main.project-container > section.project-card';
  const WRAPPER_CLASS = 'auto-fit-content';
  const pending = new Set();
  let scheduled = false;

  function schedule(card) {
    if (card) pending.add(card);
    else document.querySelectorAll(CARD_SELECTOR).forEach(c => pending.add(c));

    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const cards = Array.from(pending);
      pending.clear();
      cards.forEach(fitCard);
    });
  }

  function fitCard(card) {
    const content = card.querySelector(':scope > .' + WRAPPER_CLASS);
    if (!content) return;

    // Transform does not affect layout metrics, but reset before measuring.
    content.style.transform = 'none';
    content.style.width = '100%';
    const css = getComputedStyle(card);
    const width = card.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight);
    const height = card.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom);
    if (width <= 0 || height <= 0) return;

    const naturalWidth = Math.max(content.scrollWidth, content.getBoundingClientRect().width);
    const naturalHeight = Math.max(content.scrollHeight, content.getBoundingClientRect().height);
    if (!naturalWidth || !naturalHeight) return;

    // No minimum scale: a minimum would reintroduce clipping.
    const scale = Math.min(1, width / naturalWidth, height / naturalHeight);
    content.style.transform = scale >= 1 ? 'none' : `scale(${scale * 0.995})`;
  }

  function prepare(card) {
    if (card.classList.contains('auto-fit-card')) return;

    const wrapper = document.createElement('div');
    wrapper.className = WRAPPER_CLASS;
    while (card.firstChild) wrapper.appendChild(card.firstChild);
    card.appendChild(wrapper);
    card.classList.add('auto-fit-card');

    // Recompute when the user opens a details element, or media loads.
    wrapper.querySelectorAll('details').forEach(details => {
      details.addEventListener('toggle', () => schedule(card));
    });
    wrapper.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', () => schedule(card), {once: true});
    });

    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => schedule(card));
      resizeObserver.observe(card);
      resizeObserver.observe(wrapper);
    }
  }

  function init() {
    document.querySelectorAll(CARD_SELECTOR).forEach(prepare);
    schedule();
    window.addEventListener('resize', () => schedule(), {passive: true});
    if (document.fonts) document.fonts.ready.then(() => schedule());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();

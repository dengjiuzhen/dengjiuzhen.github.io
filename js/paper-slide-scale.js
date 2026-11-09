/* =====================================================
   PAPER SLIDE SCALE — 17:11 LANDSCAPE

   Uses exactly the same 1100 × (1100 × 11/17) design
   canvas as the Project pages. Scales the whole card;
   never individually compresses text or images.

   The wrapper uses class "project-slide-stage" for
   compatibility with Collection's 17 × 11 PDF export.
===================================================== */
(() => {
  'use strict';

  const BASE_WIDTH = 1100;
  const SELECTOR = '.paper-container > .paper-card';
  const stages = [];

  function fitStage(stage, card) {
    const width = stage.getBoundingClientRect().width;
    if (width <= 0) return;
    const scale = Math.min(1, width / BASE_WIDTH);
    card.style.transform = `scale(${scale})`;

    // A fixed-size canvas cannot accommodate unlimited text.
    // This warning helps find paper cards requiring editing.
    if (card.scrollHeight > card.clientHeight + 2) {
      console.warn('Paper card content exceeds the 17:11 artboard:', card);
    }
  }

  function init() {
    document.querySelectorAll(SELECTOR).forEach(card => {
      const stage = document.createElement('div');
      stage.className = 'project-slide-stage';
      card.parentNode.insertBefore(stage, card);
      stage.appendChild(card);
      stages.push({ stage, card });
    });

    if (!stages.length) return;

    const fitAll = () => stages.forEach(({stage, card}) => fitStage(stage, card));
    fitAll();
    window.addEventListener('resize', fitAll, { passive: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(fitAll);
      stages.forEach(({stage}) => observer.observe(stage));
    }
    if (document.fonts) document.fonts.ready.then(fitAll);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();

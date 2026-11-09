/* =============================================================
   PROJECT SLIDE SCALE — 17:11 LANDSCAPE ARTBOARDS

   Design every .project-card at a fixed 1100 x 711.76 px artboard.
   On smaller screens, scale the ENTIRE card (background, text,
   pictures, video, spacing) uniformly, like a presentation slide.

   Never shrink or reflow the *contents* separately.
   Shared by Garden of Balloons, A Penguin's Return, and new projects.
   ============================================================= */
(() => {
  'use strict';

  const BASE_WIDTH = 1100;
  const BASE_HEIGHT = BASE_WIDTH * 11 / 17;
  const CARD_SELECTOR = 'main.project-container > section.project-card';

  // Append after all page-specific CSS so narrow viewport media rules
  // cannot stack/reflow content inside an artboard.
  const style = document.createElement('style');
  style.id = 'project-slide-scale-style';
  style.textContent = `
    main.project-container > .project-slide-stage {
      box-sizing: border-box;
      position: relative;
      display: block;
      flex: 0 0 auto;
      width: 100%;
      max-width: ${BASE_WIDTH}px;
      aspect-ratio: 17 / 11;
      margin: 0 auto;
      padding: 0;
      overflow: visible;
    }

    main.project-container > .project-slide-stage > section.project-card {
      box-sizing: border-box !important;
      position: absolute !important;
      inset: 0 auto auto 0 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      width: ${BASE_WIDTH}px !important;
      min-width: ${BASE_WIDTH}px !important;
      max-width: ${BASE_WIDTH}px !important;
      height: ${BASE_HEIGHT}px !important;
      min-height: ${BASE_HEIGHT}px !important;
      max-height: ${BASE_HEIGHT}px !important;
      aspect-ratio: auto !important;
      flex: none !important;
      margin: 0 !important;
      padding: 40px !important;
      gap: 20px !important;
      overflow: hidden !important;
      text-align: left !important;
      transform-origin: top left !important;
    }

    /* Preserve two- and three-column desktop compositions even when
       the SCREEN is narrow: the card itself remains 1100px wide. */
    .project-slide-stage .project-content {
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) !important;
    }
    .project-slide-stage .project-content-video {
      grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr) !important;
    }
    .project-slide-stage .project-visual-pair,
    .project-slide-stage .project-text-2col {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .project-slide-stage .project-media img {
      width: auto !important;
      max-height: 260px !important;
    }
    .project-slide-stage .project-card h1.project-title,
    .project-slide-stage .project-card h2.project-title {
      font-size: 38px !important;
    }

    /* Garden: keep the design typography constant when scaled. */
    .project-slide-stage .balloon-eyebrow { font-size: 12px !important; }
    .project-slide-stage .balloon-meta span {
      font-size: 12px !important;
      padding: 7px 12px !important;
    }
    .project-slide-stage .balloon-lead {
      font-size: 20px !important;
      line-height: 1.7 !important;
    }

    /* Penguin: prevent breakpoint-driven grid stacking. */
    .project-slide-stage .penguin-hero-layout {
      grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr) !important;
    }
    .project-slide-stage .penguin-act-grid,
    .project-slide-stage .penguin-textures {
      grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    }
    .project-slide-stage .penguin-visual-grid,
    .project-slide-stage .penguin-debug-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
    .project-slide-stage .penguin-models {
      grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    }
    .project-slide-stage .penguin-notes {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr) !important;
    }
    .project-slide-stage .penguin-eyebrow { font-size: 12px !important; }
    .project-slide-stage .penguin-meta span { font-size: 12px !important; padding: 7px 12px !important; }
    .project-slide-stage .penguin-lead { font-size: 20px !important; }
  `;
  document.head.appendChild(style);

  const stages = [];

  function scaleStage(stage, card) {
    const stageWidth = stage.getBoundingClientRect().width;
    if (stageWidth <= 0) return;
    const scale = Math.min(1, stageWidth / BASE_WIDTH);
    card.style.transform = `scale(${scale})`;

    // Warn developers if desktop-designed content exceeds the artboard.
    // Scaling the whole slide cannot fix content that doesn't fit at 1100px.
    if (Math.abs(scale - 1) < 0.001 && card.scrollHeight > BASE_HEIGHT + 2) {
      console.warn('Project card content exceeds 17:11 artboard. Re-layout or shorten this card:', card);
    }
  }

  function setupCard(card) {
    if (card.parentElement?.classList.contains('project-slide-stage')) return;
    const stage = document.createElement('div');
    stage.className = 'project-slide-stage';
    card.parentNode.insertBefore(stage, card);
    stage.appendChild(card);
    stages.push({stage, card});
  }

  function resizeAll() {
    for (const {stage, card} of stages) scaleStage(stage, card);
  }

  function init() {
    document.querySelectorAll(CARD_SELECTOR).forEach(setupCard);
    if (!stages.length) return;
    resizeAll();
    window.addEventListener('resize', resizeAll, {passive: true});
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(resizeAll);
      stages.forEach(({stage}) => observer.observe(stage));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, {once: true});
  } else {
    init();
  }
})();

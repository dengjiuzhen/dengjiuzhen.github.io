
/* =====================================================
   PROJECT CARD AUTO-FIT
   17:11 Landscape Card System

   Automatically scale card contents to fit.
===================================================== */

(function () {
  "use strict";

  const CARD_SELECTOR = ".project-container > .project-card";
  const MIN_SCALE = 0.35;

  function fitCard(card) {
    const content = card.querySelector(":scope > .auto-fit-content");
    if (!content) return;

    // Reset before measuring.
    content.style.transform = "none";
    content.style.width = "100%";

    const style = getComputedStyle(card);

    const availableWidth =
      card.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);

    const availableHeight =
      card.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);

    if (availableWidth <= 0 || availableHeight <= 0) return;

    // Use natural content dimensions.
    const contentWidth = content.scrollWidth;
    const contentHeight = content.scrollHeight;

    if (contentWidth <= 0 || contentHeight <= 0) return;

    const scaleX = availableWidth / contentWidth;
    const scaleY = availableHeight / contentHeight;

    const scale = Math.min(1, scaleX, scaleY);

    // Avoid scaling below the configured minimum.
    const finalScale = Math.max(MIN_SCALE, scale);

    content.style.transform = `scale(${finalScale})`;
  }

  function prepareCard(card) {
    if (card.classList.contains("auto-fit-card")) return;

    const content = document.createElement("div");
    content.className = "auto-fit-content";

    while (card.firstChild) {
      content.appendChild(card.firstChild);
    }

    card.appendChild(content);
    card.classList.add("auto-fit-card");

    // Recalculate when details open or close.
    content.addEventListener("toggle", () => {
      requestAnimationFrame(() => fitCard(card));
    }, true);

    fitCard(card);
  }

  function fitAllCards() {
    document
      .querySelectorAll(CARD_SELECTOR)
      .forEach(prepareCard);

    document
      .querySelectorAll(CARD_SELECTOR)
      .forEach(fitCard);
  }

  document.addEventListener("DOMContentLoaded", () => {
    fitAllCards();

    window.addEventListener("resize", fitAllCards);

    // Refit after fonts finish loading.
    if (document.fonts) {
      document.fonts.ready.then(fitAllCards);
    }

    // Refit after media finishes loading.
    document.querySelectorAll(".project-card img").forEach(img => {
      if (!img.complete) {
        img.addEventListener("load", fitAllCards, {
          once: true
        });
      }
    });
  });
})();

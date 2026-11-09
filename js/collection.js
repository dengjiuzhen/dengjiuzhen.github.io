(() => {
  "use strict";

  const STORAGE_KEY = "badges";
  const DESIGN_WIDTH = 1100;
  const DESIGN_HEIGHT = DESIGN_WIDTH * 11 / 17;
  const PRINT_SCALE = 1.39;

  /* ===========================================================
     CENTRAL DATA MAP — keep filenames aligned with your repo.
     These are the paths supplied in existing collection.js.
  =========================================================== */
  const ITEM_DATA = {
    // Projects
    "project-penguin-reunion": {
      title: "A Penguin's Return",
      path: "practice/project-penguin-reunion.html",
      type: "project"
    },
    "project-dyed-in-rain": {
      title: "Dyed in Rain: Collaborations in Ink and Code",
      path: "practice/project-dyed-in-rain.html",
      type: "project"
    },
    "project-unplant-trees": {
      title: "Unplant Trees — Browser Extension",
      path: "practice/project-unplant-trees.html",
      type: "project"
    },
    "project-balloon-garden": {
      title: "Garden of Balloons",
      path: "practice/project-balloon-garden.html",
      type: "project"
    },
    "project-dream-manor": {
      title: "Dream Manor: Echoing Fields",
      path: "practice/project-dream-manor.html",
      type: "project"
    },

    // Papers
    "paper-dramatic-structure": {
      title: "Dramatic Structure x Game Design",
      path: "research/paper-dramatic-structure.html",
      type: "paper"
    },
    "paper-narrative-flow": {
      title: "Narrative Flow",
      path: "research/paper-narrative-flow.html",
      type: "paper"
    },
    "paper-collective-experience": {
      title: "Designing Collective Experience",
      path: "research/paper-collective-experience.html",
      type: "paper"
    },
    "paper-algorithmic-kaiwai": {
      title: "Inside the Algorithmic Kaiwai",
      path: "research/paper-algorithmic-kaiwai.html",
      type: "paper"
    },
    "paper-creative-process-ai": {
      title: "Rethinking Creative Process with AI",
      path: "research/paper-creative-process-ai.html",
      type: "paper"
    }
  };

  /* ===========================================================
     STORAGE
  =========================================================== */
  function getCollection() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data.filter(id => typeof id === "string") : [];
    } catch (error) {
      console.warn("Collection storage could not be parsed:", error);
      return [];
    }
  }

  function saveCollection(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getVisibleCollection() {
    return getCollection().filter(id => Object.prototype.hasOwnProperty.call(ITEM_DATA, id));
  }

  /* ===========================================================
     COLLECTION GRID
  =========================================================== */
  function renderCollection() {
    const container = document.getElementById("collection-container");
    if (!container) return;
    container.replaceChildren();

    const ids = getVisibleCollection();
    if (ids.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "Your collection is empty. Visit Studio or Library to collect work.";
      empty.style.color = "var(--text-dim)";
      container.appendChild(empty);
      return;
    }

    ids.forEach((id, index) => {
      const data = ITEM_DATA[id];
      const card = document.createElement("div");
      card.className = "card";

      const title = document.createElement("h2");
      title.textContent = data.title;

      const type = document.createElement("p");
      type.textContent = data.type.toUpperCase();
      type.style.cssText = "color:var(--text-dim);font-size:13px";

      const actions = document.createElement("div");
      actions.style.cssText = "margin-top:12px;display:flex;gap:8px;flex-wrap:wrap";

      function addButton(label, callback, extraClass = "") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `button${extraClass ? " " + extraClass : ""}`;
        button.textContent = label;
        button.addEventListener("click", callback);
        actions.appendChild(button);
      }

      addButton("View →", () => viewItem(id));
      addButton("↑", () => moveUp(index));
      addButton("↓", () => moveDown(index));
      addButton("Uncollect", () => removeItem(id), "button-badge");

      card.append(title, type, actions);
      container.appendChild(card);
    });
  }

  function viewItem(id) {
    const data = ITEM_DATA[id];
    if (!data) return;
    window.location.assign(new URL(data.path, document.baseURI).href);
  }

  function moveUp(index) {
    const ids = getVisibleCollection();
    if (index <= 0 || index >= ids.length) return;
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    saveCollection(ids);
    renderCollection();
  }

  function moveDown(index) {
    const ids = getVisibleCollection();
    if (index < 0 || index >= ids.length - 1) return;
    [ids[index + 1], ids[index]] = [ids[index], ids[index + 1]];
    saveCollection(ids);
    renderCollection();
  }

  function removeItem(id) {
    saveCollection(getCollection().filter(item => item !== id));
    renderCollection();
  }

  /* ===========================================================
     EXPORT HELPERS
  =========================================================== */
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
  }

  function absoluteURL(value, base) {
    if (!value || /^(?:data:|blob:|javascript:|mailto:|tel:|#)/i.test(value.trim())) {
      return value;
    }
    try { return new URL(value, base).href; }
    catch { return value; }
  }

  function normalizeAssetPaths(element, base) {
    const nodes = [element, ...element.querySelectorAll("*")];
    nodes.forEach(node => {
      ["src", "href", "poster"].forEach(attribute => {
        if (node.hasAttribute(attribute)) {
          node.setAttribute(attribute, absoluteURL(node.getAttribute(attribute), base));
        }
      });
      if (node.hasAttribute("srcset")) {
        const srcset = node.getAttribute("srcset");
        // Typical image srcset with relative URLs (no data: URLs).
        if (srcset && !srcset.includes("data:")) {
          node.setAttribute("srcset", srcset.split(",").map(part => {
            const bits = part.trim().split(/\s+/);
            bits[0] = absoluteURL(bits[0], base);
            return bits.join(" ");
          }).join(", "));
        }
      }
      if (node.tagName === "IMG") {
        node.loading = "eager"; // off-screen print sheets must load images
        node.decoding = "sync";
      }
    });
  }

  function youtubeID(url) {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
        return u.pathname.split("/")[2] || null;
      }
      if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    } catch (_) { /* Not a YouTube URL */ }
    return null;
  }

  function preparePrintMedia(card, sourceURL) {
    // Embedded video players usually render blank in the browser's Print to PDF.
    // Replace them with a static thumbnail and a clickable link to the video.
    card.querySelectorAll("iframe[src]").forEach(frame => {
      const url = absoluteURL(frame.getAttribute("src"), sourceURL);
      const id = youtubeID(url);
      const link = document.createElement("a");
      link.className = "collection-print-video";
      link.href = id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = "Open video online";
      const label = document.createElement("span");
      label.className = "collection-print-video-label";
      label.textContent = id ? "▶ Watch video online" : "↗ Open embedded content online";
      if (id) {
        const thumb = document.createElement("img");
        thumb.src = `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
        thumb.alt = frame.title || "Video preview";
        thumb.loading = "eager";
        link.appendChild(thumb);
      }
      link.appendChild(label);
      frame.replaceWith(link);
    });

    // HTML5 videos may otherwise print as black frames. Keep a visible
    // link to the project's live page in their place.
    card.querySelectorAll("video").forEach(video => {
      const link = document.createElement("a");
      link.className = "collection-print-video";
      link.href = sourceURL;
      link.textContent = "▶ View motion demo on the project page";
      const poster = video.getAttribute("poster");
      if (poster) {
        const image = document.createElement("img");
        image.src = absoluteURL(poster, sourceURL);
        image.alt = "Video preview";
        image.loading = "eager";
        link.prepend(image);
      }
      video.replaceWith(link);
    });

    // Buttons/functions do not work in print; avoid showing misleading UI.
    card.querySelectorAll("button").forEach(button => {
      if (button.closest("details")) return;
      // Buttons that open a long script/modal become a link to the live page.
      const link = document.createElement("a");
      link.href = sourceURL;
      link.className = "collection-print-action";
      link.textContent = button.textContent.trim() || "Open interactive project";
      button.replaceWith(link);
    });
  }

  function sourceStyles(doc) {
    // Preserve each project's *page-specific* CSS: Garden, Penguin, Dream,
    // etc. are not styled by project.css alone.
    return [...doc.head.querySelectorAll('link[rel~="stylesheet"], style')]
      .map(node => node.outerHTML).join("\n");
  }

  function iframeDocument(card, sourceDoc, sourceURL, sourceTitle) {
    const baseURL = escapeHTML(sourceURL);
    const bodyClasses = escapeHTML(sourceDoc.body.className || "");
    const css = sourceStyles(sourceDoc);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="${baseURL}">
  <title>${escapeHTML(sourceTitle)}</title>
  ${css}
  <style id="collection-print-artboard-styles">
    :root { color-scheme: dark; }
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      width: 100% !important;
      height: 100% !important;
      min-width: 0 !important;
      max-width: none !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    body { background: #09070f !important; }
    .collection-print-center {
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .project-slide-stage {
      box-sizing: border-box;
      flex: 0 0 auto;
      display: block;
      position: relative;
      width: ${DESIGN_WIDTH}px !important;
      height: ${DESIGN_HEIGHT}px !important;
      max-width: none !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 0 !important;
      transform: scale(${PRINT_SCALE}) !important;
      transform-origin: center center !important;
    }
    .project-slide-stage > .project-card,
    .project-slide-stage > .paper-card {
      box-sizing: border-box !important;
      position: absolute !important;
      inset: 0 auto auto 0 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      width: ${DESIGN_WIDTH}px !important;
      min-width: ${DESIGN_WIDTH}px !important;
      max-width: ${DESIGN_WIDTH}px !important;
      height: ${DESIGN_HEIGHT}px !important;
      min-height: ${DESIGN_HEIGHT}px !important;
      max-height: ${DESIGN_HEIGHT}px !important;
      aspect-ratio: auto !important;
      flex: none !important;
      margin: 0 !important;
      padding: 40px !important;
      gap: 20px !important;
      overflow: hidden !important;
      text-align: left !important;
      transform: none !important;
    }
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
    .project-slide-stage .balloon-eyebrow,
    .project-slide-stage .penguin-eyebrow { font-size: 12px !important; }
    .project-slide-stage .balloon-meta span,
    .project-slide-stage .penguin-meta span {
      font-size: 12px !important; padding: 7px 12px !important;
    }
    .project-slide-stage .balloon-lead { font-size: 20px !important; line-height: 1.7 !important; }
    .project-slide-stage .penguin-lead { font-size: 20px !important; }
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
    .collection-print-video {
      display: flex !important;
      position: relative;
      width: 100%; height: 100%; min-height: 130px;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,.15);
      background: #12101a;
      color: #eee8ff !important;
      text-decoration: none !important;
      font-size: 15px;
    }
    .project-slide-stage .collection-print-video img {
      display: block;
      position: absolute;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
      max-height: none !important;
      object-fit: cover;
      opacity: .72;
    }
    .collection-print-video-label {
      position: relative;
      z-index: 1;
      color: white !important;
      background: rgba(0,0,0,.70);
      padding: 9px 13px;
      border-radius: 20px;
    }
    .collection-print-action {
      display: inline-block;
      border: 1px solid rgba(146,165,238,.5);
      border-radius: 20px;
      padding: 6px 10px;
      color: #eee8ff;
      text-decoration: none;
    }
    /* Never print interactive dialogs on top of a slide. */
    [role="dialog"], dialog, .penguin-script-modal { display: none !important; }
  </style>
</head>
<body class="${bodyClasses}">
  <div class="collection-print-center">
    <div class="project-slide-stage">${card.outerHTML}</div>
  </div>
</body>
</html>`;
  }

  function popupShell(win) {
    win.document.open();
    win.document.write(`<!DOCTYPE html><html lang="en"><head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>My Collection — 17 × 11 Landscape</title>
      <style>
        @page { size: 17in 11in; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        body { background: #171321; color: #eee9fc; font-family: Arial, sans-serif; }
        .collection-print-toolbar {
          position: sticky; top: 0; z-index: 20;
          padding: 14px 20px; background: #211a31;
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          border-bottom: 1px solid #59477c;
        }
        .collection-print-toolbar button {
          padding: 9px 15px; border-radius: 22px; cursor: pointer;
          color: white; background: #4c267b; border: 1px solid #9a80ce;
        }
        .collection-print-toolbar button:disabled { opacity: .5; cursor: wait; }
        #status { font-size: 14px; }
        #warnings { color: #ffdca9; font-size: 12px; white-space: pre-wrap; }
        #pages { padding: 20px 0; }
        .collection-print-sheet {
          box-sizing: border-box;
          width: 17in;
          height: 11in;
          margin: 0 auto 28px;
          background: #09070f;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,.55);
          break-after: page;
          page-break-after: always;
        }
        .collection-print-sheet:last-child { break-after: auto; page-break-after: auto; }
        .collection-print-sheet iframe {
          display: block; width: 100%; height: 100%;
          margin: 0; border: 0; background: #09070f;
        }
        @media print {
          html, body { width: 17in; background: #09070f !important; }
          .collection-print-toolbar { display: none !important; }
          #pages { padding: 0 !important; }
          .collection-print-sheet {
            width: 17in !important; height: 11in !important;
            margin: 0 !important; padding: 0 !important;
            box-shadow: none !important;
            break-after: page; page-break-after: always;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .collection-print-sheet { zoom: 1 !important; }
          .collection-print-sheet:last-child { break-after: auto; page-break-after: auto; }
        }
      </style>
    </head><body>
      <div class="collection-print-toolbar">
        <strong>My Collection · 17 × 11 in landscape</strong>
        <span id="status">Preparing pages…</span>
        <button id="print-now" type="button" disabled>Print / Save as PDF</button>
        <span id="warnings"></span>
      </div>
      <main id="pages"></main>
    </body></html>`);
    win.document.close();
  }

  function waitForFrame(frame, timeoutMs = 12000) {
    try { if (frame.contentDocument?.readyState === "complete") return Promise.resolve(); }
    catch (_) { /* inaccessible frame; continue waiting */ }
    return new Promise(resolve => {
      let settled = false;
      const done = () => { if (!settled) { settled = true; resolve(); } };
      frame.addEventListener("load", done, {once: true});
      setTimeout(done, timeoutMs);
    });
  }

  async function waitForContent(frame) {
    try {
      const doc = frame.contentDocument;
      if (!doc) return;
      const fontReady = doc.fonts ? doc.fonts.ready.catch(() => {}) : Promise.resolve();
      const images = [...doc.images];
      await Promise.race([fontReady, new Promise(r => setTimeout(r, 5000))]);
      await Promise.race([
        Promise.all(images.map(img => img.complete ? Promise.resolve() :
          new Promise(r => { img.addEventListener("load", r, {once: true}); img.addEventListener("error", r, {once: true}); })
        )),
        new Promise(r => setTimeout(r, 7000))
      ]);
    } catch (error) {
      console.warn("Unable to verify print media:", error);
    }
  }

  /* ===========================================================
     EXPORT: ONE SOURCE CARD = ONE 17 × 11-IN PAGE
  =========================================================== */
  async function exportPDF() {
    const ids = getVisibleCollection();
    if (!ids.length) {
      alert("Nothing to export. Collect a project or paper first.");
      return;
    }

    // Open synchronously on click, before the first await, to avoid popup blocking.
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to export your collection.");
      return;
    }
    popupShell(win);

    const pagesRoot = win.document.getElementById("pages");
    const status = win.document.getElementById("status");
    const warnings = win.document.getElementById("warnings");
    const printButton = win.document.getElementById("print-now");

    let pageCount = 0;
    const issues = [];
    const frames = [];

    for (const id of ids) {
      const data = ITEM_DATA[id];
      const pageURL = new URL(data.path, document.baseURI).href;
      status.textContent = `Loading ${data.title}…`;

      try {
        const response = await fetch(pageURL, {credentials: "same-origin"});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const sourceDoc = new DOMParser().parseFromString(html, "text/html");
        const cards = [...sourceDoc.querySelectorAll("main .project-card, main .paper-card")];
        if (cards.length === 0) {
          issues.push(`${data.title}: no printable cards found.`);
          continue;
        }

        cards.forEach((sourceCard, number) => {
          const clone = sourceCard.cloneNode(true);
          normalizeAssetPaths(clone, pageURL);
          preparePrintMedia(clone, pageURL);

          const sheet = win.document.createElement("section");
          sheet.className = "collection-print-sheet";
          sheet.setAttribute("aria-label", `${data.title} — card ${number + 1}`);

          const frame = win.document.createElement("iframe");
          frame.title = `${data.title} — card ${number + 1}`;
          frame.srcdoc = iframeDocument(clone, sourceDoc, pageURL, data.title);
          sheet.appendChild(frame);
          pagesRoot.appendChild(sheet);
          frames.push({frame, title: data.title, number: number + 1});
          pageCount += 1;
        });
      } catch (error) {
        issues.push(`${data.title}: ${error.message}. Verify ITEM_DATA path and that the page is published.`);
        console.error("Collection export error:", pageURL, error);
      }
    }

    if (!pageCount) {
      status.textContent = "No pages could be loaded.";
      warnings.textContent = issues.join("\n");
      return;
    }

    status.textContent = `Preparing ${pageCount} pages for print…`;
    await Promise.all(frames.map(async ({frame}) => {
      await waitForFrame(frame);
      await waitForContent(frame);
    }));

    // Warn rather than silently clipping oversize content.
    frames.forEach(({frame, title, number}) => {
      try {
        const card = frame.contentDocument.querySelector(".project-slide-stage > .project-card, .project-slide-stage > .paper-card");
        if (card && card.scrollHeight > DESIGN_HEIGHT + 4) {
          issues.push(`${title}, card ${number}: content exceeds 17:11 canvas; inspect before printing.`);
        }
      } catch (_) { /* cross-origin frame, not expected for srcdoc */ }
    });

    // On-screen preview fits the browser width. Print CSS resets zoom to 1,
    // so actual output stays exactly 17 × 11 in.
    const updatePreviewZoom = () => {
      const zoom = Math.min(1, Math.max(0.15, (win.innerWidth - 36) / (17 * 96)));
      pagesRoot.querySelectorAll(".collection-print-sheet").forEach(sheet => {
        sheet.style.zoom = String(zoom);
      });
    };
    updatePreviewZoom();
    win.addEventListener("resize", updatePreviewZoom);

    status.textContent = `${pageCount} landscape pages ready.`;
    printButton.disabled = false;
    printButton.addEventListener("click", () => {
      win.focus();
      win.print();
    });
    warnings.textContent = issues.join("\n");

    // Print manually from the preview window, to avoid browser restrictions
    // after asynchronous loading and give the visitor time to inspect.
    win.focus();
  }

  /* Expose functions for any existing inline event handlers. */
  window.getCollection = getCollection;
  window.saveCollection = saveCollection;
  window.renderCollection = renderCollection;
  window.viewItem = viewItem;
  window.moveUp = moveUp;
  window.moveDown = moveDown;
  window.removeItem = removeItem;
  window.exportPDF = exportPDF;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderCollection, {once: true});
  } else {
    renderCollection();
  }
})();

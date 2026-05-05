// ===== DATA =====

// ordered list
function getCollection() {
  return JSON.parse(localStorage.getItem("badges")) || [];
}

function saveCollection(list) {
  localStorage.setItem("badges", JSON.stringify(list));
}

/* =====================================================
   ⚠️ CENTRAL DATA MAP（Maintain Needed）
===================================================== */

const ITEM_DATA = {
  /* =====================================================
     "project-sample": {
    title: "Sample Project",              // ⚠️ 
    path: "practice/sample.html",         // ⚠️ 
    type: "project"  // ⚠️ 
  },
===================================================== */
  // ===== PROJECTS =====
  "project-garden-of-balloons": {
    title: "Garden of Balloons",              
    path: "practice/garden-of-balloons.html",         
    type: "project"  
  },

  // ===== PAPERS =====
  "paper-dramatic-structure": {
    title: "Dramatic Structure x Game Design", 
    path: "research/paper-dramatic-structure.html", 
    type: "paper"
  },

  "paper-narrative-flow": {
    title: "Narrative Flow", 
    path: "research/paper-narrative-flow.html", 
    type: "paper"
  }
};


/* =====================================================
   RENDER
===================================================== */

function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  container.innerHTML = "";

  let items = getCollection();

  items.forEach((id, index) => {
    const data = ITEM_DATA[id];

    // 防止旧数据崩掉
    if (!data) return;

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${data.title}</h2>  

      <p style="color: var(--text-dim); font-size: 13px;">
        ${data.type.toUpperCase()}
      </p>

      <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
        <button class="button" onclick="viewItem('${id}')">
          View →
        </button>

        <button class="button" onclick="moveUp(${index})">↑</button>
        <button class="button" onclick="moveDown(${index})">↓</button>

        <button class="button button-badge" onclick="removeItem('${id}')">
          Uncollect
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}


/* =====================================================
   VIEW
===================================================== */

function viewItem(id) {
  const data = ITEM_DATA[id];  

  if (!data) {
    console.warn("Missing item:", id);
    return;
  }

  window.location.href = data.path;
}


/* =====================================================
   RANKING
===================================================== */

function moveUp(index) {
  let list = getCollection();
  if (index === 0) return;

  [list[index - 1], list[index]] = [list[index], list[index - 1]];
  saveCollection(list);
  renderCollection();
}

function moveDown(index) {
  let list = getCollection();
  if (index === list.length - 1) return;

  [list[index + 1], list[index]] = [list[index], list[index + 1]];
  saveCollection(list);
  renderCollection();
}


/* =====================================================
   REMOVE
===================================================== */

function removeItem(id) {
  let list = getCollection();
  list = list.filter(item => item !== id);

  saveCollection(list);
  renderCollection();
}


/* =====================================================
   EXPORT PDF
===================================================== */

async function exportPDF() {
  let list = getCollection();

  if (list.length === 0) {
    alert("Nothing to export");
    return;
  }

  let win = window.open("", "_blank");

  let html = `
    <html>
    <head>
      <title>Export</title>

      <link rel="stylesheet" href="css/project.css">
      <link rel="stylesheet" href="css/paper.css">
    </head>

    <body style="background:black; padding:40px;">
  `;

  for (let id of list) {
    const data = ITEM_DATA[id];  
    if (!data) continue;

    let res = await fetch(data.path);
    let text = await res.text();

    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/html");

    let cards = doc.querySelectorAll(".project-card, .paper-card");

    cards.forEach(c => {
      html += c.outerHTML;
    });
  }

  html += "</body></html>";

  win.document.write(html);
  win.document.close();

  win.onload = () => {
    win.print();
  };
}


/* =====================================================
   INIT
===================================================== */

renderCollection();

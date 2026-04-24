// ===== DATA =====

// saved as ordered list
function getCollection() {
  return JSON.parse(localStorage.getItem("badges")) || [];
}

function saveCollection(list) {
  localStorage.setItem("badges", JSON.stringify(list));
}

// ===== RENDER =====

function renderCollection() {
  const container = document.getElementById("collection-container");
  if (!container) return;

  container.innerHTML = "";

  let items = getCollection();

  items.forEach((id, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${id}</h2>

      <div style="margin-top:10px;">
        <button class="button" onclick="viewItem('${id}')">View</button>

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

// ===== VIEW =====

function viewItem(id) {
  // map IDs to pages
  const routes = {
    projectA: "practice/sample.html",
    paper1: "research/sample.html"
  };

  if (routes[id]) {
    window.location.href = routes[id];
  }
}

// ===== RANKING =====

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

// ===== REMOVE =====

function removeItem(id) {
  let list = getCollection();
  list = list.filter(item => item !== id);

  saveCollection(list);
  renderCollection();
}

// ===== EXPORT PDF =====

async function exportPDF() {
  let list = getCollection();

  if (list.length === 0) {
    alert("Nothing to export");
    return;
  }

  // open a new window
  let win = window.open("", "_blank");

  // load pages inside
  let html = `
    <html>
    <head>
      <title>Export</title>
      <link rel="stylesheet" href="css/project.css">
      <link rel="stylesheet" href="css/paper.css">
    </head>
    <body style="background:black;">
  `;

  for (let id of list) {
    let pathMap = {
      projectA: "practice/sample.html",
      paper1: "research/sample.html"
    };

    if (!pathMap[id]) continue;

    let res = await fetch(pathMap[id]);
    let text = await res.text();

    // extract only cards
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

  // print (user saves as PDF)
  win.onload = () => {
    win.print();
  };
}

// ===== INIT =====
renderCollection();

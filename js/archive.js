// ===== PAPER DATA =====
const papers = [
  {
    id: "paper1",
    title: "Paper 01",
    description: "Abstract placeholder.",
    path: "research/sample.html"
  }
];

// ===== RENDER =====
function renderArchive() {
  const container = document.getElementById("archive-container");
  if (!container) return;

  papers.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${p.title}</h2>
      <p>${p.description}</p>

      <button class="button" onclick="goToPaper('${p.id}')">
        Read →
      </button>

      <button class="button button-badge" onclick="collectBadge('${p.id}')">
        Collect Badge
      </button>
    `;

    container.appendChild(card);
  });
}

// ===== NAV =====
function goToPaper(id) {
  const paper = papers.find(p => p.id === id);
  if (!paper) return;

  window.location.href = paper.path;
}

// ===== INIT =====
renderArchive();

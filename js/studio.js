//this file is for: Store project data + Render cards dynamically
//Sample ===== PROJECT DATA =====
const projects = [
  {
    id: "project-balloon-garden",
    title: "Garden of Balloons",
    description: "How might we transform daily individual struggle into shared social empowerment?",
    path: "practice/project-balloon-garden.html"
  },
//  {
//    id: "projectA",
//    title: "Sample",
//    description: "Test Project Layout Sample.",
//    path: "practice/sample.html"
//  },
    {
    id: "unplant-trees",
    title: "Unplant Trees",
    description: "A Chrome extension that overlays interactive trees on Google AI Overview results.",
    path: "practice/project-unplant-trees.html"
  },
  {
    id: "project-dream-manor",
    title: "Dream Manor: Echoing Fields",
    description: "Personal development and 2D construction game crafted for accountability with creativity",
    path: "practice/project-dream-manor.html"
  }
];

// ===== RENDER STUDIO =====
function renderProjects() {
  const container = document.getElementById("studio-container");
  if (!container) return;

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${p.title}</h2>
      <p>${p.description}</p>

      <button class="button" onclick="goToProject('${p.id}')">
        View Project →
      </button>

      <button class="button button-badge" onclick="collectBadge('${p.id}')">
        Collect Badge
      </button>
    `;

    container.appendChild(card);
  });
}

// ===== NAVIGATION =====
function goToProject(id) {
  const project = projects.find(p => p.id === id);

  if (!project) {
    console.warn("Project not found:", id);
    return;
  }

  window.location.href = project.path;
}

// ===== INIT =====
renderProjects();

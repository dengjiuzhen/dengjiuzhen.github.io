//this file is for: Store project data + Render cards dynamically
//Sample ===== PROJECT DATA =====
const projects = [
  {
    id: "projectA",
    title: "Sample",
    description: "Test Project Layout Sample.",
    path: "practice/sample.html"
  },
  {
    id: "projectB",
    title: "Future Project",
    description: "Coming soon.",
    path: "practice/projectB.html"
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

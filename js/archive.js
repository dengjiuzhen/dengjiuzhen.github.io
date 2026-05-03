// ===== PAPER DATA =====
const papers = [
  {
    id: "Narrative Flow",
    title: "Designing Audience Flow State in Narrative Media",
    description: "Narrative media emerges its flow state model from a relationship between audience relatability and narrative continuity. When viewers engage with a story, their cognitive abilities and emotional investment interact with the coherence of the narrative, which determines the depth of immersion. Existing research highlights that textual cohesion, probabilistic continuity, and emotional transitions are key to sustaining flow when receiving stories through media. However, cultural background and audience familiarity with storytelling conventions also influence the interpretation of story content and, therefore, cause different degrees of immersive experiences. This study proposes a Two-Dimensional Flow Framework, categorizing factors for flow state into relatability—how much the viewer identifies with the story—and continuity—the logical progression of the narrative. Misalignment in these dimensions can lead to disengagement through negative emotions. This framework allows creators to craft narratives that sustain audience engagement without overwhelming or under-stimulating them through curating the relationship between audience relatability and narrative continuity. The findings suggest that cognitive compatibility and emotional resonance deepen audience connection and sustained participation, so future storytellers should consider these factors when designing narrative media.",
    path: "research/08052025.html"
//    id: "paper1",
//    title: "Paper 01",
//    description: "Abstract placeholder.",
//    path: "research/sample.html"
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

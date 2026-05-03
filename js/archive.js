// ===== PAPER DATA =====
const papers = [
  {
    id: "Narrative Flow",
    title: "Designing Audience Flow State in Narrative Media",
    description: "What makes a story truly immersive—and why do some narratives lose us along the way? This paper introduces a Two-Dimensional Flow Framework, revealing how relatability and narrative continuity work together to shape audience engagement. Discover how aligning emotional resonance with coherent storytelling can sustain attention and deepen the viewer experience.",
    path: "research/08052025.html"
  },
  {
    id: "Dramatic Structure x Game Design",
    title: "The Application of Dramatic Structure in Digital Game Design and Its Impact on Player Emotions",
    description: "What if the secret to unforgettable games lies in classic storytelling? This study reveals how the five stages of dramatic structure shape player emotions and deepen immersion. Explore how game designers can harness narrative pacing to create more engaging, emotionally powerful experiences.",
    path: "research/26112024.html"
  }
//  {
//    id: "paper1",
//    title: "Paper 01",
//    description: "Abstract placeholder.",
//    path: "research/sample.html"
//  }
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

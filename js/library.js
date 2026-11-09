// ===== PAPER DATA =====
const papers = [
  {
    id: "paper-collective-experience",
    title: "Designing Collective Experience: A Research-through-Design Framework for Gameful Multisensory Interaction",
    description: "How can multisensory play bring people together? Through the interactive installation Garden of Balloons, this research-through-design study explores how shared sensory experiences create moments of collective attention, affective engagement, and social connection.",
    path: "research/paper-collective-experience.html"
  },
  {
    id: "paper-algorithmic-kaiwai",
    title: "Inside the Algorithmic Kaiwai: Negotiating Anime Subcultural Filter Bubbles",
    description: "How do algorithms shape anime fan communities? This study examines how media industries, platform personalization, and fan participation create and reinforce anime subcultural circles, while exploring how fans negotiate and resist these algorithmic boundaries.",
    path: "research/paper-algorithmic-kaiwai.html"
  },
  {
    id: "paper-creative-process-ai",
    title: "Rethinking Creative Process with AI's Current Role and Future Potential",
    description: "Can AI enhance creativity without replacing human ingenuity? Drawing on case studies and survey research, this paper examines how creative professionals engage with AI, exploring its possibilities, limitations, and future role in collaborative creative processes.",
    path: "research/paper-creative-process-ai.html"
  },
  {
    id: "paper-narrative-flow",
    title: "Designing Audience Flow State in Narrative Media",
    description: "What makes a story truly immersive—and why do some narratives lose us along the way? This paper introduces a Two-Dimensional Flow Framework, revealing how relatability and narrative continuity work together to shape audience engagement. Discover how aligning emotional resonance with coherent storytelling can sustain attention and deepen the viewer experience.",
    path: "research/paper-narrative-flow.html"
  },
  {
    id: "paper-dramatic-structure",
    title: "The Application of Dramatic Structure in Digital Game Design and Its Impact on Player Emotions",
    description: "What if the secret to unforgettable games lies in classic storytelling? This study reveals how the five stages of dramatic structure shape player emotions and deepen immersion. Explore how game designers can harness narrative pacing to create more engaging, emotionally powerful experiences.",
    path: "research/paper-dramatic-structure.html"
  }
//  {
//    id: "paper1",
//    title: "Paper 01",
//    description: "Abstract placeholder.",
//    path: "research/sample.html"
//  }
];

// ===== RENDER =====
function renderLibrary() {
  const container = document.getElementById("library-container");
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
renderLibrary();

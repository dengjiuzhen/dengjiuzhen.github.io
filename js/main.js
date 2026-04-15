// COIN SYSTEM
const display = document.getElementById("time");

setInterval(() => {
  let start = localStorage.getItem("startTime");

  if (!start) {
    start = Date.now();
    localStorage.setItem("startTime", start);
  }

  let now = Date.now();
  let seconds = (now - start) / 1000;
  let coins = (seconds * 0.02).toFixed(2);

  localStorage.setItem("coins", coins);

  if (display) {
    display.innerText = coins;
  }
}, 1000);

// BADGE SYSTEM
function collectBadge(id) {
  let badges = JSON.parse(localStorage.getItem("badges")) || [];

  if (!badges.includes(id)) {
    badges.push(id);
    localStorage.setItem("badges", JSON.stringify(badges));
    alert("Badge collected!");
  }
}

// DISPLAY COLLECTION
let container = document.getElementById("collection-container");

if (container) {
  let badges = [];

  try {
    badges = JSON.parse(localStorage.getItem("badges")) || [];
  } catch (e) {
    badges = [];
  }

  badges.forEach(b => {
    let div = document.createElement("div");
    div.innerText = b;
    container.appendChild(div);
  });
}

// CAFÉ
function buyCoffee() {
  let coins = parseFloat(localStorage.getItem("coins")) || 0;
  const price = 2;

  const result = document.getElementById("coffee-result");

  if (!result) return;

  if (coins < price) {
    result.innerHTML = "<p>☹️ Not enough coins... stay a little longer?</p>";
    return;
  }

  // Deduct coins
  coins -= price;
  coins = coins.toFixed(2);
  localStorage.setItem("coins", coins);

  // Update UI immediately
  const display = document.getElementById("time");
  if (display) display.innerText = coins;

  // Random messages
  const messages = [
    "You’re doing amazing 💜",
    "Take it slow, you’re right on time ☁️",
    "Thanks for spending time here 🌙",
    "A small break suits you ☕",
    "You’ve got a good eye for things ✨",
    "Stay a little longer, I like your presence 🌸"
  ];

  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  // Show result with GIF
  result.innerHTML = `
    <div class="coffee-animation">
      <img src="assets/coffee.gif" alt="coffee">
      <p>${randomMsg}</p>
    </div>
  `;
}

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
  let badges = JSON.parse(localStorage.getItem("badges")) || [];

  badges.forEach(b => {
    let div = document.createElement("div");
    div.innerText = b;
    container.appendChild(div);
  });
}

// CAFÉ
function buyCoffee() {
  let coins = parseFloat(localStorage.getItem("coins")) || 0;

  if (coins >= 3) {
    coins -= 3;
    localStorage.setItem("coins", coins);

    const messages = [
      "You’re doing great 🌸",
      "Take it slow ☕",
      "Thanks for being here ✨"
    ];

    document.getElementById("coffee-message").innerText =
      messages[Math.floor(Math.random() * messages.length)];
  } else {
    alert("Not enough coins!");
  }
}

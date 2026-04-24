console.log("JS loaded");

// ===== COIN SYSTEM (NO OFFLINE FARMING + SPENDABLE) =====
if (!sessionStorage.getItem("lastTick")) {
  sessionStorage.setItem("lastTick", Date.now());
}

if (!localStorage.getItem("coins")) {
  localStorage.setItem("coins", "0");
}

setInterval(() => {
  try {
    let last = parseInt(sessionStorage.getItem("lastTick"));
    let now = Date.now();

    let deltaSeconds = (now - last) / 1000;

    // if offline
    if (deltaSeconds > 5) {
      console.log("Detected long leave → ignoring offline time");
      deltaSeconds = 0;
    }

    let coins = parseFloat(localStorage.getItem("coins")) || 0;

    coins += deltaSeconds * 0.02;
    coins = coins.toFixed(2);

    localStorage.setItem("coins", coins);
    sessionStorage.setItem("lastTick", now);

    const display = document.getElementById("time");
    if (display) display.innerText = coins;

  } catch (e) {
    console.error("Coin system error:", e);
  }
}, 1000);

// BADGE SYSTEM
function collectBadge(id) {
  try {
    let badges = JSON.parse(localStorage.getItem("badges")) || [];

    if (!badges.includes(id)) {
      badges.push(id); // preserves order
      localStorage.setItem("badges", JSON.stringify(badges));

      alert("Collected ✦");
    } else {
      alert("Already collected");
    }

  } catch (e) {
    console.error("Badge error:", e);
  }
}


// CAFÉ SYSTEM
function buyCoffee() {
  console.log("BUY COFFEE CLICKED");

  try {
    let coins = parseFloat(localStorage.getItem("coins")) || 0;
    const price = 2;

    const result = document.getElementById("coffee-result");
    if (!result) {
      console.log("No coffee-result element");
      return;
    }

    if (coins < price) {
      result.innerHTML = "<p>☹️ Not enough coins</p>";
      return;
    }

    coins -= price;
    coins = coins.toFixed(2);
    localStorage.setItem("coins", coins);

    const display = document.getElementById("time");
    if (display) display.innerText = coins;

const messages = [
  "You’re doing amazing 🌹",
  "Take it slow ☁️",
  "Thanks for being here ♥️",
  "You’ve come this far already 🫶",
  "It’s okay to rest here for a bit 🌙",
  "You’re doing better than you think 💪",
  "This moment counts too ✨",
  "Take your time, I’m not going anywhere 🫧",
  "You’re allowed to move slowly 🌿",
  "A small pause is still progress 🌸",
  "+1 emotional support drink 🍵",
  "This coffee believes in you 😉",
  "You unlocked: tiny comfort 😌",
  "Productivity paused...Vibes resumed ✌️",
  "Careful, this coffee is 100% encouragement 💯",
  "Achievement unlocked: taking a break 🏆",
  "This coffee has no bugs, only hugs 🤗",
  "Neon night, soft thoughts 💜",
  "Somewhere, something is gently glowing 🤫",
  "The café hums quietly for you 🎤",
  "The world slows down just a little here 🌊",
  "A quiet corner, just for you 🐚",
  "Time drips like warm coffee ☕️",
  "You linger, and that’s enough 🥺",
  "Soft light, softer thoughts 💌",
  "Thanks for spending time with my work 🌸",
  "I’m really glad you’re here 🥰",
  "You noticed something—I appreciate that 🥳",
  "I hope something here stayed with you ☺️",
  "This space is better with you in it 🤝",
  "You’ve been exploring a lot 👀",
  "I can tell you’re curious 🤩",
  "Something is unfolding… keep going 🌿"
];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    result.innerHTML = `
      <div class="coffee-animation">
        <img src="assets/coffee.gif" alt="coffee">
        <p>${randomMsg}</p>
      </div>
    `;

  } catch (e) {
    console.error("Coffee error:", e);
  }
}

console.log("JS loaded");

// COIN SYSTEM
setInterval(() => {
  try {
    let start = localStorage.getItem("startTime");

    if (!start) {
      start = Date.now();
      localStorage.setItem("startTime", start);
    }

    let now = Date.now();
    let seconds = (now - start) / 1000;
    let coins = (seconds * 0.02).toFixed(2);

    localStorage.setItem("coins", coins);

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
      badges.push(id);
      localStorage.setItem("badges", JSON.stringify(badges));
      alert("Badge collected!");
    }
  } catch (e) {
    console.error("Badge error:", e);
  }
}


// COLLECTION DISPLAY
try {
  let container = document.getElementById("collection-container");

  if (container) {
    let badges = JSON.parse(localStorage.getItem("badges")) || [];

    badges.forEach(b => {
      let div = document.createElement("div");
      div.innerText = b;
      container.appendChild(div);
    });
  }
} catch (e) {
  console.error("Collection error:", e);
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
      "You’re doing amazing 💜",
      "Take it slow ☁️",
      "Thanks for being here 🌙"
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

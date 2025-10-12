const imageUrls = [
  "https://ipfs.ebisusbay.com/ipfs/QmZBWAGEPVydd3WKJKJvdesKjMC85Hf1Yod4VJCBvydW1R",
  "https://ipfs.ebisusbay.com/ipfs/QmSxg9ACBP4EEyda5QbU4usJYxRVDHj8GZQokcwUd8CnNt",
  "https://ipfs.ebisusbay.com/ipfs/QmamsZf2hswCZSa69wjGoDSd8nGYs9dFtn8Pr7ok6mbWhK",
  "https://ipfs.ebisusbay.com/ipfs/QmW9JrWr5ky1sGtjJjA88waNvSSpyxXzVNrPLNsgB5JcKH",
  "https://ipfs.ebisusbay.com/ipfs/QmaRViMaSy589tBF776nRfvXkCNTrN7r8F25ojzB3JFtGZ",
  "https://ipfs.ebisusbay.com/ipfs/QmagKTAQScb7KKHoXHmNRi9j8bymXaQdz3WKijztYA9axZ",
  "https://ipfs.ebisusbay.com/ipfs/QmbgsC39AJpiPy1y8m17wJdqCmtiAeitMmTSs2mGY3LVFc",
  "https://ipfs.ebisusbay.com/ipfs/Qmctg69YZ3txXL6Us58VgLXvaTTH4hgfZWRQuLKbcRqMyH"
];

const frontImage = "https://www.memesoncronos.com/datas/tokens/312o22102n1m8jehsayq3z5wv.webp";

let flippedCards = [];
let matchedCount = 0;
let lockBoard = false;
let score = 0;
let time = 0;
let timerInterval;

const flipSound = new Audio("content");

function playFlipSound() {
  const sound = flipSound.cloneNode();
  sound.volume = 0.4;
  sound.play().catch(() => {});
}

function initGame() {
  const game = document.getElementById("game");
  const win = document.getElementById("win-message");
  game.innerHTML = "";
  win.classList.remove("show");
  flippedCards = [];
  matchedCount = 0;
  lockBoard = false;
  score = 0;
  time = 0;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = time;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  const cards = [...imageUrls, ...imageUrls].sort(() => 0.5 - Math.random());

  cards.forEach(url => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = url;

    const front = document.createElement("div");
    front.classList.add("front");
    const frontImg = document.createElement("img");
    frontImg.src = frontImage;
    front.appendChild(frontImg);

    const back = document.createElement("div");
    back.classList.add("back");
    const img = document.createElement("img");
    img.src = url;
    back.appendChild(img);

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", () => flipCard(card));
    game.appendChild(card);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped")) return;
  card.classList.add("flipped");
  playFlipSound();
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    setTimeout(checkMatch, 700);
  }
}

function checkMatch() {
  const [first, second] = flippedCards;
  if (first.dataset.image === second.dataset.image) {
    matchedCount++;
    score += 5;
    document.getElementById("score").textContent = score;
    if (matchedCount === 8) showWinMessage();
  } else {
    score -= 1;
    document.getElementById("score").textContent = score;
    first.classList.remove("flipped");
    second.classList.remove("flipped");
  }
  flippedCards = [];
  lockBoard = false;
}

function showWinMessage() {
  clearInterval(timerInterval);
  const win = document.getElementById("win-message");
  const finalScore = document.getElementById("final-score");
  win.classList.add("show");
  finalScore.textContent = `Final Score: ${score} | Time: ${time}s`;

  setTimeout(() => {
    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) saveToLeaderboard(playerName, score, time);
    displayLeaderboard();
  }, 1000);
}

function saveToLeaderboard(name, score, time) {
  const leaderboard = JSON.parse(localStorage.getItem("meryLegendsLeaderboard") || "[]");
  leaderboard.push({ name, score, time });
  leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
  localStorage.setItem("meryLegendsLeaderboard", JSON.stringify(leaderboard.slice(0, 10)));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("meryLegendsLeaderboard") || "[]");
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = leaderboard
    .map(entry => `<tr><td>${entry.name}</td><td>${entry.score}</td><td>${entry.time}s</td></tr>`)
    .join("");
}

displayLeaderboard();
initGame();

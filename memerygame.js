// ------------------ IMAGE & GAME SETUP ------------------
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

// ------------------ WIN SCREEN ------------------
function showWinMessage() {
  clearInterval(timerInterval);
  const win = document.getElementById("win-message");
  const finalScore = document.getElementById("final-score");
  win.classList.add("show");
  finalScore.textContent = `Final Score: ${score} | Time: ${time}s`;

  setTimeout(() => {
    const playerName = prompt("Enter your name for the leaderboard:");
    if (playerName) saveScore(playerName, score, time);
  }, 1000);
}

// ------------------ FIREBASE LEADERBOARD ------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 🔥 Replace these with your Firebase project credentials
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save player score to Firestore
async function saveScore(player, score, time) {
  try {
    await addDoc(collection(db, "memeryLeaderboard"), {
      player,
      score: Number(score),
      time: Number(time),
      date: new Date()
    });
    alert("Score saved successfully!");
    loadLeaderboard();
  } catch (e) {
    console.error("Error saving score:", e);
    alert("Could not save score — check console for details.");
  }
}

// Load top 10 scores from Firestore
async function loadLeaderboard() {
  const q = query(collection(db, "memeryLeaderboard"), orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(q);
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const row = `<tr><td>${data.player}</td><td>${data.score}</td><td>${data.time || 0}s</td></tr>`;
    tbody.innerHTML += row;
  });
}

// Load leaderboard when page is ready
window.addEventListener("DOMContentLoaded", loadLeaderboard);

// ------------------ GAME INIT ------------------
initGame();  score = 0;
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
    if (playerName) {
      saveToLeaderboard(playerName, score, time, () => {
        win.classList.remove("show");
      });
    }
  }, 1000);
}

function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

function saveToLeaderboard(name, score, time, onSave) {
  const leaderboardRef = database.ref('leaderboard');
  const newEntry = {
    name: sanitizeHTML(name),
    score: score,
    time: time
  };
  leaderboardRef.push(newEntry)
    .then(() => {
      console.log("Score saved successfully!");
      if (onSave) onSave();
    })
    .catch((error) => {
      console.error("Error saving score: ", error);
      alert("There was an error saving your score. Please try again.");
    });
}

function displayLeaderboard() {
  const leaderboardRef = database.ref('leaderboard').orderByChild('score').limitToLast(10);
  const tbody = document.getElementById("leaderboard-body");

  leaderboardRef.on('value', (snapshot) => {
    let entries = [];
    snapshot.forEach((childSnapshot) => {
      entries.push(childSnapshot.val());
    });
    
    // Sort descending by score, then ascending by time
    entries.sort((a, b) => b.score - a.score || a.time - b.time);

    let html = "";
    entries.forEach((entry) => {
      html += `<tr><td>${sanitizeHTML(entry.name)}</td><td>${entry.score}</td><td>${entry.time}s</td></tr>`;
    });
    tbody.innerHTML = html;
  }, (error) => {
    console.error("Error getting leaderboard: ", error);
    tbody.innerHTML = "<tr><td colspan='3'>Error loading leaderboard.</td></tr>";
  });
}

displayLeaderboard();
initGame();

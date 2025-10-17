// memerygame.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, 
  query, orderBy, limit, onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// ------------------ FIREBASE CONFIG ------------------
const firebaseConfig = {
  apiKey: "AIzaSyD-YvTCquhpbl6j1TwTsDz5hnMPnyU3ukI",
  authDomain: "memery-game-4f732.firebaseapp.com",
  projectId: "memery-game-4f732",
  storageBucket: "memery-game-4f732.appspot.com",
  messagingSenderId: "957328543425",
  appId: "1:957328543425:web:d48bc4323bd309e0858e40",
  measurementId: "G-LXMZ5FHV05"
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ------------------ GAME STATE ------------------
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

// ------------------ SOUND EFFECT ------------------
function playFlipSound() {
  const sound = flipSound.cloneNode();
  sound.volume = 0.4;
  sound.play().catch(() => {});
}

// ------------------ INITIALIZE GAME ------------------
function initGame() {
  const game = document.getElementById("game");
  const win = document.getElementById("win-message");
  game.innerHTML = "";
  win.classList.remove("show");
  win.style.opacity = "0";
  win.style.pointerEvents = "none";

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
    const backImg = document.createElement("img");
    backImg.src = url;
    back.appendChild(backImg);

    card.appendChild(front);
    card.appendChild(back);
    card.addEventListener("click", () => flipCard(card));
    game.appendChild(card);
  });
}

// ------------------ CARD FLIP LOGIC ------------------
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
    if (matchedCount === imageUrls.length) {
      showWinMessage();
    }
  } else {
    score -= 1;
    document.getElementById("score").textContent = score;
    first.classList.remove("flipped");
    second.classList.remove("flipped");
  }
  flippedCards = [];
  lockBoard = false;
}

// ------------------ RANDOM NAME GENERATOR ------------------
function generateRandomName() {
  const prefixes = ["Ghost", "Cro", "Anon", "Mery", "Legend"];
  const suffix = Math.floor(1000 + Math.random() * 9000);
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}_${suffix}`;
}

// ------------------ WIN MESSAGE ------------------
function showWinMessage() {
  clearInterval(timerInterval);
  const win = document.getElementById("win-message");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = `Final Score: ${score} | Time: ${time}s`;

  win.classList.add("show");
  win.style.opacity = "1";
  win.style.pointerEvents = "auto";

  setTimeout(async () => {
    const playerName = prompt("Enter your name for the leaderboard:") || generateRandomName();
    await saveScore(playerName, score, time);
  }, 1000);
}

// ------------------ FIRESTORE SAVE ------------------
async function saveScore(player, scoreVal, timeVal) {
  try {
    await addDoc(collection(db, "memeryLeaderboard"), {
      player,
      score: Number(scoreVal),
      time: Number(timeVal),
      date: new Date()
    });
  } catch (e) {
    console.error("Error saving score:", e);
    alert("Could not save score — check console.");
  }
}

// ------------------ LIVE LEADERBOARD ------------------
function listenToLeaderboard() {
  const q = query(
    collection(db, "memeryLeaderboard"),
    orderBy("score", "desc"),
    limit(10)
  );
  onSnapshot(q, (snapshot) => {
    const tbody = document.getElementById("leaderboard-body");
    if (!tbody) {
      console.warn("No element with id 'leaderboard-body' found");
      return;
    }
    tbody.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      tbody.innerHTML += `<tr>
        <td>${data.player}</td>
        <td>${data.score}</td>
        <td>${data.time || 0}s</td>
      </tr>`;
    });
  });
}

// ------------------ PLAY AGAIN BUTTON FIX ------------------
document.addEventListener("DOMContentLoaded", () => {
  // Start live leaderboard
  listenToLeaderboard();
  
  // Start the game
  initGame();

  // Play Again button
  const playAgainBtn = document.getElementById("play-again");
  const winMessage = document.getElementById("win-message");

  if (playAgainBtn && winMessage) {
    playAgainBtn.addEventListener("click", () => {
      // Fade out overlay
      winMessage.style.transition = "opacity 0.6s ease";
      winMessage.style.opacity = "0";
      winMessage.style.pointerEvents = "none";

      // Wait for fade-out then restart game
      setTimeout(() => {
        winMessage.classList.remove("show");
        initGame();
      }, 600);
    });
  }
});
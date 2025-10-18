
// memerygame.js
import { db } from "./firebase.js";
import { collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const leaderboardBody = document.getElementById("leaderboard-body");

  let score = 0;
  let time = 0;
  let flippedCards = [];
  let lockBoard = false;
  let timerInterval;
  let matchedCount = 0;

  const frontImage = "https://www.memesoncronos.com/datas/tokens/312o22102n1m8jehsayq3z5wv.webp";
  const imageUrls = [
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/1.png",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/2.png",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/3.png",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/4.png",
    "https.gif",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/6.png",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/7.png",
    "https://ipfs.io/ipfs/QmZc5Wf5fKVm2J43Vf2i2LdG2J4i2J43Vf2i2LdG2J4i2J/8.png"
  ];

  const flipSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_bd9145ba3f.mp3');

  function playFlipSound() {
    flipSound.play();
  }

  function startGame() {
    score = 0;
    time = 0;
    matchedCount = 0;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = time;
    game.innerHTML = "";
    flippedCards = [];
    lockBoard = false;

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

  function showWinMessage() {
    clearInterval(timerInterval);
    const name = prompt(`You win! Score: ${score}, Time: ${time}s. Enter name for leaderboard:`);
    if (name) {
      saveScore(name, score, time);
    }
  }

  async function saveScore(player, scoreVal, timeVal) {
    try {
      await addDoc(collection(db, "memeryLeaderboard"), {
        player,
        score: Number(scoreVal),
        time: Number(timeVal),
        date: new Date()
      });
      loadLeaderboard(); 
    } catch (e) {
      console.error("Error saving score:", e);
      alert("Could not save score — check console.");
    }
  }

  async function loadLeaderboard() {
    const q = query(collection(db, "memeryLeaderboard"), orderBy("score", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    leaderboardBody.innerHTML = "";
    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      const row = `<tr>
        <td>${index + 1}</td>
        <td>${data.player}</td>
        <td>${data.score}</td>
        <td>${data.time}</td>
      </tr>`;
      leaderboardBody.innerHTML += row;
    });
  }

  document.getElementById("restart-btn").addEventListener("click", startGame);

  startGame();
  loadLeaderboard();
});

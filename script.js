// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAooLq0iO6pt7cEAu7VpdYmHEAyANsH4z8",
  authDomain: "hatch-647fa.firebaseapp.com",
  databaseURL: "https://hatch-647fa-default-rtdb.firebaseio.com",
  projectId: "hatch-647fa",
  storageBucket: "hatch-647fa.firebasestorage.app",
  messagingSenderId: "1002694901238",
  appId: "1:1002694901238:web:5c51840b40ea625e189bd7",
  measurementId: "G-SSNDLN72PE"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Dummy logins
const users = {
  "zezo": "000",
  "lilly": "246",
  "asser": "230"
};

let currentUser = null;
let money = 0;
let goal = 7000;
let medals = [];

// DOM
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const welcome = document.getElementById("welcome");
const moneyEl = document.getElementById("money");
const goalEl = document.getElementById("goal");
const gameArea = document.getElementById("game-area");
const spinBtn = document.getElementById("spin-btn");
const spinResult = document.getElementById("spin-result");
const medalsBtn = document.getElementById("medals-btn");
const medalsModal = document.getElementById("medals-modal");
const medalsContainer = document.getElementById("medals-container");
const challengeBtn = document.getElementById("challenge-btn");
const challengeModal = document.getElementById("challenge-modal");
const incomingChallenge = document.getElementById("incoming-challenge");

// Login
loginBtn.onclick = () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;
  if (users[u] && users[u] === p) {
    currentUser = u;
    loginScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    welcome.innerText = `Welcome, ${u}!`;
    loadProgress();
  } else {
    loginError.innerText = "Invalid login!";
  }
};

// Clicking game
gameArea.onclick = () => {
  money++;
  updateMoney();
};

// Update money
function updateMoney() {
  moneyEl.innerText = money;
  if (money >= goal) {
    medals.push(`Medal ${medals.length+1}`);
    saveProgress();
    goal += 500;
    goalEl.innerText = goal;
  }
  saveProgress();
}

// Spin wheel
spinBtn.onclick = () => {
  const prizes = [1000,2000,3000,4000,5000];
  const prize = prizes[Math.floor(Math.random()*prizes.length)];
  money += prize;
  spinResult.innerText = `You won $${prize}!`;
  updateMoney();
};

// Medals modal
medalsBtn.onclick = () => {
  medalsModal.classList.remove("hidden");
  medalsContainer.innerHTML = "";
  medals.forEach(m => {
    const div = document.createElement("div");
    div.classList.add("medal");
    div.innerText = m;
    medalsContainer.appendChild(div);
  });
};
document.querySelectorAll(".close").forEach(btn => {
  btn.onclick = () => btn.parentElement.parentElement.classList.add("hidden");
});

// Save progress
function saveProgress() {
  db.ref("users/"+currentUser).set({
    money, goal, medals
  });
}

// Load progress
function loadProgress() {
  db.ref("users/"+currentUser).once("value").then(snap => {
    if (snap.exists()) {
      const data = snap.val();
      money = data.money || 0;
      goal = data.goal || 7000;
      medals = data.medals || [];
      moneyEl.innerText = money;
      goalEl.innerText = goal;
    }
  });
}

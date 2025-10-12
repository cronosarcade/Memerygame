const firebaseConfig = {
  apiKey: "AIzaSyD-YvTCquhpbl6j1TwTsDz5hnMPnyU3ukI",
  authDomain: "memery-game-4f732.firebaseapp.com",
  databaseURL: "https://memery-game-4f732-default-rtdb.firebaseio.com",
  projectId: "memery-game-4f732",
  storageBucket: "memery-game-4f732.appspot.com",
  messagingSenderId: "957328543425",
  appId: "1:957328543425:web:d48bc4323bd309e0858e40",
  measurementId: "G-LXMZ5FHV05"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

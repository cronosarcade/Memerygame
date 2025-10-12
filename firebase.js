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

// --- Temporary Test Code ---
// This code will run once when the page loads to test the database connection.
function runDatabaseTest() {
  console.log("Running database write test...");
  const testEntry = {
    name: "Test Score",
    score: 101,
    time: 1
  };

  database.ref('leaderboard').push(testEntry)
    .then(() => {
      console.log("Test data saved successfully! The leaderboard should update.");
    })
    .catch((error) => {
      console.error("Database test write FAILED:", error);
      alert("The automatic test to write to the database failed. This almost certainly means your security rules on the Firebase website are incorrect. Please press F12 to open the developer console and confirm you see a 'PERMISSION_DENIED' error.");
    });
}

// Run the test automatically when the page loads.
runDatabaseTest();
// --- End of Test Code ---

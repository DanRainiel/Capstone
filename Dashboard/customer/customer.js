import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com", // ✅ Fix the domain typo here
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadUsername() {
  const userId = sessionStorage.getItem("userId"); // get saved user ID from login

  if (!userId) {
    console.log("No user logged in.");
    return;
  }

  try {
    // check if it’s from users collection or admin collection
    let userRef = doc(db, "users", userId);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // maybe it’s an admin
      userRef = doc(db, "Admin", userId);
      userSnap = await getDoc(userRef);
    }

    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById("username").textContent = data.name;
    } else {
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error loading username:", error);
  }
}

loadUsername();


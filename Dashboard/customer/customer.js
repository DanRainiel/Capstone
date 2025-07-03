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
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    console.log("No user logged in.");
    return;
  }

  try {
    let userRef = doc(db, "users", userId);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      userRef = doc(db, "Admin", userId);
      userSnap = await getDoc(userRef);
    }

    if (userSnap.exists()) {
      const data = userSnap.data();

      // Set both name fields
      document.getElementById("welcome-username").textContent = data.name;
      document.getElementById("profile-username").textContent = data.name;
      document.getElementById("profilepage-username").textContent = data.name;
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error loading username:", error);
  }
}


loadUsername();

if (sessionStorage.getItem("role") === "customer") {
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', () => {
    location.replace(location.href);
  });
}




//dropdown menu
window.toggleMenu = function(){
  const dropMenu = document.getElementById("subMenu");
  dropMenu.classList.toggle("openMenu");

}


document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById("logout-btn");
  const logoutModal = document.getElementById("logoutModal");
  const confirmLogout = document.getElementById("confirmLogout");
  const cancelLogout = document.getElementById("cancelLogout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault(); // ✅ Prevent immediate redirect
      logoutModal.style.display = "flex"; // ✅ Show the modal
    });
  }

  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.style.display = "none"; // ❌ Cancel logout
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      sessionStorage.clear(); // ✅ Clear login info
      location.replace("/index.html"); // ✅ Redirect after confirmation
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === logoutModal) {
      logoutModal.style.display = "none";
    }
  });
});




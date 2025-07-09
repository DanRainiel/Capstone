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
      const username = data.name || "User";
      const email = data.email || "Email";

      // Store to session
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("email", email);

      // Update username wherever it exists
      const usernameElements = [
        document.getElementById("welcome-username"),
        document.getElementById("profile-username"),
        document.getElementById("profilepage-username"),
        document.getElementById("account-username")
      ];
      usernameElements.forEach(el => {
        if (el) el.textContent = username;
      });

      // Update email wherever it exists
      const emailElements = [
        document.getElementById("account-email")
      ];
      emailElements.forEach(el => {
        if (el) el.textContent = email;
      });

    } else {
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error loading username:", error);
  }
}
loadUsername();



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

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".second-navbar nav a");
  const sections = document.querySelectorAll("section");
  const navbar = document.querySelector(".second-navbar"); // Get the navbar element

  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const id = tab.id.replace("-tab", ""); // e.g., book-tab → book

      sections.forEach(section => {
        // Skip the navbar section from being hidden
        if (section.classList.contains('second-navbar')) {
          return; // Don't hide the navbar
        }
        
        if (section.id === id || (id === "book" && section.id === "booking")) {
          section.style.display = "block";
        } else {
          section.style.display = "none";
        }
      });
      
      // Ensure navbar is always visible
      if (navbar) {
        navbar.style.display = "flex";
      }
    });
  });
});

 document.addEventListener("DOMContentLoaded", () => {
    // Open modal when clicking on the button
    document.getElementById("lm-1").addEventListener("click", () => {
      document.getElementById("modal-1").style.display = "block";
    });

    document.getElementById("lm-2").addEventListener("click", () => {
      document.getElementById("modal-2").style.display = "block";
    });

    document.getElementById("lm-3").addEventListener("click", () => {
      document.getElementById("modal-3").style.display = "block";
    });

    document.getElementById("lm-4").addEventListener("click", () => {
      document.getElementById("modal-4").style.display = "block";
    });

    document.getElementById("lm-5").addEventListener("click", () => {
      document.getElementById("modal-5").style.display = "block";
    });

    document.getElementById("lm-6").addEventListener("click", () => {
      document.getElementById("modal-6").style.display = "block";
    });



    document.querySelectorAll(".modal-close").forEach(btn => {
      btn.addEventListener("click", () => {
        const modalId = btn.getAttribute("data-close");
        document.getElementById(modalId).style.display = "none";
      });
    });

    // Close when clicking outside modal-content
    window.addEventListener("click", (e) => {
      const modal = document.getElementById("modal-1");
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });




import { db } from './db_config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const loginButton = document.getElementById("SignInBtn");

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("log-email").value.trim();
  const password = document.getElementById("log-pass").value.trim();
  const loader = document.getElementById("loading-screen");

  if (!email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  loader.style.display = "flex";

  try {
    // Check users
    const usersRef = collection(db, "users");
    const userSnapshot = await getDocs(usersRef);

    for (const docItem of userSnapshot.docs) {
      const data = docItem.data();
      if (data.email === email && data.password === password) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", docItem.id);
        sessionStorage.setItem("role", "customer");
        sessionStorage.setItem("userName", data.name);
        sessionStorage.setItem("welcomeMessage", `Welcome back, ${data.name}!`);

        // wait 2 seconds, then redirect
        setTimeout(() => {
          location.replace("../Dashboard/customer/customer.html");
        }, 2000);
        return;
      }
    }

    // Check admin (optional, remove if not needed)
    const adminRef = collection(db, "Admin");
    const adminSnapshot = await getDocs(adminRef);

    for (const docItem of adminSnapshot.docs) {
      const data = docItem.data();
      if (data.email === email && data.password === password) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", docItem.id);
        sessionStorage.setItem("role", "admin");
        sessionStorage.setItem("userName", data.name);
        sessionStorage.setItem("welcomeMessage", `Welcome back, Admin ${data.name}!`);

        setTimeout(() => {
          location.replace("../Dashboard/admin/admin.html");
        }, 2000);
        return;
      }
    }

    loader.style.display = "none";
    alert("Account not found or incorrect credentials.");
  } catch (error) {
    console.error("Login error:", error);
    loader.style.display = "none";
    alert("Login failed. Please try again.");
  }
});

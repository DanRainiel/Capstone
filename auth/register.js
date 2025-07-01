import { db } from './db_config.js';
import { collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ CUSTOMER SIGN-UP LOGIC
document.getElementById("SignUpBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value.trim();
  const agreeTerms = document.getElementById("agree").checked;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (!agreeTerms) {
    alert("You must agree to the terms and conditions.");
    return;
  }

  try {
    const userCollection = collection(db, "users");
    const querySnapshot = await getDocs(userCollection);
    const ownerCount = querySnapshot.size;
    const newOwnerId = `owner${ownerCount + 1}`;
    const docRef = doc(db, "users", newOwnerId);

    await setDoc(docRef, {
      name,
      email,
      password,
      createdAt: new Date()
    });

    alert(`User saved as "${newOwnerId}"`);

    // Clear form
    document.getElementById("reg-name").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-pass").value = "";
    document.getElementById("agree").checked = false;

  } catch (err) {
    console.error("Error writing document:", err);
    alert("Failed to register user.");
  }
});

// ✅ UNIFIED LOGIN LOGIC
document.getElementById("SignInBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  const email = document.getElementById("log-email").value.trim();
  const password = document.getElementById("log-pass").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const usersRef = collection(db, "users");
    const userSnapshot = await getDocs(usersRef);
    for (const docItem of userSnapshot.docs) {
      const data = docItem.data();
      if (data.email === email && data.password === password) {
        sessionStorage.setItem("isLoggedIn", "true");
        alert(`Welcome back, ${data.name}!`);
        location.replace("../Dashboard/customer/customer.html");
        return;
      }
    }

    const adminRef = collection(db, "Admin");
    const adminSnapshot = await getDocs(adminRef);
    for (const docItem of adminSnapshot.docs) {
      const data = docItem.data();
      if (data.email === email && data.password === password) {
        sessionStorage.setItem("isLoggedIn", "true");
        alert(`Welcome back, Admin ${data.name}!`);
        location.replace("../Dashboard/admin/admin.html");
        return;
      }
    }

    alert("Account not found or incorrect password.");

  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed.");
  }
});

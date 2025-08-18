    import { db } from './db_config.js';
    import {
    collection,
    getDocs,
    setDoc,  
    addDoc,
    doc,
    serverTimestamp
  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


  async function logActivity(userId, action, details) {
    try {
      await addDoc(collection(db, "ActivityLog"), {
        userId: userId || "anonymous",
        action,
        details,
        timestamp: serverTimestamp()
      });
      console.log("Activity logged:", action);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  }

    const loginButton = document.getElementById("SignInBtn");

  
    loginButton.addEventListener("click", async (e) => {
      e.preventDefault();

      const email = document.getElementById("log-email").value.trim();
      const password = document.getElementById("log-pass").value.trim();
      const loader = document.getElementById("loading-screen");


      loader.style.display = "none";

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
            
            await logActivity(docItem.id, "Logged In", `User ${data.name} logged in.`);

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

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome back, Admin ${data.name}!`,
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      location.replace("../Dashboard/admin/admin.html");
    }, 2000);
    return;
  }
}

loader.style.display = "none";
Swal.fire({
  icon: "error",
  title: "Login Failed",
  text: "Account not found or incorrect credentials.",
  confirmButtonColor: "#ff8800" // Orange OK button
});
} catch (error) {
console.error("Login error:", error);
loader.style.display = "none";
Swal.fire({
  icon: "error",
  title: "Login Failed",
  text: "Please try again.",
  confirmButtonColor: "#ff8800" // Orange OK button
});
}
});
    
  // REGISTER

  const signUpButton = document.getElementById("SignUpBtn");

  signUpButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-pass").value.trim();
    const agree = document.getElementById("agree").checked;
    const loader = document.getElementById("loading-screen");

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill in all fields.",
        iconColor:'#f8732b',
        confirmButtonColor: '#f8732b', // your orange theme
        backdrop: `rgba(0, 0, 0, 0.5)` // darken background a bit
      });
      return;
    }

    if (!agree) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "You must agree to the terms and conditions.",
        iconColor:'#f8732b',
        confirmButtonColor: '#f8732b',
        backdrop: `rgba(0, 0, 0, 0.5)`, // darken background a bit
        confirmButtonText: "Got it!"
      });
      return;
    }

    loader.style.display = "flex";

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const existingUser = snapshot.docs.find(doc => doc.data().email === email);
      if (existingUser) {
        loader.style.display = "none";
        await logActivity(docItem.id, "Registered", `User ${name} registered an account.`);
        alert("Email is already registered.");
        return;
      }

    
      let index = 1;
      let newId;
      const existingIds = snapshot.docs.map(doc => doc.id);

      while (true) {
        newId = `owner${index}`;
        if (!existingIds.includes(newId)) break;
        index++;
      }

     await setDoc(doc(usersRef, newId), {
  name,
  email,
  password, // ✅ comma added
  joinedDate: serverTimestamp(),  // ✅ will now actually save
  status: "Active"       
});


      // Save session and redirect
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userId", newId);
      sessionStorage.setItem("role", "customer");
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("welcomeMessage", `Welcome, ${name}!`);

      setTimeout(() => {
        location.replace("../Dashboard/customer/customer.html");
      }, 1500);

    } catch (error) {
      console.error("Registration error:", error);
      loader.style.display = "none";
      alert("Registration failed: " + error.message);
    }
  });



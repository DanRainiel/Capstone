    import { db } from './db_config.js';
    import {
    collection,
    getDocs,
    setDoc,  
    addDoc,
    doc,
    serverTimestamp,
     query, 
     where,
      updateDoc
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

      loader.style.display = "flex";

      try {
        // Check users
        const usersRef = collection(db, "users");
        const userSnapshot = await getDocs(usersRef);

       for (const docItem of userSnapshot.docs) {
  const data = docItem.data();
  if (data.email === email && data.password === password) {

    // 🔎 Check account status before login
    if (data.status && data.status.toLowerCase() === "inactive") {
      alert("Your account has been deactivated. Please contact admin.");
      loader.style.display = "none"; // hide loader again
      return; // ❌ stop login here
    }

    // ✅ If Active, continue login
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", docItem.id);
    sessionStorage.setItem("role", "customer");
    sessionStorage.setItem("userName", data.name);
    
    localStorage.setItem("currentUserId", docItem.id);
    
    await logActivity(docItem.id, "Logged In", `User ${data.name} logged in.`);
    sessionStorage.setItem("welcomeMessage", `Welcome back, ${data.name}!`);

    // wait 2 seconds, then redirect
    setTimeout(() => {
      location.replace("../Dashboard/customer/customer.html");
    }, 2000);
    return;
  }
}

        
// ✅ Check Admin
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

localStorage.setItem("currentUserId", docItem.id);

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome back, Admin ${data.name}!`,
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
      location.replace("../Dashboard/admin/admin.html"); // keep admin redirect
    }, 2000);
    return;
  }
}

// ✅ Check Staff
const staffRef = collection(db, "Staff");
const staffSnapshot = await getDocs(staffRef);

for (const docItem of staffSnapshot.docs) {
  const data = docItem.data();
  if (data.email === email && data.password === password) {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", docItem.id);
    sessionStorage.setItem("role", "staff");
    sessionStorage.setItem("userName", data.name);
    sessionStorage.setItem("welcomeMessage", `Welcome back, Staff ${data.name}!`);

    localStorage.setItem("currentUserId", docItem.id);

    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: `Welcome back, Staff ${data.name}!`,
      timer: 2000,
      showConfirmButton: false
    });

    setTimeout(() => {
     location.replace("../Dashboard/staff/staff.html");

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
    await logActivity(existingUser.id, "Registered", `User ${name} tried to register with an existing email.`);
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

localStorage.setItem("currentUserId", newId); // <-- fixed

setTimeout(() => {
  location.replace("../Dashboard/customer/customer.html");
}, 1500);


    } catch (error) {
      console.error("Registration error:", error);
      loader.style.display = "none";
      alert("Registration failed: " + error.message);
    }
  });


  document.addEventListener("DOMContentLoaded", () => {
  const agreeCheckbox = document.getElementById("agree");

  agreeCheckbox.addEventListener("change", async function () {
    if (this.checked) {
      const { isConfirmed } = await Swal.fire({
        title: "Terms and Conditions & Privacy Policy",
        html: `
          <div style="text-align:left; max-height:300px; overflow-y:auto; padding:10px; border:1px solid #ddd;">
            <p><b>PetStop Veterinary Clinic</b><br>
            Effective Date: [Insert Date]</p>

            <p><b>1. Account Registration</b><br>
            To register, you must provide a username, valid email address, and password.<br>
            You agree to provide accurate, current, and complete information.<br>
            Accounts are personal and may not be transferred to others.</p>

            <p><b>2. Account Security</b><br>
            You are responsible for maintaining the confidentiality of your login details.<br>
            You must notify us immediately of any unauthorized use of your account.<br>
            We are not liable for losses resulting from unauthorized access due to your negligence.</p>

            <p><b>3. Use of Services</b><br>
            Your account is intended for booking appointments, accessing veterinary records, and communicating with us.<br>
            You may not use our services for unlawful, fraudulent, or harmful purposes.<br>
            We reserve the right to suspend or terminate accounts that violate these Terms.</p>

            <p><b>4. Service Availability</b><br>
            We aim to keep our services available but do not guarantee uninterrupted or error-free access.<br>
            We may update, modify, or discontinue certain features without prior notice.</p>

            <p><b>5. Limitation of Liability</b><br>
            PetStop Veterinary Clinic shall not be liable for indirect, incidental, or consequential damages from the use of our services.<br>
            Nothing in these Terms excludes liability where prohibited by Philippine law.</p>

            <p><b>6. Changes to Terms</b><br>
            We may update these Terms as needed.<br>
            Continued use of our services after changes constitutes acceptance of the revised Terms.</p>

            <p><b>7. Contact Us</b><br>
            📧 [Insert Clinic Email]<br>
            📞 [Insert Clinic Phone Number]</p>

            <hr>

            <h3>Privacy Policy</h3>
            <p><b>PetStop Veterinary Clinic</b><br>
            (Compliant with RA 10173 – Data Privacy Act of 2012)</p>

            <p><b>1. Personal Information We Collect</b><br>
            Username, Email, Password (encrypted), Appointment details, Pet medical records, Communication history.</p>

            <p><b>2. Purpose of Collection</b><br>
            To create/manage accounts, provide veterinary services, send updates/reminders, and comply with PH law.</p>

            <p><b>3. Data Sharing</b><br>
            No selling/trading of data. Shared only when necessary (e.g., IT, payments). Disclosure only if required by law.</p>

            <p><b>4. Data Security</b><br>
            Encrypted passwords, organizational/technical safeguards as required by law. No system is 100% secure.</p>

            <p><b>5. Data Retention</b><br>
            Retained while account is active or required by law.</p>

            <p><b>6. Your Rights</b><br>
            Right to be informed, access, correction, deletion, withdraw consent, and file complaints with NPC.<br>
            Contact our Data Protection Officer:<br>
            📧 [Insert DPO Email]<br>
            📞 [Insert DPO Phone Number]</p>

            <p><b>7. Updates</b><br>
            Policy may change to comply with law or service improvements.</p>
          </div>
        `,
        icon: "info",
        width: 700,
        showCancelButton: true,
        confirmButtonText: "I Accept",
        cancelButtonText: "Decline",
        allowOutsideClick: false
      });

      if (!isConfirmed) {
        this.checked = false; // Uncheck if declined
      }
    }
  });
});


document.getElementById('forgotPasswordLink').addEventListener('click', async (e) => {
  e.preventDefault();

  const { value: formValues } = await Swal.fire({
    title: 'Reset Password',
    html: `
      <input id="swal-email" class="swal2-input" placeholder="Enter your email">
      <input id="swal-current-password" type="password" class="swal2-input" placeholder="Current password">
      <input id="swal-new-password" type="password" class="swal2-input" placeholder="New password">
    `,
    focusConfirm: false,
    preConfirm: () => {
      const email = document.getElementById('swal-email').value;
      const currentPassword = document.getElementById('swal-current-password').value;
      const newPassword = document.getElementById('swal-new-password').value;

      if (!email || !currentPassword || !newPassword) {
        Swal.showValidationMessage('Please fill in all fields');
        return;
      }
      return { email, currentPassword, newPassword };
    },
    showCancelButton: true,
    confirmButtonText: 'Reset Password'
  });

  if (!formValues) return;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", formValues.email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      Swal.fire('Error', 'No user found with this email.', 'error');
      return;
    }

    let success = false;
    for (const userDoc of querySnapshot.docs) {
      const userData = userDoc.data();

      // compare current password
      if (userData.password === formValues.currentPassword) {  // <-- ideally use hashed passwords
        await updateDoc(userDoc.ref, {
          password: formValues.newPassword,  // <-- ideally hash
          updatedAt: serverTimestamp()
        });
        success = true;
        break;
      }
    }

    if (success) {
      Swal.fire('Success', 'Password updated successfully.', 'success');
    } else {
      Swal.fire('Error', 'Current password is incorrect.', 'error');
    }

  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Something went wrong.', 'error');
  }
});

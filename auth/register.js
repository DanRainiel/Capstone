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
      iconColor: '#f8732b',
      confirmButtonColor: '#f8732b',
      backdrop: `rgba(0, 0, 0, 0.5)`
    });
    return;
  }

  loader.style.display = "flex";

  try {
    let userFound = null;
    let userData = null;
    let userRole = null;
    let userDocId = null;
    let userName = null;

    // 🔍 Check Customer Users
    const usersRef = collection(db, "users");
    const userSnapshot = await getDocs(usersRef);
    for (const docItem of userSnapshot.docs) {
      const data = docItem.data();
      if (data.email === email && data.password === password) {
        if (data.status && data.status.toLowerCase() === "inactive") {
          Swal.fire({
            icon: "error",
            title: "Account Deactivated",
            text: "Your account has been deactivated. Please contact admin.",
            confirmButtonColor: "#f8732b"
          });
          loader.style.display = "none";
          return;
        }
        userFound = data;
        userRole = "customer";
        userDocId = docItem.id;
        userName = data.name || data.fullName;
        break;
      }
    }

    // 🔍 Check Admin Users
    if (!userFound) {
      const adminRef = collection(db, "Admin");
      const adminSnapshot = await getDocs(adminRef);
      for (const docItem of adminSnapshot.docs) {
        const data = docItem.data();
        if (data.email === email && data.password === password) {
          userFound = data;
          userRole = "admin";
          userDocId = docItem.id;
          userName = data.name;
          break;
        }
      }
    }

    // 🔍 Check Staff Users
    if (!userFound) {
      const staffRef = collection(db, "Staff");
      const staffSnapshot = await getDocs(staffRef);
      for (const docItem of staffSnapshot.docs) {
        const data = docItem.data();
        if (data.email === email && data.password === password) {
          // Check staff account status
          if (data.status && data.status.toLowerCase() === "inactive") {
            Swal.fire({
              icon: "error",
              title: "Account Deactivated",
              text: "Your staff account has been deactivated. Please contact admin.",
              confirmButtonColor: "#f8732b"
            });
            loader.style.display = "none";
            return;
          }
          userFound = data;
          userRole = "staff";
          userDocId = docItem.id;
          userName = data.name;
          break;
        }
      }
    }

    // ❌ If no user found with matching credentials
    if (!userFound) {
      loader.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Account not found or incorrect credentials.",
        confirmButtonColor: "#ff8800"
      });
      return;
    }

    // ✅ Credentials are valid - now send OTP for verification
    loader.style.display = "none";

    // Send OTP
    const sendOtpResponse = await fetch("http://localhost:3000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email, 
        userId: userName || email 
      })
    });

    const sendOtpData = await sendOtpResponse.json();
    if (!sendOtpData.success) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: "Failed to send verification code. Try again later.",
        confirmButtonColor: "#f8732b"
      });
      return;
    }

    // Ask for OTP
    const { value: otp } = await Swal.fire({
      title: "Login Verification",
      input: "text",
      inputLabel: `Enter the 6-digit verification code sent to ${email}`,
      inputPlaceholder: "Enter verification code",
      inputAttributes: {
        maxlength: "6",
        autocapitalize: "off",
        autocorrect: "off"
      },
      confirmButtonText: "Verify & Login",
      confirmButtonColor: "#f8732b",
      showCancelButton: true,
      cancelButtonText: "Cancel Login",
      cancelButtonColor: "#6c757d",
      inputValidator: (value) => {
        if (!value) return "Please enter the verification code.";
        if (value.length !== 6) return "Verification code must be 6 digits.";
        if (!/^\d+$/.test(value)) return "Verification code must contain only numbers.";
      }
    });

    if (!otp) {
      // User cancelled OTP entry
      return;
    }

    // Show loader while verifying OTP
    loader.style.display = "flex";

    // Verify OTP
    const verifyResponse = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      loader.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: verifyData.message || "Invalid verification code. Please try again.",
        confirmButtonColor: "#f8732b"
      });
      return;
    }

    // ✅ OTP verified successfully - Complete login process
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", userDocId);
    sessionStorage.setItem("role", userRole);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userFullName", userFound.fullName || userName);
    sessionStorage.setItem("currentUserId", userDocId);
    localStorage.setItem("currentUserId", userDocId);

    // Log activity
    await logActivity(userDocId, "Logged In", `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ${userName} logged in with OTP verification.`);

    // Set welcome message and redirect URL based on role
    let welcomeMessage = "";
    let redirectUrl = "";
    
    switch (userRole) {
      case "admin":
        welcomeMessage = `Welcome back, Admin ${userName}!`;
        redirectUrl = "../Dashboard/admin/admin.html";
        break;
      case "staff":
        welcomeMessage = `Welcome back, Staff ${userName}!`;
        redirectUrl = "../Dashboard/staff/staff.html";
        break;
      case "customer":
        welcomeMessage = `Welcome back, ${userName}!`;
        redirectUrl = "../Dashboard/customer/customer.html";
        break;
    }

    sessionStorage.setItem("welcomeMessage", welcomeMessage);

    // Show success message
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: welcomeMessage,
      timer: 2000,
      showConfirmButton: false,
      background: '#f8f9fa'
    });

    // Redirect after delay
    setTimeout(() => {
      location.replace(redirectUrl);
    }, 2000);

  } catch (error) {
    console.error("Login error:", error);
    loader.style.display = "none";
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "An unexpected error occurred. Please try again.",
      confirmButtonColor: "#ff8800"
    });
  }
});
    
const signUpButton = document.getElementById("SignUpBtn");

signUpButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("reg-fullname").value.trim();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-pass").value.trim();
  const agree = document.getElementById("agree").checked;
  const loader = document.getElementById("loading-screen");

  // 🧩 Validate inputs
  if (!fullName || !name || !email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill in all fields.",
      iconColor: "#f8732b",
      confirmButtonColor: "#f8732b",
      backdrop: `rgba(0, 0, 0, 0.5)`
    });
    return;
  }

  // 🧩 Check terms and conditions
  if (!agree) {
    Swal.fire({
      icon: "warning",
      title: "Terms Required",
      text: "You must agree to the terms and conditions before registering.",
      iconColor: "#f8732b",
      confirmButtonColor: "#f8732b",
      backdrop: `rgba(0, 0, 0, 0.5)`,
      confirmButtonText: "Got it!"
    });
    return;
  }

  loader.style.display = "none";

  try {
    // 🔹 Step 1: Check for existing email
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    const existingUser = snapshot.docs.find(doc => doc.data().email === email);
    if (existingUser) {
      loader.style.display = "none";
      Swal.fire("Email already registered", "Please use another email.", "error");
      return;
    }

    // 🔹 Step 2: Send OTP via backend
    const sendOtpResponse = await fetch("http://localhost:3000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, userId: fullName })
    });

    const sendOtpData = await sendOtpResponse.json();
    if (!sendOtpData.success) {
      loader.style.display = "none";
      Swal.fire("Error", "Failed to send OTP. Try again later.", "error");
      return;
    }

    loader.style.display = "none"; // Hide loader before OTP input

    // 🔹 Step 3: Ask for OTP
    const { value: otp } = await Swal.fire({
      title: "Verify Your Email",
      input: "text",
      inputLabel: `Enter the 6-digit code sent to ${email}`,
      inputPlaceholder: "Enter OTP",
      confirmButtonText: "Verify",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Please enter the OTP.";
      }
    });

    // Only continue if user entered OTP
    if (!otp) return;

    // ✅ Show loader ONLY after user entered OTP (now verifying)
    loader.style.display = "flex";

    // 🔹 Step 4: Verify OTP with backend
    const verifyResponse = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });

    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      loader.style.display = "none";
      Swal.fire("Error", verifyData.message || "Invalid OTP", "error");
      return;
    }

    // ✅ OTP is correct — now create account
    let index = 1;
    let newId;
    const existingIds = snapshot.docs.map(doc => doc.id);
    while (true) {
      newId = `owner${index}`;
      if (!existingIds.includes(newId)) break;
      index++;
    }

    await setDoc(doc(usersRef, newId), {
      fullName,
      name,
      email,
      password,
      joinedDate: serverTimestamp(),
      status: "Active"
    });

    // Save session
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userId", newId);
    sessionStorage.setItem("role", "customer");
    sessionStorage.setItem("userName", fullName);
    sessionStorage.setItem("welcomeMessage", `Welcome, ${fullName}!`);
    localStorage.setItem("currentUserId", newId);

    // ✅ Keep loader visible until redirected
    Swal.fire({
      icon: "success",
      title: "Account Verified!",
      text: "Registration successful. Redirecting...",
      showConfirmButton: false,
      timer: 1500
    });

    // Wait for 1.5s, then redirect while loader still showing
    await new Promise(resolve => setTimeout(resolve, 1500));

    loader.style.display = "flex"; // Keep visible during redirect

    setTimeout(() => {
      location.replace("../Dashboard/customer/customer.html");
    }, 500);

  } catch (error) {
    console.error("Registration error:", error);
    loader.style.display = "none";
    Swal.fire("Error", "Registration failed. Please try again.", "error");
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
      const email = document.getElementById('swal-email').value.trim();
      const currentPassword = document.getElementById('swal-current-password').value.trim();
      const newPassword = document.getElementById('swal-new-password').value.trim();

      if (!email || !currentPassword || !newPassword) {
        Swal.showValidationMessage('Please fill in all fields');
        return;
      }
      return { email, currentPassword, newPassword };
    },
    showCancelButton: true,
    confirmButtonText: 'Send Verification Code'
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

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verify current password first
    if (userData.password !== formValues.currentPassword) {
      Swal.fire('Error', 'Current password is incorrect.', 'error');
      return;
    }

    // Step 1️⃣: Send OTP
    const sendOtpResponse = await fetch("http://localhost:3000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formValues.email, userId: userDoc.id })
    });

    const sendOtpData = await sendOtpResponse.json();
    if (!sendOtpData.success) {
      Swal.fire("Error", "Failed to send verification code. Try again later.", "error");
      return;
    }

    // Step 2️⃣: Ask user for OTP
    const { value: otp } = await Swal.fire({
      title: "Email Verification",
      input: "text",
      inputLabel: `Enter the 6-digit code sent to ${formValues.email}`,
      inputPlaceholder: "Enter OTP",
      confirmButtonText: "Verify Code",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Please enter the verification code.";
      }
    });

    if (!otp) return;

    // Step 3️⃣: Verify OTP
    const verifyResponse = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formValues.email, otp })
    });

    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      Swal.fire("Error", verifyData.message || "Invalid verification code.", "error");
      return;
    }

    // Step 4️⃣: Update password after OTP success
    await updateDoc(userDoc.ref, {
      password: formValues.newPassword,  // ⚠️ Ideally, hash passwords on backend
      updatedAt: serverTimestamp()
    });

    Swal.fire({
      icon: 'success',
      title: 'Password Updated',
      text: 'Your password has been successfully updated.',
      confirmButtonColor: '#f8732b'
    });

  } catch (err) {
    console.error(err);
    Swal.fire('Error', 'Something went wrong.', 'error');
  }
});

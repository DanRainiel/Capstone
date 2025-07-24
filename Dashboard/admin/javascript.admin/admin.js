// ✅ Block access if not logged in
if (!sessionStorage.getItem("isLoggedIn")) {
  location.replace("../../login.html");
}

// ✅ Block back button
window.addEventListener("DOMContentLoaded", () => {
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });

  // Load all appointments for admin
  loadAllAppointments();
});

// ✅ Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Function to load all appointments (no userId filter)
async function loadAllAppointments() {
  const tableBody = document.getElementById("recent-appointments");
  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "Appointment"));

    if (snapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='5'>No appointments found.</td></tr>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ""}</td>
        <td>${data.petName || ""}</td>
        <td>${data.service || ""}</td>
        <td class="status pending">Pending</td>

      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='5'>Error loading appointments.</td></tr>";
  }
}

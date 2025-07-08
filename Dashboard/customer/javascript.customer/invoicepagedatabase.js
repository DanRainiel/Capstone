// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Your Firebase config
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

// ✅ Load and render appointments
async function loadAppointments() {
  const userId = sessionStorage.getItem("userId"); // "owner1", etc.
  const tableBody = document.getElementById("appointments-table-body");
  tableBody.innerHTML = "";

  console.log("Logged-in userId:", userId);
  if (!userId) {
    tableBody.innerHTML = "<tr><td colspan='4'>User not logged in.</td></tr>";
    return;
  }

  try {
    const q = query(collection(db, "Appointment"), where("UID", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='4'>No appointments found.</td></tr>";
    } else {
      querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${data.CustomerName || ""}</td>
    <td>${data.PetName || ""}</td>
    <td>${data.Service || ""}</td>
    <td><button class="btn" onclick="location.href='invoice.html'">View Invoice</button></td>
  `;
  tableBody.appendChild(row);
});

    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='4'>Error loading appointments.</td></tr>";
  }
}

// ✅ Auto-run when page is ready
window.addEventListener("DOMContentLoaded", loadAppointments);

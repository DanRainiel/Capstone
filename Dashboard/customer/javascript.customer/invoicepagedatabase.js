// ✅ Import Firebase functions
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
const db = getFirestore(app); // make sure this exists here!


async function loadAppointments() {
  const userId = sessionStorage.getItem("userId");
  console.log("Loaded userId from sessionStorage:", userId);
  const tableBody = document.getElementById("appointments-table-body");
  tableBody.innerHTML = "";

  if (!userId) {
    tableBody.innerHTML = "<tr><td colspan='6'>User not logged in.</td></tr>";
    return;
  }

  try {
    // ✅ Query all appointments where userId == current userId
    const q = query(collection(db, "Appointment"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
  const data = doc.data();
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.name || ""}</td>
    <td>${data.petName || ""}</td>
    <td>${data.service || ""}</td>
    <td>${data.date || ""}</td>
    <td><button class="btn view-invoice-btn">View Invoice</button></td>
  `;
  tableBody.appendChild(row);

  // ✅ Add SweetAlert loader for "View Invoice" button
  const button = row.querySelector(".view-invoice-btn");
button.addEventListener("click", () => {
  Swal.fire({
    title: "Loading Invoice...",
    html: "Please wait while we load your invoice.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  setTimeout(() => {
    // ✅ redirect with ?id=<doc.id>
    window.location.href = `invoice.html?id=${doc.id}`;
  }, 1500);
});

});

  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading appointments.</td></tr>";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
});

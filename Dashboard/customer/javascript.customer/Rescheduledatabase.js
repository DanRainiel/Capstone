// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
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

// ================== LOAD APPOINTMENTS ==================
async function loadAppointments() {
  const userId = sessionStorage.getItem("userId");
  console.log("Loaded userId from sessionStorage:", userId);

  const tableBody = document.getElementById("reschedule");
  tableBody.innerHTML = "";

  if (!userId) {
    tableBody.innerHTML = "<tr><td colspan='6'>User not logged in.</td></tr>";
    return;
  }

  try {
    const q = query(collection(db, "Appointment"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='6'>No History found.</td></tr>";
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${data.name || ""}</td>
          <td>${data.petName || ""}</td>
          <td>${data.service || ""}</td>
          <td>${data.date || ""}</td>
        `;

        // ✅ Make row clickable
        row.addEventListener("click", () => {
          openDetailsModal(docSnap.id, data);
        });

        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading appointments.</td></tr>";
  }
}

// ================== OPEN MODAL ==================
function openDetailsModal(docId, data) {
  const modal = document.getElementById("detailsModal");
  modal.style.display = "block";

  // Fill modal with data
  document.getElementById("detailName").textContent = data.name || "";
  document.getElementById("detailPet").textContent = data.petName || "";
  document.getElementById("detailService").textContent = data.service || "";
  document.getElementById("detailDate").textContent = data.date || "";

  // store docId in modal
  modal.setAttribute("data-docid", docId);
}

// ================== CLOSE MODAL ==================
function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none";
}

window.addEventListener("click", (e) => {
  const modal = document.getElementById("detailsModal");
  if (e.target === modal) {
    closeDetailsModal();
  }
});

// ================== RESCHEDULE ==================
// ================== RESCHEDULE ==================
async function rescheduleAppointment() {
  const modal = document.getElementById("detailsModal");
  const docId = modal.getAttribute("data-docid");

  if (!docId) {
    alert("No appointment selected.");
    return;
  }

  try {
    const docRef = doc(db, "Appointment", docId);

    // ✅ Update status instead of rescheduling directly
    await updateDoc(docRef, { status: "for-rescheduling" });

    alert("Appointment marked for rescheduling!");
    closeDetailsModal();
    loadAppointments(); // refresh table
  } catch (error) {
    console.error("Error updating appointment:", error);
    alert("Failed to update status.");
  }
}

// ================== EVENT LISTENERS ==================
window.addEventListener("DOMContentLoaded", () => {
  loadAppointments();

  // Hook modal close button
  document.querySelector(".close-btn").addEventListener("click", closeDetailsModal);

  // Hook reschedule button
  document.querySelector(".resched-btn").addEventListener("click", rescheduleAppointment);
});
// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc // ⬅️ FIX: import updateDoc
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

let selectedDocId = null; // ⬅️ FIX: declare global variable

async function loadAppointments() {
  const userId = sessionStorage.getItem("userId");
  const tableBody = document.getElementById("appointments");
  tableBody.innerHTML = "";

  if (!userId) {
    tableBody.innerHTML = "<tr><td colspan='7'>User not logged in.</td></tr>";
    return;
  }

  try {
    const q = query(collection(db, "Appointment"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='7'>No appointments found.</td></tr>";
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const status = (data.status || "pending").toLowerCase(); // ✅ normalize

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.name || ""}</td>
          <td>${data.petName || ""}</td>
          <td>${data.service || ""}</td>
          <td>${data.date || ""}</td>
          <td>${data.number || ""}</td>
          <td class="${status === "cancelled" ? "cancelled" : ""}">
            ${data.status || "Pending"}
          </td>
          <td>
            ${
              status === "pending"
                ? `<button class="btn cancel-btn" data-id="${docSnap.id}">Cancel</button>`
                : `<span class='disabled-text'>--</span>`
            }
          </td>
        `;

        tableBody.appendChild(row);
      });

      // attach listeners for cancel buttons (only pending ones exist now)
      document.querySelectorAll(".cancel-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          selectedDocId = e.target.getAttribute("data-id");
          openCancelModal();
        });
      });
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='7'>Error loading appointments.</td></tr>";
  }
}


// ✅ Modal functions
function openCancelModal() {
  document.getElementById("cancelModal").style.display = "block";
}
function closeCancelModal() {
  document.getElementById("cancelModal").style.display = "none";
  document.getElementById("cancelReason").value = "";
}

// ✅ Confirm cancel with reason
document.getElementById("confirmCancel").addEventListener("click", async () => {
  const reason = document.getElementById("cancelReason").value.trim();
  if (!reason) {
    alert("Please provide a reason before cancelling.");
    return;
  }

  try {
    const docRef = doc(db, "Appointment", selectedDocId);
    await updateDoc(docRef, {
      status: "Cancelled",
      cancelReason: reason
    });

    alert("Appointment cancelled successfully!");
    closeCancelModal();
    loadAppointments();
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    alert("Failed to cancel appointment.");
  }
});

window.closeCancelModal = closeCancelModal;

window.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
});
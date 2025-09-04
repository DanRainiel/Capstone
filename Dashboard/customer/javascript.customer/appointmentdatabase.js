// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,           // ⬅️ add this
  serverTimestamp   // ⬅️ add this
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

  // 🔍 Log admin activity
    export async function logActivity(userId, action, details) {
      try {
        await addDoc(collection(db, "ActivityLog"), {
          userId: userId || "anonymous",
          action,
          details,
          timestamp: serverTimestamp()
        });
        console.log("Activity logged:", action);
      } catch (error) {
        console.error("Failed to log activity:", error);
      }
    }

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
           <td>
            ${
              status === "pending"
                ? `
                  <button class="btn cancel-btn" data-id="${docSnap.id}">Cancel</button>
                  <button class="btn view-balance-btn" data-id="${docSnap.id}">View Balance</button>
                `
                : `<span class="disabled-text">--</span>`
            }
          </td>

          `;

        tableBody.appendChild(row);
      });

      // Attach click handler for "View Balance" button
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".view-balance-btn");
  if (!btn) return;

  const docId = btn.getAttribute("data-id");

  try {
    const docRef = doc(db, "Appointment", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      Swal.fire("Error", "Appointment not found", "error");
      return;
    }

    const data = docSnap.data();

    // Format applied discounts (if any)
    const discounts = data.appliedDiscounts?.length
      ? data.appliedDiscounts.join(", ")
      : "None";

    // Format selected services
    const services = data.selectedServices?.length
      ? data.selectedServices.map(s => `<li>${s}</li>`).join("")
      : "<li>None</li>";

    // Show modal
    Swal.fire({
      title: `<strong>Invoice #${data.invoiceNo}</strong>`,
      html: `
        <div style="text-align:left">
          <p><b>Owner:</b> ${data.name}</p>
          <p><b>Pet:</b> ${data.petName} (${data.petSize})</p>
          <p><b>Vet:</b> ${data.vet}</p>
          <p><b>Date:</b> ${data.date} at ${data.time}</p>
          <p><b>Status:</b> ${data.status}</p>
          <hr>
          <p><b>Service:</b> ${data.service}</p>
          <ul>${services}</ul>
          <p><b>Service Fee:</b> ${data.serviceFee}</p>
          <p><b>Reservation Fee:</b> ${data.reservationFee}</p>
          <p><b>Applied Discounts:</b> ${discounts}</p>
          <hr>
          <p><b>Total Amount:</b> ${data.totalAmount}</p>
          <p><b>Instructions:</b> ${data.instructions || "None"}</p>
        </div>
      `,
      confirmButtonText: "Close",
      width: 600
    });

  } catch (err) {
    console.error(err);
    Swal.fire("Error", "Something went wrong while fetching balance.", "error");
  }
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


document.getElementById("confirmCancel").addEventListener("click", async () => {
  const reason = document.getElementById("cancelReason").value.trim();
  if (!reason) {
    alert("Please provide a reason before cancelling.");
    return;
  }

  try {
    if (!selectedDocId) {
      alert("No appointment selected to cancel.");
      return;
    }

    const docRef = doc(db, "Appointment", selectedDocId);

    // ✅ Fetch appointment so we can log details
    const snap = await getDoc(docRef);
    let apptData = {};
    if (snap.exists()) {
      apptData = snap.data();
    }

    // ✅ Update status + save reason in Firestore
    await updateDoc(docRef, {
      status: "Cancelled",
      cancelReason: reason, // <-- Save the reason here
      cancelledAt: new Date() // optional: timestamp for tracking
    });

    // ✅ Grab userId directly from sessionStorage
    const userId = sessionStorage.getItem("userId") || "anonymous";

    // ✅ Log activity (without showing reason)
    const pet = apptData.petName || "Unknown Pet";
    const service = apptData.service || "Unknown Service";

    await logActivity(
      userId,
      "Cancelled Appointment",
      `Cancelled appointment for ${pet}. (${service}).`
    );

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
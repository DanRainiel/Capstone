import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
  getFirestore, 
  getDocs, 
  collection, 
  doc, 
  updateDoc, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

// 🔹 Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Mark notification as read with Swal confirmation
async function markAsRead(notifId) {
  const result = await Swal.fire({
    title: 'Mark as read?',
    text: "This will mark the notification as read.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, mark as read',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      const notifRef = doc(db, "Notifications", notifId);
      await updateDoc(notifRef, { status: "read" });
      Swal.fire('Marked!', 'Notification has been marked as read.', 'success');
      loadNotifications(); // refresh table
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
      Swal.fire('Error', 'Failed to mark notification as read.', 'error');
    }
  }
}

// ✅ Load notifications
export async function loadNotifications() {
  const notifTable = document.getElementById("notifications");
  notifTable.innerHTML = "";

  const currentUserId = (localStorage.getItem("currentUserId") || "").trim();
  if (!currentUserId) {
    notifTable.innerHTML = `<tr><td colspan="6">⚠️ No logged-in user selected.</td></tr>`;
    return;
  }

  try {
    const notifQuery = query(
      collection(db, "Notifications"),
      where("userId", "==", currentUserId)
    );

    const snapshot = await getDocs(notifQuery);

    let notifs = [];
    if (snapshot.empty) {
      const allSnapshot = await getDocs(collection(db, "Notifications"));
      notifs = allSnapshot.docs.map(doc => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          message: data.message || "",
          service: data.service || "",
          type: data.type || "",
          status: data.status || "unread",
          userId: data.userId || "",
          ts: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      });
    } else {
      notifs = snapshot.docs.map(doc => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          message: data.message || "",
          service: data.service || "",
          type: data.type || "",
          status: data.status || "unread",
          userId: data.userId || "",
          ts: data.createdAt?.toDate ? data.createdAt.toDate() : new Date()
        };
      });
    }

    // Sort newest first
    notifs.sort((a, b) => b.ts - a.ts);

    // Render table
    if (notifs.length === 0) {
      notifTable.innerHTML = `<tr><td colspan="6">No notifications found.</td></tr>`;
      return;
    }

    notifs.forEach(n => {
      const row = `
        <tr>
          <td>${n.type}</td>
          <td>${n.service}</td>
          <td>${n.message}</td>
          <td>${n.status}</td>
          <td>${n.ts.toLocaleString()}</td>
          <td>
            ${n.status === "unread"   
              ? `<button class="mark-read" data-id="${n.id}">Mark as Read</button>` 
              : ""}
          </td>
        </tr>
      `;
      notifTable.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("❌ Error loading notifications:", err);
    notifTable.innerHTML = `<tr><td colspan="6">Error loading notifications.</td></tr>`;
  }
}

// 🔹 Attach event delegation for buttons
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("mark-read")) {
    markAsRead(e.target.getAttribute("data-id"));
  }
});

window.loadNotifications = loadNotifications;
document.addEventListener("DOMContentLoaded", loadNotifications);

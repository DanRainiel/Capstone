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
  storageBucket: "fir-demo-66ae2.appspot.com", // ✅ Fix the domain typo here
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};


// 🔹 Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Mark notification as read
async function markAsRead(notifId) {
  try {
    const notifRef = doc(db, "Notifications", notifId);
    await updateDoc(notifRef, { status: "read" });
    console.log("✅ Notification marked as read:", notifId);
    loadNotifications(); // refresh
  } catch (err) {
    console.error("❌ Error marking notification as read:", err);
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

  console.log("🔍 Current User ID (from localStorage):", `"${currentUserId}"`);

  try {
    // 🔹 Query notifications for this user
    const notifQuery = query(
      collection(db, "Notifications"),
      where("userId", "==", currentUserId)
    );

    const snapshot = await getDocs(notifQuery);

    // 🔹 Debug: log all notifications
    const allSnapshot = await getDocs(collection(db, "Notifications"));
    allSnapshot.forEach(d => {
      const data = d.data();
      console.log("📌 Notification doc:", d.id, "userId:", `"${data.userId}"`);
    });

    // 🔹 If query returned nothing, fallback to show all (debug)
    let notifs = [];
    if (snapshot.empty) {
      console.warn("⚠️ No notifications matched this userId. Showing all for debug.");
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

    // 🔹 Sort newest first
    notifs.sort((a, b) => b.ts - a.ts);

    // 🔹 Render table
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

    // 🔹 Attach button listeners
    document.querySelectorAll(".mark-read").forEach(btn => {
      btn.addEventListener("click", () => markAsRead(btn.getAttribute("data-id")));
    });

  } catch (err) {
    console.error("❌ Error loading notifications:", err);
    notifTable.innerHTML = `<tr><td colspan="6">Error loading notifications.</td></tr>`;
  }
}
window.loadNotifications = loadNotifications;
document.addEventListener("DOMContentLoaded", loadNotifications);

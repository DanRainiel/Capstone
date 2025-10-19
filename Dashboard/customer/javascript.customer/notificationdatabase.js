// ================================
// 📦 IMPORT FIREBASE CONFIG
// ================================
import { db } from "../../db_config.js"; // adjust path as needed
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ================================
// 🧠 INITIAL SETUP
// ================================
const currentUserId =
  sessionStorage.getItem("currentUserId") ||
  sessionStorage.getItem("userId") ||
  localStorage.getItem("currentUserId");

const currentUserRole =
  sessionStorage.getItem("role") || localStorage.getItem("role");

const notifList = document.getElementById("notification-list"); // UL or DIV to display notifs
const notifCount = document.getElementById("notification-count"); // optional badge counter

if (!notifList) {
  console.error("❌ Notification list element not found in DOM!");
}

// ================================
// 🔔 LOAD NOTIFICATIONS
// ================================
function loadNotifications() {
  if (!currentUserId || !currentUserRole) {
    console.warn("⚠️ No user logged in — notifications not initialized.");
    return;
  }

  const notifRef = collection(db, "Notifications");

  // ✅ Admins see all notifications
  // ✅ Staff & Customers see only theirs
  const notifQuery =
    currentUserRole.toLowerCase() === "admin"
      ? query(notifRef, orderBy("timestamp", "desc"))
      : query(
          notifRef,
          where("userId", "==", currentUserId),
          orderBy("timestamp", "desc")
        );

  // Real-time listener
  onSnapshot(
    notifQuery,
    (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Clear list
      notifList.innerHTML = "";

      if (notifications.length === 0) {
        notifList.innerHTML = `<li class="text-gray-500 text-center py-2">No notifications yet.</li>`;
        if (notifCount) notifCount.textContent = "0";
        return;
      }

      // Populate list
      notifications.forEach((notif) => {
        const li = document.createElement("li");
        li.classList.add("notif-item");
        li.innerHTML = `
          <div class="notif-card">
            <p class="notif-title"><strong>${notif.title || "Notification"}</strong></p>
            <p class="notif-msg">${notif.message || ""}</p>
            <p class="notif-time">${formatTimestamp(notif.timestamp)}</p>
          </div>
        `;
        notifList.appendChild(li);
      });

      // 🔸 Update counter badge
      if (notifCount) notifCount.textContent = notifications.length;
    },
    (error) => {
      console.error("Error fetching notifications:", error);
    }
  );
}

// ================================
// ⏰ FORMAT TIMESTAMP
// ================================
function formatTimestamp(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ================================
// 🚀 INIT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  loadNotifications();
});

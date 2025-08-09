import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

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

// 📅 Load appointments into two tables
async function loadAllAppointments() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");

  if (dashboardTable) dashboardTable.innerHTML = "";
  if (appointmentTable) appointmentTable.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "Appointment"));

    if (snapshot.empty) {
      const emptyRow = "<tr><td colspan='8'>No appointments found.</td></tr>";
      if (dashboardTable) dashboardTable.innerHTML = emptyRow;
      if (appointmentTable) appointmentTable.innerHTML = emptyRow;
      await logActivity("admin", "Load Appointments", "No appointments found.");
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const status = data.status || "Pending";

      // 🎯 Table 1: Simple dashboard summary
      if (dashboardTable) {
        const dashRow = document.createElement("tr");
        dashRow.innerHTML = `
          <td>${data.name || ""}</td>
          <td>${data.petName || ""}</td>
          <td>${data.service || ""}</td>
          <td>${data.time || ""}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
        `;
        dashboardTable.appendChild(dashRow);
      }

      // 🎯 Table 2: Full appointment table with actions
      if (appointmentTable) {
        let actionButtons = "";

        if (status === "Pending") {
          actionButtons = `
            <button class="btn accept">Accept</button>
            <button class="btn decline">Decline</button>
            <button class="btn reschedule">Reschedule</button>
            <button class="btn screenshot">View Screenshot</button>
          `;
        } else if (status === "In Progress") {
          actionButtons = `<button class="btn complete">Complete</button>`;
        } else if (status === "Completed") {
          actionButtons = `
            <button class="btn view">View</button>
            <button class="btn edit">Edit</button>
          `;
        }

        const fullRow = document.createElement("tr");
        fullRow.innerHTML = `
          <td>${data.date || ""}</td>
          <td>${data.time || ""}</td>
          <td>${data.name || ""}</td>
          <td>${data.contact || ""}</td>
          <td>${data.petName || ""}</td>
          <td>${data.service || ""}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
          <td>${actionButtons}</td>
        `;
        appointmentTable.appendChild(fullRow);
      }
    });

    await logActivity("admin", "Load Appointments", `${snapshot.size} appointments loaded.`);
  } catch (error) {
    console.error("Error loading appointments:", error);
    const errorRow = "<tr><td colspan='8'>Error loading appointments.</td></tr>";
    if (dashboardTable) dashboardTable.innerHTML = errorRow;
    if (appointmentTable) appointmentTable.innerHTML = errorRow;
    await logActivity("admin", "Load Appointments Error", error.message);
  }
}

// 👥 Load all users
async function loadAllUsers() {
  const userTable = document.getElementById("userTable");
  userTable.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "users"));

    if (snapshot.empty) {
      userTable.innerHTML = "<tr><td colspan='8'>No users found.</td></tr>";
      return;
    }

    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      const name = userData.name || "";
      const email = userData.email || "";
      const contact = userData.contact || "";
      const joinedDate = userData.joinedDate || "";
      const status = userData.status || "Active";

      // Count pets
      const petSnapshot = await getDocs(
        query(collection(db, "Pets"), where("userId", "==", userId))
      );
      const petCount = petSnapshot.size;

      // Action buttons
      let actions = `
        <button class="btn view" data-id="${userId}">View</button>
        <button class="btn edit" data-id="${userId}">Edit</button>
      `;
      actions += status === "Active"
        ? `<button class="btn deactivate" data-id="${userId}">Deactivate</button>`
        : `<button class="btn activate" data-id="${userId}">Activate</button>`;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${userId}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${contact}</td>
        <td>${petCount}</td>
        <td>${joinedDate}</td>
        <td class="status">${status}</td>
        <td>${actions}</td>
      `;
      userTable.appendChild(row);
    }

    attachUserStatusListeners();
  } catch (error) {
    console.error("Error loading users:", error);
    userTable.innerHTML = "<tr><td colspan='8'>Error loading users.</td></tr>";
  }
}

// 🔄 Update user status
async function updateUserStatus(userId, newStatus) {
  try {
    await updateDoc(doc(db, "users", userId), {
      status: newStatus
    });
    await logActivity("admin", `User ${newStatus}`, `User ${userId} set to ${newStatus}`);
    loadAllUsers();
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}

// 🧩 Bind buttons after rendering
function attachUserStatusListeners() {
  document.querySelectorAll(".btn.deactivate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Inactive"))
  );
  document.querySelectorAll(".btn.activate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Active"))
  );
}

// 🕓 Load recent activities
async function loadRecentActivity() {
  const activityContainer = document.querySelector(".recent-activity");

  try {
    const q = query(
      collection(db, "ActivityLog"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      let iconClass = "";
      let title = data.action || "Activity";

      switch (data.action) {
        case "Registered":
          iconClass = "fa-user-plus";
          break;
        case "Appointment Completed":
          iconClass = "fa-calendar-check";
          break;
        case "Payment Received":
          iconClass = "fa-money-bill";
          break;
        default:
          iconClass = "fa-info-circle";
      }

      const timeAgo = data.timestamp?.toDate
        ? timeSince(data.timestamp.toDate())
        : "just now";

      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";
      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="activity-content">
          <h4>${title}</h4>
          <p>${data.details || ""} - ${timeAgo}</p>
        </div>
      `;

      activityContainer.appendChild(activityItem);
    });
  } catch (error) {
    console.error("Failed to load activity logs:", error);
  }
}

// ⏱️ Utility: time ago format
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) return `${count} ${i.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// 🚀 Initialize on page load
loadRecentActivity();
loadAllAppointments();
loadAllUsers();
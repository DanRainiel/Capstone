
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    getDoc,        
    doc,
    setDoc,
   addDoc,
  serverTimestamp,
  orderBy,
  limit,
  onSnapshot

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


// 🔍 Log user/admin activity to Firestore
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




  async function loadAllAppointments() {
  const tableBody = document.getElementById("table-dashboard");
  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "Appointment"));

    if (snapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='5'>No appointments found.</td></tr>";
      await logActivity("admin", "Load Appointments", "No appointments found.");
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ""}</td>
        <td>${data.petName || ""}</td>
        <td>${data.service || ""}</td>
        <td>${data.time || ""}</td>
        <td class="status pending">Pending</td>
      `;
      tableBody.appendChild(row);
    });

    await logActivity("admin", "Load Appointments", `${snapshot.size} appointments loaded.`);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='5'>Error loading appointments.</td></tr>";
    await logActivity("admin", "Load Appointments Error", error.message);
  }
}


 async function loadRecentActivity() {
  const activityContainer = document.querySelector('.recent-activity');

  try {
    const q = query(
      collection(db, "ActivityLog"),
      orderBy("timestamp", "desc"),
      limit(5) // Show last 5 activities
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();

      let iconClass = '';
      let title = data.action || "Activity";

      // Choose icon based on action
      switch (data.action) {
        case 'Registered':
          iconClass = 'fa-user-plus';
          break;
        case 'Appointment Completed':
          iconClass = 'fa-calendar-check';
          break;
        case 'Payment Received':
          iconClass = 'fa-money-bill';
          break;
        default:
          iconClass = 'fa-info-circle';
      }

      const timeAgo = data.timestamp?.toDate
        ? timeSince(data.timestamp.toDate())
        : "just now";

      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="activity-content">
          <h4>${title}</h4>
          <p>${data.details || ''} - ${timeAgo}</p>
        </div>
      `;

      activityContainer.appendChild(activityItem);
    });

  } catch (error) {
    console.error("Failed to load activity logs:", error);
  }
}

function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) {
      return `${count} ${i.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return "just now";
}

  loadRecentActivity();


  loadAllAppointments();



    
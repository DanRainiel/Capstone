
if (!sessionStorage.getItem("isLoggedIn")) {
  location.replace("../../login.html");
}


window.addEventListener("DOMContentLoaded", () => {
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });


  loadAllAppointments();
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,         // ✅ ← ADD THIS LINE
  doc,
  setDoc
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


async function loadAllAppointments() {
  const tableBody = document.getElementById("recent-appointments");
  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "Appointment"));

    if (snapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='5'>No appointments found.</td></tr>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ""}</td>
        <td>${data.petName || ""}</td>
        <td>${data.service || ""}</td>
        <td class="status pending">Pending</td>

      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='5'>Error loading appointments.</td></tr>";
  }
}


// Load recent customers who made appointments
async function loadRecentCustomers() {
  const table = document.getElementById("recentCustomersTable");
  if (!table) return;
  table.innerHTML = "";

  try {
    const appointmentsSnapshot = await getDocs(collection(db, "Appointment"));
    const userIdsSet = new Set();

    appointmentsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userId) {
        userIdsSet.add(data.userId);
      }
    });

    for (const userId of userIdsSet) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td width="60px">
            <div class="imgBx">
              <i class="fa-solid fa-user profile-icon"></i>
            </div>
          </td>
          <td>
            <h4>${userData.name || "Unknown"}<br> <span>Philippines</span></h4>
          </td>
        `;
        table.insertBefore(row, table.firstChild);


      }
      
    }
  } catch (error) {
    console.error("Error loading recent customers:", error);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  loadRecentCustomers(); 
});


document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation"); 
  const main = document.querySelector(".main"); 

  if (toggle && navigation && main) {
    toggle.addEventListener("click", () => {
      navigation.classList.toggle("active");
      main.classList.toggle("active");
    });
  }
});

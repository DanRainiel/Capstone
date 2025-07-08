// Import needed Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to load appointments
async function loadAppointments() {
  const tableBody = document.getElementById("appointments-table-body");
  tableBody.innerHTML = ""; // clear existing rows

  try {
    const querySnapshot = await getDocs(collection(db, "appointments"));

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.customerName || ""}</td>
        <td>${data.petName || ""}</td>
        <td>${data.service || ""}</td>
        <td>${data.date || ""}</td>
        <td>${data.status || ""}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
  }
}



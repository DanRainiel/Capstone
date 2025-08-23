// ✅ Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Get appointment ID from URL
const urlParams = new URLSearchParams(window.location.search);
const appointmentId = urlParams.get("id");

if (!appointmentId) {
  alert("No appointment ID provided!");
  throw new Error("Missing appointment ID");
}

const docRef = doc(db, "Appointment", appointmentId);

// ✅ Function to generate random invoice number
function generateInvoiceNumber() {
  const prefix = "INV";
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `${prefix}-${randomNum}`;
}

async function loadInvoice() {
  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      alert("Invoice not found!");
      return;
    }

    const data = docSnap.data();
    console.log("📌 Appointment data:", data);

    // ✅ Invoice Date
    document.getElementById("invoiceDate").textContent = new Date().toLocaleDateString();

    // ✅ Permanent Invoice Number
    let invoiceNumber;
    if (data.invoiceNo) {
      // Already stored → use it
      invoiceNumber = data.invoiceNo;
    } else {
      // Not yet stored → generate and save to Firestore
      invoiceNumber = generateInvoiceNumber();
      await updateDoc(docRef, { invoiceNo: invoiceNumber });
    }
    document.getElementById("invoiceNo").textContent = invoiceNumber;

    // ✅ Owner & pet info
    document.getElementById("ownerName").textContent = data.name || "-";
    document.getElementById("ownerNumber").textContent = data.number || data.ownerNumber || "-";
    document.getElementById("petName").textContent = data.petName || "-";
    document.getElementById("petSize").textContent = data.petSize || "-";

    // ✅ Appointment date & time
    document.getElementById("appointmentDate").textContent = data.date || data.appointmentDate || "-";
    document.getElementById("appointmentTime").textContent =
      data.appointmentTime || data.timeSlot || data.time || "-";

    // ✅ Service type and fee
    const serviceType = data.service || "-";
    const serviceFee = parseFloat((data.serviceFee || "0").toString().replace("₱", "").trim()) || 0;

    document.getElementById("service").textContent = serviceType;
    document.getElementById("serviceFee").textContent = `₱${serviceFee.toFixed(2)}`;

    // ✅ Reservation fee
    const reservationFee = parseFloat((data.reservationFee || "0").toString().replace("₱", "").trim());
    document.getElementById("reservationFee").textContent = `₱${reservationFee.toFixed(2)}`;

    // ✅ Discount
    const discount = parseFloat(data.discount || 0);
    document.getElementById("discount").textContent = discount > 0 ? `${discount}%` : "0%";

    // ✅ Total
    let total = 0;
    if (data.totalAmount !== undefined) {
      total = parseFloat((data.totalAmount || "0").toString().replace("₱", "").trim()) || 0;
    } else {
      total = (serviceFee + reservationFee) - ((serviceFee + reservationFee) * (discount / 100));
    }
    document.getElementById("totalFee").textContent = `₱${total.toFixed(2)}`;

    // ✅ Downpayment
    let downpayment = 0;
    if (data.paymentType && data.paymentType.toLowerCase() === "downpayment") {
      downpayment = data.downpaymentAmount
        ? parseFloat((data.downpaymentAmount).toString().replace("₱", "").trim())
        : total * 0.30;
    }

    const downEl = document.getElementById("downpayment");
    if (downEl) {
      downEl.textContent = `₱${downpayment.toFixed(2)}`;
    }

  } catch (error) {
    console.error("❌ Error loading invoice:", error);
    alert("Failed to load invoice data.");
  }
}

loadInvoice();

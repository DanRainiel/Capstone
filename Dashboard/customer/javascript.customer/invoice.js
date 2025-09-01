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

    // ✅ Invoice Date (from completedAt in Firestore)
    if (data.completedAt?.toDate) {
      document.getElementById("invoiceDate").textContent =
        data.completedAt.toDate().toLocaleDateString();
    } else {
      document.getElementById("invoiceDate").textContent = "-";
    }

    // ✅ Permanent Invoice Number
    let invoiceNumber;
    if (data.invoiceNo) {
      invoiceNumber = data.invoiceNo;
    } else {
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

  

    // ✅ Invoice Date → from completedAt in Firestore
// ✅ Invoice Date → from Firestore completedAt
const invoiceDateEl = document.getElementById("invoiceDate");
if (invoiceDateEl) {
  if (data.completedAt && data.completedAt.toDate) {
    invoiceDateEl.textContent = data.completedAt.toDate().toLocaleDateString();
  } else {
    invoiceDateEl.textContent = new Date().toLocaleDateString();
  }
}


// ✅ Handle Discounts
const discountContainer = document.getElementById("discountContainer");
const discountEl = document.getElementById("discount"); // still keep for total %

let totalDiscount = 0;

if (Array.isArray(data.appliedDiscounts) && data.appliedDiscounts.length > 0) {
  discountContainer.innerHTML = ""; // clear first

  data.appliedDiscounts.forEach(discount => {
    const match = discount.match(/(\d+)%/);
    if (match) totalDiscount += parseFloat(match[1]);

    const p = document.createElement("p");
    p.textContent = discount; // e.g. "PWD: 15%"
    discountContainer.appendChild(p);
  });

  if (discountEl) discountEl.textContent = `${totalDiscount}%`;
} else {
  if (discountEl) discountEl.textContent = "0%";
  if (discountContainer) discountContainer.innerHTML = "<p>No discounts</p>";
}


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

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

    // --- Invoice Number ---
    let invoiceNumber = data.invoiceNo || generateInvoiceNumber();
    if (!data.invoiceNo) await updateDoc(docRef, { invoiceNo: invoiceNumber });
    const invoiceNoEl = document.getElementById("invoiceNo");
    if (invoiceNoEl) invoiceNoEl.textContent = invoiceNumber;

    // --- Invoice Date ---
    const invoiceDateEl = document.getElementById("invoiceDate");
    if (invoiceDateEl) {
      invoiceDateEl.textContent = data.completedAt?.toDate
        ? data.completedAt.toDate().toLocaleDateString()
        : new Date().toLocaleDateString();
    }

    // --- Owner & Pet Info ---
    const ownerNameEl = document.getElementById("ownerName");
    if (ownerNameEl) ownerNameEl.textContent = data.name || "-";

    const ownerNumberEl = document.getElementById("ownerNumber");
    if (ownerNumberEl) ownerNumberEl.textContent = data.number || data.ownerNumber || "-";

    const petNameEl = document.getElementById("petName");
    if (petNameEl) petNameEl.textContent = data.petName || "-";

    const petSizeEl = document.getElementById("petSize");
    if (petSizeEl) petSizeEl.textContent = data.petSize || "-";

    // --- Appointment Date & Time ---
    const appointmentDateEl = document.getElementById("appointmentDate");
    if (appointmentDateEl) appointmentDateEl.textContent = data.date || data.appointmentDate || "-";

    const appointmentTimeEl = document.getElementById("appointmentTime");
    if (appointmentTimeEl) appointmentTimeEl.textContent = data.appointmentTime || data.timeSlot || data.time || "-";

    // --- Service Fee ---
    const serviceType = data.service || "-";
    const serviceFee = parseFloat((data.serviceFee || "0").toString().replace("₱", "").trim()) || 0;

    const serviceEl = document.getElementById("service");
    if (serviceEl) serviceEl.textContent = serviceType;

    const serviceFeeEl = document.getElementById("serviceFee");
    if (serviceFeeEl) serviceFeeEl.textContent = `₱${serviceFee.toFixed(2)}`;

// --- Discounts (display only, no calculation) ---
const discountContainer = document.getElementById("discountContainer");
const discountEl = document.getElementById("discount");
let totalDiscount = 0; // still define to match previous logic, but we won't use it

if (Array.isArray(data.appliedDiscounts) && data.appliedDiscounts.length > 0) {
  if (discountContainer) discountContainer.innerHTML = ""; // clear container
  data.appliedDiscounts.forEach(d => {
    // Extract percentage for display (optional)
    const match = d.match(/(\d+)%/);
    if (match) totalDiscount += parseFloat(match[1]); // just for display, won't apply

    if (discountContainer) {
      const p = document.createElement("p");
      p.textContent = d; // show the discount text
      discountContainer.appendChild(p);
    }
  });
  if (discountEl) discountEl.textContent = `${totalDiscount}%`; // display sum of percentages
} else {
  if (discountContainer) discountContainer.innerHTML = "<p>No discounts</p>";
  if (discountEl) discountEl.textContent = "-";
}

// --- Total Amount (from Firestore, no discount applied) ---
let totalAmount = parseFloat(
  (data.totalAmount || "0").toString().replace("₱", "").trim()
) || 0;

const totalFeeEl = document.getElementById("totalFee");
if (totalFeeEl) totalFeeEl.textContent = `₱${totalAmount.toFixed(2)}`;

// --- Reservation Fee / Downpayment (display only) ---
const reservationFee = parseFloat(
  (data.reservationFee || "0").toString().replace("₱", "").trim()
) || 0;
const reservationFeeEl = document.getElementById("reservationFee");
if (reservationFeeEl) reservationFeeEl.textContent = `₱${reservationFee.toFixed(2)}`;

const downEl = document.getElementById("downpayment");
if (downEl) downEl.textContent = `₱0.00`; // no calculation




  } catch (error) {
    console.error("❌ Error loading invoice:", error);
    alert("Failed to load invoice data.");
  }
}

loadInvoice();


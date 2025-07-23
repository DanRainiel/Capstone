import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",  
  messagingSenderId: "505962707376",    
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let baseServiceFee = 0; // Store base fee

document.addEventListener("DOMContentLoaded", async () => {
    const appointmentId = sessionStorage.getItem("selectedAppointmentId");

    if (!appointmentId) {
        console.error("No appointment ID found.");
        return;
    }

    try {
        const docRef = doc(db, "Appointment", appointmentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Update general info
            document.getElementById("pet-name").textContent = data.petName || "";
            document.getElementById("pet-size").value = data.petSize || "small";
            document.getElementById("owner-name").textContent = data.name || "";
            document.getElementById("appt-date").textContent = data.date || "";
            document.getElementById("appt-time").textContent = data.time || "";
            document.getElementById("main-service").textContent = data.service || "";
            document.getElementById("veterinarian").textContent = "Dr. Donna Doll Diones";
            document.getElementById("special-instructions").textContent = "Please bring any recent medical records";

            // Display billing fields
            const serviceFee = parseFloat(data.serviceFee) || 0;
            const bloodWork = parseFloat(data.bloodWork) || 0;
            const medication = parseFloat(data.medication) || 0;
            baseServiceFee = serviceFee;

            document.getElementById("service-fee").textContent = `₱${serviceFee.toFixed(2)}`;
            document.getElementById("blood-work").textContent = `₱${bloodWork.toFixed(2)}`;
            document.getElementById("medication").textContent = `₱${medication.toFixed(2)}`;
            document.getElementById("reservation-fee").textContent = `₱0.00`;

            // Selected services
            if (Array.isArray(data.selectedServices)) {
                const list = document.getElementById("selected-services-list");
                list.innerHTML = "";
                data.selectedServices.forEach(service => {
                    const p = document.createElement("p");
                    p.textContent = `• ${service}`;
                    list.appendChild(p);
                });
            }

            // Vaccinations
            if (Array.isArray(data.vaccines)) {
                data.vaccines.forEach(v => {
                    const id = v.toLowerCase().replace(/\s+/g, '-') + "-vax";
                    const checkbox = document.getElementById(id);
                    if (checkbox) checkbox.checked = true;
                });
            }

            // Initial total calculation
            updateTotalAmount();
        } else {
            console.warn("Appointment not found in Firestore.");
        }
    } catch (error) {
        console.error("Error retrieving appointment:", error);
    }

    // Dropdown change listener
    const feeTypeDropdown = document.getElementById("Reservation-fee-type");
    if (feeTypeDropdown) {
        feeTypeDropdown.addEventListener("change", updateTotalAmount);
    }

    function updateTotalAmount() {
        const type = document.getElementById("Reservation-fee-type")?.value;
        let finalAmount = 0;

        if (type === "only") {
            finalAmount = baseServiceFee * 0.10;
        } else if (type === "with-downpayment") {
            finalAmount = baseServiceFee;
        }

        document.getElementById("total-amount").textContent = `₱${finalAmount.toFixed(2)}`;
        document.getElementById("reservation-fee").textContent = type === "only"
            ? `₱${(baseServiceFee * 0.10).toFixed(2)}`
            : `₱0.00`;
    }

    // Modal and receipt
    const confirmBtn = document.getElementById('confirm-btn');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('clase-modal');
    const receiptUpload = document.getElementById('receipt-upload');
    const bookBtn = document.getElementById('book-btn');

    if (confirmBtn && modal) {
        confirmBtn.onclick = () => modal.style.display = "block";
    }

    if (closeModal && modal) {
        closeModal.onclick = () => modal.style.display = "none";
    }

    window.onclick = event => {
        if (modal && event.target == modal) {
            modal.style.display = "none";
        }
    };

    if (receiptUpload && bookBtn) {
        receiptUpload.onchange = () => {
            if (receiptUpload.files.length > 0) {
                bookBtn.disabled = false;
                bookBtn.classList.add('enabled');
            } else {
                bookBtn.disabled = true;
                bookBtn.classList.remove('enabled');
            }
        };
    }
});

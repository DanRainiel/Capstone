import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    doc,
    addDoc,
    setDoc,
    serverTimestamp,
    collection,
    getDocs
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

let services = {}; // store services from Firestore
let baseServiceFee = 0;

// 🔸 Log Activity to Firestore
async function logActivity(userId, action, details) {
  try {
    await addDoc(collection(db, "ActivityLog"), {
      userId: userId || "anonymous",
      action,
      details,
      timestamp: serverTimestamp()
    });
    console.log("Activity logged:", action);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

// 🔹 Load services from Firestore
async function loadServicesFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "Services"));
    services = {};
    querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        services[data.name.toLowerCase()] = data.variants;
    });
    console.log("Services loaded:", services);
}

function populateServiceOptions() {
    Object.keys(services).forEach(category => {
        const categoryDiv = document.querySelector(`.service-options[data-service="${category}"]`);
        if (!categoryDiv) return;

        const optionsList = categoryDiv.querySelector(".options-list");
        if (!optionsList) {
            console.warn(`No .options-list found for ${category}`);
            return;
        }
        optionsList.innerHTML = ""; // clear any old options

        const variants = services[category]; // e.g., { basic: {small: 450, medium: 600, large: 800} }

        Object.keys(variants).forEach(variantKey => {
            const variant = variants[variantKey];
            if (typeof variant === "object") {
                Object.keys(variant).forEach(size => {
                    const price = variant[size];
                    const label = document.createElement("label");
                    label.innerHTML = `
                        <input type="checkbox" name="services" 
                               data-service="${category}-${variantKey}-${size}">
                        ${variantKey} (${size}): ₱${price}
                    `;
                    optionsList.appendChild(label);
                    optionsList.appendChild(document.createElement("br"));
                });
            } else {
                // flat price service
                const label = document.createElement("label");
                label.innerHTML = `
                    <input type="checkbox" name="services" 
                           data-service="${category}-${variantKey}">
                    ${variantKey}: ₱${variant}
                `;
                optionsList.appendChild(label);
                optionsList.appendChild(document.createElement("br"));
            }
        });
    });
}

// ==========================
// MAIN DOMContentLoaded
// ==========================
document.addEventListener("DOMContentLoaded", async () => {
    // 1️⃣ Load services first
    try {
        await loadServicesFromFirestore();
        populateServiceOptions();
    } catch (err) {
        console.error("Failed to load services:", err);
        alert("Failed to load service data. Please refresh the page.");
        return;
    }

    // 2️⃣ Load appointment data
    const appointmentData = JSON.parse(sessionStorage.getItem("appointment"));
    if (!appointmentData) {
        alert("No appointment data found.");
        window.location.href = "customer.html";
        return;
    }

    // 3️⃣ Cancel button
    const cancelBtn = document.getElementById("cancel-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            sessionStorage.removeItem("appointment");
            window.location.href = "customer.html";
        });
    }

    // 4️⃣ Display appointment details
    try {
        document.getElementById("pet-name").textContent = appointmentData.petName || "";
        document.getElementById("appt-size").value = appointmentData.petSize || "";
        document.getElementById("owner-name").textContent = appointmentData.name || "";
        document.getElementById("appt-date").textContent = appointmentData.date || "";
        document.getElementById("appt-time").textContent = appointmentData.time || "";
        document.getElementById("main-service").textContent = appointmentData.service || "";
        document.getElementById("veterinarian").textContent = "Dr. Donna Doll Diones";
        document.getElementById("special-instructions").textContent = "Please bring any recent medical records";

        // Hide all service options first
        const allServiceOptions = document.querySelectorAll('.service-options');
        allServiceOptions.forEach(div => div.style.display = 'none');

        const selectedService = appointmentData.service.toLowerCase();
        const petSize = (appointmentData.petSize || "").toLowerCase();

        const matchingGroup = document.querySelector(`.service-options[data-service="${selectedService}"]`);
        if (matchingGroup) {
            matchingGroup.style.display = 'block';
            const serviceCheckboxes = matchingGroup.querySelectorAll('input[name="services"]');
            serviceCheckboxes.forEach(cb => {
                const label = cb.getAttribute("data-service")?.toLowerCase() || "";
                const parts = label.split("-");
                const sizeFromLabel = parts[2];
                if (sizeFromLabel) {
                    cb.parentElement.style.display = sizeFromLabel === petSize ? "block" : "none";
                } else {
                    cb.parentElement.style.display = "block";
                }
            });
        }

        // Default billing
        const serviceFeeDisplay = document.getElementById("service-fee");
        const totalAmountDisplay = document.getElementById("total-amount");
        const selectedServicesList = document.getElementById("selected-services-list");
        const petSizeSelect = document.getElementById("appt-size");
        serviceFeeDisplay.textContent = `₱0.00`;
        document.getElementById("reservation-fee").textContent = `₱0.00`;
        totalAmountDisplay.textContent = `₱0.00`;
        baseServiceFee = 0;

  function calculateServiceTotal() {
    const checkboxes = document.querySelectorAll('input[name="services"]:checked');
    const selectedSize = petSizeSelect.value.toLowerCase();
    const petSpecies = (appointmentData.petSpecies || "").toLowerCase();
    let total = 0;
    selectedServicesList.innerHTML = "";

    checkboxes.forEach(checkbox => {
        const label = checkbox.getAttribute("data-service");
        if (!label) return;

        const parts = label.split("-");
        const category = parts[0].toLowerCase();
        const variant = parts[1];
        const sizeFromLabel = parts[2];

        let price = 0;
        const categoryData = services[category];

        if (categoryData) {
            const variantData = categoryData[variant];

            if (variantData) {
                if (typeof variantData === "object") {
                    // Check if key matches species or size, else pick the first numeric value
                    const key = sizeFromLabel || (petSpecies in variantData ? petSpecies : selectedSize);
                    price = variantData[key] ?? Object.values(variantData).find(v => typeof v === "number") ?? 0;
                } else if (typeof variantData === "number") {
                    price = variantData;
                }
            }
        }

        total += price;

        const displaySize = sizeFromLabel || (typeof variantData === "object" ? (petSpecies in variantData ? petSpecies : selectedSize) : "");
        const item = document.createElement("p");
        item.textContent = displaySize ? `${variant} (${displaySize}): ₱${price.toFixed(2)}` : `${variant}: ₱${price.toFixed(2)}`;
        selectedServicesList.appendChild(item);
    });

    baseServiceFee = total;
    serviceFeeDisplay.textContent = `₱${total.toFixed(2)}`;
    updateTotalAmount();
}




        document.querySelectorAll('input[name="services"]').forEach(cb => cb.addEventListener("change", calculateServiceTotal));
        petSizeSelect.addEventListener("change", calculateServiceTotal);

        if (Array.isArray(appointmentData.selectedServices)) {
            appointmentData.selectedServices.forEach(service => {
                const id = service.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/\//g, '-') + '-cb';
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Initial total
        calculateServiceTotal();

        // Dropdown change
        const feeTypeDropdown = document.getElementById("Reservation-fee-type");
        if (feeTypeDropdown) feeTypeDropdown.addEventListener("change", updateTotalAmount);

    } catch (err) {
        console.error("Error processing appointment data:", err);
    }

    // -----------------------
    // Update total amount function
    function updateTotalAmount() {
        if (baseServiceFee <= 0) {
            document.getElementById("reservation-fee").textContent = `₱0.00`;
            document.getElementById("total-amount").textContent = `₱0.00`;
            return;
        }

        const type = document.getElementById("Reservation-fee-type")?.value;
        let reservationFee = 0;
        let grandTotal = baseServiceFee;

        if (type === "reservation-only") {
            reservationFee = 40;
            grandTotal -= reservationFee;
        } else if (type === "with-downpayment") {
            reservationFee = baseServiceFee / 2;
            grandTotal -= reservationFee;
        } else if (type === "with-full-payment") {
            reservationFee = 0;
        }

        document.getElementById("reservation-fee").textContent = `₱${reservationFee.toFixed(2)}`;
        document.getElementById("total-amount").textContent = `₱${grandTotal.toFixed(2)}`;
    }



});


//Confirm Button//
document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById('confirm-btn');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('clase-modal');
    const receiptUpload = document.getElementById('receipt-upload');
    const bookBtn = document.getElementById('book-btn');

    if (confirmBtn && modal) {
        confirmBtn.addEventListener('click', () => {
            modal.style.display = "block";
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

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
bookBtn.addEventListener("click", async () => {
    // Step 1: Show warning Swal first
    const result = await Swal.fire({
        title: "⚠ Warning!",
        icon: "warning",
        html: `
            Your appointment will <strong>automatically be forfeited</strong>
            if the submitted GCash receipt is not verified.
            <br><br>
            Do you want to proceed?
        `,
        showCancelButton: true,
        confirmButtonText: "Yes, proceed",
        cancelButtonText: "Cancel",
        reverseButtons: true
    });

    if (!result.isConfirmed) return; // Stop if user cancels

    try {
        // Step 2: Gather all form data
let petName = document.getElementById("pet-name")?.textContent.trim() || "";

// 🧹 Clean up composite pet ID if it includes user or timestamp
if (petName.includes("_")) {
  // e.g. owner40_Asta_2025-10-03T06-00-39-795Z → Asta
  const parts = petName.split("_");
  petName = parts.length >= 2 ? parts[1] : petName; // extract the real name in the middle
}

        const petSize = document.getElementById("appt-size")?.value || "";
        const petSex = document.getElementById("pet-sex")?.value || "";
        const petBreed = document.getElementById("pet-breed")?.value || "";
        const petAge = document.getElementById("pet-age")?.value || "";
        const petSpecies = document.getElementById("pet-species")?.value || "";
        const petWeight = document.getElementById("pet-weight")?.value || "";

        const name = document.getElementById("owner-name")?.textContent.trim() || "";
       const appointment = JSON.parse(sessionStorage.getItem("appointment")) || {};
const ownerNumber = appointment.ownerNumber || "";


        const appointmentDate = document.getElementById("appt-date")?.textContent.trim() || "";
        const appointmentTime = document.getElementById("appt-time")?.textContent.trim() || "";
        const mainService = document.getElementById("main-service")?.textContent.trim() || "";
        const veterinarian = document.getElementById("veterinarian")?.textContent.trim() || "";
        const specialInstructions = document.getElementById("special-instructions")?.textContent.trim() || "";
        const reservationType = document.getElementById("Reservation-fee-type")?.value || "";
        const serviceFee = document.getElementById("service-fee")?.textContent.trim() || "";
        const reservationFee = document.getElementById("reservation-fee")?.textContent.trim() || "";
        let totalAmount = document.getElementById("total-amount")?.textContent.trim() || "";

        const serviceFeeNum = parseFloat(serviceFee.replace(/[₱,]/g, "")) || 0;
        const reservationFeeNum = parseFloat(reservationFee.replace(/[₱,]/g, "")) || 0;

        if (reservationType === "only" || reservationType === "with-downpayment") {
            totalAmount = `₱${(serviceFeeNum - reservationFeeNum).toFixed(2)}`;
        } else if (reservationType === "with-full-payment") {
            totalAmount = `₱0.00`;
        }

        const selectedServices = Array.from(document.querySelectorAll("input[name='services']:checked"))
            .map(cb => cb.getAttribute("data-service"));

        // Step 3: Convert receipt to Base64 if uploaded
        let receiptBase64 = null;
        if (receiptUpload.files.length > 0) {
            const file = receiptUpload.files[0];
            receiptBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Step 4: Prepare appointment data
        const userId = sessionStorage.getItem("userId");
        const timestamp = new Date().toISOString();
        const appointmentId = `${userId}_${timestamp}`.replace(/[:.]/g, '-');

        const appointmentData = {
            appointmentId,
            userId,
            name,
            ownerNumber,
            service: mainService,
            time: appointmentTime,
            date: appointmentDate,
            timestamp,
            status: "pending",
            petName,
            petSize,
            petId: `${name}_${petName}`.replace(/\s+/g, '_'),
            vet: veterinarian,
            instructions: specialInstructions,
            reservationType,
            serviceFee,
            reservationFee,
            totalAmount,
            selectedServices,
            receiptImage: receiptBase64 || null
        };

        // Step 5: Save appointment to Firestore
        const appointmentRef = doc(db, "Appointment", appointmentId);
        await setDoc(appointmentRef, appointmentData);

        // Step 6: Save pet info
        const petTimestamp = new Date().toISOString();
        const petId = `${userId}_${petName}_${petTimestamp}`.replace(/[:.]/g, '-');
        const petData = {
            userId,
            petId: appointmentData.petId,
            petName,
            species: petSpecies,
            breed: petBreed,
            age: petAge,
            sex: petSex,
            size: petSize,
            weight: petWeight,
            ownerId: name,
            createdAt: petTimestamp
        };
        const petRef = doc(db, "Pets", petId);
        await setDoc(petRef, petData, { merge: true });

        if (window.PetManager?.loadPetsFromFirestore) {
            await window.PetManager.loadPetsFromFirestore();
        }

        // Step 7: Log activity
        await logActivity(name, "Booked Appointment", `Booked ${mainService} for ${petName}`);

        if (modal) modal.style.display = "none";

        // Step 8: Show success Swal
        await Swal.fire({
            icon: 'success',
            title: 'Appointment booked!',
            text: 'Your pet has been saved successfully.',
            iconColor: 'var(--orange)',
            showConfirmButton: false,
            timer: 1500
        });

        // Step 9: Cleanup & redirect
        sessionStorage.removeItem("appointment");
        window.location.href = "customer.html";

    } catch (error) {
        console.error("Failed to book appointment:", error);
        alert("Something went wrong. Please try again.");
    }
});

// Recalculate totals if needed
if (typeof calculateServiceTotal === "function") calculateServiceTotal();
if (typeof updateTotalAmount === "function") updateTotalAmount();
}
});


// ===============================
// 📌 PRINT RECEIPT LOGIC
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("print-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      try {
        // Collect appointment details from DOM
        const ownerName = document.getElementById("owner-name")?.textContent || "";
        const petName = document.getElementById("pet-name")?.textContent || "";
        const petSize = document.getElementById("pet-size")?.value || "";
        const service = document.getElementById("main-service")?.textContent || "";
        const veterinarian = document.getElementById("veterinarian")?.textContent || "";
        const apptDate = document.getElementById("appt-date")?.textContent || "";
        const apptTime = document.getElementById("appt-time")?.textContent || "";
        const serviceFee = document.getElementById("service-fee")?.textContent || "";
        const reservationFee = document.getElementById("reservation-fee")?.textContent || "";
        const totalAmount = document.getElementById("total-amount")?.textContent || "";

        // Build receipt HTML
        const receiptContent = `
          <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto;">
            <h2 style="text-align:center;">🐾 Veterinary Clinic Receipt</h2>
            <hr/>
            <p><strong>Owner Name:</strong> ${ownerName}</p>
            <p><strong>Pet Name:</strong> ${petName}</p>
            <p><strong>Pet Size:</strong> ${petSize}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Veterinarian:</strong> ${veterinarian}</p>
            <p><strong>Date:</strong> ${apptDate}</p>
            <p><strong>Time:</strong> ${apptTime}</p>
            <hr/>
            <p><strong>Service Fee:</strong> ${serviceFee}</p>
            <p><strong>Reservation Fee:</strong> ${reservationFee}</p>
            <p><strong>Total Amount Due:</strong> ${totalAmount}</p>
            <hr/>
            <p style="text-align:center; font-size:12px; color:gray;">
              Thank you for trusting our clinic. Get well soon, ${petName}! 🐶🐱
            </p>
          </div>
        `;

        // Open new window for printing
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt - ${petName}</title>
            </head>
            <body>
              ${receiptContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      } catch (error) {
        console.error("Error printing receipt:", error);
        alert("Failed to generate receipt. Please try again.");
      }
    });
  }
});

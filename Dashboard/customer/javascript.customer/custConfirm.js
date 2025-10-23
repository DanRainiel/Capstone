import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ==============================
// FIREBASE CONFIG
// ==============================
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let services = {};
let serviceDurations = {};
let baseServiceFee = 0;

// ==============================
// LOG ACTIVITY
// ==============================
async function logActivity(userId, action, details) {
  try {
    await addDoc(collection(db, "ActivityLog"), {
      userId: userId || "anonymous",
      action,
      details,
      timestamp: serverTimestamp(),
    });
    console.log("Activity logged:", action);
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

// ==============================
// LOAD SERVICE DURATIONS
// ==============================
async function loadServiceDurations() {
  try {
    const servicesRef = collection(db, "Services");
    const snapshot = await getDocs(servicesRef);

    serviceDurations = {};
    snapshot.forEach(docSnap => {
      const service = docSnap.data();
      if (service.name && service.duration) {
        serviceDurations[service.name.toLowerCase()] = service.duration;
      }
    });
    console.log("✅ Service durations loaded:", serviceDurations);
  } catch (err) {
    console.error("Error loading service durations:", err);
  }
}

// ==============================
// LOAD SERVICES
// ==============================
async function loadServicesFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "Services"));
  services = {};
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    services[data.name.toLowerCase()] = data.variants;
  });
  console.log("✅ Services loaded:", services);
}

// ==============================
// POPULATE SERVICE VARIANTS
// ==============================
function populateServiceOptions() {
  Object.keys(services).forEach((category) => {
    const categoryDiv = document.querySelector(
      `.service-options[data-service="${category}"]`
    );
    if (!categoryDiv) return;

    const optionsList = categoryDiv.querySelector(".options-list");
    if (!optionsList) return;

    optionsList.innerHTML = "";
    const variants = services[category];

    Object.keys(variants).forEach((variantKey) => {
      const variant = variants[variantKey];
      if (typeof variant === "object") {
        Object.keys(variant).forEach((size) => {
          const price = variant[size];
          const label = document.createElement("label");
          label.innerHTML = `
            <input type="checkbox" name="services" data-service="${category}-${variantKey}-${size}">
            ${variantKey} (${size}): ₱${price}
          `;
          optionsList.appendChild(label);
          optionsList.appendChild(document.createElement("br"));
        });
      } else {
        const label = document.createElement("label");
        label.innerHTML = `
          <input type="checkbox" name="services" data-service="${category}-${variantKey}">
          ${variantKey}: ₱${variant}
        `;
        optionsList.appendChild(label);
        optionsList.appendChild(document.createElement("br"));
      }
    });
  });
}
// ========================
// UPDATE TOTAL AMOUNT LOGIC
// ========================
function updateTotalAmount() {
  const serviceFeeDisplay = document.getElementById("service-fee");
  const reservationFeeDisplay = document.getElementById("reservation-fee");
  const totalAmountDisplay = document.getElementById("total-amount");

  if (!serviceFeeDisplay || !reservationFeeDisplay || !totalAmountDisplay) return;

  const type = document.getElementById("Reservation-fee-type")?.value;
  const serviceFee = parseFloat(serviceFeeDisplay.textContent.replace(/[₱,]/g, "")) || 0;

  let reservationFee = 0;
  let grandTotal = serviceFee;

  if (type === "reservation-only") {
    reservationFee = 40;
    grandTotal = Math.max(0, serviceFee - reservationFee);
  } else if (type === "with-downpayment") {
    reservationFee = serviceFee / 2;
    grandTotal = Math.max(0, serviceFee - reservationFee);
  } else if (type === "with-full-payment") {
    reservationFee = serviceFee; // Full payment = entire service fee
    grandTotal = 0; // Nothing left to pay
  } else {
    reservationFee = 0;
    grandTotal = serviceFee;
  }

  reservationFeeDisplay.textContent = `₱${reservationFee.toFixed(2)}`;
  totalAmountDisplay.textContent = `₱${Math.max(0, grandTotal).toFixed(2)}`;
}

// ========================
// CANCEL APPOINTMENT LOGIC
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", async () => {
      const result = await Swal.fire({
        title: "Cancel Appointment?",
        text: "Your current booking details will be lost.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "No, keep it",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        sessionStorage.removeItem("appointment");

        await Swal.fire({
          icon: "info",
          title: "Appointment Cancelled",
          text: "Your booking has been cancelled.",
          timer: 1200,
          showConfirmButton: false,
        });

        window.location.href = "customer.html";
      }
    });
  }
});

// ==============================
// FORMAT APPOINTMENT TIME
// ==============================
function formatAppointmentTime(startTime, durationMinutes = 30) {
  if (!startTime) return "N/A";

  const [hour, minute] = startTime.split(":").map(Number);
  if (isNaN(hour) || isNaN(minute)) return startTime;

  const start = new Date();
  start.setHours(hour, minute, 0);

  const end = new Date(start.getTime() + durationMinutes * 60000);

  const formatTime = (date) => {
    let hrs = date.getHours();
    const mins = date.getMinutes().toString().padStart(2, "0");
    const ampm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12 || 12;
    return `${hrs}:${mins} ${ampm}`;
  };

  return `${formatTime(start)} - ${formatTime(end)}`;
}

// ==============================
// GET SERVICE DURATION HELPER
// ==============================
function getServiceDuration(serviceName) {
  if (!serviceName) return 30;
  const normalized = serviceName.toLowerCase().trim();
  const duration = serviceDurations[normalized];
  console.log(`Duration for "${serviceName}" (normalized: "${normalized}") = ${duration || 30}`);
  return duration || 30;
}

// ==============================
// MAIN FLOW
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load durations FIRST before everything else
    await loadServiceDurations();
    await loadServicesFromFirestore();
    populateServiceOptions();
  } catch (err) {
    console.error("Failed to load services:", err);
    alert("Failed to load service data. Please refresh the page.");
    return;
  }

  const appointmentData = JSON.parse(sessionStorage.getItem("appointment"));
  if (!appointmentData) {
    alert("No appointment data found.");
    window.location.href = "customer.html";
    return;
  }

  console.log("✅ Loaded appointmentData:", appointmentData);

  // Normalize keys for Pet Form or Book Appointment
  const service = appointmentData.service || appointmentData.selectedService || appointmentData.mainService || "";
  const serviceDuration = getServiceDuration(service);

  const mappedData = {
    petName:
      appointmentData.petName ||
      appointmentData.pet?.name ||
      appointmentData.petname ||
      "",
    petSize:
      appointmentData.petSize ||
      appointmentData.size ||
      appointmentData.pet?.size ||
      "",
    petSpecies:
      appointmentData.petSpecies ||
      appointmentData.species ||
      appointmentData.pet?.species ||
      "",
    ownerName:
      appointmentData.ownerName ||
      appointmentData.name ||
      appointmentData.userName ||
      "",
    ownerNumber:
      appointmentData.ownerNumber ||
      appointmentData.number ||
      appointmentData.contactNumber ||
      "",
    service: service,
    date: appointmentData.date || appointmentData.appointmentDate || "",
    time: formatAppointmentTime(
      appointmentData.time?.split(" - ")[0] ||
        appointmentData.startTime ||
        appointmentData.displayTime ||
        "",
      serviceDuration
    ),
    selectedServices: appointmentData.selectedServices || [],
    duration: serviceDuration,
  };

  // Fill details
  document.getElementById("pet-name").textContent = mappedData.petName;
  document.getElementById("appt-size").value = mappedData.petSize;
  document.getElementById("owner-name").textContent = mappedData.ownerName;
  document.getElementById("appt-date").textContent = mappedData.date;
  document.getElementById("appt-time").textContent = mappedData.time;
  document.getElementById("main-service").textContent = mappedData.service;
  document.getElementById("veterinarian").textContent = "Dr. Donna Doll Diones";
  document.getElementById("special-instructions").textContent =
    "Please bring any recent medical records";

  // Hide all, then show the matching service options
  document.querySelectorAll(".service-options").forEach((div) => (div.style.display = "none"));
  const selectedService = mappedData.service.toLowerCase();
  const petSize = (mappedData.petSize || "").toLowerCase();

  const matchingGroup = document.querySelector(`.service-options[data-service="${selectedService}"]`);
  if (matchingGroup) {
    matchingGroup.style.display = "block";
    matchingGroup.querySelectorAll('input[name="services"]').forEach((cb) => {
      const label = cb.getAttribute("data-service")?.toLowerCase() || "";
      const parts = label.split("-");
      const sizeFromLabel = parts[2];
      cb.parentElement.style.display =
        sizeFromLabel && sizeFromLabel !== petSize ? "none" : "block";
    });
  }

  // Initialize billing
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
    const petSpecies = (mappedData.petSpecies || "").toLowerCase();
    let total = 0;
    selectedServicesList.innerHTML = "";

    checkboxes.forEach((checkbox) => {
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
            const key = sizeFromLabel || (petSpecies in variantData ? petSpecies : selectedSize);
            price = variantData[key] ?? Object.values(variantData).find((v) => typeof v === "number") ?? 0;
          } else {
            price = variantData;
          }
        }
      }

      total += price;
      const item = document.createElement("p");
      item.textContent = `${variant}${sizeFromLabel ? ` (${sizeFromLabel})` : ""}: ₱${price.toFixed(2)}`;
      selectedServicesList.appendChild(item);
    });

    baseServiceFee = total;
    serviceFeeDisplay.textContent = `₱${total.toFixed(2)}`;
    updateTotalAmount();
  }

  document.querySelectorAll('input[name="services"]').forEach((cb) => cb.addEventListener("change", calculateServiceTotal));
  petSizeSelect.addEventListener("change", calculateServiceTotal);

  if (Array.isArray(mappedData.selectedServices)) {
    mappedData.selectedServices.forEach((service) => {
      const checkbox = document.querySelector(`input[data-service="${service}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }

  calculateServiceTotal();

  const feeTypeDropdown = document.getElementById("Reservation-fee-type");
  if (feeTypeDropdown) feeTypeDropdown.addEventListener("change", updateTotalAmount);
});

// ==============================
// CONFIRM BUTTON LOGIC
// ==============================
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

      if (!result.isConfirmed) return;

      try {
        let petName = document.getElementById("pet-name")?.textContent.trim() || "";

        if (petName.includes("_")) {
          const parts = petName.split("_");
          petName = parts.length >= 2 ? parts[1] : petName;
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

        const userId = sessionStorage.getItem("userId");
        const timestamp = new Date().toISOString();
        const appointmentId = `${userId}_${timestamp}`.replace(/[:.]/g, '-');
// 🔹 Split start and end times properly
let startTime = "";
let endTime = "";

if (appointmentTime.includes(" - ")) {
  const [start, end] = appointmentTime.split(" - ");
  startTime = start.trim();
  endTime = end.trim();
} else {
  // Fallback if only start time is stored
  startTime = appointmentTime.trim();
  const duration = appointment.duration || 30; // default 30 minutes
  const [hour, minute, period] = startTime.match(/(\d+):(\d+)\s*(AM|PM)/i)?.slice(1) || [];
  if (hour && minute && period) {
    let hours24 = parseInt(hour);
    if (period.toUpperCase() === "PM" && hours24 !== 12) hours24 += 12;
    if (period.toUpperCase() === "AM" && hours24 === 12) hours24 = 0;
    const startDate = new Date();
    startDate.setHours(hours24, parseInt(minute));
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endHours = ((endDate.getHours() + 11) % 12) + 1;
    const endMins = endDate.getMinutes().toString().padStart(2, "0");
    const endPeriod = endDate.getHours() >= 12 ? "PM" : "AM";
    endTime = `${endHours}:${endMins} ${endPeriod}`;
  }
}

const appointmentData = {
  appointmentId,
  userId,
  name,
  ownerNumber,
  service: mainService,
  startTime,              // ✅ new
  endTime,                // ✅ new
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



        const appointmentRef = doc(db, "Appointment", appointmentId);
        await setDoc(appointmentRef, appointmentData);

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

        await logActivity(name, "Booked Appointment", `Booked ${mainService} for ${petName}`);

        if (modal) modal.style.display = "none";

        await Swal.fire({
          icon: 'success',
          title: 'Appointment booked!',
          text: 'Your pet has been saved successfully.',
          iconColor: 'var(--orange)',
          showConfirmButton: false,
          timer: 1500
        });

        sessionStorage.removeItem("appointment");
        window.location.href = "customer.html";

      } catch (error) {
        console.error("Failed to book appointment:", error);
        alert("Something went wrong. Please try again.");
      }
    });

    if (typeof calculateServiceTotal === "function") calculateServiceTotal();
    if (typeof updateTotalAmount === "function") updateTotalAmount();
  }
});

// ==============================
// PRINT RECEIPT LOGIC
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("print-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      try {
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

        const receiptContent = `
        <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto;">
            <h2 style="text-align:center;">Veterinary Clinic Receipt</h2>
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
            Thank you for trusting our clinic. Get well soon, ${petName}!
            </p>
        </div>
        `;

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
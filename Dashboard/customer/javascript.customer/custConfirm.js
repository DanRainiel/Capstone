

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    doc,
      addDoc,
    setDoc,
     serverTimestamp,
    collection
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




let baseServiceFee = 0;

  const servicePrices = {
    vaccination: {
      "5n1": { small: 500, medium: 500, large: 500 },
      "8in1": { small: 600, medium: 600, large: 600 },
      "Kennel Cough": { small: 500, medium: 500, large: 500 },
      "4n1": { small: 950, medium: 950, large: 950, cat: 950 },
      "Anti-Rabies": { small: 350, medium: 350, large: 350, cat: 350 }
    },

    grooming: {
      basic: {
        small: 450,
        medium: 600,
        large: 800,
        cat: 600
      }
    },

    consultation: {
      regular: {
        small: 350,
        medium: 350,
        large: 350,
        cat: 350
      }
    },

    treatment: {
      tickFlea: {
        small: 650,
        medium: 700,
        large: 800
      },
      heartwormPrevention: {
        small: 2000, // up to 10kg
        medium: 2500, // 10–15kg
        large: 3000, // 15–25kg
        xl: 4500 // upper end for >25kg
      },
      catTickFleaDeworm: {
        small: 650,
        large: 750
      }
    },

    deworming: {
      regular: {
        small: 200,
        medium: 300,
        large: 400,
        cat: 300
      }
    },

    laboratory: {
      "4 Way Test": 1200,
      "CBC Bloodchem Package": 1500,
      "Cat FIV/Felv Test": 1000,
      "Leptospirosis Test": 950,
      "Canine Distemper Test": 850,
      "Canine Parvo Test": 859,
      "Parvo/Corona Virus Test": 950,
      "Earmite Test": 150,
      "Skin Scraping": 150,
      "Stool Exam": 300,
      "Urinalysis": 950
    }
  };


document.addEventListener("DOMContentLoaded", () => {
    const appointmentData = JSON.parse(sessionStorage.getItem("appointment"));

    const cancelBtn = document.getElementById("cancel-btn");
if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        sessionStorage.removeItem("appointment"); // optional: clean up
        window.location.href = "customer.html";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const appointmentData = JSON.parse(sessionStorage.getItem("appointment"));

  if (appointmentData) {
    console.log("Loaded appointment from modal:", appointmentData);

    const confirmBtn = document.getElementById("bookBtn");

    confirmBtn.addEventListener("click", async () => {
      try {
        const appointmentId = appointmentData.appointmentId || `${appointmentData.userId}_${appointmentData.petId}_${Date.now()}`;

        // Firestore save
        await setDoc(doc(db, "Appointment", appointmentId), {
          ...appointmentData,
          status: "pending",
          bookedAt: new Date().toISOString()
        });

        alert("Appointment confirmed successfully!");
        sessionStorage.removeItem("appointment");
        window.location.href = "custDashboard.html";

      } catch (error) {
        console.error("Error saving appointment from modal:", error);
        alert("Failed to confirm appointment. Please try again.");
      }
    });
  }
});

    if (!appointmentData) {
        alert("No appointment data found.");
        window.location.href = "customer.html";
        return;
    }

    try {

              // 🟨 Show only relevant service options
        const allServiceOptions = document.querySelectorAll('.service-options');
        allServiceOptions.forEach(div => div.style.display = 'none'); // hide all

        const selectedService = appointmentData.service.toLowerCase();

        const matchingGroup = document.querySelector(`.service-options[data-service="${selectedService}"]`);
        if (matchingGroup) {
            matchingGroup.style.display = 'block';

         
        }

        // Update general info
        document.getElementById("pet-name").textContent = appointmentData.petName || "";
        document.getElementById("pet-size").value = appointmentData.petSize || "small";
        document.getElementById("owner-name").textContent = appointmentData.name || "";
        document.getElementById("appt-date").textContent = appointmentData.date || "";
        document.getElementById("appt-time").textContent = appointmentData.time || "";
        document.getElementById("main-service").textContent = appointmentData.service || "";
        document.getElementById("veterinarian").textContent = "Dr. Donna Doll Diones";
        document.getElementById("special-instructions").textContent = "Please bring any recent medical records";

        // Display billing fields

        const serviceFeeDisplay = document.getElementById("service-fee");
        const totalAmountDisplay = document.getElementById("total-amount");
        const selectedServicesList = document.getElementById("selected-services-list");
        const petSizeSelect = document.getElementById("pet-size");

        
       
        document.getElementById("reservation-fee").textContent = `₱0.00`;

function calculateServiceTotal() {
  const checkboxes = document.querySelectorAll('input[name="services"]:checked');
  const selectedSize = petSizeSelect.value.toLowerCase();
  let total = 0;
  selectedServicesList.innerHTML = "";

  checkboxes.forEach(checkbox => {
    const label = checkbox.getAttribute("data-service");
    if (!label) return;

    const [category, rawServiceKey, rawSize] = label.split("-");
    const serviceKey = rawServiceKey;
    const sizeKey = (rawSize || selectedSize)?.toLowerCase(); // fallback to pet size
    let price = 0;

    const categoryData = servicePrices[category];
    if (categoryData) {
      const serviceData = categoryData[serviceKey];
      if (typeof serviceData === "object") {
        // Sized pricing (vaccination, grooming, etc.)
        price = serviceData[sizeKey] || 0;
      } else if (typeof serviceData === "number") {
        // Flat pricing (lab tests)
        price = serviceData;
      }
    }

    total += price;

    const item = document.createElement("p");
    item.textContent = `${serviceKey} (${sizeKey}): ₱${price.toFixed(2)}`;
    selectedServicesList.appendChild(item);
  });

  baseServiceFee = total;
  serviceFeeDisplay.textContent = `₱${total.toFixed(2)}`;
  totalAmountDisplay.textContent = `₱${total.toFixed(2)}`;

  updateTotalAmount();
}





// Bind changes to recalculate total
document.querySelectorAll('input[name="services"]').forEach(cb => {
  cb.addEventListener("change", calculateServiceTotal);
});

petSizeSelect.addEventListener("change", calculateServiceTotal);

// Trigger once on load
calculateServiceTotal();



if (Array.isArray(appointmentData.selectedServices)) {
    appointmentData.selectedServices.forEach(service => {
        const id = service.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/\//g, '-') + '-cb';
        const checkbox = document.getElementById(id);
        if (checkbox) checkbox.checked = true;
    });
}


        // Vaccinations
        if (Array.isArray(appointmentData.vaccines)) {
            appointmentData.vaccines.forEach(v => {
                const id = v.toLowerCase().replace(/\s+/g, '-') + "-vax";
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = true;
            });
        }

        // Initial total calculation
        updateTotalAmount();

        // Dropdown change listener
const feeTypeDropdown = document.getElementById("Reservation-fee-type");
if (feeTypeDropdown) {
    feeTypeDropdown.addEventListener("change", updateTotalAmount);
}

} catch (error) {
    console.error("Error processing appointment data:", error);
}
function updateTotalAmount() {
    const type = document.getElementById("Reservation-fee-type")?.value;
    let reservationFee = 0;
    let grandTotal = baseServiceFee; // start with full service fee

    if (type === "reservation-only") {
        reservationFee = 40;
        grandTotal -= reservationFee; // deduct reservation fee
    } else if (type === "with-downpayment") {
        reservationFee = baseServiceFee / 2; // always half of total
        grandTotal -= reservationFee; // deduct half (pay now only 50%)
    } else if (type === "with-full-payment") {
        reservationFee = 0; 
        // full payment → keep total as is
    }

    // Show reservation/downpayment separately
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
        const petName = document.getElementById("pet-name")?.textContent.trim() || "";
        const petSize = document.getElementById("pet-size")?.value || "";
        const petSex = document.getElementById("pet-sex")?.value || "";
        const petBreed = document.getElementById("pet-breed")?.value || "";
        const petAge = document.getElementById("pet-age")?.value || "";
        const petSpecies = document.getElementById("pet-species")?.value || "";
        const petWeight = document.getElementById("pet-weight")?.value || "";

        const name = document.getElementById("owner-name")?.textContent.trim() || "";
        const ownerNumber = document.getElementById("appt-number")?.value.trim() || "";

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

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
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



let baseServiceFee = 0;

const servicePrices = {
  vaccination: {
    "5n1": { small: 500, medium: 500, large: 500 },
    "8in1": { small: 600, medium: 600, large: 600 },
    "Kennel Cough": { small: 500, medium: 500, large: 500 },
    "4n1 (Feline)": { cat: 950 },
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
        const serviceFee = parseFloat(appointmentData.serviceFee) || 0;
     
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
    let price = 0;

    if (!label) return;

    const parts = label.split('-');
    const category = parts[0]; // e.g., "grooming"
    const serviceKey = parts[1];
    const remainder = parts.slice(2).join('-');

    const catData = servicePrices[category];

    if (!catData) return;

    // Handle different service structures
    if (category === "laboratory") {
      price = catData[serviceKey + (remainder ? `-${remainder}` : "")] || 0;
    } else if (typeof catData[serviceKey] === "object") {
      price = catData[serviceKey][selectedSize] || 0;
    } else if (catData[serviceKey]) {
      price = catData[serviceKey]; // flat price
    } else if (catData[remainder]) {
      // fallback for e.g., vaccination["4n1 (Feline)"]
      price = catData[remainder][selectedSize] || catData[remainder] || 0;
    }

    total += price;

    const item = document.createElement("p");
    item.textContent = `${label}: ₱${price.toFixed(2)}`;
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

    if (type === "only") {
        reservationFee = 40;
    } else if (type === "with-downpayment") {
        reservationFee = 350;
    }

    const grandTotal = baseServiceFee + reservationFee;

    document.getElementById("reservation-fee").textContent = `₱${reservationFee.toFixed(2)}`;
    document.getElementById("total-amount").textContent = `₱${grandTotal.toFixed(2)}`;
}


});




    // Modal and receipt
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
        const appointmentData = JSON.parse(sessionStorage.getItem("appointment"));
        if (!appointmentData) {
            alert("No appointment data found.");
            return;
        }

        try {
            // Add timestamp or unique identifier if needed
            appointmentData.timestamp = new Date().toISOString();
            appointmentData.status = "pending";

            // Save to Firestore
            const appointmentRef = doc(collection(db, "appointments"));
            await setDoc(appointmentRef, appointmentData);

            alert("Appointment booked successfully!");
            sessionStorage.removeItem("appointment");
            window.location.href = "customer.html"; // or success page
        } catch (error) {
            console.error("Failed to book appointment:", error);
            alert("Something went wrong. Please try again.");
        }
    });
}



// Redirect on cancel
const cancelBtn = document.getElementById('cancel-btn');
if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        sessionStorage.removeItem('selectedAppointmentId'); // optional: clear stored ID
        window.location.href = 'customer.html'; // go back to main customer page
    });
}

// Initial total calculation
calculateServiceTotal();  // <-- FIX: triggers price refresh based on selections
updateTotalAmount();


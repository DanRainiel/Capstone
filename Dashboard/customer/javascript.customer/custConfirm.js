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

    if (type === "only") {
        reservationFee = 40;
    } else if (type === "with-downpayment") {
        reservationFee = 350;
    }

    // Do NOT include reservationFee in total
    const grandTotal = baseServiceFee;

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
            try {
                const petName = document.getElementById("pet-name")?.textContent.trim() || "";
                const petSize = document.getElementById("pet-size")?.value || "";
                const petSex = document.getElementById("pet-sex")?.value || "";
                const petBreed = document.getElementById("pet-breed")?.value || "";
                const petAge = document.getElementById("pet-age")?.value || "";
                const petSpecies = document.getElementById("pet-species")?.value || "";
                const petWeight = document.getElementById("pet-weight")?.value || "";

                const ownerName = document.getElementById("owner-name")?.textContent.trim() || "";
                const ownerNumber = document.getElementById("appt-number")?.value.trim() || "";

                const appointmentDate = document.getElementById("appt-date")?.textContent.trim() || "";
                const appointmentTime = document.getElementById("appt-time")?.textContent.trim() || "";
                const mainService = document.getElementById("main-service")?.textContent.trim() || "";
                const veterinarian = document.getElementById("veterinarian")?.textContent.trim() || "";
                const specialInstructions = document.getElementById("special-instructions")?.textContent.trim() || "";
                const reservationType = document.getElementById("Reservation-fee-type")?.value || "";
                const serviceFee = document.getElementById("service-fee")?.textContent.trim() || "";
                const reservationFee = document.getElementById("reservation-fee")?.textContent.trim() || "";
                const totalAmount = document.getElementById("total-amount")?.textContent.trim() || "";

                const selectedServices = Array.from(document.querySelectorAll("input[name='services']:checked"))
                    .map((checkbox) => checkbox.getAttribute("data-service"));

                const appointmentData = {
                    ownerName,
                    ownerNumber,
                    service: mainService,
                    time: appointmentTime,
                    date: appointmentDate,
                    timestamp: new Date().toISOString(),
                    status: "pending",
                    owner: ownerName,
                    petName,
                    petSize,
                    petId: `${ownerName}_${petName}`.replace(/\s+/g, '_'),
                    vet: veterinarian,
                    instructions: specialInstructions,
                    reservationType,
                    serviceFee,
                    reservationFee,
                    totalAmount,
                    selectedServices
                };

                // Save to Firestore
        const userId = sessionStorage.getItem("userId"); // ✅ retrieve userId

const timestamp = new Date().toISOString();
const appointmentId = `${userId}_${timestamp}`.replace(/[:.]/g, '-');
const appointmentRef = doc(db, "Appointment", appointmentId);

appointmentData.appointmentId = appointmentId;
appointmentData.userId = userId; // include in data to support Firestore queries


                await setDoc(appointmentRef, appointmentData);

                const petData = {
    userId,
    petId: appointmentData.petId,
    petName,
    species: petSpecies,
    breed: petBreed,
    age: petAge,
    sex: petSex,
    size: petSize, // ✅ match the expected Firestore field
    weight: petWeight,
    ownerId: ownerName,
    createdAt: new Date().toISOString()
};


              const petTimestamp = new Date().toISOString();
const petId = `${userId}_${petName}_${petTimestamp}`.replace(/[:.]/g, '-'); // Unique ID with user + pet name
const petRef = doc(db, "Pets", petId);

                await setDoc(petRef, petData, { merge: true });

if (window.PetManager && typeof window.PetManager.loadPetsFromFirestore === "function") {
    await window.PetManager.loadPetsFromFirestore();
}



            // Show success message
alert("Appointment booked and pet saved!");
sessionStorage.removeItem("appointment");
// Give DOM time to refresh before redirecting
setTimeout(() => {
  window.location.href = "customer.html";
}, 1500); // 1.5 seconds delay

                

            } catch (error) {
                console.error("Failed to book appointment:", error);
                alert("Something went wrong. Please try again.");
            }
        });

        
    }

    // Safely call functions if they exist
    if (typeof calculateServiceTotal === "function") calculateServiceTotal();
    if (typeof updateTotalAmount === "function") updateTotalAmount();
});

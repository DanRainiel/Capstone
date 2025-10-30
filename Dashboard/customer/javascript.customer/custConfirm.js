import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  query,
  where,
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
let userPets = [];
let appointmentCounter = 0;

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
// LOAD USER PETS FROM FIRESTORE (FILTERED BY CURRENT USER)
// ==============================
async function loadUserPets() {
  try {
    const userId = sessionStorage.getItem("userId");
    console.log("🔍 Debug - User ID from sessionStorage:", userId);
    
    if (!userId) {
      console.log("❌ No user ID found in session storage");
      return [];
    }

    console.log("🔍 Debug - Loading pets from Firestore...");
    const petsRef = collection(db, "Pets");
    
    // Try different possible field names for user ID
    const possibleUserFields = [
      "userId", "userID", "user_id", "ownerId", "ownerID", "owner_id",
      "uid", "userUid", "ownerUid", "user", "owner", "createdBy"
    ];
    
    let userPetsFiltered = [];
    let successfulField = null;
    
    // First try filtered queries
    for (const fieldName of possibleUserFields) {
      try {
        console.log(`🔍 Trying to filter by field: ${fieldName}`);
        const q = query(petsRef, where(fieldName, "==", userId));
        const snapshot = await getDocs(q);
        
        console.log(`🔍 Filter by ${fieldName} - Found ${snapshot.size} pets`);
        
        if (!snapshot.empty) {
          successfulField = fieldName;
          snapshot.forEach(docSnap => {
            const petData = docSnap.data();
            console.log(`✅ Pet found with ${fieldName}:`, petData.petName || petData.name);
            userPetsFiltered.push({
              id: docSnap.id,
              ...petData
            });
          });
          break;
        }
      } catch (error) {
        console.log(`❌ Field ${fieldName} query failed:`, error.message);
      }
    }
    
    // If no pets found with filtered queries, try client-side filtering
    if (userPetsFiltered.length === 0) {
      console.log("🔍 No pets found with filtered queries, trying client-side filtering...");
      const allPetsSnapshot = await getDocs(petsRef);
      const allPets = [];
      
      allPetsSnapshot.forEach(docSnap => {
        const petData = docSnap.data();
        allPets.push({
          id: docSnap.id,
          ...petData
        });
      });
      
      console.log("🔍 All pets in collection:", allPets.length);
      
      // Try client-side filtering with different field names
      for (const fieldName of possibleUserFields) {
        const filtered = allPets.filter(pet => pet[fieldName] === userId);
        if (filtered.length > 0) {
          console.log(`✅ Found ${filtered.length} pets with client-side filtering on field: ${fieldName}`);
          userPetsFiltered = filtered;
          successfulField = fieldName;
          break;
        }
      }
      
      // If still no pets, show what fields are available for debugging
      if (userPetsFiltered.length === 0 && allPets.length > 0) {
        console.log("🔍 Debug - Available fields in first pet:", Object.keys(allPets[0]));
        console.log("🔍 Debug - First pet data:", allPets[0]);
        
        // Check if any pet has a user-related field that matches
        const petsWithUserFields = allPets.filter(pet => {
          return Object.keys(pet).some(key => 
            key.toLowerCase().includes('user') || 
            key.toLowerCase().includes('owner') ||
            key.toLowerCase().includes('uid')
          );
        });
        
        console.log("🔍 Pets with user-related fields:", petsWithUserFields);
      }
    }
    
    userPets = userPetsFiltered;
    
    if (successfulField) {
      console.log(`✅ Successfully loaded ${userPets.length} pets for current user using field: ${successfulField}`);
    } else {
      console.log(`❌ No pets found for current user (${userId})`);
      console.log("💡 Make sure your Pets documents have a field that matches the user ID");
    }
    
    console.log("✅ Final user pets:", userPets);
    return userPets;
    
  } catch (error) {
    console.error("❌ Error loading user pets:", error);
    return [];
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
// LOAD SERVICES (UPDATED FOR YOUR FIRESTORE STRUCTURE)
// ==============================
async function loadServicesFromFirestore() {
  const querySnapshot = await getDocs(collection(db, "Services"));
  services = {};
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const serviceName = data.name.toLowerCase();
    
    // Handle the variants structure from your Firestore
    if (data.variants && typeof data.variants === 'object') {
      services[serviceName] = data.variants;
    } else {
      services[serviceName] = {};
    }
    
    console.log(`✅ Loaded service: ${serviceName}`, data.variants);
  });
  console.log("✅ All services loaded:", services);
}

// ==============================
// TIME SLOT HELPERS
// ==============================
function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTo12Hour(time24) {
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}

async function loadAvailableTimeSlotsForCard(serviceSelect, dateInput, timeSelect, index) {
  try {
    const clinicSnap = await getDocs(collection(db, "ClinicSettings"));
    if (clinicSnap.empty) return console.warn("No clinic hours found!");

    const clinicData = clinicSnap.docs[0].data();
    const weekdayHours = clinicData.weekdayHours;
    const saturdayHours = clinicData.saturdayHours;

    const selectedDate = dateInput.value;
    const selectedService = serviceSelect.value;
    
    if (!selectedDate || !selectedService) {
      timeSelect.innerHTML = `<option value="">-- Select Service First --</option>`;
      return;
    }

    const day = new Date(selectedDate).getDay();
    if (day === 0) {
      timeSelect.innerHTML = `<option value="">Closed on Sundays</option>`;
      return;
    }

    const start = day === 6 ? toMinutes(saturdayHours.start) : toMinutes(weekdayHours.start);
    const end = day === 6 ? toMinutes(saturdayHours.end) : toMinutes(weekdayHours.end);

    const serviceDuration = getServiceDuration(selectedService);
    console.log(`📅 Generating slots for ${selectedService}: ${serviceDuration} mins each`);

    timeSelect.innerHTML = `<option value="">-- Select Time --</option>`;

    for (let t = start; t < end; t += serviceDuration) {
      const nextT = t + serviceDuration;
      
      if (nextT > end) break;

      const startHours = Math.floor(t / 60);
      const startMinutes = t % 60;
      const endHours = Math.floor(nextT / 60);
      const endMinutes = nextT % 60;

      const timeValue = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`;
      const startLabel = formatTo12Hour(timeValue);
      const endLabel = formatTo12Hour(`${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`);

      const option = document.createElement("option");
      option.value = timeValue;
      option.textContent = `${startLabel} - ${endLabel}`;
      option.dataset.endTime = `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
      timeSelect.appendChild(option);
    }

  } catch (err) {
    console.error("Error loading time slots:", err);
  }
}

// ==============================
// CREATE APPOINTMENT CARD HTML
// ==============================
function createAppointmentCard(pet, appointmentData, index) {
  const service = appointmentData.service || "";
  
  // Get pet display information with fallbacks
  const petName = pet.petName || pet.name || pet.petname || "No pet selected";
  const petSpecies = pet.species || pet.type || pet.animalType || "Unknown";
  const petSize = pet.size || pet.petSize || "";
  
  // Create pet dropdown options
  let petOptions = '<option value="">Select a pet</option>';
  
  if (userPets.length > 0) {
    petOptions += userPets.map(p => {
      const displayName = p.petName || p.name || p.petname || "Unknown Pet";
      const displaySpecies = p.species || p.type || p.animalType || "Unknown";
      return `
        <option value="${p.id}" ${p.id === pet.id ? 'selected' : ''}>
          ${displayName} (${displaySpecies})
        </option>
      `;
    }).join('');
  } else {
    petOptions = '<option value="">No pets found for your account</option>';
  }
  
  return `
    <div class="card appointment-card" data-appointment-index="${index}">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2><i class="fa-solid fa-calendar-check"></i> Appointment ${index + 1}</h2>
        <button class="remove-appointment-btn" data-index="${index}" style="background: #dc3545; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>
      <div class="appointment-info">
        <div class="pet-selector">
          <p>
            <span>Select Pet:</span>
            <select class="pet-dropdown" data-appointment-index="${index}">
              ${petOptions}
            </select>
          </p>
        </div>

        <p><span>Pet Name:</span> <span id="pet-name-${index}">${petName}</span></p>
        <p>
          <span>Pet Size:</span>
          <input type="text" id="appt-size-${index}" readonly value="${petSize}" placeholder="Auto-calculated" />
        </p>

        <p><span>Owner Name:</span> <span id="owner-name-${index}">${appointmentData.ownerName || ""}</span></p>
        <p><span>Appointment Date:</span> <input type="date" id="appt-date-${index}" value="${appointmentData.date || ''}" readonly style="border: 1px solid #ccc; padding: 5px; border-radius: 4px;" /></p>
        
        <p>
          <span>Service:</span>
          <select id="service-select-${index}" class="service-select" data-index="${index}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="">-- Select Service --</option>
          </select>
        </p>
        
        <p>
          <span>Appointment Time:</span>
          <select id="time-select-${index}" class="time-select" data-index="${index}" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            <option value="">-- Select Service First --</option>
          </select>
        </p>

        <div class="service-selection">
          <p><span>Additional Services:</span></p>
           
          <div class="service-options-container">
            <div class="service-category">
              <div class="service-options" data-service="grooming" style="display:none">
                <h4>Grooming Options</h4>
                <div class="options-list" id="grooming-options-${index}"></div>
              </div>

              <div class="service-options" data-service="vaccination" style="display:none">
                <h4>Vaccination Options</h4>
                <div class="options-list" id="vaccination-options-${index}"></div>
              </div>

              <div class="service-options" data-service="consultation" style="display:none">
                <h4>Consultation Options</h4>
                <div class="options-list" id="consultation-options-${index}"></div>
              </div>

              <div class="service-options" data-service="treatment" style="display:none">
                <h4>Treatment Options</h4>
                <div class="options-list" id="treatment-options-${index}"></div>
              </div>

              <div class="service-options" data-service="deworming" style="display:none">
                <h4>Deworming Options</h4>
                <div class="options-list" id="deworming-options-${index}"></div>
              </div>

              <div class="service-options" data-service="laboratory" style="display:none">
                <h4>Laboratory Tests</h4>
                <div class="options-list" id="laboratory-options-${index}"></div>
              </div>
            </div>
          </div>
        </div>
        <p><span>Veterinarian:</span> <span id="veterinarian-${index}">Dr. Donna Doll Diones</span></p>
        <p><span>Special Instructions:</span> <span id="special-instructions-${index}">Please bring any recent medical records</span></p>
      </div>
    </div>
  `;
}

// ==============================
// ADD APPOINTMENT BUTTON
// ==============================
function addAppointmentButton() {
  const appointmentsContainer = document.getElementById('appointments-container');
  
  const existingButton = document.getElementById('add-appointment-btn-container');
  if (existingButton) existingButton.remove();
  
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'add-appointment-btn-container';
  buttonContainer.style.margin = '20px 0';
  buttonContainer.style.textAlign = 'center';
  
  const addButton = document.createElement('button');
  addButton.id = 'add-appointment-btn';
  addButton.className = 'btn btn-primary';
  addButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add Another Appointment';
  addButton.style.padding = '12px 24px';
  addButton.style.fontSize = '16px';
  addButton.style.background = '#4CAF50';
  addButton.style.color = 'white';
  addButton.style.border = 'none';
  addButton.style.borderRadius = '5px';
  addButton.style.cursor = 'pointer';
  
  addButton.addEventListener('click', async () => {
    const appointmentData = JSON.parse(sessionStorage.getItem("appointment")) || {};
    
    const normalizedData = {
      service: "",
      date: appointmentData.date || "",
      time: "",
      ownerName: appointmentData.ownerName || "",
      selectedServices: [],
      duration: 30,
    };
    
    appointmentCounter++;
    const nextIndex = appointmentCounter;
    
    const emptyPet = { id: '', petName: "No pet selected", size: "", species: "" };
    const newCardHTML = createAppointmentCard(emptyPet, normalizedData, nextIndex);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newCardHTML;
    appointmentsContainer.insertBefore(tempDiv.firstElementChild, buttonContainer);
    
    // Populate service dropdown for new card
    await populateServiceDropdown(nextIndex);
    
    // Populate service options for the new card only
    await populateServiceOptionsForCard(nextIndex);
    
    const newAppointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${nextIndex}"]`);
    if (newAppointmentCard) {
      initializeServiceOptionsForAppointment(newAppointmentCard, normalizedData, nextIndex);
      setupAppointmentEventListeners(newAppointmentCard.querySelector('.appointment-info'), nextIndex);
      setupServiceAndTimeListeners(nextIndex);
    }
    
    setupPetDropdownListeners();
    setupRemoveButtonListeners();
    
    calculateServiceTotal();
    
    console.log(`✅ Added appointment card with index: ${nextIndex}`);
  });
  
  buttonContainer.appendChild(addButton);
  appointmentsContainer.appendChild(buttonContainer);
}

// ==============================
// POPULATE SERVICE DROPDOWN
// ==============================
async function populateServiceDropdown(index) {
  try {
    const serviceSelect = document.getElementById(`service-select-${index}`);
    if (!serviceSelect) return;
    
    serviceSelect.innerHTML = '<option value="">-- Select Service --</option>';
    
    const servicesSnap = await getDocs(collection(db, "Services"));
    servicesSnap.forEach(docSnap => {
      const serviceData = docSnap.data();
      const opt = document.createElement("option");
      opt.value = serviceData.name || docSnap.id;
      opt.textContent = serviceData.name || docSnap.id;
      serviceSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error loading services:", err);
  }
}

// ==============================
// POPULATE SERVICE OPTIONS FOR SPECIFIC CARD (UPDATED)
// ==============================
async function populateServiceOptionsForCard(cardIndex) {
  const appointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${cardIndex}"]`);
  if (!appointmentCard) return;

  Object.keys(services).forEach((serviceName) => {
    const categoryDiv = appointmentCard.querySelector(`.service-options[data-service="${serviceName}"]`);
    if (!categoryDiv) return;

    const optionsList = categoryDiv.querySelector(".options-list");
    if (!optionsList) return;

    optionsList.innerHTML = "";
    const variants = services[serviceName];

    // Check if this service has any variants
    if (Object.keys(variants).length === 0) {
      const noOptionsMsg = document.createElement('p');
      noOptionsMsg.textContent = 'No additional options available';
      noOptionsMsg.style.color = '#999';
      noOptionsMsg.style.fontStyle = 'italic';
      optionsList.appendChild(noOptionsMsg);
      return;
    }

    Object.keys(variants).forEach((variantKey) => {
      const variant = variants[variantKey];
      
      if (typeof variant === "object") {
        // Size-based pricing (like your consultation service)
        Object.keys(variant).forEach((size) => {
          const price = variant[size];
          const label = document.createElement("label");
          label.style.display = "block";
          label.style.marginBottom = "8px";
          label.style.padding = "8px";
          label.style.border = "1px solid #ddd";
          label.style.borderRadius = "4px";
          label.innerHTML = `
            <input type="checkbox" name="services-${cardIndex}" 
                   data-service="${serviceName}-${variantKey}-${size}" 
                   data-price="${price}"
                   style="margin-right: 8px;">
            <strong>${variantKey}</strong> (${size}): ₱${parseFloat(price).toFixed(2)}
          `;
          optionsList.appendChild(label);
        });
      } else if (typeof variant === "number") {
        // Flat pricing for simple variants
        const label = document.createElement("label");
        label.style.display = "block";
        label.style.marginBottom = "8px";
        label.style.padding = "8px";
        label.style.border = "1px solid #ddd";
        label.style.borderRadius = "4px";
        label.innerHTML = `
          <input type="checkbox" name="services-${cardIndex}" 
                 data-service="${serviceName}-${variantKey}" 
                 data-price="${variant}"
                 style="margin-right: 8px;">
          <strong>${variantKey}</strong>: ₱${parseFloat(variant).toFixed(2)}
        `;
        optionsList.appendChild(label);
      }
    });
  });
}

// ==============================
// SETUP SERVICE AND TIME LISTENERS
// ==============================
function setupServiceAndTimeListeners(index) {
  const serviceSelect = document.getElementById(`service-select-${index}`);
  const timeSelect = document.getElementById(`time-select-${index}`);
  const dateInput = document.getElementById(`appt-date-${index}`);
  const appointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${index}"]`);
  
  if (!serviceSelect || !timeSelect || !dateInput) return;
  
  serviceSelect.addEventListener('change', async () => {
    const selectedService = serviceSelect.value;
    
    if (selectedService) {
      // Load time slots
      await loadAvailableTimeSlotsForCard(serviceSelect, dateInput, timeSelect, index);
      
      // Show relevant additional service options
      const petSize = document.getElementById(`appt-size-${index}`)?.value.toLowerCase() || '';
      appointmentCard.querySelectorAll(".service-options").forEach((div) => (div.style.display = "none"));
      const matchingGroup = appointmentCard.querySelector(`.service-options[data-service="${selectedService.toLowerCase()}"]`);
      
      if (matchingGroup) {
        matchingGroup.style.display = "block";
        matchingGroup.querySelectorAll(`input[name="services-${index}"]`).forEach((cb) => {
          const label = cb.getAttribute("data-service")?.toLowerCase() || "";
          const parts = label.split("-");
          const sizeFromLabel = parts[2];
          cb.parentElement.style.display =
            sizeFromLabel && sizeFromLabel !== petSize ? "none" : "block";
        });
      }
    } else {
      timeSelect.innerHTML = '<option value="">-- Select Service First --</option>';
    }
    
    calculateServiceTotal();
  });
  
  timeSelect.addEventListener('change', () => {
    calculateServiceTotal();
  });
}

// ==============================
// SETUP REMOVE BUTTON LISTENERS
// ==============================
function setupRemoveButtonListeners() {
  document.addEventListener('click', function(e) {
    if (e.target.closest('.remove-appointment-btn')) {
      const button = e.target.closest('.remove-appointment-btn');
      const index = button.getAttribute('data-index');
      const appointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${index}"]`);
      
      if (appointmentCard) {
        const allCards = document.querySelectorAll('.appointment-card');
        if (allCards.length === 1) {
          alert("You must have at least one appointment.");
          return;
        }
        
        appointmentCard.remove();
        calculateServiceTotal();
        
        console.log(`✅ Removed appointment card with index: ${index}`);
      }
    }
  });
}

// ==============================
// GET ALL APPOINTMENTS DATA (IMPROVED)
// ==============================
function getAllAppointmentsData() {
  const appointments = [];
  
  const appointmentCards = document.querySelectorAll('.appointment-card');
  
  appointmentCards.forEach((appointmentCard) => {
    const index = appointmentCard.getAttribute('data-appointment-index');
    const appointmentInfo = appointmentCard.querySelector('.appointment-info');
    const petDropdown = appointmentCard.querySelector('.pet-dropdown');
    const selectedPetId = petDropdown ? petDropdown.value : '';
    
    if (!selectedPetId || selectedPetId === '') {
      console.log(`⏭️ Skipping appointment ${index} - no pet selected`);
      return;
    }
    
    const petName = appointmentInfo.querySelector(`#pet-name-${index}`)?.textContent || '';
    const petSize = appointmentInfo.querySelector(`#appt-size-${index}`)?.value || '';
    const serviceSelect = document.getElementById(`service-select-${index}`);
    const timeSelect = document.getElementById(`time-select-${index}`);
    const service = serviceSelect ? serviceSelect.value : '';
    const time = timeSelect ? timeSelect.value : '';
    
    if (!service || !time) {
      console.log(`⏭️ Skipping appointment ${index} - missing service or time`);
      return;
    }
    
    const selectedServices = [];
    const checkboxes = appointmentInfo.querySelectorAll(`input[name="services-${index}"]:checked`);
    checkboxes.forEach(checkbox => {
      selectedServices.push({
        id: checkbox.getAttribute('data-service'),
        name: checkbox.getAttribute('data-service').split('-').slice(1).join(' '),
        price: parseFloat(checkbox.getAttribute('data-price')) || 0
      });
    });
    
    // Only include appointment in billing if it has selected services
    if (selectedServices.length > 0) {
      const serviceFee = calculateServiceFeeForAppointment(appointmentInfo, index);
      
      appointments.push({
        index: index,
        petName,
        petSize,
        service,
        time,
        selectedServices,
        serviceFee: serviceFee,
        petId: selectedPetId
      });
      
      console.log(`✅ Added appointment ${index} to billing: ${petName} - ${service} - ${time} - ₱${serviceFee}`);
    } else {
      console.log(`⏭️ Skipping appointment ${index} - no services selected`);
    }
  });
  
  console.log(`📊 Total appointments for billing: ${appointments.length}`);
  return appointments;
}

// ==============================
// CALCULATE SERVICE FEE FOR SPECIFIC APPOINTMENT (FIXED - ONLY ADDITIONAL SERVICES)
// ==============================
function calculateServiceFeeForAppointment(appointmentInfo, containerIndex) {
  let total = 0;
  
  // ONLY calculate the selected additional services (checkboxes)
  // DO NOT add the main service price again
  
  const checkboxes = appointmentInfo.querySelectorAll(`input[name="services-${containerIndex}"]:checked`);
  
  console.log(`Calculating fee for appointment ${containerIndex}:`, {
    checkboxesCount: checkboxes.length
  });
  
  // Get ADDITIONAL services prices (checkboxes) - using data-price attribute
  checkboxes.forEach((checkbox) => {
    const price = parseFloat(checkbox.getAttribute('data-price')) || 0;
    total += price;
    console.log(`Additional service ${checkbox.getAttribute('data-service')}: ₱${price}`);
  });

  console.log(`Total fee for appointment ${containerIndex}: ₱${total}`);
  return total;
}

// ==============================
// GET SERVICE DURATION HELPER (UPDATED)
// ==============================
function getServiceDuration(serviceName) {
  if (!serviceName) return 30;
  const normalized = serviceName.toLowerCase().trim();
  const duration = serviceDurations[normalized];
  console.log(`Duration for "${serviceName}" (normalized: "${normalized}") = ${duration || 30} minutes`);
  return duration || 30;
}

// ==============================
// UPDATE TOTAL AMOUNT FOR ALL APPOINTMENTS (FIXED - RESERVATION FEE ADDED INSTEAD OF DEDUCTED)
// ==============================
function updateTotalAmount() {
  const serviceFeeDisplay = document.getElementById("service-fee");
  const reservationFeeDisplay = document.getElementById("reservation-fee");
  const totalAmountDisplay = document.getElementById("total-amount");

  if (!serviceFeeDisplay || !reservationFeeDisplay || !totalAmountDisplay) return;

  const type = document.getElementById("Reservation-fee-type")?.value;
  const serviceFee = parseFloat(serviceFeeDisplay.textContent.replace(/[₱,]/g, "")) || 0;

  let reservationFee = 0;
  let totalAmount = serviceFee;

  if (type === "reservation-only") {
    reservationFee = 40;
    totalAmount = serviceFee + reservationFee; // ADD reservation fee instead of deducting
  } else if (type === "with-downpayment") {
    reservationFee = serviceFee / 2;
    totalAmount = serviceFee; // Total remains the same, reservation fee is part of it
  } else if (type === "with-full-payment") {
    reservationFee = 0;
    totalAmount = serviceFee;
  } else {
    reservationFee = 0;
    totalAmount = serviceFee;
  }

  reservationFeeDisplay.textContent = `₱${reservationFee.toFixed(2)}`;
  totalAmountDisplay.textContent = `₱${totalAmount.toFixed(2)}`;
  
  totalAmountDisplay.setAttribute('data-total', totalAmount);
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
// CALCULATE SERVICE TOTAL FOR ALL APPOINTMENTS (UPDATED - NO MAIN SERVICE IN DISPLAY)
// ==============================
function calculateServiceTotal() {
  const serviceFeeDisplay = document.getElementById("service-fee");
  const selectedServicesList = document.getElementById("selected-services-list");
  
  if (!serviceFeeDisplay || !selectedServicesList) return;

  let total = 0;
  selectedServicesList.innerHTML = "";

  const allAppointments = getAllAppointmentsData();
  
  // Check if ANY appointment has selected services
  const hasAnyServices = allAppointments.some(appt => appt.selectedServices.length > 0);
  
  if (allAppointments.length === 0 || !hasAnyServices) {
    selectedServicesList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No services selected yet. Please select additional services for your appointments.</p>';
    serviceFeeDisplay.textContent = '₱0.00';
    updateTotalAmount();
    return;
  }
  
  allAppointments.forEach((appointment, displayIndex) => {
    const appointmentFee = appointment.serviceFee;
    total += appointmentFee;
    
    const appointmentHeader = document.createElement('div');
    appointmentHeader.innerHTML = `<strong style="display: block; margin-top: 15px; margin-bottom: 8px; font-size: 16px; color: #333;">Appointment ${displayIndex + 1}: ${appointment.petName} - ${appointment.service} at ${formatTo12Hour(appointment.time)}</strong>`;
    selectedServicesList.appendChild(appointmentHeader);
    
    // Show only the additional services with individual prices
    if (appointment.selectedServices.length > 0) {
      appointment.selectedServices.forEach(service => {
        const item = document.createElement('div');
        item.innerHTML = `<span style="margin-left: 15px; color: #555;">• ${service.name}: ₱${service.price.toFixed(2)}</span>`;
        item.style.marginBottom = '5px';
        selectedServicesList.appendChild(item);
      });
    } else {
      const noServicesMsg = document.createElement('div');
      noServicesMsg.innerHTML = `<span style="margin-left: 15px; color: #999; font-style: italic;">No additional services selected</span>`;
      selectedServicesList.appendChild(noServicesMsg);
    }
    
    const appointmentTotal = document.createElement('div');
    appointmentTotal.innerHTML = `<strong style="display: block; margin-left: 15px; margin-top: 8px; margin-bottom: 15px; color: #4CAF50; font-size: 14px;">Subtotal: ₱${appointmentFee.toFixed(2)}</strong>`;
    selectedServicesList.appendChild(appointmentTotal);
    
    // Add separator between appointments
    if (displayIndex < allAppointments.length - 1) {
      const separator = document.createElement('hr');
      separator.style.margin = '10px 0';
      separator.style.border = 'none';
      separator.style.borderTop = '1px dashed #ddd';
      selectedServicesList.appendChild(separator);
    }
  });

  baseServiceFee = total;
  serviceFeeDisplay.textContent = `₱${total.toFixed(2)}`;
  updateTotalAmount();
}

// ==============================
// SETUP APPOINTMENT EVENT LISTENERS
// ==============================
function setupAppointmentEventListeners(appointmentInfo, containerIndex) {
  const checkboxes = appointmentInfo.querySelectorAll(`input[name="services-${containerIndex}"]`);
  
  checkboxes.forEach(cb => {
    cb.addEventListener('change', calculateServiceTotal);
  });
}

// ==============================
// SETUP PET DROPDOWN EVENT LISTENERS
// ==============================
function setupPetDropdownListeners() {
  // Use event delegation for dynamic elements
  document.addEventListener('change', function(e) {
    if (e.target && e.target.classList.contains('pet-dropdown')) {
      const dropdown = e.target;
      const appointmentIndex = dropdown.getAttribute('data-appointment-index');
      const selectedPetId = dropdown.value;
      const selectedPet = userPets.find(pet => pet.id === selectedPetId);
      
      if (selectedPet) {
        const appointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${appointmentIndex}"]`);
        const petNameElement = appointmentCard.querySelector(`#pet-name-${appointmentIndex}`);
        const apptSizeElement = appointmentCard.querySelector(`#appt-size-${appointmentIndex}`);
        
        if (petNameElement) petNameElement.textContent = selectedPet.petName;
        if (apptSizeElement) apptSizeElement.value = selectedPet.size || "";
        
        const serviceSelect = document.getElementById(`service-select-${appointmentIndex}`);
        const selectedService = serviceSelect ? serviceSelect.value : "";
        const petSize = (selectedPet.size || "").toLowerCase();
        
        appointmentCard.querySelectorAll(".service-options").forEach((div) => (div.style.display = "none"));
        const matchingGroup = appointmentCard.querySelector(`.service-options[data-service="${selectedService.toLowerCase()}"]`);
        
        if (matchingGroup) {
          matchingGroup.style.display = "block";
          matchingGroup.querySelectorAll(`input[name="services-${appointmentIndex}"]`).forEach((cb) => {
            const label = cb.getAttribute("data-service")?.toLowerCase() || "";
            const parts = label.split("-");
            const sizeFromLabel = parts[2];
            cb.parentElement.style.display =
              sizeFromLabel && sizeFromLabel !== petSize ? "none" : "block";
          });
        }
        
        calculateServiceTotal();
        
        console.log(`✅ Selected pet ${selectedPet.petName} for appointment ${appointmentIndex}`);
      } else {
        const appointmentCard = document.querySelector(`.appointment-card[data-appointment-index="${appointmentIndex}"]`);
        const petNameElement = appointmentCard.querySelector(`#pet-name-${appointmentIndex}`);
        const apptSizeElement = appointmentCard.querySelector(`#appt-size-${appointmentIndex}`);
        
        if (petNameElement) petNameElement.textContent = "No pet selected";
        if (apptSizeElement) apptSizeElement.value = "";
        
        calculateServiceTotal();
        
        console.log(`⏭️ Deselected pet for appointment ${appointmentIndex}`);
      }
    }
  });
}

// ==============================
// INITIALIZE SERVICE OPTIONS FOR APPOINTMENT
// ==============================
function initializeServiceOptionsForAppointment(appointmentCard, appointmentData, index) {
  const selectedService = (appointmentData.service || "").toLowerCase();
  const petSize = appointmentCard.querySelector(`#appt-size-${index}`)?.value.toLowerCase() || '';
  
  appointmentCard.querySelectorAll(".service-options").forEach((div) => (div.style.display = "none"));
  const matchingGroup = appointmentCard.querySelector(`.service-options[data-service="${selectedService}"]`);
  
  if (matchingGroup) {
    matchingGroup.style.display = "block";
    matchingGroup.querySelectorAll(`input[name="services-${index}"]`).forEach((cb) => {
      const label = cb.getAttribute("data-service")?.toLowerCase() || "";
      const parts = label.split("-");
      const sizeFromLabel = parts[2];
      cb.parentElement.style.display =
        sizeFromLabel && sizeFromLabel !== petSize ? "none" : "block";
    });
  }

  if (Array.isArray(appointmentData.selectedServices)) {
    appointmentData.selectedServices.forEach((service) => {
      const checkbox = appointmentCard.querySelector(`input[data-service="${service}"]`);
      if (checkbox) checkbox.checked = true;
    });
  }
}

// ==============================
// MAIN FLOW - INITIALIZE MULTIPLE APPOINTMENTS
// ==============================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadUserPets();
    await loadServiceDurations();
    await loadServicesFromFirestore();
  } catch (err) {
    console.error("Failed to load data:", err);
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

  const service = appointmentData.service || "";
  const serviceDuration = getServiceDuration(service);

  const normalizedAppointmentData = {
    petName: appointmentData.petName || "",
    petSize: appointmentData.petSize || "",
    petSpecies: appointmentData.petSpecies || "",
    ownerName: appointmentData.ownerName || "",
    ownerNumber: appointmentData.ownerNumber || "",
    service: service,
    date: appointmentData.date || "",
    time: appointmentData.startTime || appointmentData.time || "",
    selectedServices: appointmentData.selectedServices || [],
    duration: serviceDuration,
  };

  const appointmentsContainer = document.getElementById('appointments-container');
  appointmentsContainer.innerHTML = '';

  // Check if there's a pet in the original data
  let initialPet = { id: '', petName: "No pet selected", size: "", species: "" };
  if (appointmentData.petName) {
    const matchingPet = userPets.find(p => p.petName === appointmentData.petName);
    if (matchingPet) {
      initialPet = matchingPet;
    }
  }

  appointmentsContainer.innerHTML = createAppointmentCard(initialPet, normalizedAppointmentData, 0);
  appointmentCounter = 0;

  // Populate service dropdown for first card
  await populateServiceDropdown(0);
  
  // Populate service options for first card only
  await populateServiceOptionsForCard(0);
  
  // Set the service from appointment data
  const firstServiceSelect = document.getElementById('service-select-0');
  if (firstServiceSelect && service) {
    firstServiceSelect.value = service;
  }

  const firstAppointmentCard = document.querySelector('.appointment-card[data-appointment-index="0"]');
  if (firstAppointmentCard) {
    initializeServiceOptionsForAppointment(firstAppointmentCard, normalizedAppointmentData, 0);
    setupAppointmentEventListeners(firstAppointmentCard.querySelector('.appointment-info'), 0);
    setupServiceAndTimeListeners(0);
    
    // Load time slots for first appointment if service is selected
    if (service) {
      const dateInput = document.getElementById('appt-date-0');
      const timeSelect = document.getElementById('time-select-0');
      await loadAvailableTimeSlotsForCard(firstServiceSelect, dateInput, timeSelect, 0);
      
      // Try to set the time if it exists
      if (normalizedAppointmentData.time && timeSelect) {
        // Extract just the start time (HH:MM format)
        let timeValue = normalizedAppointmentData.time;
        if (timeValue.includes(' - ')) {
          timeValue = timeValue.split(' - ')[0].trim();
        }
        // Convert 12-hour to 24-hour format
        const match = timeValue.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          let hours = parseInt(match[1]);
          const minutes = match[2];
          const period = match[3].toUpperCase();
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          timeValue = `${String(hours).padStart(2, '0')}:${minutes}`;
        }
        
        // Set the value in the dropdown
        timeSelect.value = timeValue;
      }
    }
  }

  setupPetDropdownListeners();
  setupRemoveButtonListeners();
  addAppointmentButton();

  const feeTypeDropdown = document.getElementById("Reservation-fee-type");
  if (feeTypeDropdown) feeTypeDropdown.addEventListener("change", updateTotalAmount);
  
  calculateServiceTotal();
  
  console.log("✅ Appointment system initialized");
});

// ==============================
// CONFIRM BUTTON LOGIC (FIXED)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const confirmBtn = document.getElementById('confirm-btn');
  const modal = document.getElementById('paymentModal');
  const closeModal = document.getElementById('clase-modal');
  const receiptUpload = document.getElementById('receipt-upload');
  const bookBtn = document.getElementById('book-btn');

  if (confirmBtn && modal) {
    confirmBtn.addEventListener('click', () => {
      // Validate appointments before showing modal
      const allAppointments = getAllAppointmentsData();
      
      if (allAppointments.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'No Valid Appointments',
          text: 'Please select a pet, service, time, and at least one service option for each appointment.',
        });
        return;
      }

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
        const allAppointments = getAllAppointmentsData();
        
        if (allAppointments.length === 0) {
          await Swal.fire({
            icon: 'error',
            title: 'No Appointments',
            text: 'Please select a pet and complete all fields for at least one appointment.',
          });
          return;
        }

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          await Swal.fire({
            icon: 'error',
            title: 'User Not Found',
            text: 'Please log in again.',
          });
          return;
        }

        const timestamp = new Date().toISOString();
        
        const appointment = JSON.parse(sessionStorage.getItem("appointment")) || {};
        const firstAppointmentIndex = allAppointments[0].index;
        
        // Get owner information safely
        const name = document.querySelector(`#owner-name-${firstAppointmentIndex}`)?.textContent?.trim() || 
                    appointment.ownerName || 
                    "Customer";
        
        const ownerNumber = appointment.ownerNumber || "";
        const appointmentDate = document.getElementById(`appt-date-${firstAppointmentIndex}`)?.value || "";
        
        if (!appointmentDate) {
          await Swal.fire({
            icon: 'error',
            title: 'Missing Date',
            text: 'Please select an appointment date.',
          });
          return;
        }

        const reservationType = document.getElementById("Reservation-fee-type")?.value || "with-full-payment";
        const serviceFeeElement = document.getElementById("service-fee");
        const reservationFeeElement = document.getElementById("reservation-fee");
        const totalAmountElement = document.getElementById("total-amount");

        const serviceFee = serviceFeeElement ? parseFloat(serviceFeeElement.textContent.replace(/[₱,]/g, "")) || 0 : 0;
        const reservationFee = reservationFeeElement ? parseFloat(reservationFeeElement.textContent.replace(/[₱,]/g, "")) || 0 : 0;
        const totalAmount = totalAmountElement ? parseFloat(totalAmountElement.textContent.replace(/[₱,]/g, "")) || 0 : 0;

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

        console.log(`📝 Starting to save ${allAppointments.length} appointments...`);

        // Save each appointment
        for (let i = 0; i < allAppointments.length; i++) {
          const appt = allAppointments[i];
          const apptIndex = appt.index;
          
          const appointmentId = `${userId}_${timestamp}_${i}`.replace(/[:.]/g, '-');
          
          const timeSelect = document.getElementById(`time-select-${apptIndex}`);
          const selectedOption = timeSelect?.options[timeSelect.selectedIndex];
          const startTime24 = appt.time;
          const endTime24 = selectedOption?.dataset.endTime || "";
          
          const startTime = formatTo12Hour(startTime24);
          const endTime = endTime24 ? formatTo12Hour(endTime24) : "";

          // Find the selected pet
          const selectedPet = userPets.find(pet => pet.id === appt.petId);

          if (!selectedPet) {
            console.error(`❌ Pet not found for appointment ${i + 1}:`, appt.petId);
            await Swal.fire({
              icon: 'error',
              title: 'Pet Selection Error',
              text: `Could not find pet data for appointment ${i + 1}.`,
            });
            return;
          }

          // Prepare appointment data
          const appointmentDataToSave = {
            appointmentId,
            userId,
            name,
            ownerNumber,
            service: appt.service,
            startTime,
            endTime,
            date: appointmentDate,
            timestamp,
            status: "pending",
            petName: selectedPet.petName || "Unknown Pet",
            petSize: selectedPet.size || "",
            petSpecies: selectedPet.species || "",
            petBreed: selectedPet.breed || "",
            petAge: selectedPet.age || "",
            petSex: selectedPet.sex || "",
            petWeight: selectedPet.weight || "",
            petId: selectedPet.id,
            vet: "Dr. Donna Doll Diones",
            instructions: "Please bring any recent medical records",
            reservationType,
            serviceFee: appt.serviceFee, // Use individual appointment fee
            reservationFee: reservationFee,
            totalAmount: totalAmount,
            selectedServices: appt.selectedServices,
            receiptImage: receiptBase64,
            appointmentIndex: i,
            totalAppointments: allAppointments.length,
            createdAt: serverTimestamp()
          };

          console.log(`💾 Saving appointment ${i + 1}:`, {
            appointmentId,
            petName: selectedPet.petName,
            service: appt.service,
            fee: appt.serviceFee
          });

          // Save to Firestore
          const appointmentRef = doc(db, "Appointment", appointmentId);
          await setDoc(appointmentRef, appointmentDataToSave);

          // Log activity
          await logActivity(userId, "Booked Appointment", `Booked ${appt.service} for ${selectedPet.petName}`);
          
          console.log(`✅ Saved appointment ${i + 1}: ${selectedPet.petName} - ${appt.service}`);
        }

        // Reload pets if needed
        if (window.PetManager?.loadPetsFromFirestore) {
          await window.PetManager.loadPetsFromFirestore();
        }

        // Close modal
        if (modal) modal.style.display = "none";

        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Appointments Booked!',
          text: `Successfully booked ${allAppointments.length} appointment(s).`,
          iconColor: 'var(--orange)',
          showConfirmButton: false,
          timer: 2000
        });

        // Clean up and redirect
        sessionStorage.removeItem("appointment");
        sessionStorage.removeItem("multiAppointments");
        
        window.location.href = "customer.html";

      } catch (error) {
        console.error("❌ Failed to book appointments:", error);
        
        // More detailed error message
        let errorMessage = 'Something went wrong. Please try again.';
        if (error.code === 'permission-denied') {
          errorMessage = 'Permission denied. Please check your Firebase rules.';
        } else if (error.code === 'not-found') {
          errorMessage = 'Database not found. Please contact support.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        await Swal.fire({
          icon: 'error',
          title: 'Booking Failed',
          text: errorMessage,
        });
      }
    });
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
        const allAppointments = getAllAppointmentsData();
        
        if (allAppointments.length === 0) {
          alert("No appointments with selected pets to print.");
          return;
        }
        
        let receiptContent = `
        <div style="font-family: Arial, sans-serif; padding:20px; max-width:600px; margin:auto;">
            <h2 style="text-align:center;">Veterinary Clinic Receipt</h2>
            <hr/>
        `;

        allAppointments.forEach((appt, index) => {
          receiptContent += `
            <h3>Appointment ${index + 1}</h3>
            <p><strong>Pet Name:</strong> ${appt.petName}</p>
            <p><strong>Pet Size:</strong> ${appt.petSize}</p>
            <p><strong>Service:</strong> ${appt.service}</p>
            <p><strong>Time:</strong> ${formatTo12Hour(appt.time)}</p>
            <p><strong>Service Fee:</strong> ₱${appt.serviceFee.toFixed(2)}</p>
            <hr/>
          `;
        });

        const serviceFee = document.getElementById("service-fee")?.textContent || "";
        const reservationFee = document.getElementById("reservation-fee")?.textContent || "";
        const totalAmount = document.getElementById("total-amount")?.textContent || "";

        receiptContent += `
            <p><strong>Total Service Fee:</strong> ${serviceFee}</p>
            <p><strong>Reservation Fee:</strong> ${reservationFee}</p>
            <p><strong>Total Amount Due:</strong> ${totalAmount}</p>
            <hr/>
            <p style="text-align:center; font-size:12px; color:gray;">
            Thank you for trusting our clinic!
            </p>
        </div>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
        <html>
            <head>
            <title>Receipt - Multiple Appointments</title>
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
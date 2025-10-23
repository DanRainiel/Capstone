        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
        import {
        getFirestore,
        deleteDoc,
        doc,
        getDoc,
        addDoc,
        updateDoc,
        setDoc,
        collection,      // <-- ADD THIS
        getDocs,         // <-- AND THIS
        query,
        serverTimestamp,
        onSnapshot,      // <-- ADD THIS FOR REAL-TIME UPDATES
        where
        } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";



        const firebaseConfig = {
        apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
        authDomain: "fir-demo-66ae2.firebaseapp.com",
        projectId: "fir-demo-66ae2",
        storageBucket: "fir-demo-66ae2.appspot.com",
        messagingSenderId: "505962707376",
        appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
        measurementId: "G-JYDG36FQMX"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

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

  

        async function loadUsername() {
        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            console.log("No user logged in.");
            return;
        }

        try {
            let userRef = doc(db, "users", userId);
            let userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
            userRef = doc(db, "Admin", userId);
            userSnap = await getDoc(userRef);
            }

            if (userSnap.exists()) {
            const data = userSnap.data();
            const username = data.name || "User";
            const email = data.email || "Email";

            sessionStorage.setItem("username", username);
            sessionStorage.setItem("email", email);

            const usernameElements = [
                document.getElementById("welcome-username"),
                document.getElementById("profile-username"),
                document.getElementById("profilepage-username"),
                document.getElementById("account-username")
            ];
            usernameElements.forEach(el => {
                if (el) el.textContent = username;
            });

            const emailElements = [
                document.getElementById("account-email")
            ];
            emailElements.forEach(el => {
                if (el) el.textContent = email;
            });

            } else {
            console.log("User document not found.");
            }
        } catch (error) {
            console.error("Error loading username:", error);
        }
        }
        loadUsername();

document.addEventListener("DOMContentLoaded", () => {
    const welcomeMsg = sessionStorage.getItem("welcomeMessage");
    if (welcomeMsg) {
        Swal.fire({
            title: '👋 Welcome!',
            html: `<p style="font-size: 16px; color: #01949A;">${welcomeMsg}</p>`,
            background: '#ffffff',
            icon: 'info',
            iconColor: '#f8732b',
            confirmButtonText: 'Let’s Go!',
            confirmButtonColor: '#f8732b',
            customClass: {
                popup: 'rounded-xl shadow-md',
                title: 'mt-2 text-lg',
                confirmButton: 'px-4 py-2'
            }
        });
        sessionStorage.removeItem("welcomeMessage");
    }
});


        if (sessionStorage.getItem("role") === "customer") {
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', () => {
            location.replace(location.href);
        });
        }

        // Dropdown menu
        window.toggleMenu = function () {
        const dropMenu = document.getElementById("subMenu");
        dropMenu.classList.toggle("openMenu");
        };

        // Logout modal logic
        document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById("logout-btn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutModal.style.display = "flex";
        });
    }

    if (cancelLogout) {
        cancelLogout.addEventListener("click", () => {
            logoutModal.style.display = "none";
        });
    }
if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
        // Hide the modal first
        logoutModal.style.display = "none";

        // Then show SweetAlert loading
        Swal.fire({
  title: "Logging you out...",
  html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <div class="custom-loader" style="
          width: 50px;
          height: 50px;
          border: 5px solid #ccc;
          border-top: 5px solid var(--background-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 15px;">
      </div>
      <span style="font-size: 14px; color: #ccc;">Please wait a moment</span>
    </div>
  `,
  background: "#fffff",
  color: "#1e1e1e",
  showConfirmButton: false,
  allowOutsideClick: false,
  customClass: {
    popup: 'rounded-xl shadow-lg'
  },
 
});
        // Proceed with logout after delay
        setTimeout(() => {
            sessionStorage.clear();
            location.replace("/index.html");
        }, 1200);
    });
} 

    window.addEventListener("click", (e) => {
        if (e.target === logoutModal) {
            logoutModal.style.display = "none";
        }
    });
});

        // Navbar tab logic
        document.addEventListener("DOMContentLoaded", () => {
        const tabs = document.querySelectorAll(".second-navbar nav a");
        const sections = document.querySelectorAll("section");
        const navbar = document.querySelector(".second-navbar");

        tabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
            e.preventDefault();
            const id = tab.id.replace("-tab", "");

            sections.forEach(section => {
                if (section.classList.contains('second-navbar')) return;
                section.style.display = (section.id === id || (id === "book" && section.id === "booking")) ? "block" : "none";
            });

            if (navbar) navbar.style.display = "flex";
            });
        });
        });



        document.addEventListener("DOMContentLoaded", () => {
            // Open modal when clicking on the button
            document.getElementById("lm-1").addEventListener("click", () => {
            document.getElementById("modal-1").style.display = "block";
            });

            document.getElementById("lm-2").addEventListener("click", () => {
            document.getElementById("modal-2").style.display = "block";
            });

            document.getElementById("lm-3").addEventListener("click", () => {
            document.getElementById("modal-3").style.display = "block";
            });

            document.getElementById("lm-4").addEventListener("click", () => {
            document.getElementById("modal-4").style.display = "block";
            });

            document.getElementById("lm-5").addEventListener("click", () => {
            document.getElementById("modal-5").style.display = "block";
            });

            document.getElementById("lm-6").addEventListener("click", () => {
            document.getElementById("modal-6").style.display = "block";
            });



            document.querySelectorAll(".modal-close").forEach(btn => {
            btn.addEventListener("click", () => {
                const modalId = btn.getAttribute("data-close");
                document.getElementById(modalId).style.display = "none";
            });
            });

            // Close when clicking outside modal-content
            window.addEventListener("click", (e) => {
            const modal = document.getElementById("modal-1");
            if (e.target === modal) {
                modal.style.display = "none"; //SUBMIT BUTTON LOGIC//     
                
                


            }
            });
        });
        

        

// Helper: convert "HH:MM AM/PM" or "HH:MM" into minutes since midnight
function toMinutes(timeStr) {
  if (!timeStr) return null;
  
  timeStr = timeStr.trim();
  let hours, minutes;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    // 12-hour format: "5:00 PM" or "9:30 AM"
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;
    
    [, hours, minutes] = match.map(m => m ? parseInt(m) : 0);
    const modifier = match[3].toUpperCase();
    
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  } else {
    // 24-hour format: "17:00"
    const parts = timeStr.split(":").map(Number);
    if (parts.length < 2) return null;
    [hours, minutes] = parts;
  }

  return hours * 60 + minutes;
}

// Ensure service durations are loaded and logged properly
let serviceDurations = {};

async function loadServiceDurations() {
  try {
    const servicesRef = collection(db, "Services");
    const snapshot = await getDocs(servicesRef);

    serviceDurations = {};
    snapshot.forEach(docSnap => {
      const service = docSnap.data();
      console.log("🔍 Service doc:", docSnap.id, service); // DEBUG
      
      if (service.name && service.duration) {
        const normalizedName = service.name.toLowerCase();
        serviceDurations[normalizedName] = service.duration;
        console.log(`✅ Added: ${normalizedName} = ${service.duration} mins`); // DEBUG
      } else {
        console.warn(`⚠️ Missing name or duration for:`, service); // DEBUG
      }
    });

    console.log("✅ Service durations final:", serviceDurations); // DEBUG
  } catch (err) {
    console.error("❌ Error loading service durations:", err);
  }
}

// Load BEFORE the appointment form tries to use it
document.addEventListener("DOMContentLoaded", async () => {
  await loadServiceDurations(); // This MUST complete before form loads
  
  // Then load the form
  const appointmentForm = document.getElementById("appointment-form");
  if (appointmentForm) {
    // Form initialization here
  }
});

// When getting duration, use this helper with better fallback
function getServiceDuration(serviceName) {
  if (!serviceName) return 30;
  
  const normalized = serviceName.toLowerCase().trim();
  const duration = serviceDurations[normalized];
  
  console.log(`🕒 Getting duration for "${serviceName}" (normalized: "${normalized}") = ${duration || 30}`);
  
  return duration || 30;
} 

async function isTimeSlotAvailable(date, startTime, serviceDuration) {
  try {
    const startMinutes = toMinutes(startTime);
    const endMinutes = startMinutes + serviceDuration;

    console.log(`🔍 Checking slot: ${startTime} (${startMinutes}-${endMinutes})`);

    // ✅ Query all appointments for that date
    const q = query(collection(db, "Appointment"), where("date", "==", date));
    const snap = await getDocs(q);

    if (snap.empty) {
      console.log("✅ No existing appointments on this date");
      return true;
    }

    for (const docSnap of snap.docs) {
      const appt = docSnap.data();
      if (!appt.time || typeof appt.time !== "string") continue;

      // ✅ Expect format like "10:00 AM - 12:00 PM"
      if (!appt.time.includes(" - ")) continue;

      const [apptStartStr, apptEndStr] = appt.time.split(" - ").map(s => s.trim());
      const apptStart = toMinutes(apptStartStr);
      const apptEnd = toMinutes(apptEndStr);

      // ⚠️ Skip invalid entries
      if (isNaN(apptStart) || isNaN(apptEnd)) continue;

      // ⛔ Overlap check
      const overlap =
        startMinutes < apptEnd && endMinutes > apptStart;

      if (overlap) {
        console.warn(`⛔ BLOCKED: ${appt.time} overlaps with ${startTime}`);
        return false;
      }
    }

    console.log(`✅ Slot available: ${startTime}`);
    return true;

  } catch (err) {
    console.error("❌ Error checking time slot:", err);
    return false;
  }
}
  
//PET FORM//
document.addEventListener("DOMContentLoaded", async () => {
    await loadServiceDurations();
    // -----------------------------
    // DOM Elements
    // -----------------------------
    const appointmentForm = document.getElementById("appointment-form");
    const apptNameInput = document.getElementById("appt-name");
    const apptNumberInput = document.getElementById("appt-number");
    const apptPetNameInput = document.getElementById("appt-petname");
    const apptSpeciesInput = document.getElementById("appt-species");
    const apptBreedInput = document.getElementById("appt-breed"); 
    const apptWeightInput = document.getElementById("appt-weight");
    const apptSizeInput = document.getElementById("appt-size");
    const apptSexInput = document.getElementById("appt-sex");
    const apptServiceInput = document.getElementById("appt-service");
    const apptDateInput = document.getElementById("appt-date");
    const apptTimeInput = document.getElementById("appt-time");

    if (!appointmentForm) return console.error("❌ appointment-form not found in DOM");



async function loadAvailableTimeSlots() {
  try {
    const clinicSnap = await getDocs(collection(db, "ClinicSettings"));
    if (clinicSnap.empty) return console.warn("No clinic hours found!");

    const clinicData = clinicSnap.docs[0].data();
    const weekdayHours = clinicData.weekdayHours;
    const saturdayHours = clinicData.saturdayHours;

    const selectedDate = apptDateInput.value;
    const selectedService = apptServiceInput.value;
    
    if (!selectedDate || !selectedService) return;

    const day = new Date(selectedDate).getDay();
    if (day === 0) {
      apptTimeInput.innerHTML = `<option value="">Closed on Sundays</option>`;
      return;
    }

    const start = day === 6 ? toMinutes(saturdayHours.start) : toMinutes(weekdayHours.start);
    const end = day === 6 ? toMinutes(saturdayHours.end) : toMinutes(weekdayHours.end);

    // ✅ Get the correct service duration from Firestore
    const serviceDuration = getServiceDuration(selectedService);
    console.log(`📅 Generating slots for ${selectedService}: ${serviceDuration} mins each`);

    apptTimeInput.innerHTML = `<option value="">-- Select Time --</option>`;

    // ✅ Loop by service duration intervals - no hardcoded 30 mins
    for (let t = start; t < end; t += serviceDuration) {
      const nextT = t + serviceDuration;
      
      // Skip if service would extend past closing time
      if (nextT > end) break;

      const startHours = Math.floor(t / 60);
      const startMinutes = t % 60;
      const endHours = Math.floor(nextT / 60);
      const endMinutes = nextT % 60;

      const timeValue = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`;
      const startLabel = formatTo12Hour(timeValue);
      const endLabel = formatTo12Hour(`${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`);

      // ✅ Pass the correct duration to availability check
      const isAvailable = await isTimeSlotAvailable(selectedDate, timeValue, serviceDuration);

      const option = document.createElement("option");
      option.value = timeValue;
      option.textContent = `${startLabel} - ${endLabel}${!isAvailable ? ' (Unavailable)' : ''}`;
      option.disabled = !isAvailable;
      apptTimeInput.appendChild(option);

      console.log(`  Slot: ${startLabel} - ${endLabel} | Available: ${isAvailable}`);
    }

  } catch (err) {
    console.error("Error loading time slots:", err);
  }
}


    function getSizeFromWeight(weight) {
        if (weight < 10) return "Small";
        if (weight >= 10 && weight < 25) return "Medium";
        if (weight >= 25 && weight < 40) return "Large";
        return "Extra Large";
    }

   

    const speciesListEl = document.getElementById("speciesList");
    Object.keys(speciesBreeds).forEach(specie => {
        const option = document.createElement("option");
        option.value = specie.charAt(0).toUpperCase() + specie.slice(1);
        speciesListEl.appendChild(option);
    });

    apptSpeciesInput.addEventListener("input", (e) => {
        const value = e.target.value.trim().toLowerCase();
        const breedList = document.getElementById("breedList");
        breedList.innerHTML = "";

        if (speciesBreeds[value]) {
            speciesBreeds[value].forEach(breed => {
                const option = document.createElement("option");
                option.value = breed;
                breedList.appendChild(option);
            });
            apptBreedInput.disabled = false;
        } else {
            apptBreedInput.disabled = true;
        }
    });

    apptWeightInput.addEventListener("input", () => {
        const weight = parseFloat(apptWeightInput.value);
        if (!isNaN(weight)) {
            apptSizeInput.value = getSizeFromWeight(weight);
        } else {
            apptSizeInput.value = "";
        }
    });

    const currentUserId = sessionStorage.getItem("currentUserId");
    const currentUserName = sessionStorage.getItem("userName");

    if (!currentUserId && !currentUserName) {
        console.warn("⚠️ No current user found. Fullname and pets will not be loaded.");
    } else {
        try {
            let userQuery;
            if (currentUserId) {
                userQuery = query(collection(db, "users"), where("userId", "==", currentUserId));
            } else {
                userQuery = query(collection(db, "users"), where("name", "==", currentUserName));
            }

            const userSnap = await getDocs(userQuery);
            if (!userSnap.empty) {
                const userData = userSnap.docs[0].data();
              apptNameInput.value = userData.fullName || currentUserName || "";

            }

            const petsQuery = query(collection(db, "Pets"), where("ownerId", "==", currentUserId || currentUserName));

            onSnapshot(petsQuery, (snapshot) => {
                apptPetNameInput.innerHTML = `<option value="">-- Select Pet --</option>`;
                snapshot.forEach(docSnap => {
                    const pet = docSnap.data();
                    const option = document.createElement("option");
                    option.value = docSnap.id;
                    option.textContent = pet.petName || "Unnamed Pet";
                    option.dataset.petName = pet.petName || "";
                    apptPetNameInput.appendChild(option);
                });
            });

            // ✅ Modified block starts here
            apptPetNameInput.addEventListener("change", async (e) => {
                const petId = e.target.value;
                if (!petId) {
                    apptSpeciesInput.value = "";
                    apptBreedInput.value = "";
                    apptSexInput.value = "";
                    apptWeightInput.value = "";
                    apptSizeInput.value = "";

                    apptSpeciesInput.disabled = false;
                    apptSexInput.disabled = false;
                    apptSpeciesInput.style.backgroundColor = "";
                    apptSexInput.style.backgroundColor = "";
                    return;
                }

                try {
                    const petDoc = await getDoc(doc(db, "Pets", petId));
                    if (petDoc.exists()) {
                        const petData = petDoc.data();
                        apptSpeciesInput.value = petData.species || "";
                        apptBreedInput.value = petData.breed || "";
                        apptSexInput.value = petData.sex || "";
                        apptWeightInput.value = petData.weight || "";
                        apptSizeInput.value = petData.size || getSizeFromWeight(petData.weight);

                        // 🟢 Grey out species and sex
                        apptSpeciesInput.disabled = true;
                        apptSexInput.disabled = true;
                        apptSpeciesInput.style.backgroundColor = "#e9ecef";
                        apptSexInput.style.backgroundColor = "#e9ecef";
                    } else {
                        console.warn("❌ Pet not found for ID:", petId);
                    }
                } catch (err) {
                    console.error("Error loading pet details:", err);
                }
            });
            // ✅ Modified block ends here

        } catch (err) {
            console.error("Error fetching user or pets:", err);
        }
    }

    if (apptDateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const minDate = `${yyyy}-${mm}-${dd}`;

        apptDateInput.setAttribute("min", minDate);
        apptDateInput.value = minDate;
    }

    apptDateInput.addEventListener("change", loadAvailableTimeSlots);
    apptServiceInput.addEventListener("change", loadAvailableTimeSlots);
    await loadAvailableTimeSlots();

// Add this function before the form submit event listener

// ✅ Check for appointment overlap
async function checkForOverlappingAppointments(selectedDate, selectedTime, serviceDuration) {
  try {
    const q = query(collection(db, "Appointment"), where("date", "==", selectedDate));
    const snapshot = await getDocs(q);

    const selectedMinutes = toMinutes(selectedTime);
    const selectedEndMinutes = selectedMinutes + serviceDuration;

    let overlappingAppointments = [];

    snapshot.forEach(docSnap => {
      const appt = docSnap.data();
      
      if (!appt.startTime || !appt.endTime) return;

      // Convert appointment times to 24-hour format then to minutes
      const aptStartStr = appt.startTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      const aptEndStr = appt.endTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

      if (!aptStartStr || !aptEndStr) return;

      let aptStartHour = parseInt(aptStartStr[1]);
      let aptStartMin = parseInt(aptStartStr[2]);
      const aptStartPeriod = aptStartStr[3].toUpperCase();

      if (aptStartPeriod === "PM" && aptStartHour !== 12) aptStartHour += 12;
      if (aptStartPeriod === "AM" && aptStartHour === 12) aptStartHour = 0;
      const aptStartMinutes = aptStartHour * 60 + aptStartMin;

      let aptEndHour = parseInt(aptEndStr[1]);
      let aptEndMin = parseInt(aptEndStr[2]);
      const aptEndPeriod = aptEndStr[3].toUpperCase();

      if (aptEndPeriod === "PM" && aptEndHour !== 12) aptEndHour += 12;
      if (aptEndPeriod === "AM" && aptEndHour === 12) aptEndHour = 0;
      const aptEndMinutes = aptEndHour * 60 + aptEndMin;

      // Check for overlap: selected slot overlaps if it starts before apt ends AND ends after apt starts
      const hasOverlap = selectedMinutes < aptEndMinutes && selectedEndMinutes > aptStartMinutes;

      if (hasOverlap) {
        overlappingAppointments.push({
          petName: appt.petName || "Unknown Pet",
          ownerName: appt.name || "Unknown Owner",
          startTime: appt.startTime,
          endTime: appt.endTime,
          service: appt.service || "Unknown Service"
        });
      }
    });

    return overlappingAppointments;
  } catch (err) {
    console.error("Error checking overlapping appointments:", err);
    return [];
  }
}

// ✅ Update the form submit event listener to include overlap check

appointmentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedDate = apptDateInput.value;
  const selectedTime = apptTimeInput.value;
  const formattedTime = formatTo12Hour(selectedTime);
  const selectedService = apptServiceInput.value;

  const todayDate = new Date().toISOString().split("T")[0];
  if (selectedDate === todayDate) {
    await Swal.fire({
      icon: "warning",
      title: "Same-Day Booking Not Allowed",
      text: "You cannot create an appointment for today. Please choose another date.",
      confirmButtonColor: "#f8732b"
    });
    return;
  }

  try {
    const clinicSnap = await getDocs(collection(db, "ClinicSettings"));
    if (clinicSnap.empty) throw new Error("Clinic hours not found");

    const clinicData = clinicSnap.docs[0].data();
    const weekdayHours = clinicData.weekdayHours;
    const saturdayHours = clinicData.saturdayHours;

    const appointmentDay = new Date(selectedDate).getDay();
    if (appointmentDay === 0) {
      await Swal.fire({
        icon: "warning",
        title: "Closed on Sundays",
        text: "Appointments cannot be scheduled on Sundays.",
        confirmButtonColor: "#f8732b"
      });
      return;
    }

    const clinicStart = (appointmentDay === 6) ? saturdayHours.start : weekdayHours.start;
    const clinicEnd = (appointmentDay === 6) ? saturdayHours.end : weekdayHours.end;

    const selectedMinutes = toMinutes(selectedTime);
    const serviceDuration = serviceDurations[selectedService?.toLowerCase?.()] || 30;
    const endMinutes = selectedMinutes + serviceDuration;

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, "0")}:${String(endMins).padStart(2, "0")}`;
    const formattedEndTime = formatTo12Hour(endTime);

    if (selectedMinutes < toMinutes(clinicStart) || endMinutes > toMinutes(clinicEnd)) {
      await Swal.fire({
        icon: "error",
        title: "Outside Clinic Hours",
        text: `This service (${serviceDuration} mins) would extend beyond clinic hours.`,
        confirmButtonColor: "#f8732b"
      });
      return;
    }

    const blockedSnap = await getDocs(query(collection(db, "BlockedSlots"), where("date", "==", selectedDate)));
    let isBlocked = false;
    let reason = "";
    
    blockedSnap.forEach(docSnap => {
      const block = docSnap.data();
      const blockStart = toMinutes(block.startTime);
      const blockEnd = toMinutes(block.endTime);
      
      if (
        (selectedMinutes >= blockStart && selectedMinutes < blockEnd) ||
        (endMinutes > blockStart && endMinutes <= blockEnd) ||
        (selectedMinutes <= blockStart && endMinutes >= blockEnd)
      ) {
        isBlocked = true;
        reason = block.reason || "Unavailable";
      }
    });

    if (isBlocked) {
      await Swal.fire({
        icon: "error",
        title: "Time Slot Blocked",
        text: `This time is unavailable (${reason}).`,
        confirmButtonColor: "#f8732b"
      });
      return;
    }

    // ✅ NEW: Check for overlapping appointments
    const overlappingAppointments = await checkForOverlappingAppointments(selectedDate, selectedTime, serviceDuration);
    
    if (overlappingAppointments.length > 0) {
      let conflictList = overlappingAppointments.map(apt => 
        `<div style="margin: 8px 0; padding: 8px; background: #fff3cd; border-left: 3px solid #ffc107; border-radius: 3px;">
          <strong>${apt.petName}</strong> (${apt.ownerName})<br/>
          <small>${apt.startTime} - ${apt.endTime}</small>
        </div>`
      ).join('');

      await Swal.fire({
        icon: "error",
        title: "Time Slot Conflict",
        html: `<p>This time slot overlaps with existing appointments:</p>${conflictList}`,
        confirmButtonColor: "#f8732b",
        confirmButtonText: "Select Another Time"
      });
      await loadAvailableTimeSlots();
      return;
    }

    const stillAvailable = await isTimeSlotAvailable(selectedDate, selectedTime, serviceDuration);
    if (!stillAvailable) {
      await Swal.fire({
        icon: "error",
        title: "Time Slot No Longer Available",
        text: "This slot was just booked. Please select another time.",
        confirmButtonColor: "#f8732b"
      });
      await loadAvailableTimeSlots();
      return;
    }

    const appointmentData = {
      userId: currentUserId || currentUserName,
      vet: "Dr. Donna Doll Diones",
      service: selectedService,
      status: "pending",
      date: selectedDate,
      startTime: formattedTime,
      endTime: formattedEndTime,
      duration: serviceDuration,
      serviceFee: `₱${(0).toFixed(2)}`,
      totalAmount: `₱${(0).toFixed(2)}`,
      timestamp: new Date().toISOString(),
      name: apptNameInput.value.trim(),
      ownerNumber: apptNumberInput.value?.trim() || "",
      petName:
        apptPetNameInput.options[apptPetNameInput.selectedIndex]?.dataset.petName ||
        apptPetNameInput.value.trim(),
      species: apptSpeciesInput.value.trim(),
      breed: apptBreedInput.value.trim(),
      weight: apptWeightInput.value.trim(),
      petSize: apptSizeInput.value.trim() || getSizeFromWeight(parseFloat(apptWeightInput.value)),
      sex: apptSexInput.value,
    };

    Swal.fire({
      title: "Processing...",
      text: "Please wait while we submit your appointment.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading()
    });

    setTimeout(() => {
      sessionStorage.setItem("appointment", JSON.stringify(appointmentData));

      Swal.fire({
        title: "Appointment Submitted!",
        text: "Your appointment has been saved. Redirecting to confirmation page...",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#f8732b"
      }).then(() => {
        window.location.href = "custConfirm.html";
      });
    }, 1500);

  } catch (err) {
    console.error("Error validating clinic hours/blocked slots:", err);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Could not verify clinic schedule. Please try again later.",
      confirmButtonColor: "#f8732b"
    });
  }
});


    // -----------------------------
    // Helper functions
    // -----------------------------
    function toMinutes(time) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }

    function formatTo12Hour(time) {
        if (!time) return "";
        let [h, m] = time.split(":").map(Number);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${String(m).padStart(2,"0")} ${ampm}`;
    }
});

function formatTo12HourMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHour = ((hours + 11) % 12) + 1;
  return `${displayHour}:${String(minutes).padStart(2, "0")} ${ampm}`;
}


document.addEventListener("DOMContentLoaded", async () => {
    const apptNameInput = document.getElementById("appt-name");

    // Use the correct key
    const currentUserName = sessionStorage.getItem("userName");
    if (!currentUserName) {
        console.warn("No current user found. Fullname and pets will not be loaded.");
        return;
    }

    try {
        const userQuery = query(collection(db, "users"), where("name", "==", currentUserName));
        const userSnap = await getDocs(userQuery);

        if (!userSnap.empty) {
            const userData = userSnap.docs[0].data();
            console.log("User data fetched:", userData);

            // Autofill fullname
            apptNameInput.value = userData.fullName || currentUserName || "";
        } else {
            console.warn("No user found in Firestore with name:", currentUserName);
        }
    } catch (err) {
        console.error("Error fetching user:", err);
    }
});






document.getElementById("petSpecies").addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    const breedList = document.getElementById("breedList");
    breedList.innerHTML = "";

    if (speciesBreeds[value]) {
        speciesBreeds[value].forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        });
        // ✅ Enable breed input
        apptBreedInput.disabled = false;
    } else {
        apptBreedInput.disabled = true;
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const apptDateInput = document.getElementById("appt-date");

    const today = new Date();
    today.setDate(today.getDate() + 1); // tomorrow
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const minDate = `${yyyy}-${mm}-${dd}`;

    apptDateInput.setAttribute("min", minDate);
    apptDateInput.value = minDate; // optional: pre-select tomorrow
});

// Map buttons to Firestore service names
const modalServiceMap = {
  "lm-1": "Treatment",
  "lm-2": "consultation",
  "lm-3": "Vaccination",
  "lm-4": "Grooming",
  "lm-5": "Laboratory",
  "lm-6": "Deworming"
};

Object.keys(modalServiceMap).forEach(buttonId => {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const serviceName = modalServiceMap[buttonId];
    const modalId = "modal-" + buttonId.split("-")[1]; // lm-1 -> modal-1
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const priceContainer = modal.querySelector(".price-list");
    if (!priceContainer) return;
    priceContainer.innerHTML = ""; // Clear old prices

    try {
      const servicesCol = collection(db, "Services");
      const snapshot = await getDocs(servicesCol);

      let serviceData = null;
      snapshot.forEach(doc => {
        // Match by id or name
        if (doc.id.toLowerCase() === serviceName.toLowerCase() || (doc.data().name && doc.data().name.toLowerCase() === serviceName.toLowerCase())) {
          serviceData = doc.data();
        }
      });

      if (!serviceData) return;

      // If the service has variants
      if (serviceData.variants) {
        for (const [variantName, sizeMap] of Object.entries(serviceData.variants)) {
          priceContainer.innerHTML += `<p class="price-heading">${variantName.charAt(0).toUpperCase() + variantName.slice(1)}:</p>`;
          if (typeof sizeMap === "object") {
            for (const [size, price] of Object.entries(sizeMap)) {
              priceContainer.innerHTML += `<p class="price">${size.charAt(0).toUpperCase() + size.slice(1)}: <i class="fa-solid fa-peso-sign"></i> ${price}</p>`;
            }
          } else {
            priceContainer.innerHTML += `<p class="price"><i class="fa-solid fa-peso-sign"></i>${sizeMap}</p>`;
          }
        }
      } 
      // For services without variants but with regular prices
      else if (serviceData.regular) {
        priceContainer.innerHTML += `<p class="price-heading">Price:</p>`;
        for (const [size, price] of Object.entries(serviceData.regular)) {
          priceContainer.innerHTML += `<p class="price">${size.charAt(0).toUpperCase() + size.slice(1)}: <i class="fa-solid fa-peso-sign"></i> ${price}</p>`;
        }
      }

      // Show modal
      modal.style.display = "block";

    } catch (err) {
      console.error("Error loading service prices:", err);
    }
  });
});

// Close modal logic
document.querySelectorAll(".modal-close").forEach(btn => {
  btn.addEventListener("click", () => {
    const modalId = btn.getAttribute("data-close");
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = "none";
  });
});





// ================================
// 📌 Logic for Calendar Booking Button
// ================================
const bookBtn = document.getElementById("bookBtn");
if (bookBtn) {
    bookBtn.addEventListener("click", async () => {
        const selectedSlot = document.querySelector(".time-slot.selected")?.dataset.value || "09:00 AM";
        const today = new Date().toISOString().split("T")[0];
        const formattedTime = formatTo12Hour(selectedSlot);
        document.getElementById("petSpecies").addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    const breedList = document.getElementById("breedList");
    breedList.innerHTML = "";

    if (speciesBreeds[value]) {
        speciesBreeds[value].forEach(breed => {
            const option = document.createElement("option");
            option.value = breed;
            breedList.appendChild(option);
        });
        // ✅ Enable breed input
        apptBreedInput.disabled = false;
    } else {
        apptBreedInput.disabled = true;
    }
});

        const selectedService = document.getElementById("appt-service")?.value;
        const currentUser = document.getElementById("appt-number")?.value?.trim();

        try {
            const q = query(collection(db, "Appointment"), where("date", "==", today));
            const querySnapshot = await getDocs(q);

            let conflict = false;
            const newTime = toMinutes(formattedTime);

            querySnapshot.forEach(docSnap => {
                const existing = docSnap.data();
                const existingTime = toMinutes(existing.time);

                if (existingTime !== null && newTime !== null) {
                    // ❌ Block if same date + same time + same service
                    if (existingTime === newTime && existing.service === selectedService) {
                        conflict = true;
                    }
                    // ❌ Block if same user books same slot + same service
                    if (existingTime === newTime && existing.service === selectedService && existing.number === currentUser) {
                        conflict = true;
                    }
                }
            });

            if (conflict) {
                await Swal.fire({
                    icon: "error",
                    title: "Slot Unavailable",
                    text: "This time slot with the same service is already booked. Please choose another.",
                    confirmButtonColor: "#f8732b"
                });
                return;
            }

            // 🔽 Scroll smoothly to booking section
            document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });

        } catch (error) {
            console.error("Error checking slot:", error);
            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Unable to check slot availability. Please try again.",
                confirmButtonColor: "#f8732b"
            });
        }
    });
}

// helper to format time nicely
function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = ((hour + 11) % 12 + 1);
  return `${formattedHour}:${m} ${ampm}`;
}



const opHoursEl = document.querySelector(".opHours");

// Load hours from Firestore
async function loadClinicHours() {
  const settingsDocRef = doc(db, "ClinicSettings", "schedule");

  // listen in real-time so changes reflect immediately
  onSnapshot(settingsDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const weekday = data.weekdayHours 
        ? `${formatTime(data.weekdayHours.start)} - ${formatTime(data.weekdayHours.end)}`
        : "Closed";
      const saturday = data.saturdayHours 
        ? `${formatTime(data.saturdayHours.start)} - ${formatTime(data.saturdayHours.end)}`
        : "Closed";

      opHoursEl.textContent = `Mon-Fri: ${weekday} | Sat: ${saturday}`;
    } else {
      opHoursEl.textContent = "Hours not set";
    }
  });
}


// run on load
loadClinicHours();



 // ===== GLOBALS =====
let currentDate = new Date();
let selectedDate = null;
let selectedTimeSlot = null;
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let appointments = {}; // Firestore appointments
let blockedSlots = []; // Firestore blocked slots
let clinicOpen = "09:00";
let clinicClose = "17:30";

function normalizeTimeFormat(timeString) {
  if (!timeString) return "";
  
  // Convert to Date object to handle both "12:00" and "12:00 PM" formats
  let date = new Date(`1970-01-01T${timeString}`);
  
  // If it's invalid, try to parse as 12-hour time manually
  if (isNaN(date.getTime())) {
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (match) {
      let [, hours, minutes, period] = match;
      hours = parseInt(hours);
      minutes = parseInt(minutes);
      if (period) {
        period = period.toUpperCase();
        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;
      }
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    }
  }
  
  return date.toTimeString().slice(0,5); // "HH:MM"
}



function generateTimeSlots(startTime, endTime, duration) {
  const slots = [];
  let [startHour, startMin] = startTime.split(":").map(Number);
  let [endHour, endMin] = endTime.split(":").map(Number);

  const start = new Date();
  start.setHours(startHour, startMin, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMin, 0, 0);

  let current = new Date(start);

while (current.getTime() < end.getTime()) {
  let next = new Date(current.getTime() + duration * 60000);
  if (next.getTime() > end.getTime()) break; // don't overflow past end
  slots.push(
    `${current.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ` +
    `${next.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
  );
  current = next;
}

  return slots;
}


const timeSlots = generateTimeSlots(clinicOpen, clinicClose, 30);

// ===== FIXED TIME HELPERS =====
function timeToMinutes(t) {
  if (!t) return NaN;
  
  // Handle 12-hour format with AM/PM (e.g., "2:00 PM" or "2:00PM")
  if (/am|pm/i.test(t)) {
    const match = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return NaN;
    
    let [, hour, minute, suffix] = match;
    hour = parseInt(hour);
    minute = parseInt(minute);
    
    if (suffix.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (suffix.toUpperCase() === 'AM' && hour === 12) hour = 0;
    
    return hour * 60 + minute;
  }
  
  // Handle 24-hour format (e.g., "14:00")
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatTo12Hour(timeStr) {
  if (/am|pm/i.test(timeStr)) return timeStr.toUpperCase();
  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

// FIXED: loadAppointmentsFromFirestore
async function loadAppointmentsFromFirestore() {
  appointments = {};
  selectedDate = null;
  selectedTimeSlot = null;

  const uid = sessionStorage.getItem("userId");
  if (!uid) return console.error("No user ID in sessionStorage");

  const snapshot = await getDocs(collection(db, "Appointment"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const dateStr = formatDate(new Date(data.date));
    
    if (!appointments[dateStr]) appointments[dateStr] = [];
    
    // ✅ Make sure we're capturing startTime and endTime correctly
    appointments[dateStr].push({
      id: docSnap.id,
      time: data.time || data.startTime,  // fallback to startTime if time doesn't exist
      startTime: data.startTime || data.time || "",  // ✅ explicitly grab startTime
      endTime: data.endTime || "",  // ✅ explicitly grab endTime
      petName: data.petName || "Unknown Pet",
      type: data.service || "unknown",  // use 'service' field if 'type' doesn't exist
      owner: data.name || data.ownerName || "Unknown",
      phone: data.ownerNumber || data.number || data.ownerPhone || ""
    });

    console.log(`✅ Loaded appointment:`, {
      date: dateStr,
      petName: data.petName,
      startTime: data.startTime,
      endTime: data.endTime,
      service: data.service
    });
  });

  console.log("📅 All appointments:", appointments);
  updateCalendar();
  updateSidebar();
}

async function loadBlockedSlots() {
  blockedSlots = [];
  const snapshot = await getDocs(collection(db, "BlockedSlots"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const dateStr = data.date?.toDate ? formatDate(data.date.toDate()) : data.date;
    blockedSlots.push({
      id: docSnap.id,
      date: dateStr,
      startTime: data.startTime,
      endTime: data.endTime,
      reason: data.reason || "Blocked"
    });
  });
  console.log("Blocked slots:", blockedSlots);
}


// ===== CALENDAR =====
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function initCalendar() {
  updateCalendar();
  updateSidebar();
}

function updateCalendar() {
  const monthYear = document.getElementById('monthYear');
  const calendarGrid = document.getElementById('calendarGrid');
  monthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  calendarGrid.innerHTML = '';

  const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayHeaders.forEach(d => {
    const h = document.createElement('div');
    h.className = 'calendar-day-header';
    h.textContent = d;
    calendarGrid.appendChild(h);
  });

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
 const todayDay = new Date();
todayDay.setHours(0,0,0,0);

for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-day-cell empty';
    calendarGrid.appendChild(emptyCell);
}
for(let day=1; day<=daysInMonth; day++){
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = formatDate(cellDate);
    const cellDay = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());

    const dayCell = document.createElement('div');
    dayCell.className = 'calendar-day-cell';
    dayCell.innerHTML = `<div class="calendar-day-number">${day}</div>`;

    const dayAppointments = appointments[dateStr] || [];
    const dayBlocks = blockedSlots.filter(b=>b.date===dateStr);

    // ✅ Always block Sundays
    if(cellDay.getDay() === 0){ // Sunday
        dayCell.classList.add('blocked-day');
        dayCell.style.backgroundColor = '#ff4d4f';
        dayCell.style.pointerEvents = 'none';

        const badge = document.createElement('div');
        badge.className = 'calendar-blocked-badge';
        badge.textContent = 'Closed (Sunday)';
        dayCell.appendChild(badge);
    }
    // Fully blocked day
    else if(dayBlocks.length>0 && timeSlots.every(time=>dayBlocks.some(b=>time>=b.startTime && time<b.endTime))){
        dayCell.classList.add('blocked-day');
        dayCell.style.backgroundColor = '#ff4d4f';
        dayCell.style.pointerEvents = 'none';

        const badge = document.createElement('div');
        badge.className = 'calendar-blocked-badge';
        badge.textContent = 'Closed';
        dayCell.appendChild(badge);
    }
    // Partially blocked
    else if(dayBlocks.length > 0){
        dayCell.classList.add('partial-day');

        const badge = document.createElement('div');
        badge.className = 'calendar-partial-badge';
        badge.textContent = 'Partially Blocked';
        dayCell.appendChild(badge);
    }

    if(cellDay <= todayDay){  // include today
        dayCell.classList.add('past-day');
        dayCell.style.pointerEvents = 'none';
        dayCell.style.backgroundColor = '#d9d9d9'; // gray for past days
    }

    // Today highlight
    if(cellDay.getTime() === todayDay.getTime()) dayCell.classList.add('today');

  // Appointment count badge (deduplicated)
const uniqueAppointments = Array.from(new Map(dayAppointments.map(a => [a.id, a])).values());

if(uniqueAppointments.length > 0){
    const countBadge = document.createElement('div');
    countBadge.className='calendar-appointment-count';
    countBadge.textContent = uniqueAppointments.length;
    dayCell.appendChild(countBadge);
    dayCell.classList.add('has-appointments');
}


    // Available indicator only for future dates (exclude today & past)
    if(cellDay.getTime() > todayDay.getTime() && !dayCell.classList.contains('blocked-day')){
        const indicator = document.createElement('div');
        indicator.className = 'calendar-available-indicator';
        indicator.textContent='Available';
        dayCell.appendChild(indicator);

        // Make clickable
        dayCell.addEventListener('click', ()=>selectDate(cellDate));
    }

    // Selected day highlight
    if(selectedDate && cellDay.getTime() === selectedDate.getTime()){
        dayCell.classList.add('selected');
    }

    calendarGrid.appendChild(dayCell);
}


}


function getTypeDisplayName(type){
  const types = {
    consultation: "Consultation",
    vaccination: "Vaccination",
    grooming: "Grooming",
    treatment: "Treatment"
  };
  return types[type] || type;
}


// ===== SELECT DATE & SIDEBAR =====
function selectDate(date){
  selectedDate = date;
  selectedTimeSlot = null;
  updateCalendar();
  updateSidebar();
}

// ✅ Define your clinic settings globally
let clinicSettings = null;  // use let, not const


async function loadClinicSettings() {
  const docRef = doc(db, "ClinicSettings", "schedule");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    clinicSettings = snap.data();

    // Fallback if appointmentDuration is invalid
    if (isNaN(clinicSettings.appointmentDuration) || !clinicSettings.appointmentDuration) {
      clinicSettings.appointmentDuration = 30; // default 30 minutes
    }

    console.log("✅ Loaded clinic settings:", clinicSettings);
  } else {
    console.error("❌ No clinic settings found in Firestore");
  }
}

// FIXED updateSidebar function
function updateSidebar() {
  const selectedDateDiv = document.getElementById('selectedDate');
  const timeSlotsDiv = document.getElementById('timeSlots');
  const appointmentsListDiv = document.getElementById('appointmentsList');
  const bookBtn = document.getElementById('bookBtn');

  if (!selectedDate) {
    selectedDateDiv.textContent = 'Select a date to view appointments';
    timeSlotsDiv.innerHTML = '';
    appointmentsListDiv.innerHTML = '';
    bookBtn.disabled = true;
    return;
  }

  const dateStr = formatDate(selectedDate);
  const dayAppointments = appointments[dateStr] || [];
  const dayBlocks = blockedSlots.filter(b => b.date === dateStr);

  selectedDateDiv.textContent = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  function generateTimeSlotsForDate(date) {
    if (!clinicSettings) {
      console.warn("⚠️ Clinic settings not loaded yet");
      return [];
    }

    const appointmentDuration = clinicSettings.appointmentDuration || 30;
    if (!date || !appointmentDuration || isNaN(appointmentDuration)) {
      console.warn("⚠️ Cannot generate slots: invalid date or appointmentDuration");
      return [];
    }

    const day = date.getDay();
    let start, end;

    if (day === 0) return [];
    else if (day === 6 && clinicSettings.saturdayHours) {
      start = clinicSettings.saturdayHours.start || "08:00";
      end   = clinicSettings.saturdayHours.end   || "16:00";
    } else if (clinicSettings.weekdayHours) {
      start = clinicSettings.weekdayHours.start || "08:00";
      end   = clinicSettings.weekdayHours.end   || "18:00";
    } else {
      console.warn("⚠️ No clinic hours found for this day, using default 08:00–17:00");
      start = "08:00";
      end   = "17:00";
    }

    const slots = [];
    let current = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);

    while (current <= endMinutes - appointmentDuration) {
      slots.push(minutesToTime(current));
      current += appointmentDuration;
    }

    if (current === endMinutes) {
      slots.push(minutesToTime(current));
    }

    return slots;
  }

  // Helper: Convert 24h "HH:MM" to 12h format
  function to12Hour(time24) {
    if (!time24 || !/^\d{2}:\d{2}$/.test(time24)) return time24;
    const [h, m] = time24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }

  // Render all time slots
  timeSlotsDiv.innerHTML = '';
  const dynamicSlots = generateTimeSlotsForDate(selectedDate);

  if (dynamicSlots.length === 0) {
    timeSlotsDiv.innerHTML = '<p style="text-align:center;color:#6c757d;">No available slots for this day</p>';
  } else {
    dynamicSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'calendar-time-slot';
      timeSlot.textContent = to12Hour(time);

      const slotMinutes = timeToMinutes(time);
      const blockedEntry = dayBlocks.find(b => slotMinutes >= timeToMinutes(b.startTime) && slotMinutes < timeToMinutes(b.endTime));
      
      // Check if this time slot falls within any appointment's startTime - endTime range
      const isBooked = dayAppointments.some(a => {
        if (!a.startTime || !a.endTime) {
          console.warn("⚠️ Appointment missing time:", a);
          return false;
        }
        
        const aptStartTime24 = convertTo24Hour(a.startTime);
        const aptEndTime24 = convertTo24Hour(a.endTime);
        
        const aptStartMinutes = timeToMinutes(aptStartTime24);
        const aptEndMinutes = timeToMinutes(aptEndTime24);
        
        console.log(`Checking slot ${time} (${slotMinutes}min) vs Apt ${a.petName} ${a.startTime}-${a.endTime} (converted: ${aptStartTime24}-${aptEndTime24} = ${aptStartMinutes}-${aptEndMinutes}min)`);
        
        // Block if slot time is within appointment range (>= start AND <= end)
        // Using <= ensures the end time slot is also blocked
        const blocked = slotMinutes >= aptStartMinutes && slotMinutes <= aptEndMinutes;
        console.log(`  → ${blocked ? '✅ BLOCKED' : '❌ AVAILABLE'}`);
        return blocked;
      });

      if (blockedEntry) {
        timeSlot.classList.add('blocked');
        timeSlot.textContent += ` (${blockedEntry.reason})`;
        timeSlot.style.pointerEvents = 'none';
      } else if (isBooked) {
        timeSlot.classList.add('booked');
        timeSlot.textContent += ' (Booked)';
        timeSlot.style.pointerEvents = 'none';
      } else {
        timeSlot.addEventListener('click', () => selectTimeSlot(time));
      }

      if (selectedTimeSlot === time) timeSlot.classList.add('selected');
      timeSlotsDiv.appendChild(timeSlot);
    });
  }

  // Render appointments for the day
  appointmentsListDiv.innerHTML = '';
  let filteredAppointments = [...dayAppointments];

  if (selectedTimeSlot) {
    filteredAppointments = dayAppointments.filter(apt => {
      if (!apt.startTime) {
        console.warn("⚠️ Appointment missing startTime:", apt);
        return false;
      }
      const aptTime24 = convertTo24Hour(apt.startTime);
      console.log(`Comparing: ${aptTime24} === ${selectedTimeSlot}`);
      return aptTime24 === selectedTimeSlot;
    });
  }

  if (filteredAppointments.length > 0) {
    const seen = new Set();

    filteredAppointments.forEach(apt => {
      const key = `${apt.startTime}_${apt.petName}_${apt.owner}_${apt.type}`;
      if (seen.has(key)) return;
      seen.add(key);

      const div = document.createElement('div');
      div.className = 'calendar-appointment';

      // Make sure startTime exists, fallback to endTime or N/A
      const startFormatted = apt.startTime || apt.endTime || "Time Not Set";
      const endFormatted = apt.endTime || '';

      div.innerHTML = `
        <div class="calendar-appointment-time">⏰ ${startFormatted}${endFormatted ? ` - ${endFormatted}` : ''}</div>
        <div class="calendar-appointment-details">
          <strong>🐾 ${apt.petName}</strong> <span style="color:#555">(${apt.owner})</span>
          <div class="calendar-appointment-type calendar-type-${apt.type}">
            📌 ${getTypeDisplayName(apt.type)}
          </div>
          ${apt.phone ? `<div class="calendar-appointment-phone">📞 ${apt.phone}</div>` : ''}
        </div>
      `;

      div.addEventListener('click', () => {
        sessionStorage.setItem('selectedAppointmentId', apt.id);
      });

      appointmentsListDiv.appendChild(div);
    });
  } else {
    appointmentsListDiv.innerHTML = '<p style="text-align:center;color:#6c757d;">No appointments scheduled for this time</p>';
  }

  bookBtn.disabled = !selectedTimeSlot;
}

// Helper function to convert 12-hour time to 24-hour format
function convertTo24Hour(time12) {
  if (!time12 || typeof time12 !== 'string') {
    console.warn("⚠️ Invalid time input:", time12);
    return "";
  }
  
  // Handle "h:mm AM/PM" format
  const match = time12.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) {
    console.warn("⚠️ Could not parse time:", time12);
    return time12; // return as-is if format unrecognized
  }
  
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);
  period = period.toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  const result = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  console.log(`✅ Converted ${time12} → ${result}`);
  return result;
}




function selectTimeSlot(time){
  selectedTimeSlot = time;
  updateSidebar();
}

// ===== NAVIGATION =====
function navigateMonth(dir){
  currentMonth += dir;
  if(currentMonth<0){ currentMonth=11; currentYear--; }
  if(currentMonth>11){ currentMonth=0; currentYear++; }
  currentDate=new Date(currentYear,currentMonth,1);
  updateCalendar();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadClinicSettings();            // 🔹 load from Firestore
  await loadAppointmentsFromFirestore();
  await loadBlockedSlots();
  initCalendar();



  const bookBtn=document.getElementById('bookBtn');
  if(!bookBtn) return;

  bookBtn.addEventListener('click',async()=>{
    if(!selectedDate || !selectedTimeSlot){
      alert("Please select a date and time slot first!");
      return;
    }

    await applyClinicSchedule();

    const dateStr=formatDate(selectedDate);
    const dayBlocks = blockedSlots.filter(b=>b.date===dateStr);
    const slotMinutes=timeToMinutes(selectedTimeSlot);
    const isBlocked = dayBlocks.some(b=> slotMinutes>=timeToMinutes(b.startTime) && slotMinutes<timeToMinutes(b.endTime));
    const dayAppointments = appointments[dateStr] || [];
    const isBooked = dayAppointments.some(a=>a.time===selectedTimeSlot);
    const clinicStart=timeToMinutes(clinicOpen);
    const clinicEnd=timeToMinutes(clinicClose);
    const outsideHours = slotMinutes<clinicStart || slotMinutes>=clinicEnd;

    if(isBlocked || isBooked || outsideHours){
      let reason="";
      if(isBlocked) reason=` (${dayBlocks.find(b=>slotMinutes>=timeToMinutes(b.startTime)&&slotMinutes<timeToMinutes(b.endTime)).reason})`;
      else if(outsideHours) reason=" (Outside clinic hours)";
      alert(`That time is not available${reason}. Please pick another slot.`);
      return;
    }

    document.getElementById("appt-date").value = dateStr;
    document.getElementById("appt-time").value = selectedTimeSlot;
    const bookTab = document.getElementById("book-tab");
    if(bookTab) bookTab.click();
  });

  document.getElementById("prevMonthBtn").addEventListener("click",()=>navigateMonth(-1));
  document.getElementById("nextMonthBtn").addEventListener("click",()=>navigateMonth(1));
});

// 🐾 Auto compute size based on weight
function getSizeFromWeight(weight) {
  if (weight < 10) return "Small";          // < 10 kg
  if (weight >= 10 && weight < 25) return "Medium";   // 10–24.9 kg
  if (weight >= 25 && weight < 40) return "Large";    // 25–39.9 kg
  return "Extra Large";                     // >= 40 kg
}


// Attach listener once the form is loaded
document.addEventListener("DOMContentLoaded", () => {
  const weightInput = document.getElementById("petWeight");
  const sizeInput = document.getElementById("petSize"); // make sure you have this field

  if (weightInput && sizeInput) {
    weightInput.addEventListener("input", () => {
      const weight = parseFloat(weightInput.value);
      if (!isNaN(weight)) {
        sizeInput.value = getSizeFromWeight(weight);
      } else {
        sizeInput.value = "";
      }
    });
  }
});

const speciesInput = document.getElementById("petSpecies");
const breedInput = document.getElementById("petBreed");
const breedList = document.getElementById("breedList");

// Initialize breed input as disabled
breedInput.disabled = true;
breedInput.placeholder = "Select species first";

speciesInput.addEventListener("input", () => {
  const value = speciesInput.value.trim().toLowerCase();

  // Reset breed input
  breedInput.value = "";
  breedList.innerHTML = "";

  // ✅ Check if species is valid
  if (PetManager.availableSpecies.includes(value)) {
    breedInput.disabled = false; // <-- unblock
    breedInput.placeholder = "Type or select breed...";

    // Populate breed datalist
    const breeds = speciesBreeds[value] || [];
    breeds.forEach(b => {
      const option = document.createElement("option");
      option.value = b;
      breedList.appendChild(option);
    });
  } else {
    // Disable breed input if species invalid
    breedInput.disabled = true;
    breedInput.placeholder = "Select species first";
  }
});

// ================================
// ⏰ Generate Available Time Slots (Based on ClinicSettings)
// ================================
async function updateAvailableTimeSlots(date, serviceName, timeInput) {
  if (!date || !serviceName) return;

  try {
    // 🔹 Default hours (fallback)
    let clinicOpen = "08:00";
    let clinicClose = "18:00";

    // 🔹 Fetch clinic hours from Firestore (ClinicSettings collection)
    const clinicQuery = query(collection(db, "ClinicSettings"));
    const clinicSnap = await getDocs(clinicQuery);

    if (!clinicSnap.empty) {
      const data = clinicSnap.docs[0].data();
      clinicOpen = data.openingTime || clinicOpen;
      clinicClose = data.closingTime || clinicClose;
    }

    // 🔹 Service duration (default 30 minutes)
    const serviceDuration = serviceDurations[serviceName?.toLowerCase()] || 30;

    // 🔹 Helper functions
    const toMinutes = (t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const toTimeString = (mins) => {
      const h = String(Math.floor(mins / 60)).padStart(2, "0");
      const m = String(mins % 60).padStart(2, "0");
      return `${h}:${m}`;
    };

    // 🔹 Convert clinic hours to minutes
    const start = toMinutes(clinicOpen);
    const end = toMinutes(clinicClose);

    // 🔹 Generate time slot ranges — include last slot ending at closing time
    const slots = [];
    for (let t = start; t < end; t += serviceDuration) {
      const slotStart = toTimeString(t);
      const slotEnd = toTimeString(t + serviceDuration);

      // include slot if it ends on or before closing time
      if (toMinutes(slotEnd) <= end) {
        slots.push({ start: slotStart, end: slotEnd });
      } else {
        break;
      }
    }

    // 🔹 Clear old options
    timeInput.innerHTML = '<option value="" disabled selected>Select Time</option>';

    // 🔹 Get booked slots for the date/service
    const bookedSnap = await getDocs(
      query(
        collection(db, "Appointments"),
        where("date", "==", date),
        where("service", "==", serviceName)
      )
    );
    const bookedTimes = bookedSnap.docs.map((d) => d.data().time);

    // 🔹 Populate available slots
    slots.forEach(({ start, end }) => {
      const range = `${start}-${end}`;
      const opt = document.createElement("option");
      opt.value = range;
      opt.textContent = `${formatTo12Hour(start)} - ${formatTo12Hour(end)}`;

      if (bookedTimes.includes(range)) {
        opt.disabled = true;
        opt.textContent += " (Booked)";
      }

      timeInput.appendChild(opt);
    });
  } catch (err) {
    console.error("⚠️ Error generating available time slots:", err);
  }
}
  

// 🐾 PETS MANAGER //
const PetManager = {
  pets: [],
  currentEditId: null,
  currentDeleteId: null,
  currentBookingPet: null,
  currentEditAppointmentId: null,

  // ✅ store all available species here
  availableSpecies: [],

  speciesIcons: {
    dog: 'fas fa-dog',
    cat: 'fas fa-cat',
    bird: 'fas fa-dove',
    rabbit: 'fas fa-rabbit',
    hamster: 'fas fa-hamster',
    fish: 'fas fa-fish',
    other: 'fas fa-paw'
  },

  async init() {
    this.bindEvents();
    this.addAnimationStyles();
    await this.loadSpeciesFromFirestore();   // ✅ load species first
    await this.loadPetsFromFirestore();
  },

  // ✅ Load Species from Firestore
  async loadSpeciesFromFirestore() {
    try {
      const querySnapshot = await getDocs(collection(db, "Species"));
      this.availableSpecies = querySnapshot.docs.map(doc => doc.data().name.toLowerCase());

      // Fill datalist for typing suggestion
      const speciesList = document.getElementById("speciesList");
      speciesList.innerHTML = "";
      this.availableSpecies.forEach(specie => {
        const option = document.createElement("option");
        option.value = specie.charAt(0).toUpperCase() + specie.slice(1);
        speciesList.appendChild(option);
      });
    } catch (err) {
      console.error("Error loading species:", err);
    }
  },

  async loadPetsFromFirestore() {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return console.error("User not logged in.");

      const q = query(collection(db, "Pets"), where("ownerId", "==", userId));
      const querySnapshot = await getDocs(q);

      this.pets = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          petName: data.petName || '',
          species: data.species || 'other',
          ownerId: data.ownerId || userId,
          breed: data.breed || '',
          age: data.age ? parseInt(data.age) : 0,
          sex: data.sex || '',
          size: data.size || '',
          weight: data.weight ? parseFloat(data.weight) : null,
          color: data.color || '',
          medicalHistory: data.medicalHistory || '',
          createdAt: data.createdAt || null
        };
      });

      this.renderPets();
    } catch (error) {
      console.error("Error loading pets from Firestore:", error);
    }
  },

async addPetToFirestore(petData) {
  try {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const petId = `${userId}_${petData.petName}_${timestamp}`;

    await setDoc(doc(db, "Pets", petId), {
      ...petData,
      ownerId: userId,
      createdAt: new Date().toISOString()
    });

    this.closePetModal();
    await this.loadPetsFromFirestore(); // refresh list
  } catch (error) {
    console.error("Error adding pet:", error);
    alert("Failed to add pet.");
  }
},


  


  async updatePetInFirestore(petId, petData) {
    try {
      await updateDoc(doc(db, "Pets", petId), petData);
      this.closePetModal();
      await this.loadPetsFromFirestore();
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  },

  async deletePet() {
    if (!this.currentDeleteId) return;
    try {
      await deleteDoc(doc(db, "Pets", this.currentDeleteId));
      this.closeConfirmModal();
      await this.loadPetsFromFirestore();
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  },

renderPets() {
  const petsGrid = document.getElementById('petsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  const filteredPets = this.pets.filter(pet =>
    pet.petName.toLowerCase().includes(searchTerm) ||
    pet.species.toLowerCase().includes(searchTerm) ||
    (pet.ownerId && pet.ownerId.toLowerCase().includes(searchTerm)) ||
    (pet.breed && pet.breed.toLowerCase().includes(searchTerm))
  );

  if (filteredPets.length === 0) {
    petsGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  petsGrid.innerHTML = filteredPets.map(pet => `
    <div class="pet-card">
      <div class="pet-avatar">
        <i class="${this.speciesIcons[pet.species] || 'fas fa-paw'}"></i>
      </div>

      <div class="pet-info">
        <h3>${pet.petName}</h3>
        <div class="pet-details">
          <div class="pet-detail"><i class="fas fa-paw"></i> <span>${pet.species}</span></div>
          <div class="pet-detail"><i class="fas fa-dog"></i> <span>${pet.breed || 'N/A'}</span></div>
          <div class="pet-detail"><i class="fas fa-weight"></i> <span>${pet.weight ? pet.weight + " kg" : "N/A"}</span></div>
          <div class="pet-detail"><i class="fas fa-ruler-vertical"></i> <span>${pet.size || "N/A"}</span></div>
          <div class="pet-detail"><i class="fas fa-user"></i> <span>${pet.ownerId || 'N/A'}</span></div>
          <div class="pet-detail"><i class="fas fa-user-md"></i> <span>Vet: Dr. Donna Doll Diones</span></div>
          <div class="pet-detail"><i class="fas fa-calendar"></i> 
            <span>${pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'No date'}</span>
          </div>
        </div>

        <div class="pet-actions">
          <button class="pet-btn btn-edit" onclick="PetManager.editPet('${pet.id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="pet-btn btn-book" onclick="PetManager.bookAppointment('${pet.id}')"><i class="fas fa-calendar-plus"></i> Book</button>
          <button class="pet-btn btn-delete" onclick="PetManager.confirmDelete('${pet.id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>
      </div>
    </div>
  `).join('');
},



// ================================
// 📌 Show Add Pet Modal
// ================================
showAddPetModal() {
  this.currentEditId = null;
  document.getElementById("petForm").reset();

  document.getElementById("modalTitle").textContent = "Add Pet";
  document.getElementById("submitBtn").textContent = "Add Pet";

  document.getElementById("petModal").style.display = "flex";
},

submitPetForm(event) {
  event.preventDefault();

  const speciesInput = document.getElementById("petSpecies").value.trim().toLowerCase();
  const breedInput = document.getElementById("petBreed").value.trim();
  const weight = parseFloat(document.getElementById("petWeight").value);
  const size = !isNaN(weight) ? getSizeFromWeight(weight) : "";

  // ✅ validate species
  if (!this.availableSpecies.includes(speciesInput)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Species',
      text: 'Please select a species from the available list.',
      confirmButtonText: 'OK',
      customClass: { popup: 'swal2-popup-custom' }
    });
    return;
  }

  // ✅ validate breed only if species is valid
  if (breedInput && !speciesBreeds[speciesInput]?.includes(breedInput)) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Breed',
      text: 'Please select a valid breed for the chosen species.',
      confirmButtonText: 'OK'
    });
    return;
  }

  const petData = {
    petName: document.getElementById("petFormName").value.trim(),
    species: speciesInput,
    breed: breedInput || '',
    sex: document.getElementById("petSex").value.trim(),
    weight: weight || null,
    size: size
  };

  if (!petData.petName) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Name',
      text: 'Pet name is required.',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (!petData.weight) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Weight',
      text: 'Pet weight is required.',
      confirmButtonText: 'OK'
    });
    return;
  }

  if (this.currentEditId) {
    this.updatePetInFirestore(this.currentEditId, petData);
  } else {
    this.addPetToFirestore(petData);
  }
},






// ================================
// 📌 Edit Pet
// ================================
editPet(id) {
  const pet = this.pets.find((p) => p.id === id);
  if (!pet) return;

  this.currentEditId = id;

  document.getElementById("petFormName").value = pet.petName || "";
  document.getElementById("petSpecies").value = pet.species || "";
  document.getElementById("petBreed").value = pet.breed || "";
  document.getElementById("petSex").value = pet.sex || "";

  // ✅ Fill weight & recalc size
  document.getElementById("petWeight").value = pet.weight || "";
  document.getElementById("petSize").value = pet.weight ? getSizeFromWeight(pet.weight) : "";

  document.getElementById("modalTitle").textContent = "Edit Pet";
  document.getElementById("submitBtn").textContent = "Update Pet";

  document.getElementById("petModal").style.display = "flex";
},


// ================================
// 📌 Book Appointment (Updated to match new time format)
// ================================
async bookAppointment(id) {
  console.log("🔵 bookAppointment called with id:", id);
  
  const pet = this.pets.find(p => p.id === id);
  if (!pet) {
    console.error("❌ Pet not found with id:", id);
    return;
  }

  console.log("✅ Pet found:", pet);

  this.currentBookingPet = pet;
  this.currentEditAppointmentId = null;

  // 🔹 Check modal exists FIRST
  const modal = document.getElementById("appointmentModal");
  if (!modal) {
    console.error("❌ appointmentModal element not found in DOM!");
    alert("Error: Appointment form not found. Please refresh the page.");
    return;
  }

  // 🔹 Get all DOM elements with detailed logging
  console.log("🔍 Looking for form elements...");
  
  const petNameInput = document.getElementById("apptPetName");
  const ownerNameInput = document.getElementById("ownerName");
  const ownerPhoneInput = document.getElementById("ownerPhone");
  const serviceSelect = document.getElementById("appointmentService");
  const dateInput = document.getElementById("appointmentDate");
  const timeInput = document.getElementById("appointmentTime");
  const speciesInput = document.getElementById("apptSpecies");
  const breedInput = document.getElementById("apptBreed");
  const sexInput = document.getElementById("apptSex");
  const weightInput = document.getElementById("apptWeight");
  const sizeInput = document.getElementById("apptSize");

  // 🔹 Check for required elements
  const missingElements = [];
  if (!petNameInput) missingElements.push("apptPetName");
  if (!ownerNameInput) missingElements.push("ownerName");
  if (!ownerPhoneInput) missingElements.push("ownerPhone");
  if (!serviceSelect) missingElements.push("appointmentService");
  if (!dateInput) missingElements.push("appointmentDate");
  if (!timeInput) missingElements.push("appointmentTime");

  if (missingElements.length > 0) {
    console.error("❌ Required form elements not found:", missingElements);
    alert(`Error: Missing form fields: ${missingElements.join(", ")}. Please refresh the page.`);
    return;
  }

  // ✅ SHOW MODAL IMMEDIATELY
  modal.style.display = "flex";
  console.log("✅ Modal displayed");

  // 🔹 Populate Pet Name dropdown
  petNameInput.innerHTML = '';
  this.pets.forEach(p => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.petName;
    petNameInput.appendChild(option);
  });
  petNameInput.value = pet.id;
  petNameInput.disabled = true;
  petNameInput.style.backgroundColor = "#e9ecef";

  // 🔹 Autofill pet details
  if (speciesInput) {
    speciesInput.value = pet.species || "";
    speciesInput.style.backgroundColor = "#e9ecef";
    speciesInput.disabled = true;
  }
  if (breedInput) breedInput.value = pet.breed || "";
  if (sexInput) {
    sexInput.value = pet.sex || "";
    sexInput.style.backgroundColor = "#e9ecef";
    sexInput.disabled = true;
  }
  if (weightInput) weightInput.value = pet.weight || "";
  if (sizeInput) sizeInput.value = pet.size || getSizeFromWeight(pet.weight);

  // 🔹 Autofill owner name
  const ownerFullName = sessionStorage.getItem("userFullName") || 
                        sessionStorage.getItem("userName") || 
                        sessionStorage.getItem("username") || "";
  if (ownerFullName) {
    ownerNameInput.value = ownerFullName;
    ownerNameInput.style.backgroundColor = "#e9ecef";
  }

  // 🔹 Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];
  dateInput.value = dateInput.min;

  // 🔹 Load services from Firestore
  let services = {};
  try {
    const servicesSnap = await getDocs(collection(db, "Services"));
    servicesSnap.forEach(doc => {
      const data = doc.data();
      services[data.name.toLowerCase()] = data.variants || [];
    });
    console.log("✅ Services loaded:", Object.keys(services));
  } catch (err) {
    console.error("❌ Failed to load services:", err);
    modal.style.display = "none";
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load services. Please refresh the page.",
      confirmButtonColor: "#f8732b",
    });
  }

  if (Object.keys(services).length === 0) {
    modal.style.display = "none";
    return Swal.fire({
      icon: "error",
      title: "No Services Available",
      text: "No services found. Please contact the administrator.",
      confirmButtonColor: "#f8732b",
    });
  }

  // 🔹 Populate service dropdown
  serviceSelect.innerHTML = '<option value="" disabled selected>Select Service</option>';
  Object.keys(services).forEach(svc => {
    const opt = document.createElement("option");
    opt.value = svc;
    opt.textContent = svc.charAt(0).toUpperCase() + svc.slice(1);
    serviceSelect.appendChild(opt);
  });

  // 🔹 Create base appointment data with NEW FORMAT (startTime/endTime)
  const appointmentData = {
    userId: sessionStorage.getItem("userId"),
    petId: pet.id,
    petName: pet.petName,
    ownerName: ownerNameInput.value,
    ownerPhone: ownerPhoneInput.value,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    weight: pet.weight,
    size: pet.size || getSizeFromWeight(pet.weight),
    service: "",
    serviceVariants: [],
    date: dateInput.value,
    startTime: "",  // ✅ Changed from 'time'
    endTime: "",    // ✅ Added endTime
    displayTime: "", // ✅ For display purposes
    duration: 0,
    selectedServices: [],
    serviceFee: 0,
    reservationFee: 0,
    totalAmount: 0,
    status: "pending",
    vet: "Dr. Donna Doll Diones",
    createdAt: new Date().toISOString()
  };

  sessionStorage.setItem("appointment", JSON.stringify(appointmentData));

  // 🔹 Set first service and generate time slots
  const firstServiceKey = Object.keys(services)[0] || "";
  if (firstServiceKey) {
    serviceSelect.value = firstServiceKey;
    appointmentData.service = firstServiceKey;
    appointmentData.serviceVariants = services[firstServiceKey] || [];
    sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
    
    await updateAvailableTimeSlots(dateInput.value, firstServiceKey, timeInput);
  }

  // 🔹 Service change event
  serviceSelect.addEventListener("change", async () => {
    const selectedService = serviceSelect.value;
    await updateAvailableTimeSlots(dateInput.value, selectedService, timeInput);
    appointmentData.service = selectedService;
    appointmentData.serviceVariants = services[selectedService.toLowerCase()] || [];
    sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
  });

  // 🔹 Date change event
  dateInput.addEventListener("change", async () => {
    if (serviceSelect.value) {
      await updateAvailableTimeSlots(dateInput.value, serviceSelect.value, timeInput);
    }
  });
},

// ================================
// 📌 Submit Appointment Form (Updated to match new format)
// ================================
async submitAppointmentForm(event) {
  event.preventDefault();

  const userId = sessionStorage.getItem("userId");
  const pet = this.currentBookingPet;

  if (!userId || !pet) {
    return Swal.fire({
      icon: "error",
      title: "Missing Information",
      text: "Please select a pet and ensure you are logged in.",
      confirmButtonColor: "#f8732b",
    });
  }

  const ownerNameInput = document.getElementById("ownerName");
  const ownerPhoneInput = document.getElementById("ownerPhone");
  const serviceInput = document.getElementById("appointmentService");
  const dateInput = document.getElementById("appointmentDate");
  const timeInput = document.getElementById("appointmentTime");

  const name = ownerNameInput.value.trim();
  const phone = ownerPhoneInput.value.trim();
  const service = serviceInput.value;
  const date = dateInput.value;
  const time = timeInput.value;

  if (!name || !phone || !service || !date || !time) {
    return Swal.fire({
      icon: "warning",
      title: "Incomplete Form",
      text: "Please fill in all required fields.",
      confirmButtonColor: "#f8732b",
    });
  }

  // 🔹 Prevent same-day booking
  const today = new Date().toISOString().split("T")[0];
  if (date === today) {
    return Swal.fire({
      icon: "warning",
      title: "Same-Day Booking Not Allowed",
      text: "Please select a different date.",
      confirmButtonColor: "#f8732b",
    });
  }

  // 🔹 Calculate duration & time range
  const serviceDuration = serviceDurations[service?.toLowerCase()] || 30;
  const startMinutes = toMinutes(time);
  const endMinutes = startMinutes + serviceDuration;
  const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;
  const formattedStart = formatTo12Hour(time);
  const formattedEnd = formatTo12Hour(endTime);

  // 🔹 Check availability
  const stillAvailable = await isTimeSlotAvailable(date, time, serviceDuration);
  if (!stillAvailable) {
    return Swal.fire({
      icon: "error",
      title: "Time Slot Unavailable",
      text: "This time is already booked or blocked.",
      confirmButtonColor: "#f8732b",
    });
  }

  // 🔹 Prepare appointment data with NEW FORMAT
  const appointmentData = {
    userId,
    petId: pet.id,
    petName: pet.petName,
    name: name,  // ✅ Changed from ownerName to match your format
    ownerNumber: phone,  // ✅ Changed from ownerPhone to match your format
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    weight: pet.weight,
    petSize: pet.size,  // ✅ Changed from size to petSize
    service,
    serviceVariants: JSON.parse(sessionStorage.getItem("appointment"))?.serviceVariants || [],
    date,
    startTime: formattedStart,  // ✅ Changed from time to startTime
    endTime: formattedEnd,       // ✅ Added endTime
    displayTime: `${formattedStart} - ${formattedEnd}`,  // ✅ Added for display
    duration: serviceDuration,
    serviceFee: `₱${(0).toFixed(2)}`,  // ✅ Format as currency string
    totalAmount: `₱${(0).toFixed(2)}`,  // ✅ Format as currency string
    selectedServices: [],
    vaccines: [],
    status: "pending",
    vet: "Dr. Donna Doll Diones",
    timestamp: new Date().toISOString(),  // ✅ Added timestamp
    createdAt: new Date().toISOString(),
  };

  // 🔹 Save and redirect
  Swal.fire({
    title: "Processing...",
    text: "Please wait while we submit your appointment.",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  setTimeout(() => {
    sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
    Swal.fire({
      title: "Appointment Saved!",
      text: "Redirecting to confirmation page...",
      icon: "success",
      confirmButtonColor: "#f8732b",
    }).then(() => (window.location.href = "custConfirm.html"));
  }, 1200);
},



  confirmDelete(id) {
    const pet = this.pets.find(p => p.id === id);
    if (!pet) return;

    this.currentDeleteId = id;
    document.getElementById('confirmTitle').textContent = 'Delete Pet';
    document.getElementById('confirmMessage').textContent = `Are you sure you want to delete ${pet.petName}?`;
    document.getElementById('confirmModal').style.display = 'block';
  },

  closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    this.currentDeleteId = null;
  },

  closePetModal() {
    document.getElementById('petModal').style.display = 'none';
    this.currentEditId = null;
  },

  closeAppointmentModal() {
    document.getElementById('appointmentModal').style.display = 'none';
    this.currentBookingPet = null;
    this.currentEditAppointmentId = null;
  },

  addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .pet-card { animation: fadeIn 0.3s ease; }
    `;
    document.head.appendChild(style);
  },

  bindEvents() {
    document.getElementById("searchInput").addEventListener("input", () => this.renderPets());
    document.getElementById("petForm").addEventListener("submit", (e) => this.submitPetForm(e));
    document.getElementById("confirmButton").addEventListener("click", () => this.deletePet());
    document.getElementById("appointmentForm").addEventListener("submit", (e) => this.submitAppointmentForm(e));
  }
};

const speciesList = document.getElementById("speciesList");
const petSpeciesInput = document.getElementById("petSpecies");
const petBreedInput = document.getElementById("petBreed");

let speciesBreeds = {}; // dynamically updated

// Listen for real-time updates from Firestore
function listenSpeciesAndBreeds() {
  const speciesCollection = collection(db, "Species");

  onSnapshot(speciesCollection, (snapshot) => {
    speciesBreeds = {}; // reset

    snapshot.forEach(doc => {
      const data = doc.data();
      const speciesName = data.name.toLowerCase();

      if (!speciesBreeds[speciesName]) speciesBreeds[speciesName] = [];

      if (Array.isArray(data.breeds)) {
        data.breeds.forEach(b => {
          if (b.status === "Active") speciesBreeds[speciesName].push(b.name);
        });
      }
    });

    populateSpeciesDropdown();

    // Re-trigger breed dropdown if species is already selected
    const selectedSpecies = petSpeciesInput.value.toLowerCase().trim();
    if (speciesBreeds[selectedSpecies]) {
      petBreedInput.disabled = false;
      breedDropdown.setOptions(speciesBreeds[selectedSpecies]);
    } else {
      petBreedInput.disabled = true;
      breedDropdown.setOptions([]);
    }
  });
}

function populateSpeciesDropdown() {
  speciesList.innerHTML = ""; // clear previous options
  const addedSpecies = new Set();

  Object.keys(speciesBreeds).forEach(specie => {
    if (speciesBreeds[specie].length > 0 && !addedSpecies.has(specie)) {
      const option = document.createElement("option");
      option.value = specie.charAt(0).toUpperCase() + specie.slice(1);
      speciesList.appendChild(option);
      addedSpecies.add(specie);
    }
  });

  // Force the input to refresh its datalist
  const currentValue = petSpeciesInput.value;
  petSpeciesInput.value = "";
  petSpeciesInput.value = currentValue;
}


// ScrollableDropdown class remains the same
class ScrollableDropdown {
  constructor(inputElement, options = [], maxItems = 10) {
    this.input = inputElement;
    this.dropdown = document.createElement("div");
    this.dropdown.className = "custom-dropdown";
    this.input.parentNode.appendChild(this.dropdown);
    this.options = options;
    this.maxItems = maxItems;

    this.input.addEventListener("input", () => this.render());
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".form-group")) this.hide();
    });
  }

  setOptions(options) {
    this.options = options;
    this.render();
  }

  render() {
    const value = this.input.value.toLowerCase();
    this.dropdown.innerHTML = "";

    if (!this.options.length) return this.hide();

    const filtered = this.options.filter(opt => opt.toLowerCase().includes(value));
    if (!filtered.length) return this.hide();

    filtered.forEach(opt => {
      const div = document.createElement("div");
      div.textContent = opt;
      div.addEventListener("click", () => {
        this.input.value = opt;
        this.hide();
      });
      this.dropdown.appendChild(div);
    });

    this.show();
  }

  show() {
    this.dropdown.style.display = "block";
  }

  hide() {
    this.dropdown.style.display = "none";
  }
}

// Initialize breed dropdown
const breedDropdown = new ScrollableDropdown(petBreedInput, [], 10);

// Update breeds dynamically when species input changes
petSpeciesInput.addEventListener("input", (e) => {
  const species = e.target.value.toLowerCase().trim();
  if (speciesBreeds[species]) {
    petBreedInput.disabled = false;
    breedDropdown.setOptions(speciesBreeds[species]);
  } else {
    petBreedInput.disabled = true;
    breedDropdown.setOptions([]);
  }
});

// Start listening for real-time updates
listenSpeciesAndBreeds();



document.addEventListener('DOMContentLoaded', async () => {
  // Initialize pets
  PetManager.init();
  

  // Hide all modals when switching to pet tab
  document.getElementById("pet-tab").addEventListener("click", () => {
    document.getElementById("petModal").style.display = "none";
    document.getElementById("appointmentModal").style.display = "none";
    document.getElementById("confirmModal").style.display = "none";
  });

  // ✅ Check login session
  const uid = sessionStorage.getItem("userId");

  if (!uid) {
    alert("Session expired. Please log in again.");
    window.location.href = "../../login.html";
    return;
  }

  // ✅ Load and render appointments
  await loadAppointmentsFromFirestore();
  initCalendar();
});

document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector(".cards");
  const boxesContainer = document.querySelector("#news .box-container");
  const newsContainer = cardsContainer || boxesContainer;
  if (!newsContainer) return;

  const MODE = cardsContainer ? "cards" : "boxes"; // Determine display type
  const PLACEHOLDER_IMAGE = "/images/news2.webp";
  const defaultNews = {
    title: "NO NEWS AVAILABLE",
    content: "Stay tuned for updates!",
    image: PLACEHOLDER_IMAGE,
    publishDate: "",
    priority: "normal",
  };

  const priorityOrder = { urgent: 1, important: 2, normal: 3 };

  // ✅ Helper: Sort and limit
  function getTop3Published(newsList) {
    let published = (newsList || []).filter((n) => n.status === "published");
    published.sort((a, b) => {
      const prioDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (prioDiff !== 0) return prioDiff;
      const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return db - da; // newest first
    });
    return published.slice(0, 3);
  }

  // ✅ Render news items
  function renderNews(list) {
    // Ensure we always have 3 slots
    while (list.length < 3) {
      list.push(defaultNews);
    }

    newsContainer.innerHTML = "";

    list.forEach((news) => {
      const imgSrc = news.image || PLACEHOLDER_IMAGE;
      const dateText = news.publishDate
        ? new Date(news.publishDate).toLocaleDateString()
        : "";
      const priorityText = news.priority
        ? news.priority.charAt(0).toUpperCase() + news.priority.slice(1)
        : "";

      if (MODE === "cards") {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <div class="image-section">
            <img src="${imgSrc}" alt="${news.title}">
          </div>
          <div class="content">
            <h4>${news.title}</h4>
            <p>${news.content}</p>
            <p><b>Priority:</b> ${priorityText}</p>
          </div>
          <div class="posted-date">
            <p>${dateText}</p>
          </div>
        `;
        newsContainer.appendChild(card);
      } else {
        const box = document.createElement("div");
        box.classList.add("box");
        box.innerHTML = `
          <div class="image">
            <img src="${imgSrc}" alt="${news.title}">
          </div>
          <div class="content">
            <div class="icons">
              <a href="#"><i class="fa-solid fa-calendar"></i> ${dateText}</a>
              <a href="#"><i class="fas fa-user"></i> By admin</a>
              <span class="priority ${news.priority}">${priorityText}</span>
            </div>
            <h3>${news.title}</h3>
            <p>${news.content}</p>
            <a href="news.html" class="btn">Learn More <span class="fas fa-chevron-right"></span></a>
          </div>
        `;
        newsContainer.appendChild(box);
      }
    });
  }

  // ✅ REAL-TIME LISTENER - Auto-updates when news changes
  function setupRealtimeListener() {
    const newsRef = collection(db, "NEWS");
    const q = query(newsRef, where("status", "==", "published"));

    console.log("🔄 Setting up real-time listener for news updates...");

    // Listen for real-time changes
    onSnapshot(
      q,
      (snapshot) => {
        let newsList = [];
        
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          
          // Handle Firestore Timestamp conversion
          let dateValue = data.publishDate;
          if (data.publishDate?.toDate) {
            dateValue = data.publishDate.toDate().toISOString();
          } else if (data.timestamp?.toDate) {
            dateValue = data.timestamp.toDate().toISOString();
          }
          
          newsList.push({
            ...data,
            publishDate: dateValue
          });
        });

        console.log("🔄 Real-time update - News refreshed:", newsList.length, "items");

        const top3 = getTop3Published(newsList);
        renderNews(top3);
      },
      (error) => {
        console.error("❌ Error listening to news updates:", error);
        console.error("Error details:", error.message);
        // Render default news on error
        renderNews([]);
      }
    );
  }

  // ✅ Initialize real-time listener
  setupRealtimeListener();
});




// Convert Firestore "HH:MM" (24-hour) -> minutes
function toMinutes24(timeStr) {
  if (!timeStr) return NaN;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Convert dropdown "h:mm AM/PM - h:mm AM/PM" -> minutes (start time only)
// Convert dropdown "h:mm AM/PM - h:mm AM/PM" OR "HH:MM - HH:MM"
function toMinutesRangeStart(rangeStr) {
  if (!rangeStr) return NaN;
  const part = rangeStr.split("-")[0].trim(); // take start time

  // Case 1: already in 24h format "HH:MM"
  if (/^\d{1,2}:\d{2}$/.test(part)) {
    const [h, m] = part.split(":").map(Number);
    return h * 60 + m;
  }

  // Case 2: "h:mm AM/PM"
  const [time, modifier] = part.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}


async function applyClinicSchedule() {
  try {
    const scheduleRef = doc(db, "ClinicSettings", "schedule");
    const snap = await getDoc(scheduleRef);

    if (!snap.exists()) {
      console.warn("⚠️ No schedule found in ClinicSettings.");
      return;
    }

    const data = snap.data();

    // ✅ pick schedule depending on today
    const today = new Date();
    const isSaturday = today.getDay() === 6; // Sunday=0 ... Saturday=6
    const hours = isSaturday ? data.saturdayHours : data.weekdayHours;

    const openMinutes = toMinutes24(hours.start); // e.g. "08:00"
    const closeMinutes = toMinutes24(hours.end); // e.g. "14:00"

    console.log("Clinic hours today:", hours.start, "-", hours.end);

    const timeSelect = document.getElementById("appt-time");

    Array.from(timeSelect.options).forEach(opt => {
      if (!opt.value) return; // skip "Select Time"

     const optionMinutes = toMinutesRangeStart(opt.value);


      // ❌ block only if outside the range
      if (isNaN(optionMinutes) || optionMinutes < openMinutes || optionMinutes >= closeMinutes) {
        opt.disabled = true;
        opt.classList.add("blocked-time");
      } else {
        opt.disabled = false;
        opt.classList.remove("blocked-time");
      }
    });

    // Safety: prevent selecting disabled ones
    timeSelect.addEventListener("change", e => {
      const selected = e.target.options[e.target.selectedIndex];
      if (selected.disabled) {
        alert("That time is outside clinic hours. Please pick another.");
        e.target.selectedIndex = 0;
      }
    });

  } catch (err) {
    console.error("Error applying clinic schedule:", err);
  }
}

document.addEventListener("DOMContentLoaded", applyClinicSchedule);



  window.PetManager = PetManager;
  window.navigateMonth = navigateMonth;

  window.showAddPetModal = () => PetManager.showAddPetModal();
  window.closePetModal = () => PetManager.closePetModal();
  window.closeAppointmentModal = () => PetManager.closeAppointmentModal();
  window.closeConfirmModal = () => PetManager.closeConfirmModal();


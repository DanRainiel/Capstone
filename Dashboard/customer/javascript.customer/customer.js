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
        

        
// ✅ Helper: convert "HH:MM AM/PM" or "HH:MM" into minutes since midnight
function toMinutes(timeStr) {
  if (!timeStr) return null;
  let hours, minutes;

  if (timeStr.includes("AM") || timeStr.includes("PM")) {
    // 12-hour format
    let [time, modifier] = timeStr.split(" ");
    [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  } else {
    // 24-hour format
    [hours, minutes] = timeStr.split(":").map(Number);
  }

  return hours * 60 + minutes;
}

// -----------------------------
// 🕒 Dynamic Service Durations (Loaded from Firestore)
// -----------------------------
let serviceDurations = {}; // will be populated from Firestore dynamically

async function loadServiceDurations() {
  try {
    const servicesRef = collection(db, "Services");
    const snapshot = await getDocs(servicesRef);

    serviceDurations = {}; // reset
    snapshot.forEach(docSnap => {
      const service = docSnap.data();
      if (service.name && service.duration) {
        // normalize service name (lowercase for consistency)
        serviceDurations[service.name.toLowerCase()] = service.duration;
      }
    });

    console.log("✅ Service durations loaded:", serviceDurations);
  } catch (err) {
    console.error("❌ Error loading service durations:", err);
  }
}



async function isTimeSlotAvailable(date, startTime, serviceDuration) {
  try {
    const startMinutes = toMinutes(startTime);
    const endMinutes = startMinutes + serviceDuration;

    // 🔍 Get all appointments for that date
    const appointmentsQuery = query(
      collection(db, "Appointments"),
      where("date", "==", date)
    );
    const appointmentsSnap = await getDocs(appointmentsQuery);

    for (const docSnap of appointmentsSnap.docs) {
      const appt = docSnap.data();

      // Handle both new & old appointment formats
      const apptStartTime = appt.startTime || appt.time;
      const apptEndTime = appt.endTime || null;
      const apptDuration = parseInt(appt.duration) || 30;

      if (!apptStartTime) continue; // skip invalid entries

      const apptStartMinutes = toMinutes(apptStartTime);
      const apptEndMinutes = apptEndTime
        ? toMinutes(apptEndTime)
        : apptStartMinutes + apptDuration;

      // ⚠️ Detect ANY overlap
      const overlap =
        startMinutes < apptEndMinutes && endMinutes > apptStartMinutes;

      if (overlap) {
        console.warn(
          `⛔ Blocked overlap: ${apptStartTime} - ${apptEndTime || "(unknown)"}`
        );
        return false;
      }
    }

    return true; // ✅ slot is available
  } catch (err) {
    console.error("Error checking slot availability:", err);
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


    // -----------------------------
    // 🕒 Populate available time slots dynamically
    // -----------------------------
    async function loadAvailableTimeSlots() {
        try {
            const clinicSnap = await getDocs(collection(db, "ClinicSettings"));
            if (clinicSnap.empty) return console.warn("No clinic hours found!");

            const clinicData = clinicSnap.docs[0].data();
            const weekdayHours = clinicData.weekdayHours;
            const saturdayHours = clinicData.saturdayHours;

            const selectedDate = apptDateInput.value;
            const selectedService = apptServiceInput.value;
            
            if (!selectedDate) return;

            const day = new Date(selectedDate).getDay();
            if (day === 0) {
                apptTimeInput.innerHTML = `<option value="">Closed on Sundays</option>`;
                return;
            }

            const start = day === 6 ? toMinutes(saturdayHours.start) : toMinutes(weekdayHours.start);
            const end = day === 6 ? toMinutes(saturdayHours.end) : toMinutes(weekdayHours.end);

           const serviceDuration = serviceDurations[selectedService?.toLowerCase()] || 30;

            apptTimeInput.innerHTML = `<option value="">-- Select Time --</option>`;

            for (let t = start; t < end; t += 30) {
                const nextT = t + serviceDuration;
                if (nextT > end) continue;

                const startHours = Math.floor(t / 60);
                const startMinutes = t % 60;
                const endHours = Math.floor(nextT / 60);
                const endMinutes = nextT % 60;

                const timeValue = `${String(startHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`;
                const startLabel = formatTo12Hour(timeValue);
                const endLabel = formatTo12Hour(`${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`);

                const selectedServiceName = apptServiceInput.value;
                const isAvailable = await isTimeSlotAvailable(selectedDate, timeValue, selectedServiceName);

                const option = document.createElement("option");
                option.value = timeValue;
                option.textContent = `${startLabel} - ${endLabel}${!isAvailable ? ' (Unavailable)' : ''}`;
                option.disabled = !isAvailable;
                apptTimeInput.appendChild(option);
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

    const speciesBreeds = {
        dog: ["Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Beagle", "Boxer", "Bulldog", "Chihuahua", "Dalmatian", "Doberman"],
        cat: ["Abyssinian", "Bengal", "Birman", "Maine Coon", "Persian", "Ragdoll", "Siamese", "Sphynx"],
        bird: ["Budgerigar", "Cockatiel", "Canary", "Lovebird", "Parrot", "Finch"],
        rabbit: ["Dutch", "Flemish Giant", "Lionhead", "Mini Lop", "Netherland Dwarf"],
        hamster: ["Syrian", "Roborovski", "Djungarian", "Chinese"],
        fish: ["Goldfish", "Betta", "Guppy", "Tetra", "Molly"]
    };

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

        const stillAvailable = await isTimeSlotAvailable(selectedDate, selectedTime, selectedService);
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
  name: apptNameInput.value.trim(),
  ownerNumber: apptNumberInput.value ? String(apptNumberInput.value).trim() : "",
  petName:
    apptPetNameInput.options[apptPetNameInput.selectedIndex]?.dataset.petName ||
    apptPetNameInput.value.trim(),
  species: apptSpeciesInput.value.trim(),
  breed: apptBreedInput.value.trim(),
  weight: apptWeightInput.value.trim(),
  petSize: apptSizeInput.value.trim() || getSizeFromWeight(parseFloat(apptWeightInput.value)),
  sex: apptSexInput.value,
  service: selectedService,
  date: selectedDate,
  
  // 🕒 separate fields for clarity
  startTime: selectedTime,
  endTime: endTime,
  startTimeFormatted: formattedTime,
  endTimeFormatted: formattedEndTime,
  displayTime: `${formattedTime} - ${formattedEndTime}`,

  duration: serviceDuration,
  serviceFee: 0,
  totalAmount: 0,
  selectedServices: [],
  vaccines: []
};


    // 🟡 Show loading and store appointment data in sessionStorage
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

// ===== TIME HELPERS =====
function timeToMinutes(t) {
  if (/am|pm/i.test(t)) {
    let [hour, minute] = t.split(':');
    const suffix = minute.split(' ')[1];
    minute = parseInt(minute);
    hour = parseInt(hour);
    if (suffix.toLowerCase() === 'pm' && hour !== 12) hour += 12;
    if (suffix.toLowerCase() === 'am' && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  const [h, m] = t.split(':').map(Number);
  return h*60 + m;
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

// ===== FIRESTORE LOAD =====
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
    appointments[dateStr].push({
      id: docSnap.id,
      time: data.time,
      petName: data.petName,
      type: data.service,
      owner: data.name || data.ownerName || "Unknown",
      phone: data.number || data.ownerPhone || ""
    });
  });
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

  if (day === 0) return []; // Sunday closed
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

// ✅ add exact closing time as a final slot (if you want it shown)
if (current === endMinutes) {
  slots.push(minutesToTime(current));
}


  return slots;
}

  // ===== Render all time slots =====
  timeSlotsDiv.innerHTML = '';
  const dynamicSlots = generateTimeSlotsForDate(selectedDate);

  if (dynamicSlots.length === 0) {
    timeSlotsDiv.innerHTML = '<p style="text-align:center;color:#6c757d;">No available slots for this day</p>';
  } else {
    dynamicSlots.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'calendar-time-slot';
      timeSlot.textContent = formatTo12Hour(time);

      const slotMinutes = timeToMinutes(time);
      const blockedEntry = dayBlocks.find(b => slotMinutes >= timeToMinutes(b.startTime) && slotMinutes < timeToMinutes(b.endTime));
      const isBooked = dayAppointments.some(a => a.time === time);

      if (blockedEntry) {
        timeSlot.classList.add('blocked');
        timeSlot.textContent += ` (${blockedEntry.reason})`;
        timeSlot.style.pointerEvents = 'none';
      } else if (isBooked) {
        timeSlot.classList.add('booked');
        timeSlot.style.pointerEvents = 'none';
      } else {
        timeSlot.addEventListener('click', () => selectTimeSlot(time));
      }

      if (selectedTimeSlot === time) timeSlot.classList.add('selected');
      timeSlotsDiv.appendChild(timeSlot);
    });
  }

  // ===== Render appointments for the day =====
  appointmentsListDiv.innerHTML = '';
  let filteredAppointments = [...dayAppointments]; // default all appointments

  if (selectedTimeSlot) {
   filteredAppointments = dayAppointments.filter(
  apt => normalizeTimeFormat(apt.time) === normalizeTimeFormat(selectedTimeSlot)
);

  }

  if (filteredAppointments.length > 0) {
    const seen = new Set();
    filteredAppointments.forEach(apt => {
      const key = `${apt.time}_${apt.petName}_${apt.owner}_${apt.type}`;
      if (seen.has(key)) return;
      seen.add(key);

      const div = document.createElement('div');
      div.className = 'calendar-appointment';
      div.innerHTML = `
        <div class="calendar-appointment-time">⏰ ${formatTo12Hour(apt.time)}</div>
        <div class="calendar-appointment-details">
          <strong>🐾 ${apt.petName}</strong> <span style="color:#555">(${apt.owner})</span>
          <div class="calendar-appointment-type calendar-type-${apt.type}">📌 ${getTypeDisplayName(apt.type)}</div>
          ${apt.phone ? `<div class="calendar-appointment-phone">📞 ${apt.phone}</div>` : ''}
        </div>
      `;
      div.addEventListener('click', () => {
        sessionStorage.setItem('selectedAppointmentId', apt.id);
        window.location.href = 'custConfirm.html';
      });
      appointmentsListDiv.appendChild(div);
    });
  } else {
    appointmentsListDiv.innerHTML = '<p style="text-align:center;color:#6c757d;">No appointments scheduled for this day</p>';
  }

  bookBtn.disabled = !selectedTimeSlot;
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
// 📌 Book Appointment (Autofilled Pet Name & Select Time)
// ================================
async bookAppointment(id) {
  const pet = this.pets.find(p => p.id === id);
  if (!pet) return console.error("❌ Pet not found.");

  this.currentBookingPet = pet;
  this.currentEditAppointmentId = null;

  // 🔹 DOM elements
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

  if (!petNameInput || !ownerNameInput || !ownerPhoneInput || !serviceSelect || !dateInput || !timeInput) {
    console.error("❌ Required form elements not found");
    return;
  }

  // 🔹 Populate Pet Name dropdown and select current pet
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
  speciesInput.value = pet.species || "";
  breedInput.value = pet.breed || "";
  sexInput.value = pet.sex || "";
  weightInput.value = pet.weight || "";
  sizeInput.value = pet.size || getSizeFromWeight(pet.weight);

  speciesInput.style.backgroundColor = "#e9ecef";
  sexInput.style.backgroundColor = "#e9ecef";

  // 🔹 Autofill owner name
  const ownerFullName = sessionStorage.getItem("userFullName");
  if (ownerFullName) ownerNameInput.value = ownerFullName;
  ownerNameInput.style.backgroundColor = "#e9ecef";

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
    console.log("✅ Services loaded:", services);
  } catch (err) {
    console.error("❌ Failed to load services:", err);
    return Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load services. Please refresh the page.",
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

  // Optional: select first service by default
  serviceSelect.value = Object.keys(services)[0] || "";

  // 🔹 Create base appointment data
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
    service: serviceSelect.value,
    serviceVariants: services[serviceSelect.value.toLowerCase()] || [],
    date: dateInput.value,
    time: "",
    selectedServices: [],
    serviceFee: 0,
    reservationFee: 0,
    totalAmount: 0,
    createdAt: new Date().toISOString()
  };

  sessionStorage.setItem("appointment", JSON.stringify(appointmentData));

  // 🔹 Show modal
  document.getElementById("appointmentModal").style.display = "flex";

  // 🔹 Generate initial time slots for default service
  if (serviceSelect.value) {
    await updateAvailableTimeSlots(dateInput.value, serviceSelect.value, timeInput);
  }

  // 🔹 When service changes, refresh time slots and update appointment data
  serviceSelect.addEventListener("change", async () => {
    await updateAvailableTimeSlots(dateInput.value, serviceSelect.value, timeInput);
    appointmentData.service = serviceSelect.value;
    appointmentData.serviceVariants = services[serviceSelect.value.toLowerCase()] || [];
    sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
  });
},

// ================================
// 📌 Submit Appointment Form
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

  // 🔹 Prepare appointment data for custConfirm
  const appointmentData = {
    userId,
    petId: pet.id,
    petName: pet.petName,
    ownerName: name,
    ownerPhone: phone,
    species: pet.species,
    breed: pet.breed,
    sex: pet.sex,
    weight: pet.weight,
    size: pet.size,
    service,
    serviceVariants: JSON.parse(sessionStorage.getItem("appointment"))?.serviceVariants || [],
    date,
    time,
    endTime,
    displayTime: `${formattedStart} - ${formattedEnd}`,
    duration: serviceDuration,
    serviceFee: 0,
    totalAmount: 0,
    selectedServices: [],
    vaccines: [],
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

const speciesBreeds = {
  dog: [
    "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute",
    "American Bulldog", "American Eskimo Dog", "American Pit Bull Terrier", 
    "American Staffordshire Terrier", "Australian Cattle Dog", "Australian Shepherd",
    "Basenji", "Basset Hound", "Beagle", "Bearded Collie", "Bedlington Terrier",
    "Belgian Malinois", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound",
    "Border Collie", "Border Terrier", "Boston Terrier", "Boxer", "Brittany Spaniel",
    "Bull Terrier", "Bulldog", "Bullmastiff", "Cairn Terrier", "Cavalier King Charles Spaniel",
    "Chesapeake Bay Retriever", "Chihuahua", "Chow Chow", "Cocker Spaniel",
    "Collie", "Dachshund", "Dalmatian", "Doberman Pinscher", "English Setter", "Doberman",
    "English Springer Spaniel", "English Toy Spaniel", "Eskimo Dog", "Field Spaniel",
    "Finnish Spitz", "Flat-Coated Retriever", "Fox Terrier", "French Bulldog",
    "German Pinscher", "German Shepherd", "German Shorthaired Pointer", "Giant Schnauzer",
   "Gordon Setter", "Great Dane", "Greater Swiss Mountain Dog",
    "Greyhound", "Harrier", "Havanese", "Irish Setter", "Irish Terrier", "Irish Wolfhound",
    "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Keeshond", "Kerry Blue Terrier",
    "Komondor", "Kuvasz", "Labrador Retriever", "Lakeland Terrier", "Leonberger",
    "Lhasa Apso", "Lowchen", "Maltese", "Manchester Terrier", "Mastiff", "Miniature Bull Terrier",
    "Miniature Pinscher", "Miniature Poodle", "Miniature Schnauzer", "Newfoundland",
    "Norfolk Terrier", "Norwegian Buhund", "Norwegian Elkhound", "Norwich Terrier",
    "Old English Sheepdog", "Otterhound", "Papillon", "Pekingese", "Pembroke Welsh Corgi",
    "Petit Basset Griffon Vendeen", "Pharaoh Hound", "Plott", "Pointer", "Pomeranian", "Poodle",
    "Portuguese Water Dog", "Presa Canario", "Pug", "Puli", "Pumi", "Rat Terrier", "Redbone Coonhound",
    "Rhodesian Ridgeback", "Saint Bernard", "Saluki", "Samoyed", "Schipperke",
    "Schnauzer", "Scottish Deerhound", "Scottish Terrier", "Sealyham Terrier", "Shetland Sheepdog",
    "Shiba Inu", "Siberian Husky", "Silky Terrier", "Skye Terrier", "Sloughi",
    "English Springer Spaniel", "French Bulldog", "German Shepherd", "Golden Retriever",
    "Great Dane", "Greyhound", "Irish Setter", "Irish Wolfhound", "Jack Russell Terrier",
    "Labrador Retriever", "Maltese", "Newfoundland", "Papillon", "Pekingese",
    "Pembroke Welsh Corgi", "Pointer", "Pomeranian", "Poodle", "Pug", "Rottweiler",
    "Saint Bernard", "Samoyed", "Schnauzer", "Scottish Terrier", "Shar Pei",
    "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Staffordshire Bull Terrier",
    "Weimaraner", "West Highland White Terrier", "Whippet", "Yorkshire Terrier"
  ],
  cat: [
    "Abyssinian", "American Bobtail", "American Curl", "American Shorthair",
    "American Wirehair", "Balinese", "Bengal", "Birman", "Bombay", "British Shorthair",
    "Burmese", "Burmilla", "Chartreux", "Cornish Rex", "Cymric", "Devon Rex",
    "Egyptian Mau", "Exotic Shorthair", "Havana Brown", "Himalayan", "Japanese Bobtail",
    "Korat", "LaPerm", "Maine Coon", "Manx", "Norwegian Forest", "Ocicat", "Oriental",
    "Persian", "Peterbald", "Pixiebob", "Ragdoll", "Russian Blue", "Savannah", "Scottish Fold",
    "Selkirk Rex", "Siamese", "Siberian", "Singapura", "Somali", "Sphynx", "Tonkinese",
    "Turkish Angora", "Turkish Van"
  ],
  bird: [
    "African Grey Parrot", "Amazon Parrot", "Budgerigar", "Canary", "Cockatiel", "Cockatoo",
    "Conure", "Dove", "Eclectus Parrot", "Finch", "Lovebird", "Macaw", "Parakeet",
    "Parrotlet", "Quaker Parrot", "Ringneck Parakeet"
  ],
  rabbit: [
    "American Fuzzy Lop", "American Rabbit", "Angora", "Belgian Hare", "Beveren",
    "Britannia Petite", "Californian", "Checkered Giant", "Dutch", "Dwarf Hotot",
    "English Angora", "English Lop", "English Spot", "Flemish Giant", "Florida White",
    "French Angora", "French Lop", "Harlequin", "Havana", "Himalayan", "Holland Lop",
    "Jersey Wooly", "Lionhead", "Mini Lop", "Mini Rex", "Netherland Dwarf", "New Zealand",
    "Polish", "Rex", "Satin", "Silver", "Silver Fox"
  ],
  hamster: [
    "Syrian Hamster", "Winter White Dwarf Hamster", "Campbell’s Dwarf Hamster",
    "Roborovski Hamster", "Chinese Hamster"
  ],
  fish: [
    "Angelfish", "Archerfish", "Arowana", "Barb", "Betta", "Catfish", "Clownfish",
    "Corydoras", "Discus", "Goby", "Goldfish", "Gourami", "Guppy", "Koi", "Molly",
    "Oscar", "Platy", "Pleco", "Rainbowfish", "Swordtail", "Tetra", "Zebra Danio"
  ]
};


// Populate species list
const speciesList = document.getElementById("speciesList");
Object.keys(speciesBreeds).forEach(specie => {
  const option = document.createElement("option");
  option.value = specie.charAt(0).toUpperCase() + specie.slice(1);
  speciesList.appendChild(option);
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
  }
});


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

  // Filter based on typing, but no slice limit
  const filtered = this.options.filter(opt =>
    opt.toLowerCase().includes(value)
  );

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

// Usage example
const petBreedInput = document.getElementById("petBreed");
const breedDropdown = new ScrollableDropdown(petBreedInput, [], 10);

// Populate dynamically based on species
document.getElementById("petSpecies").addEventListener("input", (e) => {
  const species = e.target.value.toLowerCase().trim();
  if (speciesBreeds[species]) {
    petBreedInput.disabled = false;
    breedDropdown.setOptions(speciesBreeds[species]);
  } else {
    petBreedInput.disabled = true;
    breedDropdown.setOptions([]);
  }
});






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


// NEWS //

document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector('.cards');
  const boxesContainer = document.querySelector('#news .box-container');
  const newsContainer = cardsContainer || boxesContainer;
  if (!newsContainer) return;

  const MODE = cardsContainer ? 'cards' : 'boxes'; // render style
  const PLACEHOLDER_IMAGE = "/images/news2.webp"; 
  const defaultNews = {
    title: "NO NEWS AVAILABLE",
    content: "Stay tuned for updates!",
    image: PLACEHOLDER_IMAGE,
    publishDate: "",
    priority: "normal"
  };

  // ✅ Sort by priority first, then newest
  const priorityOrder = { urgent: 1, important: 2, normal: 3 };
  function getTop3Published(newsList) {
    let published = (newsList || []).filter(n => n.status === 'published'); // only published
    published.sort((a, b) => {
      const prioDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (prioDiff !== 0) return prioDiff;
      const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return db - da; // newest first
    });
    return published.slice(0, 3);
  }

  function renderNews() {
    const stored = JSON.parse(localStorage.getItem('newsList')) || [];
    let list = getTop3Published(stored);

    while (list.length < 3) {
      list.push(defaultNews);
    }

    newsContainer.innerHTML = '';

    list.forEach(news => {
      const imgSrc = news.image || PLACEHOLDER_IMAGE;
      const dateText = news.publishDate ? new Date(news.publishDate).toLocaleDateString() : '';
      const priorityText = news.priority ? news.priority.charAt(0).toUpperCase() + news.priority.slice(1) : '';

      if (MODE === 'cards') {
        const card = document.createElement('div');
        card.classList.add('card');
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
        const box = document.createElement('div');
        box.classList.add('box');
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

  renderNews();

  window.addEventListener('storage', (event) => {
    if (event.key === 'newsList') renderNews();
  });
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


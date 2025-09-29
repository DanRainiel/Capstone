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

document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.getElementById("appointment-form");
    const apptDateInput = document.getElementById("appt-date");
    const apptTimeInput = document.getElementById("appt-time");

    if (!appointmentForm) {
        console.error("❌ appointment-form not found in DOM");
        return;
    }

  // 🔹 Update available times when date changes
if (apptDateInput && apptTimeInput) {
    apptDateInput.addEventListener("change", async () => {
        const selectedDate = apptDateInput.value;
        if (!selectedDate) return;

        const day = new Date(selectedDate).getDay(); // 0=Sun, 6=Sat

        // 🚫 Block Sundays immediately
        if (day === 0) {
            await Swal.fire({
                icon: "warning",
                title: "Closed on Sundays",
                text: "Appointments cannot be scheduled on Sundays. Please choose another day.",
                confirmButtonColor: "#f8732b"
            });
            apptDateInput.value = ""; // reset date
            apptTimeInput.innerHTML = `<option value="">Select Time</option>`;
            apptTimeInput.disabled = true;
            return;
        }

        try {
            // Fetch clinic hours
            const clinicSettingsRef = collection(db, "ClinicSettings");
            const clinicSnap = await getDocs(clinicSettingsRef);
            if (clinicSnap.empty) return;

            const clinicData = clinicSnap.docs[0].data();
            const weekdayHours = clinicData.weekdayHours; // { start: "08:00", end: "18:00" }
            const saturdayHours = clinicData.saturdayHours; // { start: "08:00", end: "16:00" }

            let clinicStart, clinicEnd;
            if (day === 6) {
                clinicStart = saturdayHours.start;
                clinicEnd = saturdayHours.end;
            } else {
                clinicStart = weekdayHours.start;
                clinicEnd = weekdayHours.end;
            }

            console.log(`📅 Selected date clinic hours: ${clinicStart} - ${clinicEnd}`);

            // Build <select> options as time ranges
            if (apptTimeInput.tagName.toLowerCase() === "select") {
                apptTimeInput.innerHTML = `<option value="">Select Time</option>`; // reset
                const startMinutes = toMinutes(clinicStart);
                const endMinutes = toMinutes(clinicEnd);

                for (let m = startMinutes; m < endMinutes; m += 30) {
                    const slotStart = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                    const slotEndMinutes = m + 30;
                    const slotEnd = `${String(Math.floor(slotEndMinutes / 60)).padStart(2, "0")}:${String(slotEndMinutes % 60).padStart(2, "0")}`;

                    const option = document.createElement("option");
                    option.value = slotStart; // use start time as value
                    option.textContent = `${formatTo12Hour(slotStart)} - ${formatTo12Hour(slotEnd)}`;

                    apptTimeInput.appendChild(option);
                }

                apptTimeInput.disabled = false;
            } else {
                // Fallback for <input type="time">
                apptTimeInput.min = clinicStart;
                apptTimeInput.max = clinicEnd;
                apptTimeInput.disabled = false;
            }
        } catch (err) {
            console.error("⚠️ Error updating clinic hours:", err);
        }
    });
}


    // ================================
    // 📌 Appointment Submit Handler
    // ================================
    appointmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const selectedDate = document.getElementById("appt-date").value;
        const selectedTime = document.getElementById("appt-time").value;
        const formattedTime = formatTo12Hour(selectedTime);
        const selectedService = document.getElementById("appt-service").value;
        const currentUser = document.getElementById("appt-number").value.trim();

        // 🚫 Prevent same-day booking
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

        // 🔹 Check clinic hours + blocked slots
        try {
            const clinicSettingsRef = collection(db, "ClinicSettings");
            const clinicSnap = await getDocs(clinicSettingsRef);
            if (clinicSnap.empty) throw new Error("Clinic hours not found");

            const clinicData = clinicSnap.docs[0].data();
            const weekdayHours = clinicData.weekdayHours;
            const saturdayHours = clinicData.saturdayHours;

            const appointmentDay = new Date(selectedDate).getDay(); // 0=Sun, 6=Sat

            // 🚫 Block Sundays completely
            if (appointmentDay === 0) {
                await Swal.fire({
                    icon: "warning",
                    title: "Closed on Sundays",
                    text: "Appointments cannot be scheduled on Sundays. Please choose another day.",
                    confirmButtonColor: "#f8732b"
                });
                return;
            }

            let clinicStart, clinicEnd;
            if (appointmentDay === 6) {
                clinicStart = saturdayHours.start;
                clinicEnd = saturdayHours.end;
            } else {
                clinicStart = weekdayHours.start;
                clinicEnd = weekdayHours.end;
            }

            const selectedMinutes = toMinutes(selectedTime);
            const startMinutes = toMinutes(clinicStart);
            const endMinutes = toMinutes(clinicEnd);

            if (selectedMinutes < startMinutes || selectedMinutes >= endMinutes) {
                await Swal.fire({
                    icon: "error",
                    title: "Outside Clinic Hours",
                    text: `Appointments can only be booked between ${clinicStart} and ${clinicEnd}. Please select a valid time.`,
                    confirmButtonColor: "#f8732b"
                });
                return;
            }

            // 2. Check against blocked slots
            const blockedRef = collection(db, "BlockedSlots");
            const qBlocked = query(blockedRef, where("date", "==", selectedDate));
            const blockedSnap = await getDocs(qBlocked);

            let isBlocked = false;
            let reason = "";

            blockedSnap.forEach(docSnap => {
                const block = docSnap.data();
                const blockStart = toMinutes(block.startTime);
                const blockEnd = toMinutes(block.endTime);

                if (selectedMinutes >= blockStart && selectedMinutes < blockEnd) {
                    isBlocked = true;
                    reason = block.reason || "Unavailable";
                }
            });

            if (isBlocked) {
                await Swal.fire({
                    icon: "error",
                    title: "Time Slot Blocked",
                    text: `This time is unavailable (${reason}). Please pick another slot.`,
                    confirmButtonColor: "#f8732b"
                });
                return;
            }
        } catch (err) {
            console.error("Error validating clinic hours/blocked slots:", err);
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: "Could not verify clinic schedule. Please try again later.",
                confirmButtonColor: "#f8732b"
            });
            return;
        }

        // ✅ Save appointment if no conflicts
        const appointmentData = {
            name: document.getElementById("appt-name").value.trim(),
            number: currentUser,
            petName: document.getElementById("appt-petname").value.trim(),
            breed: document.getElementById("appt-breed").value.trim(),
            petSize: document.getElementById("appt-size").value,
            sex: document.getElementById("appt-sex").value,
            service: selectedService,
            time: formattedTime,
            date: selectedDate,
            serviceFee: 0,
            selectedServices: [],
            vaccines: [],
        };

        // 💰 Apply fee
        switch (appointmentData.service) {
            case "grooming": appointmentData.serviceFee = 500; break;
            case "vaccinations": appointmentData.serviceFee = 700; break;
            case "dental-care": appointmentData.serviceFee = 600; break;
            case "consultation": appointmentData.serviceFee = 400; break;
            case "laboratory": appointmentData.serviceFee = 800; break;
            case "treatment": appointmentData.serviceFee = 1000; break;
        }

        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we submit your appointment.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading()
        });

        setTimeout(() => {
            sessionStorage.setItem("appointment", JSON.stringify(appointmentData));
            Swal.fire({
                title: 'Appointment Submitted!',
                text: 'Your appointment has been saved. Redirecting to confirmation page...',
                icon: 'success',
                confirmButtonText: 'Continue',
                confirmButtonColor: '#f8732b'
            }).then(() => {
                window.location.href = "custConfirm.html";
            });
        }, 1500);
    });
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


// ================================
// 📌 Logic for Calendar Booking Button
// ================================
const bookBtn = document.getElementById("bookBtn");
if (bookBtn) {
    bookBtn.addEventListener("click", async () => {
        const selectedSlot = document.querySelector(".time-slot.selected")?.dataset.value || "09:00 AM";
        const today = new Date().toISOString().split("T")[0];
        const formattedTime = formatTo12Hour(selectedSlot);
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

// helper to format time nicely
function formatTime(time) {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = ((hour + 11) % 12 + 1);
  return `${formattedHour}:${m} ${ampm}`;
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
    filteredAppointments = dayAppointments.filter(apt => apt.time === selectedTimeSlot);
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


     
// 🐾 PETS MANAGER //
const PetManager = {
  pets: [],
  currentEditId: null,
  currentDeleteId: null,
  currentBookingPet: null,
  currentEditAppointmentId: null,

  speciesIcons: {
    dog: 'fas fa-dog',
    cat: 'fas fa-cat',
    bird: 'fas fa-dove',
    rabbit: 'fas fa-rabbit',
    hamster: 'fas fa-hamster',
    other: 'fas fa-paw'
  },

  async init() {
    this.bindEvents();
    this.addAnimationStyles();
    await this.loadPetsFromFirestore();
  },

  async loadPetsFromFirestore() {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return console.error("User not logged in.");

      const q = query(collection(db, "Pets"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

     this.pets = querySnapshot.docs.map(docSnap => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    petName: data.petName || '',
    species: data.species || 'other',
    ownerId: data.ownerId || 'N/A',
    breed: data.breed || '',
    age: data.age ? parseInt(data.age) : 0,
    sex: data.sex || '',
    size: data.size || '',
    weight: data.weight ? parseFloat(data.weight) : null,
    color: data.color || '',
    medicalHistory: data.medicalHistory || '',
    createdAt: data.createdAt || null   // ✅ keep the saved date
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
      if (!userId) return alert("User not logged in.");

      const timestamp = Date.now();
      const docId = `${userId}_${petData.petName}_${timestamp}`;
     await setDoc(doc(db, "Pets", docId), {
  ownerId: petData.ownerId,   // ✅ save ownerId instead of userId
  petName: petData.petName,
  species: petData.species,
  breed: petData.breed,
  age: petData.age,
  sex: petData.sex,
  size: petData.size,
  weight: petData.weight,
  color: petData.color,
  medicalHistory: petData.medicalHistory,
  createdAt: new Date().toISOString()
});


      await logActivity(userId, "Pet Added", `User ${userId} added pet ${petData.petName}.`);
      this.closePetModal();
      await this.loadPetsFromFirestore();
    } catch (error) {
      console.error("Error adding pet:", error);
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
      (pet.ownerId && pet.ownerId.toLowerCase().includes(searchTerm))
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
         <i class="fas fa-dog"></i>

        </div>
        <div class="pet-info">
          <h3>${pet.petName}</h3>
          <div class="pet-details">
  <div class="pet-detail"><i class="fas fa-paw"></i> <span>${pet.species}</span></div>
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

  showAddPetModal() {
    this.currentEditId = null;
    document.getElementById('petForm').reset();
    document.getElementById('modalTitle').textContent = 'Add Pet';
    document.getElementById('submitBtn').textContent = 'Add Pet';
    document.getElementById('petModal').style.display = 'flex';
  },

  submitPetForm(event) {
    event.preventDefault();

    const petData = {
      petName: document.getElementById('petFormName').value.trim(),
      species: document.getElementById('petSpecies').value.trim(),
      breed: document.getElementById('petBreed').value.trim(),
      age: parseInt(document.getElementById('petAge').value.trim()),
      sex: document.getElementById('petSex').value.trim(),
      size: document.getElementById('petSize').value.trim(),
      weight: parseFloat(document.getElementById('petWeight').value.trim()),
      color: document.getElementById('petColor').value.trim(),
      medicalHistory: document.getElementById('petMedicalHistory').value.trim()
    };

    if (!petData.petName) return alert("Pet name is required.");

    if (this.currentEditId) {
      this.updatePetInFirestore(this.currentEditId, petData);
    } else {
      this.addPetToFirestore(petData);
    }
  },

  editPet(id) {
    const pet = this.pets.find(p => p.id === id);
    if (!pet) return;

    this.currentEditId = id;
    document.getElementById('petFormName').value = pet.petName;
    document.getElementById('petSpecies').value = pet.species;
    document.getElementById('petBreed').value = pet.breed;
    document.getElementById('petAge').value = pet.age;
    document.getElementById('petSex').value = pet.sex;
    document.getElementById('petSize').value = pet.size;
    document.getElementById('petWeight').value = pet.weight;
    document.getElementById('petColor').value = pet.color;
    document.getElementById('petMedicalHistory').value = pet.medicalHistory;

    document.getElementById('modalTitle').textContent = 'Edit Pet';
    document.getElementById('submitBtn').textContent = 'Update Pet';
    document.getElementById('petModal').style.display = 'flex';
  },

  bookAppointment(id) {
    const pet = this.pets.find(p => p.id === id);
    if (!pet) return;

    this.currentBookingPet = pet;
    this.currentEditAppointmentId = null;

    document.getElementById('appointmentPetName').textContent = pet.petName;
    document.getElementById('appointmentDate').min = new Date().toISOString().split('T')[0];

    document.getElementById('ownerName').value = '';
    document.getElementById('ownerPhone').value = '';
    document.getElementById('appointmentService').value = '';
    document.getElementById('appointmentDate').value = '';
    document.getElementById('appointmentTime').value = '';
    document.getElementById('appointmentNotes').value = '';

    document.getElementById('appointmentModal').style.display = 'flex';
  },

  async submitAppointmentForm(event) {
    event.preventDefault();

    const userId = sessionStorage.getItem("userId");
    const pet = this.currentBookingPet;

    if (!userId || !pet) {
      alert("User or pet not found.");
      return;
    }

    const form = document.getElementById("appointmentForm");
    const ownerName = form.querySelector("#ownerName").value.trim();
    const ownerPhone = form.querySelector("#ownerPhone").value.trim();
    const service = form.querySelector("#appointmentService").value;
    const date = form.querySelector("#appointmentDate").value;
    const time = form.querySelector("#appointmentTime").value;
    const notes = form.querySelector("#appointmentNotes").value.trim();

    if (!ownerName || !ownerPhone || !service || !date || !time) {
      alert("Please fill out all required fields.");
      return;
    }

    const appointmentData = {
      userId,
      petId: pet.id,
      petName: pet.petName,
      ownerName,
      ownerPhone,
      service,
      date,
      time,
      notes,
      createdAt: new Date().toISOString()
    };

    sessionStorage.setItem("appointment", JSON.stringify(appointmentData));

    this.closeAppointmentModal();
    window.location.href = "custConfirm.html";
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


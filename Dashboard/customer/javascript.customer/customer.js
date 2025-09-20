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
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("appointment-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const appointmentData = {
            name: document.getElementById("appt-name").value.trim(),
            number: document.getElementById("appt-number").value.trim(),
            petName: document.getElementById("appt-petname").value.trim(),
            breed: document.getElementById("appt-breed").value.trim(),
            petSize: document.getElementById("appt-size").value,
            sex: document.getElementById("appt-sex").value,
            service: document.getElementById("appt-service").value,
            time: formatTo12Hour(document.getElementById("appt-time").value),
            date: document.getElementById("appt-date").value,
            serviceFee: 0,
            selectedServices: [],
            vaccines: [],
        };

        // 💰 Apply fee based on service
        switch (appointmentData.service) {
            case "grooming":
                appointmentData.serviceFee = 500;
                break;
            case "vaccinations":
                appointmentData.serviceFee = 700;
                break;
            case "dental-care":
                appointmentData.serviceFee = 600;
                break;
            case "consultation":
                appointmentData.serviceFee = 400;
                break;
            case "laboratory":
                appointmentData.serviceFee = 800;
                break;
            case "treatment":
                appointmentData.serviceFee = 1000;
                break;
        }

        Swal.fire({
            title: 'Processing...',
            text: 'Please wait while we submit your appointment.',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // ⏳ Simulate a short delay (e.g. 1.5 seconds)
       setTimeout(() => {
    // ✅ Save appointment data to sessionStorage
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
    // ================================
    // 📌 Logic for Main Appointment Form
    // ================================
    const appointmentForm = document.getElementById("appointment-form");
    if (appointmentForm) {
        // ✅ Always set today's date
        const today = new Date().toISOString().split("T")[0]; 
        document.getElementById("appt-date").value = today;

        // ✅ Pre-fill timeslot from sessionStorage (if booking was used)
        const savedSlot = sessionStorage.getItem("selectedSlot");
        if (savedSlot) {
            document.getElementById("appt-time").value = savedSlot;
            sessionStorage.removeItem("selectedSlot");
        }

        appointmentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const selectedDate = document.getElementById("appt-date").value;
            const selectedTime = formatTo12Hour(document.getElementById("appt-time").value);
            const selectedService = document.getElementById("appt-service").value;
            const currentUser = document.getElementById("appt-number").value.trim();

            // 🚫 Check if date is blocked in Firestore
            try {
                const q = query(collection(db, "BlockedSlots"), where("date", "==", selectedDate));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    await Swal.fire({
                        icon: "error",
                        title: "Date Unavailable",
                        text: "This date is blocked. Please choose another.",
                        confirmButtonColor: "#f8732b"
                    });
                    return;
                }
            } catch (err) {
                console.error("Error checking blocked date:", err);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Could not verify blocked dates. Try again later.",
                    confirmButtonColor: "#f8732b"
                });
                return;
            }

            // 🚫 Check if same service/time/date already booked
            try {
                const q2 = query(collection(db, "Appointment"), where("date", "==", selectedDate));
                const querySnapshot = await getDocs(q2);

                const newTime = toMinutes(selectedTime);
                let conflict = false;

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
            } catch (err) {
                console.error("Error checking appointment conflicts:", err);
                await Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Could not verify appointment conflicts. Try again later.",
                    confirmButtonColor: "#f8732b"
                });
                return;
            }

            // ✅ Continue as normal if not blocked/conflicted
            const appointmentData = {
                name: document.getElementById("appt-name").value.trim(),
                number: currentUser,
                petName: document.getElementById("appt-petname").value.trim(),
                breed: document.getElementById("appt-breed").value.trim(),
                petSize: document.getElementById("appt-size").value,
                sex: document.getElementById("appt-sex").value,
                service: selectedService,
                time: selectedTime,
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
    }
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



  // CALENDAR //

                  let currentDate = new Date();
                  let selectedDate = null;
                  let selectedTimeSlot = null;
                  let currentMonth = new Date().getMonth();
                  let currentYear = new Date().getFullYear();

        
                  let appointments = {}; // This will hold real-time Firestore data

    function formatTo12Hour(timeStr) {
  // If the string already has AM/PM, just return it
  if (/am|pm/i.test(timeStr)) {
    return timeStr.toUpperCase();
  }

  const [hour, minute] = timeStr.split(':');
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${minute} ${suffix}`;
}



  async function loadAppointmentsFromFirestore() {
    appointments = {};
    selectedDate = null;
    selectedTimeSlot = null;

    const currentUserUid = sessionStorage.getItem("userId");
    console.log("Loading appointments for UID:", currentUserUid);

    if (!currentUserUid) {
      console.error("No user ID found in sessionStorage.");
      return;
    }

    const querySnapshot = await getDocs(collection(db, "Appointment"));
    console.log("Total appointments in DB:", querySnapshot.size);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      console.log("Checking doc:", data);

      if (data.userId !== currentUserUid) {
        console.log("Skipping non-matching appointment:", data.userId);
        return;
      }

    const dateStr = formatDate(new Date(data.date));


      if (!appointments[dateStr]) {
        appointments[dateStr] = [];
      }

      appointments[dateStr].push({
        id: docSnap.id,
        time: data.time,
        petName: data.petName,
        type: data.service,
        owner: data.name || data.ownerName || "Unknown",
        phone: data.number || data.ownerPhone || ""
      });
    });

    console.log("Filtered appointments:", appointments);

    updateCalendar();
    updateSidebar();
  }


                  const timeSlots = [
                      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
                  ];

                  const months = [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                  ];

                  // Initialize calendar
                  function initCalendar() {
                      updateCalendar();
                      updateSidebar();
                  }

                  let blockedSlots = [];

  // Listen to admin's blocked slots in real-time
  const blockedCollection = collection(db, "BlockedSlots");
  onSnapshot(blockedCollection, (snapshot) => {
    blockedSlots = snapshot.docs.map(doc => doc.data());
    updateCalendar(); // re-render when blocks change
  });

                  function updateCalendar() {
      const monthYear = document.getElementById('monthYear');
      const calendarGrid = document.getElementById('calendarGrid');

      monthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      calendarGrid.innerHTML = '';

      const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayHeaders.forEach(day => {
          const dayHeader = document.createElement('div');
          dayHeader.className = 'calendar-day-header';
          dayHeader.textContent = day;
          calendarGrid.appendChild(dayHeader);
      });

      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();

      // Empty cells for previous month days
      for (let i = 0; i < startingDayOfWeek; i++) {
          const emptyCell = document.createElement('div');
          emptyCell.className = 'calendar-day-cell empty';
          calendarGrid.appendChild(emptyCell);
      }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize today's date

  for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = formatDate(cellDate);

      const dayCell = document.createElement('div');
      dayCell.className = 'calendar-day-cell';
      dayCell.innerHTML = `<div class="calendar-day-number">${day}</div>`;

      // ❌ Grey out past dates
      if (cellDate < today) {
          dayCell.classList.add('past-day');
          dayCell.style.pointerEvents = 'none';
      }

      // Blocked days
      if (blockedSlots.some(b => b.date === dateStr)) {
          dayCell.classList.add('blocked-day');
          dayCell.style.pointerEvents = 'none';
          const blockedBadge = document.createElement('div');
          blockedBadge.className = 'calendar-blocked-badge';
          blockedBadge.textContent = 'Closed';
          dayCell.appendChild(blockedBadge);
      }

      // Today highlight
      if (cellDate.toDateString() === today.toDateString()) {
          dayCell.classList.add('today');
      }

      // Selected date highlight
      if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
          dayCell.classList.add('selected');
      }

      // Appointment count badge
      const dayAppointments = (appointments[dateStr] || []).filter((apt, index, self) =>
          index === self.findIndex(t =>
              t.time === apt.time &&
              t.petName === apt.petName &&
              t.owner === apt.owner &&
              t.type === apt.type
          )
      );

      if (dayAppointments.length > 0) {
          const countBadge = document.createElement('div');
          countBadge.className = 'calendar-appointment-count';
          countBadge.textContent = dayAppointments.length;
          dayCell.classList.add('has-appointments');
          dayCell.appendChild(countBadge);
      }

      // Available indicator
      if (cellDate >= today) {  // only show if date is valid
          const availableIndicator = document.createElement('div');
          availableIndicator.className = 'calendar-available-indicator';
          availableIndicator.textContent = 'Available';
          dayCell.appendChild(availableIndicator);
      }

      // Clickable if not blocked or past
      if (!dayCell.classList.contains('blocked-day') && !dayCell.classList.contains('past-day')) {
          dayCell.addEventListener('click', () => selectDate(cellDate));
      }

      calendarGrid.appendChild(dayCell);
  }
                  }
                  


                  function navigateMonth(direction) {
      currentMonth += direction;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      } else if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }

      currentDate = new Date(currentYear, currentMonth, 1);
      updateCalendar();
  }


                  function selectDate(date) {
                      selectedDate = date;
                      selectedTimeSlot = null;
                      updateCalendar();
                      updateSidebar();
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
                      selectedDateDiv.textContent = selectedDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                      });
                      
                      // Update time slots
                      timeSlotsDiv.innerHTML = '';
                      const dayAppointments = appointments[dateStr] || [];
                      
                      timeSlots.forEach(time => {
                          const timeSlot = document.createElement('div');
                          timeSlot.className = 'calendar-time-slot';
                          timeSlot.textContent = formatTo12Hour(time);

                          
                          const isBooked = dayAppointments.some(apt => apt.time === time);
                          
                          if (isBooked) {
                              timeSlot.classList.add('booked');
                          } else {
                              timeSlot.addEventListener('click', () => selectTimeSlot(time));
                          }
                          
                          if (selectedTimeSlot === time) {
                              timeSlot.classList.add('selected');
                          }
                          
                          timeSlotsDiv.appendChild(timeSlot);
                      });
                      
                     appointmentsListDiv.innerHTML = '';

if (dayAppointments.length > 0) {
  const filteredAppointments = selectedTimeSlot
    ? dayAppointments.filter(apt => apt.time === selectedTimeSlot) // ✅ show only selected slot if chosen
    : dayAppointments;

  // Remove duplicates (based on time, petName, owner, type)
  const seen = new Set();
  const uniqueAppointments = filteredAppointments.filter(apt => {
    const key = `${apt.time}_${apt.petName}_${apt.owner}_${apt.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  if (uniqueAppointments.length > 0) {
    uniqueAppointments.forEach(apt => {
      const appointmentDiv = document.createElement('div');
      appointmentDiv.className = 'calendar-appointment';

     appointmentDiv.innerHTML = `
  <div class="calendar-appointment-time">
    ⏰ ${formatTo12Hour(apt.time)}
  </div>
  <div class="calendar-appointment-details">
    <strong>🐾 ${apt.petName}</strong> <span style="color:#555">(${apt.owner})</span>
    <div class="calendar-appointment-type calendar-type-${apt.type}">
      📌 ${getTypeDisplayName(apt.type)}
    </div>
    ${apt.phone ? `<div class="calendar-appointment-phone">📞 ${apt.phone}</div>` : ""}
  </div>
`;


      appointmentDiv.addEventListener('click', () => {
        sessionStorage.setItem('selectedAppointmentId', apt.id);
        window.location.href = 'custConfirm.html';
      });

      appointmentsListDiv.appendChild(appointmentDiv);
    });
  } else {
    appointmentsListDiv.innerHTML =
      '<p style="text-align: center; color: #6c757d;">No appointments for this time slot</p>';
  }
} else {
  appointmentsListDiv.innerHTML =
    '<p style="text-align: center; color: #6c757d;">No appointments scheduled</p>';
}

                      
                      // Update book button
                      bookBtn.disabled = !selectedTimeSlot;
                  }

                  function selectTimeSlot(time) {
                      selectedTimeSlot = time;
                      updateSidebar();
                  }

                  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


                  function parseDateLocal(dateStr) {
                  const [year, month, day] = dateStr.split('-').map(Number);
                return new Date(year, month - 1, day); // Month is 0-indexed
                }


                  function getTypeDisplayName(type) {
                      const types = {
                          checkup: 'General Checkup',
                          vaccinations: 'Vaccination',
                          surgery: 'Surgery',
                          grooming: 'Grooming',
                          treatment: 'Treatment',
                          consultation: 'Consultation',
                      };
                      return types[type] || type;
                  }

                  
                  function hideBookingModal() {
                      const modal = document.getElementById('bookingModal');
                      modal.style.display = 'none';
                      document.getElementById('bookingForm').reset();
                  }

                  
                  

              

                  // Close modal when clicking outside
                  window.addEventListener('click', function(e) {
                      const modal = document.getElementById('bookingModal');
                      if (e.target === modal) {
                          hideBookingModal();
                      }
                  });

        // REBOOK BUTTON //
document.addEventListener('DOMContentLoaded', async function () {
  await loadAppointmentsFromFirestore();
  initCalendar();

  const bookBtn = document.getElementById('bookBtn');

  bookBtn.addEventListener('click', async () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time slot first!");
      return;
    }

    // ✅ Re-run clinic schedule check before filling form
    await applyClinicSchedule();

    const timeSelect = document.getElementById("appt-time");
    const selectedOpt = Array.from(timeSelect.options).find(
      o => o.value === selectedTimeSlot
    );

    // ❌ If the time is blocked, stop and warn user
    if (!selectedOpt || selectedOpt.disabled) {
      alert("That time is not available. Please pick another slot.");
      return;
    }

    // ✅ Otherwise, fill booking form
    document.getElementById("appt-date").value = formatDate(selectedDate);
    document.getElementById("appt-time").value = selectedTimeSlot;

    // Redirect to booking section
    document.getElementById("book-tab").click();
  });



  // Month navigation
  document.getElementById("prevMonthBtn").addEventListener("click", () => navigateMonth(-1));
  document.getElementById("nextMonthBtn").addEventListener("click", () => navigateMonth(1));
});



     

  //PETS//

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
            petName: data.petName || data.name || '',
            species: data.species || 'other',
            breed: data.breed || '',
            age: data.age ? parseInt(data.age) : 0,
            sex: data.sex || '',
            size: data.size || '',
            weight: data.weight ? parseFloat(data.weight) : null,
            color: data.color || '',
            medicalHistory: data.medicalHistory || ''
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
          userId,
          petName: petData.petName,
          species: petData.species,
          breed: petData.breed,
          age: petData.age,
          sex: petData.sex,
          size: petData.size,
          weight: petData.weight,
          color: petData.color,
          medicalHistory: petData.medicalHistory
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
              <div class="pet-detail"><i class="fas fa-dna"></i> <span>${pet.breed || 'Mixed'}</span></div>
              <div class="pet-detail"><i class="fas fa-birthday-cake"></i> <span>${pet.age} years</span></div>
              <div class="pet-detail"><i class="fas fa-venus-mars"></i> <span>${pet.sex}</span></div>
              <div class="pet-detail"><i class="fas fa-ruler"></i> <span>${pet.size}</span></div>
              <div class="pet-detail"><i class="fas fa-weight"></i> <span>${pet.weight ? pet.weight + ' kg' : 'Not specified'}</span></div>
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

  // ✅ Instead of saving to Firestore here, build a draft object
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

  // ✅ Save draft to sessionStorage
  sessionStorage.setItem("appointment", JSON.stringify(appointmentData));

  // ✅ Close modal
  this.closeAppointmentModal();

  // ✅ Redirect to confirmation page
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


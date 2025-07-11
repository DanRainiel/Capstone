import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
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
    alert(welcomeMsg);
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
      sessionStorage.clear();
      location.replace("/index.html");
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
        modal.style.display = "none";
      }
    });
  });

// ✅ Appointment form submission logic
 document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.getElementById("submit-appointment");


  if (!submitBtn) return;

  submitBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const name = document.getElementById("appt-name").value.trim();
    const number = document.getElementById("appt-number").value.trim();
    const petName = document.getElementById("appt-petname").value.trim();
    const breed = document.getElementById("appt-breed").value.trim();
    const size = document.getElementById("appt-size").value;
    const sex = document.getElementById("appt-sex").value;
    const service = document.getElementById("appt-service").value;
    const date = document.getElementById("appt-date").value;

    if (!name || !number || !petName || !breed || !size || !sex || !service || !date) {
      alert("Please fill in all appointment fields.");
      return;
    }

    try {
      // ✅ CHANGE THIS PART ONLY:
      const uniqueId = `${userId}_${Date.now()}`; // create unique doc ID
      const appointmentRef = doc(db, "Appointment", uniqueId);
      await setDoc(appointmentRef, {
        userId, // save userId so you can query later
        name,
        number,
        petName,
        breed,
        size,
        sex,
        service,
        date,
        createdAt: new Date().toISOString()
      });

      alert("Appointment submitted successfully!");
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to submit appointment.");
    }
  });
});



  // Calendar state
        let currentDate = new Date();
        let selectedDate = null;
        let selectedTimeSlot = null;

        // Sample appointment data
        const appointments = {
            '2025-07-15': [
                { id: 1, time: '09:00', petName: 'Buddy', type: 'checkup', owner: 'John Smith', phone: '(555) 123-4567' },
                { id: 2, time: '10:30', petName: 'Whiskers', type: 'vaccination', owner: 'Sarah Johnson', phone: '(555) 234-5678' },
                { id: 3, time: '14:00', petName: 'Max', type: 'surgery', owner: 'Mike Davis', phone: '(555) 345-6789' }
            ],
            '2025-07-16': [
                { id: 4, time: '11:00', petName: 'Luna', type: 'grooming', owner: 'Emma Wilson', phone: '(555) 456-7890' }
            ],
            '2025-07-18': [
                { id: 5, time: '09:30', petName: 'Charlie', type: 'dental', owner: 'Alex Brown', phone: '(555) 567-8901' },
                { id: 6, time: '15:00', petName: 'Bella', type: 'checkup', owner: 'Lisa Garcia', phone: '(555) 678-9012' }
            ]
        };

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

        function updateCalendar() {
            const monthYear = document.getElementById('monthYear');
            const calendarGrid = document.getElementById('calendarGrid');
            
            monthYear.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            
            // Clear calendar grid
            calendarGrid.innerHTML = '';
            
            // Add day headers
            const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            dayHeaders.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                calendarGrid.appendChild(dayHeader);
            });
            
            // Get first day of month and number of days
            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            const startingDayOfWeek = firstDay.getDay();
            const daysInMonth = lastDay.getDate();
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < startingDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'calendar-day-cell';
                calendarGrid.appendChild(emptyCell);
            }
            
            // Add days of month
            const today = new Date();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dateStr = formatDate(cellDate);
                
                dayCell.className = 'calendar-day-cell';
                dayCell.innerHTML = `<div class="calendar-day-number">${day}</div>`;
                
                // Add classes based on date status
                if (cellDate.toDateString() === today.toDateString()) {
                    dayCell.classList.add('today');
                }
                
                if (cellDate < today.setHours(0, 0, 0, 0)) {
                    dayCell.classList.add('past');
                } else {
                    dayCell.addEventListener('click', () => selectDate(cellDate));
                }
                
                if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                    dayCell.classList.add('selected');
                }
                
                // Check for appointments
                const dayAppointments = appointments[dateStr] || [];
                if (dayAppointments.length > 0) {
                    dayCell.classList.add('has-appointments');
                    const countBadge = document.createElement('div');
                    countBadge.className = 'calendar-appointment-count';
                    countBadge.textContent = dayAppointments.length;
                    dayCell.appendChild(countBadge);
                }
                
                // Check if fully booked
                if (dayAppointments.length >= timeSlots.length) {
                    dayCell.classList.add('fully-booked');
                } else if (dayAppointments.length < timeSlots.length && cellDate >= today.setHours(0, 0, 0, 0)) {
                    const availableIndicator = document.createElement('div');
                    availableIndicator.className = 'calendar-available-indicator';
                    availableIndicator.textContent = 'Available';
                    dayCell.appendChild(availableIndicator);
                }
                
                calendarGrid.appendChild(dayCell);
            }
        }

        function navigateMonth(direction) {
            currentDate.setMonth(currentDate.getMonth() + direction);
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
                timeSlot.textContent = time;
                
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
            
            // Update appointments list
            appointmentsListDiv.innerHTML = '';
            if (dayAppointments.length > 0) {
                dayAppointments.forEach(apt => {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.className = 'calendar-appointment';
                    appointmentDiv.innerHTML = `
                        <div class="calendar-appointment-time">${apt.time}</div>
                        <div class="calendar-appointment-details">
                            <strong>${apt.petName}</strong> - ${apt.owner}
                            <div class="calendar-appointment-type calendar-type-${apt.type}">${getTypeDisplayName(apt.type)}</div>
                        </div>
                    `;
                    appointmentsListDiv.appendChild(appointmentDiv);
                });
            } else {
                appointmentsListDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">No appointments scheduled</p>';
            }
            
            // Update book button
            bookBtn.disabled = !selectedTimeSlot;
        }

        function selectTimeSlot(time) {
            selectedTimeSlot = time;
            updateSidebar();
        }

        function formatDate(date) {
            return date.toISOString().split('T')[0];
        }

        function getTypeDisplayName(type) {
            const types = {
                checkup: 'General Checkup',
                vaccination: 'Vaccination',
                surgery: 'Surgery',
                grooming: 'Grooming',
                dental: 'Dental Care'
            };
            return types[type] || type;
        }

        function showBookingModal() {
            const modal = document.getElementById('bookingModal');
            modal.style.display = 'block';
        }

        function hideBookingModal() {
            const modal = document.getElementById('bookingModal');
            modal.style.display = 'none';
            document.getElementById('bookingForm').reset();
        }

        // Handle form submission
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const petName = document.getElementById('petName').value;
            const ownerName = document.getElementById('ownerName').value;
            const appointmentType = document.getElementById('appointmentType').value;
            const phone = document.getElementById('phone').value;
            
            // Add new appointment
            const dateStr = formatDate(selectedDate);
            if (!appointments[dateStr]) {
                appointments[dateStr] = [];
            }
            
            appointments[dateStr].push({
                id: Date.now(),
                time: selectedTimeSlot,
                petName: petName,
                type: appointmentType,
                owner: ownerName,
                phone: phone
            });
            
            // Update UI
            updateCalendar();
            updateSidebar();
            hideBookingModal();
            
            // Show success message
            alert('Appointment booked successfully! 🎉');
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            const modal = document.getElementById('bookingModal');
            if (e.target === modal) {
                hideBookingModal();
            }
        });

        // Initialize calendar when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initCalendar();
        });
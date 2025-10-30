import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteField,
  where,   
  Timestamp,
  updateDoc,  
  setDoc,  
  onSnapshot,
  getDoc,
  deleteDoc,
  doc,
  writeBatch
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

// 🔍 Log staff activity
export async function logActivity(userId, action, details) {
  try {
    await addDoc(collection(db, "ActivityLog"), {
      userId: userId || "anonymous",
      action,
      details,
      timestamp: serverTimestamp()
    });
    console.log("Activity logged:", action);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Prevent back navigation for staff
  if (sessionStorage.getItem("role") === "staff") {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => {
      location.replace(location.href);
    });
  }

  // Sidebar toggle
  const toggle = document.querySelector('.toggle');
  const navigation = document.querySelector('.navigation');
  const main = document.querySelector('.main');

  toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('active');
  };

  // Navigation functionality
  const menuItems = document.querySelectorAll('.navigation ul li a[data-section]');
  const contentSections = document.querySelectorAll('.content-section');

  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all menu items
      document.querySelectorAll('.navigation ul li').forEach(li => {
        li.classList.remove('hovered');
      });
      
      // Add active class to clicked menu item
      this.parentElement.classList.add('hovered');
      
      // Hide all content sections
      contentSections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Show selected content section
      const targetSection = this.getAttribute('data-section');
      const targetElement = document.getElementById(targetSection);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });

  // Highlight active menu on hover
  const list = document.querySelectorAll(".navigation li");
  list.forEach((item) => {
    item.addEventListener("mouseover", function () {
      // Only change hover effect if not currently active
      if (!this.classList.contains('hovered')) {
        list.forEach((el) => el.classList.remove("hover-temp"));
        this.classList.add("hover-temp");
      }
    });
    
    item.addEventListener("mouseleave", function () {
      this.classList.remove("hover-temp");
    });
  });

  // Set initial active state for dashboard
  document.querySelector('a[data-section="dashboard"]').parentElement.classList.add('hovered');

  // Welcome message
  const welcomeMsg = sessionStorage.getItem("welcomeMessage");
  if (welcomeMsg) {
    Swal.fire({
      title: 'Welcome!',
      text: welcomeMsg,
      icon: 'info',
      iconColor: '#f8732b',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f8732b'
    });
    sessionStorage.removeItem("welcomeMessage");
  }

  // Form submission handlers
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formId = e.target.id;
    let message = 'Form submitted successfully!';
    
    switch(formId) {
      case 'walkinForm':
        message = 'Walk-in patient registered successfully!';
        break;
      case 'newsForm':
        message = 'News article published successfully!';
        break;
      case 'discountForm':
        message = 'Discount created successfully!';
        break;
      case 'vaccinationLabelForm':
        message = 'Vaccination label generated and printed successfully!';
        break;
    }
    
    alert(message);
    e.target.reset();
  });

  // Action button handlers
  document.addEventListener('click', function(e) {
    const buttonText = e.target.textContent.trim();
    
    if (e.target.matches('.btn-primary') || e.target.matches('.btn-danger')) {
      switch(buttonText) {
        case 'View':
        case 'View All':
        case 'View Details':
          alert('Opening detailed view...');
          break;
        case 'Edit':
        case 'Update':
          alert('Opening edit form...');
          break;
        case 'Complete':
          if (confirm('Mark this appointment as completed?')) {
            alert('Appointment marked as completed.');
            // Update status in the UI
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status completed';
              statusCell.textContent = 'Completed';
            }
          }
          break;
        case 'Cancel':
          if (confirm('Are you sure you want to cancel this appointment?')) {
            alert('Appointment cancelled.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status cancelled';
              statusCell.textContent = 'Cancelled';
            }
          }
          break;
        case 'Deactivate':
          if (confirm('Are you sure you want to deactivate this user?')) {
            alert('User deactivated.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status cancelled';
              statusCell.textContent = 'Inactive';
            }
          }
          break;
        case 'Reactivate':
          if (confirm('Reactivate this user account?')) {
            alert('User reactivated.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status completed';
              statusCell.textContent = 'Active';
            }
          }
          break;
        case 'Print':
        case 'Print Label':
        case 'Reprint Label':
          alert('Printing document...');
          break;
        case 'Generate Report':
          alert('Generating report...');
          break;
        case 'Export to PDF':
          alert('Exporting to PDF...');
          break;
        case 'Export to Excel':
          alert('Exporting to Excel...');
          break;
        case 'Send Reminder':
          alert('Vaccination reminder sent successfully!');
          break;
        case 'Book Appointment':
          alert('Redirecting to appointment booking...');
          break;
        case 'Publish':
          if (confirm('Publish this news article?')) {
            alert('News article published successfully!');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status completed';
              statusCell.textContent = 'Published';
            }
          }
          break;
        case 'Unpublish':
          if (confirm('Unpublish this news article?')) {
            alert('News article unpublished.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status pending';
              statusCell.textContent = 'Draft';
            }
          }
          break;
        case 'Delete':
          if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            alert('Item deleted successfully.');
            e.target.closest('tr').remove();
          }
          break;
        case 'Start':
          alert('Starting appointment...');
          const statusCell = e.target.closest('tr').querySelector('.status');
          if (statusCell) {
            statusCell.className = 'status pending';
            statusCell.textContent = 'In Progress';
          }
          break;
        case 'No Show':
          if (confirm('Mark this appointment as No Show?')) {
            alert('Appointment marked as No Show.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status cancelled';
              statusCell.textContent = 'No Show';
            }
          }
          break;
        case 'Reschedule':
          alert('Opening reschedule form...');
          break;
        case 'Block':
          alert('Time slot blocked successfully!');
          break;
        case 'Remove Block':
          if (confirm('Remove this time block?')) {
            alert('Time block removed.');
            e.target.closest('tr').remove();
          }
          break;
      }
    }
  });

  // Search functionality
  const searchInput = document.querySelector('.search input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      console.log('Searching for:', searchTerm);
    });
  }
});

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parsePeso(val) {
  if (!val) return 0;
  if (typeof val === "number") return val;
  return parseFloat(val.toString().replace(/[₱,]/g, "")) || 0;
}

// ✅ Global state
let currentDate = new Date();
let selectedDate = null;
let appointmentsData = {};

async function fetchAppointments() {
  appointmentsData = {};

  // Load both collections
  const [apptSnap, walkInSnap] = await Promise.all([
    getDocs(collection(db, "Appointment")),
    getDocs(collection(db, "WalkInAppointment"))
  ]);

  // Merge Appointment docs
  apptSnap.forEach(doc => {
    const appt = doc.data();
    const dateKey = appt.date;

    if (!appointmentsData[dateKey]) appointmentsData[dateKey] = [];

    appointmentsData[dateKey].push({
      time: appt.time,
      owner: appt.name,
      pet: appt.petName,
      service: appt.service,
      status: appt.status || "pending",
      totalAmount: parsePeso(appt.totalAmount),
      amountPaid: parsePeso(appt.reservationFee)
    });
  });

  // Merge WalkInAppointment docs
  walkInSnap.forEach(doc => {
    const appt = doc.data();
    const dateKey = appt.date;

    if (!appointmentsData[dateKey]) appointmentsData[dateKey] = [];

    appointmentsData[dateKey].push({
      time: appt.time,
      owner: appt.name,
      pet: appt.petName,
      service: appt.service,
      status: appt.status || "pending",
      totalAmount: appt.totalAmount || 0,
      amountPaid: appt.amountPaid || 0
    });
  });

  renderCalendar();
}

// ✅ Calendar initialization
function initializeCalendar() {
  setupCalendarNavigation();
  fetchAppointments();
}

function renderCalendar() {
  const calendarGrid = document.getElementById('calendarGrid');
  const monthYear = document.getElementById('monthYear');
  if (!calendarGrid || !monthYear) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month label
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  monthYear.textContent = `${monthNames[month]} ${year}`;

  calendarGrid.innerHTML = '';

  // Weekday headers
  const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayHeaders.forEach(day => {
    const header = document.createElement('div');
    header.className = 'calendar-day-header';
    header.textContent = day;
    calendarGrid.appendChild(header);
  });

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 42; i++) {
    const currentDay = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

    const cell = document.createElement('div');
    cell.className = 'calendar-day';
    cell.textContent = currentDay.getDate();

    const dateKey = formatDateLocal(currentDay);

    if (currentDay.getMonth() !== month) {
      cell.classList.add('other-month');
    } else if (currentDay < today) {
      cell.classList.add('past-date');
    } else {
      if (currentDay.toDateString() === today.toDateString()) {
        cell.classList.add('today');
      }

      if (appointmentsData[dateKey] && appointmentsData[dateKey].length > 0) {
        cell.classList.add('has-appointment');
      }

      cell.addEventListener('click', (e) => selectDate(dateKey, currentDay, e));
    }

    calendarGrid.appendChild(cell);
  }
}

// ✅ Date selection
function selectDate(dateKey, dateObj, e) {
  document.querySelectorAll('.calendar-day.selected').forEach(day => day.classList.remove('selected'));
  e.target.classList.add('selected');

  selectedDate = dateKey;
  displayAppointments(dateKey, dateObj);
}

function displayAppointments(dateKey, dateObj) {
  const title = document.getElementById('selectedDateTitle');
  const list = document.getElementById('appointmentsList');
  if (!title || !list) return;

  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });
  title.textContent = `Appointments for ${formattedDate}`;

  const appts = appointmentsData[dateKey] || [];
  if (appts.length === 0) {
    list.innerHTML = `
      <div class="no-appointments">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
        <p>No appointments scheduled for this date</p>
      </div>
    `;
    return;
  }

  list.innerHTML = appts.map(appt => {
    const balance = (appt.totalAmount || 0) - (appt.amountPaid || 0);

    return `
      <div class="appointment-item">
        <div class="appointment-time">${appt.time}</div>
        <div class="appointment-details">
          <div class="appointment-pet">${appt.pet} (${appt.owner})</div>
          <div style="margin-top: 5px;">
            <span style="color:#666;">Service:</span> ${appt.service}
            <span class="status ${appt.status}" style="margin-left:10px;">${appt.status}</span>
          </div>
          <div style="margin-top: 5px;">
            <span style="color:#666;">Amount Paid:</span> ₱${appt.amountPaid.toLocaleString()}
          </div>
          <div style="margin-top: 5px;">
            <span style="color:#666;">Remaining Balance:</span> ₱${balance.toLocaleString()}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ✅ Navigation controls
function setupCalendarNavigation() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  }
}

// ✅ Run on page load
document.addEventListener("DOMContentLoaded", initializeCalendar);

// WALK IN FORM//
document.getElementById("walkinForm")?.addEventListener("submit", async function(e) {
  e.preventDefault();

  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in.");
    return;
  }

  const formData = new FormData(e.target);

  // ✅ Get variant & fee from the form/UI
  const selectedVariant = formData.get("variant") || "";
  const feeText = document.getElementById("serviceFee").textContent.replace("₱", "").replace(",", "");
  const totalAmount = parseFloat(feeText) || 0;

  const petData = {
    petName: formData.get("petName"),
    species: formData.get("petType"),
    breed: formData.get("breed"),
    age: formData.get("age"),
    sex: formData.get("gender"),
    weight: formData.get("weight"),
    size: "",
    color: "",
    medicalHistory: ""
  };

  const appointmentData = {
    userId,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    contact: formData.get("contact"),
    email: formData.get("email"),
    address: formData.get("address"),
    serviceType: formData.get("serviceType"),
    variant: selectedVariant,
    totalAmount: totalAmount,
    reason: formData.get("reason"),
    priority: formData.get("priority"),
    timestamp: Date.now(),
    pet: petData
  };

  try {
    const appointmentId = `${userId}_${petData.petName}_${appointmentData.timestamp}`;
    await setDoc(doc(db, "WalkInAppointment", appointmentId), appointmentData);

    await addPetToFirestore(petData);

    alert("Walk-in appointment and pet saved successfully!");
    e.target.reset();

    // Refresh data after saving
    await loadAllAppointments();
    await loadRecentActivity();
  } catch (error) {
    console.error("Error saving walk-in appointment:", error);
    alert("Failed to save appointment. Please try again.");
  }
});

async function addPetToFirestore(petData) {
  const userId = sessionStorage.getItem("userId");
  if (!userId) return;

  const timestamp = Date.now();
  const docId = `${userId}_${petData.petName}_${timestamp}`;
  await setDoc(doc(db, "WalkInPets", docId), {
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
}

// Service pricing table
const servicePrices = {
  vaccination: {
    "5n1": { small: 500, medium: 500, large: 500 },
    "8in1": { small: 600, medium: 600, large: 600 },
    "Kennel Cough": { small: 500, medium: 500, large: 500 },
    "4n1": { small: 950, medium: 950, large: 950, cat: 950 },
    "Anti-Rabies": { small: 350, medium: 350, large: 350, cat: 350 }
  },
  grooming: {
    basic: { small: 450, medium: 600, large: 800, cat: 600 }
  },
  consultation: {
    regular: { small: 350, medium: 350, large: 350, cat: 350 }
  },
  treatment: {
    tickFlea: { small: 650, medium: 700, large: 800 },
    heartwormPrevention: {
      small: 2000, medium: 2500, large: 3000, xl: 4500
    },
    catTickFleaDeworm: { small: 650, large: 750 }
  },
  deworming: {
    regular: { small: 200, medium: 300, large: 400, cat: 300 }
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

// Elements
const serviceTypeSelect = document.getElementById("serviceType");
const serviceVariantsDiv = document.getElementById("serviceVariants");
const serviceFeeDisplay = document.getElementById("serviceFee");

// Auto detect pet size from weight
function getPetSize(weight) {
  if (!weight) return "small";
  if (weight <= 10) return "small";
  if (weight <= 20) return "medium";
  if (weight <= 40) return "large";
  return "xl";
}

// Update variants dynamically
serviceTypeSelect.addEventListener("change", function () {
  const selectedService = this.value;
  serviceVariantsDiv.innerHTML = "";
  serviceFeeDisplay.textContent = "₱0.00";

  if (!selectedService || !servicePrices[selectedService]) return;

  const serviceOptions = servicePrices[selectedService];

  Object.keys(serviceOptions).forEach((variantKey) => {
    const variant = serviceOptions[variantKey];

    const option = document.createElement("div");
    option.classList.add("variant-option");

    if (typeof variant === "object") {
      option.innerHTML = `
        <label>
          <input type="radio" name="variant" value="${variantKey}">
          ${variantKey}
        </label>
      `;
    } else {
      option.innerHTML = `
        <label>
          <input type="radio" name="variant" value="${variantKey}">
          ${variantKey} - ₱${variant}
        </label>
      `;
    }

    serviceVariantsDiv.appendChild(option);
  });

  // Listen for variant selection
  document.querySelectorAll('input[name="variant"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const variantKey = radio.value;
      const weight = parseFloat(document.querySelector("input[name='weight']").value);
      const sizeKey = getPetSize(weight);

      const variantData = serviceOptions[variantKey];
      let price = 0;

      if (typeof variantData === "object") {
        price = variantData[sizeKey] || variantData.small || 0;
      } else {
        price = variantData;
      }

      serviceFeeDisplay.textContent = `₱${price}`;
    });
  });
});

// Handle Decline button click
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("decline")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const colName = type === "walkin" ? "WalkInAppointment" : "Appointment";
      const docRef = doc(db, colName, docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Swal.fire("Error", "Appointment not found.", "error");
        return;
      }

      const appointmentData = docSnap.data();

      await updateDoc(docRef, { status: "Declined" });

      await addDoc(collection(db, "Notifications"), {
        userId: appointmentData.userId || "",
        appointmentId: docId,
        type: "decline",
        message: `Your appointment for ${appointmentData.pet?.petName || "your pet"} has been declined.`,
        service: appointmentData.service || "Unknown service",
        status: "unread",
        createdAt: serverTimestamp()
      });

      Swal.fire("Declined", "The appointment has been declined and a notification was sent.", "success");
    } catch (err) {
      console.error("Error declining appointment:", err);
      Swal.fire("Error", "Something went wrong while declining the appointment.", "error");
    }
  }
});

// Handle "View" button
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        Swal.fire({
          title: "Appointment Details",
          html: `
            <p><strong>Name:</strong> ${data.name || `${data.firstName || ""} ${data.lastName || ""}`}</p>
            <p><strong>Pet:</strong> ${data.petName || data.pet?.petName || "N/A"}</p>
            <p><strong>Service:</strong> ${data.service || data.serviceType}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <p><strong>Contact:</strong> ${data.contact}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Total Amount:</strong> ${data.totalAmount || "0.00"}</p>
          `,
          width: "600px",
          confirmButtonText: "Close"
        });

      } else {
        Swal.fire("Error", "Appointment not found.", "error");
      }
    } catch (err) {
      console.error("Error viewing appointment:", err);
      Swal.fire("Error", "Something went wrong while fetching appointment details.", "error");
    }
  }
});

// Handle "Edit" button
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        const { value: formValues } = await Swal.fire({
          title: "Edit Appointment",
          html: `
            <input id="swal-name" class="swal2-input" placeholder="Name" value="${data.name || `${data.firstName || ""} ${data.lastName || ""}`}">
            <input id="swal-pet" class="swal2-input" placeholder="Pet Name" value="${data.petName || data.pet?.petName || ""}">
            <input id="swal-service" class="swal2-input" placeholder="Service" value="${data.service || data.serviceType || ""}">
            <input id="swal-date" type="date" class="swal2-input" value="${data.date || ""}">
            <input id="swal-time" type="time" class="swal2-input" value="${data.time || ""}">
            <input id="swal-contact" class="swal2-input" placeholder="Contact" value="${data.contact || ""}">
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Save",
          preConfirm: () => {
            return {
              name: document.getElementById("swal-name").value,
              petName: document.getElementById("swal-pet").value,
              service: document.getElementById("swal-service").value,
              date: document.getElementById("swal-date").value,
              time: document.getElementById("swal-time").value,
              contact: document.getElementById("swal-contact").value
            };
          }
        });

        if (formValues) {
          await updateDoc(docRef, formValues);
          Swal.fire("Updated!", "Appointment has been updated.", "success");
          loadAllAppointments();
        }
      } else {
        Swal.fire("Error", "Appointment not found.", "error");
      }
    } catch (err) {
      console.error("Error editing appointment:", err);
      Swal.fire("Error", "Something went wrong while editing appointment.", "error");
    }
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("viewreason")) {
    const docId = e.target.getAttribute("data-id");
    console.log("🔍 Fetching cancel reason for docId:", docId);

    try {
      const docRef = doc(db, "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();
        console.log("✅ Appointment data:", data);

        const reason = data.cancelReason || "No reason provided.";
        const cancelledAt = data.cancelledAt?.toDate
          ? data.cancelledAt.toDate().toLocaleString()
          : "Unknown time";

        Swal.fire({
          title: "Cancellation Reason",
          html: `
            <p><strong>Reason:</strong> ${reason}</p>
            <p><strong>Cancelled At:</strong> ${cancelledAt}</p>
          `,
          icon: "info",
          confirmButtonText: "Close"
        });
      } else {
        console.warn("❌ Appointment not found for docId:", docId);
        Swal.fire("Error", "Appointment not found.", "error");
      }
    } catch (error) {
      console.error("🔥 Error fetching cancel reason:", error);
      Swal.fire("Error", "Failed to load cancellation reason.", "error");
    }
  }
});

// Handle "View Screenshot"
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("screenshot")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    console.log("Fetching screenshot for:", { docId, type });

    try {
      const docRef = doc(db, type, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        const reservationType = data.reservationType || "-";
        const totalAmount = data.totalAmount || "-";

        let htmlContent = `
          <div style="text-align:left">
            <p><strong>Reservation Type:</strong> ${reservationType}</p>
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
        `;

        if (data.receiptImage) {
          htmlContent += `
            <p><strong>Uploaded Screenshot:</strong></p>
            <img src="${data.receiptImage}" style="width:800px;max-width:100%;border-radius:8px">
          `;
        } else {
          htmlContent += `
            <p style="color:gray"><em>No screenshot uploaded.</em></p>
          `;
        }

        htmlContent += `</div>`;

        Swal.fire({
          title: "Reservation Details",
          html: htmlContent,
          width: "auto",
        });

      } else {
        Swal.fire("Error", "Appointment document could not be found.", "error");
      }
    } catch (err) {
      console.error("Error fetching screenshot:", err);
      Swal.fire("Error", "Something went wrong while loading the screenshot.", "error");
    }
  }
});

// Handle "Reschedule" button
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("reschedule")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    if (!docId) {
      return Swal.fire("Error", "Invalid appointment.", "error");
    }

    const colName = type === "walkin" ? "WalkInAppointment" : "Appointment";
    const docRef = doc(db, colName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Swal.fire("Error", "Appointment not found.", "error");
    }

    const appointmentData = docSnap.data();
    const userId = appointmentData.userId;

    function generateTimeSlots(startHour, endHour) {
      const slots = [];
      const start = new Date();
      start.setHours(startHour, 0, 0, 0);

      const end = new Date();
      end.setHours(endHour, 30, 0, 0);

      while (start < end) {
        const endSlot = new Date(start.getTime() + 30 * 60000);

        const formatTime = (date) =>
          date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        slots.push(`${formatTime(start)} - ${formatTime(endSlot)}`);
        start.setMinutes(start.getMinutes() + 30);
      }

      return slots;
    }

    const timeSlots = generateTimeSlots(9, 17);

    const slotOptions = timeSlots
      .map((slot) => `<option value="${slot}">${slot}</option>`)
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Reschedule Appointment",
      width: 600,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <label for="new-date"><b>New Date</b></label>
          <input type="date" id="new-date" class="swal2-input" style="width: 90%;" required>

          <label for="new-time"><b>Time Slot</b></label>
          <select id="new-time" class="swal2-input" style="width: 90%;" required>
            <option value="">-- Select Time Slot --</option>
            ${slotOptions}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Reschedule",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const date = document.getElementById("new-date").value;
        const slot = document.getElementById("new-time").value;

        if (!date || !slot) {
          Swal.showValidationMessage("Please select both date and time slot.");
          return false;
        }

        const time = slot.split(" - ")[0];
        return { date, time };
      }
    });

    if (!formValues) return;

    try {
      await updateDoc(docRef, {
        date: formValues.date,
        time: formValues.time,
        status: "pending",
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, "Notifications"), {
        appointmentId: docId,
        userId,
        type: "reminder",
        service: appointmentData.service || "Appointment",
        status: "unread",
        message: `Your appointment for ${appointmentData.petName || "your pet"} has been rescheduled to ${formValues.date} at ${formValues.time}.`,
        createdAt: serverTimestamp()
      });

      Swal.fire("Rescheduled", "The appointment has been updated and set back to pending. A reminder was sent to the user.", "success");
    } catch (err) {
      console.error("❌ Error during reschedule:", err);
      Swal.fire("Error", "Something went wrong while rescheduling.", "error");
    }
  }
});

// ============================================
// CRITICAL TIME FORMAT FIXES
// ============================================

// 🔹 FIX 1: View Appointment Modal
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        const displayTime = data.startTime && data.endTime 
          ? `${data.startTime} - ${data.endTime}` 
          : data.time || "N/A";

        Swal.fire({
          title: "Appointment Details",
          html: `
            <p><strong>Name:</strong> ${data.name || `${data.firstName || ""} ${data.lastName || ""}`}</p>
            <p><strong>Pet:</strong> ${data.petName || data.pet?.petName || "N/A"}</p>
            <p><strong>Service:</strong> ${data.service || data.serviceType}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Time:</strong> ${displayTime}</p>
            <p><strong>Contact:</strong> ${
              data.contact || 
              data.contactNumber || 
              data.ownerNumber || 
              data.phone || 
              "N/A"
            }</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Total Amount:</strong> ${data.totalAmount || "0.00"}</p>
          `,
          width: "600px",
          confirmButtonText: "Close"
        });

      } else {
        Swal.fire("Error", "Appointment not found.", "error");
      }
    } catch (err) {
      console.error("Error viewing appointment:", err);
      Swal.fire("Error", "Something went wrong while fetching appointment details.", "error");
    }
  }
});

// 🔹 FIX 2: Edit Appointment Modal
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        const displayTime = data.startTime && data.endTime 
          ? `${data.startTime} - ${data.endTime}` 
          : data.time || "";

        const { value: formValues } = await Swal.fire({
          title: "Edit Appointment",
          html: `
            <input id="swal-name" class="swal2-input" placeholder="Name" value="${data.name || `${data.firstName || ""} ${data.lastName || ""}`}">
            <input id="swal-pet" class="swal2-input" placeholder="Pet Name" value="${data.petName || data.pet?.petName || ""}">
            <input id="swal-service" class="swal2-input" placeholder="Service" value="${data.service || data.serviceType || ""}">
            <input id="swal-date" type="date" class="swal2-input" value="${data.date || ""}">
            <input id="swal-start-time" type="time" class="swal2-input" placeholder="Start Time" value="${data.startTime || ""}">
            <input id="swal-end-time" type="time" class="swal2-input" placeholder="End Time" value="${data.endTime || ""}">
            <input id="swal-contact" class="swal2-input" placeholder="Contact" value="${data.contact || ""}">
          `,
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Save",
          preConfirm: () => {
            return {
              name: document.getElementById("swal-name").value,
              petName: document.getElementById("swal-pet").value,
              service: document.getElementById("swal-service").value,
              date: document.getElementById("swal-date").value,
              startTime: document.getElementById("swal-start-time").value,
              endTime: document.getElementById("swal-end-time").value,
              contact: document.getElementById("swal-contact").value
            };
          }
        });

        if (formValues) {
          await updateDoc(docRef, {
            name: formValues.name,
            petName: formValues.petName,
            service: formValues.service,
            date: formValues.date,
            startTime: formValues.startTime,
            endTime: formValues.endTime,
            contact: formValues.contact
          });
          
          Swal.fire("Updated!", "Appointment has been updated.", "success");
          loadAllAppointments();
        }
      } else {
        Swal.fire("Error", "Appointment not found.", "error");
      }
    } catch (err) {
      console.error("Error editing appointment:", err);
      Swal.fire("Error", "Something went wrong while editing appointment.", "error");
    }
  }
});

// 🔹 FIX 3: Reschedule Modal
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("reschedule")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    if (!docId) {
      return Swal.fire("Error", "Invalid appointment.", "error");
    }

    const colName = type === "walkin" ? "WalkInAppointment" : "Appointment";
    const docRef = doc(db, colName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Swal.fire("Error", "Appointment not found.", "error");
    }

    const appointmentData = docSnap.data();
    const userId = appointmentData.userId;

    function generateTimeSlots(startHour, endHour) {
      const slots = [];
      const start = new Date();
      start.setHours(startHour, 0, 0, 0);

      const end = new Date();
      end.setHours(endHour, 30, 0, 0);

      while (start < end) {
        const endSlot = new Date(start.getTime() + 30 * 60000);

        const formatTime = (date) =>
          date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        slots.push({
          display: `${formatTime(start)} - ${formatTime(endSlot)}`,
          start: formatTime(start),
          end: formatTime(endSlot)
        });
        
        start.setMinutes(start.getMinutes() + 30);
      }

      return slots;
    }

    const timeSlots = generateTimeSlots(9, 17);

    const slotOptions = timeSlots
      .map((slot) => `<option value="${slot.start}|${slot.end}">${slot.display}</option>`)
      .join("");

    const { value: formValues } = await Swal.fire({
      title: "Reschedule Appointment",
      width: 600,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <label for="new-date"><b>New Date</b></label>
          <input type="date" id="new-date" class="swal2-input" style="width: 90%;" required>

          <label for="new-time"><b>Time Slot</b></label>
          <select id="new-time" class="swal2-input" style="width: 90%;" required>
            <option value="">-- Select Time Slot --</option>
            ${slotOptions}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Reschedule",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const date = document.getElementById("new-date").value;
        const timeValue = document.getElementById("new-time").value;

        if (!date || !timeValue) {
          Swal.showValidationMessage("Please select both date and time slot.");
          return false;
        }

        const [startTime, endTime] = timeValue.split("|");
        return { date, startTime, endTime };
      }
    });

    if (!formValues) return;

    try {
      await updateDoc(docRef, {
        date: formValues.date,
        startTime: formValues.startTime,
        endTime: formValues.endTime,
        status: "pending",
        updatedAt: serverTimestamp()
      });

      await addDoc(collection(db, "Notifications"), {
        appointmentId: docId,
        userId,
        type: "reminder",
        service: appointmentData.service || "Appointment",
        status: "unread",
        message: `Your appointment for ${appointmentData.petName || "your pet"} has been rescheduled to ${formValues.date} at ${formValues.startTime} - ${formValues.endTime}.`,
        createdAt: serverTimestamp()
      });

      Swal.fire("Rescheduled", "The appointment has been updated with new time slot.", "success");
    } catch (err) {
      console.error("❌ Error during reschedule:", err);
      Swal.fire("Error", "Something went wrong while rescheduling.", "error");
    }
  }
});

// 🔹 FIX 4: View Pet Details Modal
async function viewAppointmentDetails(appointmentId) {
  try {
    const apptRef = doc(db, "Appointment", appointmentId);
    const apptSnap = await getDoc(apptRef);

    if (!apptSnap.exists()) {
      return Swal.fire("Not Found", "Appointment not found in database.", "warning");
    }

    const data = apptSnap.data();
    const safe = (val) => (val ? val : "—");

    const displayTime = data.startTime && data.endTime 
      ? `${data.startTime} - ${data.endTime}` 
      : data.time || "—";

    const contactNumber = data.contact || data.ownerNumber || data.contactNumber || "—";

    let petImageHTML = "";
    if (data.petId) {
      try {
        const petRef = doc(db, "Pets", data.petId);
        const petSnap = await getDoc(petRef);
        if (petSnap.exists()) {
          const petData = petSnap.data();
          if (petData.petImage) {
            petImageHTML = `
              <div style="text-align:center;margin-bottom:10px;">
                <img src="${petData.petImage}" alt="${safe(data.petName)}"
                     style="width:120px;height:120px;border-radius:10px;object-fit:cover;">
              </div>`;
          }
        }
      } catch (e) {
        console.warn("⚠️ Could not load pet image:", e);
      }
    }

    await Swal.fire({
      title: `<i class="fa-solid fa-calendar-check"></i> Appointment Details`,
      html: `
        ${petImageHTML}
        <div style="text-align:left;line-height:1.8;">
          <strong>Owner Name:</strong> ${safe(data.name || data.ownerName)}<br>
          <strong>Contact Number:</strong> ${contactNumber}<br>
          <strong>Pet Name:</strong> ${safe(data.petName)}<br>
          <strong>Pet Size:</strong> ${safe(data.petSize)}<br>
          <strong>Service:</strong> ${safe(data.service)}<br>
          <strong>Selected Services:</strong> ${safe(data.selectedServices?.join(", "))}<br>
          <strong>Service Fee:</strong> ${safe(data.serviceFee)}<br>
          <strong>Reservation Fee:</strong> ${safe(data.reservationFee)}<br>
          <strong>Total Amount:</strong> ${safe(data.totalAmount)}<br>
          <strong>Vet:</strong> ${safe(data.vet)}<br>
          <strong>Status:</strong> ${safe(data.status)}<br>
          <strong>Date:</strong> ${safe(data.date)}<br>
          <strong>Time:</strong> ${displayTime}<br>
          <strong>Reservation Type:</strong> ${safe(data.reservationType)}<br>
          <strong>Instructions:</strong> ${safe(data.instructions)}<br>
        </div>
      `,
      confirmButtonText: "Close",
      width: 520,
      confirmButtonColor: "#3085d6"
    });

  } catch (err) {
    console.error("❌ Error loading appointment details:", err);
    Swal.fire("Error", "Failed to load appointment details. Please try again.", "error");
  }
}

// 🔹 FIX 5: View Pet Details Button Event Listener
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn.view-pet-details");
  if (!btn) return;

  const appointmentId = btn.dataset.appointmentId || btn.getAttribute("data-id");
  const type = btn.dataset.type || "appointment";

  if (!appointmentId) {
    Swal.fire("Missing Info", "Appointment ID not found for this record.", "warning");
    return;
  }

  console.log("🔍 Opening pet details for appointment:", appointmentId, "Type:", type);
  await viewAppointmentDetails(appointmentId);
});

// ============================================
// UPDATE renderRow FUNCTION WITH "NO SHOW" BUTTON
// ============================================

function renderRow(data, type, docId) {
  const safe = (v) => (v === undefined || v === null ? "" : v);

  // Normalize status
  const statusRaw = safe(data.status) || "Pending";
  const statusNormalized = String(statusRaw).trim().toLowerCase();

  // ✅ FIX: Format time properly (start–end)
  let formattedTime = "";
  if (type === "walkin" && data.timestamp) {
    formattedTime = new Date(data.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (data.startTime && data.endTime) {
    formattedTime = `${safe(data.startTime)} - ${safe(data.endTime)}`;
  } else if (data.startTime) {
    formattedTime = safe(data.startTime);
  } else if (data.time) {
    formattedTime = safe(data.time);
  }

  // Normalize date
  const rawDateSource = type === "walkin" && data.timestamp ? data.timestamp : data.date;
  
  function normalizeToISODate(val) {
    if (val == null || val === "") return "";
    if (typeof val?.toDate === "function") return normalizeToISODate(val.toDate());
    if (val instanceof Date) {
      const y = val.getFullYear();
      const m = String(val.getMonth() + 1).padStart(2, "0");
      const d = String(val.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
    if (typeof val === "number") return normalizeToISODate(new Date(val));
    if (typeof val === "string") {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) return normalizeToISODate(parsed);
      const m = val.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (m) return `${m[3]}-${String(m[1]).padStart(2,"0")}-${String(m[2]).padStart(2,"0")}`;
    }
    return String(val);
  }

  function formatDisplayDate(val) {
    try {
      if (typeof val?.toDate === "function") val = val.toDate();
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    } catch {}
    return val ? String(val) : "";
  }

  const dateISO = normalizeToISODate(rawDateSource);
  const dateDisplay = formatDisplayDate(rawDateSource) || dateISO || "";

  const displayData = {
    name: type === "walkin" ? `${safe(data.firstName)} ${safe(data.lastName)}`.trim() : safe(data.name),
    petName: safe(data.petName) || safe(data.pet?.petName),
    service: safe(data.service),
    walkinService: safe(data.serviceType),
    dateISO,
    date: dateDisplay,
    time: formattedTime,
    contact: safe(data.contact),
    status: statusRaw,
    statusNormalized,
    mode: type === "walkin" ? "Walk-In" : "Appointment",
    reservationType: safe(data.reservationType),
    reservationFee: safe(data.reservationFee),
    userId: safe(data.userId),
    appointmentId: docId,
    sourceType: type,
  };

  // --- Render to Dashboard Table ---
  const dashboardTable = document.getElementById("table-dashboard");
  if (dashboardTable && type !== "walkin") {
    const dashRow = document.createElement("tr");
    dashRow.innerHTML = `
      <td>${displayData.name}</td>
      <td>${displayData.petName}</td>
      <td>${displayData.service}</td>
      <td>${displayData.time}</td>
      <td>${displayData.mode}</td>
      <td class="status ${displayData.statusNormalized}">${displayData.status}</td>
    `;
    dashboardTable.appendChild(dashRow);
  }

  // --- Render to Walk-In Table ---
  const walkInTable = document.getElementById("walkinTableBody");
  if (walkInTable && type === "walkin") {
    let actionButtons = "";

    let s = (displayData.statusNormalized || "").trim().toLowerCase();
    if (["in-progress", "in_progress"].includes(s)) s = "in progress";

    if (s === "pending") {
      actionButtons = `
        <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
        <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
        <button class="btn no-show" data-id="${docId}" data-type="${type}">No Show</button>`;
    } else if (s === "in progress") {
      actionButtons = `
        <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
        <button class="btn view-pet-details" data-id="${docId}" data-type="${type}">View Pet Details</button>
        <button class="btn add-discount" data-id="${docId}" data-type="${type}" data-service="${displayData.walkinService}">
          Apply Discount
        </button>`;
    } else if (s === "completed") {
      actionButtons = `
        <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
        <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>
        <button class="btn view-pet-details" data-id="${docId}" data-type="${type}">View Pet Details</button>`;
    }

    const walkRow = document.createElement("tr");
    walkRow.innerHTML = `
      <td>${displayData.date}</td>
      <td>${displayData.time}</td>
      <td>${displayData.name}</td>
      <td>${displayData.petName}</td>
      <td>${displayData.walkinService}</td>
      <td class="status ${s}">${displayData.status}</td>
      <td>${actionButtons}</td>`;
    walkInTable.appendChild(walkRow);
  }

  // --- Render to Appointment Table ---
  const appointmentTable = document.getElementById("appointmentTable");
  if (appointmentTable && type !== "walkin") {
    let actionButtons = "";
    const s = displayData.statusNormalized;
    
    if (s === "pending") {
      actionButtons = `
        <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
        <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
        <button class="btn no-show" data-id="${docId}" data-type="${type}">No Show</button>
        <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
        <button class="btn screenshot" data-id="${docId}" data-type="Appointment">View Screenshot</button>`;
    } else if (s === "confirmed") {
      actionButtons = `
        <button class="btn start" data-id="${docId}" data-type="${type}">Start</button>
        <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
        <button class="btn view-pet-details" data-appointment-id="${docId}" data-type="${type}">View Pet Details</button>
      `;
    } else if (s === "in progress") {
      actionButtons = `
        <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
        <button class="btn view-pet-details" data-id="${docId}" data-type="${type}">View Pet Details</button>
        <button class="btn add-discount" data-id="${docId}" data-type="${type}" data-service="${displayData.service}">
          Apply Discount
        </button>`;
    } else if (s === "completed") {
      actionButtons = `
        <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
        <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>`;
    } else if (s === "for-rescheduling") {
      actionButtons = `
        <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
        <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>`;
    } else if (s === "cancelled") {
      actionButtons = `<button class="btn viewreason" data-id="${docId}" data-type="${type}">View Reason</button>`;
    } else if (s === "no show") {
      actionButtons = `
        <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
        <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>`;
    }

    const fullRow = document.createElement("tr");
    fullRow.innerHTML = `
      <td>${displayData.date}</td>
      <td>${displayData.time}</td>
      <td>${displayData.name}</td>
      <td>${displayData.petName}</td>
      <td>${displayData.service}</td>
      <td class="status ${displayData.statusNormalized}">${displayData.status}</td>
      <td>${displayData.reservationType}</td>
      <td>${actionButtons}</td>`;
    appointmentTable.appendChild(fullRow);
  }

  // --- Render to History Table ---
  const historyTable = document.getElementById("historytable");
  if (historyTable && (displayData.status || "").toLowerCase() === "completed") {
    const totalAmount = data.totalAmount || 0;
    const serviceDisplay = [displayData.service, data.serviceType].filter(Boolean).join(" - ");

    const historyRow = document.createElement("tr");
    historyRow.innerHTML = `
      <td>${displayData.date}</td>
      <td>${displayData.time}</td>
      <td>${displayData.name}</td>
      <td>${displayData.petName}</td>
      <td>${serviceDisplay}</td>
      <td>${totalAmount}</td>
      <td class="status ${displayData.statusNormalized}">${displayData.status}</td>`;
    historyTable.appendChild(historyRow);
  }
}

// 📅 Load appointments into two tables (STAFF VERSION)
async function loadAllAppointments() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");
  const historyTable = document.getElementById("historytable");
  const walkInTable = document.getElementById("walkinTableBody");

  if (dashboardTable) dashboardTable.innerHTML = "";
  if (appointmentTable) appointmentTable.innerHTML = "";
  if (historyTable) historyTable.innerHTML = "";
  if (walkInTable) walkInTable.innerHTML = "";

  // ✅ Counts
  let todayScheduleCount = 0;
  let finishedAppointmentsCount = 0;
  let walkInCount = 0;

  let totalAppointmentsToday = 0;
  let pendingAppointmentsToday = 0;
  let cancelledAppointmentsToday = 0;
  let todaysEarnings = 0;

  const today = new Date().toISOString().split("T")[0];

  try {
    const [snapshot, walkInSnapshot] = await Promise.all([
      getDocs(collection(db, "Appointment")),
      getDocs(collection(db, "WalkInAppointment")),
    ]);

    if (snapshot.empty && walkInSnapshot.empty) {
      const emptyRow = "<tr><td colspan='8'>No appointments found.</td></tr>";
      if (dashboardTable) dashboardTable.innerHTML = emptyRow;
      if (appointmentTable) appointmentTable.innerHTML = emptyRow;
      await logActivity("staff", "Load Appointments", "No appointments found.");
      return;
    }

    // Collect appointments
    const allAppointments = [];
    snapshot.forEach((doc) => allAppointments.push({ ...doc.data(), id: doc.id, type: "appointment" }));
    walkInSnapshot.forEach((doc) => allAppointments.push({ ...doc.data(), id: doc.id, type: "walkin" }));

    // ✅ Sort by status first, then latest created first
    allAppointments.sort((a, b) => {
      const statusOrder = { 
        pending: 1,
        "in progress": 2,
        cancelled: 98,
        completed: 99,
        "no show": 97
      };

      const aStatus = statusOrder[a.status?.toLowerCase()] || 50;
      const bStatus = statusOrder[b.status?.toLowerCase()] || 50;

      if (aStatus !== bStatus) return aStatus - bStatus;

      const aCreated = getCreatedAtFromId(a.id);
      const bCreated = getCreatedAtFromId(b.id);

      if (aCreated && bCreated) {
        return bCreated - aCreated;
      }

      return 0;
    });

    // ✅ Render into the correct table
    allAppointments.forEach((apt) => {
      renderRow(apt, apt.type, apt.id);
    });

    // ✅ Update dashboard stats
    document.querySelector(".card:nth-child(1) .numbers").textContent = totalAppointmentsToday;
    document.querySelector(".card:nth-child(2) .numbers").textContent = finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent = walkInCount;

    const earningsCard = [...document.querySelectorAll(".card")].find((card) =>
      card.querySelector(".cardName")?.textContent.includes("Today's Earnings")
    );
    if (earningsCard) {
      earningsCard.querySelector(".numbers").textContent = "₱" + todaysEarnings.toLocaleString("en-PH");
    }

    await logActivity("staff", "Load Appointments", `${snapshot.size + walkInSnapshot.size} appointments loaded.`);
    if (typeof loadRecentActivity === "function") await loadRecentActivity();
  } catch (err) {
    console.error("Error loading appointments:", err);
    const errorRow = "<tr><td colspan='8'>Error loading appointments.</td></tr>";
    if (dashboardTable) dashboardTable.innerHTML = errorRow;
    if (appointmentTable) appointmentTable.innerHTML = errorRow;
    await logActivity("staff", "Load Appointments Error", err.message);
    if (typeof loadRecentActivity === "function") await loadRecentActivity();
  }
}

// ✅ Helper: extract createdAt from custom ID
function getCreatedAtFromId(id) {
  const parts = id.split("_");
  if (parts.length < 2) return null;

  const raw = parts.slice(1).join("_"); 
  const iso = raw.replace(/T(\d+)-(\d+)-(\d+)-(\d+)Z$/, "T$1:$2:$3.$4Z");
  return new Date(iso);
}

// 🔎 Filter table rows by status
document.getElementById("statusFilter").addEventListener("change", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#appointmentTable tr");

  rows.forEach((row) => {
    const statusCell = row.querySelector("td.status");
    if (!statusCell) return;

    const rowStatus = statusCell.textContent.trim().toLowerCase();

    if (filterValue === "all" || rowStatus === filterValue) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// 🔎 Filter table rows by service (History Table)
document.getElementById("serviceFilter").addEventListener("change", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#historytable tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 5) return;

    const rowService = cells[4].textContent.trim().toLowerCase();
    const baseService = rowService.split(" - ")[0].trim();

    if (filterValue === "all" || baseService === filterValue) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// 🔎 Filter Walk-in table rows by status
document.getElementById("walkinStatusFilter").addEventListener("change", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#walkinTableBody tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return;

    const rowStatus = cells[5].textContent.trim().toLowerCase();

    if (filterValue === "all" || rowStatus === filterValue) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// Main button event listener for appointment actions
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn.accept, .btn.start, .btn.decline, .btn.complete, .btn.add-discount, .btn.reschedule, .btn.no-show");
  if (!btn) return;

  const docId = btn.getAttribute("data-id");
  const type = btn.getAttribute("data-type");
  const collectionName = type === "walkin" ? "WalkInAppointment" : "Appointment";
  const docRef = doc(db, collectionName, docId);

  // Handle Reschedule separately
  if (btn.classList.contains("reschedule")) {
    // Reschedule logic here
    return;
  }

  // Handle Add Discount
  if (btn.classList.contains("add-discount")) {
    // Discount logic here
    return;
  }

  // Fetch data for Accept / Start / Decline / Complete / No Show
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();

  let updateData = {};

  // ✅ ADDED: No Show button functionality
  if (btn.classList.contains("no-show")) {
    const result = await Swal.fire({
      title: 'Mark as No Show?',
      text: 'This will mark the appointment as "No Show". Do you want to continue?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f8732b',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, mark as No Show',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      updateData = { 
        status: "No Show",
        noShowAt: serverTimestamp()
      };
      await updateDoc(docRef, updateData);
      Swal.fire("Marked as No Show!", "The appointment has been marked as No Show.", "success");
    }
  } else if (btn.classList.contains("start")) {
    updateData = { 
      status: "In Progress",
      startedAt: serverTimestamp()
    };
    await updateDoc(docRef, updateData);
    Swal.fire("Started!", "Appointment is now in progress.", "success");
  } else if (btn.classList.contains("accept")) {
    if (data.status.toLowerCase() === "for-rescheduling") {
      updateData = {
        date: data.proposedDate || data.date,
        status: "Pending",
        proposedDate: deleteField()
      };
    } else {
      updateData = { status: "Confirmed" };
    }
  } else if (btn.classList.contains("decline")) {
    if (data.status.toLowerCase() === "for-rescheduling") {
      updateData = {
        status: "Pending",
        proposedDate: deleteField()
      };
    } else {
      updateData = { status: "Cancelled" };
    }
  } else if (btn.classList.contains("complete")) {
    updateData = { status: "Completed", completedAt: serverTimestamp() };
  }

  if (Object.keys(updateData).length > 0) {
    await updateDoc(docRef, updateData);
    loadAllAppointments();
  }
});

// Load recent activity
async function loadRecentActivity() {
  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  try {
    const q = query(
      collection(db, "ActivityLog"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      const data = doc.data();
      let iconClass = "";
      let title = data.action || "Activity";

      switch (data.action) {
        case "Registered":
          iconClass = "fa-user-plus";
          break;
        case "Appointment Completed":
          iconClass = "fa-calendar-check";
          break;
        case "Payment Received":
          iconClass = "fa-money-bill";
          break;
        default:
          iconClass = "fa-info-circle";
      }

      const timeAgo = data.timestamp?.toDate
        ? timeSince(data.timestamp.toDate())
        : "just now";

      const activityItem = document.createElement("div");
      activityItem.className = "activity-item";
      activityItem.innerHTML = `
        <div class="activity-icon">
          <i class="fa-solid ${iconClass}"></i>
        </div>
        <div class="activity-content">
          <h4>${title}</h4>
          <p>${data.details || ""} - ${timeAgo}</p>
        </div>
      `;

      activityList.appendChild(activityItem);
    });
  } catch (error) {
    console.error("Failed to load activity logs:", error);
  }
}

// ⏱️ Utility: time ago format
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 }
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count > 0) return `${count} ${i.label}${count !== 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// 🚀 Initialize on page load
loadRecentActivity();
loadAllAppointments();

// Make logout available to inline onclick=""
window.logout = function () {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f8732b',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();

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
        background: "#ffffff",
        color: "#1e1e1e",
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-xl shadow-lg'
        },
      });

      setTimeout(() => {
        Swal.fire({
          title: "Logged out successfully!",
          html: `<div style="font-size: 20px; color: rgba(0, 0, 0, 0.3);">You will be redirected shortly.</div>`,
          icon: "success",
          background: "#ffffff",
          color: "#1e1e1e",
          iconColor: '#f8732b',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'rounded-xl shadow-lg'
          },
          didClose: () => {
            window.location.href = '/index.html';
          }
        });
      }, 1200);
    }
  });
};
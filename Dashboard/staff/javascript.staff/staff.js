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

// ==============================
// 🔹 PAGINATION CONFIGURATION
// ==============================
const ROWS_PER_PAGE = 10;
const tableConfigs = {
    dashboard: { 
        tableId: "table-dashboard", 
        page: 1, 
        containerId: "pagination-dashboard",
        data: []
    },
    appointment: { 
        tableId: "appointmentTable", 
        page: 1, 
        containerId: "pagination-appointment",
        data: []
    },
    history: { 
        tableId: "historytable", 
        page: 1, 
        containerId: "pagination-history",
        data: []
    },
    walkin: { 
        tableId: "walkinTableBody", 
        page: 1, 
        containerId: "pagination-walkin",
        data: []
    }
};

// ==============================
// 🔹 PAGINATION FUNCTIONS
// ==============================
function paginateData(data, page, rowsPerPage = ROWS_PER_PAGE) {
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
}

function renderPaginationControls(config, totalRows, onPageChange) {
    const totalPages = Math.ceil(totalRows / ROWS_PER_PAGE);
    const container = document.getElementById(config.containerId);
    if (!container) return;

    container.innerHTML = `
        <div class="pagination-controls">
            <button class="pagination-btn" id="prev-${config.tableId}" ${config.page === 1 ? "disabled" : ""}>
                ◀ Previous
            </button>
            <span class="pagination-info">Page ${config.page} of ${totalPages || 1}</span>
            <button class="pagination-btn" id="next-${config.tableId}" ${config.page === totalPages || totalPages === 0 ? "disabled" : ""}>
                Next ▶
            </button>
        </div>
    `;

    document.getElementById(`prev-${config.tableId}`)?.addEventListener("click", () => {
        if (config.page > 1) {
            config.page--;
            onPageChange();
        }
    });

    document.getElementById(`next-${config.tableId}`)?.addEventListener("click", () => {
        if (config.page < totalPages) {
            config.page++;
            onPageChange();
        }
    });
}

function renderTableWithPagination(type, data) {
    const config = tableConfigs[type];
    const table = document.getElementById(config.tableId);
    if (!table) return;

    // Store the full dataset
    config.data = data;

    // Clear table
    table.innerHTML = "";

    // Paginate data
    const pageData = paginateData(data, config.page);

    // Render rows
    pageData.forEach((apt) => {
        renderRow(apt, apt.type, apt.id);
    });

    // Render pagination controls
    renderPaginationControls(config, data.length, () => {
        renderTableWithPagination(type, config.data);
    });
}

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

  // Add pagination CSS
  const paginationCSS = `
    <style>
      .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;
        margin-top: 20px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
      }
      .pagination-btn {
        padding: 8px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }
      .pagination-btn:hover:not(:disabled) {
        background: #0056b3;
      }
      .pagination-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
      }
      .pagination-info {
        font-size: 14px;
        color: #495057;
        font-weight: 500;
      }
    </style>
  `;
  document.head.insertAdjacentHTML('beforeend', paginationCSS);
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

// WALK IN FORM - ALL LOGIC PRESERVED
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

// Service pricing table - ALL LOGIC PRESERVED
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

// Update variants dynamically - ALL LOGIC PRESERVED
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

// VACCINATION LABELING - ALL LOGIC PRESERVED
const vaccinationForm = document.getElementById("vaccinationLabelForm");
const vaccinationRecordsBody = document.getElementById("vaccinationRecordsBody");
const remindersBody = document.getElementById("RemindersBody");

// Map of owner -> pets
let ownerPetMap = {};

// Fetch owners and pets
async function populateOwnerPetMap() {
  ownerPetMap = {};

  const [appointmentsSnap, walkinsSnap] = await Promise.all([
    getDocs(collection(db, "Appointment")),
    getDocs(collection(db, "WalkInAppointment")),
  ]);

  function processDoc(data) {
    const ownerNameRaw =
      data.ownerName ||
      data.name ||
      ((data.firstName || "") + " " + (data.lastName || "")).trim();

    const petNameRaw = data.petName || data.pet?.petName;

    if (!ownerNameRaw || !petNameRaw) return;

    const ownerName = ownerNameRaw.trim();
    const petName = petNameRaw.trim();

    if (!ownerPetMap[ownerName]) ownerPetMap[ownerName] = new Set();
    ownerPetMap[ownerName].add(petName);
  }

  appointmentsSnap.forEach(doc => processDoc(doc.data()));
  walkinsSnap.forEach(doc => processDoc(doc.data()));

  // ✅ Populate owner dropdown
  updateOwnerDropdown();
}

// Replace owner input with dropdown
function updateOwnerDropdown() {
  const ownerInput = vaccinationForm.querySelector('input[name="ownerName"], select[name="ownerName"]');
  if (!ownerInput) return;

  const select = document.createElement("select");
  select.name = "ownerName";
  select.required = true;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select Owner --";
  select.appendChild(placeholder);

  Object.keys(ownerPetMap).forEach(owner => {
    const option = document.createElement("option");
    option.value = owner;
    option.textContent = owner;
    select.appendChild(option);
  });

  ownerInput.replaceWith(select);

  // ✅ Call updatePetDropdown on change
  select.addEventListener("change", () => {
    updatePetDropdown(select.value);
  });
}

function updatePetDropdown(owner) {
  const petInput = vaccinationForm.querySelector('input[name="petName"], select[name="petName"]');
  if (!petInput) return;

  const select = document.createElement("select");
  select.name = "petName";
  select.required = true;

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "-- Select Pet --";
  select.appendChild(placeholder);

  if (ownerPetMap[owner]) {
    ownerPetMap[owner].forEach(pet => {
      const option = document.createElement("option");
      option.value = pet;
      option.textContent = pet;
      select.appendChild(option);
    });
  }

  petInput.replaceWith(select);
}

// ✅ Call populate on page load
document.addEventListener("DOMContentLoaded", async () => {
  await populateOwnerPetMap();
});

// Fetch existing records on page load
document.addEventListener("DOMContentLoaded", async () => {
  const vaccSnapshot = await getDocs(collection(db, "VaccinationLabel"));

  vaccSnapshot.forEach(doc => {
    const data = doc.data();

    // 🔹 Attach Firestore document ID so reminder buttons work
    data._id = doc.id;

    // 🔹 Only set a default if missing
    if (!data.sourceType) {
      data.sourceType = "appointment";
    }

    appendToTables(data);
  });

  updateVaccinationStats();
});

// Vaccination form submission - ALL LOGIC PRESERVED
vaccinationForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(vaccinationForm);

  const vaccinationDateStr = formData.get("vaccinationDate");
  const nextDueDateStr = formData.get("nextDueDate");

  const ownerName = (formData.get("ownerName") || "").trim();
  const petName = (formData.get("petName") || "").trim();

  const record = {
    ownerName,
    petName,
    vaccineType: formData.get("vaccineType"),
    batchNumber: formData.get("batchNumber"),
    vaccinationDate: formatDateOnly(parseDateOnly(vaccinationDateStr)),
    nextDueDate: formatDateOnly(parseDateOnly(nextDueDateStr)),
    veterinarian: formData.get("veterinarian"),
    labelQuantity: parseInt(formData.get("labelQuantity"), 10) || 1,
    createdAt: serverTimestamp(),
    service: formData.get("vaccineType") || "Vaccination"
  };

  try {
    console.log("💾 Saving vaccination record:", record);

    await addDoc(collection(db, "VaccinationLabel"), record);
    appendToTables(record);
    vaccinationForm.reset();
    updateVaccinationStats();
  } catch (error) {
    console.error("Error adding document:", error);
  }
});

// ===== Append to tables =====
function appendToTables(data) {
  // ===== Reminders table =====
  const daysDelta = daysFromToday(data.nextDueDate);
  const isOverdue = daysDelta < 0;

  const labelText =
    daysDelta === 0
      ? "Due today"
      : isOverdue
        ? `${Math.abs(daysDelta)} ${Math.abs(daysDelta) === 1 ? "day" : "days"} overdue`
        : `Due in ${daysDelta} ${daysDelta === 1 ? "day" : "days"}`;

  const labelColor = isOverdue ? "red" : "orange";

  const reminderRow = document.createElement("tr");
  reminderRow.innerHTML = `
    <td>${data.ownerName}</td>
    <td>${data.petName}</td>
    <td>${formatVaccineName(data.vaccineType)} Booster</td>
    <td>${data.nextDueDate}</td>
    <td style="color: ${labelColor}; font-weight: bold;">${labelText}</td>
    <td>
      <button class="btn-primary send-reminder">Send Reminder</button>
    </td>
  `;

  remindersBody.appendChild(reminderRow);

  // ===== Vaccination records table =====
  const recordRow = document.createElement("tr");
  recordRow.innerHTML = `
    <td>${data.ownerName}</td>
    <td>${data.petName}</td>
    <td>${formatVaccineName(data.vaccineType)}</td>
    <td>${data.batchNumber || "-"}</td>
    <td>${data.vaccinationDate || "-"}</td>
    <td>${data.nextDueDate || "-"}</td>
    <td>${formatVetName(data.veterinarian)}</td>
  `;
  vaccinationRecordsBody.appendChild(recordRow);
}

async function updateVaccinationStats() {
  const today = new Date();
  const todayStr = formatDateOnly(today);

  const monthStart = parseDateOnly(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const snapshot = await getDocs(collection(db, "VaccinationLabel"));

  let countToday = 0;
  let countMonth = 0;
  let countWeekDue = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.vaccinationDate) return;

    const vaccDate = parseDateOnly(data.vaccinationDate);
    const nextDue = parseDateOnly(data.nextDueDate);

    // Today
    if (data.vaccinationDate === todayStr) countToday++;

    // This month
    if (vaccDate >= monthStart && vaccDate <= monthEnd) countMonth++;

    // Due this week
    if (nextDue && nextDue >= weekStart && nextDue <= weekEnd) countWeekDue++;
  });

  // Update stats elements if they exist
  const vaccinationsTodayEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(1) .stat-number");
  const vaccinationsMonthEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(2) .stat-number");
  const vaccinationsDueWeekEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(3) .stat-number");

  if (vaccinationsTodayEl) vaccinationsTodayEl.textContent = countToday;
  if (vaccinationsMonthEl) vaccinationsMonthEl.textContent = countMonth;
  if (vaccinationsDueWeekEl) vaccinationsDueWeekEl.textContent = countWeekDue;
}

// Helper functions for vaccination
function formatDateOnly(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatVaccineName(type) {
  const names = {
    rabies: "Rabies",
    "5in1": "5-in-1 (DHPPL)",
    "6in1": "6-in-1 (DHPPLC)",
    bordetella: "Bordetella",
    "feline-3in1": "Feline 3-in-1",
    "feline-4in1": "Feline 4-in-1"
  };
  return names[type] || type;
}

function formatVetName(id) {
  const vets = {
    "dr-rodriguez": "Dr. Rodriguez",
    "dr-martinez": "Dr. Martinez",
    "dr-santos": "Dr. Santos"
  };
  return vets[id] || id;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseDateOnly(input) {
  if (!input) return null;

  // Firestore Timestamp
  if (typeof input?.toDate === "function") {
    const d = input.toDate();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // "YYYY-MM-DD"
  if (typeof input === "string") {
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(input.trim());
    if (!m) return null;
    const y = Number(m[1]), mo = Number(m[2]), da = Number(m[3]);
    return new Date(y, mo - 1, da);
  }

  // JS Date
  if (input instanceof Date && !isNaN(input)) {
    return new Date(input.getFullYear(), input.getMonth(), input.getDate());
  }

  return null;
}

function daysFromToday(dueLike) {
  const due = parseDateOnly(dueLike);
  if (!due) return 0;

  const today = new Date();

  const dueUTC = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.trunc((dueUTC - todayUTC) / MS_PER_DAY);
}

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

// 📅 Load appointments into two tables (STAFF VERSION) - UPDATED WITH PAGINATION
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
    "no show": 3,
    cancelled: 98,
    completed: 99
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
    // ✅ Separate data for different tables
    const dashboardData = allAppointments.filter(apt => apt.type === "appointment");
    const appointmentData = allAppointments.filter(apt => apt.type === "appointment");
    const historyData = allAppointments.filter(apt => (apt.status || "").toLowerCase() === "completed");
    const walkinData = allAppointments.filter(apt => apt.type === "walkin");

    // ✅ Render tables with pagination
    renderTableWithPagination("dashboard", dashboardData);
    renderTableWithPagination("appointment", appointmentData);
    renderTableWithPagination("history", historyData);
    renderTableWithPagination("walkin", walkinData);

    // ✅ Update dashboard stats (existing logic)
    allAppointments.forEach((apt) => {
      const status = apt.status || "Pending";
      
      // Count finished appointments
      if (status.toLowerCase().trim() === "completed") {
        finishedAppointmentsCount++;
        
        // Earnings calculation
        let amount = apt.totalAmount || apt.serviceFee || 0;
        if (typeof amount === "string") {
          amount = amount.replace(/[^\d.-]/g, "");
        }
        const numAmount = Number(amount) || 0;
        todaysEarnings += numAmount;
      }

      // Count walk-ins
      if (apt.type === "walkin") {
        walkInCount++;
      }

      // Count pending and cancelled
      if (status.toLowerCase() === "pending") {
        pendingAppointmentsToday++;
      }
      if (status.toLowerCase() === "cancelled") {
        cancelledAppointmentsToday++;
      }
    });

    totalAppointmentsToday = allAppointments.length;

    // ✅ Update dashboard card numbers
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
document.getElementById("statusFilter")?.addEventListener("change", function () {
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
document.getElementById("serviceFilter")?.addEventListener("change", function () {
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
document.getElementById("walkinStatusFilter")?.addEventListener("change", function () {
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

// Load recent activity
async function loadRecentActivity() {
  const activityList = document.getElementById("activity-list");
  if (!activityList) return;
  
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
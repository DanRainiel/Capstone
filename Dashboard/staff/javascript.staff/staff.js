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
        Timestamp,  // ✅ needed for filtering pets by userId
      updateDoc,  
      setDoc,  
      onSnapshot,
      getDoc,
      deleteDoc,  // ✅ needed for changing user status
      doc      
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
    
     // 🔍 Log admin activity
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
  // Prevent back navigation for admin
  if (sessionStorage.getItem("role") === "admin") {
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
          // Check if this is a service pricing edit button
          const isServicePricingTable = e.target.closest('#servicePricingTable') || 
                                      e.target.closest('[id*="fee-discount"]') ||
                                      e.target.closest('#fee-discount');
          
          if (isServicePricingTable && window.openServiceEditModal) {
            // Use the modal for service pricing edits
            const handled = window.openServiceEditModal(e.target);
            if (handled) {
              break; // Exit switch, modal handled the edit
            }
          }
          
          // Default behavior for other edit buttons
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
      // Implement search logic here for filtering tables
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
let appointmentsData = {}; // will be populated from Firestore

async function fetchAppointments() {
    appointmentsData = {}; // reset

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
    totalAmount: parsePeso(appt.totalAmount),       // the actual full price
    amountPaid: parsePeso(appt.reservationFee)      // only the reservation fee paid
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
    fetchAppointments(); // load Firestore appointments first
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
    today.setHours(0, 0, 0, 0); // normalize

    for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);

        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = currentDay.getDate();

        const dateKey = formatDateLocal(currentDay);

        if (currentDay.getMonth() !== month) {
            cell.classList.add('other-month');
        } else if (currentDay < today) {
            cell.classList.add('past-date'); // grey out
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
        variant: selectedVariant,     // ✅ Save chosen variant
        totalAmount: totalAmount,     // ✅ Save calculated fee
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
        await loadAllUsers();
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
  serviceVariantsDiv.innerHTML = ""; // clear old
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
      // 🔹 1. Get reference to the appointment document
      const colName = type === "walkin" ? "WalkInAppointment" : "Appointment";
      const docRef = doc(db, colName, docId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Swal.fire("Error", "Appointment not found.", "error");
        return;
      }

      const appointmentData = docSnap.data();

      // 🔹 2. Update appointment status to "Declined"
      await updateDoc(docRef, { status: "Declined" });

      // 🔹 3. Store notification in Notifications collection
      // Make sure you have userId (or email) stored in appointment data
      await addDoc(collection(db, "Notifications"), {
        userId: appointmentData.userId || "", // depends on how you store customer reference
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
              loadAllAppointments(); // 🔄 refresh the tables
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
          const docRef = doc(db, "Appointment", docId); // make sure "Appointment" matches your collection name
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
    
        console.log("Fetching screenshot for:", { docId, type }); // ✅ Debug log
    
        try {
          const docRef = doc(db, type, docId);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            const data = docSnap.data();
    
            // Get reservation details
            const reservationType = data.reservationType || "-";
            const totalAmount = data.totalAmount || "-"; // ✅ don't parseFloat, use directly
    
            // Build HTML content
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
    
        // ✅ Generate time slots dynamically (9:00 AM to 5:30 PM, 30min intervals)
        function generateTimeSlots(startHour, endHour) {
          const slots = [];
          const start = new Date();
          start.setHours(startHour, 0, 0, 0);
    
          const end = new Date();
          end.setHours(endHour, 30, 0, 0); // until 5:30 PM
    
          while (start < end) {
            const endSlot = new Date(start.getTime() + 30 * 60000); // add 30 minutes
    
            const formatTime = (date) =>
              date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    
            slots.push(`${formatTime(start)} - ${formatTime(endSlot)}`);
            start.setMinutes(start.getMinutes() + 30);
          }
    
          return slots;
        }
    
        const timeSlots = generateTimeSlots(9, 17); // 9:00 AM to 5:30 PM
    
        const slotOptions = timeSlots
          .map((slot) => `<option value="${slot}">${slot}</option>`)
          .join("");
    
        // ✅ SweetAlert with dynamic dropdown
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
    
            // ✅ Extract starting time only (e.g., "9:00 AM")
            const time = slot.split(" - ")[0];
            return { date, time };
          }
        });
    
        if (!formValues) return; // Cancelled
    
        try {
          // ✅ Update appointment in Firestore
          await updateDoc(docRef, {
            date: formValues.date,
            time: formValues.time, // Only the starting time
            status: "pending",     // 👈 Bring back to pending
            updatedAt: serverTimestamp()
          });
    
          // ✅ Create reminder notification
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
    
 
// 📅 Load appointments into two tables
async function loadAllAppointments() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");
  const historyTable = document.getElementById("historytable");
  const walkInTable = document.getElementById("walkinTableBody");

  if (dashboardTable) dashboardTable.innerHTML = "";
  if (appointmentTable) appointmentTable.innerHTML = "";
  if (historyTable) historyTable.innerHTML = "";
  if (walkInTable) walkInTable.innerHTML = "";

  // ✅ Counters
  let totalAppointmentsToday = 0;
  let finishedAppointmentsCount = 0;
  let walkInCount = 0;

  let pendingToday = 0;
  let pendingAll = 0;

  let cancelledToday = 0;
  let cancelledAll = 0;

  let todaysEarnings = 0;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // --- Helpers ---
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

  function parsePrice(price) {
    if (!price) return 0;
    if (typeof price === "number") return price;
    return Number(price.toString().replace(/[^\d.-]/g, "")) || 0;
  }

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

    // ✅ Inline renderRow so it's always defined
    function renderRow(data, type, docId) {
      const safe = (v) => (v === undefined || v === null ? "" : v);

      // Normalize status
      const statusRaw = safe(data.status) || "Pending";
      const statusNormalized = String(statusRaw).trim().toLowerCase();

      // Normalize date
      const rawDateSource = type === "walkin" && data.timestamp ? data.timestamp : data.date;
      const dateISO = normalizeToISODate(rawDateSource);
      const dateDisplay = formatDisplayDate(rawDateSource) || dateISO || "";

      const displayData = {
        name: type === "walkin" ? `${safe(data.firstName)} ${safe(data.lastName)}`.trim() : safe(data.name),
        petName: safe(data.petName) || safe(data.pet?.petName),
        service: safe(data.service),
        walkinService: safe(data.serviceType),
        dateISO,
        date: dateDisplay,
        time: type === "walkin" && data.timestamp
          ? new Date(data.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : safe(data.time),
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

      // --- Counters ---
      if (displayData.dateISO === today) totalAppointmentsToday++;

      if (statusNormalized === "completed") {
        finishedAppointmentsCount++;
        if (displayData.dateISO === today) todaysEarnings += parsePrice(data.totalAmount);
      }

      if (type === "walkin") walkInCount++;

      if (statusNormalized === "pending") {
        pendingAll++;
        if (displayData.dateISO === today) pendingToday++;
      }

      if (statusNormalized === "cancelled") {
        cancelledAll++;
        if (displayData.dateISO === today) cancelledToday++;
      }

      // --- Render DOM rows ---
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

      if (walkInTable && type === "walkin") {
        let actionButtons = "";
        const s = displayData.statusNormalized;
        if (s === "pending") {
          actionButtons = `
            <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
            <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>`;
        } else if (s === "in progress") {
          actionButtons = `
            <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
            <button class="btn add-discount" data-id="${docId}" data-type="${type}" data-service="${displayData.walkinService}">
              Apply Discount
            </button>`;
        } else if (s === "completed") {
          actionButtons = `
            <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
            <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>`;
        }

        const walkRow = document.createElement("tr");
        walkRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.walkinService}</td>
          <td class="status ${displayData.statusNormalized}">${displayData.status}</td>
          <td>${actionButtons}</td>`;
        walkInTable.appendChild(walkRow);
      }

      if (appointmentTable && type !== "walkin") {
        let actionButtons = "";
        const s = displayData.statusNormalized;
        if (s === "pending") {
          actionButtons = `
            <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
            <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
            <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
            <button class="btn screenshot" data-id="${docId}" data-type="Appointment">View Screenshot</button>`;
        } else if (s === "in progress") {
          actionButtons = `
            <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
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
    <td class="status ${displayData.statusNormalized}">${displayData.status}</td>
  `;
  historyTable.appendChild(historyRow);
}

    }

   // Collect appointments
const allAppointments = [];
snapshot.forEach((doc) => allAppointments.push({ ...doc.data(), id: doc.id, type: "appointment" }));
walkInSnapshot.forEach((doc) => allAppointments.push({ ...doc.data(), id: doc.id, type: "walkin" }));

 // ✅ Helper function (put this above your sort)
function normalizeDate(dateStr) {
  if (!dateStr) return null;

  // If already ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }

  // If DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  // If MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const [month, day, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  }

  return new Date(dateStr); // fallback
}


// ✅ Helper: extract createdAt from custom ID
function getCreatedAtFromId(id) {
  // Example: owner1_2025-10-01T01-38-35-518Z
  const parts = id.split("_");
  if (parts.length < 2) return null;

  const raw = parts.slice(1).join("_"); 
  // convert 2025-10-01T01-38-35-518Z → 2025-10-01T01:38:35.518Z
  const iso = raw.replace(/T(\d+)-(\d+)-(\d+)-(\d+)Z$/, "T$1:$2:$3.$4Z");
  return new Date(iso);
}

// ✅ Sort by status first, then latest created first
allAppointments.sort((a, b) => {
  const statusOrder = { 
    pending: 1,
    "in progress": 2,
    cancelled: 98,
    completed: 99
  };

  const aStatus = statusOrder[a.status?.toLowerCase()] || 50;
  const bStatus = statusOrder[b.status?.toLowerCase()] || 50;

  // 1. Sort by status order
  if (aStatus !== bStatus) return aStatus - bStatus;

  // 2. Sort by createdAt (descending)
  const aCreated = getCreatedAtFromId(a.id);
  const bCreated = getCreatedAtFromId(b.id);

  if (aCreated && bCreated) {
    return bCreated - aCreated; // newest first
  }

  return 0;
});

// ✅ Render into the correct table
allAppointments.forEach((apt) => {
  const rowHTML = renderRow(apt, apt.type, apt.id);
});

 


    // ✅ Update dashboard stats
    document.querySelector(".card:nth-child(1) .numbers").textContent = totalAppointmentsToday;
    document.querySelector(".card:nth-child(2) .numbers").textContent = finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent = walkInCount;

    const stat1 = document.querySelector("#appointments .stat-card:nth-child(1) .stat-number");
    const stat2 = document.querySelector("#appointments .stat-card:nth-child(2) .stat-number");
    const stat3 = document.querySelector("#appointments .stat-card:nth-child(3) .stat-number");
    if (stat1) stat1.textContent = totalAppointmentsToday;
    if (stat2) stat2.textContent = pendingAll; // change to pendingToday if you prefer today-only
    if (stat3) stat3.textContent = cancelledAll;

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
  const rows = document.querySelectorAll("#historytable tr"); // ✅ history table body

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 5) return; // skip rows without enough columns

    // Service column may contain "vaccination - small dog"
    const rowService = cells[4].textContent.trim().toLowerCase();

    // Extract only the first word before " - " for exact matching
    const baseService = rowService.split(" - ")[0].trim();

    if (filterValue === "all" || baseService === filterValue) {
      row.style.display = "";   // show row
    } else {
      row.style.display = "none"; // hide row
    }
  });
});

// 🔎 Filter Walk-in table rows by status
document.getElementById("walkinStatusFilter").addEventListener("change", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#walkinTableBody tr"); // ✅ only walk-in table rows

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 6) return; // safety, Status = 6th column

    const rowStatus = cells[5].textContent.trim().toLowerCase(); // 6th column = Status

    if (filterValue === "all" || rowStatus === filterValue) {
      row.style.display = "";   // ✅ show row
    } else {
      row.style.display = "none"; // ❌ hide row
    }
  });
});






document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn.accept, .btn.decline, .btn.complete, .btn.add-discount, .btn.reschedule");
  if (!btn) return;

  const docId = btn.getAttribute("data-id");
  const type = btn.getAttribute("data-type");
  const collectionName = type === "walkin" ? "WalkInAppointment" : "Appointment";
  const docRef = doc(db, collectionName, docId);

   if (btn.classList.contains("reschedule")) {
    await rescheduleAppointment(docId); // <-- call function with id
    return;
  }
  // ✅ Open modal when Add Discount is clicked
 if (btn.classList.contains("add-discount")) {
  await openDiscountModal(docRef, type);
  return;
}


  // ✅ Handle Reschedule button separately (if needed)
  if (btn.classList.contains("reschedule")) {
    await updateDoc(docRef, { status: "for-rescheduling" });
    loadAllAppointments();
    return;
  }

  // ✅ Fetch data for Accept / Decline / Complete
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return;
  const data = docSnap.data();

  let updateData = {};

  if (btn.classList.contains("accept")) {
    if (data.status.toLowerCase() === "for-rescheduling") {
      updateData = {
        date: data.proposedDate || data.date,
        status: "Pending",
        proposedDate: deleteField()
      };
    } else {
      updateData = { status: "In Progress" };
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

  await updateDoc(docRef, updateData);
  
  loadAllAppointments();
});






// 🔹 Globals
let currentDiscountDocRef = null; // Firestore doc reference
let currentDiscountType = null;   // "Appointment" or "WalkInAppointment"



// ✅ Function to open Swal discount modal
async function openDiscountModal(docRef, type) {
  currentDiscountDocRef = docRef;
  currentDiscountType = type;

  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return Swal.fire("Error", "Appointment not found.", "error");

    const data = snap.data();
    const serviceName = data.service || data.serviceType;

    // Fetch services from Firestore
    const q = query(collection(db, "services"));
    const querySnapshot = await getDocs(q);

    let service = null;
    querySnapshot.forEach(docSnap => {
      const s = docSnap.data();
      const docId = docSnap.id;

      if (
        docId.toLowerCase() === serviceName.toLowerCase() ||
        (s.name && s.name.toLowerCase() === serviceName.toLowerCase())
      ) {
        service = { ...s, id: docId };
      }
    });

    if (!service) {
      return Swal.fire("Error", `Service '${serviceName}' not found.`, "error");
    }

    // 🔹 Built-in discounts
    const discountObj = {
      pwdDiscount: service.pwdDiscount ?? 0,
      seniorDiscount: service.seniorDiscount ?? 0,
      loyaltyDiscount: service.loyaltyDiscount ?? 0
    };

    // 🔹 Special discounts array (from Firestore)
    const specialDiscounts = service.discounts ?? [];

    // 🔹 Build discount options
    let discountHTML = "";

    // Built-in
    for (const [key, value] of Object.entries(discountObj)) {
      if (value > 0) {
        discountHTML += `
          <div style="text-align:left;margin-bottom:5px">
            <input type="checkbox" id="${key}" value="${key}" class="swal2-checkbox">
            <label for="${key}">${key.replace("Discount", "")} (${value}%)</label>
          </div>`;
      }
    }

    // Special discounts
    specialDiscounts.forEach((d, idx) => {
      if (!d || !d.name) return;
      discountHTML += `
        <div style="text-align:left;margin-bottom:5px">
          <input type="checkbox" id="special-${idx}" 
                 value="special-${idx}" 
                 class="swal2-checkbox" 
                 data-type="${d.type}" 
                 data-value="${d.value}">
          <label for="special-${idx}">${d.name} (${d.type === "percentage" ? d.value + "%" : "₱" + d.value})</label>
        </div>`;
    });

    if (!discountHTML) {
      return Swal.fire("No Discounts", "This service has no available discounts.", "info");
    }

    // 🔹 Show SweetAlert2 modal
    const { value: selectedDiscounts, dismiss } = await Swal.fire({
      title: `Apply Discount for ${serviceName}`,
      html: discountHTML,
      focusConfirm: false,
      preConfirm: () => {
        const checkboxes = Swal.getPopup().querySelectorAll(".swal2-checkbox:checked");
        return Array.from(checkboxes).map(cb => cb.value);
      },
      showCancelButton: true,
      confirmButtonText: "Apply",
      cancelButtonText: "Cancel"
    });

    if (dismiss === Swal.DismissReason.cancel) return;
    if (!selectedDiscounts || selectedDiscounts.length === 0) {
      return Swal.fire("No Selection", "Please select at least one discount.", "warning");
    }

    // 🔹 Calculate new total
    let totalAmount = parsePrice(service.basePrice ?? 0);
    let appliedDiscounts = [];

    selectedDiscounts.forEach(selected => {
      if (discountObj[selected]) {
        // Built-in discount
        const discountValue = parseFloat(discountObj[selected]) || 0;
        const discountPercent = discountValue / 100;
        totalAmount -= service.basePrice * discountPercent;
        appliedDiscounts.push(`${selected.replace("Discount", "")}: ${discountValue}%`);
      } else if (selected.startsWith("special-")) {
        // Special discount
        const idx = parseInt(selected.split("-")[1], 10);
        const d = specialDiscounts[idx];
        if (d) {
          if (d.type === "percentage") {
            totalAmount -= service.basePrice * (d.value / 100);
            appliedDiscounts.push(`${d.name}: ${d.value}%`);
          } else {
            totalAmount -= d.value;
            appliedDiscounts.push(`${d.name}: ₱${d.value}`);
          }
        }
      }
    });

    totalAmount = Math.max(0, Math.round(totalAmount * 100) / 100);

    // ✅ Save to Firestore
    await updateDoc(currentDiscountDocRef, {
      totalAmount,
      appliedDiscounts
    });

    Swal.fire(
      "Discounts Applied ✅",
      `Applied:\n${appliedDiscounts.join("\n")}\n\nNew Total: ₱${totalAmount}`,
      "success"
    );

    currentDiscountDocRef = null;
    currentDiscountType = null;

  } catch (err) {
    console.error("Discount error:", err);
    Swal.fire("Error", "Something went wrong applying the discount.", "error");
  }
}


  // ================== RESCHEDULE ==================
async function rescheduleAppointment() {
  const modal = document.getElementById("detailsModal");
  const docId = modal.getAttribute("data-docid");

  if (!docId) {
    alert("No appointment selected.");
    return;
  }

  try {
    const docRef = doc(db, "Appointment", docId);

    // ✅ Do not overwrite proposedDate here 
    // (your other JS already sets proposedDate & time request)
    await updateDoc(docRef, { status: "for-rescheduling" });

    alert("Appointment marked for rescheduling!");
    closeDetailsModal();
    loadAppointments(); // refresh table
  } catch (error) {
    console.error("Error updating appointment:", error);
    alert("Failed to update status.");
  }
}



async function loadRecentActivity() {
  const activityList = document.getElementById("activity-list");

  // ✅ Clear only the items, not the header
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



// 🔍 Filter History Table
async function filterHistory() {
  const ownerFilter = document.getElementById("searchOwner").value.toLowerCase().trim();
  const petFilter = document.getElementById("searchPet").value.toLowerCase().trim();
  const fromDate = document.getElementById("dateFrom").value;
  const toDate = document.getElementById("dateTo").value;

  const historyTable = document.getElementById("historytable");
  if (!historyTable) return;

  // only select tbody rows (ignore thead)
  const rows = historyTable.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const cells = row.getElementsByTagName("td");
    if (!cells.length) return;

    const ownerName = (cells[2]?.textContent || "").toLowerCase().trim();
    const petName = (cells[3]?.textContent || "").toLowerCase().trim();
    const dateText = cells[0]?.textContent || "";
    const rowDate = new Date(dateText);

    let matchesName = true;

    // ✅ Enforce pair matching
    if (ownerFilter && petFilter) {
      matchesName = ownerName.includes(ownerFilter) && petName.includes(petFilter);
    } else if (ownerFilter) {
      matchesName = ownerName.includes(ownerFilter);
    } else if (petFilter) {
      matchesName = petName.includes(petFilter);
    }

    // ✅ Date filtering
    let matchesDate = true;
    if (fromDate) matchesDate = matchesDate && rowDate >= new Date(fromDate);
    if (toDate) matchesDate = matchesDate && rowDate <= new Date(toDate);

    row.style.display = matchesName && matchesDate ? "" : "none";
  });
}

// 📌 Event Listeners
document.getElementById("searchOwner").addEventListener("input", filterHistory);
document.getElementById("searchPet").addEventListener("input", filterHistory);
document.getElementById("dateFrom").addEventListener("change", filterHistory);
document.getElementById("dateTo").addEventListener("change", filterHistory);
document.querySelector(".btn-primary").addEventListener("click", filterHistory);

loadAllAppointments();


//VACCINATION LABELING//
  const vaccinationForm = document.getElementById("vaccinationLabelForm");
  const vaccinationRecordsBody = document.getElementById("vaccinationRecordsBody");
  const remindersBody = document.getElementById("RemindersBody");

  // Map of owner -> pets
// Global map
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

async function findUserIdByOwnerAndPet(ownerName, petName) {
  // normalize for comparison
  const normOwner = (ownerName || "").trim().toLowerCase();
  const normPet = (petName || "").trim().toLowerCase();

  // search Appointment first
  const apptSnap = await getDocs(collection(db, "Appointment"));
  for (const docSnap of apptSnap.docs) {
    const appt = docSnap.data();

    // ✅ use ownerName OR fallback to "name"
    const apptOwner = (appt.ownerName || appt.name || "").trim().toLowerCase();
    const apptPet   = (appt.petName || "").trim().toLowerCase();

    if (apptOwner === normOwner && apptPet === normPet) {
      console.log("✅ Match found in Appointment:", {
        owner: apptOwner,
        pet: apptPet,
        userId: appt.userId || null,
        appointmentId: docSnap.id
      });

      return { 
        userId: appt.userId || null,   // may still be null if not saved in doc
        appointmentId: docSnap.id, 
        sourceType: "appointment" 
      };
    }
  }

  // if not found, search WalkInAppointment
  const walkInSnap = await getDocs(collection(db, "WalkInAppointment"));
  for (const docSnap of walkInSnap.docs) {
    const walkIn = docSnap.data();

    const walkInOwner = `${(walkIn.firstName || "").trim()} ${(walkIn.lastName || "").trim()}`.toLowerCase();
    const walkInPet   = (walkIn.pet?.petName || "").trim().toLowerCase();

    if (walkInOwner === normOwner && walkInPet === normPet) {
      console.log("✅ Match found in WalkInAppointment:", {
        owner: walkInOwner,
        pet: walkInPet,
        userId: walkIn.userId || null,
        appointmentId: docSnap.id
      });

      return { 
        userId: walkIn.userId || null, 
        appointmentId: docSnap.id, 
        sourceType: "walkin", 
        contactNumber: walkIn.contact || walkIn.contactNumber || "" 
      };
    }
  }

  console.warn("⚠️ No match found for owner/pet:", ownerName, petName);
  return { userId: null, appointmentId: null };
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

// Your updatePetDropdown stays the same
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

  // Stats elements
  const vaccinationsTodayEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(1) .stat-number");
  const vaccinationsMonthEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(2) .stat-number");
  const vaccinationsDueWeekEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(3) .stat-number");

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

vaccinationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(vaccinationForm);

  const vaccinationDateStr = formData.get("vaccinationDate");
  const nextDueDateStr = formData.get("nextDueDate");

  // ✅ Normalize form inputs FIRST
  const formOwner = (formData.get("ownerName") || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const formPet = (formData.get("petName") || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // Default values
  let sourceType = "appointment";
  let contactNumber = "";
  let matchedAppointmentId = null;
  let matchedAppointmentData = null; // 🔹 store appointment
  let matchedWalkInData = null;      // 🔹 store walkin

  // 🔹 Now it's safe to compare against formOwner + formPet
  const apptSnapshot = await getDocs(collection(db, "Appointment"));
  for (const docSnap of apptSnapshot.docs) {
    const appt = docSnap.data();
    const apptOwner = (appt.ownerName || "").trim().toLowerCase();
    const apptPet = (appt.petName || "").trim().toLowerCase();

    if (apptOwner === formOwner && apptPet === formPet) {
      matchedAppointmentId = docSnap.id;
      matchedAppointmentData = appt;
      break;
    }
  }

  // 🔹 Check WalkIns if no match
  if (!matchedAppointmentId) {
    const walkInSnapshot = await getDocs(collection(db, "WalkInAppointment"));
    for (const docSnap of walkInSnapshot.docs) {
      const walkIn = docSnap.data();
      const walkInOwner = `${(walkIn.firstName || "").trim()} ${(walkIn.lastName || "").trim()}`.toLowerCase();
      const walkInPet = (walkIn.pet?.petName || "").trim().toLowerCase();

      if (walkInOwner === formOwner && walkInPet === formPet) {
        matchedAppointmentId = docSnap.id;
        matchedWalkInData = walkIn;
        sourceType = "walkin";
        contactNumber = walkIn.contact || walkIn.contactNumber || "";
        break;
      }
    }
  }


  const ownerName = (formData.get("ownerName") || "").trim();
const petName = (formData.get("petName") || "").trim();

const { userId, appointmentId, sourceType: foundSourceType, contactNumber: foundContact } =
  await findUserIdByOwnerAndPet(ownerName, petName);

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

  appointmentId,
  sourceType: foundSourceType || "appointment",
  contactNumber: foundContact || "",

  // ✅ always include userId if found
  userId,
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
    <button 
      class="btn-primary send-reminder" 
          data-id="${data.appointmentId || ""}"   
      
      data-type="${data.sourceType}">
      Send Reminder
    </button>
  </td>
`;

  remindersBody.appendChild(reminderRow);

  // 🔹 Auto-fill owner → pet
  if (!ownerPetMap[data.ownerName]) ownerPetMap[data.ownerName] = new Set();
  ownerPetMap[data.ownerName].add(data.petName);

const reminderBtn = reminderRow.querySelector(".send-reminder");

if (data.sourceType === "appointment") {
  reminderBtn.textContent = "Send Reminder";

  reminderBtn.addEventListener("click", async (e) => {
  try {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    
if (!docId) {
  return Swal.fire("Error", "This vaccination record isn’t linked to any appointment.", "error");
}

    const colName = type === "walkin" ? "WalkInAppointment" : "Appointment";
    const docRef = doc(db, colName, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return Swal.fire("Error", "Appointment not found.", "error");
    }

    const appointmentData = docSnap.data();
    const userId = appointmentData.userId;

    if (!userId) {
      return Swal.fire({
        title: "⚠️ Cannot send reminder",
        text: "No linked userId found for this appointment.",
        icon: "error",
        confirmButtonText: "Close"
      });
    }

    // ✅ Build the notification
    await addDoc(collection(db, "Notifications"), {
      appointmentId: docId,
      userId,
      type: "reminder",
      service: appointmentData.service || appointmentData.vaccineType || "Unknown service",
      status: "unread",
      message: `Your appointment for ${appointmentData.petName || "your pet"} is scheduled for ${appointmentData.service || appointmentData.vaccineType || "a service"}.`,
      createdAt: serverTimestamp()
    });

    Swal.fire("✅ Reminder Sent!", `A notification has been sent to ${appointmentData.ownerName || "the owner"}.`, "success");


  } catch (err) {
    console.error("❌ Error sending reminder:", err);
    Swal.fire("Error", "Something went wrong while sending reminder.", "error");
  }
});

} else if (data.sourceType === "walkin") {
  reminderBtn.textContent = "View Contact";

  reminderBtn.addEventListener("click", () => {
    Swal.fire({
      title: `Contact Info for ${data.ownerName || "Unknown Owner"}`,
      text: `📞 ${data.contactNumber || "No contact number available"}`,
      icon: "info",
      confirmButtonText: "Close"
    });
  });
}


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
    const todayStr = formatDateOnly(today); // Use same parsing logic

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

    vaccinationsTodayEl.textContent = countToday;
    vaccinationsMonthEl.textContent = countMonth;
    vaccinationsDueWeekEl.textContent = countWeekDue;
  }

  // New helper to get "YYYY-MM-DD" from Date
function formatDateOnly(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}


  // Helper functions
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

    const isUTCmidnight =
      d.getUTCHours() === 0 &&
      d.getUTCMinutes() === 0 &&
      d.getUTCSeconds() === 0 &&
      d.getUTCMilliseconds() === 0;

    const isLocalMidnight =
      d.getHours() === 0 &&
      d.getMinutes() === 0 &&
      d.getSeconds() === 0 &&
      d.getMilliseconds() === 0;

    if (isUTCmidnight && !isLocalMidnight) {
      return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

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

      // 🔄 Show loader
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

      // ⏳ After short delay, show success then redirect
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


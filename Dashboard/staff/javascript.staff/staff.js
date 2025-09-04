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

// ✅ Global state
let currentDate = new Date();
let selectedDate = null;
let appointmentsData = {}; // will be populated from Firestore

// ✅ Fetch appointments from Firestore
async function fetchAppointments() {
    const appointmentsCol = collection(db, "Appointment");
    const snapshot = await getDocs(appointmentsCol);

    appointmentsData = {}; // reset

   snapshot.forEach(doc => {
    const appt = doc.data();
    const dateKey = appt.date; // already in 'YYYY-MM-DD' format

    if (!appointmentsData[dateKey]) appointmentsData[dateKey] = [];

    appointmentsData[dateKey].push({
        time: appt.time,
        owner: appt.name,      // <-- was 'owner'
        pet: appt.petName,     // <-- was 'pet'
        service: appt.service,
        status: appt.status || "pending"
    });
});


    renderCalendar();
}

// ✅ Calendar initialization
function initializeCalendar() {
    setupCalendarNavigation();
    fetchAppointments(); // load Firestore appointments first
}

// ✅ Render calendar with appointment indicators
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
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);

        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        cell.textContent = currentDay.getDate();

        const dateKey = currentDay.toISOString().split('T')[0];

        if (currentDay.getMonth() !== month) {
            cell.classList.add('other-month');
        } else {
            if (currentDay.toDateString() === new Date().toDateString()) {
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

// ✅ Show appointment list
function displayAppointments(dateKey, dateObj) {
    const title = document.getElementById('selectedDateTitle');
    const list = document.getElementById('appointmentsList');
    if (!title || !list) return;

    const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
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

    list.innerHTML = appts.map(appt => `
        <div class="appointment-item">
            <div class="appointment-time">${appt.time}</div>
            <div class="appointment-details">
                <div class="appointment-pet">${appt.pet} (${appt.owner})</div>
                <div style="margin-top: 5px;">
                    <span style="color:#666;">Service:</span> ${appt.service}
                    <span class="status ${appt.status}" style="margin-left:10px;">${appt.status}</span>
                </div>
            </div>
        </div>
    `).join('');
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

// 📅 Load appointments into tables
async function loadAllAppointments() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");
  const historyTable = document.getElementById("historytable");

  if (dashboardTable) dashboardTable.innerHTML = "";
  if (appointmentTable) appointmentTable.innerHTML = "";
  if (historyTable) historyTable.innerHTML = "";

  // ✅ Counters
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

      // 🔹 Log activity & refresh UI
      await logActivity("staff", "Load Appointments", "No appointments found.");
      if (typeof loadRecentActivity === "function") await loadRecentActivity();
      return;
    }

    // ✅ Row renderer
    const renderRow = (data, type, docId) => {
      const status = (data.status || "Pending").toLowerCase();
      const appliedDiscounts = data.appliedDiscounts || [];

      const displayData = {
        name: type === "walkin"
          ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
          : data.name || "",
        petName: data.petName || data.pet?.petName || "",
        service: type === "walkin" ? data.serviceType || "" : data.service || "",
        time: data.time || "",
        date: data.date || "",
        contact: data.contact || "",
        status,
        mode: type === "walkin" ? "Walk-In" : "Appointment",
        totalAmount: Number(data.totalAmount) || 0,
      };

      // ✅ Counters
      if (displayData.date === today) totalAppointmentsToday++;
      if (status === "completed") {
        finishedAppointmentsCount++;
        if (displayData.date === today) {
          todaysEarnings += displayData.totalAmount;
        }
      }
      if (type === "walkin") walkInCount++;
      if (status === "pending") pendingAppointmentsToday++;
      if (status === "cancelled") cancelledAppointmentsToday++;

      // ✅ Dashboard row
      if (dashboardTable) {
        dashboardTable.insertAdjacentHTML(
          "beforeend",
          `<tr>
            <td>${displayData.name}</td>
            <td>${displayData.petName}</td>
            <td>${displayData.service}</td>
            <td>${displayData.time}</td>
            <td>${displayData.mode}</td>
            <td class="status ${status}">${status}</td>
          </tr>`
        );
      }

      // ✅ Appointment table
      if (appointmentTable) {
        const normalizedStatus = status;
        let actionButtons = "";

        if (normalizedStatus === "pending") {
          actionButtons = `
            <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
            <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
            <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
          `;
        } else if (normalizedStatus === "in progress") {
          actionButtons = `
            <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
            <button class="btn add-discount" data-id="${docId}" data-type="${type}" data-service="${displayData.service}">Apply Discount</button>
          `;
        } else if (normalizedStatus === "completed") {
          actionButtons = `
            <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
            <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>
          `;
        }

        const fullRow = document.createElement("tr");
        fullRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td class="status ${normalizedStatus}">${status || "Pending"}</td>
          <td>${actionButtons}</td>
        `;
        appointmentTable.appendChild(fullRow);
      }

      // ✅ History table
      if (historyTable) {
        const totalAmount = data.totalAmount || 0;
        const historyRow = document.createElement("tr");
        historyRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td>${totalAmount}</td>
          <td class="status ${status}">${status || "Pending"}</td>
        `;
        historyTable.appendChild(historyRow);
      }
    };

    // Render all rows
    snapshot.forEach(doc => renderRow(doc.data(), "appointment", doc.id));
    walkInSnapshot.forEach(doc => renderRow(doc.data(), "walkin", doc.id));

    // ✅ Update dashboard stats
    document.querySelector(".card:nth-child(1) .numbers").textContent = totalAppointmentsToday;
    document.querySelector(".card:nth-child(2) .numbers").textContent = finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent = walkInCount;

    const earningsCard = Array.from(document.querySelectorAll(".card"))
      .find(card => card.querySelector(".cardName")?.textContent.includes("Today's Earnings"));
    if (earningsCard) {
      earningsCard.querySelector(".numbers").textContent =
        "₱" + todaysEarnings.toLocaleString("en-PH");
    }

    // 🔹 Log activity & refresh recent activity UI
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



  // ✅ Helper function for safe price conversion
  function parsePrice(price) {
    if (!price) return 0;
    if (typeof price === "number") return price;
    return Number(price.toString().replace(/[^\d.-]/g, "")) || 0;
  }

  let currentDiscountDocRef = null; // store docRef temporarily

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
    currentDiscountDocRef = docRef;
    document.getElementById("discountModal").classList.remove("hidden");
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

// ✅ Apply discounts when modal confirm button clicked
document.getElementById("applyDiscountBtn").addEventListener("click", async () => {
  if (!currentDiscountDocRef) return;

  try {
    const snap = await getDoc(currentDiscountDocRef);
    if (!snap.exists()) return alert("Appointment not found.");
    const data = snap.data();

    const serviceName = data.service; // could be "grooming" or "Grooming"

    // 🔹 Get all services
    const q = query(collection(db, "services"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return alert("No services found.");
    }

    let service = null;

    for (const docSnap of querySnapshot.docs) {
      const s = docSnap.data();
      const docId = docSnap.id;

      // ✅ Match by either doc ID or name field (case-insensitive)
      if (
        docId.toLowerCase() === serviceName.toLowerCase() ||
        (s.name && s.name.toLowerCase() === serviceName.toLowerCase())
      ) {
        service = s;
        break;
      }
    }

    if (!service) {
      return alert(`Service '${serviceName}' not found.`);
    }

    // 🔹 Base price
    let totalAmount = parsePrice(service.basePrice ?? 0);

    // ✅ Get checked discounts from modal
    const selectedDiscounts = Array.from(
      document.querySelectorAll("#discountModal .discount-option:checked")
    ).map(cb => cb.value); // e.g. ["loyaltyDiscount"]

    if (selectedDiscounts.length === 0) {
      alert("Please select at least one discount.");
      return;
    }

    let appliedDiscounts = [];
    console.log("Service data from Firestore:", service);

    // 🔹 Handle Firestore discounts (map OR array)
    // 🔹 Handle Firestore discounts correctly (top-level fields)
// ✅ Firestore has discount fields at top-level
const discountObj = {
  pwdDiscount: service.pwdDiscount ?? 0,
  seniorDiscount: service.seniorDiscount ?? 0,
  loyaltyDiscount: service.loyaltyDiscount ?? 0
};

console.log("Final discount object used:", discountObj);


    console.log("Final discount object used:", discountObj);
    console.log("Selected checkboxes:", selectedDiscounts);

    // 🔹 Loop through selected discounts
selectedDiscounts.forEach(discountKey => {
  console.log("Checking key:", discountKey, "=>", discountObj[discountKey]);

  const discountValue = parseFloat(discountObj[discountKey]) || 0;

  if (discountValue > 0) {
    const discountPercent = discountValue / 100;

    // Deduct from base price
    totalAmount -= service.basePrice * discountPercent;

    appliedDiscounts.push(`${discountKey.replace("Discount", "")}: ${discountValue}%`);
  }
});



    totalAmount = Math.max(0, Math.round(totalAmount * 100) / 100);

    await updateDoc(currentDiscountDocRef, {
      totalAmount,
      appliedDiscounts
    });

    alert(`✅ Applied Discounts:\n${appliedDiscounts.join("\n")}\n\nNew Total: ₱${totalAmount}`);

  } catch (err) {
    console.error("Discount error:", err);
    alert("Something went wrong applying the discount.");
  }

  // Close modal
  document.getElementById("discountModal").classList.add("hidden");
  currentDiscountDocRef = null;
});


// ✅ Close modal without saving
document.getElementById("closeDiscountModal").addEventListener("click", () => {
  document.getElementById("discountModal").classList.add("hidden");
  currentDiscountDocRef = null;
});

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
  const ownerFilter = document.getElementById("searchOwner").value.toLowerCase();
  const petFilter = document.getElementById("searchPet").value.toLowerCase();
  const fromDate = document.getElementById("dateFrom").value;
  const toDate = document.getElementById("dateTo").value;

  const historyTable = document.getElementById("historytable");
  if (!historyTable) return;

  const rows = historyTable.querySelectorAll("tr");

  rows.forEach((row, index) => {
    // Skip header row if present
    if (index === 0) return;

    const cells = row.getElementsByTagName("td");
    if (!cells.length) return;

    const ownerName = (cells[2]?.textContent || "").toLowerCase(); // column 3 = owner
    const petName = (cells[3]?.textContent || "").toLowerCase();   // column 4 = pet
    const dateText = cells[0]?.textContent || "";                  // column 1 = date
    const rowDate = new Date(dateText);

    let matchesOwner = ownerName.includes(ownerFilter) || ownerFilter === "";
    let matchesPet = petName.includes(petFilter) || petFilter === "";

    let matchesDate = true;
    if (fromDate) matchesDate = matchesDate && rowDate >= new Date(fromDate);
    if (toDate) matchesDate = matchesDate && rowDate <= new Date(toDate);

    row.style.display = matchesOwner && matchesPet && matchesDate ? "" : "none";
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

  // Stats elements
  const vaccinationsTodayEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(1) .stat-number");
  const vaccinationsMonthEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(2) .stat-number");
  const vaccinationsDueWeekEl = document.querySelector("#vaccination-labeling .stat-card:nth-child(3) .stat-number");

  // Fetch existing records on page load
  document.addEventListener("DOMContentLoaded", async () => {
    const querySnapshot = await getDocs(collection(db, "VaccinationLabel"));
    querySnapshot.forEach(doc => {
      const data = doc.data();
      appendToTables(data);
    });
    updateVaccinationStats();
  });

  // Form submission
vaccinationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(vaccinationForm);

  const vaccinationDateStr = formData.get("vaccinationDate");
  const nextDueDateStr = formData.get("nextDueDate");

  const record = {
    ownerName: formData.get("ownerName"),
    petName: formData.get("petName"),
    vaccineType: formData.get("vaccineType"),
    batchNumber: formData.get("batchNumber"),

    // Always save as YYYY-MM-DD strings
    vaccinationDate: formatDateOnly(parseDateOnly(vaccinationDateStr)),
    nextDueDate: formatDateOnly(parseDateOnly(nextDueDateStr)),

    veterinarian: formData.get("veterinarian"),
    labelQuantity: parseInt(formData.get("labelQuantity"), 10) || 1,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "VaccinationLabel"), record);
    appendToTables(record);
    vaccinationForm.reset();
    updateVaccinationStats();
  } catch (error) {
    console.error("Error adding document:", error);
  }
});



  // Append record to both tables
  function appendToTables(data) {
    // ===== Reminders table =====
  const daysDelta = daysFromToday(data.nextDueDate);

  // FIX: overdue means negative daysDelta
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
        <button class="btn-primary">Send Reminder</button>
        <button class="btn-primary">Book Appointment</button>
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


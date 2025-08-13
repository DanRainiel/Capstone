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
      where,        // ✅ needed for filtering pets by userId
    updateDoc,  
    setDoc,  // ✅ needed for changing user status
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
  const STORAGE_KEY = "servicesData";

  // Load from localStorage or use defaults
  let services = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    { name: "General Consultation", basePrice: 500, seniorDiscount: 20, pwdDiscount: 20, loyaltyDiscount: 10, notes: '', discounts: [] },
    { name: "Vaccination", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 5, notes: '', discounts: [] },
    { name: "Surgery (Minor)", basePrice: 3000, seniorDiscount: 10, pwdDiscount: 10, loyaltyDiscount: 5, notes: '', discounts: [] },
    { name: "Grooming", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 10, notes: '', discounts: [] }
  ];

  let specialDiscounts = [];

  const tableBody = document.querySelector("#fee-discount table tbody");
  const editModal = document.getElementById("editServiceModal");
  const specialDiscountsList = document.getElementById("specialDiscountsList");
  let currentServiceIndex = null;

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }

  // Render services table
  function renderServices() {
    tableBody.innerHTML = "";
    services.forEach((s, index) => {
      const discountList = s.discounts.length > 0
        ? s.discounts.map(d => `${d.name} (${d.type === "percentage" ? d.value + "%" : "₱" + d.value})`).join(", ")
        : "None";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.name}</td>
        <td>₱${s.basePrice}</td>
        <td>${s.seniorDiscount}%</td>
        <td>${s.pwdDiscount}%</td>
        <td>${s.loyaltyDiscount}%</td>
        <td>${discountList}</td>
        <td><button class="btn-primary" data-index="${index}">Edit</button></td>
      `;
      tableBody.appendChild(row);
    });
  }

  // Open edit modal
  tableBody.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      currentServiceIndex = e.target.dataset.index;
      const service = services[currentServiceIndex];
      
      document.getElementById("editServiceName").value = service.name;
      document.getElementById("editBasePrice").value = service.basePrice;
      document.getElementById("editSeniorDiscount").value = service.seniorDiscount;
      document.getElementById("editPwdDiscount").value = service.pwdDiscount;
      document.getElementById("editLoyaltyDiscount").value = service.loyaltyDiscount;
      document.getElementById("editNotes").value = service.notes;

      renderServiceDiscounts(service);
      editModal.style.display = "block";
    }
  });

  // Render service-specific discounts in modal
  function renderServiceDiscounts(service) {
    specialDiscountsList.innerHTML = "<h3>Applied Special Discounts</h3>";
    service.discounts.forEach((d, idx) => {
      const div = document.createElement("div");
      div.innerHTML = `
        ${d.name} - ${d.type === "percentage" ? d.value + "%" : "₱" + d.value} 
        <button data-discount-index="${idx}">Delete</button>
      `;
      specialDiscountsList.appendChild(div);
    });

    specialDiscountsList.onclick = (e) => {
      if (e.target.tagName === "BUTTON") {
        const discountIndex = e.target.dataset.discountIndex;
        service.discounts.splice(discountIndex, 1);
        saveToStorage();
        renderServiceDiscounts(service);
        renderServices();
      }
    };
  }

  // Save service changes
  document.getElementById("saveServiceChanges").addEventListener("click", () => {
    if (currentServiceIndex !== null) {
      const service = services[currentServiceIndex];
      service.basePrice = parseFloat(document.getElementById("editBasePrice").value);
      service.seniorDiscount = parseFloat(document.getElementById("editSeniorDiscount").value);
      service.pwdDiscount = parseFloat(document.getElementById("editPwdDiscount").value);
      service.loyaltyDiscount = parseFloat(document.getElementById("editLoyaltyDiscount").value);
      service.notes = document.getElementById("editNotes").value;

      saveToStorage();
      renderServices();
      editModal.style.display = "none";
    }
  });

  // Publish new discount
  document.getElementById("discountForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const discount = {
      name: formData.get("discountName"),
      type: formData.get("discountType"),
      value: parseFloat(formData.get("discountValue")),
      applicableServices: formData.getAll("applicableServices"),
    };

    specialDiscounts.push(discount);

    services.forEach(s => {
      if (discount.applicableServices.includes("all") ||
          discount.applicableServices.includes(s.name.toLowerCase().split(" ")[0])) {
        s.discounts.push(discount);
      }
    });

    saveToStorage();
    renderServices();
    e.target.reset();
  });

  renderServices();
});





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

  // 📅 Load appointments into two tables
async function loadAllAppointments() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");
  const historyTable = document.getElementById("historytable");

  if (dashboardTable) dashboardTable.innerHTML = "";
  if (appointmentTable) appointmentTable.innerHTML = "";
  if (historyTable) historyTable.innerHTML = "";

    // ✅ Counts
  let todayScheduleCount = 0;
  let finishedAppointmentsCount = 0;
  let walkInCount = 0;

  let totalAppointmentsToday = 0;
  let pendingAppointmentsToday = 0;
  let cancelledAppointmentsToday = 0;

  let totalUsers = 0;

  
  


  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  try {
    const [snapshot, walkInSnapshot] = await Promise.all([
      getDocs(collection(db, "Appointment")),
      getDocs(collection(db, "WalkInAppointment")),
     
    ]);

    if (snapshot.empty && walkInSnapshot.empty) {
      const emptyRow = "<tr><td colspan='8'>No appointments found.</td></tr>";
      if (dashboardTable) dashboardTable.innerHTML = emptyRow;
      if (appointmentTable) appointmentTable.innerHTML = emptyRow;
      await logActivity("admin", "Load Appointments", "No appointments found.");
      return;
    }

    const renderRow = (data, type) => {
      const status = data.status || "Pending";

      // Normalize field names so both types look the same
      const displayData = {
    name:
      type === "walkin"
        ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
        : data.name || "",
    petName: data.petName || data.pet?.petName || "",
    service: type === "walkin" ? data.serviceType || "" : data.service || "",
    time: data.time || "",
    date: data.date || "",
    contact: data.contact || "",
    status,
    mode: type === "walkin" ? "Walk-In" : "Appointment" // 👈 added mode
  };

   // ✅ Count today's schedule
      if (displayData.date === today) {
        todayScheduleCount++;
      }

      // ✅ Count finished appointments
      if (status.toLowerCase() === "completed") {
        finishedAppointmentsCount++;
      }

      // ✅ Count walk-ins
      if (type === "walkin") {
        walkInCount++;
      }

      // Dashboard summary table
      if (dashboardTable) {
        const dashRow = document.createElement("tr");
        dashRow.innerHTML = `
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td>${displayData.time}</td>
          <td>${displayData.mode}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
        `;
        dashboardTable.appendChild(dashRow);
      }

      // Full appointment table with actions
      if (appointmentTable) {
        let actionButtons = "";
        if (status === "Pending") {
          actionButtons = `
            <button class="btn accept">Accept</button>
            <button class="btn decline">Decline</button>
            <button class="btn reschedule">Reschedule</button>
            <button class="btn screenshot">View Screenshot</button>
          `;
        } else if (status === "In Progress") {
          actionButtons = `<button class="btn complete">Complete</button>`;
        } else if (status === "Completed") {
          actionButtons = `
            <button class="btn view">View</button>
            <button class="btn edit">Edit</button>
          `;
        }

        // History table - show all
if (historyTable) {
  const totalAmount = data.totalAmount || 0; // ✅ fallback if field is missing
  const historyRow = document.createElement("tr");
  historyRow.innerHTML = `
    <td>${displayData.date}</td>
    <td>${displayData.time}</td>
    <td>${displayData.name}</td>
    <td>${displayData.petName}</td>
    <td>${displayData.service}</td>
      <td>${totalAmount}</td> <!-- ✅ show totalAmount -->
    <td class="status ${status.toLowerCase()}">${status}</td>
  
  `;
  historyTable.appendChild(historyRow);
}


        const fullRow = document.createElement("tr");
        fullRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.contact}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
          <td>${actionButtons}</td>
        `;
        appointmentTable.appendChild(fullRow);
      }
    }


    
    // Render all regular appointments
    snapshot.forEach((doc) => renderRow(doc.data(), "appointment"));

    // Render all walk-in appointments
    walkInSnapshot.forEach((doc) => renderRow(doc.data(), "walkin"));

    
    // ✅ Update dashboard card numbers
    document.querySelector(".card:nth-child(1) .numbers").textContent = todayScheduleCount;
    document.querySelector(".card:nth-child(2) .numbers").textContent = finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent = walkInCount;
    

     document.querySelector("#appointments .stat-card:nth-child(1) .stat-number").textContent = totalAppointmentsToday;
    document.querySelector("#appointments .stat-card:nth-child(2) .stat-number").textContent = pendingAppointmentsToday;
    document.querySelector("#appointments .stat-card:nth-child(3) .stat-number").textContent = cancelledAppointmentsToday;

    // ✅ If you have a Users card somewhere
    const usersCard = document.querySelector(".users-count");
    if (usersCard) {
      usersCard.textContent = totalUsers;
    }
    

    await logActivity(
      "admin",
      "Load Appointments",
      `${snapshot.size + walkInSnapshot.size} appointments loaded.`
    );
  } catch (error) {
    console.error("Error loading appointments:", error);
    const errorRow = "<tr><td colspan='8'>Error loading appointments.</td></tr>";
    if (dashboardTable) dashboardTable.innerHTML = errorRow;
    if (appointmentTable) appointmentTable.innerHTML = errorRow;
    await logActivity("admin", "Load Appointments Error", error.message);
  }
}


// 👥 Load all users
// 👥 Load all users + update stats
async function loadAllUsers() {
  const userTable = document.getElementById("userTable");
  if (userTable) userTable.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "users"));

    if (snapshot.empty) {
      if (userTable) userTable.innerHTML = "<tr><td colspan='8'>No users found.</td></tr>";
      return;
    }

    let totalUsers = snapshot.size;
    let newUsersThisMonth = 0;
    let deactivatedAccounts = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    for (const userDoc of snapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;
      const name = userData.name || "";
      const email = userData.email || "";
      const contact = userData.contact || "";
      const joinedDate = userData.joinedDate || "";
      const status = userData.status || "Active";

      // ✅ Count new users this month
      // ✅ Count new users this month
if (joinedDate) {
  let joinDateObj;

  // If Firestore Timestamp, convert to JS Date
  if (joinedDate.toDate) {
    joinDateObj = joinedDate.toDate();
  } else {
    joinDateObj = new Date(joinedDate);
  }

  if (
    joinDateObj.getMonth() === currentMonth &&
    joinDateObj.getFullYear() === currentYear
  ) {
    newUsersThisMonth++;
  }
}


      // ✅ Count deactivated accounts
      if (status.toLowerCase() === "inactive" || status.toLowerCase() === "deactivated") {
        deactivatedAccounts++;
      }

      // Count pets
      const petSnapshot = await getDocs(
        query(collection(db, "Pets"), where("userId", "==", userId))
      );
      const petCount = petSnapshot.size;

      // Action buttons
      let actions = `
        <button class="btn view" data-id="${userId}">View</button>
        <button class="btn edit" data-id="${userId}">Edit</button>
      `;
      actions += status === "Active"
        ? `<button class="btn deactivate" data-id="${userId}">Deactivate</button>`
        : `<button class="btn activate" data-id="${userId}">Activate</button>`;

      if (userTable) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${userId}</td>
          <td>${name}</td>
          <td>${email}</td>
          <td>${contact}</td>
          <td>${petCount}</td>
         
          <td class="status">${status}</td>
          <td>${actions}</td>
        `;
        userTable.appendChild(row);
      }
    }

    // ✅ Update the dashboard stat cards
    document.querySelector("#user-management .stat-card:nth-child(1) .stat-number").textContent = totalUsers;
    document.querySelector("#user-management .stat-card:nth-child(2) .stat-number").textContent = newUsersThisMonth;
    document.querySelector("#user-management .stat-card:nth-child(3) .stat-number").textContent = deactivatedAccounts;

    attachUserStatusListeners();
  } catch (error) {
    console.error("Error loading users:", error);
    if (userTable) userTable.innerHTML = "<tr><td colspan='8'>Error loading users.</td></tr>";
  }
}


// 🔄 Update user status
async function updateUserStatus(userId, newStatus) {
  try {
    await updateDoc(doc(db, "users", userId), {
      status: newStatus
    });
    await logActivity("admin", `User ${newStatus}`, `User ${userId} set to ${newStatus}`);
    loadAllUsers();
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}

// 🧩 Bind buttons after rendering
function attachUserStatusListeners() {
  document.querySelectorAll(".btn.deactivate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Inactive"))
  );
  document.querySelectorAll(".btn.activate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Active"))
  );
}

document.addEventListener("DOMContentLoaded", function () {
  // --- ADMIN PAGE LOGIC ---
  const newsForm = document.getElementById('newsForm');
  const newsTableBody = document.querySelector('#news-management table tbody');

  // Utility function to generate unique IDs for news items
  function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  // Render the table from localStorage
  function renderNewsTable() {
    let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsTableBody.innerHTML = '';

    newsList.forEach((news, index) => {
      // Determine status text & button based on draft or published
      const isDraft = news.status === 'draft';

      const tr = document.createElement('tr');
      tr.dataset.index = index;

      tr.innerHTML = `
        <td>${news.title}</td>
        <td>${capitalize(news.category)}</td>
        <td>${news.publishDate ? new Date(news.publishDate).toLocaleDateString() : '-'}</td>
        <td><span class="status ${isDraft ? 'pending' : 'completed'}">${isDraft ? 'Draft' : 'Published'}</span></td>
        <td>${news.views || 0}</td>
        <td>
          <button class="btn-primary edit-btn">Edit</button>
          ${isDraft 
            ? `<button class="btn-primary publish-btn">Publish</button>` 
            : `<button class="btn-primary view-btn">View</button>`}
          <button class="btn-danger delete-btn">${isDraft ? 'Delete' : 'Unpublish'}</button>
        </td>
      `;

      newsTableBody.appendChild(tr);
    });
  }

  // Capitalize first letter helper
  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Save newsList back to localStorage
  function saveNewsList(newsList) {
    localStorage.setItem('newsList', JSON.stringify(newsList));
  }

  // Event listener for form submit (publish news)
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = this.newsTitle.value.trim();
      const category = this.newsCategory.value;
      const priority = this.newsPriority.value;
      const content = this.newsContent.value.trim();
      const publishDate = this.publishDate.value;
      // We'll set default status to "published" on submit
      const status = "published";

      if (!title || !content) {
        alert("Title and content are required.");
        return;
      }

      const newsItem = {
        id: generateId(),
        title,
        category,
        priority,
        content,
        publishDate,
        image: "/images/news2.webp",
        status,
        views: 0 // default views count
      };

      let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
      newsList.unshift(newsItem);
      saveNewsList(newsList);

      alert("News published successfully!");
      this.reset();

      renderNewsTable();
    });

    // Save as Draft button logic
    const draftBtn = newsForm.querySelector('button[type="button"]');
    draftBtn.addEventListener('click', function () {
      const title = newsForm.newsTitle.value.trim();
      const category = newsForm.newsCategory.value;
      const priority = newsForm.newsPriority.value;
      const content = newsForm.newsContent.value.trim();
      const publishDate = newsForm.publishDate.value;
      const status = "draft";

      if (!title || !content) {
        alert("Title and content are required to save draft.");
        return;
      }

      const newsItem = {
        id: generateId(),
        title,
        category,
        priority,
        content,
        publishDate,
        image: "/images/news2.webp",
        status,
        views: 0
      };

      let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
      newsList.unshift(newsItem);
      saveNewsList(newsList);

      alert("Draft saved successfully!");
      newsForm.reset();

      renderNewsTable();
    });
  }

  // Delegate table button clicks (edit, delete, publish, view)
  if (newsTableBody) {
    newsTableBody.addEventListener('click', function (e) {
      const btn = e.target;
      const row = btn.closest('tr');
      if (!row) return;
      const index = row.dataset.index;
      let newsList = JSON.parse(localStorage.getItem('newsList')) || [];
      let newsItem = newsList[index];

      if (btn.classList.contains('delete-btn')) {
        // Delete or Unpublish logic
        if (confirm(`Are you sure you want to ${newsItem.status === 'draft' ? 'delete' : 'unpublish'} this news?`)) {
          if (newsItem.status === 'draft') {
            // Remove draft item
            newsList.splice(index, 1);
          } else {
            // For published news: change status to draft (unpublish)
            newsList[index].status = 'draft';
          }
          saveNewsList(newsList);
          renderNewsTable();
        }
      } 
      else if (btn.classList.contains('publish-btn')) {
        // Publish draft
        newsList[index].status = 'published';
        saveNewsList(newsList);
        alert('News published successfully!');
        renderNewsTable();
      } 
      else if (btn.classList.contains('edit-btn')) {
        // Simple alert for now - you can implement form population for editing
        alert('Edit functionality not implemented yet.');
      } 
      else if (btn.classList.contains('view-btn')) {
        // Simple alert for now - you can implement a modal or new page to view details
        alert(`Viewing news: ${newsItem.title}`);
      }
    });
  }

  // Initial render of table
  renderNewsTable();

  // --- CUSTOMER PAGE LOGIC (unchanged) ---
  const newsContainer = document.querySelector('.cards');
  if (newsContainer) {
    const newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsContainer.innerHTML = '';

    newsList.forEach(news => {
      if (news.status === 'published') { // only show published news
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div class="image-section">
            <img src="${news.image}" alt="${news.title}">
          </div>
          <div class="content">
            <h4>${news.title}</h4>
            <p>${news.content}</p>
          </div>
          <div class="posted-date">
            <p>${news.publishDate ? new Date(news.publishDate).toLocaleDateString() : ''}</p>
          </div>
        `;
        newsContainer.appendChild(card);
      }
    });
  }
});

//CALENDAR//
document.addEventListener("DOMContentLoaded", () => {
  const currentMonthEl = document.getElementById("currentMonth");
  const calendarGrid = document.getElementById("calendarGrid");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  let currentDate = new Date();

  function renderCalendar(date) {
    calendarGrid.innerHTML = `
      <div style="font-weight: bold; padding: 10px;">Sun</div>
      <div style="font-weight: bold; padding: 10px;">Mon</div>
      <div style="font-weight: bold; padding: 10px;">Tue</div>
      <div style="font-weight: bold; padding: 10px;">Wed</div>
      <div style="font-weight: bold; padding: 10px;">Thu</div>
      <div style="font-weight: bold; padding: 10px;">Fri</div>
      <div style="font-weight: bold; padding: 10px;">Sat</div>
    `;

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    currentMonthEl.textContent = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Add blank cells for days before month start
    for(let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("calendar-day", "empty");
      calendarGrid.appendChild(emptyCell);
    }

    // Add actual days
    for(let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement("div");
      dayCell.classList.add("calendar-day");
      dayCell.textContent = day;

      // Highlight today if in current month/year
      const today = new Date();
      if(day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dayCell.classList.add("today");
      }

      calendarGrid.appendChild(dayCell);
    }

    // Fill remaining cells to complete last week row (optional)
    const totalCells = calendarGrid.querySelectorAll(".calendar-day, .empty").length;
    const remainder = totalCells % 7;
    if (remainder !== 0) {
      const blanksToAdd = 7 - remainder;
      for(let i = 0; i < blanksToAdd; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day", "empty");
        calendarGrid.appendChild(emptyCell);
      }
    }
  }

  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  renderCalendar(currentDate);
});


// 🕓 Load recent activities
async function loadRecentActivity() {
  const activityContainer = document.querySelector(".recent-activity");

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

      activityContainer.appendChild(activityItem);
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
loadAllUsers();

// 🐾 Load services and special discounts
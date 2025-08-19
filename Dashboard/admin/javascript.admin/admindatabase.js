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
        where,   
        Timestamp,  // ✅ needed for filtering pets by userId
      updateDoc,  
      setDoc,  
      onSnapshot,
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

    // Function to render each row
    const renderRow = (data, type, docId) => {
      const status = data.status || "Pending";

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
        mode: type === "walkin" ? "Walk-In" : "Appointment",
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
            <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
            <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
            <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
            <button class="btn screenshot" data-id="${docId}" data-type="${type}">View Screenshot</button>
          `;
        } else if (status === "In Progress") {
          actionButtons = `<button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>`;
        } else if (status === "Completed") {
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
          <td>${displayData.contact}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
          <td>${actionButtons}</td>
        `;
        appointmentTable.appendChild(fullRow);
      }

      // History table
      if (historyTable) {
        const totalAmount = data.totalAmount || 0; // ✅ fallback if field is missing
        const historyRow = document.createElement("tr");
        historyRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td>${totalAmount}</td>
          <td class="status ${status.toLowerCase()}">${status}</td>
        `;
        historyTable.appendChild(historyRow);
      }
    };

    // Render all regular appointments
    snapshot.forEach((doc) => renderRow(doc.data(), "appointment", doc.id));

    // Render all walk-in appointments
    walkInSnapshot.forEach((doc) => renderRow(doc.data(), "walkin", doc.id));

    // ✅ Update dashboard card numbers
    document.querySelector(".card:nth-child(1) .numbers").textContent =
      todayScheduleCount;
    document.querySelector(".card:nth-child(2) .numbers").textContent =
      finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent =
      walkInCount;

    document.querySelector(
      "#appointments .stat-card:nth-child(1) .stat-number"
    ).textContent = totalAppointmentsToday;
    document.querySelector(
      "#appointments .stat-card:nth-child(2) .stat-number"
    ).textContent = pendingAppointmentsToday;
    document.querySelector(
      "#appointments .stat-card:nth-child(3) .stat-number"
    ).textContent = cancelledAppointmentsToday;

    // ✅ If you have a Users card somewhere
    const usersCard = document.querySelector(".users-count");
    if (usersCard) {
      usersCard.textContent = totalUsers;
    }

    // 🟢 Event Listeners: When status changes, re-render all tables
    document
      .querySelectorAll(".btn.accept, .btn.decline, .btn.complete")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const docId = btn.getAttribute("data-id");
          const type = btn.getAttribute("data-type");
          const newStatus = btn.classList.contains("accept")
            ? "In Progress"
            : btn.classList.contains("decline")
            ? "Declined"
            : "Completed";

          const collectionName =
            type === "walkin" ? "WalkInAppointment" : "Appointment";

          await updateDoc(doc(db, collectionName, docId), {
            status: newStatus,
          });

          // 🔄 Refresh all tables after update
          loadAllAppointments();
        });
      });

    // ✅ Success log
    await logActivity(
      "admin",
      "Load Appointments",
      `${snapshot.size + walkInSnapshot.size} appointments loaded.`
    );
  } catch (error) {
    console.error("Error loading appointments:", error);
    const errorRow =
      "<tr><td colspan='8'>Error loading appointments.</td></tr>";
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


  

  //NEWS MANAGEMENT//
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
    newsList.splice(index, 1);
  } else {
    newsList[index].status = 'draft';
  }
  saveNewsList(newsList); // ✅ This ensures the change is stored
  renderNewsTable();

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

    // --- CUSTOMER PAGE LOGIC ---
  function renderCustomerNews() {
    const newsContainer = document.querySelector('.cards');
    if (!newsContainer) return;

    const newsList = JSON.parse(localStorage.getItem('newsList')) || [];
    newsContainer.innerHTML = '';

    newsList.forEach(news => {
      if (news.status === 'published') {
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

  document.addEventListener("DOMContentLoaded", renderCustomerNews);

  // ✅ Refresh customer page display if localStorage changes
  window.addEventListener('storage', renderCustomerNews);

  });


  //CALENDAR MANAGEMENT//
  document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthEl = document.getElementById("currentMonth");
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");

    const blockDateInput = document.getElementById("blockDate");
    const blockStartTimeInput = document.getElementById("blockStartTime");
    const blockEndTimeInput = document.getElementById("blockEndTime");
    const blockReasonInput = document.getElementById("blockReason");
    const updateScheduleBtn = document.getElementById("updateScheduleBtn");

    const tableBody = document.getElementById("blockedSlotsTableBody");

    let blockedSlots = [];
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    function formatTime(timeStr) {
      if (!timeStr) return "--:--";
      let [hour, minute] = timeStr.split(":");
      hour = parseInt(hour, 10);
      let ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    }

    // ================= Firestore =================

    const blockedCollection = collection(db, "BlockedSlots");

    async function loadBlockedSlots() {
      const snapshot = await getDocs(blockedCollection);
      blockedSlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTable();
      renderCalendar();
    }

    async function addBlockedSlot(date, startTime, endTime, reason) {
      const docRef = await addDoc(blockedCollection, { date, startTime, endTime, reason });
      blockedSlots.push({ id: docRef.id, date, startTime, endTime, reason });
      renderTable();
      renderCalendar();
    }

    async function removeBlockedSlot(id) {
      await deleteDoc(doc(db, "BlockedSlots", id));
      blockedSlots = blockedSlots.filter(b => b.id !== id);
      renderTable();
      renderCalendar();
    }

    // Real-time listener (optional but recommended)
    onSnapshot(blockedCollection, (snapshot) => {
      blockedSlots = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTable();
      renderCalendar();
    });

    // ================= Calendar & Table =================

    function renderCalendar() {
      calendarGrid.querySelectorAll(".day, .empty-day").forEach(el => el.remove());
      currentMonthEl.textContent = `${currentDate.toLocaleString("default", { month: "long" })} ${currentYear}`;

      const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty-day");
        calendarGrid.appendChild(emptyDiv);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayDiv = document.createElement("div");
        dayDiv.classList.add("day");
        dayDiv.textContent = day;
        dayDiv.dataset.date = dateStr;
        dayDiv.style.padding = "10px";
        dayDiv.style.cursor = "pointer";

        if (blockedSlots.some(b => b.date === dateStr)) {
          dayDiv.style.background = "#ffcccc";
          dayDiv.style.borderRadius = "5px";
          dayDiv.style.pointerEvents = "none"; // disable selection
        }

        calendarGrid.appendChild(dayDiv);
      }
    }

    function renderTable() {
      tableBody.innerHTML = "";
      blockedSlots.forEach(block => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${block.date}</td>
          <td>${formatTime(block.startTime)} - ${formatTime(block.endTime)}</td>
          <td><span class="status cancelled">Blocked</span></td>
          <td>${block.reason}</td>
          <td><button class="btn-danger remove-btn" data-id="${block.id}">Remove Block</button></td>
        `;
        tableBody.appendChild(tr);
      });
    }

       // ================= Events =================

    updateScheduleBtn.addEventListener("click", async () => {
      // --- 1. Save clinic hours ---
      const weekdayStartInput = document.querySelectorAll("input[type='time']")[0];
      const weekdayEndInput   = document.querySelectorAll("input[type='time']")[1];
      const satStartInput     = document.querySelectorAll("input[type='time']")[2];
      const satEndInput       = document.querySelectorAll("input[type='time']")[3];
      const durationSelect    = document.querySelector("select");

      const weekdayStart = weekdayStartInput.value;
      const weekdayEnd = weekdayEndInput.value;
      const satStart = satStartInput.value;
      const satEnd = satEndInput.value;
      const appointmentDuration = parseInt(durationSelect.value);

      const settingsDocRef = doc(db, "ClinicSettings", "schedule");

      await setDoc(settingsDocRef, {
        weekdayHours: { start: weekdayStart, end: weekdayEnd },
        saturdayHours: { start: satStart, end: satEnd },
        appointmentDuration
      }, { merge: true });

      // --- 2. Save blocked slot if provided ---
      const date = blockDateInput.value;
      const startTime = blockStartTimeInput.value;
      const endTime = blockEndTimeInput.value;
      const reason = blockReasonInput.value.trim();

      if (date && startTime && endTime && reason) {
        await addBlockedSlot(date, startTime, endTime, reason);
        blockDateInput.value = "";
        blockStartTimeInput.value = "";
        blockEndTimeInput.value = "";
        blockReasonInput.value = "";
      }

      alert("Schedule settings updated!");
    });

    tableBody.addEventListener("click", async (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const id = e.target.dataset.id;
        await removeBlockedSlot(id);
      }
    });

    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      currentDate = new Date(currentYear, currentMonth);
      renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      currentDate = new Date(currentYear, currentMonth);
      renderCalendar();
    });

    // Initial load
    loadBlockedSlots();
  });



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



//SALES REPORT//
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateReportBtn");
  const reportTypeEl = document.getElementById("reportType");
  const serviceCategoryEl = document.getElementById("serviceCategory");
  const reportDateFrom = document.getElementById("reportDateFrom");
  const reportDateTo = document.getElementById("reportDateTo");
  const reportTableBody = document.getElementById("reportTableBody");



  // --- Update revenue cards from SalesReport ---
async function updateRevenueCards(category = "all") {
  try {
    const snapshot = await getDocs(collection(db, "SalesReport"));

    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (category.toLowerCase() !== "all" && data.category !== category) return;

      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : null;
      const amount = data.totalRevenue || 0;
      if (!createdAt) return;

      if (createdAt.toDateString() === today.toDateString()) todayRevenue += amount;
      if (createdAt >= startOfWeek) weekRevenue += amount;
      if (createdAt >= startOfMonth) monthRevenue += amount;
    });

    // ✅ Update cards by ID instead of nth-child
    document.getElementById("todayRevenue").textContent = `₱${todayRevenue.toLocaleString()}`;
    document.getElementById("weekRevenue").textContent = `₱${weekRevenue.toLocaleString()}`;
    document.getElementById("monthRevenue").textContent = `₱${monthRevenue.toLocaleString()}`;
  } catch (err) {
    console.error("Error updating revenue cards:", err);
  }
}

  // --- Generate Report Button ---
  generateBtn.addEventListener("click", async () => {
    try {
      const reportType = reportTypeEl.value;
      const category = serviceCategoryEl.value;
      const fromDate = reportDateFrom.value ? new Date(reportDateFrom.value) : null;
      const toDate = reportDateTo.value ? new Date(reportDateTo.value) : null;

      let totalRevenue = 0;
      let totalServices = 0;
      const rows = [];
      let todayRevenue = 0;
      let weekRevenue = 0;
      let monthRevenue = 0;

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // --- Build Appointment query ---
      let q = collection(db, "Appointment");
      const filters = [];

      // ✅ Fix: use "service", not "serviceType"
      if (category.toLowerCase() !== "all") {
        filters.push(where("service", "==", category));
      }

      // ✅ Fix: "date" is a string, not a timestamp
      if (fromDate && toDate) {
        filters.push(where("date", ">=", fromDate.toISOString().split("T")[0]));
        filters.push(where("date", "<=", toDate.toISOString().split("T")[0]));
      }

      if (filters.length > 0) {
        q = query(q, ...filters);
      }

      // --- Get Appointment data ---
      const snapshot = await getDocs(q);
      snapshot.forEach(docSnap => {
        const data = docSnap.data();

        const saleDate = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : (data.date ? new Date(data.date) : null);

        const serviceType = data.service || "Unknown";
        const servicePrice = data.totalPrice || 0; // ⚠️ confirm this field

        totalRevenue += servicePrice;
        totalServices += 1;

        // Revenue card calculations
        if (saleDate) {
          if (saleDate.toDateString() === today.toDateString()) todayRevenue += servicePrice;
          if (saleDate >= startOfWeek) weekRevenue += servicePrice;
          if (saleDate >= startOfMonth) monthRevenue += servicePrice;
        }

        rows.push({
          date: saleDate ? saleDate.toLocaleDateString() : "N/A",
          type: serviceType,
     
          revenue: servicePrice,
          avg: servicePrice,
          growth: "N/A"
        });
      });

      // --- Save to SalesReport ---
      await addDoc(collection(db, "SalesReport"), {
        reportType,
        category,
        fromDate: fromDate || null,
        toDate: toDate || null,
        totalRevenue,
        totalServices,
        createdAt: serverTimestamp(),
        details: rows
      });

      // --- Populate table ---
      reportTableBody.innerHTML = "";
      if (rows.length > 0) {
        rows.forEach(r => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${r.date}</td>
            <td>${r.type}</td>
    
            <td>₱${r.revenue.toLocaleString()}</td>
            <td>₱${r.avg.toLocaleString()}</td>
            <td>${r.growth}</td>
          `;
          reportTableBody.appendChild(tr);
        });
      } else {
        reportTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No data available</td></tr>`;
      }

      // --- Reflect local totals ---
    // ✅ Update services completed card
document.getElementById("servicesCompleted").textContent = totalServices.toLocaleString();


      // --- Refresh revenue cards from SalesReport ---
      await updateRevenueCards(category);

    } catch (err) {
      console.error("Error generating report:", err);
    }
  });
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
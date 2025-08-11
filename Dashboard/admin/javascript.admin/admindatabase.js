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


document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY_SERVICES = 'servicesData';
  const STORAGE_KEY_DISCOUNTS = 'specialDiscounts';

  let services = JSON.parse(localStorage.getItem(STORAGE_KEY_SERVICES)) || [
    { name: "General Consultation", basePrice: 500, seniorDiscount: 20, pwdDiscount: 20, loyaltyDiscount: 10, notes: '' },
    { name: "Vaccination", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 5, notes: '' },
    { name: "Surgery (Minor)", basePrice: 3000, seniorDiscount: 10, pwdDiscount: 10, loyaltyDiscount: 5, notes: '' },
    { name: "Grooming", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 10, notes: '' },
  ];

  let specialDiscounts = JSON.parse(localStorage.getItem(STORAGE_KEY_DISCOUNTS)) || [];

  const table = document.querySelector('#fee-discount table');
  const tableHead = table.querySelector('thead tr');
  const tableBody = table.querySelector('tbody');

  const editServiceModal = document.getElementById('editServiceModal');
  const closeModalBtn = editServiceModal.querySelector('.close');
  const cancelEditBtn = document.getElementById('cancelEdit');
  const saveServiceBtn = document.getElementById('saveServiceChanges');
  const deleteServiceBtn = document.getElementById('deleteService');

  const editServiceName = document.getElementById('editServiceName');
  const editBasePrice = document.getElementById('editBasePrice');
  const editSeniorDiscount = document.getElementById('editSeniorDiscount');
  const editPwdDiscount = document.getElementById('editPwdDiscount');
  const editLoyaltyDiscount = document.getElementById('editLoyaltyDiscount');
  const editNotes = document.getElementById('editNotes');

  // A container inside modal to list special discounts for that service
  // Add this div inside your modal body in HTML:
  // <div id="specialDiscountsList" style="margin-top: 15px;"></div>
  const specialDiscountsList = document.getElementById('specialDiscountsList');

  let currentEditingIndex = null;

  function saveServices() {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }

  function saveSpecialDiscounts() {
    localStorage.setItem(STORAGE_KEY_DISCOUNTS, JSON.stringify(specialDiscounts));
  }

  function renderServices() {
    tableHead.innerHTML = `
      <th>Service</th>
      <th>Base Price</th>
      <th>Senior Discount</th>
      <th>PWD Discount</th>
      <th>Loyalty Discount</th>
    `;
    specialDiscounts.forEach(discount => {
      tableHead.insertAdjacentHTML('beforeend', `<th>${discount.name}</th>`);
    });
    tableHead.insertAdjacentHTML('beforeend', `<th>Actions</th>`);

    tableBody.innerHTML = '';
    services.forEach((service, idx) => {
      let rowHTML = `
        <td>${service.name}</td>
        <td>₱${service.basePrice?.toLocaleString() ?? '-'}</td>
        <td>${service.seniorDiscount ?? '-'}%</td>
        <td>${service.pwdDiscount ?? '-'}%</td>
        <td>${service.loyaltyDiscount ?? '-'}%</td>
      `;

      specialDiscounts.forEach(discount => {
        const applies = discount.applicableServices.includes('all') || discount.applicableServices.includes(service.name.toLowerCase().replace(/\s+/g, ''));
        if (applies) {
          if (discount.type === 'percentage') {
            rowHTML += `<td>${discount.value}%</td>`;
          } else {
            rowHTML += `<td>₱${discount.value.toLocaleString()}</td>`;
          }
        } else {
          rowHTML += `<td>-</td>`;
        }
      });

      rowHTML += `<td><button class="btn-primary edit-btn" data-index="${idx}">Edit</button></td>`;

      const tr = document.createElement('tr');
      tr.innerHTML = rowHTML;
      tableBody.appendChild(tr);
    });

    attachEditListeners();
  }

  function attachEditListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', e => {
        const idx = e.target.dataset.index;
        openEditModal(idx);
      });
    });
  }

  // Open modal & fill form with service data
  function openEditModal(idx) {
    currentEditingIndex = idx;
    const service = services[idx];

    editServiceName.value = service.name;
    editBasePrice.value = service.basePrice;
    editSeniorDiscount.value = service.seniorDiscount;
    editPwdDiscount.value = service.pwdDiscount;
    editLoyaltyDiscount.value = service.loyaltyDiscount;
    editNotes.value = service.notes || '';

    // Show special discounts applicable to this service inside modal
    renderSpecialDiscountsList(service);

    editServiceModal.style.display = 'block';
  }

  // Render list of special discounts with delete buttons for this service
  function renderSpecialDiscountsList(service) {
    specialDiscountsList.innerHTML = '<h4>Special Discounts for this Service:</h4>';

    let foundAny = false;
    specialDiscounts.forEach((discount, i) => {
      const applies = discount.applicableServices.includes('all') || discount.applicableServices.includes(service.name.toLowerCase().replace(/\s+/g, ''));
      if (applies) {
        foundAny = true;
        specialDiscountsList.insertAdjacentHTML('beforeend', `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 6px; border: 1px solid #ccc; border-radius: 5px;">
            <span>${discount.name} (${discount.type === 'percentage' ? discount.value + '%' : '₱' + discount.value.toLocaleString()})</span>
            <button class="btn-delete" data-discount-index="${i}" style="background-color: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
          </div>
        `);
      }
    });

    if (!foundAny) {
      specialDiscountsList.insertAdjacentHTML('beforeend', '<p>No special discounts applied to this service.</p>');
    }

    // Attach delete listeners for special discounts inside modal
    specialDiscountsList.querySelectorAll('button.btn-delete').forEach(btn => {
      btn.addEventListener('click', e => {
        const discountIndex = Number(e.target.dataset.discountIndex);
        if (confirm(`Delete the special discount "${specialDiscounts[discountIndex].name}"? This will remove it for ALL services.`)) {
          specialDiscounts.splice(discountIndex, 1);
          saveSpecialDiscounts();
          renderSpecialDiscountsList(services[currentEditingIndex]);
          renderServices();
        }
      });
    });
  }

  // Close modal helpers
  function closeModal() {
    editServiceModal.style.display = 'none';
    currentEditingIndex = null;
  }
  closeModalBtn.addEventListener('click', closeModal);
  cancelEditBtn.addEventListener('click', closeModal);

  window.addEventListener('click', (e) => {
    if (e.target === editServiceModal) closeModal();
  });

  // Save changes from modal
  saveServiceBtn.addEventListener('click', () => {
    if (currentEditingIndex === null) return;

    // Validate fields
    const basePrice = Number(editBasePrice.value);
    const senior = Number(editSeniorDiscount.value);
    const pwd = Number(editPwdDiscount.value);
    const loyalty = Number(editLoyaltyDiscount.value);

    if (isNaN(basePrice) || basePrice < 0) {
      alert('Base price must be 0 or more');
      return;
    }
    if ([senior, pwd, loyalty].some(d => isNaN(d) || d < 0 || d > 100)) {
      alert('Discounts must be between 0 and 100%');
      return;
    }

    // Update service
    services[currentEditingIndex].basePrice = basePrice;
    services[currentEditingIndex].seniorDiscount = senior;
    services[currentEditingIndex].pwdDiscount = pwd;
    services[currentEditingIndex].loyaltyDiscount = loyalty;
    services[currentEditingIndex].notes = editNotes.value.trim();

    saveServices();
    renderServices();
    closeModal();
  });

  // Delete service button (optional, deletes the whole service)
  deleteServiceBtn.addEventListener('click', () => {
    if (currentEditingIndex === null) return;

    if (confirm(`Delete the service "${services[currentEditingIndex].name}"?`)) {
      services.splice(currentEditingIndex, 1);
      saveServices();
      renderServices();
      closeModal();
    }
  });

  // Handle "Create Special Discount" form submission (your existing code)
  const discountForm = document.getElementById('discountForm');
  discountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(discountForm);
    const discountName = formData.get('discountName').trim();
    const discountType = formData.get('discountType');
    const discountValue = Number(formData.get('discountValue'));
    let applicableServices = formData.getAll('applicableServices');

    if (!discountName || isNaN(discountValue)) {
      alert('Please fill in the required fields correctly.');
      return;
    }

    applicableServices = applicableServices.length ? applicableServices.map(s => s.toLowerCase()) : ['all'];

    specialDiscounts.push({
      name: discountName,
      type: discountType,
      value: discountValue,
      applicableServices
    });

    saveSpecialDiscounts();
    renderServices();

    discountForm.reset();
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


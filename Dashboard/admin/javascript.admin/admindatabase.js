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


document.addEventListener("DOMContentLoaded", async () => {
  let services = [];

  const tableBody = document.querySelector("#fee-discount table tbody");
  const editModal = document.getElementById("editServiceModal");
  const specialDiscountsList = document.getElementById("specialDiscountsList");
  let currentServiceIndex = null;

  // ---------------- Firestore Helpers ----------------
  async function saveServiceToFirestore(service) {
    const docId = service.name.toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, "services", docId), service);
  }

  async function loadServicesFromFirestore() {
    services = [];
    const querySnapshot = await getDocs(collection(db, "services"));

    if (querySnapshot.empty) {
      // Add default services if Firestore is empty
      services = [
        { name: "General Consultation", basePrice: 500, seniorDiscount: 20, pwdDiscount: 20, loyaltyDiscount: 10, notes: '', discounts: [] },
        { name: "Vaccination", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 5, notes: '', discounts: [] },
        { name: "Surgery (Minor)", basePrice: 3000, seniorDiscount: 10, pwdDiscount: 10, loyaltyDiscount: 5, notes: '', discounts: [] },
        { name: "Grooming", basePrice: 800, seniorDiscount: 15, pwdDiscount: 15, loyaltyDiscount: 10, notes: '', discounts: [] }
      ];

      for (const s of services) {
        await saveServiceToFirestore(s);
      }
    } else {
      querySnapshot.forEach(docSnap => services.push(docSnap.data()));
    }

    renderServices();
  }

  // ---------------- Rendering ----------------
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

  // ---------------- Edit Modal ----------------
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

    specialDiscountsList.onclick = async (e) => {
      if (e.target.tagName === "BUTTON") {
        const discountIndex = e.target.dataset.discountIndex;
        service.discounts.splice(discountIndex, 1);
        await saveServiceToFirestore(service);
        renderServiceDiscounts(service);
        renderServices();
      }
    };
  }

  document.getElementById("saveServiceChanges").addEventListener("click", async () => {
    if (currentServiceIndex !== null) {
      const service = services[currentServiceIndex];
      service.basePrice = parseFloat(document.getElementById("editBasePrice").value);
      service.seniorDiscount = parseFloat(document.getElementById("editSeniorDiscount").value);
      service.pwdDiscount = parseFloat(document.getElementById("editPwdDiscount").value);
      service.loyaltyDiscount = parseFloat(document.getElementById("editLoyaltyDiscount").value);
      service.notes = document.getElementById("editNotes").value;

      await saveServiceToFirestore(service);
      renderServices();
      editModal.style.display = "none";
    }
  });

  // ---------------- Discounts ----------------
  document.getElementById("discountForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const discount = {
      name: formData.get("discountName"),
      type: formData.get("discountType"),
      value: parseFloat(formData.get("discountValue")),
      applicableServices: formData.getAll("applicableServices"),
    };

    for (const s of services) {
      if (discount.applicableServices.includes("all") ||
          discount.applicableServices.includes(s.name.toLowerCase().split(" ")[0])) {
        s.discounts.push(discount);
        await saveServiceToFirestore(s);
      }
    }

    renderServices();
    e.target.reset();
  });

  // ---------------- Initial Load ----------------
  await loadServicesFromFirestore();
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
  let todaysEarnings = 0;

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

      // ✅ Count today's scheduled appointments
      if (displayData.date === today) {
        totalAppointmentsToday++;
      }

      // ✅ Count finished appointments
      if (status.toLowerCase() === "completed") {
        finishedAppointmentsCount++;
       
        // 🟢 Add to today's earnings only if completed today
if (displayData.date === today) {
  let amount = data.totalAmount || 0;
  if (typeof amount === "string") {
    amount = amount.replace(/[^\d.-]/g, ""); // remove ₱ and commas
  }
  todaysEarnings += Number(amount) || 0;
}

      }

      // ✅ Count walk-ins
      if (type === "walkin") {
        walkInCount++;
      }

      // ✅ Count pending and cancelled (all time)
      if (status.toLowerCase() === "pending") {
        pendingAppointmentsToday++;
      }
      if (status.toLowerCase() === "cancelled") {
        cancelledAppointmentsToday++;
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

      // Appointment table
      if (appointmentTable) {
        const normalizedStatus = (status || "Pending").toLowerCase();
        let actionButtons = "";

        if (normalizedStatus === "pending") {
          actionButtons = `
            <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
            <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
            <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
            <button class="btn screenshot" data-id="${docId}" data-type="${type}">View Screenshot</button>
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
        
          } else if (normalizedStatus === "for-rescheduling") {
    actionButtons = `
      <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
      <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
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

      // History table
      if (historyTable) {
        const totalAmount = data.totalAmount || 0;
        const normalizedStatus = (status || "Pending").toLowerCase();

        const historyRow = document.createElement("tr");
        historyRow.innerHTML = `
          <td>${displayData.date}</td>
          <td>${displayData.time}</td>
          <td>${displayData.name}</td>
          <td>${displayData.petName}</td>
          <td>${displayData.service}</td>
          <td>${totalAmount}</td>
          <td class="status ${normalizedStatus}">${status || "Pending"}</td>
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
      totalAppointmentsToday;
    document.querySelector(".card:nth-child(2) .numbers").textContent =
      finishedAppointmentsCount;
    document.querySelector(".card:nth-child(3) .numbers").textContent =
      walkInCount;

    document.querySelector(
      "#appointments .stat-card:nth-child(1) .stat-number"
    ).textContent = totalAppointmentsToday; // today's schedule
    document.querySelector(
      "#appointments .stat-card:nth-child(2) .stat-number"
    ).textContent = pendingAppointmentsToday; // pending
    document.querySelector(
      "#appointments .stat-card:nth-child(3) .stat-number"
    ).textContent = cancelledAppointmentsToday; // cancelled

    
// ✅ Update Today's Earnings card correctly
const earningsCard = Array.from(document.querySelectorAll(".card"))
  .find(card => card.querySelector(".cardName")?.textContent.includes("Today's Earnings"));

if (earningsCard) {
  earningsCard.querySelector(".numbers").textContent =
    "₱" + todaysEarnings.toLocaleString("en-PH");
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

  // --- INDEX PAGE LOGIC ---
function renderIndexNews() {
  const newsContainer = document.querySelector('#news .box-container');
  if (!newsContainer) return; // stop if not on index

  const newsList = JSON.parse(localStorage.getItem('newsList')) || [];

  // Only published & sort newest first
  let publishedNews = newsList.filter(n => n.status === 'published');
  publishedNews.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));

  // Take top 3 only
  publishedNews = publishedNews.slice(0, 3);

  newsContainer.innerHTML = '';

  publishedNews.forEach(news => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.innerHTML = `
      <div class="image">
        <img src="${news.image}" alt="${news.title}">
      </div>
      <div class="content">
        <div class="icons">
          <a href="#"><i class="fa-solid fa-calendar"></i> 
            ${news.publishDate ? new Date(news.publishDate).toLocaleDateString() : ''}
          </a>
          <a href="#"><i class="fas fa-user"></i> By admin</a>
        </div>
        <h3>${news.title}</h3>
        <p>${news.content}</p>
        <a href="news.html" class="btn">Learn More <span class="fas fa-chevron-right"></span></a>
      </div>
    `;
    newsContainer.appendChild(box);
  });

  // Optional: "See All News" button
  if (publishedNews.length > 0) {
    const seeAll = document.createElement('div');
    seeAll.classList.add('see-all');
    seeAll.innerHTML = `<a href="news.html" class="btn">See All News</a>`;
    newsContainer.appendChild(seeAll);
  }
}

// --- CUSTOMER PAGE LOGIC ---
function renderCustomerNews() {
  const newsContainer = document.querySelector('.cards');
  if (!newsContainer) return; // stop if not on customer/news page

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

// ✅ Run both (each will only run if container exists)
renderIndexNews();
renderCustomerNews();

// ✅ Update live if localStorage changes
window.addEventListener('storage', () => {
  renderIndexNews();
  renderCustomerNews();
});
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

  const today = new Date();
  today.setHours(0,0,0,0); // reset time part
  const currentCellDate = new Date(currentYear, currentMonth, day);

  // 🔹 Grey out past dates
  if (currentCellDate < today) {
    dayDiv.style.background = "#e0e0e0";   // light grey
    dayDiv.style.color = "#888";           // grey text
    dayDiv.style.pointerEvents = "none";   // disable clicking
  }

  // 🔹 Highlight blocked dates
  if (blockedSlots.some(b => b.date === dateStr)) {
    dayDiv.style.background = "#ffcccc";
    dayDiv.style.borderRadius = "5px";
    dayDiv.style.pointerEvents = "none";
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

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // --- Build base queries (Completed only) ---
    let appointmentQuery = query(
      collection(db, "Appointment"),
      where("status", "==", "Completed")
    );
    let walkInQuery = query(
      collection(db, "WalkInAppointment"),
      where("status", "==", "Completed")
    );

    const filters = [];

    if (category.toLowerCase() !== "all") {
      filters.push(where("service", "==", category));
    }

    if (fromDate && toDate) {
      const from = fromDate.toISOString().split("T")[0];
      const to = toDate.toISOString().split("T")[0];
      filters.push(where("date", ">=", from));
      filters.push(where("date", "<=", to));
    }

    if (filters.length > 0) {
      appointmentQuery = query(appointmentQuery, ...filters);
      walkInQuery = query(walkInQuery, ...filters);
    }

    // --- Get data from both collections ---
    const [apptSnapshot, walkInSnapshot] = await Promise.all([
      getDocs(appointmentQuery),
      getDocs(walkInQuery),
    ]);

    // --- Process both sets ---
    const processDoc = (docSnap, type) => {
      const data = docSnap.data();

      // 🟢 use totalAmount as price
      let amount = data.totalAmount || 0;
      if (typeof amount === "string") {
        amount = amount.replace(/[^\d.-]/g, ""); // remove ₱, commas
      }
      amount = Number(amount) || 0;

      const saleDate = data.createdAt?.toDate
        ? data.createdAt.toDate()
        : (data.date ? new Date(data.date) : null);

      const serviceType =
        type === "walkin"
          ? data.serviceType || "Walk-In"
          : data.service || "Appointment";

      totalRevenue += amount;
      totalServices += 1;

      rows.push({
        date: saleDate ? saleDate.toLocaleDateString() : "N/A",
        type: serviceType,
        revenue: amount,
        avg: amount,
        growth: "N/A",
      });
    };

    apptSnapshot.forEach(doc => processDoc(doc, "appointment"));
    walkInSnapshot.forEach(doc => processDoc(doc, "walkin"));

    // --- Save combined report to Firestore ---
    await addDoc(collection(db, "SalesReport"), {
      reportType,
      category,
      fromDate: fromDate || null,
      toDate: toDate || null,
      totalRevenue,
      totalServices,
      createdAt: serverTimestamp(),
      details: rows,
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

    // ✅ Update services completed & revenues locally
    document.getElementById("servicesCompleted").textContent =
      totalServices.toLocaleString();
    document.getElementById("todayRevenue").textContent =
      "₱" + totalRevenue.toLocaleString();

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




  //Pet-Management//

     let allPets = [];
    let filteredPets = [];

    // DOM Elements
    const addPetForm = document.getElementById('addPetForm');
    const editPetForm = document.getElementById('editPetForm');
    const petsTableBody = document.getElementById('petsTableBody');
    const editPetModal = document.getElementById('editPetModal');
    const viewPetModal = document.getElementById('viewPetModal');
    const searchPetName = document.getElementById('searchPetName');
    const searchOwnerName = document.getElementById('searchOwnerName');
    const filterSpecies = document.getElementById('filterSpecies');

    // Statistics elements
    const totalPetsCount = document.getElementById('totalPetsCount');
    const activePetsCount = document.getElementById('activePetsCount');
    const recentPetsCount = document.getElementById('recentPetsCount');
    const upcomingAppointmentsCount = document.getElementById('upcomingAppointmentsCount');

    async function getWalkInOwners() {
  const ownersMap = {};
  const snap = await getDocs(collection(db, "WalkInAppointment"));
  snap.forEach(docSnap => {
    const data = docSnap.data();
    ownersMap[docSnap.id] = data.ownerName || "N/A";  // map ownerId → ownerName
  });
  return ownersMap;
}

   async function loadAllPets() {
  try {
    allPets = [];

    // get all WalkInAppointment owners first
    const ownersMap = await getWalkInOwners();

    
   // Get Pets
const petsSnap = await getDocs(collection(db, "Pets"));
petsSnap.forEach((docSnap) => {
  const data = docSnap.data();
  allPets.push({
    id: docSnap.id,
    collection: "Pets",
    ownerName: data.ownerId || "N/A", // <- use ownerId directly
    ...data
  });
});


    // Get WalkInPets (they already have ownerName)
    const walkInSnap = await getDocs(collection(db, "WalkInPets"));
    walkInSnap.forEach((docSnap) => {
      allPets.push({
        id: docSnap.id,
        collection: "WalkInPets",
        ...docSnap.data()
      });
    });

    filteredPets = [...allPets];
    renderPetsTable();
    updateStatistics();
  } catch (error) {
    console.error("Error loading pets:", error);
    Swal.fire('Error', 'Failed to load pets data', 'error');
  }
}


    // Render pets table
    function renderPetsTable() {
      petsTableBody.innerHTML = '';

      if (filteredPets.length === 0) {
        petsTableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 40px; color: #666;">
              No pets found matching your criteria
            </td>
          </tr>
        `;
        return;
      }

      filteredPets.forEach(pet => {
        const row = document.createElement('tr');
        const lastVisit = pet.lastVisit || 'Never';
        const status = pet.status || 'Active';
        
        row.innerHTML = `
          <td>
            <strong>${pet.petName || 'N/A'}</strong>
          </td>
          <td>
            <span class="pet-species">${pet.species || 'N/A'}</span>
          </td>
          <td>${pet.breed || '-'}</td>
          <td>${pet.age || '-'}</td>
          <td>${pet.ownerName || 'N/A'}</td>
          <td>${pet.ownerContact || '-'}</td>
          <td>${lastVisit}</td>
          <td>
            <span class="status ${status.toLowerCase()}">${status}</span>
          </td>
          <td>
            <button class="btn-primary view-pet" data-pet-id="${pet.id}">
              <i class="fa-solid fa-eye"></i> View
            </button>
            <button class="btn-primary edit-pet" data-pet-id="${pet.id}">
              <i class="fa-solid fa-edit"></i> Edit
            </button>
            <button class="btn-danger delete-pet" data-pet-id="${pet.id}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </td>
        `;
        
        petsTableBody.appendChild(row);
      });

      attachTableEventListeners();
    }

  async function updateStatistics() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;
    let active = 0;
    let recent = 0;

    // --- Pets ---
    const petsSnap = await getDocs(collection(db, "Pets"));
    petsSnap.forEach((docSnap) => {
      total++;
      const data = docSnap.data();

      if (!data.status || data.status.toLowerCase() === "active") {
        active++;
      }

      if (data.createdAt?.toDate) {
        const createdDate = data.createdAt.toDate();
        if (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        ) {
          recent++;
        }
      }
    });

    // --- WalkInPets ---
    const walkInSnap = await getDocs(collection(db, "WalkInPets"));
    walkInSnap.forEach((docSnap) => {
      total++;
      const data = docSnap.data();

      if (!data.status || data.status.toLowerCase() === "active") {
        active++;
      }

      if (data.createdAt?.toDate) {
        const createdDate = data.createdAt.toDate();
        if (
          createdDate.getMonth() === currentMonth &&
          createdDate.getFullYear() === currentYear
        ) {
          recent++;
        }
      }
    });

    // Update cards
    totalPetsCount.textContent = total;
    activePetsCount.textContent = active;
    recentPetsCount.textContent = recent;

    // TODO: implement appointments later
    upcomingAppointmentsCount.textContent = "0";
  } catch (error) {
    console.error("Error updating statistics:", error);
    Swal.fire("Error", "Failed to update statistics", "error");
  }
}

    // Add new pet
    addPetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(addPetForm);
      const petData = {
        ownerName: formData.get('ownerName'),
        ownerContact: formData.get('ownerContact'),
        petName: formData.get('petName'),
        species: formData.get('species'),
        breed: formData.get('breed'),
        age: formData.get('age'),
        sex: formData.get('sex'),
        weight: formData.get('weight') ? parseFloat(formData.get('weight')) : null,
        size: formData.get('size'),
        color: formData.get('color'),
        medicalHistory: formData.get('medicalHistory'),
        specialNotes: formData.get('specialNotes'),
        status: 'Active',
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      try {
        // ✅ generate custom ID
    const userId = "Admin1"; // or dynamically get current logged-in admin
    const appointmentId = `${userId}_${petData.petName}_${Date.now()}`;

    // ✅ use setDoc instead of addDoc
    await setDoc(doc(db, "WalkInPets", appointmentId), petData);

        
        Swal.fire({
          title: 'Success!',
          text: 'Pet has been added successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        addPetForm.reset();
        loadAllPets();
      } catch (error) {
        console.error("Error adding pet:", error);
        Swal.fire('Error', 'Failed to add pet. Please try again.', 'error');
      }
    });

    // Attach event listeners to table buttons
    function attachTableEventListeners() {
      // View pet buttons
      document.querySelectorAll('.view-pet').forEach(button => {
        button.addEventListener('click', (e) => {
          const petId = e.target.closest('button').dataset.petId;
          showPetDetails(petId);
        });
      });

      // Edit pet buttons
      document.querySelectorAll('.edit-pet').forEach(button => {
        button.addEventListener('click', (e) => {
          const petId = e.target.closest('button').dataset.petId;
          openEditPetModal(petId);
        });
      });

      // Delete pet buttons
      document.querySelectorAll('.delete-pet').forEach(button => {
        button.addEventListener('click', (e) => {
          const petId = e.target.closest('button').dataset.petId;
          deletePet(petId);
        });
      });
    }

    // Show pet details in modal
    function showPetDetails(petId) {
      const pet = allPets.find(p => p.id === petId);
      if (!pet) return;

      const detailsContent = document.getElementById('petDetailsContent');
      const createdDate = pet.createdAt?.toDate ? pet.createdAt.toDate().toLocaleDateString() : 'Unknown';
      const lastUpdated = pet.lastUpdated?.toDate ? pet.lastUpdated.toDate().toLocaleDateString() : 'Unknown';

      detailsContent.innerHTML = `
        <div class="pet-card">
          <div class="pet-header">
            <div class="pet-name">${pet.petName || 'N/A'}</div>
            <div class="pet-species">${pet.species || 'N/A'}</div>
          </div>
          
          <div class="pet-details">
            <div class="pet-detail">
              <div class="pet-detail-label">Owner</div>
              <div class="pet-detail-value">${pet.ownerName || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Contact</div>
              <div class="pet-detail-value">${pet.ownerContact || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Breed</div>
              <div class="pet-detail-value">${pet.breed || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Age</div>
              <div class="pet-detail-value">${pet.age || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Sex</div>
              <div class="pet-detail-value">${pet.sex || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Weight</div>
              <div class="pet-detail-value">${pet.weight ? pet.weight + ' kg' : 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Size</div>
              <div class="pet-detail-value">${pet.size || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Color</div>
              <div class="pet-detail-value">${pet.color || 'N/A'}</div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Status</div>
              <div class="pet-detail-value">
                <span class="status ${(pet.status || 'active').toLowerCase()}">${pet.status || 'Active'}</span>
              </div>
            </div>
            <div class="pet-detail">
              <div class="pet-detail-label">Registered</div>
              <div class="pet-detail-value">${createdDate}</div>
            </div>
          </div>
          
          ${pet.medicalHistory ? `
            <div style="margin-top: 20px;">
              <div class="pet-detail-label">Medical History</div>
              <div class="pet-detail-value" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 5px;">
                ${pet.medicalHistory}
              </div>
            </div>
          ` : ''}
          
          ${pet.specialNotes ? `
            <div style="margin-top: 15px;">
              <div class="pet-detail-label">Special Notes</div>
              <div class="pet-detail-value" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 5px;">
                ${pet.specialNotes}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      viewPetModal.classList.add('show');
    }

    // Open edit pet modal
    function openEditPetModal(petId) {
      const pet = allPets.find(p => p.id === petId);
      if (!pet) return;

      // Populate form fields
      document.getElementById('editPetId').value = pet.id;
      document.getElementById('editOwnerName').value = pet.ownerName || '';
      document.getElementById('editOwnerContact').value = pet.ownerContact || '';
      document.getElementById('editPetName').value = pet.petName || '';
      document.getElementById('editSpecies').value = pet.species || '';
      document.getElementById('editBreed').value = pet.breed || '';
      document.getElementById('editAge').value = pet.age || '';
      document.getElementById('editSex').value = pet.sex || '';
      document.getElementById('editWeight').value = pet.weight || '';
      document.getElementById('editSize').value = pet.size || '';
      document.getElementById('editColor').value = pet.color || '';
      document.getElementById('editMedicalHistory').value = pet.medicalHistory || '';
      document.getElementById('editSpecialNotes').value = pet.specialNotes || '';

      editPetModal.classList.add('show');
    }

    // Save pet changes
    document.getElementById('savePetChanges').addEventListener('click', async () => {
      const petId = document.getElementById('editPetId').value;
      
      const updatedData = {
        ownerName: document.getElementById('editOwnerName').value,
        ownerContact: document.getElementById('editOwnerContact').value,
        petName: document.getElementById('editPetName').value,
        species: document.getElementById('editSpecies').value,
        breed: document.getElementById('editBreed').value,
        age: document.getElementById('editAge').value,
        sex: document.getElementById('editSex').value,
        weight: document.getElementById('editWeight').value ? parseFloat(document.getElementById('editWeight').value) : null,
        size: document.getElementById('editSize').value,
        color: document.getElementById('editColor').value,
        medicalHistory: document.getElementById('editMedicalHistory').value,
        specialNotes: document.getElementById('editSpecialNotes').value,
        lastUpdated: serverTimestamp()
      };

      try {
       await updateDoc(doc(db, pet.collection, petId), updatedData);
        
        Swal.fire({
          title: 'Success!',
          text: 'Pet information updated successfully',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        editPetModal.classList.remove('show');
        loadAllPets();
      } catch (error) {
        console.error("Error updating pet:", error);
        Swal.fire('Error', 'Failed to update pet information. Please try again.', 'error');
      }
    });

    // Delete pet
    function deletePet(petId) {
      const pet = allPets.find(p => p.id === petId);
      if (!pet) return;

      Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${pet.petName}? This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
           await deleteDoc(doc(db, pet.collection, petId));
            
            Swal.fire({
              title: 'Deleted!',
              text: 'Pet has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });

            loadAllPets();
          } catch (error) {
            console.error("Error deleting pet:", error);
            Swal.fire('Error', 'Failed to delete pet. Please try again.', 'error');
          }
        }
      });
    }

    // Search and filter functionality
    function filterPets() {
      const petNameSearch = searchPetName.value.toLowerCase().trim();
      const ownerNameSearch = searchOwnerName.value.toLowerCase().trim();
      const speciesFilter = filterSpecies.value;

      filteredPets = allPets.filter(pet => {
        const matchesPetName = !petNameSearch || 
          (pet.petName && pet.petName.toLowerCase().includes(petNameSearch));
        
        const matchesOwnerName = !ownerNameSearch || 
          (pet.ownerName && pet.ownerName.toLowerCase().includes(ownerNameSearch));
        
        const matchesSpecies = !speciesFilter || pet.species === speciesFilter;

        return matchesPetName && matchesOwnerName && matchesSpecies;
      });

      renderPetsTable();
    }

    
    // Search button event
    document.getElementById('searchBtn').addEventListener('click', filterPets);

    // Clear search button event
    document.getElementById('clearSearchBtn').addEventListener('click', () => {
      searchPetName.value = '';
      searchOwnerName.value = '';
      filterSpecies.value = '';
      filteredPets = [...allPets];
      renderPetsTable();
    });

    // Real-time search as user types
    searchPetName.addEventListener('input', filterPets);
    searchOwnerName.addEventListener('input', filterPets);
    filterSpecies.addEventListener('change', filterPets);

    // Modal close functionality
    document.querySelectorAll('.close, #cancelEditPet, #closePetDetails').forEach(element => {
      element.addEventListener('click', () => {
        editPetModal.classList.remove('show');
        viewPetModal.classList.remove('show');
      });
    });

    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === editPetModal) {
        editPetModal.classList.remove('show');
      }
      if (e.target === viewPetModal) {
        viewPetModal.classList.remove('show');
      }
    });


    onSnapshot(collection(db, "Pets"), () => {
  loadAllPets();
});

onSnapshot(collection(db, "WalkInPets"), () => {
  loadAllPets();
});

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', () => {
      loadAllPets();
    });

    // Export functions for external use (if needed)
    window.petManagement = {
      loadAllPets,
      filterPets,
      showPetDetails,
      openEditPetModal,
      deletePet
    };

    
  
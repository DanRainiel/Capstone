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
      deleteDoc,
     
      writeBatch,  // ✅ needed for changing user status
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
  async function saveServiceToServicesCollection(service) {
    const docId = service.name.toLowerCase().replace(/\s+/g, '-');
    await setDoc(doc(db, "Services", docId), service);
  }

  async function loadServicesFromServicesCollection() {
    services = [];
    const querySnapshot = await getDocs(collection(db, "Services"));

    if (querySnapshot.empty) {
      console.log("⚙️ Firestore 'Services' empty — seeding servicePrices with variants...");

      const servicePrices = {
        vaccination: {
          "5n1": { small: 500, medium: 500, large: 500 },
          "8in1": { small: 600, medium: 600, large: 600 },
          "Kennel Cough": { small: 500, medium: 500, large: 500 },
          "4n1": { small: 950, medium: 950, large: 950, cat: 950 },
          "Anti-Rabies": { small: 350, medium: 350, large: 350, cat: 350 }
        },
        grooming: { basic: { small: 450, medium: 600, large: 800, cat: 600 } },
        consultation: { regular: { small: 350, medium: 350, large: 350, cat: 350 } },
        treatment: {
          tickFlea: { small: 650, medium: 700, large: 800 },
          heartwormPrevention: { small: 2000, medium: 2500, large: 3000, xl: 4500 },
          catTickFleaDeworm: { small: 650, large: 750 }
        },
        deworming: { regular: { small: 200, medium: 300, large: 400, cat: 300 } },
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

      for (const [serviceName, variants] of Object.entries(servicePrices)) {
        const docData = {
          name: serviceName,
          variants: variants,
          loyaltyDiscount: 10, // default 10%
          notes: "",
          discounts: []
        };
        await saveServiceToServicesCollection(docData);
        services.push(docData);
      }

    } else {
      console.log("✅ Existing services found — loading from 'Services' collection...");
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        services.push({
          name: data.name || docSnap.id,
          loyaltyDiscount: data.loyaltyDiscount !== undefined ? data.loyaltyDiscount : 10,
          notes: data.notes || "",
          discounts: data.discounts || [],
          variants: data.variants || {}
        });
      });
    }

    renderServices();
  }

  // ---------------- Rendering ----------------
  function renderServices() {
    tableBody.innerHTML = "";

    services.forEach((s, serviceIndex) => {
      const discountList = s.discounts.length > 0
        ? s.discounts.map(d => `${d.name} (${d.type === "percentage" ? d.value + "%" : "₱" + d.value})`).join(", ")
        : "None";

      // Parent row
      const parentRow = document.createElement("tr");
      parentRow.innerHTML = `
        <td><strong>${s.name}</strong></td>
        <td>${s.loyaltyDiscount}%</td>
        <td>${discountList}</td>
        <td><button class="btn-primary edit-service-btn" data-index="${serviceIndex}">Edit</button></td>
      `;
      tableBody.appendChild(parentRow);

      // Variant rows
      if (s.variants) {
        for (const [variantName, variantData] of Object.entries(s.variants)) {
          const variantRow = document.createElement("tr");
          variantRow.classList.add("variant-row");
          variantRow.innerHTML = `
            <td style="padding-left: 30px;">- ${variantName}</td>
            <td colspan="3">
              ${typeof variantData === "object"
                ? Object.entries(variantData)
                    .map(([size, price]) => `${size}: ₱${price}`)
                    .join(" | ")
                : `₱${variantData}`
              }
            </td>
          `;
          tableBody.appendChild(variantRow);
        }
      }
    });

    document.querySelectorAll(".edit-service-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const index = e.target.dataset.index;
        openEditModal(index);
      });
    });
  }

function openEditModal(serviceIndex) {
  const service = services[serviceIndex];
  currentServiceIndex = serviceIndex;

  document.getElementById("editServiceName").value = service.name;
  document.getElementById("editLoyaltyDiscount").value = service.loyaltyDiscount;

  const variantContainer = document.getElementById("specialDiscountsList");
  variantContainer.innerHTML = "<h3>Variants & Prices</h3>";

  for (const [variantName, variantData] of Object.entries(service.variants)) {
    const div = document.createElement("div");
    div.style.marginBottom = "12px";

    // Add the variant name as a heading
    const variantTitle = document.createElement("strong");
    variantTitle.textContent = variantName;
    div.appendChild(variantTitle);

    // Container for the inputs
    const inputsContainer = document.createElement("div");
    inputsContainer.style.marginTop = "4px";
    inputsContainer.style.display = "flex";
    inputsContainer.style.flexDirection = "column"; // Stack vertically

    if (typeof variantData === "object") {
      for (const [size, price] of Object.entries(variantData)) {
        const inputDiv = document.createElement("div");
        inputDiv.style.marginBottom = "4px";

        inputDiv.innerHTML = `${size}: <input type="number" class="modal-variant-input" 
                          data-variant-name="${variantName}" data-size="${size}" 
                          value="${price}" min="0" step="0.01">`;

        inputsContainer.appendChild(inputDiv);
      }
    } else {
      // Single price
      const inputDiv = document.createElement("div");
      inputDiv.innerHTML = `<input type="number" class="modal-variant-input" 
                          data-variant-name="${variantName}" value="${variantData}" 
                          min="0" step="0.01">`;
      inputsContainer.appendChild(inputDiv);
    }

    div.appendChild(inputsContainer);
    variantContainer.appendChild(div);
  }

  editModal.style.display = "block";
}


  document.getElementById("saveServiceChanges").addEventListener("click", async () => {
    if (currentServiceIndex === null) return;
    const service = services[currentServiceIndex];


    service.loyaltyDiscount = parseFloat(document.getElementById("editLoyaltyDiscount").value);

    // Update variant prices
    document.querySelectorAll(".modal-variant-input").forEach(input => {
      const variantName = input.dataset.variantName;
      const size = input.dataset.size;
      const value = parseFloat(input.value);

      if (size) {
        service.variants[variantName][size] = value;
      } else {
        service.variants[variantName] = value;
      }
    });

    await saveServiceToServicesCollection(service);
    renderServices();
    editModal.style.display = "none";
  });


  // ================================
// 🔹 Load Services for Discount Form
// ================================
async function loadServiceCheckboxes() {
  const container = document.getElementById("applicableServicesContainer");
  if (!container) return;

  // Fetch services from Firestore
  const servicesSnapshot = await getDocs(collection(db, "Services"));

  servicesSnapshot.forEach(docSnap => {
    const service = docSnap.data();

    // Create checkbox for each service
    const label = document.createElement("label");
    label.classList.add("applicable-checkbox");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "applicableServices";
    input.value = service.name.toLowerCase().split(" ")[0]; // key for matching later

    const text = document.createTextNode(" " + service.name);

    label.appendChild(input);
    label.appendChild(text);
    container.appendChild(label);
  });
}

// Call this when page loads
await loadServicesFromServicesCollection();
await loadServiceCheckboxes();

  document.querySelector("#editServiceModal .close").addEventListener("click", () => {
    editModal.style.display = "none";
  });

  document.getElementById("cancelEdit").addEventListener("click", () => {
    editModal.style.display = "none";
  });

  // ---------------- Discounts ----------------
  document.getElementById("discountForm").addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const discount = {
      name: formData.get("discountName"),
      type: formData.get("discountType"),
      value: parseFloat(formData.get("discountValue")),
      applicableServices: formData.getAll("applicableServices"),
      validFrom: formData.get("validFrom") || null,
      validUntil: formData.get("validUntil") || null,
      createdAt: new Date().toISOString()
    };

    for (const s of services) {
      const key = s.name.toLowerCase().split(" ")[0];
      if (discount.applicableServices.includes("all") || discount.applicableServices.includes(key)) {
        if (!s.discounts) s.discounts = [];
        s.discounts.push(discount);
        await saveServiceToServicesCollection(s);
      }
    }

    renderServices();
    e.target.reset();
  });

  // ---------------- Initial Load ----------------
  await loadServicesFromServicesCollection();

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

    // ✅ Run once to set default status for WalkIns
async function setDefaultWalkInStatus() {
  const walkInSnapshot = await getDocs(collection(db, "WalkInAppointment"));
  walkInSnapshot.forEach(async (docSnap) => {
    const data = docSnap.data();
    if (!data.status) {   // if no status exists
      await updateDoc(doc(db, "WalkInAppointment", docSnap.id), {
        status: "Pending"
      });
      console.log(`Updated Walk-In ${docSnap.id} with status: Pending`);
    }
  });
}
setDefaultWalkInStatus(); // call it once on load
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
// ============================================
// CRITICAL TIME FORMAT FIXES
// Changed from single "time" to "startTime" and "endTime"
// ============================================

// 🔹 FIX 1: View Appointment Modal (Line ~560)
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        // ✅ Fixed: Use startTime - endTime format
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

// 🔹 FIX 2: Edit Appointment Modal (Line ~590)
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit")) {
    const docId = e.target.getAttribute("data-id");
    const type = e.target.getAttribute("data-type");

    try {
      const docRef = doc(db, type === "walkin" ? "WalkInAppointment" : "Appointment", docId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        // ✅ Fixed: Display and edit startTime & endTime
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
          // ✅ Save both startTime and endTime
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

// 🔹 FIX 3: Reschedule Modal (Line ~650)
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

        // ✅ Split the time value to get start and end times
        const [startTime, endTime] = timeValue.split("|");
        return { date, startTime, endTime };
      }
    });

    if (!formValues) return;

    try {
      // ✅ Update with both startTime and endTime
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

// 🔹 FIX 4: View Pet Details Modal (Line ~720)
async function viewAppointmentDetails(appointmentId) {
  try {
    const apptRef = doc(db, "Appointment", appointmentId);
    const apptSnap = await getDoc(apptRef);

    if (!apptSnap.exists()) {
      return Swal.fire("Not Found", "Appointment not found in database.", "warning");
    }

    const data = apptSnap.data();
    const safe = (val) => (val ? val : "—");

    // ✅ Fixed: Display startTime - endTime
    const displayTime = data.startTime && data.endTime 
      ? `${data.startTime} - ${data.endTime}` 
      : data.time || "—";

    // ✅ Fixed: Get contact number from multiple possible fields
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

// 🔹 FIX 5: View Pet Details Button Event Listener (FIXED)
// The issue is that the event listener needs to be attached correctly

// ✅ Remove the old broken event listener and replace with this:
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn.view-pet-details");
  if (!btn) return;

  // Read appointment ID from the button's data attribute
  const appointmentId = btn.dataset.appointmentId;
  const type = btn.dataset.type || "appointment";

  if (!appointmentId) {
    Swal.fire("Missing Info", "Appointment ID not found for this record.", "warning");
    return;
  }

  console.log("🔍 Opening pet details for appointment:", appointmentId, "Type:", type);
  await viewAppointmentDetails(appointmentId);
});

// ✅ Also make sure the button in renderRow has correct data attributes
// Update the button HTML in your renderRow function to:
/*
<button 
  class="btn view-pet-details" 
  data-appointment-id="${docId}" 
  data-type="${type}">
  View Pet Details
</button>
*/

// 🔹 FIX 6: Walk-In View Pet Details (if needed)
// For walk-in appointments, we need to handle them differently
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("view-pet-details")) {
    const btn = e.target;
    const docId = btn.getAttribute("data-id");
    const appointmentId = btn.getAttribute("data-appointment-id");
    const type = btn.getAttribute("data-type");

    console.log("🔍 View Pet Details clicked:", { docId, appointmentId, type });

    // Use appointmentId if available, otherwise use docId
    const idToUse = appointmentId || docId;

    if (!idToUse) {
      return Swal.fire("Error", "Cannot find appointment information.", "error");
    }

    // Determine collection based on type
    const collectionName = type === "walkin" ? "WalkInAppointment" : "Appointment";

    try {
      const docRef = doc(db, collectionName, idToUse);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return Swal.fire("Not Found", "Appointment not found.", "error");
      }

      const data = docSnap.data();
      const safe = (val) => (val ? val : "—");

      // Format time
      const displayTime = data.startTime && data.endTime 
        ? `${data.startTime} - ${data.endTime}` 
        : data.time || "—";

      // Get pet name
      const petName = data.petName || data.pet?.petName || "Unknown";

      // ✅ Fixed: Get contact number from multiple possible fields
      const contactNumber = data.contact || data.ownerNumber || data.contactNumber || "—";
      
      // ✅ Fixed: Get owner name from multiple possible fields
      const ownerName = data.name || data.ownerName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || "Unknown";

      // Try to get pet image if petId exists
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
                  <img src="${petData.petImage}" alt="${petName}"
                       style="width:120px;height:120px;border-radius:10px;object-fit:cover;">
                </div>`;
            }
          }
        } catch (e) {
          console.warn("⚠️ Could not load pet image:", e);
        }
      }

      // Display modal
      await Swal.fire({
        title: `<i class="fa-solid fa-paw"></i> Pet & Appointment Details`,
        html: `
          ${petImageHTML}
          <div style="text-align:left;line-height:1.8;">
            <h3 style="color:#4CAF50;margin-bottom:10px;">Owner Information</h3>
            <strong>Owner Name:</strong> ${ownerName}<br>
            <strong>Contact Number:</strong> ${contactNumber}<br>
            
            <h3 style="color:#4CAF50;margin-top:15px;margin-bottom:10px;">Pet Information</h3>
            <strong>Pet Name:</strong> ${safe(petName)}<br>
            <strong>Species:</strong> ${safe(data.pet?.species || data.species || data.petType)}<br>
            <strong>Breed:</strong> ${safe(data.pet?.breed || data.breed)}<br>
            <strong>Age:</strong> ${safe(data.pet?.age || data.age)}<br>
            <strong>Sex:</strong> ${safe(data.pet?.sex || data.sex || data.gender)}<br>
            <strong>Weight:</strong> ${safe(data.pet?.weight || data.weight)} kg<br>
            <strong>Size:</strong> ${safe(data.petSize || data.pet?.size || data.size)}<br>
            <strong>Color:</strong> ${safe(data.pet?.color || data.color)}<br>
            
            <h3 style="color:#4CAF50;margin-top:15px;margin-bottom:10px;">Appointment Details</h3>
            <strong>Service:</strong> ${safe(data.service || data.serviceType)}<br>
            <strong>Variant:</strong> ${safe(data.variant)}<br>
            <strong>Date:</strong> ${safe(data.date)}<br>
            <strong>Time:</strong> ${displayTime}<br>
            <strong>Status:</strong> <span class="status ${(data.status || '').toLowerCase()}">${safe(data.status)}</span><br>
            <strong>Priority:</strong> ${safe(data.priority)}<br>
            
            <h3 style="color:#4CAF50;margin-top:15px;margin-bottom:10px;">Financial Details</h3>
            <strong>Service Fee:</strong> ₱${safe(data.serviceFee || data.totalAmount)}<br>
            <strong>Applied Discounts:</strong> ${safe(data.appliedDiscounts?.join(", ") || "None")}<br>
            <strong>Total Amount:</strong> <strong style="color:#4CAF50;">₱${safe(data.totalAmount)}</strong><br>
            
            ${data.reason ? `
              <h3 style="color:#4CAF50;margin-top:15px;margin-bottom:10px;">Additional Information</h3>
              <strong>Reason for Visit:</strong> ${safe(data.reason)}<br>
            ` : ''}
            
            ${data.pet?.medicalHistory || data.medicalHistory ? `
              <strong>Medical History:</strong><br>
              <div style="background:#f5f5f5;padding:10px;border-radius:5px;margin-top:5px;">
                ${safe(data.pet?.medicalHistory || data.medicalHistory)}
              </div>
            ` : ''}
          </div>
        `,
        confirmButtonText: "Close",
        width: 650,
        confirmButtonColor: "#4CAF50"
      });

    } catch (err) {
      console.error("❌ Error loading pet details:", err);
      Swal.fire("Error", "Failed to load pet details. Please try again.", "error");
    }
  }
});

console.log("✅ All time format fixes applied successfully!");
console.log("✅ View Pet Details button listener fixed!");
console.log("✅ Contact number field mapping fixed!");
console.log("📌 Updated areas:");
console.log("   - View Appointment Modal");
console.log("   - Edit Appointment Modal");
console.log("   - Reschedule Modal");
console.log("   - View Pet Details Modal");
console.log("   - View Pet Details Button (FIXED)");
console.log("   - Contact Number Display (FIXED)");


document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn.view-pet-details");
  if (!btn) return;

  // Read appointment ID from the button itself (matches innerHTML)
  const appointmentId = btn.dataset.appointmentId;
  const type = btn.dataset.type || "appointment"; // fallback

  if (!appointmentId) {
    Swal.fire("Missing Info", "Appointment ID not found for this record.", "warning");
    return;
  }

  console.log("Viewing appointment:", appointmentId, "Type:", type);
  await viewAppointmentDetails(appointmentId);
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

      const renderRow = (data, type, docId) => {
  const status = data.status || "Pending";
  const safe = (val) => (val === undefined || val === null ? "" : val);

  // 🕒 Format time properly (start–end)
  let formattedTime = "";
  if (type === "walkin" && data.timestamp) {
    // Walk-in: derive from timestamp
    formattedTime = new Date(data.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (data.startTime && data.endTime) {
    // Regular appointment: start–end range
    formattedTime = `${safe(data.startTime)} - ${safe(data.endTime)}`;
  } else if (data.startTime) {
    formattedTime = safe(data.startTime);
  } else if (data.time) {
    // fallback if old data still uses `time`
    formattedTime = safe(data.time);
  }

  const displayData = {
    name:
      type === "walkin"
        ? `${safe(data.firstName)} ${safe(data.lastName)}`.trim()
        : safe(data.name),
    petName: safe(data.petName) || safe(data.pet?.petName),
    service: safe(data.service),
    walkinService: safe(data.serviceType),
    date:
      type === "walkin" && data.timestamp
        ? new Date(data.timestamp).toLocaleDateString()
        : safe(data.date),
    time: formattedTime, // ✅ fixed
    contact: safe(data.contact),
    status: safe(status),
    mode: type === "walkin" ? "Walk-In" : "Appointment",
    reservationType: safe(data.reservationType),
    reservationFee: safe(data.reservationFee),
    userId: safe(data.userId),
    appointmentId: docId,
    sourceType: type,
  };

      // ✅ Count finished appointments
if (status && status.toLowerCase().trim() === "completed") {
  finishedAppointmentsCount++;

  // 🟢 Always derive earnings date from completedAt
  let completionDate;
  if (data.completedAt?.seconds) {
    // Firestore Timestamp object
    const d = new Date(data.completedAt.seconds * 1000);
    completionDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  } else if (typeof data.completedAt === "string") {
    // If stored as a string
    completionDate = data.completedAt.split("T")[0].replace(/\//g, "-");
  }

  // 🕒 Normalize today's date
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // ✅ Add to today's earnings if completed today
  if (completionDate === todayStr) {
    let amount = data.totalAmount || data.serviceFee || 0;
    if (typeof amount === "string") {
      amount = amount.replace(/[^\d.-]/g, "");
    }
    const numAmount = Number(amount) || 0;
    console.log(`💰 Adding to today's earnings: ₱${numAmount} (Completed at: ${completionDate})`);
    todaysEarnings += numAmount;
  } else {
    console.log(`⏰ Skipping: completed at ${completionDate}, not today (${todayStr})`);
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

        if (dashboardTable && type !== "walkin") {
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

  if (walkInTable && type === "walkin") {
    // 🔒 If status is missing, default to "pending"
    const normalizedStatus = (status && typeof status === "string")
      ? status.toLowerCase()
      : "pending";

    let actionButtons = "";

    if (normalizedStatus === "pending") {
      actionButtons = `
        <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
        <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
      `;
    } else if (normalizedStatus === "in progress") {
      actionButtons = `
        <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
         <button class="btn view-pet-details" data-id="${docId}" data-type="${type}">View Pet Details</button>
        <button class="btn add-discount" data-id="${docId}" data-type="${type}" 
          data-service="${displayData.walkinService || displayData.serviceType}">
          Apply Discount
        </button>

      `;
    } else if (normalizedStatus === "completed") {
      actionButtons = `
        <button class="btn view" data-id="${docId}" data-type="${type}">View</button>
        <button class="btn edit" data-id="${docId}" data-type="${type}">Edit</button>
      `;
    }

    // Render row
    const dashRow = document.createElement("tr");
    dashRow.innerHTML = `
      <td>${displayData.date || ""}</td>
      <td>${displayData.time || ""}</td>
      <td>${displayData.name || displayData.firstName + " " + displayData.lastName}</td>
      <td>${displayData.petName || displayData.pet?.petName || ""}</td>
      <td>${displayData.walkinService || displayData.serviceType || ""}</td>
      <td class="status ${normalizedStatus}">${status || "Pending"}</td>
      <td>${actionButtons}</td>
    `;
    walkInTable.appendChild(dashRow);
  }

            // Appointment table
          if (appointmentTable && type !== "walkin") {
              const normalizedStatus = (status || "Pending").toLowerCase();
              let actionButtons = "";

              if (normalizedStatus === "pending") {
                actionButtons = `
                  <button class="btn accept" data-id="${docId}" data-type="${type}">Accept</button>
                  <button class="btn decline" data-id="${docId}" data-type="${type}">Decline</button>
                  <button class="btn reschedule" data-id="${docId}" data-type="${type}">Reschedule</button>
                <button class="btn screenshot" data-id="${docId}" data-type="Appointment">View Screenshot</button>
                `;
      } else if (normalizedStatus === "in progress") {
        actionButtons = `
          <button class="btn complete" data-id="${docId}" data-type="${type}">Complete</button>
      <button 
  class="btn view-pet-details" 
  data-appointment-id="${docId}" 
  data-type="${type}">
  View Pet Details
</button>

        
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
          } else if (normalizedStatus === "cancelled") {
          actionButtons = `
            <button class="btn viewreason" data-id="${docId}" data-type="${type}">View Reason</button>
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
                <td>${displayData.reservationType}</td>
              <td>${actionButtons}</td>
            `;
            appointmentTable.appendChild(fullRow);
          }

  // History table
if (historyTable && (status || "").toLowerCase() === "completed") {
  const totalAmount = data.totalAmount || 0;
  const normalizedStatus = (status || "Pending").toLowerCase();

  // Combine service + serviceType (if it exists)
  const serviceDisplay = [displayData.service, data.serviceType].filter(Boolean).join(" - ");

  const historyRow = document.createElement("tr");
  historyRow.innerHTML = `
    <td>${displayData.date}</td>
    <td>${displayData.time}</td>
    <td>${displayData.name}</td>
    <td>${displayData.petName}</td>
    <td>${serviceDisplay}</td>
    <td>${totalAmount}</td>
    <td class="status ${normalizedStatus}">${status || "Pending"}</td>
  `;
  historyTable.appendChild(historyRow);
}

      }

  // Collect all appointments first
  const allAppointments = [];

  snapshot.forEach((doc) => {
    allAppointments.push({ ...doc.data(), id: doc.id, type: "appointment" });
  });

  walkInSnapshot.forEach((doc) => {
    allAppointments.push({ ...doc.data(), id: doc.id, type: "walkin" });
  });

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

 // 📅 Listen to appointments in real-time
function listenAppointmentsRealtime() {
  const dashboardTable = document.getElementById("table-dashboard");
  const appointmentTable = document.getElementById("appointmentTable");
  const historyTable = document.getElementById("historytable");
  const walkInTable = document.getElementById("walkinTableBody");

  const today = new Date().toISOString().split("T")[0];

  // Helper functions (keep your existing renderRow, getCreatedAtFromId, etc.)
  
  // Listen to Appointment collection
  const appointmentsRef = collection(db, "Appointment");
  onSnapshot(appointmentsRef, (snapshot) => {
    const allAppointments = [];

    snapshot.forEach((doc) => {
      allAppointments.push({ ...doc.data(), id: doc.id, type: "appointment" });
    });

    // Similarly listen to WalkInAppointment
    const walkInsRef = collection(db, "WalkInAppointment");
    onSnapshot(walkInsRef, (walkInSnapshot) => {
      walkInSnapshot.forEach((doc) => {
        allAppointments.push({ ...doc.data(), id: doc.id, type: "walkin" });
      });

      // Clear tables
      if (dashboardTable) dashboardTable.innerHTML = "";
      if (appointmentTable) appointmentTable.innerHTML = "";
      if (historyTable) historyTable.innerHTML = "";
      if (walkInTable) walkInTable.innerHTML = "";

      // Sort appointments (your existing sort code)
      allAppointments.sort((a, b) => {
        const statusOrder = { pending: 1, "in progress": 2, cancelled: 98, completed: 99 };
        const aStatus = statusOrder[a.status?.toLowerCase()] || 50;
        const bStatus = statusOrder[b.status?.toLowerCase()] || 50;
        if (aStatus !== bStatus) return aStatus - bStatus;

        const aCreated = getCreatedAtFromId(a.id);
        const bCreated = getCreatedAtFromId(b.id);
        if (aCreated && bCreated) return bCreated - aCreated;

        return 0;
      });

      // Render rows
      allAppointments.forEach((apt) => {
        renderRow(apt, apt.type, apt.id);
      });
    });
  });
}

// Call this once when your page loads
listenAppointmentsRealtime();



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



  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btn.accept, .btn.decline, .btn.complete,  .btn.reschedule");
    if (!btn) return;

    const docId = btn.getAttribute("data-id");
    const type = btn.getAttribute("data-type");
    const collectionName = type === "walkin" ? "WalkInAppointment" : "Appointment";
    const docRef = doc(db, collectionName, docId);

    if (btn.classList.contains("reschedule")) {
      await rescheduleAppointment(docId); // <-- call function with id
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

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".add-discount");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    let type = btn.getAttribute("data-type") || "Appointment";

    // normalize
    if (type.toLowerCase() === "appointment") type = "Appointment";
    if (type.toLowerCase() === "walkin" || type.toLowerCase() === "walkinappointment") {
      type = "WalkInAppointment";
    }

    const docRef = doc(db, type, id);
    await openDiscountModal(docRef, type);
  });

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


// 🔎 Filter table rows by service (using column index)
document.getElementById("serviceFilter").addEventListener("change", function () {
  const filterValue = this.value.toLowerCase();
  const rows = document.querySelectorAll("#walkinTableBody tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    if (cells.length < 5) return; // safety

    const rowService = cells[4].textContent.trim().toLowerCase(); // 5th column = Service

    if (filterValue === "all" || rowService.includes(filterValue)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
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
      const q = query(collection(db, "Services"));
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
  const container = Swal.getHtmlContainer();
  if (!container) return [];
  const checkedBoxes = container.querySelectorAll(".swal2-checkbox:checked");
  return Array.from(checkedBoxes).map(cb => cb.value);
}
,
        showCancelButton: true,
        confirmButtonText: "Apply",
        cancelButtonText: "Cancel"
      });

      if (dismiss === Swal.DismissReason.cancel) return;
      if (!selectedDiscounts || selectedDiscounts.length === 0) {
        return Swal.fire("No Selection", "Please select at least one discount.", "warning");
      }

  // 🔹 Determine base price from available fields
let basePrice = 0;
if (service.basePrice) {
  basePrice = parseFloat(service.basePrice.toString().replace(/[₱,]/g, "")) || 0;
} else if (service.price) {
  basePrice = parseFloat(service.price.toString().replace(/[₱,]/g, "")) || 0;
} else if (service.serviceFee) {
  basePrice = parseFloat(service.serviceFee.toString().replace(/[₱,]/g, "")) || 0;
} else if (data.totalAmount) {
  basePrice = parseFloat(data.totalAmount.toString().replace(/[₱,]/g, "")) || 0;
}

console.log("✅ Base Price Used:", basePrice);

// 🔹 Now apply discounts correctly
let totalAmount = basePrice;
let appliedDiscounts = [];

selectedDiscounts.forEach(selected => {
  if (discountObj[selected]) {
    // Built-in discount (e.g. loyalty)
    const discountValue = parseFloat(discountObj[selected]) || 0;
    const discountPercent = discountValue / 100;
    totalAmount -= basePrice * discountPercent;
    appliedDiscounts.push(`${selected.replace("Discount", "")}: ${discountValue}%`);
  } else if (selected.startsWith("special-")) {
    // Special discount
    const idx = parseInt(selected.split("-")[1], 10);
    const d = specialDiscounts[idx];
    if (d) {
      if (d.type === "percentage") {
        totalAmount -= basePrice * (parseFloat(d.value) / 100);
        appliedDiscounts.push(`${d.name}: ${d.value}%`);
      } else {
        totalAmount -= parseFloat(d.value);
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

// 👥 Real-time Users Listener (sorted latest → oldest)
function loadAllUsers() {
  const userTable = document.getElementById("userTable");
  if (userTable) userTable.innerHTML = "";

  // 👇 orderBy joinedDate DESC
  const usersRef = query(collection(db, "users"), orderBy("joinedDate", "desc"));

  onSnapshot(usersRef, async (snapshot) => {
    if (!userTable) return;
    userTable.innerHTML = "";

    if (snapshot.empty) {
      userTable.innerHTML = "<tr><td colspan='8'>No users found.</td></tr>";
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
      if (joinedDate) {
        let joinDateObj = joinedDate.toDate ? joinedDate.toDate() : new Date(joinedDate);
        if (joinDateObj.getMonth() === currentMonth && joinDateObj.getFullYear() === currentYear) {
          newUsersThisMonth++;
        }
      }

      // ✅ Count deactivated accounts
      if (status.toLowerCase() === "inactive" || status.toLowerCase() === "deactivated") {
        deactivatedAccounts++;
      }

      // Count pets
      const petSnapshot = await getDocs(query(collection(db, "Pets"), where("userId", "==", userId)));
      const petCount = petSnapshot.size;

      // Action buttons
      let actions = `
        <button class="btn view-users" data-id="${userId}">View</button>
        <button class="btn edit-users" data-id="${userId}">Edit</button>
      `;
      actions += status === "Active"
        ? `<button class="btn deactivate" data-id="${userId}">Deactivate</button>`
        : `<button class="btn activate" data-id="${userId}">Activate</button>`;

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

    // ✅ Update stats
    document.querySelector("#user-management .stat-card:nth-child(1) .stat-number").textContent = totalUsers;
    document.querySelector("#user-management .stat-card:nth-child(2) .stat-number").textContent = newUsersThisMonth;
    document.querySelector("#user-management .stat-card:nth-child(3) .stat-number").textContent = deactivatedAccounts;

    attachUserStatusListeners();
  });
}



// 🔄 Update user status
async function updateUserStatus(userId, newStatus) {
  try {
    await updateDoc(doc(db, "users", userId), { status: newStatus });
    await logActivity("admin", `User ${newStatus}`, `User ${userId} set to ${newStatus}`);
    loadAllUsers();
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}

// 🧩 SweetAlert2 View User
async function viewUser(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return;

    const user = userDoc.data();

    Swal.fire({
      title: "User Details",
      html: `
        <table style="width:100%; text-align:left; border-collapse:collapse;">
          <tr><td><b>User ID</b></td><td>${userId}</td></tr>
          <tr><td><b>Name</b></td><td>${user.name || ""}</td></tr>
          <tr><td><b>Email</b></td><td>${user.email || ""}</td></tr>

          <tr><td><b>Status</b></td><td>${user.status || "Active"}</td></tr>
        </table>
      `,
      icon: "info",
      confirmButtonText: "Close"
    });
  } catch (err) {
    console.error("Error fetching user:", err);
  }
}

// 📝 SweetAlert2 Edit User
async function editUser(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return;

    const user = userDoc.data();

    const { value: formValues } = await Swal.fire({
      title: "Edit User",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Name" value="${user.name || ""}">
        <input id="swal-input2" class="swal2-input" placeholder="Email" value="${user.email || ""}">
        <input id="swal-input3" class="swal2-input" placeholder="Contact" value="${user.contact || ""}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => {
        return {
          name: document.getElementById("swal-input1").value,
          email: document.getElementById("swal-input2").value,
          contact: document.getElementById("swal-input3").value
        };
      }
    });

    if (formValues) {
      await updateDoc(doc(db, "users", userId), formValues);
      await logActivity("admin", "User Edited", `User ${userId} details updated`);
      Swal.fire("Updated!", "User information has been updated.", "success");
      loadAllUsers();
    }
  } catch (err) {
    console.error("Error editing user:", err);
  }
}

function attachUserStatusListeners() {
  document.querySelectorAll(".btn.deactivate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Inactive"))
  );
  document.querySelectorAll(".btn.activate").forEach(btn =>
    btn.addEventListener("click", () => updateUserStatus(btn.dataset.id, "Active"))
  );

  // Use the updated classes for users
  document.querySelectorAll(".btn.view-users").forEach(btn =>
    btn.addEventListener("click", () => viewUser(btn.dataset.id))
  );
  document.querySelectorAll(".btn.edit-users").forEach(btn =>
    btn.addEventListener("click", () => editUser(btn.dataset.id))
  );
}



  document.addEventListener("DOMContentLoaded", function () {
  const newsForm = document.getElementById('newsForm');
  const newsTableBody = document.querySelector('#news-management table tbody');
  const newsCollection = collection(db, "NEWS");

  // --- Helper: Capitalize first letter
  function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  // --- Render News Table (Admin Side)
  async function renderNewsTable() {
    const q = query(newsCollection, orderBy("priority"));
    const querySnapshot = await getDocs(q);
    newsTableBody.innerHTML = "";

    querySnapshot.forEach((docSnap) => {
      const news = docSnap.data();
      const id = docSnap.id;
      const isDraft = news.status === "draft";

      const tr = document.createElement("tr");
      tr.dataset.id = id;
      tr.innerHTML = `
        <td>${news.title}</td>
        <td>${capitalize(news.category)}</td>
        <td>${news.publishDate ? new Date(news.publishDate).toLocaleDateString() : "-"}</td>
        <td><span class="status ${isDraft ? 'pending' : 'completed'}">${isDraft ? 'Draft' : 'Published'}</span></td>
        <td>
          <button class="btn-primary edit-btn">Edit</button>
          ${isDraft
            ? `<button class="btn-primary publish-btn">Publish</button>`
            : `<button class="btn-primary view-btn">View</button>`}
          <button class="btn-danger delete-btn">${isDraft ? "Delete" : "Unpublish"}</button>
        </td>
      `;
      newsTableBody.appendChild(tr);
    });
  }

  // --- Add or Publish News
  if (newsForm) {
    newsForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const title = this.newsTitle.value.trim();
      const category = this.newsCategory.value;
      const priority = this.newsPriority.value;
      const content = this.newsContent.value.trim();
      const publishDate = this.publishDate.value;
      const status = "published";

      if (!title || !content) {
        Swal.fire("Error", "Title and content are required.", "error");
        return;
      }

      await addDoc(newsCollection, {
        title,
        category,
        priority,
        content,
        publishDate: publishDate || new Date().toISOString(),
        image: "/images/news2.webp",
        status,
        views: 0,
        timestamp: new Date().toISOString(),
      });

      Swal.fire("Success", "News published successfully!", "success");
      this.reset();
    });

    // --- Save as Draft
    const draftBtn = newsForm.querySelector('button[type="button"]');
    draftBtn.addEventListener("click", async function () {
      const title = newsForm.newsTitle.value.trim();
      const category = newsForm.newsCategory.value;
      const priority = newsForm.newsPriority.value;
      const content = newsForm.newsContent.value.trim();
      const publishDate = newsForm.publishDate.value;
      const status = "draft";

      if (!title || !content) {
        Swal.fire("Error", "Title and content are required to save draft.", "error");
        return;
      }

      await addDoc(newsCollection, {
        title,
        category,
        priority,
        content,
        publishDate: publishDate || null,
        image: "/images/news2.webp",
        status,
        views: 0,
        timestamp: new Date().toISOString(),
      });

      Swal.fire("Saved", "Draft saved successfully!", "success");
      newsForm.reset();
    });
  }

  // --- Delegate table actions (edit, delete, publish, view)
  if (newsTableBody) {
    newsTableBody.addEventListener("click", async function (e) {
      const btn = e.target;
      const row = btn.closest("tr");
      if (!row) return;
      const id = row.dataset.id;
      const newsRef = doc(db, "NEWS", id);

      const snapshot = await getDocs(newsCollection);
      let newsItem;
      snapshot.forEach((docSnap) => {
        if (docSnap.id === id) newsItem = { id: docSnap.id, ...docSnap.data() };
      });

      if (!newsItem) return;

      // --- DELETE / UNPUBLISH ---
      if (btn.classList.contains("delete-btn")) {
        const isDraft = newsItem.status === "draft";
        Swal.fire({
          title: isDraft ? "Delete this draft?" : "Unpublish this news?",
          text: isDraft
            ? "This draft will be removed permanently."
            : "The news will no longer be visible.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: isDraft ? "Yes, delete" : "Yes, unpublish",
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (isDraft) {
              await deleteDoc(newsRef);
            } else {
              await updateDoc(newsRef, {
                status: "draft",
                publishDate: null,
              });
            }
            Swal.fire("Done!", isDraft ? "Draft deleted." : "News unpublished.", "success");
          }
        });
      }

      // --- PUBLISH ---
      else if (btn.classList.contains("publish-btn")) {
        Swal.fire({
          title: "Publish this news?",
          text: "It will be visible to readers.",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, publish",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateDoc(newsRef, {
              status: "published",
              publishDate: new Date().toISOString(),
            });
            Swal.fire("Published!", "News is now live.", "success");
          }
        });
      }

      // --- EDIT ---
      else if (btn.classList.contains("edit-btn")) {
        Swal.fire({
          title: "Edit News",
          html: `
            <input id="swal-title" class="swal2-input" value="${newsItem.title}" placeholder="Title">
            <input id="swal-category" class="swal2-input" value="${newsItem.category}" placeholder="Category">
            <select id="swal-priority" class="swal2-input" style="margin-top:10px;">
              <option value="urgent" ${newsItem.priority === "urgent" ? "selected" : ""}>Urgent</option>
              <option value="important" ${newsItem.priority === "important" ? "selected" : ""}>Important</option>
              <option value="normal" ${newsItem.priority === "normal" ? "selected" : ""}>Normal</option>
            </select>
            <textarea id="swal-content" class="swal2-textarea" placeholder="Content">${newsItem.content || ""}</textarea>
          `,
          showCancelButton: true,
          confirmButtonText: "Save",
          preConfirm: () => {
            const newTitle = document.getElementById("swal-title").value.trim();
            const newCategory = document.getElementById("swal-category").value.trim();
            const newPriority = document.getElementById("swal-priority").value;
            const newContent = document.getElementById("swal-content").value.trim();
            if (!newTitle || !newCategory) {
              Swal.showValidationMessage("Title and Category are required!");
              return false;
            }
            return { newTitle, newCategory, newPriority, newContent };
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await updateDoc(newsRef, {
              title: result.value.newTitle,
              category: result.value.newCategory,
              priority: result.value.newPriority,
              content: result.value.newContent,
            });
            Swal.fire("Saved!", "News updated successfully.", "success");
          }
        });
      }

      // --- VIEW ---
      else if (btn.classList.contains("view-btn")) {
        Swal.fire({
          title: newsItem.title,
          html: `
            <p><b>Category:</b> ${capitalize(newsItem.category)}</p>
            <p><b>Priority:</b> ${capitalize(newsItem.priority)}</p>
            <p><b>Status:</b> ${newsItem.status === "draft" ? "Draft" : "Published"}</p>
            <p><b>Date:</b> ${newsItem.publishDate ? new Date(newsItem.publishDate).toLocaleDateString() : "-"}</p>
            <hr>
            <p>${newsItem.content || "No content available."}</p>
          `,
          icon: "info",
          confirmButtonText: "Close",
        });
      }
    });
  }

  // --- Real-time updates (live reload)
  onSnapshot(newsCollection, (snapshot) => {
    renderNewsTable();
    renderIndexNews();
    renderCustomerNews();
  });

  // --- CUSTOMER PAGE LOGIC
  async function renderCustomerNews() {
    const newsContainer = document.querySelector(".cards");
    if (!newsContainer) return;

    const querySnapshot = await getDocs(newsCollection);
    const priorityOrder = { urgent: 1, important: 2, normal: 3 };
    const published = [];

    querySnapshot.forEach((docSnap) => {
      const n = docSnap.data();
      if (n.status === "published") published.push(n);
    });

    published.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    newsContainer.innerHTML = "";

    published.forEach((n) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="image-section">
          <img src="${n.image}" alt="${n.title}">
        </div>
        <div class="content">
          <h4>${n.title}</h4>
          <p>${n.content}</p>
          <p><b>Priority:</b> ${capitalize(n.priority)}</p>
        </div>
        <div class="posted-date">
          <p>${n.publishDate ? new Date(n.publishDate).toLocaleDateString() : ""}</p>
        </div>
      `;
      newsContainer.appendChild(card);
    });
  }

  // --- INDEX PAGE LOGIC
  async function renderIndexNews() {
    const newsContainer = document.querySelector("#news .box-container");
    if (!newsContainer) return;

    const querySnapshot = await getDocs(newsCollection);
    let publishedNews = [];

    querySnapshot.forEach((docSnap) => {
      const n = docSnap.data();
      if (n.status === "published") publishedNews.push(n);
    });

    const priorityOrder = { urgent: 1, important: 2, normal: 3 };
    publishedNews = publishedNews
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
      .slice(0, 3);

    newsContainer.innerHTML = "";

    publishedNews.forEach((n) => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.innerHTML = `
        <div class="image">
          <img src="${n.image}" alt="${n.title}">
        </div>
        <div class="content">
          <div class="icons">
            <a href="#"><i class="fa-solid fa-calendar"></i>
              ${n.publishDate ? new Date(n.publishDate).toLocaleDateString() : ""}
            </a>
            <a href="#"><i class="fas fa-user"></i> By admin</a>
            <span class="priority ${n.priority}">${capitalize(n.priority)}</span>
          </div>
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          <a href="news.html" class="btn">Learn More <span class="fas fa-chevron-right"></span></a>
        </div>
      `;
      newsContainer.appendChild(box);
    });
  }
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

// 🔹 Highlight dates that have blocked slots
if (blockedSlots.some(b => b.date === dateStr)) {
  dayDiv.style.background = "#ffe0e0"; // light red
  dayDiv.style.borderRadius = "5px";
  // Still clickable!
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

 // ✅ Get vaccineType from VaccinationLabel
async function getVaccineType(appointmentId) {
  const q = query(
    collection(db, "VaccinationLabel"),
    where("appointmentId", "==", appointmentId) // match the field
  );
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    const docData = querySnap.docs[0].data();
    return docData.vaccineType || "Unknown vaccine";
  }
  return "Unknown vaccine";
}

// ✅ Build and save notification
async function createReminderNotification(docId, appointmentData, userId) {
  const vaccineType = await getVaccineType(docId);

  await addDoc(collection(db, "Notifications"), {
    appointmentId: docId,
    userId,
    type: "reminder",
    service: vaccineType, // ✅ always the vaccineType
    status: "unread",
    message: `Your appointment for ${appointmentData.petName || "your pet"} is scheduled for the ${vaccineType}.`,
    createdAt: serverTimestamp()
  });
}
   await createReminderNotification(docId, appointmentData, userId);
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


//SALES REPORT//
document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateReportBtn");
  const reportTypeEl = document.getElementById("reportType");
  const serviceCategoryEl = document.getElementById("serviceCategory");
  const reportDateFrom = document.getElementById("reportDateFrom");
  const reportDateTo = document.getElementById("reportDateTo");
  const reportTableBody = document.getElementById("reportTableBody");


 // --- Update revenue cards from SalesReport ---
async function updateRevenueCards(category = "all", reportType = "all") {
  try {
    const snapshot = await getDocs(collection(db, "SalesReport"));

    let todayRevenue = 0;
    let weekRevenue = 0;
    let monthRevenue = 0;

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

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

    if (reportType === "daily") {
      // Only today revenue
      weekRevenue = 0;
      monthRevenue = 0;
    }

    document.getElementById("todayRevenue").textContent = `₱${todayRevenue.toLocaleString()}`;
    document.getElementById("weekRevenue").textContent = `₱${weekRevenue.toLocaleString()}`;
    document.getElementById("monthRevenue").textContent = `₱${monthRevenue.toLocaleString()}`;
  } catch (err) {
    console.error("Error updating revenue cards:", err);
  }
}





// --- Disable From/To on page load ---
reportDateFrom.disabled = true;
reportDateTo.disabled = true;

// --- Toggle based on reportType selection ---
reportTypeEl.addEventListener("change", () => {
  if (reportTypeEl.value === "custom") {
    reportDateFrom.disabled = false;
    reportDateTo.disabled = false;
  } else {
    reportDateFrom.disabled = true;
    reportDateTo.disabled = true;
    reportDateFrom.value = "";
    reportDateTo.value = "";
  }
});

// ===== Initially disable export/print buttons =====
exportPdfBtn.disabled = true;
exportExcelBtn.disabled = true;
printBtn.disabled = true;


// --- Generate Report Button ---
generateBtn.addEventListener("click", async () => {
  try {
    // Disable buttons while generating
    exportPdfBtn.disabled = true;
    exportExcelBtn.disabled = true;
    printBtn.disabled = true;

    
    const reportType = reportTypeEl.value;
    const category = serviceCategoryEl.value;
    const fromDateInput = reportDateFrom.value ? new Date(reportDateFrom.value) : null;
    const toDateInput = reportDateTo.value ? new Date(reportDateTo.value) : null;

    let totalRevenue = 0;
    let totalServices = 0;
    const rows = [];

    // --- calculate start/end dates based on reportType ---
    const today = new Date();
    today.setHours(0,0,0,0); 
    let startDate = null;
    let endDate = new Date();
    endDate.setHours(23,59,59,999);

    switch(reportType) {
        case "daily":
            startDate = new Date(); startDate.setHours(0,0,0,0); break;
        case "weekly":
            startDate = new Date(); startDate.setDate(today.getDate()-6); startDate.setHours(0,0,0,0); break;
        case "monthly":
            startDate = new Date(today.getFullYear(), today.getMonth(), 1); break;
        case "yearly":
            startDate = new Date(today.getFullYear(), 0, 1); break;
        case "custom":a
            if(!fromDateInput || !toDateInput) {
                Swal.fire("Missing Dates", "Please select both From and To dates.", "warning");
                return;
            }
            startDate = new Date(fromDateInput.setHours(0,0,0,0));
            endDate = new Date(toDateInput.setHours(23,59,59,999));
            if(startDate > endDate){
                Swal.fire("Invalid Range","From Date cannot be later than To Date.","error");
                return;
            }
            break;
    }

    // --- Fetch Appointments ---
    let appointmentQuery = query(collection(db, "Appointment"), where("status","==","Completed"));
    let walkInQuery = query(collection(db, "WalkInAppointment"), where("status","==","Completed"));

    if(category.toLowerCase() !== "all"){
        appointmentQuery = query(appointmentQuery, where("service","==",category.toLowerCase()));
        walkInQuery = query(walkInQuery, where("serviceType","==",category.toLowerCase()));
    }

    const [apptSnapshot, walkInSnapshot] = await Promise.all([getDocs(appointmentQuery), getDocs(walkInQuery)]);

    const processDoc = (docSnap,type) => {
        const data = docSnap.data();
        if((data.status||"").toLowerCase() !== "completed") return;

        let amount = Number((data.totalAmount||"0").toString().replace(/[^\d.-]/g,""))||0;
        const saleDate = data.createdAt?.toDate ? data.createdAt.toDate() : (data.timestamp ? new Date(data.timestamp) : new Date());
        if(!saleDate) return;
        if(startDate && saleDate < startDate) return;
        if(endDate && saleDate > endDate) return;

        const serviceType = type==="walkin" ? data.serviceType||"Walk-In" : data.service||"Appointment";
        if(category.toLowerCase() !== "all" && serviceType.toLowerCase() !== category.toLowerCase()) return;

        totalRevenue += amount;
        totalServices += 1;

        rows.push({
            date: saleDate.toLocaleDateString(),
            type: serviceType,
            revenue: amount,
            avg: amount
        });
    };

    apptSnapshot.forEach(doc => processDoc(doc,"appointment"));
    walkInSnapshot.forEach(doc => processDoc(doc,"walkin"));

    // --- Clear old SalesReport and save new ---
    const salesSnapshot = await getDocs(collection(db,"SalesReport"));
    const batch = writeBatch(db);
    salesSnapshot.forEach(d => batch.delete(d.ref));
    await batch.commit();

    await addDoc(collection(db,"SalesReport"),{
        reportType,
        category,
        fromDate: startDate||null,
        toDate: endDate||null,
        totalRevenue,
        totalServices,
        createdAt: serverTimestamp(),
        details: rows
    });

    // --- Populate table ---
    reportTableBody.innerHTML = "";
    if(rows.length > 0){
        rows.forEach(r=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${r.date}</td>
                <td>${r.type}</td>
                <td>₱${r.revenue.toLocaleString()}</td>
                <td>₱${r.avg.toLocaleString()}</td>
            `;
            reportTableBody.appendChild(tr);
        });
    } else {
        reportTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No data found.</td></tr>`;
    }

    // --- Update stats ---
    document.getElementById("servicesCompleted").textContent = totalServices.toLocaleString();
    document.getElementById("todayRevenue").textContent = "₱"+totalRevenue.toLocaleString();
    await updateRevenueCards(category, reportType);

    // --- ✅ Enable export/print buttons and show Swal ---
    exportPdfBtn.disabled = false;
    exportExcelBtn.disabled = false;
    printBtn.disabled = false;

    Swal.fire({
        icon: "success",
        title: "Report Generated",
        text: "You can now print or export the report.",
        timer: 2500,
        showConfirmButton: false
    });

  } catch(err){
    console.error("Error generating report:", err);
    Swal.fire("Error","Failed to generate report. Check console for details.","error");
  }
});
});

// ===== External JS for Export & Print (without growth) =====

// Buttons
const exportPdfBtn = document.getElementById('exportPdfBtn');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const printBtn = document.getElementById('print-btn');

// Fetch all details from SalesReport
async function fetchSalesReportDetails() {
    const querySnapshot = await getDocs(collection(db, "SalesReport"));
    const rows = [];

    querySnapshot.forEach(doc => {
        const data = doc.data();
        const details = data.details || [];
        details.forEach(item => {
            rows.push({
                date: item.date || '',
                type: item.type || '',
                revenue: item.revenue || 0,
                avg: item.avg || 0
            });
        });
    });

    return rows;
}

// Generate HTML table dynamically
function generateTableHTML(rows) {
    let html = `<table border="1" id="reportTable" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr>
                <th>Date</th>
                <th>Service Type</th>
                <th>Revenue</th>
                <th>Average</th>
            </tr>
        </thead>
        <tbody>`;

    rows.forEach(row => {
        html += `<tr>
            <td>${row.date}</td>
            <td>${row.type}</td>
            <td>${row.revenue}</td>
            <td>${row.avg}</td>
        </tr>`;
    });

    html += `</tbody></table>`;
    return html;
}

// ===== Export to PDF =====
exportPdfBtn.addEventListener('click', async () => {
    const rows = await fetchSalesReportDetails();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 20);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generateTableHTML(rows);
    document.body.appendChild(tempDiv);

    doc.autoTable({ html: tempDiv.querySelector('#reportTable'), startY: 30 });
    doc.save('Sales_Report.pdf');

    document.body.removeChild(tempDiv);
});

// ===== Export to Excel =====
exportExcelBtn.addEventListener('click', async () => {
    const rows = await fetchSalesReportDetails();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generateTableHTML(rows);
    document.body.appendChild(tempDiv);

    const wb = XLSX.utils.table_to_book(tempDiv.querySelector('#reportTable'), { sheet: "Report" });
    XLSX.writeFile(wb, "Sales_Report.xlsx");

    document.body.removeChild(tempDiv);
});

// ===== Print Report =====
printBtn.addEventListener('click', async () => {
    const rows = await fetchSalesReportDetails();
    const tableHTML = generateTableHTML(rows);

    const newWin = window.open('', '', 'width=900,height=700');
    newWin.document.write('<html><head><title>Print Report</title></head><body>');
    newWin.document.write('<h2>Sales Report</h2>');
    newWin.document.write(tableHTML);
    newWin.document.write('</body></html>');
    newWin.document.close();
    newWin.print();
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
    petName: data.petName || "N/A",       // include petName
    sex: data.sex || "",
    breed: data.breed || "",
    size: data.size || "",
    species: data.species || "",
    weight: data.weight || "",
    status: data.status || "Active",
    createdAt: data.createdAt || new Date().toISOString(),
    ownerName: data.ownerId || data.userId || "Unknown"
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
    const status = pet.status || 'Active';
    const owner = pet.ownerName || pet.userId || "Unknown"; // fallback

    row.innerHTML = `
      <td><strong>${pet.petName || 'N/A'}</strong></td>
      <td>${owner}</td>
      <td><span class="status ${status.toLowerCase()}">${status}</span></td>
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

  // --- Filter/Search Pets ---
function filterPets() {
  const petNameSearch = searchPetName.value.toLowerCase().trim();
  const ownerNameSearch = searchOwnerName.value.toLowerCase().trim();
  const speciesFilter = filterSpecies.value;

  filteredPets = allPets.filter(pet => {
    const matchesPetName = !petNameSearch || (pet.petName && pet.petName.toLowerCase().includes(petNameSearch));
    const matchesOwnerName = !ownerNameSearch || (pet.ownerName && pet.ownerName.toLowerCase().includes(ownerNameSearch));
    const matchesSpecies = !speciesFilter || (pet.species && pet.species === speciesFilter);

    return matchesPetName && matchesOwnerName && matchesSpecies;
  });

  renderPetsTable();
}

// --- Search and Clear buttons ---
document.getElementById('searchBtn').addEventListener('click', filterPets);

document.getElementById('clearSearchBtn').addEventListener('click', () => {
  searchPetName.value = '';
  searchOwnerName.value = '';
  filterSpecies.value = '';
  filteredPets = [...allPets];
  renderPetsTable();
});

// --- Real-time search as user types ---
searchPetName.addEventListener('input', filterPets);
searchOwnerName.addEventListener('input', filterPets);
filterSpecies.addEventListener('change', filterPets);

// --- Modal close functionality ---
document.querySelectorAll('.close, #cancelEditPet, #closePetDetails').forEach(element => {
  element.addEventListener('click', () => {
    editPetModal.classList.remove('show');
    viewPetModal.classList.remove('show');
  });
});

// --- Close modal when clicking outside ---
window.addEventListener('click', (e) => {
  if (e.target === editPetModal) editPetModal.classList.remove('show');
  if (e.target === viewPetModal) viewPetModal.classList.remove('show');
});

// --- Real-time Firestore updates ---
onSnapshot(collection(db, "Pets"), () => {
  loadAllPets();  // reload both Pets and WalkInPets
});



    // Export functions for external use (if needed)
    window.petManagement = {
      loadAllPets,
      filterPets,
      showPetDetails,
      openEditPetModal,
      deletePet
    };


// 🔹 DOM References
const addSpeciesBtn = document.getElementById("addSpeciesBtn");
const speciesTable = document.getElementById("speciesTable");
const totalSpecies = document.getElementById("totalSpecies");
const activeSpecies = document.getElementById("activeSpecies");
const inactiveSpecies = document.getElementById("inactiveSpecies");

// ✅ Helper: Render breed table inside Swal
function renderBreedTableHTML(breeds = []) {
  if (breeds.length === 0) {
    return `<p style="color: gray; text-align:center;">No breeds added yet</p>`;
  }

  let tableHTML = `
    <table style="width:100%; border-collapse: collapse; margin-top:10px;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:5px; border:1px solid #ccc;">Breed Name</th>
          <th style="padding:5px; border:1px solid #ccc;">Status</th>
          <th style="padding:5px; border:1px solid #ccc;">Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  breeds.forEach((breed, index) => {
    tableHTML += `
      <tr>
        <td style="padding:5px; border:1px solid #ccc;">${breed.name}</td>
        <td style="padding:5px; border:1px solid #ccc;">${breed.status}</td>
        <td style="padding:5px; border:1px solid #ccc; text-align:center;">
          <button class="btn-delete-breed" data-index="${index}" style="color:red;">Delete</button>
        </td>
      </tr>
    `;
  });

  tableHTML += `</tbody></table>`;
  return tableHTML;
}

// ✅ Function: Add or manage breeds
async function openAddBreedModal(speciesId, speciesName, existingBreeds = []) {
  let breeds = [...(existingBreeds || [])];

  const getSwalHTML = () => `
    <div style="max-height:400px; overflow-y:auto;">
      ${renderBreedTableHTML(breeds)}
    </div>
    <hr>
    <input id="swal-breed-name" class="swal2-input" placeholder="New Breed Name">
    <select id="swal-breed-status" class="swal2-input">
      <option value="Active" selected>Active</option>
      <option value="Inactive">Inactive</option>
    </select>
  `;

  const swalInstance = await Swal.fire({
    title: `Manage Breeds for ${speciesName}`,
    html: getSwalHTML(),
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    didOpen: () => {
      // Handle delete buttons dynamically
      document.querySelectorAll(".btn-delete-breed").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const index = parseInt(e.target.dataset.index);
          breeds.splice(index, 1);
          Swal.update({ html: getSwalHTML() });
          openAddBreedModal(speciesId, speciesName, breeds); // refresh UI
        });
      });
    },
    preConfirm: () => {
      const breedName = document.getElementById("swal-breed-name").value.trim();
      const breedStatus = document.getElementById("swal-breed-status").value;

      if (breedName) {
        breeds.push({
          name: breedName,
          status: breedStatus,
          createdAt: new Date().toISOString(),
        });
      }

      return breeds;
    }
  });

  if (swalInstance.isConfirmed) {
    try {
      await updateDoc(doc(db, "Species", speciesId), { breeds });
      Swal.fire("✅ Updated!", "Breeds updated successfully.", "success");
    } catch (error) {
      console.error("Error updating breeds:", error);
      Swal.fire("❌ Error", "Failed to update breeds.", "error");
    }
  }
}

// ✅ Render Species Row
function renderSpeciesRow(docId, data) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.status}</td>
    <td>${new Date(data.createdAt?.seconds * 1000).toLocaleDateString()}</td>
    <td>
      ${
        data.status === "Active"
          ? `<button class="btn-inactive" data-id="${docId}">Inactive</button>`
          : `<span style="color: gray;">Already Inactive</span>`
      }
      <button class="btn-delete" data-id="${docId}">Delete</button>
      <button class="btn-breed" data-id="${docId}">Manage Breeds</button>
    </td>
  `;
  speciesTable.appendChild(row);

  // 🔹 Inactive button event
  const inactiveBtn = row.querySelector(".btn-inactive");
  if (inactiveBtn) {
    inactiveBtn.addEventListener("click", async () => {
      const confirm = await Swal.fire({
        title: "Mark Inactive?",
        text: "This species will be marked as Inactive.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, mark inactive"
      });

      if (confirm.isConfirmed) {
        await updateDoc(doc(db, "Species", docId), {
          status: "Inactive"
        });
        Swal.fire("Updated!", "Species marked as Inactive.", "success");
      }
    });
  }

  // 🔹 Delete button event
  const deleteBtn = row.querySelector(".btn-delete");
  deleteBtn.addEventListener("click", async () => {
    const confirm = await Swal.fire({
      title: "Delete Species?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "Species", docId));
      Swal.fire("Deleted!", "Species has been deleted.", "success");
    }
  });

  // 🔹 Manage Breeds button
  const breedBtn = row.querySelector(".btn-breed");
  if (breedBtn) {
    breedBtn.addEventListener("click", () => {
      openAddBreedModal(docId, data.name, data.breeds || []);
    });
  }
}

// ✅ Add Species (auto Active)
addSpeciesBtn.addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Add New Species",
    html: `
      <input id="swal-species-name" class="swal2-input" placeholder="Species Name">
    `,
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-species-name").value.trim();
      if (!name) {
        Swal.showValidationMessage("Species Name is required");
        return false;
      }
      return { name };
    }
  });

  if (formValues) {
    try {
      await addDoc(collection(db, "Species"), {
        name: formValues.name,
        status: "Active",
        createdAt: serverTimestamp(),
        breeds: [] // initialize empty breed list
      });
      Swal.fire("Success!", "Species added successfully.", "success");
    } catch (error) {
      console.error("Error adding species:", error);
      Swal.fire("Error", "Failed to add species.", "error");
    }
  }
});

// ✅ Real-time Listener
onSnapshot(collection(db, "Species"), (snapshot) => {
  speciesTable.innerHTML = "";
  let activeCount = 0;
  let inactiveCount = 0;

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    renderSpeciesRow(docSnap.id, data);

    if (data.status === "Active") activeCount++;
    else inactiveCount++;
  });

  totalSpecies.textContent = snapshot.size;
  activeSpecies.textContent = activeCount;
  inactiveSpecies.textContent = inactiveCount;
});




// ---------------- Load Existing Services ----------------
async function loadServices() {
  const servicesRef = collection(db, "Services");
  const snapshot = await getDocs(servicesRef);
  const tableBody = document.getElementById("servicesTable");
  tableBody.innerHTML = "";

  let total = 0, active = 0, inactive = 0;

  snapshot.forEach((docSnap) => {
    const service = docSnap.data();
    const id = docSnap.id;

    total++;

    // Default to Active if no status field
    const status = service.status || "Active";
    if (status === "Active") active++;
    else inactive++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${service.name}</td>
      <td>${service.duration || "—"}</td>
      <td>${status}</td>
      <td>
        <button class="btn-edit" data-id="${id}">Edit Duration</button>
        <button class="btn-status" data-id="${id}" data-status="${status}">
          ${status === "Active" ? "Deactivate" : "Activate"}
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("totalServices").textContent = total;
  document.getElementById("activeServices").textContent = active;
  document.getElementById("inactiveServices").textContent = inactive;

  // Edit duration
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => openDurationEditor(btn.dataset.id));
  });

  // Activate / Deactivate
  document.querySelectorAll(".btn-status").forEach((btn) => {
    btn.addEventListener("click", () =>
      toggleServiceStatus(btn.dataset.id, btn.dataset.status)
    );
  });
}

// ---------------- Edit Duration (SweetAlert) ----------------
async function openDurationEditor(serviceId) {
  const serviceDoc = doc(db, "Services", serviceId);
  const servicesRef = collection(db, "Services");
  const snapshot = await getDocs(servicesRef);
  const service = snapshot.docs.find((d) => d.id === serviceId).data();

  const { value: newDuration } = await Swal.fire({
    title: `Edit Duration for "${service.name}"`,
    input: "number",
    inputLabel: "Enter new duration (in minutes)",
    inputValue: service.duration || "",
    inputAttributes: { min: 1 },
    showCancelButton: true,
    confirmButtonText: "Save",
    cancelButtonText: "Cancel",
    inputValidator: (value) => {
      if (!value || value <= 0) return "Please enter a valid duration.";
    },
  });

  if (newDuration) {
    await updateDoc(serviceDoc, { duration: parseInt(newDuration) });
    Swal.fire("✅ Updated!", "Service duration updated successfully.", "success");
    loadServices();
  }
}

// ---------------- Activate / Deactivate Service ----------------
async function toggleServiceStatus(serviceId, currentStatus) {
  const serviceDoc = doc(db, "Services", serviceId);
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

  const confirm = await Swal.fire({
    title: `${newStatus === "Active" ? "Activate" : "Deactivate"} this service?`,
    text:
      newStatus === "Active"
        ? "This service will now be available for booking."
        : "This service will no longer appear for clients.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${newStatus.toLowerCase()} it`,
    cancelButtonText: "Cancel",
  });

  if (confirm.isConfirmed) {
    await updateDoc(serviceDoc, { status: newStatus });
    Swal.fire(
      "Done!",
      `Service has been marked as ${newStatus}.`,
      "success"
    );
    loadServices();
  }
}

// ---------------- Add New Service ----------------
document.getElementById("addServiceBtn").addEventListener("click", async () => {
  const { value: formValues } = await Swal.fire({
    title: "Add New Service",
    html: `
      <input id="swal-service-name" class="swal2-input" placeholder="Service Name">
      <input id="swal-service-duration" type="number" min="1" class="swal2-input" placeholder="Duration (in minutes)">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Service",
    cancelButtonText: "Cancel",
    preConfirm: () => {
      const name = document.getElementById("swal-service-name").value.trim();
      const duration = parseInt(document.getElementById("swal-service-duration").value);
      
      if (!name) {
        Swal.showValidationMessage("Please enter a service name");
        return false;
      }
      if (!duration || duration <= 0) {
        Swal.showValidationMessage("Please enter a valid duration");
        return false;
      }

      return { name, duration };
    },
  });

  if (formValues) {
    const { name, duration } = formValues;

    // Add to Firestore
    await addDoc(collection(db, "Services"), {
      name,
      duration,
      status: "Active",
      createdAt: serverTimestamp(),
    });

    Swal.fire("✅ Added!", "New service has been added successfully.", "success");
    loadServices();
  }
});

// ---------------- Initialize ----------------
window.addEventListener("DOMContentLoaded", loadServices);
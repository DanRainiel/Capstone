// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtDApHuFcav9QIZaJ8CDIcyI_fxcO4Kzw",
  authDomain: "fir-demo-66ae2.firebaseapp.com",
  projectId: "fir-demo-66ae2",
  storageBucket: "fir-demo-66ae2.appspot.com",
  messagingSenderId: "505962707376",
  appId: "1:505962707376:web:4fb32e2e4b04e9bca93e75",
  measurementId: "G-JYDG36FQMX"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================== LOAD APPOINTMENTS ==================
async function loadAppointments() {
  const userId = sessionStorage.getItem("userId");
  console.log("Loaded userId from sessionStorage:", userId);

  const tableBody = document.getElementById("reschedule");
  tableBody.innerHTML = "";

  if (!userId) {
    tableBody.innerHTML = "<tr><td colspan='6'>User not logged in.</td></tr>";
    return;
  }

  try {
    const q = query(collection(db, "Appointment"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='6'>No History found.</td></tr>";
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${data.name || ""}</td>
          <td>${data.petName || ""}</td>
          <td>${data.service || ""}</td>
          <td>${data.date || ""}</td>
        `;

        // ✅ Make row clickable
        row.addEventListener("click", () => {
          if (data.status.toLowerCase() === "completed") {
            Swal.fire({
              icon: 'info',
              title: 'Cannot Reschedule',
              text: 'This appointment is already completed and cannot be rescheduled.'
            });
            return;
          }
          openDetailsModal(docSnap.id, data);
        });

        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='6'>Error loading appointments.</td></tr>";
  }
}

async function openDetailsModal(docId, data) {
  const modal = document.getElementById("detailsModal");
  modal.style.display = "block";

  // Fill modal with data
  document.getElementById("detailName").textContent = data.name || "";
  document.getElementById("detailPet").textContent = data.petName || "";
  document.getElementById("detailService").textContent = data.service || "";
  document.getElementById("detailDate").textContent = data.date || "";
  modal.setAttribute("data-docid", docId);

  // ========== Get Clinic Settings ==========
  const settingsSnap = await getDocs(collection(db, "ClinicSettings"));
  if (settingsSnap.empty) {
    console.error("No ClinicSettings found");
    return;
  }
  const clinicSettings = settingsSnap.docs[0].data();

  // ========== Date input setup ==========
  const dateInput = document.getElementById("newDate");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split("T")[0];
  dateInput.value = "";

  // ========== Time Slot Dropdown ==========
  const timeSlotSelect = document.getElementById("timeSlot");
  timeSlotSelect.innerHTML = `<option value="">Select a date first</option>`;

  // helper
  function toHourMin(str) {
    const [h, m] = str.split(":").map(Number);
    return { h, m };
  }
  function formatTime(hour, minute) {
    let h = hour;
    let suffix = "AM";
    if (h >= 12) {
      suffix = "PM";
      if (h > 12) h -= 12;
    }
    return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
  }

  function generateSlots(selectedDateStr) {
    timeSlotSelect.innerHTML = "";
    const chosenDate = new Date(selectedDateStr);
    const day = chosenDate.getDay(); // 0=Sun, 6=Sat
    let startStr, endStr;

    if (day === 6 && clinicSettings.saturdayHours) {
      startStr = clinicSettings.saturdayHours.start;
      endStr = clinicSettings.saturdayHours.end;
    } else {
      startStr = clinicSettings.weekdayHours.start;
      endStr = clinicSettings.weekdayHours.end;
    }

    if (!startStr || !endStr) {
      Swal.fire({
        icon: "error",
        title: "Closed",
        text: "The clinic is closed on this day."
      });
      return;
    }

    const { h: startHour, m: startMin } = toHourMin(startStr);
    const { h: endHour, m: endMin } = toHourMin(endStr);

    const interval = 30;
    let h = startHour, m = startMin;
    while (h < endHour || (h === endHour && m < endMin)) {
      const startLabel = formatTime(h, m);
      let endH = h, endM = m + interval;
      if (endM >= 60) {
        endH++;
        endM = 0;
      }
      if (endH > endHour || (endH === endHour && endM > endMin)) break;

      const endLabel = formatTime(endH, endM);
      const label = `${startLabel} to ${endLabel}`;
      const option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      timeSlotSelect.appendChild(option);

      h = endH;
      m = endM;
    }
  }

  // regenerate when date changes
  dateInput.addEventListener("change", () => {
    generateSlots(dateInput.value);
  });
}



// ================== CLOSE MODAL ==================
function closeDetailsModal() {
  document.getElementById("detailsModal").style.display = "none";
}

window.addEventListener("click", (e) => {
  const modal = document.getElementById("detailsModal");
  if (e.target === modal) {
    closeDetailsModal();
  }
});

async function rescheduleAppointment() {
  const modal = document.getElementById("detailsModal");
  const docId = modal.getAttribute("data-docid");

  const newDate = document.getElementById("newDate").value;
  const selectedSlot = document.getElementById("timeSlot").value;

  if (!newDate) {
    Swal.fire({
      icon: "warning",
      title: "No Date Selected",
      text: "Please select a new date for your reschedule."
    });
    return;
  }

  if (!selectedSlot) {
    Swal.fire({
      icon: "warning",
      title: "No Time Slot Selected",
      text: "Please select a time slot for your reschedule."
    });
    return;
  }

  if (!docId) {
    Swal.fire({
      icon: "warning",
      title: "No appointment selected",
      text: "Please select an appointment first."
    });
    return;
  }

  try {
    const docRef = doc(db, "Appointment", docId);

    await updateDoc(docRef, {
      status: "for-rescheduling",
      newDate: newDate,
      newTimeSlot: selectedSlot
    });

    Swal.fire({
      icon: "success",
      title: "Marked for Rescheduling",
      text: `Your appointment has been marked for rescheduling on ${newDate} at ${selectedSlot}.`
    });

    closeDetailsModal();
    loadAppointments();
  } catch (error) {
    console.error("Error updating appointment:", error);
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "There was a problem updating the appointment status."
    });
  }
}


// ================== EVENT LISTENERS ==================
window.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
  document.querySelector(".close-btn").addEventListener("click", closeDetailsModal);
  document.querySelector(".resched-btn").addEventListener("click", rescheduleAppointment);
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc
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
// Load Profile and Pets
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const profilePageEl = document.getElementById("account-username");
  const storedName = sessionStorage.getItem("username");
  if (profilePageEl && storedName) profilePageEl.textContent = storedName;

  const profileEmailEl = document.getElementById("account-email");
  const storedEmail = sessionStorage.getItem("email");
  if (profileEmailEl && storedEmail) profileEmailEl.textContent = storedEmail;

  loadPets();
});

// ==============================
// Load Pets List
// ==============================
async function loadPets() {
  const ownerId = sessionStorage.getItem("userId");
  const container = document.querySelector('.container-pet');
  container.innerHTML = '';

  const petsList = document.createElement('div');
  petsList.classList.add('pets-list');

  const petForm = petFormElement(); // keep form always visible

  if (!ownerId) {
    console.error("No ownerId in sessionStorage.");
    container.appendChild(petsList);
    container.appendChild(petForm);
    return;
  }

  try {
    const q = query(collection(db, "Pets"), where("ownerId", "==", ownerId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const petId = docSnap.id;

      const petCard = document.createElement('div');
      petCard.classList.add('profile-pet');
      petCard.innerHTML = `
        <div class="profile-header-pet">
          <i class="fa-solid fa-paw profile-icon"></i>
          <div class="profile-text-container-pet">
            <span class="name"><strong>${data.petName || 'Unnamed Pet'}</strong></span>
            <p class="email"><strong>${data.breed || data.species || ''}</strong></p>
          </div>
        </div>
      `;

      // 🟡 When clicked, fill the form with that pet’s data instead of replacing the container
      petCard.addEventListener('click', () => fillPetForm(petId));

      petsList.appendChild(petCard);
    });

    container.appendChild(petsList);
    container.appendChild(petForm);
  } catch (error) {
    console.error("Error loading pets:", error);
    container.appendChild(petsList);
    container.appendChild(petForm);
  }
}

// ==============================
// Create Pet Form (for editing)
// ==============================
function petFormElement() {
  const form = document.createElement('form');
  form.classList.add('account');
  form.innerHTML = `
    <div class="account-header">
      <h1 class="account-title">Pet Details</h1>
      <div class="btn-container">
        <button type="submit" class="btn-save">Update</button>
        <button type="button" class="btn-cancel" id="resetForm">Cancel</button>
      </div>
    </div>
    <div class="account-edit">
      <div class="input-container"><label>Pet Name</label><input type="text" id="petName"></div>
      <div class="input-container"><label>Breed</label><input type="text" id="breed"></div>
      <div class="input-container"><label>Species</label><input type="text" id="species"></div>
      <div class="input-container"><label>Sex</label><input type="text" id="sex"></div>
      <div class="input-container"><label>Weight</label><input type="text" id="weight"></div>
      <div class="input-container"><label>Size</label><input type="text" id="size"></div>
      <div class="input-container"><label>Created At</label><input type="text" id="createdAt" disabled></div>
    </div>
  `;

  // 🔹 Handle update
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedPetId = form.getAttribute("data-pet-id");
    if (!selectedPetId) {
      Swal.fire({
        icon: 'warning',
        title: 'No Pet Selected',
        text: 'Please select a pet to update.',
      });
      return;
    }

    const updatedData = {
      petName: document.getElementById('petName').value.trim(),
      breed: document.getElementById('breed').value.trim(),
      species: document.getElementById('species').value.trim(),
      sex: document.getElementById('sex').value.trim(),
      weight: document.getElementById('weight').value.trim(),
      size: document.getElementById('size').value.trim(),
    };

    try {
      const petRef = doc(db, "Pets", selectedPetId);
      await setDoc(petRef, updatedData, { merge: true });

      Swal.fire({
        icon: 'success',
        title: 'Pet Updated',
        text: `${updatedData.petName} details have been updated successfully!`,
      });

      loadPets();
    } catch (error) {
      console.error("Error updating pet:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'There was a problem updating pet details.',
      });
    }
  });

  // 🔹 Reset form
  form.querySelector('#resetForm').addEventListener('click', () => {
    form.reset();
    form.removeAttribute('data-pet-id');
  });

  return form;
}

// ==============================
// Fill Form With Pet Data
// ==============================
async function fillPetForm(petId) {
  try {
    const docSnap = await getDoc(doc(db, "Pets", petId));
    if (!docSnap.exists()) return;

    const data = docSnap.data();

    document.querySelector('form.account').setAttribute('data-pet-id', petId);

    document.getElementById('petName').value = data.petName || '';
    document.getElementById('breed').value = data.breed || '';
    document.getElementById('species').value = data.species || '';
    document.getElementById('sex').value = data.sex || '';
    document.getElementById('weight').value = data.weight || '';
    document.getElementById('size').value = data.size || '';
    document.getElementById('createdAt').value = data.createdAt || '';
  } catch (error) {
    console.error("Error filling pet form:", error);
  }
}
// ==============================
// User Update Section
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const userId = sessionStorage.getItem("userId");
  console.log("🔍 User Update Section - userId:", userId);
  
  if (!userId) {
    console.warn("⚠️ No userId found in sessionStorage");
    return;
  }

  // Target the first form in .container (user account form)
  const userForm = document.querySelector(".container form.account");
  if (!userForm) {
    console.warn("⚠️ User account form not found");
    return;
  }

  const saveBtn = userForm.querySelector(".btn-save");
  const cancelBtn = userForm.querySelector(".btn-cancel");
  
  console.log("🔍 Save button found:", !!saveBtn);
  console.log("🔍 Cancel button found:", !!cancelBtn);
  
  if (!saveBtn || !cancelBtn) {
    console.warn("⚠️ Save or Cancel button not found");
    return;
  }

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("💾 Save button clicked");
    
    const newName = document.getElementById("input-username")?.value.trim();
    const newEmail = document.getElementById("input-email")?.value.trim();
    const newPassword = document.getElementById("input-password")?.value.trim();

    console.log("📝 Form values:", {
      name: newName,
      email: newEmail,
      hasPassword: !!newPassword
    });

    if (!newName || !newEmail) {
      alert("Both name and email are required!");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      console.log("📄 Document reference created for:", userId);
      
      const updateData = {
        name: newName,
        email: newEmail
      };

      // Only update password if provided
      if (newPassword) {
        updateData.password = newPassword;
      }

      console.log("📤 Attempting to update with data:", updateData);
      await updateDoc(userRef, updateData);
      console.log("✅ Update successful!");

      // Update display elements
      const nameEl = document.getElementById("account-username");
      const emailEl = document.getElementById("account-email");
      if (nameEl) nameEl.textContent = newName;
      if (emailEl) emailEl.textContent = newEmail;

      // Update session storage
      sessionStorage.setItem("username", newName);
      sessionStorage.setItem("email", newEmail);
      if (newPassword) sessionStorage.setItem("password", newPassword);

      alert("User details updated successfully!");
    } catch (error) {
      console.error("❌ Error updating user:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      alert("Failed to update user: " + error.message);
    }
  });

  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔄 Cancel button clicked - resetting form");
    
    const usernameInput = document.getElementById("input-username");
    const emailInput = document.getElementById("input-email");
    const passwordInput = document.getElementById("input-password");
    
    if (usernameInput) usernameInput.value = sessionStorage.getItem("username") || "";
    if (emailInput) emailInput.value = sessionStorage.getItem("email") || "";
    if (passwordInput) passwordInput.value = sessionStorage.getItem("password") || "";
  });
});
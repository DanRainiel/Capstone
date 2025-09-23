import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc   // ✅ add this
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

document.addEventListener("DOMContentLoaded", () => {
  const profilePageEl = document.getElementById("account-username");
  const storedName = sessionStorage.getItem("username");
  if (profilePageEl && storedName) {
    profilePageEl.textContent = storedName;
  }

  const profileEmailEl = document.getElementById("account-email");
  const storedEmail = sessionStorage.getItem("email");
  if (profileEmailEl && storedEmail) {
    profileEmailEl.textContent = storedEmail;
  }

  
  loadPets();
});


async function addPet() {
  const userId = sessionStorage.getItem("userId"); 
  if (!userId) {
    Swal.fire({
      icon: 'error',
      title: 'Not Logged In',
      text: 'User not logged in!',
    });
    return;
  }

  // Get values
  const petName = document.querySelector('input[placeholder="Pet Name"]').value.trim();
  const breed = document.querySelector('input[placeholder="Dog, Cat, etc."]').value.trim();
  const sex = document.querySelector('input[placeholder="Sex"]').value.trim();
  const color = document.querySelector('input[placeholder="Color"]').value.trim();
  const weight = document.querySelector('input[placeholder="Weight"]').value.trim();
  const size = document.querySelector('input[placeholder="Size"]').value.trim();
  const dob = document.querySelector('input[placeholder="Date of Birth"]').value.trim();

  // Check if any required field is empty
  if (!petName || !breed || !sex || !color || !weight || !size || !dob) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Information',
      text: 'Please fill in all required fields before adding a pet.',
    });
    return; // Stop execution if fields are missing
  }

  try {
    const timestamp = Date.now();
    const customDocId = `${userId}_${petName}_${timestamp}`;

    await setDoc(doc(db, "Pets", customDocId), {
      userId,
      petName,
      breed,
      sex,
      color,
      weight,
      size,
      dob
    }, { merge: true });

    Swal.fire({
      icon: 'success',
      title: 'Pet Added',
      text: `${petName} has been successfully added!`,
    });

    loadPets(); // Reload the pets list
  } catch (error) {
    console.error("Error adding pet:", error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to add pet!',
    });
  }
}


async function loadPets() {
  const userId = sessionStorage.getItem("userId");
  const container = document.querySelector('.container-pet');
  container.innerHTML = ''; 

  const petsList = document.createElement('div');
  petsList.classList.add('pets-list');

  if (!userId) {
    console.error("No userId in sessionStorage.");
    container.appendChild(petsList);
    container.appendChild(petFormElement());
    return;
  }

  try {
    const q = query(collection(db, "Pets"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

  querySnapshot.forEach((docSnap) => {
  const data = docSnap.data();
  const petId = docSnap.id; 
  const petCard = document.createElement('div');
  petCard.classList.add('profile-pet');
  petCard.innerHTML = `
    <div class="profile-header-pet">
      <i class="fa-solid fa-user profile-icon"></i>
      <div class="profile-text-container-pet">
        <span class="name"><strong>${data.petName}</strong></span>
        <p class="email"><strong>${data.breed}</strong></p>
      </div>
    </div>
  `;
  petCard.addEventListener('click', () => showPetDetails(petId)); 
  petsList.appendChild(petCard);
});



  
    container.appendChild(petsList);
    container.appendChild(petFormElement());
  } catch (error) {
    console.error("Error loading pets:", error);
    
    container.appendChild(petsList);
    container.appendChild(petFormElement());
  }
}


function petFormElement() {
  const form = document.createElement('form');
  form.classList.add('account');
  form.innerHTML = `
    <div class="account-header">
      <h1 class="account-title">Pet Details</h1>
      <div class="btn-container">
        <button type="button" class="btn-cancel" id="addPetBtn">Add</button>
         
      </div>
    </div>
    <div class="account-edit">
      <div class="input-container"><label>Pet Name</label><input type="text" placeholder="Pet Name"></div>
      <div class="input-container"><label>Breed</label><input type="text" placeholder="Dog, Cat, etc."></div>
      <div class="input-container"><label>Sex</label><input type="text" placeholder="Sex"></div>
      <div class="input-container"><label>Color</label><input type="text" placeholder="Color"></div>
      <div class="input-container"><label>Weight</label><input type="text" placeholder="Weight"></div>
      <div class="input-container"><label>Size</label><input type="text" placeholder="Size"></div>
      <div class="input-container"><label>Date of Birth</label><input type="text" placeholder="Date of Birth"></div>
    </div>
  `;
  form.querySelector('#addPetBtn').addEventListener('click', addPet);
  return form;
}


async function showPetDetails(petId) {
  try {
    const docSnap = await getDoc(doc(db, "Pets", petId));
    if (!docSnap.exists()) {
      alert("Pet not found!");
      return;
    }

    const data = docSnap.data();
    const container = document.querySelector('.container-pet');

    // ✅ Remove old form if any
    let detailForm = container.querySelector('.account');
    if (detailForm) detailForm.remove();

    detailForm = document.createElement('form');
    detailForm.classList.add('account');
    detailForm.innerHTML = `
      <div class="account-header">
        <h1 class="account-title">Edit Pet Details</h1>
        <div class="btn-container">
          <button type="button" class="btn-cancel" onclick="location.href='profilepage.html'">Back</button>
          <button type="submit" class="btn-save">Update</button>
        </div>
      </div>
      <div class="account-edit">
        <div class="input-container"><label>Pet Name</label><input type="text" name="petName" value="${data.petName || ''}"></div>
        <div class="input-container"><label>Breed</label><input type="text" name="breed" value="${data.breed || ''}"></div>
        <div class="input-container"><label>Sex</label><input type="text" name="sex" value="${data.sex || ''}"></div>
        <div class="input-container"><label>Color</label><input type="text" name="color" value="${data.color || ''}"></div>
        <div class="input-container"><label>Weight</label><input type="text" name="weight" value="${data.weight || ''}"></div>
        <div class="input-container"><label>Size</label><input type="text" name="size" value="${data.size || ''}"></div>
        <div class="input-container"><label>Date of Birth</label><input type="text" name="dob" value="${data.dob || ''}"></div>
      </div>
    `;

    detailForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const updatedPet = {
        petName: detailForm.petName.value.trim(),
        breed: detailForm.breed.value.trim(),
        sex: detailForm.sex.value.trim(),
        color: detailForm.color.value.trim(),
        weight: detailForm.weight.value.trim(),
        size: detailForm.size.value.trim(),
        dob: detailForm.dob.value.trim(),
      };

      try {
        const petRef = doc(db, "Pets", petId);
        await setDoc(petRef, updatedPet, { merge: true });

        alert("Pet details updated successfully!");
        loadPets(); 
      } catch (error) {
        console.error("Error updating pet:", error);
        alert("Failed to update pet details.");
      }
    });

    // ✅ Just append form, don’t touch petsList
    container.appendChild(detailForm);

    // ✅ Remove focus so browser doesn’t auto-scroll the clicked card
    document.activeElement.blur();

  } catch (error) {
    console.error("Error loading pet details:", error);
    alert("Failed to load pet details!");
  }
}



document.addEventListener("DOMContentLoaded", () => {
  // Get the user ID from sessionStorage
  const userId = sessionStorage.getItem("userId");
  if (!userId) {
    alert("User not logged in!");
    return;
  }

  // Get the buttons
  const saveBtn = document.querySelector(".btn-save");
  const cancelBtn = document.querySelector(".btn-cancel");

  if (!saveBtn || !cancelBtn) return;

  saveBtn.type = "button";   // Ensure it doesn't submit a form
  cancelBtn.type = "button";

  saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const newName = document.getElementById("input-username")?.value.trim();
  const newEmail = document.getElementById("input-email")?.value.trim();
  const newPassword = document.getElementById("input-password")?.value.trim(); // ✅ moved here

  if (!newName || !newEmail) {
    alert("Both name and email are required!");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      name: newName,
      email: newEmail,
      ...(newPassword ? { password: newPassword } : {}), // ✅ only update if not empty
      updatedAt: new Date()
    });

    // Update the displayed profile immediately
    const nameEl = document.getElementById("account-username");
    const emailEl = document.getElementById("account-email");
    const passwordEl = document.getElementById("account-password"); // ✅ make sure this exists

    if (nameEl) nameEl.textContent = newName;
    if (emailEl) emailEl.textContent = newEmail;
    if (passwordEl && newPassword) passwordEl.textContent = newPassword;

    // Update sessionStorage
    sessionStorage.setItem("username", newName);
    sessionStorage.setItem("email", newEmail);
    if (newPassword) sessionStorage.setItem("password", newPassword);

    alert("User details updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user. Try again.");
  }
});

  // Cancel button resets inputs
  cancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("input-username");
    const emailInput = document.getElementById("input-email");
    const passwordInput = document.getElementById("input-password");
    // Reset to current sessionStorage values
    if (usernameInput) usernameInput.value = sessionStorage.getItem("username") || "";
    if (emailInput) emailInput.value = sessionStorage.getItem("email") || "";
    if (passwordInput) passwordInput.value = sessionStorage.getItem("password") || "";
  });
});

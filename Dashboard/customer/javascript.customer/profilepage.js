// ✅ Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc
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

// ✅ Load user profile info from sessionStorage
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

  loadPets(); // load pets on page load
});

// ✅ Add new pet
async function addPet() {
  const userId = sessionStorage.getItem("userId"); // should be the user's Firestore doc ID e.g. "owner1"
  if (!userId) {
    alert("User not logged in!");
    return;
  }

  const petName = document.querySelector('input[placeholder="Pet Name"]').value;
  const breed = document.querySelector('input[placeholder="Dog, Cat, etc."]').value;
  const sex = document.querySelector('input[placeholder="Sex"]').value;
  const color = document.querySelector('input[placeholder="Color"]').value;
  const weight = document.querySelector('input[placeholder="Weight"]').value;
  const size = document.querySelector('input[placeholder="Size"]').value;
  const dob = document.querySelector('input[placeholder="Date of Birth"]').value;

  try {
    // Create custom doc ID using userId + timestamp
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
    });
    alert("Pet successfully added!");
    loadPets(); // reload list after adding
  } catch (error) {
    console.error("Error adding pet:", error);
    alert("Failed to add pet!");
  }
}

// ✅ Load pets and show them
async function loadPets() {
  const userId = sessionStorage.getItem("userId");
  const container = document.querySelector('.container-pet');
  container.innerHTML = ''; // clear existing content

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
      petsList.appendChild(petCard);
    });

    // Append list left & form right
    container.appendChild(petsList);
    container.appendChild(petFormElement());
  } catch (error) {
    console.error("Error loading pets:", error);
    // still add list and form
    container.appendChild(petsList);
    container.appendChild(petFormElement());
  }
}

// ✅ Create form element
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

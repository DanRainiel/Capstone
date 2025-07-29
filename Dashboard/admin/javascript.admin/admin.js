
if (!sessionStorage.getItem("isLoggedIn")) {
  location.replace("../../login.html");
}


window.addEventListener("DOMContentLoaded", () => {
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });


  loadAllAppointments();
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,        
  doc,
  setDoc
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


async function loadAllAppointments() {
  const tableBody = document.getElementById("recent-appointments");
  tableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "Appointment"));

    if (snapshot.empty) {
      tableBody.innerHTML = "<tr><td colspan='5'>No appointments found.</td></tr>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name || ""}</td>
        <td>${data.petName || ""}</td>
        <td>${data.service || ""}</td>
        <td class="status pending">Pending</td>

      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    tableBody.innerHTML = "<tr><td colspan='5'>Error loading appointments.</td></tr>";
  }
}


// Load recent customers who made appointments
async function loadRecentCustomers() {
  const table = document.getElementById("recentCustomersTable");
  if (!table) return;
  table.innerHTML = "";

  try {
    const appointmentsSnapshot = await getDocs(collection(db, "Appointment"));
    const userIdsSet = new Set();

    appointmentsSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.userId) {
        userIdsSet.add(data.userId);
      }
    });

    for (const userId of userIdsSet) {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        const row = document.createElement("tr");
        row.innerHTML = `
          <td width="60px">
            <div class="imgBx">
              <i class="fa-solid fa-user profile-icon"></i>
            </div>
          </td>
          <td>
            <h4>${userData.name || "Unknown"}<br> <span>Philippines</span></h4>
          </td>
        `;
        table.insertBefore(row, table.firstChild);


      }
      
    }
  } catch (error) {
    console.error("Error loading recent customers:", error);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  loadRecentCustomers(); 
});


document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".toggle");
  const navigation = document.querySelector(".navigation"); 
  const main = document.querySelector(".main"); 

  if (toggle && navigation && main) {
    toggle.addEventListener("click", () => {
      navigation.classList.toggle("active");
      main.classList.toggle("active");
    });
  }
});


// ✅ Navigation and Sidebar Functionality
let list = document.querySelectorAll(".navigation li");

function activeLink(){
  list.forEach((item) => {
    item.classList.remove("hovered");
  });
  this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));


 // Toggle sidebar
    const toggle = document.querySelector('.toggle');
    const navigation = document.querySelector('.navigation');
    const main = document.querySelector('.main');

    toggle.onclick = function() {
      navigation.classList.toggle('active');
      main.classList.toggle('active');
    }

   // Navigation functionality
    const menuItems = document.querySelectorAll('.navigation ul li a[data-section]');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all menu items
        menuItems.forEach(menuItem => {
          menuItem.parentElement.classList.remove('hovered');
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

    // Set initial active state for dashboard
    document.querySelector('a[data-section="dashboard"]').parentElement.classList.add('hovered');

    // Form submission handlers (you can customize these)
    document.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Form submitted! (This is a demo - connect to your backend)');
    });

    // Add click handlers for action buttons
    document.addEventListener('click', function(e) {
      if (e.target.matches('.btn-primary')) {
        if (e.target.textContent === 'Print Label') {
          alert('Printing vaccination label...');
        } else if (e.target.textContent === 'Edit' || e.target.textContent === 'Update') {
          alert('Opening edit form...');
        } else if (e.target.textContent === 'View') {
          alert('Opening detailed view...');
        } else if (e.target.textContent === 'Cancel') {
          if (confirm('Are you sure you want to cancel this appointment?')) {
            alert('Appointment cancelled.');
          }
        } else if (e.target.textContent === 'Deactivate') {
          if (confirm('Are you sure you want to deactivate this user?')) {
            alert('User deactivated.');
          }
        }
      }
    });

    // Search functionality (basic implementation)
    const searchInput = document.querySelector('.search input');
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      // You can implement search logic here
      console.log('Searching for:', searchTerm);
    });

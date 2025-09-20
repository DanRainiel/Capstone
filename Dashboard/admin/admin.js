document.addEventListener("DOMContentLoaded", () => {
  // Prevent back navigation for admin
  if (sessionStorage.getItem("role") === "admin") {
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => {
      location.replace(location.href);
    });
  }

  // Sidebar toggle
  const toggle = document.querySelector('.toggle');
  const navigation = document.querySelector('.navigation');
  const main = document.querySelector('.main');

  toggle.onclick = function () {
    navigation.classList.toggle('active');
    main.classList.toggle('active');
  };

  

  // Navigation functionality
  const menuItems = document.querySelectorAll('.navigation ul li a[data-section]');
  const contentSections = document.querySelectorAll('.content-section');

  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all menu items
      document.querySelectorAll('.navigation ul li').forEach(li => {
        li.classList.remove('hovered');
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

  // Highlight active menu on hover
  const list = document.querySelectorAll(".navigation li");
  list.forEach((item) => {
    item.addEventListener("mouseover", function () {
      // Only change hover effect if not currently active
      if (!this.classList.contains('hovered')) {
        list.forEach((el) => el.classList.remove("hover-temp"));
        this.classList.add("hover-temp");
      }
    });
    
    item.addEventListener("mouseleave", function () {
      this.classList.remove("hover-temp");
    });
  });

  // Set initial active state for dashboard
  document.querySelector('a[data-section="dashboard"]').parentElement.classList.add('hovered');

  // Welcome message
  const welcomeMsg = sessionStorage.getItem("welcomeMessage");
  if (welcomeMsg) {
    Swal.fire({
      title: 'Welcome!',
      text: welcomeMsg,
      icon: 'info',
      iconColor: '#f8732b',
      confirmButtonText: 'OK',
      confirmButtonColor: '#f8732b'
    });
    sessionStorage.removeItem("welcomeMessage");
  }

  // Form submission handlers
  document.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formId = e.target.id;
    let message = 'Form submitted successfully!';
    
    switch(formId) {
      case 'walkinForm':
        message = 'Walk-in patient registered successfully!';
        break;
      case 'newsForm':
        message = 'News article published successfully!';
        break;
      case 'discountForm':
        message = 'Discount created successfully!';
        break;
      case 'vaccinationLabelForm':
        message = 'Vaccination label generated and printed successfully!';
        break;
    }
    
    alert(message);
    e.target.reset();
  });

  // Action button handlers
  document.addEventListener('click', function(e) {
    const buttonText = e.target.textContent.trim();
    
    if (e.target.matches('.btn-primary') || e.target.matches('.btn-danger')) {
      switch(buttonText) {
        case 'View':
        case 'View All':
        case 'View Details':
          alert('Opening detailed view...');
          break;
        case 'Edit':
        case 'Update':
          // Check if this is a service pricing edit button
          const isServicePricingTable = e.target.closest('#servicePricingTable') || 
                                      e.target.closest('[id*="fee-discount"]') ||
                                      e.target.closest('#fee-discount');
          
          if (isServicePricingTable && window.openServiceEditModal) {
            // Use the modal for service pricing edits
            const handled = window.openServiceEditModal(e.target);
            if (handled) {
              break; // Exit switch, modal handled the edit
            }
          }
          
          // Default behavior for other edit buttons
          alert('Opening edit form...');
          break;
        case 'Complete':
          if (confirm('Mark this appointment as completed?')) {
            alert('Appointment marked as completed.');
            // Update status in the UI
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status completed';
              statusCell.textContent = 'Completed';
            }
          }
          break;
        case 'Cancel':
          if (confirm('Are you sure you want to cancel this appointment?')) {
            alert('Appointment cancelled.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status cancelled';
              statusCell.textContent = 'Cancelled';
            }
          }
          break;
        case 'Deactivate':
          if (confirm('Are you sure you want to deactivate this user?')) {
            alert('User deactivated.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status cancelled';
              statusCell.textContent = 'Inactive';
            }
          }
          break;
        case 'Reactivate':
          if (confirm('Reactivate this user account?')) {
            alert('User reactivated.');
            const statusCell = e.target.closest('tr').querySelector('.status');
            if (statusCell) {
              statusCell.className = 'status completed';
              statusCell.textContent = 'Active';
            }
          }
          break;
        case 'Print':
        case 'Print Label':
        case 'Reprint Label':
          alert('Printing document...');
          break;
        case 'Generate Report':
          alert('Generating report...');
          break;
        case 'Export to PDF':
          alert('Exporting to PDF...');
          break;
        case 'Export to Excel':
          alert('Exporting to Excel...');
          break;
        case 'Send Reminder':
          alert('Vaccination reminder sent successfully!');
          break;
        case 'Book Appointment':
          alert('Redirecting to appointment booking...');
          break;
      
     
      }
    }
  });

  // Search functionality
  const searchInput = document.querySelector('.search input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      console.log('Searching for:', searchTerm);
      // Implement search logic here for filtering tables
    });
  }

  // Calendar navigation
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');
  const currentMonthElement = document.getElementById('currentMonth');
  
  if (prevMonthBtn && nextMonthBtn && currentMonthElement) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let currentMonth = 7; // August (0-indexed)
    let currentYear = 2025;
    
    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      currentMonthElement.textContent = `${months[currentMonth]} ${currentYear}`;
    });
    
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      currentMonthElement.textContent = `${months[currentMonth]} ${currentYear}`;
    });
  }

  // Auto-fill next due date for vaccinations
  const vaccinationDateInput = document.querySelector('input[name="vaccinationDate"]');
  const nextDueDateInput = document.querySelector('input[name="nextDueDate"]');
  const vaccineTypeSelect = document.querySelector('select[name="vaccineType"]');
  
  if (vaccinationDateInput && nextDueDateInput && vaccineTypeSelect) {
    function updateNextDueDate() {
      const vaccinationDate = new Date(vaccinationDateInput.value);
      const vaccineType = vaccineTypeSelect.value;
      
      if (vaccinationDate && vaccineType) {
        let monthsToAdd = 12; // Default for rabies
        
        switch(vaccineType) {
          case '5in1':
          case '6in1':
          case 'feline-3in1':
          case 'feline-4in1':
            monthsToAdd = 3; // Quarterly boosters
            break;
          case 'bordetella':
            monthsToAdd = 6; // Semi-annual
            break;
        }
        
        const nextDueDate = new Date(vaccinationDate);
        nextDueDate.setMonth(nextDueDate.getMonth() + monthsToAdd);
        nextDueDateInput.value = nextDueDate.toISOString().split('T')[0];
      }
    }
    
    vaccinationDateInput.addEventListener('change', updateNextDueDate);
    vaccineTypeSelect.addEventListener('change', updateNextDueDate);
  }

  // Initialize dashboard with current date
  const today = new Date();
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    if (input.name === 'publishDate' || input.name === 'vaccinationDate') {
      input.value = today.toISOString().split('T')[0];
    }
  });

  // ==========================================
  // FEE/DISCOUNT MODAL FUNCTIONALITY
  // ==========================================
  
  // Service pricing data (you can replace this with your database data)
  let servicePricingData = {
    "General Consultation": {
      basePrice: 500,
      seniorDiscount: 20,
      pwdDiscount: 20,
      loyaltyDiscount: 10,
      notes: ""
    },
    "Vaccination": {
      basePrice: 800,
      seniorDiscount: 15,
      pwdDiscount: 15,
      loyaltyDiscount: 5,
      notes: ""
    },
    "Surgery (Minor)": {
      basePrice: 3000,
      seniorDiscount: 10,
      pwdDiscount: 10,
      loyaltyDiscount: 5,
      notes: ""
    },
    "Grooming": {
      basePrice: 800,
      seniorDiscount: 15,
      pwdDiscount: 15,
      loyaltyDiscount: 10,
      notes: ""
    }
  };

  let currentEditingService = null;

  // Open modal function
  function openEditModal(serviceName) {
    const serviceData = servicePricingData[serviceName];
    if (!serviceData) return;

    currentEditingService = serviceName;
    
    // Get modal elements
    const modal = document.getElementById('editServiceModal');
    const editServiceName = document.getElementById('editServiceName');
    const editBasePrice = document.getElementById('editBasePrice');
    const editSeniorDiscount = document.getElementById('editSeniorDiscount');
    const editPwdDiscount = document.getElementById('editPwdDiscount');
    const editLoyaltyDiscount = document.getElementById('editLoyaltyDiscount');
    const editNotes = document.getElementById('editNotes');

    if (!modal) return; // Exit if modal doesn't exist
    
    // Populate form with current data
    if (editServiceName) editServiceName.value = serviceName;
    if (editBasePrice) editBasePrice.value = serviceData.basePrice;
    if (editSeniorDiscount) editSeniorDiscount.value = serviceData.seniorDiscount;
    if (editPwdDiscount) editPwdDiscount.value = serviceData.pwdDiscount;
    if (editLoyaltyDiscount) editLoyaltyDiscount.value = serviceData.loyaltyDiscount;
    if (editNotes) editNotes.value = serviceData.notes || '';

    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Close modal function
  function closeModal() {
    const modal = document.getElementById('editServiceModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
    currentEditingService = null;
    
    // Reset form
    const form = document.getElementById('editServiceForm');
    if (form) form.reset();
  }

  // Update table row
  function updateTableRow(serviceName, data) {
    const row = document.querySelector(`tr[data-service="${serviceName}"]`);
    if (!row) return;

    const cells = row.querySelectorAll('td');
    if (cells.length >= 5) {
      cells[1].innerHTML = `<span class="price-display">₱${data.basePrice.toLocaleString()}</span>`;
      cells[2].innerHTML = `<span class="discount-badge">${data.seniorDiscount}%</span>`;
      cells[3].innerHTML = `<span class="discount-badge">${data.pwdDiscount}%</span>`;
      cells[4].innerHTML = `<span class="discount-badge">${data.loyaltyDiscount}%</span>`;
    }
  }

  // Save changes function
  function saveChanges() {
    if (!currentEditingService) return;

    const editBasePrice = document.getElementById('editBasePrice');
    const editSeniorDiscount = document.getElementById('editSeniorDiscount');
    const editPwdDiscount = document.getElementById('editPwdDiscount');
    const editLoyaltyDiscount = document.getElementById('editLoyaltyDiscount');
    const editNotes = document.getElementById('editNotes');

    if (!editBasePrice) return;

    // Validate inputs
    const basePrice = parseFloat(editBasePrice.value);
    const seniorDiscount = parseFloat(editSeniorDiscount?.value || 0);
    const pwdDiscount = parseFloat(editPwdDiscount?.value || 0);
    const loyaltyDiscount = parseFloat(editLoyaltyDiscount?.value || 0);

    if (basePrice <= 0) {
      alert('Base price must be greater than 0');
      return;
    }

    if (seniorDiscount < 0 || seniorDiscount > 100) {
      alert('Senior discount must be between 0 and 100');
      return;
    }

    if (pwdDiscount < 0 || pwdDiscount > 100) {
      alert('PWD discount must be between 0 and 100');
      return;
    }

    if (loyaltyDiscount < 0 || loyaltyDiscount > 100) {
      alert('Loyalty discount must be between 0 and 100');
      return;
    }

    // Update data
    servicePricingData[currentEditingService] = {
      basePrice: basePrice,
      seniorDiscount: seniorDiscount,
      pwdDiscount: pwdDiscount,
      loyaltyDiscount: loyaltyDiscount,
      notes: editNotes?.value || ""
    };

    // Update table display
    updateTableRow(currentEditingService, servicePricingData[currentEditingService]);

    // Show success message
    alert(`${currentEditingService} pricing updated successfully!`);

    // Close modal
    closeModal();

    // Here you would typically send the data to your database
    console.log('Updated service pricing data:', servicePricingData);
  }

  // Global function to handle edit button clicks from external JS
  window.openServiceEditModal = function(buttonElement) {
    const row = buttonElement.closest('tr');
    if (row && row.dataset.service) {
      const serviceName = row.dataset.service;
      openEditModal(serviceName);
      return true; // Indicate that this edit was handled
    }
    return false; // Let external handler show default alert
  };

  // Modal event listeners (set up after DOM is loaded)
  setTimeout(() => {
    const modal = document.getElementById('editServiceModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelEdit');
    const saveBtn = document.getElementById('saveServiceChanges');

    if (modal && closeBtn && cancelBtn && saveBtn) {
      // Close modal events
      closeBtn.addEventListener('click', closeModal);
      cancelBtn.addEventListener('click', closeModal);
      
      // Click outside modal to close
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Save changes
      saveBtn.addEventListener('click', saveChanges);

      // Close modal with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
          closeModal();
        }
      });

      // Form submit prevention
      const editForm = document.getElementById('editServiceForm');
      if (editForm) {
        editForm.addEventListener('submit', function(e) {
          e.preventDefault();
          saveChanges();
        });
      }
    }
  }, 100); // Small delay to ensure DOM elements are available

});

// Logout function
function logout() {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f8732b',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();

      // Show compact, styled loader just like customer version
      Swal.fire({
        title: "Logging you out...",
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="custom-loader" style="
                width: 50px;
                height: 50px;
                border: 5px solid #ccc;
                border-top: 5px solid var(--background-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;">
            </div>
            <span style="font-size: 14px; color: #ccc;">Please wait a moment</span>
          </div>
        `,
        background: "#ffffff",
        color: "#1e1e1e",
        showConfirmButton: false,
        allowOutsideClick: false,
        customClass: {
          popup: 'rounded-xl shadow-lg'
        },
      });

      setTimeout(() => {
        Swal.fire({
          title: "Logged out successfully!",
          text: "You will be redirected shortly.",
          html: `<div style="font-size: 20px; color: rgba(0, 0, 0, 0.3);">You will be redirected shortly.</div>`,
          icon: "success",
          background: "#ffffff",
          color: "#1e1e1e",
          iconColor: '#f8732b',
          showConfirmButton: false,
          timer: 2000,
          customClass: {
            popup: 'rounded-xl shadow-lg'
          },
          didClose: () => {
            window.location.href = '/index.html';
          }
        });
      }, 1200);
    }
  });
}

// Additional utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Real-time clock update
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-PH', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // You can add a clock element to display current time
  console.log('Current time:', timeString);
}

// Update clock every minute
setInterval(updateClock, 60000);
updateClock(); // Initial call

document.addEventListener("DOMContentLoaded", () => {
  const feeTableBody = document.querySelector("#fee-discount table tbody");
  const modal = document.getElementById("editServiceModal");
  const closeModalBtn = modal.querySelector(".close");
  const cancelBtn = document.getElementById("cancelEdit");
  const saveBtn = document.getElementById("saveServiceChanges");

  // Modal inputs
  const inputServiceName = document.getElementById("editServiceName");
  const inputBasePrice = document.getElementById("editBasePrice");
  const inputSeniorDiscount = document.getElementById("editSeniorDiscount");
  const inputPwdDiscount = document.getElementById("editPwdDiscount");
  const inputLoyaltyDiscount = document.getElementById("editLoyaltyDiscount");
  const inputNotes = document.getElementById("editNotes");

  let currentEditingRow = null;

  // Show modal and pre-fill form with clicked row data
  feeTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-primary")) {
      // Get the row of clicked button
      const row = e.target.closest("tr");
      currentEditingRow = row;

      // Extract current values from the row cells
      inputServiceName.value = row.cells[0].textContent.trim();

      // Remove currency symbols and commas before parsing number
      inputBasePrice.value = parseFloat(row.cells[1].textContent.replace(/[₱,]/g, ""));

      inputSeniorDiscount.value = parseFloat(row.cells[2].textContent.replace("%", ""));
      inputPwdDiscount.value = parseFloat(row.cells[3].textContent.replace("%", ""));
      inputLoyaltyDiscount.value = parseFloat(row.cells[4].textContent.replace("%", ""));

      // Clear notes (since your table doesn't show notes yet)
      inputNotes.value = "";

      // Show modal
      modal.style.display = "block";
    }
  });

  // Close modal functions
  function closeModal() {
    modal.style.display = "none";
    currentEditingRow = null;
  }
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Save changes back to the table
  saveBtn.addEventListener("click", () => {
    if (!currentEditingRow) return;

    // Basic validation
    if (inputBasePrice.value === "" || inputBasePrice.value < 0) {
      alert("Please enter a valid Base Price.");
      return;
    }

    // Update the table cells with new values
    currentEditingRow.cells[1].textContent = `₱${parseFloat(inputBasePrice.value).toLocaleString()}`;
    currentEditingRow.cells[2].textContent = `${parseFloat(inputSeniorDiscount.value) || 0}%`;
    currentEditingRow.cells[3].textContent = `${parseFloat(inputPwdDiscount.value) || 0}%`;
    currentEditingRow.cells[4].textContent = `${parseFloat(inputLoyaltyDiscount.value) || 0}%`;

    // If you want to store notes somewhere, you can extend your UI or save in data attributes.

    closeModal();
  });

  // Optional: Close modal when clicking outside content
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
});
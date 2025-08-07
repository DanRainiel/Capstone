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
            case 'Publish':
              if (confirm('Publish this news article?')) {
                alert('News article published successfully!');
                const statusCell = e.target.closest('tr').querySelector('.status');
                if (statusCell) {
                  statusCell.className = 'status completed';
                  statusCell.textContent = 'Published';
                }
              }
              break;
            case 'Unpublish':
              if (confirm('Unpublish this news article?')) {
                alert('News article unpublished.');
                const statusCell = e.target.closest('tr').querySelector('.status');
                if (statusCell) {
                  statusCell.className = 'status pending';
                  statusCell.textContent = 'Draft';
                }
              }
              break;
            case 'Delete':
              if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
                alert('Item deleted successfully.');
                e.target.closest('tr').remove();
              }
              break;
            case 'Start':
              alert('Starting appointment...');
              const statusCell = e.target.closest('tr').querySelector('.status');
              if (statusCell) {
                statusCell.className = 'status pending';
                statusCell.textContent = 'In Progress';
              }
              break;
            case 'Reschedule':
              alert('Opening reschedule form...');
              break;
            case 'Block':
              alert('Time slot blocked successfully!');
              break;
            case 'Remove Block':
              if (confirm('Remove this time block?')) {
                alert('Time block removed.');
                e.target.closest('tr').remove();
              }
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
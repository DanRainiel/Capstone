if (sessionStorage.getItem("role") === "admin") {
  history.pushState(null, null, location.href);
  window.addEventListener('popstate', () => {
    location.replace(location.href);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const welcomeMsg = sessionStorage.getItem("welcomeMessage");
  if (welcomeMsg) {
    alert(welcomeMsg);
    sessionStorage.removeItem("welcomeMessage");
  }
});

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

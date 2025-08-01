document.addEventListener('DOMContentLoaded', () => {
  
  //for responsive navbar
  let menu = document.querySelector('#menu-btn');
  let navbar = document.querySelector('.navbar');

  menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
  };

  window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
  };

  // Smooth scroll for the navigation links
  document.querySelectorAll('#home-nav, #abt-nav, #doc-nav, #news-nav').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const sectionTop = targetSection.offsetTop;
        const sectionHeight = targetSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        const scrollTo = sectionTop - (viewportHeight / 2) + (sectionHeight / 2);

        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    });
  });

  // Smooth scroll for the services section
  const servicesNav = document.querySelector('#services-nav');
  if (servicesNav) {
    servicesNav.addEventListener('click', function (e) {
      e.preventDefault();
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const sectionTop = servicesSection.offsetTop;
        const sectionHeight = servicesSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollTo = sectionTop - (viewportHeight / 1.3) + (sectionHeight / 1.3);
        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    });
  }

  // Smooth scroll for the footer links
  document.querySelectorAll('#home-foot, #abt-foot, #doc-foot, #news-foot').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        const sectionTop = targetSection.offsetTop;
        const sectionHeight = targetSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        const scrollTo = sectionTop - (viewportHeight / 2) + (sectionHeight / 2);

        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    });
  });

  const servicesFoot = document.querySelector('#services-foot');
  if (servicesFoot) {
    servicesFoot.addEventListener('click', function (e) {
      e.preventDefault();
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        const sectionTop = servicesSection.offsetTop;
        const sectionHeight = servicesSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollTo = sectionTop - (viewportHeight / 1.3) + (sectionHeight / 1.3);
        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    });
  }


  //modal
const modal = document.getElementById("modal-container");
const lm1 = document.getElementById("lm-1");
const lm2 = document.getElementById("lm-2");
const lm3 = document.getElementById("lm-3");
const lm4 = document.getElementById("lm-4");
const lm5 = document.getElementById("lm-5");
const lm6 = document.getElementById("lm-6");
const abt = document.getElementById("abt");
const news1 = document.getElementById("news1");
const news2 = document.getElementById("news2");
const news3 = document.getElementById("news3");
const exitModalBtn = document.getElementById("exit");

// Show modal
lm1.onclick = function () {
  modal.classList.add("show");
};
lm2.onclick = function () {
  modal.classList.add("show");
};
lm3.onclick = function () {
  modal.classList.add("show");
};
lm4.onclick = function () {
  modal.classList.add("show");
};
lm5.onclick = function () {
  modal.classList.add("show");
};
lm6.onclick = function () {
  modal.classList.add("show");
};
abt.onclick = function () {
  modal.classList.add("show");
};
news1.onclick = function () {
  modal.classList.add("show");
};
news2.onclick = function () {
  modal.classList.add("show");
};
news3.onclick = function () {
  modal.classList.add("show");
};

// Hide modal
exitModalBtn.onclick = function () {
  window.location.href = "/auth/login.html"; // Adjust path if needed
};

// Optional: click outside modal to close
window.onclick = function (e) {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
};

});
// ✅ Redirect if already logged in and opens index.html
if (window.location.pathname.endsWith('index.html') && sessionStorage.getItem("userId")) {
  const role = sessionStorage.getItem("role");
  if (role === "admin") {
    location.replace("Dashboard/admin/admin.html");
  } else if (role === "customer") {
    location.replace("Dashboard/customer/customer.html");
  }
}

// your existing DOMContentLoaded, navbar, smooth scroll, modal code...
document.addEventListener('DOMContentLoaded', () => {
  // your existing code...
});

const role = sessionStorage.getItem("role");
const currentPath = window.location.pathname;

if (role === "customer" && currentPath.includes('customer.html')) {
  history.pushState(null, null, currentPath);
  window.addEventListener('popstate', () => {
    location.replace(currentPath);
  });
}

if (role === "admin" && currentPath.includes('admin.html')) {
  history.pushState(null, null, currentPath);
  window.addEventListener('popstate', () => {
    location.replace(currentPath);
  });
}


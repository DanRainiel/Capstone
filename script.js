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
document.addEventListener("DOMContentLoaded", function () {
  const cardsContainer = document.querySelector('.cards');
  const boxesContainer = document.querySelector('#news .box-container');
  const newsContainer = cardsContainer || boxesContainer;
  if (!newsContainer) return;

  const MODE = cardsContainer ? 'cards' : 'boxes'; // render style
  const PLACEHOLDER_IMAGE = "/images/news2.webp"; 
  const defaultNews = {
    title: "NO NEWS AVAILABLE",
    content: "Stay tuned for updates!",
    image: PLACEHOLDER_IMAGE,
    publishDate: "",
    priority: "normal"
  };

  // ✅ Sort by priority first, then newest
  const priorityOrder = { urgent: 1, important: 2, normal: 3 };
  function getTop3Published(newsList) {
    let published = (newsList || []).filter(n => n.status === 'published'); // only published
    published.sort((a, b) => {
      const prioDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (prioDiff !== 0) return prioDiff;
      const da = a.publishDate ? new Date(a.publishDate).getTime() : 0;
      const db = b.publishDate ? new Date(b.publishDate).getTime() : 0;
      return db - da; // newest first
    });
    return published.slice(0, 3);
  }

  function renderNews() {
    const stored = JSON.parse(localStorage.getItem('newsList')) || [];
    let list = getTop3Published(stored);

    // ✅ Always keep 3 slots filled
    while (list.length < 3) {
      list.push(defaultNews);
    }

    newsContainer.innerHTML = '';

    list.forEach(news => {
      const imgSrc = news.image || PLACEHOLDER_IMAGE;
      const dateText = news.publishDate ? new Date(news.publishDate).toLocaleDateString() : '';
      const priorityText = news.priority ? news.priority.charAt(0).toUpperCase() + news.priority.slice(1) : '';

      if (MODE === 'cards') {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div class="image-section">
            <img src="${imgSrc}" alt="${news.title}">
          </div>
          <div class="content">
            <h4>${news.title}</h4>
            <p>${news.content}</p>
            <p><b>Priority:</b> ${priorityText}</p>
          </div>
          <div class="posted-date">
            <p>${dateText}</p>
          </div>
        `;
        newsContainer.appendChild(card);
      } else {
        const box = document.createElement('div');
        box.classList.add('box');
        box.innerHTML = `
          <div class="image">
            <img src="${imgSrc}" alt="${news.title}">
          </div>
          <div class="content">
            <div class="icons">
              <a href="#"><i class="fa-solid fa-calendar"></i> ${dateText}</a>
              <a href="#"><i class="fas fa-user"></i> By admin</a>
              <span class="priority ${news.priority}">${priorityText}</span>
            </div>
            <h3>${news.title}</h3>
            <p>${news.content}</p>
            <a href="news.html" class="btn">Learn More <span class="fas fa-chevron-right"></span></a>
          </div>
        `;
        newsContainer.appendChild(box);
      }
    });
  }

  renderNews();

  window.addEventListener('storage', (event) => {
    if (event.key === 'newsList') renderNews();
  });
});

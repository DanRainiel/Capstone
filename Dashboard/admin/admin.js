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

//Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main");

toggle.onclick = function () {
  navigation.classList.toggle("active");
  main.classList.toggle("active");
};
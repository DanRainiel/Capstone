

const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const wrapper = document.querySelector('.wrapper');

function loginFunction() {
  loginForm.style.left = "50%";
  loginForm.style.opacity = "1";

  registerForm.style.left = "150%";
  registerForm.style.opacity = "0";

  loginTitle.style.top = "50%";
  loginTitle.style.opacity = "1";

  registerTitle.style.top = "50px";
  registerTitle.style.opacity = "0";

  wrapper.style.height = "500px";
}

function registerFunction() {
  loginForm.style.left = "-50%";
  loginForm.style.opacity = "0";
  
  wrapper.style.height = "580px";

  registerForm.style.left = "50%";
  registerForm.style.opacity = "1";

  loginTitle.style.top = "-60px";
  loginTitle.style.opacity = "0";

  registerTitle.style.top = "50%";
  registerTitle.style.opacity = "1";
}

// Optional: Set default state on page load
window.onload = loginFunction;

const loginButton = document.getElementById("SignInBtn");

loginButton.addEventListener("click", function (e) {
    e.preventDefault();

    // Show loading screen
    const loader = document.getElementById("loading-screen");
    loader.style.display = "flex";

    // Simulate login delay (e.g., 2 seconds)

});






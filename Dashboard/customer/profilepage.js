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
});

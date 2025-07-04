document.addEventListener("DOMContentLoaded", () => {
  const profilePageEl = document.getElementById("profilepage-username");
  const storedName = sessionStorage.getItem("username");

  if (profilePageEl && storedName) {
    profilePageEl.textContent = storedName;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const accountBtn = document.getElementById("account-setting-btn");
  if (accountBtn) {
    accountBtn.addEventListener("click", () => {
      window.location.href = "profilepage.html";
    });
  }
});

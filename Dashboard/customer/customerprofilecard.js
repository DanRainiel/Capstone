document.addEventListener("DOMContentLoaded", () => {
  const profilePageEl = document.getElementById("profilepage-username");
  const storedName = sessionStorage.getItem("username");

  if (profilePageEl && storedName) {
    profilePageEl.textContent = storedName;
  }
});

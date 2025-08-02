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
      Swal.fire({
        title: 'Redirecting...',
        text: 'Please wait while we load your profile.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      setTimeout(() => {
        window.location.href = "profilepage.html";
      }, 2000);
    });
  }
});


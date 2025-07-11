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

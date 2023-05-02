const avatarTrigger = document.querySelector("#avatar-trigger");
const avatarContentDiv = document.querySelector("#avatar-content");
const avatarBackdrop = document.querySelector("#avatar-backdrop");
const logoutButton = document.querySelector("#logout-btn");
const helpButton = document.querySelector("#help-btn");

if (avatarTrigger)
  avatarTrigger.addEventListener("click", () => {
    avatarContentDiv.classList.add("active");
  });

if (avatarBackdrop)
  avatarBackdrop.addEventListener("click", () => {
    avatarContentDiv.classList.remove("active");
  });

if (logoutButton)
  logoutButton.addEventListener("click", () => {
    avatarContentDiv.classList.remove("active");
    fetch("/api/logout", {
      redirect: "follow",
    }).then(() => (window.location = "/"));
  });

if (helpButton)
  helpButton.addEventListener("click", () => {
    avatarContentDiv.classList.remove("active");
    window.location = "/help";
  });

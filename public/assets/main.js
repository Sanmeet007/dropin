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
  });

const modals = document.querySelectorAll(".modal");
if (modals) {
  modals.forEach((modal) => {
    const modalBackdrop = modal.querySelector(".modal-backdrop");
    modalBackdrop.addEventListener("click", (e) => {
      modal.classList.remove("open");
    });
  });
}

const billAmountCalculator = (x) => {
  let serviceCharge = (x / 100) * 10;
  if (serviceCharge > 100) serviceCharge = 100;
  return x + serviceCharge;
};

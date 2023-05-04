const authModal = document.querySelector("#auth-modal");
const navTrigger = document.querySelector("#nav-trigger");
const navDrawer = document.querySelector("#nav-drawer");
const navBackdropSheet = document.querySelector("#nav-backdrop-sheet");
const deskSignUpButton = document.querySelector("#desk-sign-up-btn");
const deskSignInButton = document.querySelector("#desk-sign-in-btn");
const signInButton = document.querySelector("#sign-in-btn");
const signUpButton = document.querySelector("#sign-up-btn");
const authBackdop = document.querySelector("#auth-backdrop");
const loginForm = document.querySelector("#login-form");

navTrigger.addEventListener("click", (e) => {
  navDrawer.classList.add("open");
});
navBackdropSheet.addEventListener("click", (e) => {
  navDrawer.classList.remove("open");
});

authBackdop.addEventListener("click", () => {
  console.log("clicked ");
  authModal.classList.remove("open");
});

if (signInButton) {
  signInButton.addEventListener("click", (e) => {
    navDrawer.classList.remove("open");
    authModal.classList.add("open");
  });
}

if (signUpButton) {
  signUpButton.addEventListener("click", (e) => {
    navDrawer.classList.remove("open");
    authModal.classList.add("open");
  });
}

if (deskSignInButton) {
  deskSignInButton.addEventListener("click", () => {
    authModal.classList.add("open");
  });
}

if (deskSignUpButton) {
  deskSignUpButton.addEventListener("click", () => {
    authModal.classList.add("open");
  });
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const { email, password } = loginForm;
  fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then(() => {
      window.location = "/app";
    })
    .catch((e) => {
      console.log(e);
    });
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

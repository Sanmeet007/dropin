const authModal = document.querySelector("#auth-modal");
const signUpModal = document.querySelector("#sign-up-modal");

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
    signUpModal.classList.add("open");
  });
}

const openSignUpModal = ({ email = null, account_type = null }) => {
  navDrawer.classList.remove("open");
  signUpModal.classList.add("open");
  signUpModal.querySelector("form").reset();

  signUpModal.querySelector("#email").value = email ?? "";

  if (account_type === "client") {
    signUpModal.querySelector("#client").checked = true;
    signUpModal.querySelector("#company-select").classList.remove("hidden");
    signUpModal.querySelector("#company-select").required = true;
  } else if (account_type === "freelancer") {
    signUpModal.querySelector("#company-select").classList.add("hidden");
    signUpModal.querySelector("#company-select").required = false;
    signUpModal.querySelector("#freelancer").checked = true;
  } else {
    signUpModal.querySelector("#company-select").classList.add("hidden");
    signUpModal.querySelector("#company-select").required = false;
  }
};

const closeSignUpMoal = () => {
  signUpModal.classList.remove("open");
  signUpModal.querySelector("form").reset();
};

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

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { email, password } = loginForm;
  try {
    showLoader();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });
    if (res.status === 200) {
      hideLoader();
      showSnackBar("Login successfull", "success");

      setTimeout(() => {
        window.location = "/app";
      }, 200);
    } else {
      const d = await res.json();
      hideLoader();
      showSnackBar(d.message, "error");
    }
  } catch (e) {
    hideLoader();
    showSnackBar("Something went wrong", "error");
  }
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

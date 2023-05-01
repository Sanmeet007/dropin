const navTrigger = document.querySelector("#nav-trigger");
const navDrawer = document.querySelector("#nav-drawer");
const navBackdropSheet = document.querySelector("#nav-backdrop-sheet");
navTrigger.addEventListener("click", (e) => {
  navDrawer.classList.add("open");
});
navBackdropSheet.addEventListener("click", (e) => {
  navDrawer.classList.remove("open");
});

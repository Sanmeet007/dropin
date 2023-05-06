const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  let login = false;
  const action = req.query.action;
  if (action === "login") login = true;
  if (req.session.user) {
    return res.render("index", {
      user: req.session.user,
      login,
    });
  } else {
    return res.render("index", {
      user: null,
      login,
    });
  }
});

router.get("/about-us", (req, res) => {
  return res.render("page", {
    user: req.session.user,
    login: false,
    title: "About Us - Dropin",
    view: "about",
  });
});
router.get("/support", (req, res) => {
  return res.render("page", {
    user: req.session.user,
    login: false,
    title: "Support - Dropin",
    view: "support",
  });
});
router.get("/services", (req, res) => {
  return res.render("page", {
    user: req.session.user,
    login: false,
    title: "Services - Dropin",
    view: "services",
  });
});

module.exports = router;

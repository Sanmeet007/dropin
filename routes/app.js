const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Dashboard - Dropin",
      heading: "Dashboard",
      view: "index",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

router.get("/jobs", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Jobs - Dropin",
      heading: "Job Listings",
      view: "jobs",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

router.get("/proposals", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Proposals - Dropin",
      heading: "Proposals",
      view: "proposals",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

router.get("/my-account", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "My Account - Dropin",
      heading: "Mange Account",
      view: "my-account",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

router.get("/balance", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Balance - Dropin",
      heading: "Balance",
      view: "balance",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

router.get("/contracts", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Contracts - Dropin",
      heading: "Contracts",
      view: "contracts",
    });
  } else {
    return res.redirect("/?action=login");
  }
});

module.exports = router;

const express = require("express");

const router = express.Router();

router.get("/app", (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
    });
  } else {
    return res.render("app", {
      user: null,
    });
  }
});

module.exports = router;

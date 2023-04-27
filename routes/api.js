const express = require("express");
const UserApiRoutes = require("./api/user");
const router = express.Router();

router.all("/api/user", UserApiRoutes);

module.exports = router;

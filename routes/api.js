const { dbconn } = require("../utils/dbconnect");
const md5 = require("crypto-md5");
const express = require("express");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email = null, password = null } = req.body;
    if (!email || !password) return res.status(400).end();

    const user = await dbconn.getUserByEmailId(email);

    if (user) {
      if (user.hashedPassword !== md5(password, "hex")) {
        return res.status(400).json({
          error: true,
          message: "Invalid Password Entered for registered user",
        });
      }

      req.session.user = user;
      return res.json({
        error: false,
        message: "login success",
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid Credentials",
      });
    }
  } catch (E) {
    console.log(E);
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

module.exports = router;

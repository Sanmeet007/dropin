const { dbconn } = require("../utils/dbconnect");
const express = require("express");
const { passwordHasher } = require("../utils/password_hasher");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email = null, password = null } = req.body;
    if (!email || !password) return res.status(400).end();

    const user = await dbconn.getUserByEmailId(email);

    if (user) {
      if (user.hashedPassword !== passwordHasher(password)) {
        return res.status(400).json({
          error: true,
          message: "Invalid Password Entered for registered user",
        });
      }

      user.hashedPassword = null; // preventing password leakage in frontend

      // Attaching extra details
      user._name = user.fullname;
      user._age = user.age;

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

router.post("/sign-up", async (req, res) => {
  try {
    if (req.session.user)
      return res.status(400).json({
        error: true,
        message: "Logout fist to create a new user",
      });

    const {
      account_type = "client",
      email = null,
      password = null,
      gender = null,
      dob = null,
      first_name = null,
      last_name = null,
      company_name = null,
    } = req.body;

    if (!email || !password || !dob || !gender || !first_name)
      return res.status(400).json({
        error: true,
        message: "Invalid data provided",
      });

    if (account_type === "client") {
      if (!company_name) {
        return res.status(400).json({
          error: true,
          message: "Company Name can't be null for client",
        });
      }
    }

    const createdSuccessFully = await dbconn.createUser(account_type, {
      email: email,
      first_name,
      last_name,
      password,
      gender,
      company_name,
      dob,
    });

    if (createdSuccessFully) {
      const user = await dbconn.getUserByEmailId(email);
      if (user) {
        req.session.user = user;
        return res.json({
          error: false,
          message: "User created successfully",
        });
      } else
        return res.status(500).json({
          error: true,
          message: "Something went wrong",
        });
    } else
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
  } catch (e) {
    if (e.sqlState === "45000") {
      return res.status(400).json({
        error: true,
        message: "Email id already registered",
      });
    }
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.end();
});

// router.post("/user/change-password", (req, res) => {});

// router.post("/user/update-details", (req, res) => {});

// router.post("/user/verify", (req, res) => {});

router.get("/jobs", async (_, res) => {
  const jobs = await dbconn.listJobs();
  return res.json(jobs);
});

router.get("/jobs/:id", async (req, res) => {
  const jobId = req.params.id;
  if (!jobId)
    return res.status(400).json({
      error: true,
      message: "Invalid request",
    });

  const jobDetails = await dbconn.getJobDetails(jobId);
  if (!jobDetails)
    return res.status(400).json({
      error: true,
      message: "Job not found",
    });

  return res.json(jobDetails);
});

router.use("*", (_, res) => {
  return res.status(405).end();
});

module.exports = router;

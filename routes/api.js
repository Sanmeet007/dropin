const { dbconn } = require("../utils/dbconnect");
const express = require("express");
const { passwordHasher } = require("../utils/password_hasher");
const { authenticateSession } = require("../middlewares/auth");
const { generateToken } = require("../utils/generate_token");
const { sendMail } = require("../utils/sendmail");
const { objectCleaner } = require("../utils/object_cleaner");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, path.join("public", process.env.UPLOADS_DIR));
  },
  filename: function (_, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// Auth Routes
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
        user.hashedPassword = null; // preventing password leakage in frontend

        // Attaching extra details
        user._name = user.fullname;
        user._age = user.age;

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

// User Routes
router.post("/user/change-password", authenticateSession, async (req, res) => {
  try {
    const user = req.session.user;
    const { password = null } = req.body;
    if (password) {
      await dbconn.updateUserPassword(user.uid, password);
      return res.json({
        error: false,
        message: "Password changed successfully",
      });
    }
    return res.status(400).json({
      error: true,
      message: "Something went wrong",
    });
  } catch (E) {
    console.log(E);
    return res.status(400).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

// Uploader
router.post(
  "/user/update-details",
  authenticateSession,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const {
        first_name = null,
        last_name = null,
        location = null,
        bio = null,
        gender = null,
        company_name = null,
        company_website = null,
        industry = null,
        company_size = null,
        education = null,
        skills = null,
        programming_languages = null,
        languages = null,
        databases = null,
        other_skills = null,
      } = req.body;

      let profile_image = null;
      if (req.file) {
        const url = new URL(
          path.join(process.env.UPLOADS_DIR, req.file.filename),
          process.env.BASE_URL
        );
        profile_image = url.href;
      }
      const user = req.session.user;

      const basicObject = {
        first_name,
        last_name,
        location,
        bio,
        profile_image,
        gender,
      };

      const uid = user.uid;
      await dbconn.updateUserDetails(uid, objectCleaner(basicObject));

      if (user.account_type === "client") {
        const companyDetails = {
          company_name,
          company_website,
          industry,
          company_size,
        };

        await dbconn.updateClientDetails(uid, objectCleaner(companyDetails));
        return res.json({
          error: false,
          message: "User details updated successfully",
        });
      } else if (user.account_type === "freelancer") {
        const freelancerDetails = {
          education,
          skills,
          programming_languages,
          languages,
          databases,
          other_skills,
        };

        await dbconn.updateFreelancingDetails(
          uid,
          objectCleaner(freelancerDetails)
        );

        return res.json({
          error: false,
          message: "User details updated successfully",
        });
      } else return res.status(405).end();
    } catch (E) {
      console.log(E);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

router.get("/user/get-verified", authenticateSession, async (req, res) => {
  try {
    const user = req.session.user;
    const userId = user.uid;
    const token = generateToken();
    await dbconn.setUserVerificationDetails(userId, token);
    await sendMail({
      subject: "User Verification",
      senderName: "Team Dropin",
      recieverName: user._name,
      recieverEmailId: user.email,
      templateName: "verification",
      templateParams: {
        verification_link: "http://localhost/api/user/verify?token=" + token,
      },
    });
    return res.json({
      error: false,
      message: "Verification link sent successfully to registered email id",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

router.get("/user/verify", async (req, res) => {
  const { token = null } = req.query;
  if (!token) return res.status(400).end();

  const tokenDetails = await dbconn.getVerifcationDetails(token);
  const isExpired =
    new Date(tokenDetails.creation_time.getTime() + 1.08e7) < Date.now();

  if (!isExpired) {
    await dbconn.verifyUser(token);

    return res.json({
      error: false,
      message: "User verified successfully",
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Token Expired",
    });
  }
});

// Jobs Routes
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

// TODO Implement transaction , contracts , payments routes

// Catcher
router.use("*", (_, res) => {
  return res.status(405).end();
});

module.exports = router;

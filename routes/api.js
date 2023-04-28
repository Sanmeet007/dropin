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
  try {
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

// Jobs Routes
router.get("/jobs", async (_, res) => {
  try {
    const jobs = await dbconn.listJobs();
    return res.json(jobs);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

router.post("/jobs/create", authenticateSession, async (req, res) => {
  try {
    const user = req.session.user;
    const uid = user.uid;

    const {
      title = null,
      description = null,
      budget = null,
      skillset = null,
    } = req.body;

    if (
      !title ||
      !description ||
      !budget ||
      !skillset ||
      !Array.isArray(skillset)
    )
      return res.status(400).json({
        error: true,
        message: "Bad request",
      });

    if (user.account_type === "client") {
      await dbconn.createJob(uid, {
        title,
        description,
        budget,
        skillset,
      });
      return res.json({
        error: false,
        message: "Job Created successfully",
      });
    } else {
      return res.status(403).json({
        error: true,
        message: "Only a client can creat jobs",
      });
    }
  } catch (E) {
    console.log(E);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

router.post(
  "/jobs/update-details/:id",
  authenticateSession,
  async (req, res) => {
    try {
      const user = req.session.user;
      const uid = user.uid;
      const jobId = parseInt(req.params.id);
      if (!jobId || jobId === NaN) return res.status(400).end();

      const {
        title = null,
        description = null,
        budget = null,
        skillset = null,
      } = req.body;

      if (skillset != null && !Array.isArray(skillset)) {
        return res.status(400).json({
          error: true,
          message: "Bad request",
        });
      }

      if (user.account_type === "client") {
        const obj = {
          title,
          description,
          budget,
          skillset,
        };
        obj.skillset = obj?.skillset?.join(",") ?? null;
        await dbconn.updateJobDetails(uid, jobId, objectCleaner(obj));
        return res.json({
          error: false,
          message: "Job updated successfully",
        });
      } else
        return res.status(400).json({
          error: true,
          message: "Only Specific client can update a job",
        });
    } catch (E) {
      console.log(E);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

router.get("/jobs/get-details/:id", async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (!jobId || jobId === NaN)
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
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

// Proposals Routes

router.get(
  "/jobs/get-proposals/:id", // get all proposals for job_id
  authenticateSession,
  async (req, res) => {
    try {
      const user = req.session.user;
      if (user.account_type !== "client")
        return res.status(403).json({
          error: true,
          message: "Only client can read proposals for a job",
        });

      const jobId = parseInt(req.params.id);
      if (!jobId || jobId === NaN) return res.status(400).end();
      const results = await dbconn.getAllProposalsByJobId(user.uid, jobId);
      return res.json(results ? results : []);
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

router.post(
  "/proposals/create/:job_id", // create proposal for job  using  job_id
  authenticateSession,
  async (req, res) => {
    try {
      const user = req.session.user;
      const jobId = parseInt(req.params.job_id);
      if (!jobId || jobId === NaN) return res.status(400).end();

      if (user.account_type !== "freelancer")
        return res.status(400).json({
          error: true,
          message: "Only freelancers can submit proposals to a job",
        });

      const {
        cover_letter = null,
        timeframe = null,
        bid_amount = null,
      } = req.body;

      if (!cover_letter || !timeframe || !bid_amount)
        return res.status(400).json({
          error: true,
          message: "Bad request",
        });

      await dbconn.createProposal(uid, jobId, objectCleaner(obj));
      return res.json({
        error: false,
        message: "Proposal created for job successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

router.post(
  "/proposals/update-details/:id", // updates proposal details using  proposal_id
  authenticateSession,
  async (req, res) => {
    try {
      const user = req.session.user;
      if (user.account_type !== "freelancer")
        return res.status(403).json({
          error: true,
          message: "Invalid request",
        });
      const id = parseInt(req.params.id);
      if (!id || id === NaN) return res.status(400).end();

      const obj = {
        cover_letter,
        timeframe,
        bid_amount,
      };

      await dbconn.updateProposalDetails(user.uid, id, objectCleaner(obj));
      return res.json({
        error: false,
        message: "Proposal details updated successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

// Submit job

router.post("/jobs/submit/:id", authenticateSession, async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    if (!jobId || jobId === NaN) return res.status(400).end();

    const user = req.session.user;
    await dbconn.updateJobDetails(user.uid, jobId, {
      status: "closed",
    });
    const jobDetails = await dbconn.getJobDetails(jobId);

    await sendMail({
      subject: "Job Completed",
      senderName: "Team Dropin",
      recieverEmailId: jobDetails.client_email,
      recieverName: jobDetails.client_name,
      templateName: "jobcompletion",
      templateParams: {
        title: jobDetails.title,
        description: jobDetails.description,
        freelancer_name: user._name,
        freelancer_profile_image: user.profile_image,
        closed_at: jobDetails.closed_at,
      },
    });

    return res.json({
      error: false,
      message: "Job submitted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

// Contract routes

router.post(
  "/jobs/create-contract/:id",
  authenticateSession, // creates a contract using proposal_id
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || id === NaN) return res.status(400).end();
      const user = req.session.user;
      if (user.account_type !== "client")
        return res.status(403).json({
          error: false,
          message: "Only clients can create contracts",
        });
      await dbconn.createContract(id);
      return res.json({
        error: false,
        message: "Contract created successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

router.post(
  "/jobs/end-contract/:id", // ends contract for job using contract_id
  authenticateSession,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (!id || id === NaN) return res.status(400).end();

      await dbconn.endContract(id);
      return res.json({
        error: false,
        message: "Contract ended successfully",
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        error: true,
        message: "Something went wrong",
      });
    }
  }
);

// Transaction details for user
router.get(
  "/user/transaction-history",
  authenticateSession,
  async (req, res) => {
    const user = req.session.user;
    if (user.account_type === "client") {
      const history = await dbconn.getPaymentsHistoryByUserId(user.uid);
      return res.json(history);
    } else if (user.account_type === "freelancer") {
      const history = await dbconn.getWithdrawalHistoryByUserId(user.uid);
      return res.json(history);
    } else return res.status(400).end();
  }
);

// Catcher
router.use("*", (_, res) => {
  return res.status(405).end();
});

module.exports = router;

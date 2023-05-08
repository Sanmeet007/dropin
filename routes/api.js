const { dbconn } = require("../utils/dbconnect");
const express = require("express");
const { passwordHasher } = require("../utils/password_hasher");
const { authenticateSession } = require("../middlewares/auth");
const { generateToken } = require("../utils/generate_token");
const { sendMail } = require("../utils/sendmail");
const { objectCleaner } = require("../utils/object_cleaner");
const multer = require("multer");
const path = require("path");
const { User } = require("../models/users");
const { isEmailValid } = require("../utils/email_validator");

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
    const emailValidator = await isEmailValid(email);
    if (!emailValidator.valid)
      return res.status(400).json({
        error: true,
        message: "Suspicious Email detected",
      });

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
    console.log(e);
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
        summary = null,
      } = req.body;

      let profile_image = null;
      if (req.file) {
        const url = new URL(
          path.join(process.env.UPLOADS_DIR, req.file.filename),
          process.env.HOST_ADDR + ":" + process.env.PORT
        );
        profile_image = url.pathname;
      }
      const user = req.session.user;

      const basicObject = {
        first_name,
        last_name,
        location,
        bio,
        profile_image,
        gender,
        summary,
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
        name: user._name,
        verification_link:
          `${process.env.HOST_ADDR}:${process.env.PORT}/api/user/verify?token=` +
          token,
      },
    }); // working

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
      // return res.json({
      //   error: false,
      //   message: "User verified successfully",
      // });
      return res.redirect("/app");
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
    const jobs = await dbconn.listJobs({});
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
      if (!jobId || Number.isNaN(jobId)) return res.status(400).end();

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
        return res.status(403).json({
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

    if (!jobId || Number.isNaN(jobId))
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
      if (!jobId || Number.isNaN(jobId)) return res.status(400).end();
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
      if (!jobId || Number.isNaN(jobId)) return res.status(400).end();

      if (user.account_type !== "freelancer")
        return res.status(403).json({
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

      const obj = {
        cover_letter,
        timeframe,
        bid_amount,
      };

      await dbconn.createProposal(user.uid, jobId, objectCleaner(obj));
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
      if (!id || Number.isNaN(id)) return res.status(400).end();

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
    if (!jobId || Number.isNaN(jobId)) return res.status(400).end();

    const user = req.session.user;
    await dbconn.markJobAsCompleted(jobId);
    const jobDetails = await dbconn.getJobDetails(jobId);

    await sendMail({
      subject: "Job Completed",
      senderName: "Team Dropin",
      recieverEmailId: jobDetails.client_email,
      recieverName: jobDetails.client_name,
      templateName: "job_completion",
      templateParams: {
        job_title: jobDetails.title,
        job_description: jobDetails.description,
        freelancer_name: user._name,
        freelancer_profile_image: user.profile_image,
        closed_at: jobDetails.closed_at,
        client_name: jobDetails.client_name,
        client_profile_image: jobDetails.client_profile_image,
        client_email: jobDetails.client_email,
      },
    }); // working

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
      if (!id || Number.isNaN(id)) return res.status(400).end();
      /** @type {User} */
      const user = req.session.user;
      if (user.account_type !== "client")
        return res.status(403).json({
          error: false,
          message: "Only clients can create contracts",
        });
      await dbconn.createContract(id);
      const proposalDetails = await dbconn.getProposalDetailsById(id);

      await sendMail({
        senderName: "Team Dropin",
        subject: "Proposal accepted",
        recieverName: proposalDetails.freelancer_name,
        recieverEmailId: proposalDetails.freelancer_email,
        templateName: "proposal_accepted",
        templateParams: {
          job_title: proposalDetails.job_title,
          job_description: proposalDetails.job_description,
          client_name: user._name,
          client_email: user.email,
          client_profile_image: user.profile_image,
          freelancer_name: proposalDetails.freelancer_name,
          payment_amount: proposalDetails.payment_amount,
        },
      }); // working

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
      const user = req.session.user;

      const id = parseInt(req.params.id);
      if (!id || Number.isNaN(id)) return res.status(400).end();

      await dbconn.endContract(id);
      const details = await dbconn.getContractsDetailsById(id);
      const userDetails = await dbconn.getUserDetailsFromFeelancerId(
        details.freelancer_id
      );

      await sendMail({
        senderName: "Team Dropin",
        subject: "Contract Ended",
        recieverName: userDetails.fullname,
        recieverEmailId: userDetails.email,
        templateName: "contract_end",
        templateParams: {
          user_name: userDetails.fullname,
          job_id: details.job_id,
          job_title: details.job_title,
          job_description: details.job_description,
          client_name: user._name,
          client_email: user.email,
          client_profile_image: user.profile_image,
          payment_amount: details.payment_amount,
        },
      }); // working

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

// Payment & Withdrawal Routes

router.post(
  "/pay-money/:contract_id", // client pays for the contract
  authenticateSession,
  async (req, res) => {
    try {
      const user = req.session.user;
      const contract_id = parseInt(req.params.contract_id);
      if (!contract_id || Number.isNaN(contract_id))
        return res.status(400).end();

      const details = await dbconn.getContractsDetailsById(contract_id);

      const freelancer_details = await dbconn.getUserDetailsFromFeelancerId(
        details.freelancer_id
      );

      const { amount = null } = req.body;
      if (!amount) {
        await dbconn.setPaymentStatusByContractId(contract_id, "failed");

        await sendMail({
          senderName: "Team Dropin",
          subject: "Payment Failure",
          recieverEmailId: user.email,
          recieverName: user._name,
          templateName: "payment_failure",
          templateParams: {
            support_email: process.env.SMTP_USER,
            client_name: user._name,
            client_email: user.email,
            client_profile_image: user.profile_image,
            amount: amount,
            timestamp: new Date().toJSON(),
          },
        }); // working

        return res.status(400).json({
          error: true,
          message: "Payment failed",
        });
      }

      await dbconn.setPaymentStatusByContractId(contract_id, "success");

      await sendMail({
        senderName: "Team Dropin",
        subject: "Payment Success",
        recieverEmailId: freelancer_details.email,
        recieverName: freelancer_details.fullname,
        templateName: "payment_success",
        templateParams: {
          client_name: user._name,
          client_email: user.email,
          client_profile_image: user.profile_image,
          amount: amount,
          timestamp: new Date().toJSON(),
        },
      }); // working

      return res.json({
        error: false,
        message: "Payment processed successfully",
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

router.post("/withdraw-money", authenticateSession, async (req, res) => {
  /** @type {User} */
  const user = req.session.user;
  try {
    if (user.account_type !== "freelancer")
      return res.status(403).json({
        error: true,
        message: "Only freelancers can withdraw money",
      });

    const amount = req.body.amount;

    if (amount < 10) {
      await sendMail({
        senderName: "Team Dropin",
        subject: "Withdraw Failure",
        recieverEmailId: user.email,
        recieverName: user._name,
        templateName: "withdraw_failure",
        templateParams: {
          support_email: process.env.SMTP_USER,
          name: user._name,
          email: user.email,
          reason: "Amount lesser than minimum withdrawal amount",
        },
      });

      return res.status(400).json({
        error: true,
        message: "Cannot withdraw amount less than $10",
      });
    }

    await dbconn.withdrawMoney(user.uid, amount);
    await sendMail({
      senderName: "Team Dropin",
      subject: "Withdraw Success",
      recieverEmailId: user.email,
      recieverName: user._name,
      templateName: "withdraw_success",
      templateParams: {
        name: user._name,
        email: user.email,
        amount,
      },
    });
    return res.json({
      error: false,
      message: "Money withdraw successfully",
    });
  } catch (e) {
    if (e.sqlState === "45000") {
      if (e.sqlMessage === "INS_BAL") {
        await sendMail({
          senderName: "Team Dropin",
          subject: "Withdraw Failure",
          recieverEmailId: user.email,
          recieverName: user._name,
          templateName: "withdraw_failure",
          templateParams: {
            support_email: process.env.SMTP_USER,
            name: user._name,
            email: user.email,
            reason: "Insufficient Balance",
          },
        });

        return res.status(400).json({
          error: true,
          message: "Insufficient Balance",
        });
      } else if (e.sqlMessage === "INV_USR") {
        return res.status(400).json({
          error: true,
          message: "Invalid User",
        });
      } else if (e.sqlMessage === "MIN_BAL") {
        return res.status(400).json({
          error: true,
          message: "Can't withdraw amount lesser than $10",
        });
      }
    }
    console.log(e);
    return res.status(500).json({
      error: true,
      message: "Something went wrong",
    });
  }
});

router.post("/payment-failure", authenticateSession, async (req, res) => {
  const user = req.session.user;
  const amount = req.body.amount;

  await sendMail({
    senderName: "Team Dropin",
    subject: "Payment failure",
    recieverEmailId: user.email,
    recieverName: user._name,
    templateParams: {
      client_name: user._name,
      client_email: user.email,
      client_profile_image: user.profile_image,
      amount: amount,
      timestamp: new Date().toJSON(),
      support_email: process.env.SMTP_USER,
    },
    templateName: "payment_failure",
  });

  return res.json({
    error: false,
    message: "Mail sent successfully",
  });
});

router.post("/withdraw-failure", authenticateSession, async (req, res) => {
  const user = req.session.user;
  const amount = req.body.amount;

  await sendMail({
    senderName: "Team Dropin",
    subject: "Withdraw failure",
    recieverEmailId: user.email,
    recieverName: user._name,
    templateParams: {
      name: user._name,
      email: user.email,
      reason: "Something went wrong at server side.",
      support_email: process.env.SMTP_USER,
    },
    templateName: "withdraw_failure",
  });

  return res.json({
    error: false,
    message: "Mail sent successfully",
  });
});

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

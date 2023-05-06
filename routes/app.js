const express = require("express");
const router = express.Router();
const { dbconn } = require("../utils/dbconnect");
const authenticateSession = require("../middlewares/front_auth");
const { clientOnly, freelancerOnly } = require("../middlewares/protected");

router.get("/", authenticateSession, (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Dashboard - Dropin",
    heading: "Dashboard",
    view: "index",
  });
});

router.get("/jobs", authenticateSession, freelancerOnly, async (req, res) => {
  const user = req.session.user;

  let jobs = await dbconn.listJobs({ type: "open" });
  const proposals = await dbconn.getAllProposalsByUserId(user.uid);

  const jobProposals = proposals?.map((x) => x.job_id);

  jobs = jobs?.map((job) => {
    return { ...job, proposal_sent: jobProposals?.includes(job.id) };
  });
  return res.render("app", {
    user: req.session.user,
    title: "Jobs - Dropin",
    heading: "Job Listings",
    view: "jobs",
    jobs: jobs,
  });
});

router.get("/post-job", authenticateSession, clientOnly, async (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Jobs - Dropin",
    heading: "Post Job",
    view: "post-job",
  });
});

router.get(
  "/posted-jobs",
  authenticateSession,
  clientOnly,
  async (req, res) => {
    const user = req.session.user;
    const postedJobs = await dbconn.getAllJobsByUserId(user.uid);

    return res.render("app", {
      user: req.session.user,
      title: "Jobs - Dropin",
      heading: "Posted Jobs",
      view: "jobs",
      postedJobs: postedJobs,
    });
  }
);

router.get(
  "/jobs/:id",
  authenticateSession,
  freelancerOnly,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) return res.redirect("/jobs");
    const user = req.session.user;

    const proposals = await dbconn.getAllProposalsByUserId(user.uid);

    const jobDetails = await dbconn.getJobDetails(id);

    if (!jobDetails) return res.redirect("/jobs");

    if (proposals?.map((x) => x.job_id).includes(jobDetails.id)) {
      jobDetails.proposal_sent = true;
    } else {
      jobDetails.proposal_sent = false;
    }

    return res.render("app", {
      user: req.session.user,
      title: jobDetails.title + " - Dropin",
      heading: "Job Details",
      view: "job-details",
      jobDetails,
    });
  }
);

router.get(
  "/posted-job/:id",
  authenticateSession,
  clientOnly,
  async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) return res.redirect("/posted-jobs");
    const jobDetails = await dbconn.getJobDetails(id);
    return res.render("app", {
      user: req.session.user,
      title: jobDetails.title + " - Dropin",
      heading: "Job Details",
      view: "job-details",
      jobDetails,
    });
  }
);

router.get("/proposals", authenticateSession, async (req, res) => {
  const user = req.session.user;
  let proposals = await dbconn.getAllProposalsForPostedJobs(user.uid);

  if (proposals) {
    proposals = proposals.filter((x) => x.status !== "accepted");
  }
  return res.render("app", {
    user: req.session.user,
    title: "Proposals - Dropin",
    heading: "Proposals",
    view: "proposals",
    proposals,
  });
});

router.get(
  "/freelancer-details",
  authenticateSession,
  clientOnly,
  async (req, res) => {
    const fid = parseInt(req.query.id);
    if (!fid) return res.redirect("/app");

    const user_details = await dbconn.getUserDetailsFromFeelancerId(fid);

    user_details.hashedPassword = null;
    user_details._name = user_details.fullname;
    user_details._age = user_details.age;

    return res.render("app", {
      user: req.session.user,
      title: "Freelancer Details - Dropin",
      heading: "Freelancer Details",
      view: "user-details",
      user_details: user_details,
    });
  }
);

router.get(
  "/client-details",
  authenticateSession,
  freelancerOnly,
  async (req, res) => {
    const cid = parseInt(req.query.id);
    if (!cid) return res.redirect("/app");

    const user_details = await dbconn.getUserDetailsFromClientId(cid);

    user_details.hashedPassword = null;
    user_details._name = user_details.fullname;
    user_details._age = user_details.age;

    return res.render("app", {
      user: req.session.user,
      title: "Client Details - Dropin",
      heading: "Client Details",
      view: "user-details",
      user_details: user_details,
    });
  }
);

router.get("/my-account", authenticateSession, (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "My Account - Dropin",
    heading: "Mange Account",
    view: "my-account",
  });
});

router.get("/my-account/edit", authenticateSession, (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Edit Account Details - Dropin",
    heading: "Edit account details",
    view: "edit-user-details",
  });
});

router.get(
  "/balance",
  authenticateSession,
  freelancerOnly,
  async (req, res) => {
    return res.render("app", {
      user: req.session.user,
      title: "Balance - Dropin",
      heading: "Balance",
      view: "balance",
      balance: req.session.user.balance,
    });
  }
);

router.get("/payments", authenticateSession, clientOnly, async (req, res) => {
  const user = req.session.user;
  if (user.account_type !== "client") return res.redirect("/app");

  const payments = await dbconn.getPaymentsHistoryByUserId(user.uid);

  return res.render("app", {
    user: req.session.user,
    title: "Payments - Dropin",
    heading: "Payments",
    view: "balance",
    payments,
  });
});

router.get("/contracts", authenticateSession, async (req, res) => {
  const contracts = await dbconn.getAllContractsByUserId(req.session.user.uid);

  return res.render("app", {
    user: req.session.user,
    title: "Contracts - Dropin",
    heading: "Contracts",
    view: "contracts",
    contracts: contracts,
  });
});
router.get("/contracts/:id", authenticateSession, async (req, res) => {
  const contract_id = parseInt(req.params.id);

  if (!contract_id) return res.redirect("/app/contracts");

  const contractDetails = await dbconn.getContractsDetailsById(contract_id);

  return res.render("app", {
    user: req.session.user,
    title: "Contracts - Dropin",
    heading: "Contracts",
    view: "contract-details",
    contractDetails,
  });
});

module.exports = router;

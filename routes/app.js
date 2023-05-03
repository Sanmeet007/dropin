const express = require("express");
const router = express.Router();
const { dbconn } = require("../utils/dbconnect");
const authenticateSession = require("../middlewares/front_auth");

router.get("/", authenticateSession, (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Dashboard - Dropin",
    heading: "Dashboard",
    view: "index",
  });
});

router.get("/jobs", authenticateSession, async (req, res) => {
  const user = req.session.user;
  let jobs = await dbconn.listJobs({ type: "open" });
  const proposals = await dbconn.getAllProposalsByUserId(user.uid);

  const jobProposals = proposals.map((x) => x.job_id);

  jobs = jobs.map((job) => {
    return { ...job, proposal_sent: jobProposals.includes(job.id) };
  });
  return res.render("app", {
    user: req.session.user,
    title: "Jobs - Dropin",
    heading: "Job Listings",
    view: "jobs",
    jobs: jobs,
  });
});

router.get("/jobs/:id", authenticateSession, async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.redirect("/jobs");
  const user = req.session.user;

  const proposals = await dbconn.getAllProposalsByUserId(user.uid);

  const jobDetails = await dbconn.getJobDetails(id);
  if (proposals.map((x) => x.job_id).includes(jobDetails.id)) {
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

router.get("/balance", async (req, res) => {
  if (req.session.user) {
    return res.render("app", {
      user: req.session.user,
      title: "Balance - Dropin",
      heading: "Balance",
      view: "balance",
      balance: req.session.user.balance,
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

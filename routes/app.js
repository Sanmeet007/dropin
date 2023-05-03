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

router.get("/proposals", authenticateSession, async (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Proposals - Dropin",
    heading: "Proposals",
    view: "proposals",
  });
});

router.get("/my-account", authenticateSession, (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "My Account - Dropin",
    heading: "Mange Account",
    view: "my-account",
  });
});

router.get("/balance", authenticateSession, async (req, res) => {
  return res.render("app", {
    user: req.session.user,
    title: "Balance - Dropin",
    heading: "Balance",
    view: "balance",
    balance: req.session.user.balance,
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

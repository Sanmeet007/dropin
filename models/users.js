const { ProposalsDetails } = require("./proposal");
const { Contract } = require("./contract");
const { Payment } = require("./payment");
const { Withdraw } = require("./withdraw");

class PostedJob {
  /** @type {number} */ job_id;
  /** @type {string} */ title;
  /** @type {string} */ description;
  /** @type {number} */ proposals_count;
  /** @type {number} */ budget;
  /** @type {string} */ status;
  /** @type {Date} */ creatd_at;
  /** @type {Date?} */ closed_at;

  constructor(d) {
    this.job_id = d.job_id;
    this.title = d.title;
    this.description = d.description;
    this.proposal_count = d.proposal_count;
    this.budget = d.budget;
    this.status = d.status;
    this.creatd_at = d.creatd_at;
    this.closed_at = d.closed_at;
  }

  static fromData(json) {
    return new PostedJob(json);
  }
}

class User {
  /** @type {number} */ uid;
  /** @type {string} */ first_name;
  /** @type {string} */ last_name;
  /** @type {string} */ email;
  /** @type {string} */ hashedPassword;
  /** @type {string} */ location;
  /** @type {string} */ bio;
  /** @type {string} */ profile_image;
  /** @type {string} */ account_type;
  /** @type {string} */ gender;
  /** @type {string} */ summary;
  /** @type {boolean} */ verified;

  /**
   * @type {Date}
   * @private
   * */ #dob;

  get age() {
    return new Date().getFullYear - this.#dob.getFullYear();
  }

  get fullname() {
    return `${this.first_name}  ${this.last_name}`;
  }

  constructor({
    user_id,
    first_name,
    last_name,
    email,
    password,
    location,
    bio,
    account_type,
    gender,
    dob,
    summary,
    profile_image = null,
    verified = false,
  }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.uid = user_id;
    this.account_type = account_type;
    this.#dob = dob;
    this.gender = gender;
    this.email = email;
    this.profile_image = profile_image;
    this.bio = bio;
    this.hashedPassword = password;
    this.location = location;
    this.verified = Boolean(verified);
    this.summary = summary;
  }
  /**
   *
   * @param {Object} json
   * @returns {User}
   */
  static fromData(json) {
    return new User(json);
  }
}

class FreelancerDetails {
  /** @type {number} */ freelancer_id;
  /** @type {string?} */ education;
  /** @type {Array<string>?} */ skills;
  /** @type {Array<string>?} */ programming_languages;
  /** @type {Array<string>?} */ languages;
  /** @type {Array<string>?} */ databases;
  /** @type {Array<string>?} */ other_skills;

  constructor(d) {
    this.freelancer_id = d.freelancer_id;
    this.skills = d.skills?.split(",") ?? null;
    this.programming_languages = d.programming_languages?.split(",") ?? null;
    this.databases = d.databases?.split(",");
    this.other_skills = d.other_skills?.split(",") ?? null;
    this.education = d.education;
    this.languages = d.languages?.split(",") ?? null;
  }
}

class Freelancer extends User {
  /** @type {number} */ balance;
  /** @type {Array<Contract>} */ contracts;
  /** @type {Array<ProposalsDetails>} */ job_proposals;
  /** @type {Array<Withdraw>} */ withdraw_history;
  /** @type {FreelancerDetails} */ details;
  constructor(d) {
    super(d);
    this.balance = d.balance;
    this.contracts = d?.contracts?.map(Contract.fromData) ?? null;
    this.withdraw_history = d?.withdraw_history?.map(Withdraw.fromData) ?? null;
    this.job_proposals =
      d?.job_proposals?.map(ProposalsDetails.fromData) ?? null;
    this.details = new FreelancerDetails(d);
  }
  static fromData(d) {
    this.balance = d.balance;
    return new Freelancer(d);
  }
}

class ClientDetails {
  /** @type {number} */ client_id;
  /** @type {string} */ company_name;
  /** @type {string} */ company_website;
  /** @type {string} */ company_size;
  /** @type {string} */ industry;

  constructor(d) {
    this.client_id = d.client_id;
    this.company_name = d.company_name;
    this.company_website = d.company_website;
    this.company_size = d.company_size;
    this.industry = d.industry;
  }
}

class Client extends User {
  /** @type {Array<Contract>} */ contracts;
  /** @type {Array<PostedJob>} */ postedJobs;
  /** @type {Array<Payment>} */ payment_history;
  /** @type {ClientDetails} */ details;
  constructor(d) {
    super(d);
    this.contracts = d?.contracts.map(Contract.fromData) ?? null;
    this.payment_history = d?.payment_history.map(Payment.fromData) ?? null;
    this.postedJobs = d?.posted_jobs.map(PostedJob.fromData) ?? null;
    this.details = new ClientDetails(d);
  }
  static fromData(d) {
    return new Client(d);
  }
}

module.exports = {
  User,
  Client,
  ClientDetails,
  Freelancer,
  FreelancerDetails,
};

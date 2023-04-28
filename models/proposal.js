class ProposalsDetails {
  /** @type {number} */ proposal_id;
  /** @type {number} */ user_id;
  /** @type {number} */ job_id;
  /** @type {string} */ cover_letter;
  /** @type {Date} */ created_at;
  /** @type {number} */ timeframe;
  /** @type {status} */ status;
  /** @type  {string}*/ freelancer_id;
  /** @type  {string}*/ freelancer_name;
  /** @type  {string}*/ freelancer_email;
  /** @type  {string}*/ freelancer_profile_image;
  /** @type  {string}*/ job_title;

  constructor(d) {
    this.cover_letter = d.cover_letter;
    this.created_at = d.created_at;
    this.job_id = d.job_id;
    this.timeframe = d.timeframe;
    this.proposal_id = d.proposal_id;
    this.user_id = d.user_id;
    this.status = d.status;
    this.job_title = d.title;
    this.freelancer_id = d.freelancer_id;
    this.freelancer_profile_image = d.profile_image;
    this.freelancer_name = d.name;
    this.freelancer_email = d.email;
  }

  static fromData(json) {
    return new ProposalsDetails(json);
  }
}

module.exports = { ProposalsDetails };

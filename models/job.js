const { ClientDetails } = require("./users");

class JobDetails {
  /** @type {number} */ uid;
  /** @type {number} */ id;
  /** @type {ClientDetails} */ client_details;
  /** @type {number} */ budget;
  /** @type {string} */ status;
  /** @type {Date} */ created_at;
  /** @type {string} */ description;
  /** @type {string} */ title;
  /** @type {string?} */ client_profile_image;
  /** @type {boolean} */ is_user_verified;
  /** @type {string} */ client_email;
  /** @type {string} */ client_name;
  /** @type {Array<string>?} */ required_skillset;
  /** @type {Date} */ closed_at;
  /** @type {Date} */ created_at;

  constructor(d) {
    this.created_at = d.created_at;
    this.closed_at = d?.closed_at ?? null;
    this.uid = d.user_id;
    this.id = d.job_id;
    this.required_skillset = d?.skillset?.split(",") ?? null;
    this.client_details = new ClientDetails({
      client_id: d.client_id,
      company_name: d.company_name,
      company_size: d.company_size,
      industry: d.industry,
      company_website: d.company_website,
    });

    this.status = d.status;
    this.created_at = new Date(d.created_at);
    this.budget = parseFloat(d.budget);
    this.title = d.title;
    this.description = d.description;
    this.client_profile_image = d?.profle_image ?? null;
    this.is_user_verified = d.verified;
    this.client_email = d.email;
    if (d.last_name) {
      this.client_name = d.first_name + " " + d.last_name;
    } else this.client_name = d.first_name;
  }
  static fromData(json) {
    return new JobDetails(json);
  }
}

module.exports = {
  JobDetails,
};

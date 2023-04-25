class JobDetails {
  /** @type {number} */ id;
  /** @type {ClientDetails} */ client_details;
  /** @type {number} */ budget;
  /** @type {string} */ status;
  /** @type {Date} */ created_at;
  /** @type {string} */ description;
  /** @type {string} */ title;

  constructor(d) {
    // this.client_details = new ClientDetails(d.details);
  }
  static fromData(json) {
    return new JobDetails(json);
  }
}

module.exports = {
  JobDetails,
};

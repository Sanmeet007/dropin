class Contract {
  /** @type {number} */ contract_id;
  /** @type {number} */ freelancer_id;
  /** @type {number} */ job_id;
  /** @type {number} */ payment_amount;
  /** @type {number} */ end_date;
  /** @type {number} */ start_date;
  /** @type {string} */ job_title;
  /** @type {string} */ job_description;

  constructor(d) {
    this.contract_id = d.contract_id;
    this.job_title = d.title;
    this.job_description = d.description;
    this.freelancer_id = d.freelancer_id;
    this.job_id = d.job_id;
    this.payment_amount = d.payment_amount;
    this.end_date = d.end_date;
    this.start_date = d.start_date;
    this.job_status = d.job_status;
  }
  static fromData(json) {
    return new Contract(json);
  }
}

module.exports = { Contract };

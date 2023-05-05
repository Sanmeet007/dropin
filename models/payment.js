class Payment {
  /** @type {number} */ id;
  /** @type {number} */ job_id;
  /** @type {number} */ contract_id;
  /** @type {number} */ amount;
  /** @type {string} */ status;
  /** @type {Date} */ created_at;
  /** @type {Date} */ updated_at;
  /** @type {string} */ job_title;
  /** @type {string} */ job_description;

  constructor(d) {
    this.id = d.id;
    this.job_id = d.job_id;
    this.amount = d.amount;
    this.status = d.status;
    this.created_at = d.created_at;
    this.updated_at = d.updated_at;
    this.job_description = d.description;
    this.job_title = d.title;
    this.contract_id = d.contract_id;
  }

  static fromData(json) {
    return new Payment(json);
  }
}

module.exports = { Payment };

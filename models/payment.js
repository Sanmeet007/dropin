class Payment {
  /** @type {number} */ id;
  /** @type {number} */ job_id;
  /** @type {number} */ amount;
  /** @type {string} */ status;
  /** @type {Date} */ created_at;
  /** @type {Date} */ updated_at;

  constructor(d) {
    this.id = d.id;
    this.job_id = d.job_id;
    this.amount = d.amount;
    this.status = d.status;
    this.created_at = d.created_at;
    this.updated_at = d.updated_at;
  }

  static fromData(json) {
    return new Payment(json);
  }
}

module.exports = { Payment };

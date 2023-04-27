class ProposalsDetails {
  /** @type {number} */ proposal_id;
  /** @type {number} */ user_id;
  /** @type {number} */ job_id;
  /** @type {string} */ cover_letter;
  /** @type {Date} */ created_at;
  /** @type {number} */ timeframe;
  /** @type {status} */ status;

  constructor(d) {
    this.cover_letter = d.cover_letter;
    this.created_at = new Date(d.created_at);
    this.created_at = d?.created_at ?? null ? Date.parse(d.created_at) : null;

    this.job_id = d.job_id;
    this.timeframe = d.timeframe;
    this.proposal_id = d.proposal_id;
    this.user_id = d.user_id;
    this.status = d.status;
  }

  static fromData(json) {
    return new ProposalsDetails(json);
  }
}

module.exports = { ProposalsDetails };

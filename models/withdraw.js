class Withdraw {
  /** @type {number}*/ id;
  /** @type {number}*/ amount;
  /** @type {Date}*/ created_at;
  /** @type {Date}*/ updated_at;
  /** @type {string}*/ status;

  constructor(d) {
    this.id = d.id;
    this.amount = parseFloat(d.amount);
    this.created_at = d.created_at;
    this.updated_at = d.updated_at;
    this.status = d.status;
  }

  static fromData(json) {
    return new Withdraw(json);
  }
}

module.exports = { Withdraw };

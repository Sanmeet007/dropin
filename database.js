const md5 = require("crypto-md5");
const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const {
  User,
  FreelancerDetails,
  Freelancer,
  Client,
  ClientDetails,
} = require("./models/users");

const { JobDetails } = require("./models/job");
const { ProposalsDetails } = require("./models/proposal");
const { Contract } = require("./models/contract");
const { Payment } = require("./models/payment");
const { Withdraw } = require("./models/withdraw");
const { passwordHasher } = require("./utils/password_hasher");

conn.connect();

class DataBase {
  /** @type {mysql.Connection} */
  #conn;
  constructor() {
    this.#conn = conn;
  }

  close() {
    this.#conn.end();
  }

  async #query(query, fillvalue = []) {
    return new Promise((res, rej) => {
      this.#conn.query(query, fillvalue, (e, d) => {
        if (e instanceof Error) return rej(e);
        return res(d);
      });
    });
  }

  /**
   * Fetches all the users from the database
   * @returns {Promise<Array<User>?>}
   */
  async getAllUsers() {
    /** @type {Array} */
    const users = await this.#query(`SELECT * FROM users`);

    if (users && users.length > 0) {
      return users.map(User.fromData);
    } else return null;
  }

  /**
   *
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmailId(email) {
    const result = await this.#query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (result && result.length > 0) return User.fromData(result[0]);
    return null;
  }

  /**
   * Fetches details of user
   * @param {string} email_id
   * @returns {Promise<Client|Freelancer?>}
   */
  async getUserDetailsByEmailId(email_id) {
    /** @type {Array} */
    const result = await this.#query(`SELECT * FROM users where email = ?`, [
      email_id,
    ]);
    let uid = 0;
    if (result && result.length > 0) uid = result[0].user_id;
    else return null;

    const results = await this.#query(
      `SELECT account_type FROM users WHERE user_id = ? `,
      [uid]
    );
    if (results && results.length === 0) return null;
    const user_type = results[0].account_type;
    if (user_type === "freelancer") {
      const fullDetails = await this.#query(
        `SELECT * FROM users 
        NATURAL JOIN freelancers WHERE user_id = ?
      `,
        [uid]
      );

      const contracts = await this.#query(
        "select * from contracts natural join freelancers natural join users where user_id = ?",
        [uid]
      );
      const withdrawHistory = await this.#query(
        "select * from withdrawals natural join freelancers natural join users where user_id =?",
        [uid]
      );
      const jobProposals = await this.#query(
        "select * from proposals where user_id =?",
        [uid]
      );
      if (fullDetails)
        return Freelancer.fromData({
          ...fullDetails[0],
          withdraw_history: withdrawHistory,
          job_proposals: jobProposals,
          contracts,
        });
      else return null;
    } else if (user_type === "client") {
      const fullDetails = await this.#query(
        `SELECT * FROM users 
        NATURAL JOIN clients WHERE user_id = ?
      `,
        [uid]
      );

      const contracts = await this.#query(
        "select * from contracts natural join clients natural join users where user_id = ?",
        [uid]
      );
      const paymentHistory = await this.#query(
        "select  id,user_id ,  client_id, t.job_id,t.status , t.created_at  , t.updated_at, amount from payments t inner join jobs j on j.job_id = t.job_id natural join clients where user_id = ?",
        [uid]
      );

      const postedJobs = await this.#query(
        `select *,(select count(*)  from proposals t2 where job_id = t.job_id)  as 'proposal_count'
        from jobs t 
        join clients c where t.client_id = c.client_id
        and user_id = ?`,
        [uid]
      );

      if (fullDetails)
        return Client.fromData({
          ...fullDetails[0],
          payment_history: paymentHistory,
          posted_jobs: postedJobs,
          contracts,
        });
      else return null;
    } else {
      return null;
    }
  }

  /**
   * Fetches details of user
   * @param {number} uid
   * @returns {Promise<Client|Freelancer?>}
   */
  async getUserDetailsById(uid) {
    /** @type {Array} */
    const results = await this.#query(
      `SELECT account_type FROM users WHERE user_id = ? `,
      [uid]
    );
    if (results && results.length === 0) return null;
    const user_type = results[0].account_type;
    if (user_type === "freelancer") {
      const fullDetails = await this.#query(
        `SELECT * FROM users 
        NATURAL JOIN freelancers WHERE user_id = ?
      `,
        [uid]
      );

      const contracts = await this.#query(
        "select * from contracts natural join freelancers natural join users where user_id = ?",
        [uid]
      );
      const withdrawHistory = await this.#query(
        "select * from withdrawals natural join freelancers natural join users where user_id =?",
        [uid]
      );
      const jobProposals = await this.#query(
        "select * from proposals where user_id =?",
        [uid]
      );
      if (fullDetails)
        return Freelancer.fromData({
          ...fullDetails[0],
          withdraw_history: withdrawHistory,
          job_proposals: jobProposals,
          contracts,
        });
      else return null;
    } else if (user_type === "client") {
      const fullDetails = await this.#query(
        `SELECT * FROM users 
        NATURAL JOIN clients WHERE user_id = ?
      `,
        [uid]
      );

      const contracts = await this.#query(
        "select * from contracts natural join clients natural join users where user_id = ?",
        [uid]
      );
      const paymentHistory = await this.#query(
        "select  id,user_id ,  client_id, t.job_id,t.status , t.created_at  , t.updated_at, amount from payments t inner join jobs j on j.job_id = t.job_id natural join clients where user_id = ?",
        [uid]
      );

      const postedJobs = await this.#query(
        `select *,(select count(*)  from proposals t2 where job_id = t.job_id)  as 'proposal_count'
        from jobs t 
        join clients c where t.client_id = c.client_id
        and user_id = ?`,
        [uid]
      );

      if (fullDetails)
        return Client.fromData({
          ...fullDetails[0],
          payment_history: paymentHistory,
          posted_jobs: postedJobs,
          contracts,
        });
      else return null;
    } else {
      return null;
    }
  }

  /**
   * Fetches Client details
   * @param {Number} uid
   * @returns {Promise<ClientDetails?>}
   */
  async getClientDetails(uid) {
    const results = await this.#query(
      `SELECT * FROM clients WHERE user_id = ?`,
      [uid]
    );
    if (results && results.length > 0) return new ClientDetails(results[0]);
    else return null;
  }

  /**
   * Fetches Freelancer Details
   * @param {Number} uid
   * @returns {Promise<FreelancerDetails?>}
   */
  async getFreelancerDetails(uid) {
    const results = await this.#query(
      `SELECT * FROM freelancers WHERE user_id = ?`,
      [uid]
    );
    if (results && results.length > 0) return new FreelancerDetails(results[0]);
    else return null;
  }

  /**
   *
   * Creates a new user depending on the `account_type` i.e. user can be client or freelancer.
   *
   * @param {('freelancer'|'client')} account_type
   * @param {Object} details
   * @param {string} details.first_name
   * @param {string?} details.last_name
   * @param {string} details.password
   * @param {Date} details.dob
   * @param {string} details.email
   * @param {string?} details.location
   * @param {string?} details.bio
   * @param {string?} details.profile_image
   * @param {('male' | 'female')}  details.gender
   * @param {Array<string>}  details.skills
   * @param {Array<string?>} details.programming_languages
   * @param {Array<string?>} details.databases
   * @param {Array<string?>} details.languages
   * @param {Array<string?>} details.other_skills
   * @param {string?} details.education
   *
   * @param {string?} details.company_name,
   * @param {string?} details.company_website,
   * @param {number} details.company_size,
   * @param {string?} details.industry,
   *
   * @returns {Promise<boolean>}
   * */

  async createUser(account_type, details) {
    try {
      const hashedPassword = passwordHasher(details.password);
      const date = new Date(details.dob);

      if (account_type === "freelancer") {
        await this.#query(
          `
       CALL create_freelancer(?,?,?,?,?,?,?,?,?
      ,?, ? , ? , ? , ? , ?, ?);
      `,
          [
            details.first_name,
            details?.last_name ?? null,
            details.email,
            hashedPassword,
            details.location,
            details.bio,
            details.profile_image,
            details.gender,
            account_type,
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            details?.skills?.join(",") ?? null,
            details?.programming_languages?.join(",") ?? null,
            details?.databases?.join(",") ?? null,
            details?.languages?.join(",") ?? null,
            details?.other_skills?.join(",") ?? null,
            details?.education ?? null,
          ]
        );
        return true;
      } else if (account_type === "client") {
        await this.#query(
          `
        call create_client(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
      `,
          [
            details.first_name,
            details?.last_name ?? null,
            details.email,
            hashedPassword,
            details.location,
            details.bio,
            details.profile_image,
            details.gender,
            account_type,
            `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            details.company_name,
            details.company_website,
            details.company_size,
            details.industry,
          ]
        );
        return true;
      }
      return false;
    } catch (e) {
      const error = new Error(e.sqlMessage);
      Object.assign(error, e);
      throw error;
    }
  }

  /**
   * Deletes user from the database
   * @param {number} uid
   */
  async deleteUser(uid) {
    return await this.#query("DELETE FROM users where user_id = ?", [uid]);
  }

  /**
   *
   * @param {number} uid
   * @param {Object} details
   * @param {string?} details.first_name
   * @param {string?} details.last_name
   * @param {string?} details.email
   * @param {string?} details.location
   * @param {string?} details.bio
   * @param {string?} details.profile_image
   * @param {string?} details.gender
   *
   * @returns {Promise<void>}
   */
  async updateUserDetails(uid, details) {
    let query = "UPDATE users SET ";
    const entries = Object.entries(details);
    const params = [];
    if (entries.length === 0) return;

    entries.map(([k, v], i) => {
      if (i !== 0) {
        query += ",";
      }

      query += ` ${k} = ? `;
      params.push(v);
    });

    query += " WHERE user_id = ?";
    params.push(uid);

    await this.#query(query, params);
    return;
  }

  /**
   * Updates Client details by using user_id of the user
   *
   * @param {number} uid
   * @param {Object} details
   * @param {string?} details.company_name
   * @param {string?} details.company_website
   * @param {string?} details.industry
   * @param {number?} details.company_size
   * @returns
   */
  async updateClientDetails(uid, details) {
    let query = "UPDATE clients SET ";
    const entries = Object.entries(details);
    const params = [];
    if (entries.length === 0) return;

    entries.map(([k, v], i) => {
      if (i !== 0) {
        query += ",";
      }

      query += ` ${k} = ? `;
      params.push(v);
    });

    query += " WHERE user_id = ?";
    params.push(uid);

    await this.#query(query, params);
    return;
  }

  /**
   * Updates Freelancer details using user_id.
   *
   * @param {number} uid
   * @param {Object} details
   * @param {number} details.freelancer_id
   * @param {string?} details.education
   * @param {Array<string>?} details.skills
   * @param {Array<string>?} details.programming_languages
   * @param {Array<string>?} details.languages
   * @param {Array<string>?} details.databases
   * @param {Array<string>?} details.other_skills
   *
   * @returns {Promise<void>}
   */
  async updateFreelancingDetails(uid, details) {
    let query = "UPDATE freelancers SET ";
    const entries = Object.entries(details);
    const params = [];
    if (entries.length === 0) return;

    entries.map(([k, v], i) => {
      if (i !== 0) {
        query += ",";
      }

      query += ` ${k} = ? `;
      params.push(v);
    });

    query += " WHERE user_id = ?";
    params.push(uid);

    await this.#query(query, params);
    return;
  }

  /**
   * Sets the verification status of the user .
   * Sets it true by default i.e when called with all correct params user gets verified.
   *
   * @param {number} uid
   * @param {boolean} verified
   * @returns {Promise<void>}
   */
  async setUserVerfication(uid, verified = true) {
    await this.#query("UPDATE users SET verified = ? WHERE user_id = ?", [
      verified,
      uid,
    ]);
    return;
  }

  /**
   * Updates or changes password of user.
   *
   * NOTE : You don't have to hash the password. It handles hashing by itself  ( md5 )
   *
   * @param {number} uid
   * @param {string} password
   * @returns {Promise<void>}
   */
  async updateUserPassword(uid, password) {
    const hashedPassword = passwordHasher(password);
    await this.#query("UPDATE users SET password = ? WHERE user_id = ?", [
      hashedPassword,
      uid,
    ]);
    return;
  }

  /**
   *
   * Returns an Array of Jobs in database.
   * NOTE : It doesn't returns jobs based on status you need to filter it by yourself.
   * @param {number} limit
   * @param {number} offset
   * @param {boolean} latest
   *
   * @returns {Promise<Array<JobDetails>?>}
   */
  async listJobs(limit = 10, offset = 0, latest = true) {
    /** @type {Array?} */
    const result = await this.#query(
      `SELECT * FROM jobs NATURAL JOIN clients NATURAL JOIN users ORDER BY created_at ${
        latest ? "DESC" : "ASC"
      } LIMIT ?,?`,
      [offset, limit]
    );
    if (result && result.length > 0) return result.map(JobDetails.fromData);
    return null;
  }

  /**
   * Returns job details based on job_id passed as parama.
   *
   * @param {number} job_id
   * @returns {Promise<JobDetails>}
   */
  async getJobDetails(job_id) {
    const result = await this.#query(
      "SELECT * FROM jobs NATURAL JOIN clients NATURAL JOIN users WHERE job_id = ?",
      [job_id]
    );
    if (result && result.length > 0) return JobDetails.fromData(result[0]);
    return null;
  }

  /**
   * Creates a new job.
   *
   * @param {number} user_id
   * @param {Object} job_details
   * @param {string} job_details.title
   * @param {string}   job_details.description
   * @param {number}   job_details.budget
   * @param {Array<string>} job_details.skillset
   */
  async createJob(user_id, job_details) {
    await this.#query("call create_job(? ,? , ? , ? , ?)", [
      user_id,
      job_details.title,
      job_details.description,
      job_details.budget,
      job_details?.skillset?.join(",") ?? null,
    ]);
  }

  /**
   *
   * Updates Job Details.
   *
   * @param {number} job_id
   * @param {Object} job_details
   * @param {string} job_details.title
   * @param {string} job_details.description
   * @param {number} job_details.budget
   * @param {Array<String>} job_details.skillset
   * @param {('closed'|'open'|'progress')} job_details.status
   * @returns {Promise<void>}
   */
  async updateJobDetails(job_id, job_details) {
    job_details.skillset = job_details?.skillset?.join(",") ?? null;
    let query = "UPDATE jobs SET ";
    const entries = Object.entries(job_details);
    const params = [];
    if (entries.length === 0) return;

    entries.map(([k, v], i) => {
      if (i !== 0) {
        query += ",";
      }

      query += ` ${k} = ? `;
      params.push(v);
    });

    query += " WHERE job_id = ?";
    params.push(job_id);

    await this.#query(query, params);
    return;
  }

  /**
   * Delete the Job permanently from database.
   *
   * @param {number} job_id
   * @returns {Promise<void>}
   */
  async deleteJob(job_id) {
    await this.#query("DELETE FROM jobs WHERE job_id = ?", [job_id]);
    return;
  }

  /**
   *
   * Creates a proposal
   *
   * @param {number} user_id
   * @param {number} job_id
   * @param {Object} details
   *
   * @param {string} details.cover_letter
   * @param {number} details.timeframe
   * @param {number} details.bid_amount
   *
   * @returns {Promise<void>}
   */

  async createProposal(user_id, job_id, details) {
    await this.#query(`call create_proposal (?,?,?,?,?)`, [
      user_id,
      job_id,
      details.cover_letter,
      details.timeframe,
      details.bid_amount,
    ]);
    return;
  }

  /**
   *
   * Updates proposal details for a specific proposal
   *
   * @param {number} proposal_id
   *
   * @param {object} details
   * @param {string?} details.cover_letter
   * @param {number?} details.timeframe
   * @param {number?} details.bid_amount
   *
   * @returns {Promise<void>}
   */
  async updateProposalDetails(proposal_id, details) {
    let query = "UPDATE proposals SET ";
    const entries = Object.entries(details);
    const params = [];
    if (entries.length === 0) return;

    entries.map(([k, v], i) => {
      if (i !== 0) {
        query += ",";
      }

      query += ` ${k} = ? `;
      params.push(v);
    });

    query += " WHERE proposal_id = ?";
    params.push(proposal_id);

    await this.#query(query, params);
    return;
  }

  /**
   *
   * Deltes a proposal permanently from database
   *
   * @param {number} proposal_id
   * @returns {Promise<void>}
   */
  async deleteProposal(proposal_id) {
    await this.#query("DELETE FROM proposals WHERE proposal_id = ?", [
      proposal_id,
    ]);
    return;
  }

  /**
   *
   * Sets proposal status
   *
   * @param {number} proposal_id
   * @param {('accepted'|'declined'|'pending')} status
   * @returns {Promise<void>}
   */
  async setProposalStatus(proposal_id, status = "pending") {
    await this.#query("UPDATE proposals SET status = ? WHERE proposal_id = ?", [
      status,
      proposal_id,
    ]);
    return;
  }

  /**
   *
   * Returns all proposals to a specific job
   *
   * @param {number} job_id
   * @returns {Promise<Array<ProposalsDetails>?>}
   */

  async getAllProposalsByJobId(job_id) {
    /** @type {Array} */
    const users = await this.#query(
      `SELECT * FROM proposals where job_id = ?`,
      [job_id]
    );

    if (users && users.length > 0) {
      return users.map(ProposalsDetails.fromData);
    } else return null;
  }

  /**
   * Converts the job proposal to contract
   *
   * @param {number} proposal_id
   * @returns {Promise<void>}
   */
  async createContract(proposal_id) {
    await this.#query("call create_contract(?)", [proposal_id]);
    return;
  }

  /**
   *
   * Ends a contract with freelancer
   *
   * @param {number} contract_id
   * @returns
   */
  async endContract(contract_id) {
    await this.#query("call end_contract(?)", [contract_id]);
    return;
  }

  /**
   *
   * Marks job as completed using job_id param
   *
   * @param {number} job_id
   * @returns
   */
  async markJobAsCompleted(job_id) {
    await this.#query("call end_job(?)", [job_id]);
    return;
  }

  async getContractsDetailsById(contract_id) {
    const result = await this.#query(
      `select * from contracts c 
      inner join jobs j  on j.job_id = c.job_id where contract_id = ?`,
      [contract_id]
    );
    if (result && result.length > 0) return Contract.fromData(result[0]);
    return null;
  }
  async getAllContractsByUserId(user_id) {
    const result = await this.#query(
      `
      select * from contracts c inner join jobs j on c.job_id = j.job_id 
      join clients cl on cl.client_id = j.client_id
      join freelancers f on f.freelancer_id = c.freelancer_id
      where cl.user_id = ? OR  f.user_id  = ?
      `,
      [user_id, user_id]
    );
    if (result && result.length > 0) return result.map(Contract.fromData);
    return null;
  }

  async getWithdrawalHistoryByUserId(user_id) {
    const result = await this.#query(
      `
      select * from withdrawals natural join freelancers 
      natural join users where user_id = ?;
    `,
      [user_id]
    );
    if (result && result.length > 0) return result.map(Withdraw.fromData);
    return null;
  }
  async getPaymentsHistoryByUserId(user_id) {
    const result = await this.#query(
      `
      select p.status , p.created_at , p.updated_at , j.job_id , id , amount from payments p inner join jobs j on j.job_id = p.job_id 
      inner join clients c on c.client_id = j.client_id
      inner join users u on u.user_id = c.user_id 
      where c.user_id = ?;
    `,
      [user_id]
    );
    if (result && result.length > 0) return result.map(Payment.fromData);
    return null;
  }
  async getPaymentDetailsById(payment_id) {
    const result = await this.#query("SELECT * FROM payments WHERE id = ?", [
      payment_id,
    ]);
    if (result && result.length > 0) return Payment.fromData(result[0]);
    return null;
  }

  async getAllJobsByUserId(user_id) {
    const result = await this.#query(
      `
      select * from jobs j
      inner join clients c on  c.client_id = j.client_id
      where user_id = ?`,
      [user_id]
    );
    if (result && result.length > 0) return result.map(JobDetails.fromData);
    return null;
  }

  /**
   *
   * @param {number} contract_id
   * @param {('pending'|'failed'|'success')} status
   * @returns
   */
  async setPaymentStatusByContractId(contract_id, status) {
    await this.#query(
      `
        update payments 
        set status = ?
        where  job_id  = (select j.job_id from contracts  c
        inner join jobs j on  j.job_id = c.job_id  where c.contract_id = ?);
    `,
      [status, contract_id]
    );
    return;
  }
}

module.exports = DataBase;

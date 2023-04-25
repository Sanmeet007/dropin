// TODO : Implement user updates !

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
   * Fetches details of user
   * @returns {Promise<Client|Freelancer?>}
   */
  async getUserDetails(uid) {
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
      if (fullDetails) return Freelancer.fromData(fullDetails[0]);
      else return null;
    } else if (user_type === "client") {
      const fullDetails = await this.#query(
        `SELECT * FROM users 
        NATURAL JOIN clients WHERE user_id = ?
      `,
        [uid]
      );
      if (fullDetails) return Client.fromData(fullDetails[0]);
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
   * @param {string} account_type
   * @param {Object} details
   * @param {string} details.first_name
   * @param {string?} details.last_name
   * @param {string} details.password
   * @param {Date} details.dob
   * @param {string} details.email
   * @param {string?} details.location
   * @param {string?} details.bio
   * @param {string?} details.profile_image
   * @param {string}  details.gender
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
   * @returns {Promise<void>}
   * */

  async createUser(account_type, details) {
    const hashedPassword = md5(details.password, "hex");
    const date = details.dob;

    if (details.account_type === "freelancer") {
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
      return;
    } else {
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
      return;
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
    const hashedPassword = md5(password, "hex");
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
   */
  async createJob(user_id, job_details) {
    await this.#query("call create_job(? ,? , ? , ?)", [
      user_id,
      job_details.title,
      job_details.description,
      job_details.budget,
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
   * @returns {Promise<void>}
   */
  async updateJobDetails(job_id, job_details) {
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
}

module.exports = DataBase;

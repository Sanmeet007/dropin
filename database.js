// TODO : Implement user updates !

const md5 = require("crypto-md5");
const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

conn.connect();

class User {
  /** @type {number} */ uid;
  /** @type {string} */ first_name;
  /** @type {string} */ last_name;
  /** @type {string} */ email;
  /** @type {string} */ hashedPassword;
  /** @type {string} */ location;
  /** @type {string} */ bio;
  /** @type {string} */ profile_image;
  /** @type {string} */ account_type;
  /** @type {string} */ gender;
  /** @type {boolean} */ verified;

  /**
   * @type {Date}
   * @private
   * */ #dob;

  get age() {
    return new Date().getFullYear - this.#dob.getFullYear();
  }

  get fullname() {
    return `${this.first_name}  ${this.last_name}`;
  }

  constructor({
    user_id,
    first_name,
    last_name,
    email,
    password,
    location,
    bio,
    account_type,
    gender,
    dob,
    profile_image = null,
    verified = false,
  }) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.uid = user_id;
    this.account_type = account_type;
    this.#dob = dob;
    this.gender = gender;
    this.email = email;
    this.profile_image = profile_image;
    this.bio = bio;
    this.hashedPassword = password;
    this.location = location;
    this.verified = Boolean(verified);
  }
  /**
   *
   * @param {Object} json
   * @returns {User}
   */
  static fromData(json) {
    return new User(json);
  }
}

class FreelancerDetails {
  /** @type {number} */ freelancer_id;
  /** @type {string?} */ education;
  /** @type {Array<string>?} */ skills;
  /** @type {Array<string>?} */ programming_languages;
  /** @type {Array<string>?} */ languages;
  /** @type {Array<string>?} */ databases;
  /** @type {Array<string>?} */ other_skills;

  constructor(d) {
    this.freelancer_id = d.freelancer_id;
    this.skills = d.skills?.split(",") ?? null;
    this.programming_languages = d.programming_languages?.split(",") ?? null;
    this.databases = d.databases?.split(",");
    this.other_skills = d.other_skills?.split(",") ?? null;
    this.education = d.education;
    this.languages = d.languages?.split(",") ?? null;
  }
}

class Freelancer extends User {
  /** @type {FreelancerDetails} */ details;
  constructor(d) {
    super(d);
    this.details = new FreelancerDetails(d);
  }
  static fromData(d) {
    return new Freelancer(d);
  }
}

class ClientDetails {
  /** @type {number} */ client_id;
  /** @type {string} */ company_name;
  /** @type {string} */ company_website;
  /** @type {string} */ company_size;
  /** @type {string} */ industry;

  constructor(d) {
    this.client_id = d.client_id;
    this.company_name = d.company_name;
    this.company_website = d.company_website;
    this.company_size = d.company_size;
    this.industry = d.industry;
  }
}

class Client extends User {
  /** @type {ClientDetails} */ details;
  constructor(d) {
    super(d);
    this.details = new ClientDetails(d);
  }
  static fromData(d) {
    return new Client(d);
  }
}

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
   *
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
   *
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
   *
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
   *
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
}

module.exports = DataBase;

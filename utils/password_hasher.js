const md5 = require("crypto-md5");

/**
 *
 * @param {string} password
 *
 * @returns {string}
 */
const passwordHasher = (password) => {
  return md5(password, "hex");
};

module.exports = { passwordHasher };

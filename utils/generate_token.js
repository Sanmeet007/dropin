const generateToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = { generateToken };

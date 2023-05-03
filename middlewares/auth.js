const { dbconn } = require("../utils/dbconnect");

const authenticateSession = async (req, res, next) => {
  if (req.session.user != null) {
    const user = req.session.user;
    const s = await dbconn.getUserByEmailId(user.email);

    s._name = s.fullname;
    s._age = s.age;
    s.hashedPassword = null;

    return next();
  } else {
    return res.status(401).end();
  }
};

module.exports = { authenticateSession };

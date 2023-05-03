const { dbconn } = require("../utils/dbconnect");

const authenticateSession = async (req, res, next) => {
  if (req.session.user != null) {
    const user = req.session.user;
    const s = await dbconn.getUserDetailsById(user.uid);

    s._name = s.fullname;
    s._age = s.age;
    s.hashedPassword = null;

    req.session.user = s;
    return next();
  } else {
    return res.redirect("/?action=login");
  }
};

module.exports = authenticateSession;

const authenticateSession = (req, res, next) => {
  if (req.session.user != null) {
    return next();
  } else {
    return res.redirect("/?action=login");
  }
};

module.exports = authenticateSession;

const authenticateSession = (req, res, next) => {
  if (req.session.user != null) {
    return next();
  } else {
    return res.status(401).end();
  }
};

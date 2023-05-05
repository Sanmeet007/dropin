const clientOnly = (req, res, next) => {
  if (req.session.user.account_type === "client") {
    next();
  } else res.status(403).end();
};
const freelancerOnly = (req, res, next) => {
  if (req.session.user.account_type === "freelancer") {
    next();
  } else res.status(403).end();
};

module.exports = { clientOnly, freelancerOnly };

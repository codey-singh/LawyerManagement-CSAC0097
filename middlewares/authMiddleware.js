const jwt = require("jsonwebtoken");
const secret = process.env.AUTH_SECRET_KEY || "secretKey";
const authenticateMiddleware = function authMiddleware(req, res, next) {
  // user is valid and whats the role of particular user.
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(401);
    } else {
      console.log(user);
      req.user = { ...user, password: null };
      next();
    }
  });
};

const authorizationMiddleware = function authorizationMiddleware(roles) {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) === -1) {
      return res.sendStatus(401);
    } else {
      next();
    }
  };
};

module.exports = { authenticateMiddleware, authorizationMiddleware };

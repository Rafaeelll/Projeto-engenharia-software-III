const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.AUTH;

  if (token == null) {
    return res.status(401).json({ auth: false });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ auth: false });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

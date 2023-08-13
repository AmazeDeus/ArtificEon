// Middleware for verifying an existing access token in the headers using the token secret in the env file.
// passed into routes you want to protect (requiring a logged in account)

const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // grabbing access token. Splitting on the space ("bearer ") and grabbing the second value (the token itself)
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // Forbidden - This is when you need to send your refresh token to get a new access token. Will be automated with Redux.
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.username;
    req._id = decoded._id;
    next();
  });
};

module.exports = verifyJWT;

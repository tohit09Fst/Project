const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, "secret_key");
    req.userId = verified.userId;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

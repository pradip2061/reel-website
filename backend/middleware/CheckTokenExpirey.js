const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Token is valid", userid: decoded.id });
  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

module.exports = verifyToken;

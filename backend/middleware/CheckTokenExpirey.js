const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid" });
    }

    // ✅ Token is valid
    res.status(200).json({ message: "Token is valid"});
  });
};



module.exports = verifyToken
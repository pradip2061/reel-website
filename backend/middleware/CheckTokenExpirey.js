const jwt = require("jsonwebtoken");
const Sign = require("../model/SignUpModel");

const verifyToken = async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Sign.findById(decoded.id).select('following');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Token is valid", 
      userid: decoded.id, 
      following: user.following 
    });
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

module.exports = verifyToken;

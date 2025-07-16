// middlewares/checkCookieAuth.js

const jwt = require("jsonwebtoken");
const Sign = require("../model/SignUpModel");

const checkCookieAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Please login first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Find user by ID
    const user = await Sign.findById(decoded.id).select("Name profilepic");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // ✅ Attach user info to req.user
    req.user = {
      id: decoded.id,
      name: user.Name,
      profilepic:user.profilepic
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = checkCookieAuth;

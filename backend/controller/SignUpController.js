const bcrypt = require("bcryptjs");
const validator = require("validator");
const Sign = require("../model/SignUpModel");
const signup = async (req, res) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;
    console.log(email, password, confirmPassword, firstName, lastName);

    console.log(req.file);
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !req.file
    ) {
      return res.status(400).json({ message: "fill the form properly!" });
    }

    // 2. Email format validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await Sign.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // 6. Hash and Save
    const hashedPassword = await bcrypt.hash(password, 10);
    await Sign.create({
      email,
      password: hashedPassword,
      profilepic: req.file.path,
      Name: firstName + lastName,
      following:[],
      followers:[]
    });

    res.status(200).json({ message: "signup successfully!" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = signup;

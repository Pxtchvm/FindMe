const db = require("../config/db.config");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      universityId,
      email,
      password,
      firstName,
      lastName,
      role,
      mobileNumber,
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE university_id = ? OR email = ?",
      [universityId, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.execute(
      "INSERT INTO users (university_id, email, password, first_name, last_name, role, mobile_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        universityId,
        email,
        hashedPassword,
        firstName,
        lastName,
        role,
        mobileNumber,
      ]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Find user
    const [users] = await db.execute(
      "SELECT * FROM users WHERE university_id = ?",
      [universityId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        universityId: user.university_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};

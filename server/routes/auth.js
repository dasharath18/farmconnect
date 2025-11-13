const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Helper to generate token
const generateToken = (user) => 
{
  if (!process.env.JWT_SECRET) 
  {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Register
router.post("/register", async (req, res) => 
{
  const { name, email, phone, password, role } = req.body;

  try 
  {
    if (!name || !email || !phone || !password || !role) 
    {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(
    {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => 
  {
  const { email, password } = req.body;

  try 
  {
    if (!email || !password) 
    {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) 
    {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
    {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({
      token,
      user: 
      {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

  } catch (err) 
  {
    res.status(500).json({ error: err.message });
  }
});

// Update current user's profile
router.put("/me", authenticateToken, async (req, res) => 
{
  try 
  {
    const userId = req.user._id;
    const { name, email, phone } = req.body;

    // basic validation
    if (!name || !email) 
    {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If email has changed, optionally check uniqueness here
    if (email !== user.email) 
    {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already in use" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;

    await user.save();

    // return user without sensitive fields
    const safeUser = 
    {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.json(safeUser);
  } 
  catch (err) 
  {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    console.log("🔍 Registration request:", req.body);

    const { username, name, email, password } = req.body; // ✅ Include username
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ error: "User already registered" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log("❌ Username already taken");
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, name, email, password: hashedPassword });

    console.log("✅ User registered:", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
};




export const loginUser = async (req, res) => {
  try {
    console.log("🔍 Login request received:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ User authenticated:", user.email);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set token in a cookie
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" }); 
    console.log("🍪 Cookie set successfully!");

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


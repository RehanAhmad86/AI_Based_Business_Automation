import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      image: "dp.jpg",
      role: "admin",
    });

    await newUser.save();

    res.status(201).json({
      success:true,
      message: "New user created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ error: "An error occurred during sign-up" });
  }
};

export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const normalizedEmail = email.toLowerCase();
  
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          _id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        },
      });
    } catch (error) {
      console.error("Error in sign-in:", error);
      res.status(500).json({ error: "An error occurred during sign-in" });
    }
  };
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  console.log("Request Body:", req.body)
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" })

    const normalizedEmail = email.toLowerCase()

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      image: "dp.jpg",
      role: "admin",
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    )

    res.status(201).json({
      success: true,
      message: "New user created successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    })
  } catch (error) {
    console.error("Error in signup:", error)
    res.status(500).json({ error: "An error occurred during sign-up" })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const normalizedEmail = email.toLowerCase()

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    )

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        image: existingUser.image,
      },
    })
  } catch (error) {
    console.error("Error in sign-in:", error)
    res.status(500).json({ error: "An error occurred during sign-in" })
  }
}

export const oauthUser = async (req, res) => {
  try {
    const { uid, email, name, image, provider } = req.body

    if (!uid || !email || !name) {
      return res.status(400).json({ error: "Missing required OAuth data" })
    }

    const normalizedEmail = email.toLowerCase()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { firebaseUid: uid }],
    })

    if (existingUser) {
      // Update existing user with OAuth data if not already set
      if (!existingUser.firebaseUid) {
        existingUser.firebaseUid = uid
        existingUser.provider = provider
        if (image && !existingUser.image) {
          existingUser.image = image
        }
        await existingUser.save()
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "7d",
        },
      )

      return res.status(200).json({
        message: "OAuth login successful",
        token,
        user: {
          _id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          image: existingUser.image,
          provider: existingUser.provider,
        },
      })
    }

    // Create new user for OAuth
    const newUser = new User({
      name,
      email: normalizedEmail,
      firebaseUid: uid,
      image: image || "dp.jpg",
      role: "admin",
      provider,
      // No password for OAuth users
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    )

    res.status(201).json({
      success: true,
      message: "OAuth user created successfully",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
        provider: newUser.provider,
      },
    })
  } catch (error) {
    console.error("Error in OAuth:", error)
    res.status(500).json({ error: "An error occurred during OAuth authentication" })
  }
}

export const deleteUserAccount = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }

    const deletedUser = await User.findOneAndDelete({ email: email })

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      deletedUser: {
        name: deletedUser.name,
        email: deletedUser.email,
      },
    })
  } catch (error) {
    console.error("Account deletion error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

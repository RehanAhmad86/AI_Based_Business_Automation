import User from "../models/User.js"
import jwt from "jsonwebtoken"
import admin from "../config/firebaseAdmin.js"

export const githubAuth = async (req, res) => {
  try {
    console.log("GitHub OAuth request body:", req.body)

    const { firebaseUid, email, displayName, photoURL, idToken } = req.body

    if (!idToken) {
      return res.status(401).json({
        error: "Authentication token missing. Please log in again.",
      })
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken)
    console.log("Decoded Token:", decodedToken)

    const uid = firebaseUid || decodedToken.uid
    const userEmail = email || decodedToken.email || `github-${uid}@github.com`

    console.log("Looking for user with email:", userEmail)

    let user = await User.findOne({
      $or: [{ email: userEmail }, { firebaseUid: uid }],
    })

    if (!user) {
      console.log("Creating new GitHub user in MongoDB...")
      user = new User({
        firebaseUid: uid,
        email: userEmail,
        name: displayName || `GitHub User ${uid.substring(0, 8)}`,
        image: photoURL || "dp.jpg",
        role: "admin",
        provider: "github",
        isEmailVerified: decodedToken.email_verified || false,
        lastLogin: new Date(),
      })

      await user.save()
      console.log("New GitHub user saved:", user._id)
    } else {
      console.log("Existing user found:", user._id)

      const updateFields = {}
      if (user.name !== displayName && displayName) updateFields.name = displayName
      if (user.image !== photoURL && photoURL) updateFields.image = photoURL
      updateFields.lastLogin = new Date()

      if (Object.keys(updateFields).length > 0) {
        await User.updateOne({ firebaseUid: uid }, { $set: updateFields })
        // Refresh user object
        user = await User.findOne({ firebaseUid: uid })
      }
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    )

    return res.status(200).json({
      success: true,
      message: "GitHub login verified and user saved",
      token,
      user: {
        _id: user._id,
        uid: uid,
        email: userEmail,
        name: user.name,
        image: user.image,
        role: user.role,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
      },
    })
  } catch (error) {
    console.error("GitHub Auth Error:", error)
    return res.status(500).json({
      error: "Authentication or database error",
      details: error.message,
    })
  }
}

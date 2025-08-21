import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.firebaseUid
      },
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: "dp.jpg",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
    provider: {
      type: String,
      enum: ["email", "google", "github"],
      default: "email",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// userSchema.index({ email: 1 })
// userSchema.index({ firebaseUid: 1 })

const User = mongoose.model("User", userSchema)

export default User

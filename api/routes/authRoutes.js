import express from "express"
import { registerUser, loginUser, oauthUser, deleteUserAccount } from "../controllers/authController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)

router.post("/oauth", oauthUser)

router.delete("/delete-account", deleteUserAccount)

export default router

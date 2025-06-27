import express from "express"
import { githubAuth } from "../controllers/githubAuthController.js"

const router = express.Router()

router.post("/github", githubAuth)

export default router

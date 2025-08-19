import express from "express"
import { getPredefinedQuestions, executeQuery, processNaturalQuery } from "../controllers/dbQueryController.js"

const router = express.Router()

// Get predefined questions for all collections
router.get("/questions", getPredefinedQuestions)

// Execute a specific predefined query
router.post("/execute", executeQuery)

// Process natural language query
router.post("/natural", processNaturalQuery)

export default router

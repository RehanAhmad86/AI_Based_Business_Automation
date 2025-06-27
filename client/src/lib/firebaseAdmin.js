import admin from "firebase-admin"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Option 1: Using service account key file (recommended)
    const serviceAccountPath = join(__dirname, "./serviceAccountKey.json")
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    })

    console.log("Firebase Admin initialized successfully with service account file")
  } catch (error) {
    console.error("Error initializing Firebase Admin with service account file:", error)

    // Fallback to environment variables if file doesn't exist
    console.log("Falling back to environment variables...")
    // Ye dummy ha
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "business-automation-a8afe",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "business-automation-a8afe",
    })
  }
}

export default admin

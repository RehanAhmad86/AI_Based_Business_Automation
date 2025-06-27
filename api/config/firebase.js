// Firebase configuration
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCelrleKxbNHK0P5ZILQksYRc0myh0i_Zo",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "business-automation-a8afe.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "business-automation-a8afe",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "business-automation-a8afe.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "418387801537",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:418387801537:web:df2ce825ffaea26daeeb40",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize providers
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

// Configure providers
googleProvider.setCustomParameters({
  prompt: "select_account",
})

githubProvider.setCustomParameters({
  allow_signup: "true",
})

export default app

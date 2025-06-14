// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Auth module if needed for authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLfwgcI9GZnlcG0DNH8mQeeO4UnxgWHMU",
  authDomain: "ai-based-business-automation.firebaseapp.com",
  projectId: "ai-based-business-automation",
  storageBucket: "ai-based-business-automation.firebasestorage.app",
  messagingSenderId: "224794839841",
  appId: "1:224794839841:web:253d4544c1beb4254e0c60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth (optional, if you are using authentication)
const auth = getAuth(app);

// Export the app and auth to use in other parts of your app
export { app, auth };

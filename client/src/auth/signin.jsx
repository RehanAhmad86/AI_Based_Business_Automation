"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { signInSuccess } from "../redux/userSlice"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { signInWithPopup, GithubAuthProvider } from "firebase/auth"
import { auth, googleProvider, githubProvider } from "../../src/lib/firebase"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [oauthLoading, setOauthLoading] = useState({ google: false, github: false })
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Sign-in failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      dispatch(signInSuccess(data.user))
      navigate("/")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setOauthLoading((prev) => ({ ...prev, google: true }))
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      console.log("Firebase user object:", user)

      let userEmail = user.email
      if (!userEmail && user.providerData && user.providerData.length > 0) {
        userEmail = user.providerData[0].email
      }

      let displayName = user.displayName
      if (!displayName) {
        if (userEmail && userEmail.includes("@")) {
          displayName = userEmail.split("@")[0]
        } else {
          displayName = `User_${user.uid.substring(0, 8)}`
        }
      }

      const userData = {
        uid: user.uid,
        email: userEmail,
        name: displayName,
        image: user.photoURL || null,
        provider: "google",
        emailVerified: user.emailVerified,
      }

      console.log("Sending Google user data to backend:", userData)

      // Send user data to your backend
      const res = await fetch("http://localhost:5000/api/auth/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      const responseData = await res.json()
      console.log("Backend response:", responseData)

      if (!res.ok) {
        throw new Error(responseData.error || "Google sign-in failed")
      }

      localStorage.setItem("token", responseData.token)
      localStorage.setItem("user", JSON.stringify(responseData.user))
      dispatch(signInSuccess(responseData.user))
      navigate("/")
    } catch (error) {
      console.error("Google sign-in error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled")
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with the same email address but different sign-in credentials")
      } else {
        setError(error.message || "Failed to sign in with Google")
      }
    } finally {
      setOauthLoading((prev) => ({ ...prev, google: false }))
    }
  }

  const handleGithubSignIn = async () => {
    setOauthLoading((prev) => ({ ...prev, github: true }))
    setError("")

    try {
      const result = await signInWithPopup(auth, githubProvider)
      const credential = GithubAuthProvider.credentialFromResult(result)
      const user = result.user

      if (!credential) {
        throw new Error("GitHub credential is missing.")
      }

      const idToken = await user.getIdToken()
      const userEmail = user.email || `github-${user.uid}@github.com`
      const photoURL = user.photoURL

      console.log("GitHub user data:", {
        firebaseUid: user.uid,
        displayName: user.displayName,
        email: userEmail,
        photoURL: photoURL,
      })

      const res = await fetch("http://localhost:5000/api/auth/github", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebaseUid: user.uid,
          displayName: user.displayName,
          email: userEmail,
          photoURL: photoURL,
          idToken,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to save user to database")
      }

      const data = await res.json()
      console.log("GitHub Backend response:", data)

      const token = data.token || "github-auth-token" 
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(data.user))
      dispatch(signInSuccess(data.user))
      navigate("/")
    } catch (error) {
      console.error("GitHub sign-in error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in was cancelled")
      } else if (error.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with the same email address but different sign-in credentials")
      } else {
        setError(error.message || "Failed to sign in with GitHub")
      }
    } finally {
      setOauthLoading((prev) => ({ ...prev, github: false }))
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
      </div>

      {/* Social Login Options */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={oauthLoading.google || oauthLoading.github}
            className="group relative flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading.google ? (
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <FaGoogle className="text-xl text-red-600 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {oauthLoading.google ? "Signing in..." : "Google"}
            </span>
          </button>

          <button
            onClick={handleGithubSignIn}
            disabled={oauthLoading.google || oauthLoading.github}
            className="group relative flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {oauthLoading.github ? (
              <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <FaGithub className="text-xl text-gray-800 mr-2" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {oauthLoading.github ? "Signing in..." : "GitHub"}
            </span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <MdVisibilityOff className="h-5 w-5" /> : <MdVisibility className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || oauthLoading.google || oauthLoading.github}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-gray-500">Protected by advanced security measures</p>
        </div>
      </form>
    </div>
  )
}

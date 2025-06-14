import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { FaGithub, FaGoogle } from "react-icons/fa";
import AuthLayout from "./AuthLayout";
import { auth } from "../lib/firebase";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleSocialSignIn = async (provider) => {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
      
  //     // Send user data to backend
  //     const res = await fetch("/api/auth/social", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         uid: user.uid,
  //         email: user.email,
  //         displayName: user.displayName,
  //         photoURL: user.photoURL,
  //         provider: provider.providerId,
  //       }),
  //     });

  //     if (!res.ok) throw new Error("Social sign-in failed");
      
  //     const data = await res.json();
  //     dispatch(signInSuccess(data.user));
  //     navigate("/dashboard");
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Sign-in failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>
        
        <div className="flex gap-4 justify-center">
          <button
            // onClick={() => handleSocialSignIn(new GoogleAuthProvider())}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaGoogle className="text-xl text-red-600" />
          </button>
          <button
            // onClick={() => handleSocialSignIn(new GithubAuthProvider())}
            className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FaGithub className="text-xl text-gray-800" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-container">
          
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
              <label className="floating-label">Email</label>
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              className="input-field mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
            <label className="floating-label">Password</label>

          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
  );
}
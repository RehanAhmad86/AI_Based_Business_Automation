import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Server response:", data);
      if (!res.ok) {
        setError(data?.error || "Email signup failed");
        return;
      }

      if (!data.user) {
        setError("Signup failed: No user returned");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(signInSuccess(data.user));
      navigate("/");
    } catch (error) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
      </div>

      {/* Social Login Options */}
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="group relative flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 bg-white">
            <FaGithub className="text-xl text-gray-700 group-hover:text-gray-900" />
          </button>
          <button className="group relative flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 bg-white">
            <FcGoogle className="text-xl" />
          </button>
          <button className="group relative flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 bg-white">
            <MdEmail className="text-xl text-blue-600 group-hover:text-blue-700" />
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSignup} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <MdVisibilityOff className="h-5 w-5" />
              ) : (
                <MdVisibility className="h-5 w-5" />
              )}
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
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-green-600 hover:text-green-700 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-green-600 hover:text-green-700 underline">
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  );
}
import { useLocation, useNavigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignIn = location.pathname.includes("signin");

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Left Side (Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-white p-4">
        <Outlet /> {/* Important for rendering SignInPage or SignUpPage */}
      </div>

      {/* Right Side (Promo) */}
      <div className="hidden md:flex relative w-1/2 bg-gradient-to-tr from-teal-400 to-green-500 text-white items-center justify-center px-10">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">
            {isSignIn ? "New Here?" : "Welcome Back!"}
          </h2>
          <p className="text-lg">
            {isSignIn
              ? "Sign up to unlock exclusive features and content!"
              : "Sign in to access your personalized dashboard!"}
          </p>
          <button
            onClick={() =>
              navigate(isSignIn ? "/auth/signup" : "/auth/signin")
            }
            className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition"
          >
            {isSignIn ? "Create Account" : "Sign In Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

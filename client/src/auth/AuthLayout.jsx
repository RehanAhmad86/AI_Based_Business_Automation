import { useLocation, useNavigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignIn = location.pathname.includes("signin");

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center py-5 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Outlet />
          
          {/* Switch Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => navigate(isSignIn ? "/auth/signup" : "/auth/signin")}
                className="font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                {isSignIn ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-teal-800"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-16">
          <div className="w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-16">
          <div className="w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center px-12 py-12 text-white">
          <div className="max-w-md">
           
<div className="flex items-center justify-start">
  <div className="bg-white p-1 rounded-xl shadow-lg">
    <img 
      src="/automaflow.png" 
      alt="Automaflow Logo" 
      className="h-24 w-auto"
    />
  </div>
</div>



            {/* Dynamic Content */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                {isSignIn ? (
                  "New to our platform?"
                ) : (
                  "Good to see you again!"
                )}
              </h2>
              
              <p className="text-lg text-white/80 leading-relaxed">
                {isSignIn ? (
                  "Join thousands of users who trust us with their digital experience. Create your account and unlock amazing features today."
                ) : (
                  "We're excited to see you again today. Sign in to access your personalized dashboard and continue where you left off."
                )}
              </p>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">Secure & encrypted data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">24/7 customer support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-white/90">Free forever plan</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate(isSignIn ? "/auth/signup" : "/auth/signin")}
                className="inline-flex items-center px-6 py-3 border-2 border-white/30 text-white font-medium rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
              >
                {isSignIn ? "Create Account" : "Sign In Now"}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 right-16 w-3 h-3 bg-white/25 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
}
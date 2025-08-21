import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-gray-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Logo + Description */}
          <div className="lg:col-span-7">
            <div className="flex items-center mb-8 group">
              <div className="relative">
                <i className="fas fa-robot text-cyan-400 text-4xl mr-4 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"></i>
                <div className="absolute inset-0 bg-cyan-400 blur-lg opacity-20 animate-pulse"></div>
              </div>
              <span className="text-4xl font-black text-transparent bg-gradient-to-r from-white via-gray-100 to-cyan-200 bg-clip-text">
                Automa<span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Flow</span>
              </span>
            </div>
            
            <div className="relative">
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-2xl">
                AI-powered business automation that helps you work smarter, not harder.
                From sales forecasting to intelligent inventory management, AutomaFlow
                delivers insights and automation for modern businesses.
              </p>
              
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-8"></div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl w-full max-w-sm">
              <h3 className="text-xl font-bold text-white uppercase tracking-widest mb-8 relative">
                Explore
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              </h3>
              
              <nav className="space-y-4">
                <Link 
                  to="/about" 
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-700/30 hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="font-medium">About</span>
                </Link>
                
                <Link 
                  to="/privacy" 
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-700/30 hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="font-medium">Privacy Policy</span>
                </Link>
                
                <Link 
                  to="/terms" 
                  className="group flex items-center text-gray-300 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-gray-700/30 hover:translate-x-2"
                >
                  <span className="w-2 h-2 bg-cyan-400 rounded-full mr-4 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                  <span className="font-medium">Terms of Service</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t border-gradient-to-r from-transparent via-gray-700 to-transparent relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
          
          <div className="text-center">
            <p className="text-gray-400 text-lg font-medium">
              &copy; {new Date().getFullYear()} 
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text font-bold mx-2">
                AutomaFlow
              </span>
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
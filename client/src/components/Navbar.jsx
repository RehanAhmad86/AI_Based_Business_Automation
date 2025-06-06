import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useSelector } from 'react-redux'; 
import { Link } from 'react-router-dom'; // Using React Router for routing
//import { RootState } from "../redux/index"; // Assuming you have this Redux setup
import Image from 'react-bootstrap/Image'; // Assuming you're using react-bootstrap for images, else you can use `img` tag

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const user = useSelector((state) => state.user.currentUser); // Get user from redux

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <i className="fas fa-robot text-primary-600 text-2xl mr-2"></i>
              <span className="text-xl font-bold text-gray-900">
                Automa<span className="text-primary-600">Flow</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <Link to="#features" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Features
            </Link>
            <Link to="#how-it-works" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              How It Works
            </Link>
            <Link to="#testimonials" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Testimonials
            </Link>
            <Link to="#faq" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              FAQ
            </Link>
            <Link to="/chatbot" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              Chat
            </Link>
            <Link to="/PredictForm" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
              AI Tasks
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Get Started Button */}
            <Link to="#" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Get Started
            </Link>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <Image src={user?.image || '/dp.jpg'} alt="User" height={40} width={40} className="w-8 h-8 rounded-full" />
                <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                <FaChevronDown className="text-gray-500 text-xs mt-0.5" />
              </button>

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border">
                  <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Switch Account
                  </Link>
                  <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <Link to="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

import { useState } from "react";
import {
  FaChevronDown,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserShield,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import DeleteAccountModal from "./DeleteAccountModal";



export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

const [showDeleteModal, setShowDeleteModal] = useState(false);

const handleAccountDeleted = () => {
  setShowDeleteModal(false);
  navigate("/");
  window.location.reload();
};

  const handleSignOut = () => {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("token");
    localStorage.removeItem("_persist");

    Object.keys(localStorage).forEach((key) => {
      if (
        key.startsWith("persist:") ||
        key.includes("user") ||
        key.includes("auth")
      ) {
        localStorage.removeItem(key);
      }
    });

    setShowDropdown(false);

    navigate("/auth/signin");

    window.location.reload();
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setShowDropdown(false);
    }
  };

  // Close modal when clicking outside
  const handleModalOutsideClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      closeProfileModal();
    }
  };

  return (
    <>
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
              <Link
                to="#features"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Features
              </Link>
              <Link
                to="#how-it-works"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                How It Works
              </Link>
              <Link
                to="#testimonials"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Testimonials
              </Link>
              <Link
                to="#faq"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                FAQ
              </Link>
              <Link
                to="/chatbot"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Chat
              </Link>
              <Link
                to="/PredictForm"
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                AI Tasks
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Get Started Button */}
              <Link
                to="#"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Get Started
              </Link>

              {/* User Profile */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Image
                    src={user?.image || "/dp.jpg"}
                    alt="User"
                    height={40}
                    width={40}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {user?.name}
                  </span>
                  <FaChevronDown className="text-gray-500 text-xs mt-0.5" />
                </button>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <Link
                      to="#"
                      onClick={() => setShowDeleteModal(true)}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete Account
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Minimal Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800">User Profile</h3>
              {/* <button
                onClick={closeProfileModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={16} />
              </button> */}
            </div>

            {/* Content */}
            <div className="p-4">
              {/* User Avatar and Name */}
              <div className="flex items-center mb-4 pb-3 border-b">
                <Image
                  src={user?.image || "/dp.jpg"}
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {user?.name}
                  </h4>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaIdCard className="text-gray-400 w-4 h-4 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">User ID</p>
                    <p className="text-sm text-gray-900 font-mono">
                      {user?._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUser className="text-gray-400 w-4 h-4 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaEnvelope className="text-gray-400 w-4 h-4 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <FaUserShield className="text-gray-400 w-4 h-4 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Role</p>
                    <p className="text-sm text-gray-900 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
              <button
                onClick={closeProfileModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            userEmail={user?.email}
            onAccountDeleted={handleAccountDeleted}
          />
    </>
  );
}

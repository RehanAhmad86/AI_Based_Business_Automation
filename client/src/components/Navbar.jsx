"use client";

import { useState } from "react";
import {
  FaChevronDown,
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserShield,
  FaRobot,
  FaBoxes,
  FaFileInvoiceDollar,
  FaBarcode,
  FaEnvelopeOpen,
  FaHome,
  FaShoppingCart,
  FaPlus,
  FaCog,
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

  const handleModalOutsideClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      closeProfileModal();
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-200">
                  <FaRobot className="text-blue-600 text-3xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 leading-tight">
                    Automa<span className="text-blue-600">Flow</span>
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Business Management
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/inventory"
                className="group relative flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-200"
              >
                <FaBoxes className="text-base text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="relative">
                  Inventory
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>

              <Link
                to="/orders"
                className="group relative flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg transition-all duration-200"
              >
                <FaShoppingCart className="text-base text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="relative">
                  Order Management
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Add Inventory Button */}
              <Link
                to="/inventory/add"
                className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <FaPlus className="text-xs" />
                <span className="whitespace-nowrap">Add Inventory</span>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                >
                  <div className="relative">
                    <Image
                      src={user?.image || "/dp.jpg"}
                      alt="User"
                      height={44}
                      width={44}
                      className="w-10 h-10 rounded-full"
                    />
                    {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div> */}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`text-gray-400 text-xs transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-2xl border border-gray-100 z-50 overflow-hidden">
                      {/* User Info Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={user?.image || "/dp.jpg"}
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {user?.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {user?.email
                                ? user.email.length > 15
                                  ? user.email.slice(0, 15) + "..."
                                  : user.email
                                : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Button */}
                      <div className="px-2 py-2">
                        <button
                          onClick={handleProfileClick}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-blue-50 rounded-lg">
                            <FaUser className="w-3 h-3 text-blue-600" />
                          </div>
                          <span>View Profile</span>
                        </button>
                      </div>

                      {/* Quick Tools Section */}
                      <div className="px-2 pb-2">
                        <div className="px-3 py-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Quick Tools
                          </p>
                        </div>

                        <Link
                          to="/invoice-generator"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-gray-100 rounded-lg">
                            <FaFileInvoiceDollar className="w-3 h-3 text-gray-600" />
                          </div>
                          <span>Invoice Generator</span>
                        </Link>

                        <Link
                          to="/invoice-scanner"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-gray-100 rounded-lg">
                            <FaBarcode className="w-3 h-3 text-gray-600" />
                          </div>
                          <span>Invoice Scanner</span>
                        </Link>

                        <Link
                          to="/tone-email"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-gray-100 rounded-lg">
                            <FaEnvelopeOpen className="w-3 h-3 text-gray-600" />
                          </div>
                          <span>AI Letter Writer</span>
                        </Link>
                      </div>

                      {/* Danger Zone */}
                      <div className="border-t border-gray-100 px-2 py-2">
                        <Link
                          to="#"
                          onClick={() => setShowDeleteModal(true)}
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-red-50 rounded-lg">
                            <FaUser className="w-3 h-3 text-red-600" />
                          </div>
                          <span>Delete Account</span>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <div className="p-1.5 bg-red-50 rounded-lg">
                            <FaCog className="w-3 h-3 text-red-600" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
          onClick={handleModalOutsideClick}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                User Profile
              </h3>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                <Image
                  src={user?.image || "/dp.jpg"}
                  alt="User"
                  className="w-12 h-12 rounded-full border-2 border-blue-100 shadow-sm"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {user?.name}
                  </h4>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium capitalize">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <FaIdCard className="text-gray-600 w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      User ID
                    </p>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                      {user?._id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <FaUser className="text-gray-600 w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Name
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {user?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <FaEnvelope className="text-gray-600 w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-gray-100 rounded-lg">
                    <FaUserShield className="text-gray-600 w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Role
                    </p>
                    <p className="text-sm text-gray-900 font-medium capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={closeProfileModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
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

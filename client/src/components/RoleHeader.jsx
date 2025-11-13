import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "./Notifications";
import NotificationBell from "./NotificationBell";

export default function RoleHeader() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 500);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      closeBtnRef.current?.focus();
      const onKey = (e) => {
        if (e.key === "Escape") setIsMenuOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout?.();
    window.location.href = "/";
  };

  const handleLinkClick = (cb) => {
    setIsMenuOpen(false);
    if (typeof cb === "function") cb();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Project title */}
         <Link to="/" className="flex items-center gap-2">
          <img src="/logo192.png" alt="FarmConnect logo" className="w-14 h-14" />
          <span className="font-semibold">FarmConnect</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Notifications compact />
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded hover:bg-gray-200"
          >
            <span className="text-2xl">☰</span>
          </button>
        </div>
      </div>

      {/* Hamburger menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-0"
            onClick={() => setIsMenuOpen(false)}
            style={{ animation: "overlayIn 300ms forwards" }}
          />

          {/* Menu */}
          <div
            className="bg-white w-64 h-full p-4 shadow-lg transform translate-x-full"
            style={{ animation: "slideInFromRight 300ms forwards" }}
          >
            <button
              ref={closeBtnRef}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="mb-6 text-gray-800 text-2xl p-1 rounded hover:bg-gray-100"
            >
              ✕
            </button>

            {user?.name && (
            <div className="mb-4 text-lg font-bold text-gray-700">
            Hi {user.name.toUpperCase()}
            </div>
            )}


            <nav className="flex flex-col gap-4">
              {/* Common to all users */}
              <Link to="/" className="menu-btn" onClick={() => handleLinkClick()}>
                Home
              </Link>
              <Link to="/profile/edit" className="menu-btn" onClick={() => handleLinkClick()}>
                Edit Profile
              </Link>

              {/* Farmer role buttons */}
              {user?.role === "farmer" && (
                <>
                  <Link to="/farmer/dashboard" className="menu-btn" onClick={() => handleLinkClick()}>
                    Dashboard
                  </Link>
           
                  <Link to="/farmer/wishlist" className="menu-btn">
                  My Wishlist
                 </Link>
                  <Link to="/farmer/my-crops" className="menu-btn" onClick={() => handleLinkClick()}>
                    My Crops
                  </Link>
                  <Link to="/farmer/add-crop" className="menu-btn" onClick={() => handleLinkClick()}>
                    Add Crop
                  </Link>
                  <Link to="/farmer/requests" className="menu-btn" onClick={() => handleLinkClick()}>
                    Search Requests
                  </Link>
                </>
              )}

              {/* Customer role buttons */}
              {user?.role === "customer" && (
                <>
                  <Link to="/customer/dashboard" className="menu-btn" onClick={() => handleLinkClick()}>
                    Dashboard
                  </Link>
                  <Link to="/customer/wishlist" className="menu-btn" onClick={() => handleLinkClick()}>
                    My Wishlist
                  </Link>
                  <Link to="/customer/requests" className="menu-btn" onClick={() => handleLinkClick()}>
                    My Requests
                  </Link>
                  <Link to="/customer/create-request" className="menu-btn" onClick={() => handleLinkClick()}>
                    Add Request
                  </Link>
                  <Link to="/customer/search" className="menu-btn" onClick={() => handleLinkClick()}>
                    Search Crops
                  </Link>

                </>
              )}

              <button
                onClick={() => handleLinkClick(handleLogout)}
                className="flex items-center justify-center w-full h-12 px-3 py-2 rounded border border-gray-300 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </nav>

            {/* Animations */}
            <style>{`
              @keyframes slideInFromRight {
                from { transform: translateX(100%); }
                to   { transform: translateX(0%); }
              }
              @keyframes overlayIn {
                from { background-color: rgba(0,0,0,0); }
                to { background-color: rgba(0,0,0,0.45); }
              }
              .menu-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 3rem;
                padding: 0.5rem;
                border-radius: 0.375rem;
                background-color: #2563eb;
                color: white;
                font-weight: 500;
              }
              .menu-btn:hover {
                background-color: #1e40af;
              }
            `}</style>
          </div>
        </div>
      )}
    </header>
  );
}

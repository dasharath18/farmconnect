import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeHeader({ onSignIn, onSignUp }) {
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

  const handleAction = (action) => {
    setIsMenuOpen(false);
    if (typeof action === "function") action();
  };

  return (
    <header className="bg-[#004537] text-white ">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo192.png" alt="FarmConnect logo" className="w-10 h-10 rounded" />
          <span className="font-semibold text-lg">FarmConnect</span>
        </Link>

        {/* Desktop buttons */}
        {!isMobile && (
          <nav className="flex items-center gap-4">
            <button
              onClick={onSignIn}
              className="flex items-center justify-center px-4 py-2 rounded-md bg-green-100 text-[#00624f] hover:bg-green-200 transition w-32 h-10"
              aria-label="Sign in"
            >
              Sign in
            </button>

            <button
              onClick={onSignUp}
              className="flex items-center justify-center px-4 py-2 rounded-md border border-white/30 hover:bg-white/10 transition w-32 h-10"
              aria-label="Sign up"
            >
              Sign up
            </button>
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 rounded hover:bg-[#004537]"
          >
            <span className="text-2xl">☰</span>
          </button>
        )}
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          {/* overlay */}
          <div
            className="flex-1 bg-black bg-opacity-0 animate-overlay-fade"
            style={{ animation: "overlayIn 300ms forwards" }}
            onClick={() => setIsMenuOpen(false)}
          />

          {/* sliding panel */}
          <div
            className="bg-[#004537] text-white w-64 h-full p-4 shadow-lg transform translate-x-full"
            style={{ animation: "slideInFromRight 300ms forwards" }}
          >
            {/* Close Button */}
            <button
              ref={closeBtnRef}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="mb-6 text-2xl p-1 rounded hover:bg-[#004f40]"
            >
              ✕
            </button>

            {/* Menu Items */}
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => handleAction(onSignIn)}
                className="flex items-center justify-center w-full h-12 px-4 rounded-md bg-green-100 text-[#00624f] hover:bg-green-200 transition"
                aria-label="Sign in"
              >
                Sign in
              </button>

              <button
                onClick={() => handleAction(onSignUp)}
                className="flex items-center justify-center w-full h-12 px-4 rounded-md border border-white/30 hover:bg-white/10 transition"
                aria-label="Sign up"
              >
                Sign up
              </button>
            </nav>
          </div>

          <style>{`
            @keyframes slideInFromRight {
              from { transform: translateX(100%); }
              to   { transform: translateX(0%); }
            }
            @keyframes overlayIn {
              from { background-color: rgba(0,0,0,0); }
              to { background-color: rgba(0,0,0,0.45); }
            }
          `}</style>
        </div>
      )}
    </header>
  );
}

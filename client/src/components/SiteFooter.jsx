import React from "react";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-300 py-6">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm">
          <strong>FarmConnect</strong> — connecting farmers & customers
        </div>
        <div className="text-sm">
          Developed by <span className="font-semibold"><a href ="https://www.linkedin.com/in/dasharath18/" target="_blank" rel="noopener noreferrer">Dasharath</a></span> © {year} ™
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from "react";
import HomeHeader from "../components/HomeHeader";
import SiteFooter from "../components/SiteFooter";
import AuthModal from "../components/AuthModal";

export default function Home() {
  const [authMode, setAuthMode] = useState(null); 

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader
        onSignIn={() => setAuthMode("login")}
        onSignUp={() => setAuthMode("register")}
      />

      <main
        className="flex-grow bg-cover bg-center"
        style={{ backgroundImage: "url('/backgroundimage.png')" }}
      >
        <div className=" flex items-center">
          <div className="container mx-auto px-6 py-24 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              FarmConnect — Grow local, eat local
            </h1>
            <p className="max-w-2xl text-lg md:text-xl mb-8">
              Connect farmers and customers in your area — buy fresh produce directly from growers,
              manage crops, and keep your wishlist organized.
            </p>

           
          </div>
        </div>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/50 rounded-lg p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-2">For Farmers</h3>
                <p>List crops, manage inventory, and reach customers nearby.</p>
              </div>
              <div className="bg-white/50 rounded-lg p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-2">For Customers</h3>
                <p>Search for fresh crops, save to wishlist, and order locally.</p>
              </div>
              <div className="bg-white/50 rounded-lg p-6 shadow-lg">
                <h3 className="font-bold text-xl mb-2">Secure Payments</h3>
                <p>Reliable checkout options — coming soon.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {authMode && (
        <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />
      )}
    </div>
  );
}

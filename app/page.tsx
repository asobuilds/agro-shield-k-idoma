"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Navigation Bar */}
      <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="text-2xl font-bold text-[#1a5d3a] flex items-center gap-2">
          <span className="text-3xl">🌾</span> AgroShield
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/" className="text-[#1a5d3a] font-medium hover:text-[#0f3d25]">Home</Link>
          <Link href="#about" className="text-[#1a5d3a] font-medium hover:text-[#0f3d25]">About</Link>
          <Link href="#features" className="text-[#1a5d3a] font-medium hover:text-[#0f3d25]">Features</Link>
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="bg-[#1a5d3a] text-white px-6 py-2 rounded-full hover:bg-[#0f3d25] transition">
              Dashboard
            </Link>
          ) : (
            <Link href="/register" className="bg-[#1a5d3a] text-white px-6 py-2 rounded-full hover:bg-[#0f3d25] transition">
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section with Full-Width Image + Overlay */}
      <div className="relative w-full h-[600px] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2070&auto=format&fit=crop')" 
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building the Largest Network of <br /> Profitable African Farmers
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
            We leverage technology to empower smallholder farmers across Africa by linking them to markets, data-driven best practices, and fair prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Link href="/dashboard/farmer" className="bg-[#4CAF50] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#388E3C] transition shadow-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <Link href="/register" className="bg-[#4CAF50] text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-[#388E3C] transition shadow-lg">
                Learn More →
              </Link>
            )}
            <Link href="#features" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/30 transition border border-white/30">
              Our Impact
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1a5d3a] text-center mb-12">Why AgroShield?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 text-center">
            <div className="text-5xl mb-4 text-[#4CAF50]">🌱</div>
            <h3 className="text-xl font-bold text-[#1a5d3a] mb-2">Farm-to-Table</h3>
            <p className="text-gray-600">Buy directly from local farms — no middlemen, better prices, fresher food.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 text-center">
            <div className="text-5xl mb-4 text-[#4CAF50]">💰</div>
            <h3 className="text-xl font-bold text-[#1a5d3a] mb-2">Fair Pricing</h3>
            <p className="text-gray-600">Farmers earn more, buyers pay less. A transparent marketplace for everyone.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100 text-center">
            <div className="text-5xl mb-4 text-[#4CAF50]">🤝</div>
            <h3 className="text-xl font-bold text-[#1a5d3a] mb-2">Community Trust</h3>
            <p className="text-gray-600">Verified farmers, real-time tracking, and honest reviews from real buyers.</p>
          </div>
        </div>
      </div>

      {/* ABOUT US SECTION */}
      <div id="about" className="py-20 px-6 bg-[#f8f9fa]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1a5d3a] mb-6">About AgroShield K' Idoma</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            AgroShield K' Idoma is a digital marketplace built to bridge the gap between local farmers and the public. 
            Our mission is to <span className="font-bold text-[#1a5d3a]">empower smallholder farmers</span> by giving them direct access to buyers, 
            and to <span className="font-bold text-[#1a5d3a]">empower buyers</span> with fresh, affordable, and transparent food sourcing.
          </p>
          <p className="text-md text-gray-600 mt-4 max-w-xl mx-auto">
            We believe in fair prices, community trust, and a future where no farmer struggles to sell their harvest.
          </p>
          
          {!isLoggedIn && (
            <Link href="/register" className="inline-block mt-8 bg-[#1a5d3a] text-white px-8 py-3 rounded-full hover:bg-[#0f3d25] transition">
              Join Our Community →
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f3d25] text-white py-12 text-center">
        <p className="text-lg mb-2">🌾 AgroShield K' Idoma</p>
        <p className="text-sm opacity-70">© 2026 Bridging Farmers to the Public.</p>
      </footer>
    </div>
  );
}
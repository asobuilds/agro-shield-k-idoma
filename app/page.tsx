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
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-[#2d6a4f]">
          🌾 Agro Shield K' Idoma
        </div>
        <div className="flex gap-4">
          <Link href="/" className="text-[#2d6a4f] hover:underline">Home</Link>
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="text-[#2d6a4f] hover:underline">Dashboard</Link>
          ) : (
            <Link href="/register" className="bg-[#2d6a4f] text-white px-4 py-2 rounded-md hover:bg-[#1b4332]">
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#2d6a4f] mb-4">
          Bridging Farmers to Buyers
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Agro Shield K' Idoma connects local agricultural producers directly to buyers, restaurants, and the public – ensuring fresh food, fair prices, and a thriving community.
        </p>
        <div className="flex gap-4 justify-center">
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="bg-[#e2725b] text-white px-8 py-3 rounded-md hover:bg-[#c45a43]">
              Go to Dashboard
            </Link>
          ) : (
            <Link href="/register" className="bg-[#e2725b] text-white px-8 py-3 rounded-md hover:bg-[#c45a43]">
              Join Now – It's Free
            </Link>
          )}
          <Link href="#features" className="border-2 border-[#2d6a4f] text-[#2d6a4f] px-8 py-3 rounded-md hover:bg-[#2d6a4f] hover:text-white transition">
            Learn More
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2d6a4f] mb-12">Why Agro Shield?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Fresh from Farm</h3>
              <p className="text-gray-600">Buy directly from local farmers – no middlemen, no delays.</p>
            </div>
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Fair Prices</h3>
              <p className="text-gray-600">Farmers earn more, buyers pay less – a win-win for the community.</p>
            </div>
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Trust & Transparency</h3>
              <p className="text-gray-600">Verified farmers, clear order tracking, and honest reviews.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1b4332] text-white py-8 text-center">
        <p>© 2026 Agro Shield K' Idoma. Built for the community.</p>
      </footer>
    </div>
  );
}
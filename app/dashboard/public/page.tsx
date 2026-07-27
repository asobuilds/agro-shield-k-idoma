"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/mockData";

export default function PublicDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f]">👥 Welcome, {user.name}</h1>
          <p className="text-gray-600">Agro Shield K' Idoma Community Hub</p>
          <Link href="/" className="text-sm text-[#2d6a4f] hover:underline mt-2 block">
            ← Back to Home
          </Link>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            router.push("/register");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Market Pulse (Fake Price Ticker) */}
      <div className="bg-[#2d6a4f] text-white p-4 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-bold mb-2">📊 Market Pulse</h2>
        <div className="flex gap-6 overflow-x-auto">
          <span>🍅 Tomatoes: ₦500/kg</span>
          <span>🌾 Cassava: ₦300/kg</span>
          <span>🌽 Maize: ₦250/kg</span>
          <span>🧅 Onions: ₦400/kg</span>
          <span>🥬 Cabbage: ₦350/kg</span>
        </div>
      </div>

      {/* Farmer Stories (Trust Building) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌱 Farmer Stories</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#2d6a4f] pl-4">
            <h3 className="font-bold">John from Otukpo</h3>
            <p className="text-sm text-gray-600">"Agro Shield helped me sell my tomatoes in 2 days instead of 2 weeks!"</p>
          </div>
          <div className="border-l-4 border-[#e2725b] pl-4">
            <h3 className="font-bold">Mary from Makurdi</h3>
            <p className="text-sm text-gray-600">"I now connect directly with restaurants and earn 30% more profit."</p>
          </div>
        </div>
      </div>

      {/* Browse All Products */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🛍️ Browse Produce</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">By: {product.farmerName}</p>
              <p className="text-sm text-gray-500">Location: {product.location}</p>
              <p className="text-[#2d6a4f] font-bold">₦{product.price}/{product.unit}</p>
              <button className="mt-2 w-full bg-[#e2725b] text-white py-2 rounded-md hover:bg-[#c45a43]">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
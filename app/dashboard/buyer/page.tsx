"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/mockData";

export default function BuyerDashboard() {
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
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🛒 Welcome, {user.name}</h1>
          <p className="text-gray-600">Business: {user.businessType || "Individual Buyer"}</p>
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

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search for produce..."
            className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]"
          />
          <button className="bg-[#2d6a4f] text-white px-6 py-3 rounded-md hover:bg-[#1b4332]">
            Search
          </button>
        </div>
      </div>

      {/* Available Products */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌾 Fresh from Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">By: {product.farmerName}</p>
              <p className="text-sm text-gray-500">Location: {product.location}</p>
              <p className="text-[#2d6a4f] font-bold text-lg">₦{product.price}/{product.unit}</p>
              <button className="mt-2 w-full bg-[#e2725b] text-white py-2 rounded-md hover:bg-[#c45a43]">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">📦 My Orders</h2>
        <div className="space-y-3">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-gray-500">From: Farmer ID {order.farmerId}</p>
                <p className="text-sm text-gray-500">Total: ₦{order.totalPrice}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "shipped" ? "bg-green-100 text-green-700" :
                order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                order.status === "delivered" ? "bg-blue-100 text-blue-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {order.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
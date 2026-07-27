"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_STATS, MOCK_PRODUCTS, MOCK_ORDERS } from "@/lib/mockData";

export default function FarmerDashboard() {
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
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🌾 Welcome, {user.name}</h1>
          <p className="text-gray-600">Farm Location: {user.location || "Not set"}</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2d6a4f]">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-[#2d6a4f]">{MOCK_STATS.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#e2725b]">
          <p className="text-gray-500 text-sm">Revenue (₦)</p>
          <p className="text-2xl font-bold text-[#e2725b]">{MOCK_STATS.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{MOCK_STATS.pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Active Products</p>
          <p className="text-2xl font-bold text-blue-600">{MOCK_STATS.activeProducts}</p>
        </div>
      </div>

      {/* My Products */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌱 My Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-[#2d6a4f] font-bold">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-gray-500">Qty: {product.quantity} {product.unit}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 bg-[#2d6a4f] text-white px-4 py-2 rounded-md hover:bg-[#1b4332]">
          + Add New Product
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">📦 Recent Orders</h2>
        <div className="space-y-3">
          {MOCK_ORDERS.map((order) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-gray-500">Qty: {order.quantity} | Total: ₦{order.totalPrice}</p>
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
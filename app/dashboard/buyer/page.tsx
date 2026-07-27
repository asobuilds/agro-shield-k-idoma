"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock } from "@/lib/mockData";

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
      return;
    }
    setUser(JSON.parse(storedUser));
    const savedProducts = localStorage.getItem("farmer_products");
    setProducts(savedProducts ? JSON.parse(savedProducts) : getCachedOrMock("products", MOCK_PRODUCTS));

    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setRecommendations([]);
      return;
    }
    setIsSearching(true);
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRecommendations(filtered);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-6 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      {isOffline && (
        <div className="bg-yellow-500 text-white p-2 rounded-md mb-4 text-center font-bold">
          ⚠️ Offline — using cached data
        </div>
      )}

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">🛒 Welcome, {user.name}</h1>
          <p className="text-[#5a3e2b] dark:text-gray-400">Business: {user.businessType || "Individual"}</p>
          <Link href="/" className="text-sm text-[#5a3e2b] dark:text-gray-400 hover:underline mt-2 block">← Back to Home</Link>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            router.push("/register");
          }}
          className="bg-red-500/80 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8 dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">🤖 What are you looking for?</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g., tomatoes, cassava..."
            className="flex-1 p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#2d6a4f] text-white px-6 py-3 rounded-md hover:bg-[#1b4332] disabled:opacity-50 dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]"
          >
            {isSearching ? "🔍 Searching..." : "🔍 Find Farms"}
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8 dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
          <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">
            🎯 Recommended Farms for "{searchQuery}"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((product: any) => (
              <div key={product.id} className="bg-white p-4 rounded-lg shadow-md border border-[#b8946e] dark:bg-[#2d2d2d] dark:border-[#3d3d3d]">
                <div className="h-40 bg-[#e9d5b5] rounded-md mb-2 flex items-center justify-center overflow-hidden dark:bg-[#3d3d3d]">
                  {product.imageUrl?.startsWith("data:") ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🌾</span>
                  )}
                </div>
                <h3 className="font-bold text-[#2d6a4f] dark:text-[#4ade80]">{product.name}</h3>
                <p className="text-sm text-[#5a3e2b] dark:text-gray-400">By: {product.farmerName}</p>
                <p className="text-sm text-[#5a3e2b] dark:text-gray-400">Location: {product.location}</p>
                <p className="text-[#e2725b] font-bold text-lg">₦{product.price}/{product.unit}</p>
                <button className="mt-3 w-full bg-[#2d6a4f] text-white py-2 rounded-md hover:bg-[#1b4332] dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]">
                  📞 Contact Farmer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">📦 My Orders</h2>
        {getCachedOrMock("orders", MOCK_ORDERS).map((order: any) => (
          <div key={order.id} className="border border-[#b8946e] rounded-lg p-4 mb-4 dark:border-[#2d2d2d]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-[#2d6a4f] dark:text-[#4ade80]">{order.productName}</p>
                <p className="text-sm text-[#5a3e2b] dark:text-gray-400">From: {order.farmerId} | ₦{order.totalPrice}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                order.status === "shipped" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                order.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" :
                order.status === "delivered" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
              <div className="h-3 rounded-full bg-[#2d6a4f] dark:bg-[#4ade80]" style={{ width: "60%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-[#5a3e2b] dark:text-gray-400 mt-2">
              <span>📝 Pending</span>
              <span>📦 Packing</span>
              <span>🚚 Shipped</span>
              <span>✅ Delivered</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
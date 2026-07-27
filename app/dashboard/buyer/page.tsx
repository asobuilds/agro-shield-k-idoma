"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock } from "@/lib/mockData";

// Function to calculate distance between two GPS coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [buyerLocation, setBuyerLocation] = useState<{lat: number, lon: number} | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
      // Load products from localStorage (from farmer dashboard)
      const savedProducts = localStorage.getItem("farmer_products");
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(getCachedOrMock("products", MOCK_PRODUCTS));
      }
    }
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));

    // Get buyer's location for proximity calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBuyerLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err)
      );
    }
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading dashboard...</div>;

  // Parse farmer location and calculate distance
  const getProximity = (farmerLocation: string) => {
    if (!buyerLocation) return "Unknown";
    try {
      const [lat, lon] = farmerLocation.split(",").map(Number);
      if (isNaN(lat) || isNaN(lon)) return "Unknown";
      const distance = calculateDistance(buyerLocation.lat, buyerLocation.lon, lat, lon);
      return distance < 1 ? "📍 Less than 1 km away" : `📍 ${distance.toFixed(1)} km away`;
    } catch {
      return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-6">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-500 text-white p-2 rounded-md mb-4 text-center font-bold">
          ⚠️ You are offline. Using cached data.
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#b8946e]">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🛒 Welcome, {user.name}</h1>
          <p className="text-[#5a3e2b]">Business: {user.businessType || "Individual Buyer"}</p>
          <Link href="/" className="text-sm text-[#5a3e2b] hover:underline mt-2 block">← Back to Home</Link>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            router.push("/register");
          }}
          className="bg-red-500/80 text-white px-4 py-2 rounded-md hover:bg-red-600 backdrop-blur-sm"
        >
          Logout
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search for produce..."
            className="flex-1 p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50"
          />
          <button className="bg-[#5a3e2b] text-white px-6 py-3 rounded-md hover:bg-[#3d2b1c] shadow-sm">
            Search
          </button>
        </div>
      </div>
            {/* Available Products with Proximity */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌾 Fresh from Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <motion.div 
              key={product.id} 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-lg shadow-md border border-[#b8946e] hover:shadow-xl transition-all"
            >
              <div className="h-40 bg-[#e9d5b5] rounded-md mb-2 flex items-center justify-center overflow-hidden">
                {product.imageUrl && product.imageUrl.startsWith("data:") ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🌾</span>
                )}
              </div>
              <h3 className="font-bold text-[#2d6a4f]">{product.name}</h3>
              <p className="text-sm text-[#5a3e2b]">By: {product.farmerName}</p>
              <p className="text-sm text-[#5a3e2b]">Location: {product.location}</p>
              <p className="text-[#e2725b] font-bold text-lg">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-[#2d6a4f] font-medium">
                {getProximity(product.location)}
              </p>
              <button className="mt-2 w-full bg-[#b8946e] text-white py-2 rounded-md hover:bg-[#9a7a56] shadow-sm transition-all">
                Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e]">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">📦 My Orders</h2>
        <div className="space-y-3">
          {getCachedOrMock("orders", MOCK_ORDERS).map((order: any) => (
            <div key={order.id} className="flex justify-between items-center border-b border-[#b8946e] pb-3">
              <div>
                <p className="font-medium text-[#2d6a4f]">{order.productName}</p>
                <p className="text-sm text-[#5a3e2b]">From: Farmer ID {order.farmerId}</p>
                <p className="text-sm text-[#5a3e2b]">Total: ₦{order.totalPrice}</p>
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
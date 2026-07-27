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
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
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

  const getDistance = (farmerLocation: string) => {
    if (!buyerLocation) return Infinity;
    try {
      const [lat, lon] = farmerLocation.split(",").map(Number);
      if (isNaN(lat) || isNaN(lon)) return Infinity;
      return calculateDistance(buyerLocation.lat, buyerLocation.lon, lat, lon);
    } catch {
      return Infinity;
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setRecommendations([]);
      return;
    }
    setIsSearching(true);
    const filtered = products.filter((product) => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (buyerLocation) {
      filtered.sort((a, b) => {
        const distA = getDistance(a.location);
        const distB = getDistance(b.location);
        return distA - distB;
      });
    }
    setRecommendations(filtered);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-6 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      {isOffline && (
        <div className="bg-yellow-500 text-white p-2 rounded-md mb-4 text-center font-bold">
          ⚠️ You are offline. Using cached data.
        </div>
      )}

      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">🛒 Welcome, {user.name}</h1>
          <p className="text-[#5a3e2b] dark:text-gray-400">Business: {user.businessType || "Individual Buyer"}</p>
          <Link href="/" className="text-sm text-[#5a3e2b] dark:text-gray-400 hover:underline mt-2 block">← Back to Home</Link>
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

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8 dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">🤖 What are you looking for?</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g., tomatoes, cassava, maize..."
            className="flex-1 p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-[#2d6a4f] text-white px-6 py-3 rounded-md hover:bg-[#1b4332] shadow-sm transition-colors disabled:opacity-50 dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]"
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
              <motion.div 
                key={product.id} 
                whileHover={{ scale: 1.03 }}
                className="bg-white p-4 rounded-lg shadow-md border border-[#b8946e] hover:shadow-xl transition-all dark:bg-[#2d2d2d] dark:border-[#3d3d3d]"
              >
                <div className="h-40 bg-[#e9d5b5] rounded-md mb-2 flex items-center justify-center overflow-hidden dark:bg-[#3d3d3d]">
                  {product.imageUrl && product.imageUrl.startsWith("data:") ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🌾</span>
                  )}
                </div>
                <h3 className="font-bold text-[#2d6a4f] dark:text-[#4ade80]">{product.name}</h3>
                <p className="text-sm text-[#5a3e2b] dark:text-gray-400">By: {product.farmerName}</p>
                <p className="text-sm text-[#5a3e2b] dark:text-gray-400">Location: {product.location}</p>
                <p className="text-[#e2725b] font-bold text-lg">₦{product.price}/{product.unit}</p>
                                <div className="mt-2 space-y-1">
                  <p className="text-sm text-[#2d6a4f] dark:text-[#4ade80] font-medium">
                    {getProximity(product.location)}
                  </p>
                  <p className="text-sm text-[#5a3e2b] dark:text-gray-400">
                    📞 Contact: {user.phone} (via Agro Shield)
                  </p>
                  <p className="text-xs text-[#5a3e2b] dark:text-gray-400">
                    🏷️ Farm: {product.farmerName}'s Farm
                  </p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-[#b8946e] text-white py-2 rounded-md hover:bg-[#9a7a56] shadow-sm transition-all dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]">
                    🛒 Add to Cart
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Contacting ${product.farmerName} at ${product.location}.\nPhone: ${user.phone || "Available on request"}`);
                    }}
                    className="flex-1 bg-[#2d6a4f] text-white py-2 rounded-md hover:bg-[#1b4332] shadow-sm transition-all dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]"
                  >
                    📞 Contact Farmer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-4">🌾 All Fresh from Farms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <motion.div 
              key={product.id} 
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 rounded-lg shadow-md border border-[#b8946e] hover:shadow-xl transition-all dark:bg-[#2d2d2d] dark:border-[#3d3d3d]"
            >
              <div className="h-40 bg-[#e9d5b5] rounded-md mb-2 flex items-center justify-center overflow-hidden dark:bg-[#3d3d3d]">
                {product.imageUrl && product.imageUrl.startsWith("data:") ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🌾</span>
                )}
              </div>
              <h3 className="font-bold text-[#2d6a4f] dark:text-[#4ade80]">{product.name}</h3>
              <p className="text-sm text-[#5a3e2b] dark:text-gray-400">By: {product.farmerName}</p>
              <p className="text-sm text-[#5a3e2b] dark:text-gray-400">Location: {product.location}</p>
              <p className="text-[#e2725b] font-bold text-lg">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-[#2d6a4f] dark:text-[#4ade80] font-medium">
                {getProximity(product.location)}
              </p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-[#b8946e] text-white py-2 rounded-md hover:bg-[#9a7a56] shadow-sm transition-all dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]">
                  🛒 Add to Cart
                </button>
                <button 
                  onClick={() => {
                    alert(`Contacting ${product.farmerName} at ${product.location}.\nPhone: ${user.phone || "Available on request"}`);
                  }}
                  className="flex-1 bg-[#2d6a4f] text-white py-2 rounded-md hover:bg-[#1b4332] shadow-sm transition-all dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]"
                >
                  📞 Contact Farmer
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
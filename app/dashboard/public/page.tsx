"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS, getCachedOrMock } from "@/lib/mockData";

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

export default function PublicDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [publicLocation, setPublicLocation] = useState<{lat: number, lon: number} | null>(null);
  const [marketPrices, setMarketPrices] = useState([
    { item: "Tomatoes", price: 500, unit: "kg" },
    { item: "Cassava", price: 300, unit: "kg" },
    { item: "Maize", price: 250, unit: "kg" },
    { item: "Onions", price: 400, unit: "kg" },
    { item: "Cabbage", price: 350, unit: "kg" },
  ]);

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

    // Get public user's location for proximity calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPublicLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => console.error("Location error:", err)
      );
    }

    // Try to fetch real market data (simulated)
    const fetchMarketData = async () => {
      try {
        const response = await fetch("https://api.example.com/commodities");
        if (response.ok) {
          const data = await response.json();
          // setMarketPrices(data);
        }
      } catch (error) {
        console.log("Using mock market data");
      }
    };
    fetchMarketData();
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading dashboard...</div>;

  // Parse farmer location and calculate distance
  const getProximity = (farmerLocation: string) => {
    if (!publicLocation) return "Unknown";
    try {
      const [lat, lon] = farmerLocation.split(",").map(Number);
      if (isNaN(lat) || isNaN(lon)) return "Unknown";
      const distance = calculateDistance(publicLocation.lat, publicLocation.lon, lat, lon);
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
          <h1 className="text-3xl font-bold text-[#2d6a4f]">👥 Welcome, {user.name}</h1>
          <p className="text-[#5a3e2b]">Agro Shield K' Idoma Community Hub</p>
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
            {/* Market Pulse (Live Price Ticker) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2d6a4f]/90 backdrop-blur-sm text-white p-4 rounded-xl shadow-lg border border-[#b8946e] mb-8"
      >
        <h2 className="text-lg font-bold mb-2">📊 Market Pulse</h2>
        <div className="flex gap-6 overflow-x-auto">
          {marketPrices.map((item, index) => (
            <span key={index} className="whitespace-nowrap">
              {item.item}: ₦{item.price}/{item.unit}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Farmer Stories (Trust Building) */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌱 Farmer Stories</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#2d6a4f] pl-4">
            <h3 className="font-bold text-[#2d6a4f]">John from Otukpo</h3>
            <p className="text-sm text-[#5a3e2b]">"Agro Shield helped me sell my tomatoes in 2 days instead of 2 weeks!"</p>
          </div>
          <div className="border-l-4 border-[#b8946e] pl-4">
            <h3 className="font-bold text-[#2d6a4f]">Mary from Makurdi</h3>
            <p className="text-sm text-[#5a3e2b]">"I now connect directly with restaurants and earn 30% more profit."</p>
          </div>
        </div>
      </div>

      {/* Browse All Products with Proximity */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e]">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🛍️ Browse Produce</h2>
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
              <p className="text-[#e2725b] font-bold">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-[#2d6a4f] font-medium">
                {getProximity(product.location)}
              </p>
              <button className="mt-2 w-full bg-[#b8946e] text-white py-2 rounded-md hover:bg-[#9a7a56] shadow-sm transition-all">
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
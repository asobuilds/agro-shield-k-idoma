"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  farmerName: string;
  location: string;
  imageUrl?: string;
  paymentMethod?: string;
}

interface MarketplaceGridProps {
  products: Product[];
  showDistance?: boolean;
  buyerLocation?: { lat: number; lon: number } | null;
  onAddToCart?: (product: Product) => void;
}

// Function to calculate distance (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MarketplaceGrid({ products, showDistance, buyerLocation, onAddToCart }: MarketplaceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  // Get all unique categories
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products by category
  let filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === "proximity" && buyerLocation) {
    filteredProducts.sort((a, b) => {
      const distA = getDistance(a.location);
      const distB = getDistance(b.location);
      return distA - distB;
    });
  }

  // Helper for distance sorting
  function getDistance(location: string) {
    if (!buyerLocation) return Infinity;
    try {
      const [lat, lon] = location.split(",").map(Number);
      if (isNaN(lat) || isNaN(lon)) return Infinity;
      return calculateDistance(buyerLocation.lat, buyerLocation.lon, lat, lon);
    } catch {
      return Infinity;
    }
  }

  const getProximityText = (location: string) => {
    if (!buyerLocation) return "";
    try {
      const [lat, lon] = location.split(",").map(Number);
      if (isNaN(lat) || isNaN(lon)) return "";
      const dist = calculateDistance(buyerLocation.lat, buyerLocation.lon, lat, lon);
      return dist < 1 ? "📍 < 1km" : `📍 ${dist.toFixed(1)}km`;
    } catch {
      return "";
    }
  };

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 mb-8 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category
                  ? "bg-[#1a5d3a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            {buyerLocation && <option value="proximity">Nearest to Me</option>}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
          >
            <div className="h-48 bg-[#e9d5b5] rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {product.imageUrl && product.imageUrl.startsWith("data:") ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">🌾</span>
              )}
            </div>
            <h3 className="font-bold text-lg text-[#1a5d3a]">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.farmerName}</p>
            <p className="text-sm text-gray-500">{product.location}</p>
            <p className="text-[#4CAF50] font-bold text-lg mt-1">₦{product.price}/{product.unit}</p>
            
            {showDistance && buyerLocation && (
              <p className="text-xs text-[#1a5d3a] font-medium mt-1">
                {getProximityText(product.location)}
              </p>
            )}

            {product.paymentMethod && (
              <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                💳 Pay via: <span className="font-medium">{product.paymentMethod}</span>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 bg-[#1a5d3a] text-white py-2 rounded-md hover:bg-[#0f3d25] transition"
                >
                  🛒 Add to Cart
                </button>
              )}
              <button
                onClick={() => {
                  alert(`Contact ${product.farmerName} at ${product.location}`);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
              >
                📞 Contact
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
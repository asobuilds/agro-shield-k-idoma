"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock } from "@/lib/mockData";

// --- MARKETPLACE GRID (Embedded) ---
function MarketplaceGrid({ products, showDistance, buyerLocation, onAddToCart, onWishlist }: any) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

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

  const allCategories = ["All"];
  products.forEach((p: any) => {
    if (p.category && !allCategories.includes(p.category)) {
      allCategories.push(p.category);
    }
  });
  const categories = allCategories;

  let filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter((p: any) => p.category === selectedCategory);

  if (sortBy === "price-low") {
    filteredProducts.sort((a: any, b: any) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredProducts.sort((a: any, b: any) => b.price - a.price);
  } else if (sortBy === "proximity" && buyerLocation) {
    filteredProducts.sort((a: any, b: any) => {
      const distA = getDistance(a.location);
      const distB = getDistance(b.location);
      return distA - distB;
    });
  }

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
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
              {onWishlist && (
                <button
                  onClick={() => onWishlist(product)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  ⭐ Wishlist
                </button>
              )}
              <button
                onClick={() => alert(`Contact ${product.farmerName} at ${product.location}`)}
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

// --- MAIN BUYER DASHBOARD ---
export default function BuyerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [buyerLocation, setBuyerLocation] = useState<{lat: number, lon: number} | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [showWishlist, setShowWishlist] = useState(false);

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

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setBuyerLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => console.log("Location denied")
      );
    }

    const savedCart = localStorage.getItem("buyer_cart");
    if (savedCart) setCart(JSON.parse(savedCart));

    const savedWishlist = localStorage.getItem("buyer_wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("buyer_cart", JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem("buyer_cart", JSON.stringify(newCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const addToWishlist = (product: any) => {
    if (wishlist.find(item => item.id === product.id)) {
      alert(`${product.name} is already in your wishlist!`);
      return;
    }
    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);
    localStorage.setItem("buyer_wishlist", JSON.stringify(newWishlist));
    alert(`${product.name} added to wishlist!`);
  };

  const removeFromWishlist = (id: string) => {
    const newWishlist = wishlist.filter(item => item.id !== id);
    setWishlist(newWishlist);
    localStorage.setItem("buyer_wishlist", JSON.stringify(newWishlist));
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
        <div className="flex gap-4">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bg-[#1a5d3a] text-white px-4 py-2 rounded-md hover:bg-[#0f3d25] transition flex items-center gap-2"
          >
            🛒 Cart ({cart.length})
          </button>
          <button
            onClick={() => setShowWishlist(!showWishlist)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition flex items-center gap-2"
          >
            ⭐ Wishlist ({wishlist.length})
          </button>
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
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)}></div>
          <div className="relative bg-white w-full max-w-md p-6 overflow-y-auto shadow-2xl dark:bg-[#1a1a1a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1a5d3a] dark:text-[#4ade80]">🛒 Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl hover:text-[#1a5d3a]">✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 dark:border-[#2d2d2d]">
                    <div>
                      <p className="font-bold text-[#1a5d3a] dark:text-[#4ade80]">{item.name}</p>
                      <p className="text-sm text-gray-500">₦{item.price} × {item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                ))}
                <div className="pt-4 border-t dark:border-[#2d2d2d]">
                  <p className="text-xl font-bold text-[#1a5d3a] dark:text-[#4ade80]">Total: ₦{cartTotal}</p>
                  <button className="w-full mt-4 bg-[#4CAF50] text-white py-3 rounded-md hover:bg-[#388E3C] transition">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wishlist Sidebar */}
      {showWishlist && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowWishlist(false)}></div>
          <div className="relative bg-white w-full max-w-md p-6 overflow-y-auto shadow-2xl dark:bg-[#1a1a1a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#1a5d3a] dark:text-[#4ade80]">⭐ Your Wishlist</h2>
              <button onClick={() => setShowWishlist(false)} className="text-2xl hover:text-[#1a5d3a]">✕</button>
            </div>
            {wishlist.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your wishlist is empty.</p>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-3 dark:border-[#2d2d2d]">
                    <div>
                      <p className="font-bold text-[#1a5d3a] dark:text-[#4ade80]">{item.name}</p>
                      <p className="text-sm text-gray-500">₦{item.price}/{item.unit}</p>
                      <p className="text-xs text-gray-400">From: {item.farmerName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item.id);
                        }}
                        className="bg-[#1a5d3a] text-white px-3 py-1 rounded-md text-sm"
                      >
                        🛒 Buy Now
                      </button>
                      <button onClick={() => removeFromWishlist(item.id)} className="text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Marketplace Link */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8 dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a5d3a] dark:text-[#4ade80]">🌍 Explore the Global Marketplace</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse products from farms across all regions. Find the best deals and fresh produce.</p>
          </div>
          <Link 
            href="/dashboard/marketplace" 
            className="bg-[#1a5d3a] text-white px-6 py-3 rounded-full hover:bg-[#0f3d25] transition"
          >
            Go to Marketplace →
          </Link>
        </div>
      </div>

      {/* Local Products (Nearby) */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#1a5d3a] dark:text-[#4ade80] mb-4">🌾 Fresh from Nearby Farms</h2>
        <MarketplaceGrid 
          products={products}
          showDistance={true}
          buyerLocation={buyerLocation}
          onAddToCart={addToCart}
          onWishlist={addToWishlist}
        />
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock } from "@/lib/mockData";

// --- SIMPLE, CRASH-PROOF MARKETPLACE GRID ---
function MarketplaceGrid({ products, showDistance, buyerLocation, onAddToCart, onWishlist }: any) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Simple categories
  const categories = ["All", "Vegetables", "Tubers", "Grains", "Fruits"];

  let filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter((p: any) => p.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product: any) => (
          <div key={product.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100">
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
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onAddToCart && onAddToCart(product)}
                className="flex-1 bg-[#1a5d3a] text-white py-2 rounded-md hover:bg-[#0f3d25] transition"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => onWishlist && onWishlist(product)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
              >
                ⭐ Wishlist
              </button>
            </div>
          </div>
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
          <button onClick={() => setShowCart(!showCart)} className="bg-[#1a5d3a] text-white px-4 py-2 rounded-md flex items-center gap-2">
            🛒 Cart ({cart.length})
          </button>
          <button onClick={() => setShowWishlist(!showWishlist)} className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center gap-2">
            ⭐ Wishlist ({wishlist.length})
          </button>
          <button onClick={() => { localStorage.clear(); router.push("/register"); }} className="bg-red-500/80 text-white px-4 py-2 rounded-md">Logout</button>
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
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { addToCart(item); removeFromWishlist(item.id); }} className="bg-[#1a5d3a] text-white px-3 py-1 rounded-md text-sm">
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

      {/* Marketplace Link (Crash-proof) */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8 dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a5d3a] dark:text-[#4ade80]">🌍 Explore the Global Marketplace</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse products from farms across all regions.</p>
          </div>
          <Link href="/dashboard/marketplace" className="bg-[#1a5d3a] text-white px-6 py-3 rounded-full hover:bg-[#0f3d25] transition">
            Go to Marketplace →
          </Link>
        </div>
      </div>

      {/* Products */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h2 className="text-xl font-bold text-[#1a5d3a] dark:text-[#4ade80] mb-4">🌾 Fresh from Nearby Farms</h2>
        <MarketplaceGrid products={products} onAddToCart={addToCart} onWishlist={addToWishlist} />
      </div>
    </div>
  );
}
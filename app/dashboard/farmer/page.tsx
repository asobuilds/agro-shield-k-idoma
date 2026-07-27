"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { MOCK_STATS, MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock, saveToCache } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", image: "" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
      // Load products from localStorage
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
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading dashboard...</div>;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const product = {
      id: Date.now().toString(),
      farmerId: user.id,
      farmerName: user.name,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: "Vegetables",
      quantity: 1,
      unit: "kg",
      imageUrl: newProduct.image || "/images/placeholder.jpg",
      location: user.location || "Unknown",
      isAvailable: true,
    };
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem("farmer_products", JSON.stringify(updatedProducts));
    setShowAddForm(false);
    setNewProduct({ name: "", price: "", description: "", image: "" });
  };

  // Chart data
  const chartData = [
    { name: "Mon", revenue: 12000 },
    { name: "Tue", revenue: 18000 },
    { name: "Wed", revenue: 15000 },
    { name: "Thu", revenue: 22000 },
    { name: "Fri", revenue: 19000 },
    { name: "Sat", revenue: 25000 },
    { name: "Sun", revenue: 14000 },
  ];

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
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🌾 Welcome, {user.name}</h1>
          <p className="text-[#5a3e2b]">Farm Location: {user.location || "Not set"}</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#b8946e]">
          <p className="text-[#5a3e2b] text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-[#2d6a4f]">{getCachedOrMock("stats", MOCK_STATS).totalOrders}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#b8946e]">
          <p className="text-[#5a3e2b] text-sm">Revenue (₦)</p>
          <p className="text-2xl font-bold text-[#e2725b]">{getCachedOrMock("stats", MOCK_STATS).totalRevenue.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#b8946e]">
          <p className="text-[#5a3e2b] text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{getCachedOrMock("stats", MOCK_STATS).pendingOrders}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-[#b8946e]">
          <p className="text-[#5a3e2b] text-sm">Active Products</p>
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
        </motion.div>
      </div>

      {/* Add Product Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#5a3e2b] text-white px-6 py-3 rounded-md hover:bg-[#3d2b1c] shadow-lg transition-all"
        >
          {showAddForm ? "Close Form" : "🌱 Add New Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
          <h3 className="text-xl font-bold text-[#2d6a4f] mb-4">Add Your Farm Product</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b]">Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50"
                placeholder="e.g. Fresh Tomatoes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b]">Price (₦ per kg)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50"
                placeholder="e.g. 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b]">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50"
                placeholder="Describe your product..."
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b]">📸 Product Photo</label>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#b8946e] text-white px-4 py-2 rounded-md hover:bg-[#9a7a56]"
                >
                  📁 Upload from Files
                </button>
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-[#2d6a4f] text-white px-4 py-2 rounded-md hover:bg-[#1b4332]"
                >
                  📸 Take Photo (Camera)
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              {isUploading && <p className="text-sm text-[#5a3e2b] mt-2">Uploading...</p>}
              {newProduct.image && (
                <div className="mt-4">
                  <p className="text-sm text-[#2d6a4f]">✅ Image uploaded!</p>
                  <img src={newProduct.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-md border border-[#b8946e]" />
                </div>
              )}
            </div>
            <button
              onClick={handleAddProduct}
              className="w-full bg-[#2d6a4f] text-white py-3 rounded-md hover:bg-[#1b4332] transition-colors"
            >
              List Product on Marketplace
            </button>
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">📈 Weekly Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#2d6a4f" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Products */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e] mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">🌱 My Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product: any) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-md border border-[#b8946e] hover:shadow-xl transition-all">
              <div className="h-40 bg-[#e9d5b5] rounded-md mb-2 flex items-center justify-center overflow-hidden">
                {product.imageUrl && product.imageUrl.startsWith("data:") ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🌾</span>
                )}
              </div>
              <h3 className="font-bold text-[#2d6a4f]">{product.name}</h3>
              <p className="text-sm text-[#5a3e2b]">{product.category}</p>
              <p className="text-[#e2725b] font-bold">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-[#5a3e2b]">Qty: {product.quantity} {product.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-[#b8946e]">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">📦 Recent Orders</h2>
        <div className="space-y-3">
          {getCachedOrMock("orders", MOCK_ORDERS).map((order: any) => (
            <div key={order.id} className="flex justify-between items-center border-b border-[#b8946e] pb-3">
              <div>
                <p className="font-medium text-[#2d6a4f]">{order.productName}</p>
                <p className="text-sm text-[#5a3e2b]">Qty: {order.quantity} | Total: ₦{order.totalPrice}</p>
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
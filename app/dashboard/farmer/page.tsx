"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  MOCK_STATS, 
  MOCK_PRODUCTS, 
  MOCK_ORDERS, 
  getCachedOrMock, 
  saveToCache 
} from "@/lib/mockData";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// LANGUAGE TRANSLATIONS
const translations = {
  en: {
    welcome: "Welcome",
    farmLocation: "Farm Location",
    backHome: "← Back to Home",
    logout: "Logout",
    totalOrders: "Total Orders",
    revenue: "Revenue (₦)",
    pendingOrders: "Pending Orders",
    activeProducts: "Active Products",
    myProducts: "🌱 My Products",
    addProduct: "+ Add New Product",
    recentOrders: "📦 Recent Orders",
    qty: "Qty",
    total: "Total",
    loading: "Loading dashboard...",
    weeklyRevenue: "📈 Weekly Revenue",
  },
  idoma: {
    welcome: "Nnọọ",
    farmLocation: "Ebe Ugbo",
    backHome: "← Lọta n'Ụlọ",
    logout: "Pụọ",
    totalOrders: "Ihe Ịzụrụ Nile",
    revenue: "Ego (₦)",
    pendingOrders: "Ihe Na-echere",
    activeProducts: "Ngwaahịa Dị Ndụ",
    myProducts: "🌱 Ngwaahịa M",
    addProduct: "+ Tinye Ngwaahịa Ọhụrụ",
    recentOrders: "📦 Ihe Ịzụrụ Ọhụrụ",
    qty: "Ọnụ",
    total: "Mkpokọta",
    loading: "Na-ebudata dashboard...",
    weeklyRevenue: "📈 Ego Kwa Izu",
  },
};

export default function FarmerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "idoma">("en");
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
    }
    const savedLang = localStorage.getItem("agro_lang") as "en" | "idoma" | null;
    if (savedLang) setLang(savedLang);
    
    // Check online status
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
  }, [router]);

  if (!user) return <div className="p-10 text-center">{translations[lang].loading}</div>;

  const t = translations[lang];

  // Fake chart data
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
    <div className="min-h-screen bg-[#f5f0eb] p-6">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-500 text-white p-2 rounded-md mb-4 text-center font-bold">
          ⚠️ You are offline. Using cached data.
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🌾 {t.welcome}, {user.name}</h1>
          <p className="text-gray-600">{t.farmLocation}: {user.location || "Not set"}</p>
          <Link href="/" className="text-sm text-[#2d6a4f] hover:underline mt-2 block">
            {t.backHome}
          </Link>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("user");
              router.push("/register");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            {t.logout}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#2d6a4f]">
          <p className="text-gray-500 text-sm">{t.totalOrders}</p>
          <p className="text-2xl font-bold text-[#2d6a4f]">{getCachedOrMock("stats", MOCK_STATS).totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#e2725b]">
          <p className="text-gray-500 text-sm">{t.revenue}</p>
          <p className="text-2xl font-bold text-[#e2725b]">{getCachedOrMock("stats", MOCK_STATS).totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">{t.pendingOrders}</p>
          <p className="text-2xl font-bold text-yellow-600">{getCachedOrMock("stats", MOCK_STATS).pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">{t.activeProducts}</p>
          <p className="text-2xl font-bold text-blue-600">{getCachedOrMock("stats", MOCK_STATS).activeProducts}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.weeklyRevenue}</h2>
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
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.myProducts}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getCachedOrMock("products", MOCK_PRODUCTS).map((product: any) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-[#2d6a4f] font-bold">₦{product.price}/{product.unit}</p>
              <p className="text-sm text-gray-500">{t.qty}: {product.quantity} {product.unit}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 bg-[#2d6a4f] text-white px-4 py-2 rounded-md hover:bg-[#1b4332]">
          {t.addProduct}
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.recentOrders}</h2>
        <div className="space-y-3">
          {getCachedOrMock("orders", MOCK_ORDERS).map((order: any) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-gray-500">{t.qty}: {order.quantity} | {t.total}: ₦{order.totalPrice}</p>
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
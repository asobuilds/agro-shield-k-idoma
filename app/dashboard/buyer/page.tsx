"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS, MOCK_ORDERS, getCachedOrMock } from "@/lib/mockData";

// LANGUAGE TRANSLATIONS
const translations = {
  en: {
    welcome: "Welcome",
    business: "Business",
    backHome: "← Back to Home",
    logout: "Logout",
    search: "Search for produce...",
    searchBtn: "Search",
    freshFarms: "🌾 Fresh from Farms",
    addToCart: "Add to Cart",
    myOrders: "📦 My Orders",
    from: "From",
    total: "Total",
    loading: "Loading dashboard...",
    offline: "⚠️ You are offline. Using cached data.",
  },
  idoma: {
    welcome: "Nnọọ",
    business: "Azụmahịa",
    backHome: "← Lọta n'Ụlọ",
    logout: "Pụọ",
    search: "Chọọ ihe ọkụkụ...",
    searchBtn: "Chọọ",
    freshFarms: "🌾 Ọhụrụ site n'Ugbo",
    addToCart: "Tinye n'Ụgbọ",
    myOrders: "📦 Ihe Ịzụrụ M",
    from: "Site na",
    total: "Mkpokọta",
    loading: "Na-ebudata dashboard...",
    offline: "⚠️ Ị nọ n'ofu. Na-eji data echekwara.",
  },
};

export default function BuyerDashboard() {
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
    
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
  }, [router]);

  if (!user) return <div className="p-10 text-center">{translations[lang].loading}</div>;

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-6">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-yellow-500 text-white p-2 rounded-md mb-4 text-center font-bold">
          {t.offline}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2d6a4f]">🛒 {t.welcome}, {user.name}</h1>
          <p className="text-gray-600">{t.business}: {user.businessType || "Individual Buyer"}</p>
          <Link href="/" className="text-sm text-[#2d6a4f] hover:underline mt-2 block">
            {t.backHome}
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
          {t.logout}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder={t.search}
            className="flex-1 p-3 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]"
          />
          <button className="bg-[#2d6a4f] text-white px-6 py-3 rounded-md hover:bg-[#1b4332]">
            {t.searchBtn}
          </button>
        </div>
      </div>

      {/* Available Products */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.freshFarms}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getCachedOrMock("products", MOCK_PRODUCTS).map((product: any) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">By: {product.farmerName}</p>
              <p className="text-sm text-gray-500">Location: {product.location}</p>
              <p className="text-[#2d6a4f] font-bold text-lg">₦{product.price}/{product.unit}</p>
              <button className="mt-2 w-full bg-[#e2725b] text-white py-2 rounded-md hover:bg-[#c45a43]">
                {t.addToCart}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* My Orders */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.myOrders}</h2>
        <div className="space-y-3">
          {getCachedOrMock("orders", MOCK_ORDERS).map((order: any) => (
            <div key={order.id} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{order.productName}</p>
                <p className="text-sm text-gray-500">{t.from}: Farmer ID {order.farmerId}</p>
                <p className="text-sm text-gray-500">{t.total}: ₦{order.totalPrice}</p>
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
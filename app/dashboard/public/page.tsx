"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MOCK_PRODUCTS, getCachedOrMock } from "@/lib/mockData";

// LANGUAGE TRANSLATIONS
const translations = {
  en: {
    welcome: "Welcome",
    community: "Agro Shield K' Idoma Community Hub",
    backHome: "← Back to Home",
    logout: "Logout",
    marketPulse: "📊 Market Pulse",
    farmerStories: "🌱 Farmer Stories",
    browse: "🛍️ Browse Produce",
    viewDetails: "View Details",
    loading: "Loading dashboard...",
    offline: "⚠️ You are offline. Using cached data.",
    story1: '"Agro Shield helped me sell my tomatoes in 2 days instead of 2 weeks!"',
    story2: '"I now connect directly with restaurants and earn 30% more profit."',
  },
  idoma: {
    welcome: "Nnọọ",
    community: "Agro Shield K' Idoma Community Hub",
    backHome: "← Lọta n'Ụlọ",
    logout: "Pụọ",
    marketPulse: "📊 Ọnụahịa Ahịa",
    farmerStories: "🌱 Akụkọ Ndị Ọrụ Ugbo",
    browse: "🛍️ Gụọ Ngwaahịa",
    viewDetails: "Hụ Nkọwa",
    loading: "Na-ebudata dashboard...",
    offline: "⚠️ Ị nọ n'ofu. Na-eji data echekwara.",
    story1: '"Agro Shield nyere m aka ree tomato m n\'ime ụbọchị abụọ kama ịbụ izu abụọ!"',
    story2: '"Ugbu a, m na-akpọtụrụ ụlọ oriri ozugbo ma na-enweta uru 30% karịa."',
  },
};

export default function PublicDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState<"en" | "idoma">("en");
  const [isOffline, setIsOffline] = useState(false);
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
    }
    const savedLang = localStorage.getItem("agro_lang") as "en" | "idoma" | null;
    if (savedLang) setLang(savedLang);
    
    setIsOffline(!navigator.onLine);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));

    // Try to fetch real market data (simulated)
    const fetchMarketData = async () => {
      try {
        // This is a free public API for commodity prices (simulated)
        const response = await fetch("https://api.example.com/commodities");
        if (response.ok) {
          const data = await response.json();
          // If real API works, update prices
          // setMarketPrices(data);
        }
      } catch (error) {
        // Use mock data if offline or API fails
        console.log("Using mock market data");
      }
    };
    fetchMarketData();
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
          <h1 className="text-3xl font-bold text-[#2d6a4f]">👥 {t.welcome}, {user.name}</h1>
          <p className="text-gray-600">{t.community}</p>
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

      {/* Market Pulse (Live Price Ticker) */}
      <div className="bg-[#2d6a4f] text-white p-4 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-bold mb-2">{t.marketPulse}</h2>
        <div className="flex gap-6 overflow-x-auto">
          {marketPrices.map((item, index) => (
            <span key={index}>
              {item.item}: ₦{item.price}/{item.unit}
            </span>
          ))}
        </div>
      </div>

      {/* Farmer Stories (Trust Building) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.farmerStories}</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-[#2d6a4f] pl-4">
            <h3 className="font-bold">John from Otukpo</h3>
            <p className="text-sm text-gray-600">{t.story1}</p>
          </div>
          <div className="border-l-4 border-[#e2725b] pl-4">
            <h3 className="font-bold">Mary from Makurdi</h3>
            <p className="text-sm text-gray-600">{t.story2}</p>
          </div>
        </div>
      </div>

      {/* Browse All Products */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-[#2d6a4f] mb-4">{t.browse}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getCachedOrMock("products", MOCK_PRODUCTS).map((product: any) => (
            <div key={product.id} className="border p-4 rounded-lg hover:shadow-lg transition">
              <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-gray-400">
                🖼️ Product Image
              </div>
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">By: {product.farmerName}</p>
              <p className="text-sm text-gray-500">Location: {product.location}</p>
              <p className="text-[#2d6a4f] font-bold">₦{product.price}/{product.unit}</p>
              <button className="mt-2 w-full bg-[#e2725b] text-white py-2 rounded-md hover:bg-[#c45a43]">
                {t.viewDetails}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
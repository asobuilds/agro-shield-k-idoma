"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// LANGUAGE TRANSLATIONS
const translations = {
  en: {
    title: "Bridging Farmers to Buyers",
    subtitle: "Agro Shield K' Idoma connects local agricultural producers directly to buyers, restaurants, and the public – ensuring fresh food, fair prices, and a thriving community.",
    getStarted: "Join Now – It's Free",
    goDashboard: "Go to Dashboard",
    learnMore: "Learn More",
    whyTitle: "Why Agro Shield?",
    feature1Title: "Fresh from Farm",
    feature1Desc: "Buy directly from local farmers – no middlemen, no delays.",
    feature2Title: "Fair Prices",
    feature2Desc: "Farmers earn more, buyers pay less – a win-win for the community.",
    feature3Title: "Trust & Transparency",
    feature3Desc: "Verified farmers, clear order tracking, and honest reviews.",
    footer: "© 2026 Agro Shield K' Idoma. Built for the community.",
    navHome: "Home",
    navDashboard: "Dashboard",
    navGetStarted: "Get Started",
    language: "Language",
  },
  idoma: {
    title: "Onye oche k' Idoma",
    subtitle: "Agro Shield K' Idoma na-ekọta ndị ọrụ ugbo n'ime obodo na ndị na-azụ ahịa, ụlọ oriri, na ọha na eze – na-eme ka nri dị ọhụrụ, ọnụahịa dị mma, na obodo na-eto eto.",
    getStarted: "Banye Ugbu a – Ọ Bụ Ọfọrọ",
    goDashboard: "Gaa na Dashboard",
    learnMore: "Mụta Ihe Ọzọ",
    whyTitle: "Gịnị kpatara Agro Shield?",
    feature1Title: "Ọhụrụ site n'Ugbo",
    feature1Desc: "Zụta site n'aka ndị ọrụ ugbo n'ime obodo – enweghị ndị na-ere ahịa, enweghị oge na-egbu.",
    feature2Title: "Ọnụahịa Dị Mma",
    feature2Desc: "Ndị ọrụ ugbo na-enweta ego karịa, ndị na-azụ ahịa na-akwụ ọnụ ala – uru maka obodo niile.",
    feature3Title: "Ntụkwasị Obi & Ịdị N'ịkọwa",
    feature3Desc: "Ndị ọrụ ugbo a kwụrụ ezigbo, nlekota ihe ịzụrụ doro anya, na nyocha eziokwu.",
    footer: "© 2026 Agro Shield K' Idoma. Emebere maka obodo.",
    navHome: "Ụlọ",
    navDashboard: "Dashboard",
    navGetStarted: "Bido",
    language: "Asụsụ",
  },
};

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lang, setLang] = useState<"en" | "idoma">("en");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
    const savedLang = localStorage.getItem("agro_lang") as "en" | "idoma" | null;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "idoma" : "en";
    setLang(newLang);
    localStorage.setItem("agro_lang", newLang);
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center flex-wrap gap-4">
        <div className="text-2xl font-bold text-[#2d6a4f]">
          🌾 Agro Shield K' Idoma
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <Link href="/" className="text-[#2d6a4f] hover:underline">{t.navHome}</Link>
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="text-[#2d6a4f] hover:underline">{t.navDashboard}</Link>
          ) : (
            <Link href="/register" className="bg-[#2d6a4f] text-white px-4 py-2 rounded-md hover:bg-[#1b4332]">
              {t.navGetStarted}
            </Link>
          )}
          <button
            onClick={toggleLanguage}
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
          >
            {lang === "en" ? "🌍 Idoma" : "🌍 English"}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-[#2d6a4f] mb-4">
          {t.title}
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="bg-[#e2725b] text-white px-8 py-3 rounded-md hover:bg-[#c45a43]">
              {t.goDashboard}
            </Link>
          ) : (
            <Link href="/register" className="bg-[#e2725b] text-white px-8 py-3 rounded-md hover:bg-[#c45a43]">
              {t.getStarted}
            </Link>
          )}
          <Link href="#features" className="border-2 border-[#2d6a4f] text-[#2d6a4f] px-8 py-3 rounded-md hover:bg-[#2d6a4f] hover:text-white transition">
            {t.learnMore}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2d6a4f] mb-12">{t.whyTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">{t.feature1Title}</h3>
              <p className="text-gray-600">{t.feature1Desc}</p>
            </div>
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">{t.feature2Title}</h3>
              <p className="text-gray-600">{t.feature2Desc}</p>
            </div>
            <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">{t.feature3Title}</h3>
              <p className="text-gray-600">{t.feature3Desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1b4332] text-white py-8 text-center">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
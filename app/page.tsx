"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Floating Leaf Component
const FloatingLeaf = ({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -50, x: 0 }}
    animate={{
      opacity: [0, 1, 1, 0],
      y: [0, 100, 200, 300],
      x: [0, x, -x, 0],
      rotate: [0, 360, 720],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
    className="absolute text-4xl pointer-events-none"
    style={{ left: `${y}%`, top: `${x}%`, fontSize: `${size}px` }}
  >
    🍃
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] overflow-hidden relative">
      {/* Animated Leaves Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <FloatingLeaf delay={0} x={10} y={20} size={24} />
        <FloatingLeaf delay={3} x={30} y={70} size={30} />
        <FloatingLeaf delay={6} x={50} y={40} size={20} />
        <FloatingLeaf delay={9} x={70} y={80} size={28} />
        <FloatingLeaf delay={12} x={90} y={10} size={22} />
        <FloatingLeaf delay={15} x={20} y={90} size={26} />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-md px-6 py-4 flex justify-between items-center border-b border-[#b8946e]">
        <div className="text-2xl font-bold text-[#2d6a4f] flex items-center gap-2">
          <span className="text-3xl">🌾</span> Agro Shield K' Idoma
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-[#5a3e2b] hover:underline">Home</Link>
          {isLoggedIn ? (
            <Link href="/dashboard/farmer" className="text-[#5a3e2b] hover:underline">Dashboard</Link>
          ) : (
            <Link href="/register" className="bg-[#5a3e2b] text-white px-4 py-2 rounded-md hover:bg-[#3d2b1c] shadow-sm">
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold text-[#2d6a4f] mb-4 drop-shadow-sm">
            From Our Farm <br /> to Your Table
          </h1>
          <p className="text-xl text-[#5a3e2b] mb-8 max-w-2xl mx-auto font-light">
            Agro Shield K' Idoma connects local farmers directly to buyers, restaurants, and the public – ensuring fresh food, fair prices, and a thriving community.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isLoggedIn ? (
              <Link href="/dashboard/farmer" className="bg-[#b8946e] text-white px-8 py-3 rounded-md hover:bg-[#9a7a56] shadow-lg transition-all">
                Go to Dashboard
              </Link>
            ) : (
              <Link href="/register" className="bg-[#b8946e] text-white px-8 py-3 rounded-md hover:bg-[#9a7a56] shadow-lg transition-all">
                Join Now – It's Free
              </Link>
            )}
            <Link href="#features" className="border-2 border-[#5a3e2b] text-[#5a3e2b] px-8 py-3 rounded-md hover:bg-[#5a3e2b] hover:text-white transition-all">
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 bg-white/60 backdrop-blur-sm py-16 border-t border-[#b8946e]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#2d6a4f] mb-12">Why Agro Shield?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 p-6 rounded-xl shadow-lg border border-[#b8946e] backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Fresh from Farm</h3>
              <p className="text-[#5a3e2b]">Buy directly from local farmers – no middlemen, no delays.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 p-6 rounded-xl shadow-lg border border-[#b8946e] backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Fair Prices</h3>
              <p className="text-[#5a3e2b]">Farmers earn more, buyers pay less – a win-win for the community.</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/80 p-6 rounded-xl shadow-lg border border-[#b8946e] backdrop-blur-sm text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-[#2d6a4f]">Trust & Transparency</h3>
              <p className="text-[#5a3e2b]">Verified farmers, clear order tracking, and honest reviews.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#3d2b1c] text-[#fdf6e3] py-8 text-center border-t border-[#b8946e]">
        <p>© 2026 Agro Shield K' Idoma. Built for the community.</p>
      </footer>
    </div>
  );
}
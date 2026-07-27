"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  user: any;
}

export default function Sidebar({ isOpen, toggleSidebar, user }: SidebarProps) {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("agro_dark_mode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
    
    const savedFontSize = localStorage.getItem("agro_font_size");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}px`;
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("agro_dark_mode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem("agro_font_size", String(newSize));
    document.documentElement.style.fontSize = `${newSize}px`;
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    router.push("/register");
  };

  if (!user) return null;

  const role = user.role || "farmer";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-72 bg-white/90 backdrop-blur-md shadow-2xl z-50 border-r border-[#b8946e] flex flex-col dark:bg-[#1a1a1a] dark:border-[#2d2d2d]"
          >
            <div className="p-6 border-b border-[#b8946e] dark:border-[#2d2d2d]">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">🌾 Menu</h2>
                <button onClick={toggleSidebar} className="text-[#5a3e2b] dark:text-gray-400 hover:text-[#2d6a4f] dark:hover:text-[#4ade80] text-2xl">
                  ✕
                </button>
              </div>
              <p className="text-sm text-[#5a3e2b] dark:text-gray-400 mt-2">Welcome, {user.name}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <Link 
                href={`/dashboard/${role}`} 
                className="block p-3 rounded-md hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors text-[#5a3e2b] dark:text-gray-300"
                onClick={toggleSidebar}
              >
                📊 Dashboard
              </Link>
              
              <Link 
                href="/profile" 
                className="block p-3 rounded-md hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors text-[#5a3e2b] dark:text-gray-300"
                onClick={toggleSidebar}
              >
                👤 Profile
              </Link>

              <div className="border-t border-[#b8946e] dark:border-[#2d2d2d] my-2"></div>

              <div className="flex items-center justify-between p-3 rounded-md hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors">
                <span className="text-[#5a3e2b] dark:text-gray-300">🌙 Dark Mode</span>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full flex items-center transition-colors ${darkMode ? 'bg-[#2d6a4f]' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-md hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors">
                <span className="text-[#5a3e2b] dark:text-gray-300">🔤 Text Size</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeFontSize(-2)}
                    className="w-8 h-8 rounded-full bg-[#b8946e] dark:bg-[#2d2d2d] text-white flex items-center justify-center hover:bg-[#9a7a56] dark:hover:bg-[#3d3d3d]"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => changeFontSize(2)}
                    className="w-8 h-8 rounded-full bg-[#b8946e] dark:bg-[#2d2d2d] text-white flex items-center justify-center hover:bg-[#9a7a56] dark:hover:bg-[#3d3d3d]"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="border-t border-[#b8946e] dark:border-[#2d2d2d] my-2"></div>

              {/* ✅ FIXED SETTINGS LINK */}
              <Link 
                href="/settings" 
                className="block p-3 rounded-md hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors text-[#5a3e2b] dark:text-gray-300"
                onClick={toggleSidebar}
              >
                ⚙️ Settings
              </Link>
            </div>

            <div className="p-4 border-t border-[#b8946e] dark:border-[#2d2d2d]">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500/80 text-white py-3 rounded-md hover:bg-red-600 transition-colors backdrop-blur-sm"
              >
                🚪 Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
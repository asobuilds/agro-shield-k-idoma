"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar"; 
import FeedbackButton from "@/components/FeedbackButton"; 
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname]);

  const isDashboard = pathname?.startsWith("/dashboard") || pathname === "/profile";
  const showUI = isDashboard && user;

  return (
    <html lang="en">
      <head>
        <title>Agro Shield K' Idoma</title>
        <meta name="description" content="Bridging Farmers to Buyers" />
      </head>
      <body className="bg-[#fdf6e3] text-[#5a3e2b] dark:bg-[#121212] dark:text-gray-300 transition-colors duration-300">
        {showUI && (
          <>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 z-30 bg-white/80 backdrop-blur-md p-3 rounded-md shadow-md border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d] hover:bg-[#fdf6e3] dark:hover:bg-[#2d2d2d] transition-colors"
            >
              ☰
            </button>

            <Sidebar 
              isOpen={isSidebarOpen} 
              toggleSidebar={() => setIsSidebarOpen(false)} 
              user={user} 
            />

            <FeedbackButton />
          </>
        )}
        
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
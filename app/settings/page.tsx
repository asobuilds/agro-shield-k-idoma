"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn || !storedUser) {
      router.push("/register");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-6 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/dashboard/${user.role}`} className="text-sm text-[#5a3e2b] dark:text-gray-400 hover:underline flex items-center gap-2">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-6">⚙️ Settings</h1>

        <div className="space-y-6">
          <div className="border-b border-[#b8946e] dark:border-[#2d2d2d] pb-4">
            <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">Account</h2>
            <p className="text-sm text-[#5a3e2b] dark:text-gray-400 mt-2">
              Name: {user.name}<br />
              Email: {user.email}<br />
              Role: {user.role}
            </p>
          </div>

          <div className="border-b border-[#b8946e] dark:border-[#2d2d2d] pb-4">
            <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">Preferences</h2>
            <p className="text-sm text-[#5a3e2b] dark:text-gray-400 mt-2">
              Dark Mode: Available in sidebar<br />
              Text Size: Available in sidebar
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#2d6a4f] dark:text-[#4ade80]">Danger Zone</h2>
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/register");
              }}
              className="mt-2 bg-red-500/80 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Account / Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
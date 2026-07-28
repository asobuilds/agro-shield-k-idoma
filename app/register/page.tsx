"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Base fields for all users
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "farmer",
    password: "",
    // Farmer-specific
    farmName: "",
    farmLocation: "",
    // Buyer-specific
    businessType: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Save user data to localStorage
    const userData = { ...form, id: Date.now().toString() };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    // DIRECT REDIRECT (No timeout, instant)
    router.push(`/dashboard/${form.role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-4 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#b8946e] dark:bg-[#1a1a1a]/95 dark:border-[#2d2d2d]">
        <h1 className="text-3xl font-bold text-[#2d6a4f] mb-6 text-center dark:text-[#4ade80]">🌾 Join Agro Shield</h1>
        <Link href="/" className="text-sm text-[#5a3e2b] dark:text-gray-400 hover:underline mb-4 block text-center">
          ← Back to Home
        </Link>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-300">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields for Everyone */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              required
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              required
              placeholder="+234..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">I am a... *</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white"
            >
              <option value="farmer">🌾 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="public">👥 Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              required
              placeholder="Min 6 characters"
            />
          </div>

          {/* ROLE-SPECIFIC FIELDS */}
          {form.role === "farmer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Farm Name</label>
                <input
                  type="text"
                  value={form.farmName}
                  onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                  className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                  placeholder="e.g., John's Fresh Farm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Farm Location / Nearest Bus Stop</label>
                <input
                  type="text"
                  value={form.farmLocation}
                  onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                  className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                  placeholder="e.g., Otukpo Main Market or GPS coordinates"
                />
              </div>
            </>
          )}

          {form.role === "buyer" && (
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Business Type</label>
              <input
                type="text"
                value={form.businessType}
                onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                placeholder="e.g., Restaurant, Supermarket, Individual"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d6a4f] text-white py-3 rounded-md hover:bg-[#1b4332] transition-colors dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
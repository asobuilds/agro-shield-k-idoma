"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Base fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("farmer");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Role-specific fields
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [businessType, setBusinessType] = useState("");

  // Form validation
  const validate = () => {
    if (!name.trim()) { setError("Full name is required"); return false; }
    if (!email.trim() || !email.includes("@")) { setError("Valid email is required"); return false; }
    if (!phone.trim() || phone.length < 10) { setError("Valid phone number is required"); return false; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return false; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validate()) {
      setLoading(false);
      return;
    }

    // Build user object
    const userData: any = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      role,
      password,
      createdAt: new Date().toISOString(),
    };

    // Add role-specific fields
    if (role === "farmer") {
      userData.farmName = farmName;
      userData.farmLocation = farmLocation;
    }
    if (role === "buyer") {
      userData.businessType = businessType;
    }

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");

    // Redirect using router.replace (instant, no page reload)
    router.replace(`/dashboard/${role}`);
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
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="+234..."
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">I am a... *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white"
            >
              <option value="farmer">🌾 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="public">👥 Public</option>
            </select>
          </div>

          {/* ROLE-SPECIFIC FIELDS (Only show for the right role) */}
          {role === "farmer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Farm Name</label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                  placeholder="e.g., John's Fresh Farm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Farm Location / Bus Stop</label>
                <input
                  type="text"
                  value={farmLocation}
                  onChange={(e) => setFarmLocation(e.target.value)}
                  className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                  placeholder="e.g., Otukpo Main Market"
                />
              </div>
            </>
          )}

          {role === "buyer" && (
            <div>
              <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Business Type</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                placeholder="e.g., Restaurant, Supermarket"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Min 6 characters"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Re-enter password"
            />
          </div>

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
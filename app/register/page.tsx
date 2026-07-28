"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "farmer",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    farmName: "",
    farmLocation: "",
    businessType: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (pass.length < 6) return "Too short";
    if (pass.length < 8) return "Weak";
    if (pass.match(/[A-Z]/) && pass.match(/[0-9]/) && pass.match(/[^A-Za-z0-9]/)) return "Strong";
    return "Medium";
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
      valid = false;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      newErrors.phone = "Valid phone number is required (min 10 digits)";
      valid = false;
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");

    if (!validate()) {
      setLoading(false);
      return;
    }

    // Save user to localStorage
    const userData = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role,
      password: form.password,
      farmName: form.farmName,
      farmLocation: form.farmLocation,
      businessType: form.businessType,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("user", JSON.stringify(userData));
    
    // Handle "Remember Me"
    if (form.rememberMe) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
    }

    // BULLETPROOF REDIRECT (100% guaranteed to work)
    setLoading(true);
    setTimeout(() => {
      window.location.href = `/dashboard/${form.role}`;
    }, 500);
  };

  const handleForgotPassword = () => {
    if (!form.email) {
      setGeneralError("Please enter your email first");
      return;
    }
    // Simulate password recovery
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.email === form.email) {
        alert(`Password reset link sent to ${form.email}\n(Simulated: Your password is "${userData.password}")`);
      } else {
        alert("No account found with that email.");
      }
    } else {
      alert("No account found. Please register first.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-4 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#b8946e] dark:bg-[#1a1a1a]/95 dark:border-[#2d2d2d]">
        <h1 className="text-3xl font-bold text-[#2d6a4f] mb-6 text-center dark:text-[#4ade80]">🌾 Join Agro Shield</h1>
        <Link href="/" className="text-sm text-[#5a3e2b] dark:text-gray-400 hover:underline mb-4 block text-center">
          ← Back to Home
        </Link>
        {generalError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 dark:bg-red-900/30 dark:text-red-300">{generalError}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Phone *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="+234..."
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{errors.phone}</p>}
          </div>

          {/* Role */}
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

          {/* Role-specific fields */}
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
                <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Farm Location / Bus Stop</label>
                <input
                  type="text"
                  value={form.farmLocation}
                  onChange={(e) => setForm({ ...form, farmLocation: e.target.value })}
                  className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
                  placeholder="e.g., Otukpo Main Market"
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
                placeholder="e.g., Restaurant, Supermarket"
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Min 6 characters"
            />
            {form.password && (
              <div className="text-xs mt-1">
                Strength: <span className={
                  getPasswordStrength(form.password) === "Strong" ? "text-green-500" :
                  getPasswordStrength(form.password) === "Medium" ? "text-yellow-500" :
                  "text-red-500"
                }>{getPasswordStrength(form.password)}</span>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-300">Confirm Password *</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white placeholder-gray-400"
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 dark:text-red-400">{errors.confirmPassword}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-[#2d6a4f] focus:ring-[#2d6a4f]"
            />
            <label className="text-sm text-[#5a3e2b] dark:text-gray-300">Remember me</label>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#2d6a4f] dark:text-[#4ade80] hover:underline"
            >
              Forgot Password?
            </button>
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
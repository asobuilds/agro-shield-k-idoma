"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone required"),
  role: z.enum(["farmer", "buyer", "public"]),
  password: z.string().min(6, "Password must be 6+ characters"),
  farmName: z.string().optional(),
  farmLocation: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch("role");

  // Get user's current location (GPS)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setLocationError("");
        },
        (err) => {
          setLocationError("Unable to get location. Please enter manually.");
          console.error(err);
        }
      );
    } else {
      setLocationError("Geolocation not supported. Please enter manually.");
    }
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const userData = {
      ...data,
      id: Date.now(),
      location: location || data.farmLocation || "Unknown",
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/dashboard/${data.role}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#b8946e]">
        <h1 className="text-3xl font-bold text-[#2d6a4f] mb-6 text-center flex items-center justify-center gap-2">
          <span>🌾</span> Join Agro Shield
        </h1>
        <Link href="/" className="text-sm text-[#5a3e2b] hover:underline mb-4 block text-center">
          ← Back to Home
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">Full Name</label>
            <input {...register("name")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">Email</label>
            <input {...register("email")} type="email" className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">Phone</label>
            <input {...register("phone")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">I am a...</label>
            <select {...register("role")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50">
              <option value="farmer">🌾 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="public">👥 Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b]">Password</label>
            <input {...register("password")} type="password" className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {selectedRole === "farmer" && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b]">Farm Name (Optional)</label>
                <input {...register("farmName")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a3e2b]">📍 Farm Location (GPS)</label>
                {location && !locationError && (
                  <p className="text-sm text-[#2d6a4f]">✅ Location captured: {location}</p>
                )}
                {locationError && (
                  <p className="text-sm text-red-500">{locationError}</p>
                )}
                <input {...register("farmLocation")} placeholder="Or type address manually" className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 mt-2" />
              </div>
            </>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-[#5a3e2b] text-white py-3 rounded-md hover:bg-[#3d2b1c] transition-colors shadow-md">
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone required"),
  role: z.enum(["farmer", "buyer", "public"]),
  password: z.string().min(6, "Password must be 6+ characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    localStorage.setItem("user", JSON.stringify({ ...data, id: Date.now() }));
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/dashboard/${data.role}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6e3] via-[#e9d5b5] to-[#c8a87c] p-4 dark:from-[#121212] dark:via-[#1a1a1a] dark:to-[#0d0d0d]">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#b8946e] dark:bg-[#1a1a1a] dark:border-[#2d2d2d]">
        <h1 className="text-3xl font-bold text-[#2d6a4f] dark:text-[#4ade80] mb-6 text-center">
          Join Agro Shield
        </h1>
        <Link href="/" className="text-sm text-[#2d6a4f] dark:text-gray-400 hover:underline mb-4 block text-center">
          ← Back to Home
        </Link>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-400">Full Name</label>
            <input {...register("name")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-400">Email</label>
            <input {...register("email")} type="email" className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-400">Phone</label>
            <input {...register("phone")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-400">I am a...</label>
            <select {...register("role")} className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white">
              <option value="farmer">🌾 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="public">👥 Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5a3e2b] dark:text-gray-400">Password</label>
            <input {...register("password")} type="password" className="w-full p-3 border border-[#b8946e] rounded-md focus:ring-2 focus:ring-[#2d6a4f] bg-white/50 dark:bg-[#2d2d2d] dark:border-[#3d3d3d] dark:text-white" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#2d6a4f] text-white py-3 rounded-md hover:bg-[#1b4332] transition-colors dark:bg-[#4ade80] dark:text-[#121212] dark:hover:bg-[#3bbd6e]">
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0eb]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#e2725b]">
        <h1 className="text-3xl font-bold text-[#2d6a4f] mb-6 text-center">
          Join Agro Shield
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input {...register("name")} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input {...register("email")} type="email" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input {...register("phone")} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">I am a...</label>
            <select {...register("role")} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]">
              <option value="farmer">🌾 Farmer</option>
              <option value="buyer">🛒 Buyer</option>
              <option value="public">👥 Public</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input {...register("password")} type="password" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#2d6a4f]" />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#2d6a4f] text-white py-3 rounded-md hover:bg-[#1b4332] transition-colors">
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
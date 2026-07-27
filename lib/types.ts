export type UserRole = "farmer" | "buyer" | "public";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location?: string;
  farmSize?: number;
  businessType?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  imageUrl: string;
  location: string;
  isAvailable: boolean;
}

export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "packing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
}
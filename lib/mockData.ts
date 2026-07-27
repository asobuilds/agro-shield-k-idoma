import { User, Product, Order, DashboardStats } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Farmer",
    email: "farmer@test.com",
    role: "farmer",
    phone: "+2348012345678",
    location: "Otukpo",
    farmSize: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Mary Buyer",
    email: "buyer@test.com",
    role: "buyer",
    phone: "+2348098765432",
    businessType: "Restaurant",
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    farmerId: "1",
    farmerName: "John Farmer",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 500,
    quantity: 100,
    unit: "kg",
    imageUrl: "/images/tomatoes.jpg",
    location: "Otukpo",
    isAvailable: true,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "o1",
    buyerId: "2",
    farmerId: "1",
    productId: "p1",
    productName: "Fresh Tomatoes",
    quantity: 10,
    totalPrice: 5000,
    status: "shipped",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const MOCK_STATS: DashboardStats = {
  totalOrders: 45,
  totalRevenue: 125000,
  pendingOrders: 3,
  activeProducts: 12,
};
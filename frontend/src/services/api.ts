import axios from 'axios';
import type { ApiResponse, Product, Category, Cart, ProductFilters, PaginationParams } from '../types';

// Configure base URL for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// Product API
export const productApi = {
  // Get all products with filters and pagination
  getProducts: async (filters?: ProductFilters & PaginationParams): Promise<ApiResponse<{ products: Product[]; pagination: any }>> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) params.append('inStock', filters.inStock.toString());

    return api.get(`/products?${params.toString()}`);
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<ApiResponse<Product[]>> => {
    return api.get('/products/featured');
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<ApiResponse<Product>> => {
    return api.get(`/products/${slug}`);
  },

  // Get product by ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    return api.get(`/products/id/${id}`);
  },

  // Search products
  searchProducts: async (query: string, page = 1, limit = 12): Promise<ApiResponse<{ products: Product[]; pagination: any }>> => {
    return api.get(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  },
};

// Category API
export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    return api.get('/categories');
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<ApiResponse<Category>> => {
    return api.get(`/categories/${slug}`);
  },
};

// Cart API
export const cartApi = {
  // Get user cart
  getCart: async (): Promise<ApiResponse<Cart>> => {
    return api.get('/cart');
  },

  // Add item to cart
  addToCart: async (productId: string, quantity: number, variant?: string): Promise<ApiResponse<Cart>> => {
    return api.post('/cart/add', { productId, quantity, variant });
  },

  // Update cart item
  updateCartItem: async (productId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    return api.put('/cart/update', { productId, quantity });
  },

  // Remove item from cart
  removeFromCart: async (productId: string): Promise<ApiResponse<Cart>> => {
    return api.delete('/cart/remove', { data: { productId } });
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    return api.delete('/cart/clear');
  },
};

// Auth API - Multiple authentication methods
export const authApi = {
  // Traditional email/password login
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  // Traditional registration
  register: async (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    return api.post('/auth/register', userData);
  },

  // Mobile OTP - Request OTP
  requestOTP: async (phoneNumber: string, method: 'sms' | 'whatsapp' = 'sms') => {
    return api.post('/auth/request-otp', { phoneNumber, method });
  },

  // Mobile OTP - Verify OTP and login/register
  verifyOTP: async (phoneNumber: string, otp: string) => {
    return api.post('/auth/verify-otp', { phoneNumber, otp });
  },

  // Google OAuth login
  googleLogin: async (idToken: string) => {
    return api.post('/auth/google', { idToken });
  },

  // Profile management
  updateProfile: async (userData: { firstName: string; lastName: string; email: string; phone: string }) => {
    return api.put('/auth/profile', userData);
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  // Session management
  logout: async () => {
    return api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken });
  },
};

// Payment API
export const paymentApi = {
  // Create order
  createOrder: async (shippingAddress: any, paymentMethod: string = 'razorpay') => {
    return api.post('/payment/create-order', { shippingAddress, paymentMethod });
  },

  // Verify payment
  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    order_id: string;
  }) => {
    return api.post('/payment/verify', paymentData);
  },

  // Get user orders
  getOrders: async (page: number = 1, limit: number = 10, status?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (status) params.append('status', status);

    return api.get(`/payment/orders?${params.toString()}`);
  },

  // Get specific order
  getOrder: async (orderId: string) => {
    return api.get(`/payment/orders/${orderId}`);
  },
};

// Admin API
export const adminApi = {
  // Dashboard stats
  getDashboardStats: async () => {
    return api.get('/admin/dashboard/stats');
  },

  // Categories
  getCategories: async () => {
    return api.get('/admin/categories');
  },

  createCategory: async (categoryData: { name: string; description?: string; isActive?: boolean }) => {
    return api.post('/admin/categories', categoryData);
  },

  updateCategory: async (id: string, categoryData: { name?: string; description?: string; isActive?: boolean }) => {
    return api.put(`/admin/categories/${id}`, categoryData);
  },

  deleteCategory: async (id: string) => {
    return api.delete(`/admin/categories/${id}`);
  },

  // Products
  getProducts: async (params?: { page?: number; limit?: number; category?: string; search?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);

    return api.get(`/admin/products?${searchParams.toString()}`);
  },

  getProduct: async (id: string) => {
    return api.get(`/admin/products/${id}`);
  },

  createProduct: async (formData: FormData) => {
    return api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: async (id: string, formData: FormData) => {
    return api.put(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: async (id: string) => {
    return api.delete(`/admin/products/${id}`);
  },
};

export default api;
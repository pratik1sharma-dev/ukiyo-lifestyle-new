import axios from 'axios';
import type { ApiResponse, Product, Category, Cart, ProductFilters, PaginationParams } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
  (response) => response.data,
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
  updateCartItem: async (itemId: string, quantity: number): Promise<ApiResponse<Cart>> => {
    return api.put('/cart/update', { itemId, quantity });
  },

  // Remove item from cart
  removeFromCart: async (itemId: string): Promise<ApiResponse<Cart>> => {
    return api.delete('/cart/remove', { data: { itemId } });
  },

  // Clear cart
  clearCart: async (): Promise<ApiResponse<{ message: string }>> => {
    return api.delete('/cart/clear');
  },
};

// Auth API (for future implementation)
export const authApi = {
  login: async (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: async (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    return api.post('/auth/register', userData);
  },

  updateProfile: async (userData: { firstName: string; lastName: string; email: string; phone: string }) => {
    return api.put('/auth/profile', userData);
  },

  getProfile: async () => {
    return api.get('/auth/profile');
  },

  logout: async () => {
    return api.post('/auth/logout');
  },

  refreshToken: async (refreshToken: string) => {
    return api.post('/auth/refresh', { refreshToken });
  },
};

export default api;
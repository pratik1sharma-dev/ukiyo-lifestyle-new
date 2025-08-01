import axios from 'axios';

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (when implemented)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response.data; // Return just the data part
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', data?.message || 'Unknown error');
      }
      
      return Promise.reject(data || { message: 'API Error' });
    } else if (error.request) {
      // Network error
      console.error('Network error - backend may be down');
      return Promise.reject({ message: 'Network error - please check your connection' });
    } else {
      // Something else happened
      return Promise.reject({ message: error.message || 'Unknown error' });
    }
  }
);

// API Service object with all endpoints
const apiService = {
  // Product endpoints
  products: {
    // Get all products with pagination
    getAll: async (params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      return api.get(`/products${queryParams ? `?${queryParams}` : ''}`);
    },

    // Get featured products
    getFeatured: async () => {
      return api.get('/products/featured');
    },

    // Get product by slug
    getBySlug: async (slug) => {
      return api.get(`/products/${slug}`);
    },

    // Get products by category
    getByCategory: async (categorySlug, params = {}) => {
      const queryParams = new URLSearchParams(params).toString();
      return api.get(`/products/category/${categorySlug}${queryParams ? `?${queryParams}` : ''}`);
    },
  },

  // Category endpoints
  categories: {
    // Get all categories
    getAll: async () => {
      return api.get('/categories');
    },

    // Get category by slug
    getBySlug: async (slug) => {
      return api.get(`/categories/${slug}`);
    },

    // Get root categories only
    getRoot: async () => {
      return api.get('/categories/root');
    },
  },

  // Cart endpoints
  cart: {
    // Get user cart
    get: async () => {
      return api.get('/cart');
    },

    // Add item to cart
    addItem: async (productId, quantity = 1) => {
      return api.post('/cart/add', {
        productId,
        quantity,
      });
    },

    // Update cart item quantity
    updateItem: async (productId, quantity) => {
      return api.put('/cart/update', {
        productId,
        quantity,
      });
    },

    // Remove item from cart
    removeItem: async (productId) => {
      return api.delete('/cart/remove', {
        data: { productId },
      });
    },

    // Clear entire cart
    clear: async () => {
      return api.delete('/cart/clear');
    },
  },

  // Order endpoints (for future use)
  orders: {
    // Create new order
    create: async (orderData) => {
      return api.post('/orders', orderData);
    },

    // Get user orders
    getAll: async () => {
      return api.get('/orders');
    },

    // Get order by ID
    getById: async (orderId) => {
      return api.get(`/orders/${orderId}`);
    },

    // Update order status
    updateStatus: async (orderId, status) => {
      return api.put(`/orders/${orderId}/status`, { status });
    },
  },

  // Auth endpoints (for future use)
  auth: {
    // Register new user
    register: async (userData) => {
      return api.post('/auth/register', userData);
    },

    // Login user
    login: async (email, password) => {
      return api.post('/auth/login', { email, password });
    },

    // Get user profile
    getProfile: async () => {
      return api.get('/auth/profile');
    },

    // Update user profile
    updateProfile: async (profileData) => {
      return api.put('/auth/profile', profileData);
    },

    // Change password
    changePassword: async (currentPassword, newPassword) => {
      return api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    },

    // Forgot password
    forgotPassword: async (email) => {
      return api.post('/auth/forgot-password', { email });
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
      return api.post('/auth/reset-password', { token, newPassword });
    },
  },

  // Utility functions
  utils: {
    // Test API connection
    testConnection: async () => {
      try {
        const response = await api.get('/health');
        return { success: true, data: response };
      } catch (error) {
        return { success: false, error };
      }
    },

    // Get API status
    getStatus: async () => {
      return api.get('/');
    },
  },
};

// Export individual services for convenience
export const {
  products: productService,
  categories: categoryService,
  cart: cartService,
  orders: orderService,
  auth: authService,
  utils: utilService,
} = apiService;

// Export default API service
export default apiService;

// Export axios instance for custom requests
export { api };
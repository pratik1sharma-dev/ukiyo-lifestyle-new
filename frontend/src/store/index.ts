import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Category, Cart, User, LoadingState } from '../types';
import { productApi, categoryApi, cartApi, authApi } from '../services/api';

// Product Store
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  currentProduct: Product | null;
  loading: LoadingState;
  fetchProducts: (filters?: any) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  currentProduct: null,
  loading: { isLoading: false, error: null },

  fetchProducts: async (filters) => {
    set({ loading: { isLoading: true, error: null } });
    try {
      const response = await productApi.getProducts(filters);
      set({ 
        products: response.data.data.products,
        loading: { isLoading: false, error: null }
      });
    } catch (error: any) {
      set({ 
        loading: { isLoading: false, error: error.message || 'Failed to fetch products' }
      });
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      const response = await productApi.getFeaturedProducts();
      set({ featuredProducts: response.data.data });
    } catch (error: any) {
      console.error('Failed to fetch featured products:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await categoryApi.getCategories();
      set({ categories: response.data.data });
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchProductBySlug: async (slug: string) => {
    set({ loading: { isLoading: true, error: null } });
    try {
      const response = await productApi.getProductBySlug(slug);
      set({ 
        currentProduct: response.data.data,
        loading: { isLoading: false, error: null }
      });
    } catch (error: any) {
      set({ 
        loading: { isLoading: false, error: error.message || 'Failed to fetch product' }
      });
    }
  },
}));

// Cart Store
interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  loading: LoadingState;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number, variant?: string) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      isOpen: false,
      loading: { isLoading: false, error: null },

      fetchCart: async () => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await cartApi.getCart();
          set({ 
            cart: response.data.data,
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Failed to fetch cart' }
          });
        }
      },

      addToCart: async (productId: string, quantity: number, variant?: string) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await cartApi.addToCart(productId, quantity);
          set({ 
            cart: response.data.data,
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Failed to add to cart' }
          });
        }
      },

      updateCartItem: async (productId: string, quantity: number) => {
        try {
          const response = await cartApi.updateCartItem(productId, quantity);
          set({ cart: response.data.data });
        } catch (error: any) {
          console.error('Failed to update cart item:', error);
        }
      },

      removeFromCart: async (productId: string) => {
        try {
          const response = await cartApi.removeFromCart(productId);
          set({ cart: response.data.data });
        } catch (error: any) {
          console.error('Failed to remove from cart:', error);
        }
      },

      clearCart: async () => {
        try {
          await cartApi.clearCart();
          set({ cart: null });
        } catch (error: any) {
          console.error('Failed to clear cart:', error);
        }
      },

      setCart: (cart: Cart | null) => {
        set({ cart });
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

// Auth Store (for future implementation)
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: LoadingState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  updateProfile: (userData: { firstName: string; lastName: string; email: string; phone: string }) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: { isLoading: false, error: null },

      login: async (email: string, password: string) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await authApi.login(email, password);
          const { user, token, refreshToken } = response.data.data;
          
          // Store tokens
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ 
            user,
            isAuthenticated: true,
            loading: { isLoading: false, error: null }
          });

          // Fetch user's cart after successful login
          try {
            const cartResponse = await cartApi.getCart();
            useCartStore.getState().setCart(cartResponse.data.data);
          } catch (cartError) {
            // Cart fetch failed, but login was successful - continue
            console.warn('Failed to fetch user cart after login:', cartError);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({ 
            loading: { isLoading: false, error: errorMessage }
          });
          throw new Error(errorMessage);
        }
      },

      register: async (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await authApi.register(userData);
          const { user, token, refreshToken } = response.data.data;
          
          // Store tokens
          localStorage.setItem('authToken', token);
          localStorage.setItem('refreshToken', refreshToken);
          
          set({ 
            user,
            isAuthenticated: true,
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({ 
            loading: { isLoading: false, error: errorMessage }
          });
          throw new Error(errorMessage);
        }
      },

      updateProfile: async (userData: { firstName: string; lastName: string; email: string; phone: string }) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await authApi.updateProfile(userData);
          const { user } = response.data.data;
          
          set({ 
            user,
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
          set({ 
            loading: { isLoading: false, error: errorMessage }
          });
          throw new Error(errorMessage);
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          set({ user: null, isAuthenticated: false, loading: { isLoading: false, error: null } });
          return;
        }

        set({ loading: { isLoading: true, error: null } });
        try {
          const response = await authApi.getProfile();
          const { user } = response.data.data;
          
          set({ 
            user,
            isAuthenticated: true,
            loading: { isLoading: false, error: null }
          });

          // Fetch user's cart after auth restoration
          try {
            const cartResponse = await cartApi.getCart();
            useCartStore.getState().setCart(cartResponse.data.data);
          } catch (cartError) {
            // Cart fetch failed, but auth was successful - continue
            console.warn('Failed to fetch user cart after auth restoration:', cartError);
          }
        } catch (error: any) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          set({ 
            user: null, 
            isAuthenticated: false,
            loading: { isLoading: false, error: null }
          });
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
        
        // Clear user's cart on logout
        useCartStore.getState().setCart(null);
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// UI Store for global UI state
interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  theme: 'light' | 'dark';
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  theme: 'light',

  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
  setTheme: (theme) => set({ theme }),
}));
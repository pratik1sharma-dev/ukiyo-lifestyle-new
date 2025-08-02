import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Category, Cart, User, LoadingState } from '../types';
import { productService, categoryService, cartService } from '../services/api';

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
      const response = await productService.getAll(filters);
      set({ 
        products: response.data.products,
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
      const response = await productService.getFeatured();
      set({ featuredProducts: response.data });
    } catch (error: any) {
      console.error('Failed to fetch featured products:', error);
    }
  },

  fetchCategories: async () => {
    try {
      const response = await categoryService.getAll();
      set({ categories: response.data });
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchProductBySlug: async (slug: string) => {
    set({ loading: { isLoading: true, error: null } });
    try {
      const response = await productService.getBySlug(slug);
      set({ 
        currentProduct: response.data,
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
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
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
          const response = await cartService.get();
          set({ 
            cart: response.data,
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
          const response = await cartService.addItem(productId, quantity);
          set({ 
            cart: response.data,
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Failed to add to cart' }
          });
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        try {
          const response = await cartService.updateItem(itemId, quantity);
          set({ cart: response.data });
        } catch (error: any) {
          console.error('Failed to update cart item:', error);
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          const response = await cartService.removeItem(itemId);
          set({ cart: response.data });
        } catch (error: any) {
          console.error('Failed to remove from cart:', error);
        }
      },

      clearCart: async () => {
        try {
          await cartService.clear();
          set({ cart: null });
        } catch (error: any) {
          console.error('Failed to clear cart:', error);
        }
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
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: { isLoading: false, error: null },

      login: async (_email: string, _password: string) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          // TODO: Implement login API call
          console.log('Login functionality to be implemented');
          set({ 
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Login failed' }
          });
        }
      },

      register: async (_userData: any) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          // TODO: Implement register API call
          console.log('Register functionality to be implemented');
          set({ 
            loading: { isLoading: false, error: null }
          });
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Registration failed' }
          });
        }
      },

      logout: () => {
        localStorage.removeItem('authToken');
        set({ user: null, isAuthenticated: false });
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
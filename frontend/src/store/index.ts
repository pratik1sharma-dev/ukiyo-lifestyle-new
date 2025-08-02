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
      set({ featuredProducts: response.data.data || [] });
    } catch (error: any) {
      console.error('Failed to fetch featured products:', error);
      set({ featuredProducts: [] });
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
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: Cart | null) => void;
  isAuthenticated: () => boolean;
  migrateGuestCartToServer: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isOpen: false,
      loading: { isLoading: false, error: null },

      fetchCart: async () => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const token = localStorage.getItem('authToken');
          
          if (token) {
            // User is authenticated - fetch from server
            const response = await cartApi.getCart();
            set({ 
              cart: response.data.data,
              loading: { isLoading: false, error: null }
            });
          } else {
            // Guest user - cart is already in localStorage via persist
            set({ 
              loading: { isLoading: false, error: null }
            });
          }
        } catch (error: any) {
          set({ 
            loading: { isLoading: false, error: error.message || 'Failed to fetch cart' }
          });
        }
      },

      addToCart: async (productId: string, quantity: number, variant?: string) => {
        set({ loading: { isLoading: true, error: null } });
        try {
          const token = localStorage.getItem('authToken');
          
          if (token) {
            // User is authenticated - use server cart
            const response = await cartApi.addToCart(productId, quantity, variant);
            set({ 
              cart: response.data.data,
              loading: { isLoading: false, error: null }
            });
          } else {
            // Guest user - use local cart
            const currentCart = get().cart || { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0, itemCount: 0 };
            
            // Check if product already exists in cart
            const existingItemIndex = currentCart.items.findIndex(item => 
              item.product && item.product._id && item.product._id === productId && item.variant === variant
            );
            
            if (existingItemIndex >= 0) {
              // Update existing item quantity
              currentCart.items[existingItemIndex].quantity += quantity;
              currentCart.items[existingItemIndex].total = 
                Math.round((currentCart.items[existingItemIndex].price * currentCart.items[existingItemIndex].quantity) * 100) / 100;
            } else {
              // Add new item (we need to fetch product details)
              try {
                const productResponse = await productApi.getProductById(productId);
                const product = productResponse.data.data;
                
                // Validate product data
                if (!product || !product._id) {
                  throw new Error('Invalid product data received');
                }
                
                const newItem = {
                  _id: `guest_${Date.now()}_${Math.random()}`,
                  product: {
                    _id: product._id.toString(),
                    name: product.name || 'Unknown Product',
                    slug: product.slug || '',
                    price: product.price || 0,
                    comparePrice: product.comparePrice || null,
                    images: product.images || [],
                    category: product.category || null,
                    inStock: product.inStock || false
                  },
                  quantity,
                  price: product.price || 0,
                  total: Math.round(((product.price || 0) * quantity) * 100) / 100,
                  variant: variant || null
                };
                
                currentCart.items.push(newItem);
              } catch (productError) {
                console.error('Product fetch error:', productError);
                throw new Error('Failed to fetch product details');
              }
            }
            
            // Recalculate cart totals
            currentCart.subtotal = Math.round(currentCart.items.reduce((sum, item) => sum + item.total, 0) * 100) / 100;
            currentCart.tax = 0; // GST is already included in prices
            currentCart.shipping = 0; // No shipping fees
            currentCart.total = currentCart.subtotal; // Total equals subtotal since tax and shipping are 0
            currentCart.itemCount = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ 
              cart: currentCart,
              loading: { isLoading: false, error: null }
            });
          }
          
          // Show success feedback
          console.log('Product added to cart successfully');
          return { success: true };
        } catch (error: any) {
          const errorMessage = error.message || 'Failed to add to cart';
          set({ 
            loading: { isLoading: false, error: errorMessage }
          });
          throw error; // Re-throw to handle in component
        }
      },

      updateCartItem: async (itemId: string, quantity: number) => {
        try {
          const token = localStorage.getItem('authToken');
          
          if (token) {
            // User is authenticated - use server cart
            const response = await cartApi.updateCartItem(itemId, quantity);
            set({ cart: response.data.data });
          } else {
            // Guest user - update local cart
            const currentCart = get().cart;
            if (!currentCart) return;
            
            const itemIndex = currentCart.items.findIndex(item => item._id === itemId);
            if (itemIndex >= 0) {
              currentCart.items[itemIndex].quantity = quantity;
              currentCart.items[itemIndex].total = Math.round((currentCart.items[itemIndex].price * quantity) * 100) / 100;
              
              // Recalculate cart totals
              currentCart.subtotal = Math.round(currentCart.items.reduce((sum, item) => sum + item.total, 0) * 100) / 100;
              currentCart.tax = 0; // GST is already included in prices
              currentCart.shipping = 0; // No shipping fees
              currentCart.total = currentCart.subtotal; // Total equals subtotal since tax and shipping are 0
              currentCart.itemCount = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
              
              set({ cart: { ...currentCart } });
            }
          }
        } catch (error: any) {
          console.error('Failed to update cart item:', error);
          throw error;
        }
      },

      removeFromCart: async (itemId: string) => {
        try {
          const token = localStorage.getItem('authToken');
          
          if (token) {
            // User is authenticated - use server cart
            const response = await cartApi.removeFromCart(itemId);
            set({ cart: response.data.data });
          } else {
            // Guest user - remove from local cart
            const currentCart = get().cart;
            if (!currentCart) return;
            
            currentCart.items = currentCart.items.filter(item => item._id !== itemId);
            
            // Recalculate cart totals
            currentCart.subtotal = Math.round(currentCart.items.reduce((sum, item) => sum + item.total, 0) * 100) / 100;
            currentCart.tax = 0; // GST is already included in prices
            currentCart.shipping = 0; // No shipping fees
            currentCart.total = currentCart.subtotal; // Total equals subtotal since tax and shipping are 0
            currentCart.itemCount = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
            
            set({ cart: currentCart.items.length > 0 ? currentCart : null });
          }
        } catch (error: any) {
          console.error('Failed to remove from cart:', error);
          throw error;
        }
      },

      clearCart: async () => {
        try {
          const token = localStorage.getItem('authToken');
          
          if (token) {
            // User is authenticated - clear server cart
            await cartApi.clearCart();
          }
          
          // Clear local cart for both authenticated and guest users
          set({ cart: null });
        } catch (error: any) {
          console.error('Failed to clear cart:', error);
        }
      },

      setCart: (cart: Cart | null) => {
        set({ cart });
      },

      migrateGuestCartToServer: async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('User must be authenticated to migrate cart');
        }

        const currentCart = get().cart;
        if (!currentCart || !currentCart.items || currentCart.items.length === 0) {
          return; // No guest cart to migrate
        }

        try {
          // Add each item from guest cart to server cart
          for (const item of currentCart.items) {
            await cartApi.addToCart(item.product._id, item.quantity, item.variant);
          }

          // Fetch the updated server cart
          const response = await cartApi.getCart();
          set({ cart: response.data.data });
        } catch (error: any) {
          console.error('Failed to migrate guest cart to server:', error);
          throw new Error('Failed to migrate cart items to your account');
        }
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        return !!localStorage.getItem('authToken');
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

          // Migrate guest cart to server cart if needed
          try {
            await useCartStore.getState().migrateGuestCartToServer();
          } catch (migrationError) {
            // Migration failed, but login was successful - continue
            console.warn('Failed to migrate guest cart after login:', migrationError);
            
            // Try to fetch user's existing cart
            try {
              const cartResponse = await cartApi.getCart();
              useCartStore.getState().setCart(cartResponse.data.data);
            } catch (cartError) {
              console.warn('Failed to fetch user cart after login:', cartError);
            }
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

          // Migrate guest cart to server cart if needed
          try {
            await useCartStore.getState().migrateGuestCartToServer();
          } catch (migrationError) {
            // Migration failed, but registration was successful - continue
            console.warn('Failed to migrate guest cart after registration:', migrationError);
          }
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
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService, categoryService, cartService } from '../services/api';

// Main store combining all slices
const useStore = create(
  persist(
    (set, get) => ({
      // Loading states
      loading: {
        products: false,
        categories: false,
        cart: false,
        global: false,
      },

      // Error states
      errors: {
        products: null,
        categories: null,
        cart: null,
        global: null,
      },

      // Products state
      products: {
        items: [],
        featured: [],
        currentProduct: null,
        totalPages: 0,
        currentPage: 1,
        totalItems: 0,
      },

      // Categories state
      categories: {
        items: [],
        currentCategory: null,
      },

      // Cart state
      cart: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
        isOpen: false,
      },

      // Actions for loading states
      setLoading: (key, value) =>
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        })),

      setError: (key, error) =>
        set((state) => ({
          errors: { ...state.errors, [key]: error },
        })),

      clearError: (key) =>
        set((state) => ({
          errors: { ...state.errors, [key]: null },
        })),

      // Product actions
      fetchProducts: async (params = {}) => {
        set((state) => ({
          loading: { ...state.loading, products: true },
          errors: { ...state.errors, products: null },
        }));

        try {
          const response = await productService.getAll(params);
          set((state) => ({
            products: {
              ...state.products,
              items: response.data.products || response.data,
              totalPages: response.data.totalPages || 1,
              currentPage: response.data.currentPage || 1,
              totalItems: response.data.totalItems || response.data.length,
            },
            loading: { ...state.loading, products: false },
          }));
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, products: error.message },
            loading: { ...state.loading, products: false },
          }));
          throw error;
        }
      },

      fetchFeaturedProducts: async () => {
        set((state) => ({
          loading: { ...state.loading, products: true },
          errors: { ...state.errors, products: null },
        }));

        try {
          const response = await productService.getFeatured();
          set((state) => ({
            products: {
              ...state.products,
              featured: response.data || response,
            },
            loading: { ...state.loading, products: false },
          }));
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, products: error.message },
            loading: { ...state.loading, products: false },
          }));
          throw error;
        }
      },

      fetchProductBySlug: async (slug) => {
        set((state) => ({
          loading: { ...state.loading, products: true },
          errors: { ...state.errors, products: null },
        }));

        try {
          const response = await productService.getBySlug(slug);
          set((state) => ({
            products: {
              ...state.products,
              currentProduct: response.data || response,
            },
            loading: { ...state.loading, products: false },
          }));
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, products: error.message },
            loading: { ...state.loading, products: false },
          }));
          throw error;
        }
      },

      // Category actions
      fetchCategories: async () => {
        set((state) => ({
          loading: { ...state.loading, categories: true },
          errors: { ...state.errors, categories: null },
        }));

        try {
          const response = await categoryService.getAll();
          set((state) => ({
            categories: {
              ...state.categories,
              items: response.data || response,
            },
            loading: { ...state.loading, categories: false },
          }));
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, categories: error.message },
            loading: { ...state.loading, categories: false },
          }));
          throw error;
        }
      },

      // Cart actions
      fetchCart: async () => {
        set((state) => ({
          loading: { ...state.loading, cart: true },
          errors: { ...state.errors, cart: null },
        }));

        try {
          const response = await cartService.get();
          const cartData = response.data || response;
          
          set((state) => ({
            cart: {
              ...state.cart,
              items: cartData.items || [],
              totalItems: cartData.totalItems || 0,
              totalPrice: cartData.totalPrice || 0,
            },
            loading: { ...state.loading, cart: false },
          }));
          return response;
        } catch (error) {
          // If cart doesn't exist, initialize empty cart
          if (error.message?.includes('404') || error.message?.includes('not found')) {
            set((state) => ({
              cart: {
                ...state.cart,
                items: [],
                totalItems: 0,
                totalPrice: 0,
              },
              loading: { ...state.loading, cart: false },
            }));
          } else {
            set((state) => ({
              errors: { ...state.errors, cart: error.message },
              loading: { ...state.loading, cart: false },
            }));
          }
          return { data: { items: [], totalItems: 0, totalPrice: 0 } };
        }
      },

      addToCart: async (productId, quantity = 1) => {
        set((state) => ({
          loading: { ...state.loading, cart: true },
          errors: { ...state.errors, cart: null },
        }));

        try {
          const response = await cartService.addItem(productId, quantity);
          
          // Update cart state
          await get().fetchCart();
          
          set((state) => ({
            loading: { ...state.loading, cart: false },
          }));
          
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, cart: error.message },
            loading: { ...state.loading, cart: false },
          }));
          throw error;
        }
      },

      updateCartItem: async (productId, quantity) => {
        set((state) => ({
          loading: { ...state.loading, cart: true },
          errors: { ...state.errors, cart: null },
        }));

        try {
          const response = await cartService.updateItem(productId, quantity);
          
          // Update cart state
          await get().fetchCart();
          
          set((state) => ({
            loading: { ...state.loading, cart: false },
          }));
          
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, cart: error.message },
            loading: { ...state.loading, cart: false },
          }));
          throw error;
        }
      },

      removeFromCart: async (productId) => {
        set((state) => ({
          loading: { ...state.loading, cart: true },
          errors: { ...state.errors, cart: null },
        }));

        try {
          const response = await cartService.removeItem(productId);
          
          // Update cart state
          await get().fetchCart();
          
          set((state) => ({
            loading: { ...state.loading, cart: false },
          }));
          
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, cart: error.message },
            loading: { ...state.loading, cart: false },
          }));
          throw error;
        }
      },

      clearCart: async () => {
        set((state) => ({
          loading: { ...state.loading, cart: true },
          errors: { ...state.errors, cart: null },
        }));

        try {
          const response = await cartService.clear();
          
          set((state) => ({
            cart: {
              ...state.cart,
              items: [],
              totalItems: 0,
              totalPrice: 0,
            },
            loading: { ...state.loading, cart: false },
          }));
          
          return response;
        } catch (error) {
          set((state) => ({
            errors: { ...state.errors, cart: error.message },
            loading: { ...state.loading, cart: false },
          }));
          throw error;
        }
      },

      // Cart UI actions
      toggleCart: () =>
        set((state) => ({
          cart: { ...state.cart, isOpen: !state.cart.isOpen },
        })),

      openCart: () =>
        set((state) => ({
          cart: { ...state.cart, isOpen: true },
        })),

      closeCart: () =>
        set((state) => ({
          cart: { ...state.cart, isOpen: false },
        })),

      // Utility actions
      resetStore: () =>
        set({
          loading: {
            products: false,
            categories: false,
            cart: false,
            global: false,
          },
          errors: {
            products: null,
            categories: null,
            cart: null,
            global: null,
          },
          products: {
            items: [],
            featured: [],
            currentProduct: null,
            totalPages: 0,
            currentPage: 1,
            totalItems: 0,
          },
          categories: {
            items: [],
            currentCategory: null,
          },
          cart: {
            items: [],
            totalItems: 0,
            totalPrice: 0,
            isOpen: false,
          },
        }),
    }),
    {
      name: 'ukiyo-store',
      partialize: (state) => ({
        // Only persist cart data
        cart: {
          items: state.cart.items,
          totalItems: state.cart.totalItems,
          totalPrice: state.cart.totalPrice,
        },
      }),
    }
  )
);

export default useStore;
// Product types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: Category;
  variants?: ProductVariant[];
  inventory: {
    quantity: number;
    inStock: boolean;
    lowStockThreshold?: number;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

// Category types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder?: number;
  productCount?: number;
  subcategories?: Category[];
}

// Cart types
export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  variant?: string;
  price: number;
  total: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// User types
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses?: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any[];
  };
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';
}
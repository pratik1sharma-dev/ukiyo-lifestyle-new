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
    lowStockThreshold?: number;
  };
  inStock?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[]; // added to surface scent family or other labels

  // Fragrance-specific (all optional to maintain backward compatibility)
  scentProfile?: string[]; // e.g., ['Citrus', 'Woody', 'Fresh']
  strength?: 'Subtle' | 'Everyday' | 'Bold';
  wearDuration?: string; // e.g., '6–8 hours'
  notes?: {
    top?: string[];
    heart?: string[];
    base?: string[];
  };
  ingredients?: string[]; // e.g., ['Beeswax', 'Shea Butter', 'IFRA-compliant fragrance']
  vegan?: boolean;
  crueltyFree?: boolean;
  ifraCompliant?: boolean;
  allergens?: string[]; // e.g., ['Limonene', 'Linalool']
  shelfLifeMonths?: number; // e.g., 24
  tinSizeGrams?: number; // e.g., 10
  shippingOrigin?: string; // e.g., 'Delhi, India'

  // Catalog filter/badge fields
  noteFamily?: string; // Citrus, Floral, Woody, Oriental
  intensity?: 'Subtle' | 'Everyday' | 'Bold'; // alias for strength, if used by API/UI
  occasion?: string[];
  weather?: string[];
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
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'popular';
  noteFamily?: string[]; // Citrus, Floral, Woody, Oriental
  intensity?: 'Subtle' | 'Everyday' | 'Bold';
  occasion?: string[]; // Work, Day, Night, Festive
  weather?: string[]; // Summer, Monsoon, Winter
}
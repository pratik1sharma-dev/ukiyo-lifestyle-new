const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// Mock data for testing when database is not connected
const mockProducts = [
  {
    _id: '1',
    name: 'Modern Minimalist Sofa',
    slug: 'modern-minimalist-sofa',
    description: 'A sleek and comfortable sofa perfect for modern living spaces.',
    price: 45000,
    discountPrice: 40000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
    category: { _id: 'cat1', name: 'Home & Living', slug: 'home-living' },
    isActive: true,
    isFeatured: true,
    inventory: { stock: 10, lowStockThreshold: 2 },
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: '2',
    name: 'Elegant Dining Table',
    slug: 'elegant-dining-table',
    description: 'Beautiful wooden dining table for family gatherings.',
    price: 35000,
    discountPrice: 32000,
    images: ['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=500'],
    category: { _id: 'cat1', name: 'Home & Living', slug: 'home-living' },
    isActive: true,
    isFeatured: true,
    inventory: { stock: 5, lowStockThreshold: 1 },
    createdAt: new Date('2024-01-02'),
  },
  {
    _id: '3',
    name: 'Designer Floor Lamp',
    slug: 'designer-floor-lamp',
    description: 'Contemporary floor lamp with adjustable brightness.',
    price: 8500,
    discountPrice: 7500,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    category: { _id: 'cat1', name: 'Home & Living', slug: 'home-living' },
    isActive: true,
    isFeatured: false,
    inventory: { stock: 15, lowStockThreshold: 3 },
    createdAt: new Date('2024-01-03'),
  },
  {
    _id: '4',
    name: 'Luxury Silk Scarf',
    slug: 'luxury-silk-scarf',
    description: 'Premium silk scarf with elegant patterns.',
    price: 2500,
    discountPrice: 2200,
    images: ['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500'],
    category: { _id: 'cat2', name: 'Fashion & Accessories', slug: 'fashion-accessories' },
    isActive: true,
    isFeatured: true,
    inventory: { stock: 20, lowStockThreshold: 5 },
    createdAt: new Date('2024-01-04'),
  },
  {
    _id: '5',
    name: 'Organic Face Cream',
    slug: 'organic-face-cream',
    description: 'Natural and organic face cream for all skin types.',
    price: 1800,
    discountPrice: 1600,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'],
    category: { _id: 'cat3', name: 'Beauty & Wellness', slug: 'beauty-wellness' },
    isActive: true,
    isFeatured: false,
    inventory: { stock: 30, lowStockThreshold: 10 },
    createdAt: new Date('2024-01-05'),
  },
  {
    _id: '6',
    name: 'Ceramic Dinner Set',
    slug: 'ceramic-dinner-set',
    description: 'Beautiful ceramic dinner set for 6 people.',
    price: 4500,
    discountPrice: 4000,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'],
    category: { _id: 'cat4', name: 'Kitchen & Dining', slug: 'kitchen-dining' },
    isActive: true,
    isFeatured: true,
    inventory: { stock: 8, lowStockThreshold: 2 },
    createdAt: new Date('2024-01-06'),
  },
];

// Check if database is connected
const isDatabaseConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock data when database is not connected
      const { page = 1, limit = 12, category, search } = req.query;
      let filteredProducts = [...mockProducts];
      
      // Filter by category if specified
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category.slug === category);
      }
      
      // Simple search functionality
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      return res.json({
        success: true,
        data: {
          products: paginatedProducts,
          totalPages: Math.ceil(filteredProducts.length / limit),
          currentPage: parseInt(page),
          totalItems: filteredProducts.length,
          hasNext: endIndex < filteredProducts.length,
          hasPrev: page > 1
        },
        message: 'Products fetched successfully (mock data)'
      });
    }

    // Original database logic
    const { page = 1, limit = 12, category, search, sort = 'createdAt' } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort === 'price' ? { price: 1 } : { createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        totalItems: total,
        hasNext: (page * limit) < total,
        hasPrev: page > 1
      },
      message: 'Products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock featured products
      const featuredProducts = mockProducts.filter(p => p.isFeatured);
      return res.json({
        success: true,
        data: featuredProducts,
        message: 'Featured products fetched successfully (mock data)'
      });
    }

    // Original database logic
    const products = await Product.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(6);
    
    res.json({
      success: true,
      data: products,
      message: 'Featured products fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// GET /api/products/:slug - Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock product by slug
      const product = mockProducts.find(p => p.slug === req.params.slug);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      return res.json({
        success: true,
        data: product,
        message: 'Product fetched successfully (mock data)'
      });
    }

    // Original database logic
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

module.exports = router; 
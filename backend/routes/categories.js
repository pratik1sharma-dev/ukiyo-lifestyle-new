const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Mock data for testing when database is not connected
const mockCategories = [
  {
    _id: 'cat1',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture and home decor items for modern living',
    isActive: true,
    parentId: null,
    subcategories: [],
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: 'cat2',
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    description: 'Stylish clothing and accessories',
    isActive: true,
    parentId: null,
    subcategories: [],
    createdAt: new Date('2024-01-02'),
  },
  {
    _id: 'cat3',
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Natural beauty and wellness products',
    isActive: true,
    parentId: null,
    subcategories: [],
    createdAt: new Date('2024-01-03'),
  },
  {
    _id: 'cat4',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Kitchen essentials and dining accessories',
    isActive: true,
    parentId: null,
    subcategories: [],
    createdAt: new Date('2024-01-04'),
  },
];

// Check if database is connected
const isDatabaseConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock categories
      return res.json({
        success: true,
        data: mockCategories,
        message: 'Categories fetched successfully (mock data)'
      });
    }

    // Original database logic
    const categories = await Category.find({ isActive: true })
      .populate('parentId', 'name slug')
      .populate('subcategories', 'name slug')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: categories,
      message: 'Categories fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// GET /api/categories/root - Get root categories only
router.get('/root', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock root categories (categories without parent)
      const rootCategories = mockCategories.filter(c => !c.parentId);
      return res.json({
        success: true,
        data: rootCategories,
        message: 'Root categories fetched successfully (mock data)'
      });
    }

    // Original database logic
    const categories = await Category.find({ 
      isActive: true, 
      parentId: null 
    })
    .populate('subcategories', 'name slug')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: categories,
      message: 'Root categories fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching root categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching root categories',
      error: error.message
    });
  }
});

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock category by slug
      const category = mockCategories.find(c => c.slug === req.params.slug);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
      return res.json({
        success: true,
        data: category,
        message: 'Category fetched successfully (mock data)'
      });
    }

    // Original database logic
    const category = await Category.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    })
    .populate('parentId', 'name slug')
    .populate('subcategories', 'name slug');
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

module.exports = router; 
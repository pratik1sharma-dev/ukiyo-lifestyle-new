const express = require('express');
const router = express.Router();
const Category = require('../models/Category');



// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
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
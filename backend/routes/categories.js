const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findCategoryTree();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
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
    const categories = await Category.findRootCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
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
    const category = await Category.findBySlug(req.params.slug);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

module.exports = router; 
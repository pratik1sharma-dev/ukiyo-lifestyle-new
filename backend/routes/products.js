const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');

// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = 'newest',
      noteFamily,
      intensity, // maps to strength
      occasion,
      weather,
      minPrice,
      maxPrice,
      inStock
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    let query = { isActive: true };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Note family filter (support comma-separated list)
    if (noteFamily) {
      const families = String(noteFamily).split(',').map(v => v.trim()).filter(Boolean);
      if (families.length > 0) {
        query.noteFamily = { $in: families };
      }
    }

    // Intensity/Strength filter
    if (intensity) {
      query.strength = String(intensity);
    }

    // Occasion filter
    if (occasion) {
      const occ = String(occasion).split(',').map(v => v.trim()).filter(Boolean);
      if (occ.length > 0) {
        query.occasion = { $in: occ };
      }
    }

    // Weather filter
    if (weather) {
      const w = String(weather).split(',').map(v => v.trim()).filter(Boolean);
      if (w.length > 0) {
        query.weather = { $in: w };
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock only
    if (inStock === 'true') {
      query['inventory.quantity'] = { $gt: 0 };
    }

    // Sorting
    let sortSpec = { createdAt: -1 };
    switch (String(sort)) {
      case 'popular':
        sortSpec = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortSpec = { createdAt: -1 };
        break;
      case 'price_asc':
        sortSpec = { price: 1 };
        break;
      case 'price_desc':
        sortSpec = { price: -1 };
        break;
      default:
        sortSpec = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortSpec)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);
    
    const total = await Product.countDocuments(query);

    // Aggregate ratings for the returned products to avoid stale zeros
    const productIds = products.map(p => p._id);
    let productsWithAggregates = products;
    if (productIds.length > 0) {
      const ratings = await Review.aggregate([
        { $match: { product: { $in: productIds } } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);

      const ratingMap = new Map(
        ratings.map(r => [String(r._id), { rating: Math.round(r.avgRating * 10) / 10, reviewCount: r.count }])
      );

      productsWithAggregates = products.map(p => {
        const agg = ratingMap.get(String(p._id));
        if (agg) {
          const obj = p.toObject();
          obj.rating = agg.rating;
          obj.reviewCount = agg.reviewCount;
          return obj;
        }
        return p;
      });
    }
    
    res.json({
      success: true,
      data: {
        products: productsWithAggregates,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          hasNext: pageNum * limitNum < total,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
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
    const products = await Product.findFeatured().limit(8);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// GET /api/products/id/:id - Get product by ID
router.get('/id/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET /api/products/:slug - Get product by slug
router.get('/:slug', async (req, res) => {
  try {
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
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET /api/products/category/:categorySlug - Get products by category
router.get('/category/:categorySlug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.categorySlug, 
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    const products = await Product.findByCategory(category._id);
    
    res.json({
      success: true,
      data: products,
      category: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
});

module.exports = router; 
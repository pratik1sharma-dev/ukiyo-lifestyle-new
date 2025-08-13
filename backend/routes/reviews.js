const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const Review = require('../models/Review');
const { authenticateToken } = require('./auth');

// GET /api/reviews/:productSlug - list reviews for a product
router.get('/:productSlug', async (req, res) => {
  try {
    const { productSlug } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const product = await Product.findOne({ slug: productSlug, isActive: true }).select('_id');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [items, total] = await Promise.all([
      Review.find({ product: product._id })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Review.countDocuments({ product: product._id })
    ]);

    res.json({
      success: true,
      data: {
        reviews: items,
        pagination: {
          current: pageNum,
          total: Math.ceil(total / limitNum),
          count: total,
          hasNext: pageNum * limitNum < total,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews', error: error.message });
  }
});

// POST /api/reviews/:productSlug - create a review (auth required)
router.post('/:productSlug', authenticateToken, async (req, res) => {
  try {
    const { productSlug } = req.params;
    const product = await Product.findOne({ slug: productSlug, isActive: true }).select('_id name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      rating,
      title,
      comment,
      scentFamily,
      longevityRating,
      projectionRating,
      climateUsed,
      skinType,
    } = req.body;

    if (!rating) {
      return res.status(400).json({ success: false, message: 'Rating is required' });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user?._id || undefined,
      name: req.user?.firstName ? `${req.user.firstName} ${req.user.lastName || ''}`.trim() : 'Anonymous',
      rating,
      title,
      comment,
      scentFamily,
      longevityRating,
      projectionRating,
      climateUsed,
      skinType,
      isVerifiedPurchase: false,
    });

    // Aggregate rating and count
    const agg = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (agg.length > 0) {
      await Product.updateOne({ _id: product._id }, { $set: { rating: Math.round(agg[0].avgRating * 10) / 10, reviewCount: agg[0].count } });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating review', error: error.message });
  }
});

module.exports = router;
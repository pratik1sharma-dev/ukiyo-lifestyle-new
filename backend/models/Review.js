const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
  },
  title: {
    type: String,
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters'],
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [2000, 'Comment cannot exceed 2000 characters'],
  },
  // Fragrance-specific review fields
  scentFamily: { type: String, trim: true },
  longevityRating: { type: Number, min: 1, max: 5 },
  projectionRating: { type: Number, min: 1, max: 5 },
  climateUsed: { type: String, trim: true }, // e.g., 'Summer' | 'Monsoon' | 'Winter'
  skinType: { type: String, trim: true }, // e.g., 'Dry' | 'Oily' | 'Normal' | 'Combination'
  isVerifiedPurchase: { type: Boolean, default: false },
}, {
  timestamps: true,
});

reviewSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
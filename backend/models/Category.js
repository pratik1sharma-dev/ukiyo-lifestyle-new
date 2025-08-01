const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentId'
});

// Virtual for product count
categorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentId: 1, isActive: 1 });
categorySchema.index({ sortOrder: 1, name: 1 });

// Pre-save middleware to generate slug if not provided
categorySchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to find root categories
categorySchema.statics.findRootCategories = function() {
  return this.find({ parentId: null, isActive: true })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to find category tree
categorySchema.statics.findCategoryTree = function() {
  return this.find({ isActive: true })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });
};

// Static method to find category by slug
categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, isActive: true })
    .populate('subcategories')
    .populate('parentId');
};

module.exports = mongoose.model('Category', categorySchema); 
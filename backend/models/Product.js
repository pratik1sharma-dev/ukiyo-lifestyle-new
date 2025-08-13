const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Product slug is required'],
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  comparePrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  images: [{
    type: String,
    required: [true, 'Product image is required']
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }]
  }],
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: [0, 'Quantity cannot be negative']
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: [0, 'Low stock threshold cannot be negative']
    },
    trackQuantity: {
      type: Boolean,
      default: true
    }
  },
  seo: {
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
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Fragrance-specific fields (all optional)
  scentProfile: [{ type: String, trim: true }], // e.g., ['Citrus', 'Woody', 'Fresh']
  noteFamily: { type: String, trim: true }, // e.g., 'Citrus'
  strength: { type: String, enum: ['Subtle', 'Everyday', 'Bold'] },
  wearDuration: { type: String, trim: true }, // e.g., '6–8 hours'
  notes: {
    top: [{ type: String, trim: true }],
    heart: [{ type: String, trim: true }],
    base: [{ type: String, trim: true }]
  },
  ingredients: [{ type: String, trim: true }],
  vegan: { type: Boolean },
  crueltyFree: { type: Boolean },
  ifraCompliant: { type: Boolean },
  allergens: [{ type: String, trim: true }],
  shelfLifeMonths: { type: Number, min: [0, 'Shelf life must be non-negative'] },
  tinSizeGrams: { type: Number, min: [0, 'Tin size must be non-negative'] },
  shippingOrigin: { type: String, trim: true },
  occasion: [{ type: String, trim: true }], // e.g., ['Work','Day']
  weather: [{ type: String, trim: true }], // e.g., ['Summer','Monsoon']

  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  if (!this.inventory.trackQuantity) return true;
  return this.inventory.quantity > 0;
});

// Virtual for low stock status
productSchema.virtual('lowStock').get(function() {
  if (!this.inventory.trackQuantity) return false;
  return this.inventory.quantity <= this.inventory.lowStockThreshold && this.inventory.quantity > 0;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ slug: 1 });

// Helpful indexes for catalog filters
productSchema.index({ noteFamily: 1 });
productSchema.index({ strength: 1 });
productSchema.index({ 'notes.top': 1, 'notes.heart': 1, 'notes.base': 1 });
productSchema.index({ occasion: 1 });
productSchema.index({ weather: 1 });

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
};

// Static method to find products by category
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
};

// Static method to search products
productSchema.statics.search = function(query) {
  return this.find(
    { 
      $text: { $search: query },
      isActive: true 
    },
    { score: { $meta: 'textScore' } }
  )
  .populate('category', 'name slug')
  .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema); 
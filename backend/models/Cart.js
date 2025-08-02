const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  variant: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

// Virtual for item total
cartItemSchema.virtual('total').get(function() {
  return this.price * this.quantity;
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for cart subtotal
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => total + item.total, 0);
});

// Virtual for cart item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Virtual for cart total (GST inclusive, free shipping)
cartSchema.virtual('total').get(function() {
  return this.subtotal; // Total equals subtotal since GST is included and shipping is free
});

// Virtual for tax amount (GST is already included in prices)
cartSchema.virtual('tax').get(function() {
  return 0; // GST is already included in product prices
});

// Virtual for shipping amount (free shipping on all orders)
cartSchema.virtual('shipping').get(function() {
  return 0; // Free shipping on all orders
});

// Index for better performance
cartSchema.index({ user: 1, isActive: 1 });
cartSchema.index({ expiresAt: 1 });

// Pre-save middleware to update expiration
cartSchema.pre('save', function(next) {
  if (this.isModified('items') && this.items.length > 0) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  }
  next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, variant, price) {
  // Validate inputs
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  const existingItem = this.items.find(item => 
    item.product && item.product.toString() === productId.toString() && 
    item.variant === variant
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.price = price; // Update price in case it changed
  } else {
    this.items.push({
      product: productId,
      quantity,
      variant,
      price
    });
  }

  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity, variant) {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  const item = this.items.find(item => 
    item.product && item.product.toString() === productId.toString() && 
    item.variant === variant
  );

  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter(item => 
        !(item.product.toString() === productId.toString() && item.variant === variant)
      );
    } else {
      item.quantity = quantity;
    }
    return this.save();
  }
  throw new Error('Item not found in cart');
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(productId, variant) {
  if (!productId) {
    throw new Error('Product ID is required');
  }
  
  this.items = this.items.filter(item => 
    !(item.product && item.product.toString() === productId.toString() && item.variant === variant)
  );
  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Instance method to check if cart is empty
cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

// Static method to find active cart by user
cartSchema.statics.findByUser = function(userId) {
  return this.findOne({ user: userId, isActive: true })
    .populate('items.product', 'name price images slug')
    .populate('user', 'firstName lastName email');
};

// Static method to create or get cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId, isActive: true });
  
  if (!cart) {
    cart = new this({ user: userId, items: [] });
    await cart.save();
  }
  
  return cart.populate('items.product', 'name price images slug');
};

module.exports = mongoose.model('Cart', cartSchema); 
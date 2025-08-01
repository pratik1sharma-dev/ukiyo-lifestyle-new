const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productSlug: {
    type: String,
    required: true
  },
  productImage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest orders
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  billingAddress: {
    type: shippingAddressSchema,
    required: false // Use shipping address if not provided
  },
  orderStatus: {
    type: String,
    enum: [
      'pending',
      'confirmed', 
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: [
      'pending',
      'paid',
      'failed',
      'refunded',
      'partially_refunded'
    ],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'bank_transfer'],
    required: true
  },
  paymentDetails: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    transactionId: String
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'express', 'overnight'],
      default: 'standard'
    },
    cost: {
      type: Number,
      default: 0,
      min: 0
    },
    estimatedDelivery: Date,
    trackingNumber: String,
    courierPartner: String,
    shippedAt: Date,
    deliveredAt: Date
  },
  notes: {
    customerNotes: String,
    adminNotes: String
  },
  timeline: [{
    status: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: String,
      default: 'system'
    }
  }],
  refund: {
    amount: {
      type: Number,
      min: 0
    },
    reason: String,
    refundedAt: Date,
    refundId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full customer name
orderSchema.virtual('customerName').get(function() {
  return `${this.shippingAddress.firstName} ${this.shippingAddress.lastName}`;
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Index for better performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ email: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Generate random 4-digit number
    const random = Math.floor(1000 + Math.random() * 9000);
    
    this.orderNumber = `UK${year}${month}${day}${random}`;
  }
  next();
});

// Pre-save middleware to add timeline entry
orderSchema.pre('save', function(next) {
  if (this.isModified('orderStatus') && !this.isNew) {
    this.timeline.push({
      status: this.orderStatus,
      message: `Order status changed to ${this.orderStatus}`,
      timestamp: new Date()
    });
  }
  next();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find orders by email (for guest orders)
orderSchema.statics.findByEmail = function(email) {
  return this.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status) {
  return this.find({ orderStatus: status }).sort({ createdAt: -1 });
};

// Instance method to calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((total, item) => total + item.totalPrice, 0);
  const total = subtotal - this.pricing.discount + this.pricing.shippingCost + this.pricing.tax;
  
  this.pricing.subtotal = subtotal;
  this.pricing.total = Math.max(0, total);
  
  return this.pricing.total;
};

// Instance method to add timeline entry
orderSchema.methods.addTimelineEntry = function(status, message, updatedBy = 'system') {
  this.timeline.push({
    status,
    message,
    timestamp: new Date(),
    updatedBy
  });
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus, message, updatedBy = 'system') {
  this.orderStatus = newStatus;
  this.addTimelineEntry(newStatus, message || `Order status changed to ${newStatus}`, updatedBy);
};

// Instance method to mark as shipped
orderSchema.methods.markAsShipped = function(trackingNumber, courierPartner) {
  this.orderStatus = 'shipped';
  this.shipping.trackingNumber = trackingNumber;
  this.shipping.courierPartner = courierPartner;
  this.shipping.shippedAt = new Date();
  
  this.addTimelineEntry('shipped', `Order shipped via ${courierPartner}. Tracking: ${trackingNumber}`);
};

// Instance method to mark as delivered
orderSchema.methods.markAsDelivered = function() {
  this.orderStatus = 'delivered';
  this.shipping.deliveredAt = new Date();
  
  this.addTimelineEntry('delivered', 'Order delivered successfully');
};

module.exports = mongoose.model('Order', orderSchema);
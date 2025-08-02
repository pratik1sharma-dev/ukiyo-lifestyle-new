const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('./auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID|| 'rzp_live_YdF3OnygSeV4jV',
  key_secret: process.env.RAZORPAY_KEY_SECRET|| 'B9ZtyRlhOHBbnZaP06voertO',
});

// Check if database is connected
const isDatabaseConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Mock orders storage for testing when database is not connected
let mockOrders = new Map();
let mockOrderCounter = 1;

// Helper function to generate mock order number
const generateMockOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `UK${year}${month}${day}${random}`;
};

// Helper function to create mock order
const createMockOrder = (userId, cartData, shippingAddress, paymentMethod = 'razorpay') => {
  const orderNumber = generateMockOrderNumber();
  const orderId = `mock-order-${mockOrderCounter++}`;
  
  const order = {
    _id: orderId,
    orderNumber,
    user: userId,
    email: shippingAddress.email,
    items: cartData.items.map(item => ({
      _id: `item-${Date.now()}-${Math.random()}`,
      product: item.product._id,
      productName: item.product.name,
      productSlug: item.product.slug,
      productImage: item.product.images[0] || '',
      quantity: item.quantity,
      price: item.price,
      discountPrice: item.price,
      totalPrice: item.price * item.quantity
    })),
    shippingAddress,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    paymentMethod,
    paymentDetails: {},
    pricing: {
      subtotal: cartData.subtotal,
      discount: 0,
      shippingCost: cartData.shipping,
      tax: cartData.tax,
      total: cartData.totalPrice
    },
    shipping: {
      method: 'standard',
      cost: cartData.shipping,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    },
    notes: {
      customerNotes: '',
      adminNotes: ''
    },
    timeline: [{
      status: 'pending',
      message: 'Order created successfully',
      timestamp: new Date(),
      updatedBy: 'system'
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  mockOrders.set(orderId, order);
  return order;
};

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'razorpay' } = req.body;
    const userId = req.user._id;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.lastName || 
        !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || 
        !shippingAddress.pincode || !shippingAddress.phone || !shippingAddress.email) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    let cart, order;

    if (!isDatabaseConnected()) {
      // Mock data implementation - access mockCarts from the cart module
      const cartModule = require('./cart');
      const mockCarts = cartModule.mockCarts || new Map();
      cart = mockCarts.get(userId);
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cart is empty'
        });
      }

      // Create mock order
      order = createMockOrder(userId, cart, shippingAddress, paymentMethod);

      if (paymentMethod === 'razorpay') {
        // Create Razorpay order (this will work even with mock data)
        try {
          const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(cart.totalPrice * 100), // Amount in paise
            currency: 'INR',
            receipt: order.orderNumber,
            notes: {
              orderId: order._id,
              userId: userId,
              orderNumber: order.orderNumber
            }
          });

          order.paymentDetails.razorpayOrderId = razorpayOrder.id;
          mockOrders.set(order._id, order);

          return res.json({
            success: true,
            message: 'Order created successfully (using mock data)',
            data: {
              order: order,
              razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                receipt: razorpayOrder.receipt
              }
            }
          });
        } catch (razorpayError) {
          console.error('Razorpay order creation failed:', razorpayError);
          // Fall back to mock payment
          order.paymentDetails.razorpayOrderId = `mock_razorpay_${Date.now()}`;
          mockOrders.set(order._id, order);

          return res.json({
            success: true,
            message: 'Order created successfully (using mock payment)',
            data: {
              order: order,
              razorpayOrder: {
                id: order.paymentDetails.razorpayOrderId,
                amount: Math.round(cart.totalPrice * 100),
                currency: 'INR',
                receipt: order.orderNumber
              }
            }
          });
        }
      } else {
        // COD or other payment methods
        return res.json({
          success: true,
          message: 'Order created successfully (using mock data)',
          data: {
            order: order
          }
        });
      }
    }

    // Database implementation
    cart = await Cart.findByUser(userId);
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Create order in database
    order = new Order({
      user: userId,
      email: shippingAddress.email,
      items: cart.items.map(item => ({
        product: item.product._id,
        productName: item.product.name,
        productSlug: item.product.slug,
        productImage: item.product.images[0] || '',
        quantity: item.quantity,
        price: item.price,
        discountPrice: item.price,
        totalPrice: item.price * item.quantity
      })),
      shippingAddress,
      paymentMethod,
      pricing: {
        subtotal: cart.subtotal,
        discount: 0,
        shippingCost: cart.shipping,
        tax: cart.tax,
        total: cart.total
      },
      shipping: {
        method: 'standard',
        cost: cart.shipping,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    await order.save();

    if (paymentMethod === 'razorpay') {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(order.pricing.total * 100), // Amount in paise
        currency: 'INR',
        receipt: order.orderNumber,
        notes: {
          orderId: order._id.toString(),
          userId: userId,
          orderNumber: order.orderNumber
        }
      });

      // Update order with Razorpay order ID
      order.paymentDetails.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: order,
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt
          }
        }
      });
    } else {
      res.json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: order
        }
      });
    }

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
});

// POST /api/payment/verify - Verify Razorpay payment
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_id 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    let order;

    if (!isDatabaseConnected()) {
      // Mock data implementation
      order = mockOrders.get(order_id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Update mock order
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
      order.paymentDetails.razorpaySignature = razorpay_signature;
      order.timeline.push({
        status: 'confirmed',
        message: 'Payment verified and order confirmed',
        timestamp: new Date(),
        updatedBy: 'system'
      });
      order.updatedAt = new Date();

      mockOrders.set(order_id, order);

      // Clear user's cart
      const mockCarts = require('./cart').mockCarts || new Map();
      const userId = req.user._id;
      const cart = mockCarts.get(userId);
      if (cart) {
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 100; // Just shipping cost
        cart.subtotal = 0;
        cart.tax = 0;
        cart.updatedAt = new Date();
        mockCarts.set(userId, cart);
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully (using mock data)',
        data: {
          order: order
        }
      });
    }

    // Database implementation
    order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update order with payment details
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails.razorpaySignature = razorpay_signature;
    order.addTimelineEntry('confirmed', 'Payment verified and order confirmed');

    await order.save();

    // Clear user's cart
    const cart = await Cart.findByUser(req.user._id);
    if (cart) {
      await cart.clearCart();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        order: order
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// GET /api/payment/orders - Get user orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status } = req.query;

    if (!isDatabaseConnected()) {
      // Mock data implementation
      let userOrders = Array.from(mockOrders.values())
        .filter(order => order.user === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      if (status) {
        userOrders = userOrders.filter(order => order.orderStatus === status);
      }

      // Simple pagination for mock data
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedOrders = userOrders.slice(startIndex, endIndex);

      return res.json({
        success: true,
        message: 'Orders fetched successfully (using mock data)',
        data: {
          orders: paginatedOrders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: userOrders.length,
            pages: Math.ceil(userOrders.length / limit)
          }
        }
      });
    }

    // Database implementation
    let query = { user: userId };
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('items.product', 'name slug images');

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      message: 'Orders fetched successfully',
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
});

// GET /api/payment/orders/:orderId - Get specific order
router.get('/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    if (!isDatabaseConnected()) {
      // Mock data implementation
      const order = mockOrders.get(orderId);
      if (!order || order.user !== userId) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      return res.json({
        success: true,
        message: 'Order fetched successfully (using mock data)',
        data: {
          order: order
        }
      });
    }

    // Database implementation
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order fetched successfully',
      data: {
        order: order
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
});

module.exports = router;
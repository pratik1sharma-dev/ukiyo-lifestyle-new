const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('./auth');

// Mock cart data for testing when database is not connected
// Store carts by userId
let mockCarts = new Map();

// Helper function to get or create mock cart for user
const getMockCart = (userId) => {
  if (!mockCarts.has(userId)) {
    mockCarts.set(userId, {
      _id: `mock-cart-${userId}`,
      user: userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return mockCarts.get(userId);
};

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping above ₹1000
  const totalPrice = subtotal + tax + shipping;
  const totalItems = cart.items.reduce((count, item) => count + item.quantity, 0);

  cart.subtotal = subtotal;
  cart.tax = tax;
  cart.shipping = shipping;
  cart.totalPrice = totalPrice;
  cart.totalItems = totalItems;
  cart.updatedAt = new Date();

  return cart;
};

// Mock products for cart functionality
const mockProducts = [
  {
    _id: '1',
    name: 'Modern Minimalist Sofa',
    slug: 'modern-minimalist-sofa',
    price: 45000,
    discountPrice: 40000,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
    inventory: { stock: 10 },
  },
  {
    _id: '2',
    name: 'Elegant Dining Table',
    slug: 'elegant-dining-table',
    price: 35000,
    discountPrice: 32000,
    images: ['https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=500'],
    inventory: { stock: 5 },
  },
  {
    _id: '3',
    name: 'Designer Floor Lamp',
    slug: 'designer-floor-lamp',
    price: 8500,
    discountPrice: 7500,
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
    inventory: { stock: 15 },
  },
];

// Check if database is connected
const isDatabaseConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Remove duplicate function - using the one defined above

// GET /api/cart - Get user cart (Protected Route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isDatabaseConnected()) {
      // Return user-specific mock cart
      const cart = getMockCart(userId);
      calculateCartTotals(cart);
      
      return res.json({
        success: true,
        data: cart,
        message: 'Cart fetched successfully (using mock data)'
      });
    }

    // Database logic - get or create cart for authenticated user
    let cart = await Cart.getOrCreateCart(userId);
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: error.message
    });
  }
});

// POST /api/cart/add - Add item to cart (Protected Route)
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const userId = req.user._id;

    if (!isDatabaseConnected()) {
      // Mock cart functionality for authenticated user
      const product = mockProducts.find(p => p._id === productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      const cart = getMockCart(userId);

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(item => item.product._id === productId);
      
      if (existingItemIndex > -1) {
        // Update existing item
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          _id: `item-${Date.now()}`,
          product: product,
          quantity: quantity,
          price: product.discountPrice || product.price
        });
      }

      // Update cart totals
      calculateCartTotals(cart);

      return res.json({
        success: true,
        data: cart,
        message: 'Item added to cart successfully (using mock data)'
      });
    }

    // Database logic for authenticated user
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.getOrCreateCart(userId);
    await cart.addItem(productId, quantity, null, product.discountPrice || product.price);
    
    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// PUT /api/cart/update - Update cart item quantity (Protected Route)
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    const userId = req.user._id;

    if (!isDatabaseConnected()) {
      // Mock cart update functionality for authenticated user
      const cart = getMockCart(userId);
      const itemIndex = cart.items.findIndex(item => item.product._id === productId);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update item quantity
        cart.items[itemIndex].quantity = quantity;
      }

      // Update cart totals
      calculateCartTotals(cart);

      return res.json({
        success: true,
        data: cart,
        message: 'Cart updated successfully (using mock data)'
      });
    }

    // Database logic for authenticated user
    const cart = await Cart.findByUser(userId);
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.updateItemQuantity(productId, quantity, null);
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
});

// DELETE /api/cart/remove - Remove item from cart
router.delete('/remove', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!isDatabaseConnected()) {
      // Mock cart remove functionality
      const itemIndex = mockCart.items.findIndex(item => item.product._id === productId);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      mockCart.items.splice(itemIndex, 1);

      // Update cart totals
      const totals = calculateCartTotals(mockCart);
      mockCart.totalItems = totals.totalItems;
      mockCart.totalPrice = totals.totalPrice;
      mockCart.updatedAt = new Date();

      return res.json({
        success: true,
        data: mockCart,
        message: 'Item removed from cart successfully (mock data)'
      });
    }

    // Original database logic
    const sessionId = req.session?.id || 'anonymous';
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.removeItem(productId);
    await cart.populate('items.product');
    
    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isDatabaseConnected()) {
      // Mock cart clear functionality for authenticated user
      const cart = getMockCart(userId);
      cart.items = [];
      calculateCartTotals(cart);

      return res.json({
        success: true,
        data: cart,
        message: 'Cart cleared successfully (using mock data)'
      });
    }

    // Original database logic
    const sessionId = req.session?.id || 'anonymous';
    const cart = await Cart.findOne({ sessionId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    await cart.clear();
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

// Export mockCarts for use in other modules
module.exports = router;
module.exports.mockCarts = mockCarts; 
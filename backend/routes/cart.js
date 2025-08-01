const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Mock cart data for testing when database is not connected
let mockCart = {
  _id: 'mock-cart-1',
  sessionId: 'mock-session',
  items: [],
  totalItems: 0,
  totalPrice: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
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

// Helper function to calculate cart totals
const calculateCartTotals = (cart) => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalItems, totalPrice };
};

// GET /api/cart - Get user cart
router.get('/', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Return mock cart
      const totals = calculateCartTotals(mockCart);
      mockCart.totalItems = totals.totalItems;
      mockCart.totalPrice = totals.totalPrice;
      
      return res.json({
        success: true,
        data: mockCart,
        message: 'Cart fetched successfully (mock data)'
      });
    }

    // Original database logic
    const sessionId = req.session?.id || 'anonymous';
    let cart = await Cart.findOne({ sessionId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ sessionId });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart,
      message: 'Cart fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// POST /api/cart/add - Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!isDatabaseConnected()) {
      // Mock cart functionality
      const product = mockProducts.find(p => p._id === productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if item already exists in cart
      const existingItemIndex = mockCart.items.findIndex(item => item.product._id === productId);
      
      if (existingItemIndex > -1) {
        // Update existing item
        mockCart.items[existingItemIndex].quantity += quantity;
        mockCart.items[existingItemIndex].totalPrice = 
          mockCart.items[existingItemIndex].quantity * (product.discountPrice || product.price);
      } else {
        // Add new item
        mockCart.items.push({
          _id: `item-${Date.now()}`,
          product: product,
          quantity: quantity,
          price: product.discountPrice || product.price,
          totalPrice: quantity * (product.discountPrice || product.price)
        });
      }

      // Update cart totals
      const totals = calculateCartTotals(mockCart);
      mockCart.totalItems = totals.totalItems;
      mockCart.totalPrice = totals.totalPrice;
      mockCart.updatedAt = new Date();

      return res.json({
        success: true,
        data: mockCart,
        message: 'Item added to cart successfully (mock data)'
      });
    }

    // Original database logic
    const sessionId = req.session?.id || 'anonymous';
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId });
    }
    
    await cart.addItem(productId, quantity);
    await cart.populate('items.product');
    
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

// PUT /api/cart/update - Update cart item quantity
router.put('/update', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (!isDatabaseConnected()) {
      // Mock cart update functionality
      const itemIndex = mockCart.items.findIndex(item => item.product._id === productId);
      
      if (itemIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in cart'
        });
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        mockCart.items.splice(itemIndex, 1);
      } else {
        // Update item quantity
        mockCart.items[itemIndex].quantity = quantity;
        mockCart.items[itemIndex].totalPrice = 
          quantity * mockCart.items[itemIndex].price;
      }

      // Update cart totals
      const totals = calculateCartTotals(mockCart);
      mockCart.totalItems = totals.totalItems;
      mockCart.totalPrice = totals.totalPrice;
      mockCart.updatedAt = new Date();

      return res.json({
        success: true,
        data: mockCart,
        message: 'Cart updated successfully (mock data)'
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
    
    await cart.updateItem(productId, quantity);
    await cart.populate('items.product');
    
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
router.delete('/remove', async (req, res) => {
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
router.delete('/clear', async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      // Mock cart clear functionality
      mockCart.items = [];
      mockCart.totalItems = 0;
      mockCart.totalPrice = 0;
      mockCart.updatedAt = new Date();

      return res.json({
        success: true,
        data: mockCart,
        message: 'Cart cleared successfully (mock data)'
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

module.exports = router; 
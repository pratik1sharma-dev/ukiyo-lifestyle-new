const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticateToken } = require('./auth');





// Remove duplicate function - using the one defined above

// GET /api/cart - Get user cart (Protected Route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

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
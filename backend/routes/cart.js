const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET /api/cart - Get user's cart
router.get('/', async (req, res) => {
  try {
    // For now, we'll use a mock user ID. Later we'll add authentication
    const mockUserId = '507f1f77bcf86cd799439011'; // Mock ObjectId
    
    const cart = await Cart.getOrCreateCart(mockUserId);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
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
    const { productId, quantity = 1, variant = null } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    // Mock user ID for now
    const mockUserId = '507f1f77bcf86cd799439011';
    
    // Get product price (in real app, fetch from Product model)
    const productPrice = 999; // Mock price
    
    const cart = await Cart.getOrCreateCart(mockUserId);
    await cart.addItem(productId, quantity, variant, productPrice);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
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
    const { productId, quantity, variant = null } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }
    
    const mockUserId = '507f1f77bcf86cd799439011';
    const cart = await Cart.getOrCreateCart(mockUserId);
    await cart.updateItemQuantity(productId, quantity, variant);
    
    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
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
    const { productId, variant = null } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    const mockUserId = '507f1f77bcf86cd799439011';
    const cart = await Cart.getOrCreateCart(mockUserId);
    await cart.removeItem(productId, variant);
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// DELETE /api/cart/clear - Clear cart
router.delete('/clear', async (req, res) => {
  try {
    const mockUserId = '507f1f77bcf86cd799439011';
    const cart = await Cart.getOrCreateCart(mockUserId);
    await cart.clearCart();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router; 
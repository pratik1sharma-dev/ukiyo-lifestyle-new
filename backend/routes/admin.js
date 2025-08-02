const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken } = require('./auth');
const { uploadAnyImages, deleteImage, extractPublicId } = require('../config/cloudinary');

// Admin middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  console.log('🔧 Admin Middleware:', {
    hasUser: !!req.user,
    userRole: req.user?.role,
    isAdmin: req.user?.role === 'admin',
    timestamp: new Date().toISOString()
  });

  if (!req.user || req.user.role !== 'admin') {
    console.log('❌ Admin access denied:', { userRole: req.user?.role });
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  console.log('✅ Admin access granted');
  next();
};

// Cloudinary upload configuration is imported from config/cloudinary.js





// Helper function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ===================
// CATEGORY MANAGEMENT
// ===================

// GET /api/admin/categories - Get all categories for admin
router.get('/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'Categories fetched successfully',
      data: { categories }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// POST /api/admin/categories - Create new category
router.post('/categories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, isActive = true } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const slug = generateSlug(name);

    // Check if category with same name exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = new Category({
      name,
      slug,
      description: description || '',
      isActive
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message
    });
  }
});

// PUT /api/admin/categories/:id - Update category
router.put('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message
    });
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete('/categories/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await Product.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products. Please move or delete the products first.`
      });
    }

    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message
    });
  }
});

// ===================
// PRODUCT MANAGEMENT
// ===================

// GET /api/admin/products - Get all products for admin
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  console.log('🔧 Admin Products Request:', {
    user: req.user ? { id: req.user._id, email: req.user.email, role: req.user.role } : 'No user',
    headers: req.headers.authorization ? 'Token present' : 'No token',
    timestamp: new Date().toISOString()
  });
  try {
    const { page = 1, limit = 20, category, search, status } = req.query;

    // Database query with filters
    let query = {};
    if (category) query.category = category;
    if (status) query.isActive = status === 'active';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// GET /api/admin/products/:id - Get single product for admin
router.get('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product fetched successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// POST /api/admin/products - Create new product
router.post('/products', authenticateToken, requireAdmin, uploadAnyImages, async (req, res) => {
  try {
    console.log('🔧 Product Creation Request:', {
      body: req.body,
      files: req.files ? req.files.map(f => ({ fieldname: f.fieldname, originalname: f.originalname })) : 'No files',
      timestamp: new Date().toISOString()
    });

    const {
      name,
      description,
      price,
      discountPrice,
      category,
      isActive = true,
      isFeatured = false,
      stock,
      lowStockThreshold = 5,
      tags,
      specifications
    } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required'
      });
    }

    // Handle uploaded images - Cloudinary URLs
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const slug = generateSlug(name);

    // Check if category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const product = new Product({
      name,
      slug,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      images: imageUrls.length > 0 ? imageUrls : [],
      category,
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      inventory: {
        quantity: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5,
        trackQuantity: true
      },
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      specifications: specifications ? JSON.parse(specifications) : {}
    });

    await product.save();
    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
});

// PUT /api/admin/products/:id - Update product
router.put('/products/:id', authenticateToken, requireAdmin, uploadAnyImages, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      isActive,
      isFeatured,
      stock,
      lowStockThreshold,
      tags,
      specifications,
      removeImages // Array of image URLs to remove
    } = req.body;

    

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = generateSlug(name);
    }
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (category) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive === 'true';
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured === 'true';
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());
    if (specifications) updateData.specifications = JSON.parse(specifications);

    // Handle inventory update
    if (stock !== undefined || lowStockThreshold !== undefined) {
      updateData.inventory = {
        ...product.inventory,
        ...(stock !== undefined && { quantity: parseInt(stock) }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: parseInt(lowStockThreshold) }),
        trackQuantity: true
      };
    }

    // Handle images
    let currentImages = [...product.images];
    
    // Remove specified images from Cloudinary
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      
      // Delete images from Cloudinary
      for (const imageUrl of imagesToRemove) {
        try {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            await deleteImage(publicId);
            console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
          } else {
            console.warn(`⚠️ Could not extract public ID from URL: ${imageUrl}`);
          }
        } catch (error) {
          console.error(`❌ Failed to delete image from Cloudinary: ${imageUrl}`, error);
        }
      }
      
      // Remove from current images array
      currentImages = currentImages.filter(img => !imagesToRemove.includes(img));
    }
    
    // Add new images
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      currentImages = [...currentImages, ...newImageUrls];
    }
    
    updateData.images = currentImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete('/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        try {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            await deleteImage(publicId);
            console.log(`✅ Deleted image from Cloudinary: ${publicId}`);
          } else {
            console.warn(`⚠️ Could not extract public ID from URL: ${imageUrl}`);
          }
        } catch (error) {
          console.error(`❌ Failed to delete image from Cloudinary: ${imageUrl}`, error);
        }
      }
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
});

// GET /api/admin/dashboard/stats - Get dashboard statistics
router.get('/dashboard/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      totalCategories,
      lowStockProducts
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Product.countDocuments({
        $expr: { $lte: ['$inventory.quantity', '$inventory.lowStockThreshold'] }
      })
    ]);

    res.json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalProducts,
        activeProducts,
        totalCategories,
        lowStockProducts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

module.exports = router;
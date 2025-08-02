const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken } = require('./auth');

// Admin middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/products');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Check if database is connected
const isDatabaseConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Mock data storage for admin operations
let mockProductCounter = 7; // Starting from 7 since we have 6 mock products
let mockCategoryCounter = 5; // Starting from 5 since we have 4 mock categories

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
    if (!isDatabaseConnected()) {
      // Mock categories
      const mockCategories = [
        { _id: 'cat1', name: 'Home & Living', slug: 'home-living', description: 'Furniture and home decor items', isActive: true, createdAt: new Date('2024-01-01') },
        { _id: 'cat2', name: 'Fashion & Accessories', slug: 'fashion-accessories', description: 'Clothing and fashion accessories', isActive: true, createdAt: new Date('2024-01-02') },
        { _id: 'cat3', name: 'Beauty & Wellness', slug: 'beauty-wellness', description: 'Beauty and wellness products', isActive: true, createdAt: new Date('2024-01-03') },
        { _id: 'cat4', name: 'Kitchen & Dining', slug: 'kitchen-dining', description: 'Kitchen appliances and dining essentials', isActive: true, createdAt: new Date('2024-01-04') }
      ];

      return res.json({
        success: true,
        message: 'Categories fetched successfully (using mock data)',
        data: { categories: mockCategories }
      });
    }

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

    if (!isDatabaseConnected()) {
      // Mock category creation
      const newCategory = {
        _id: `cat${mockCategoryCounter++}`,
        name,
        slug,
        description: description || '',
        isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Category created successfully (using mock data)',
        data: { category: newCategory }
      });
    }

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

    if (!isDatabaseConnected()) {
      // Mock category update
      return res.json({
        success: true,
        message: 'Category updated successfully (using mock data)',
        data: {
          category: {
            _id: id,
            name: name || 'Updated Category',
            slug: generateSlug(name || 'Updated Category'),
            description: description || '',
            isActive: isActive !== undefined ? isActive : true,
            updatedAt: new Date()
          }
        }
      });
    }

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

    if (!isDatabaseConnected()) {
      // Mock category deletion
      return res.json({
        success: true,
        message: 'Category deleted successfully (using mock data)'
      });
    }

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
  try {
    const { page = 1, limit = 20, category, search, status } = req.query;

    if (!isDatabaseConnected()) {
      // Mock products with admin details
      const mockProducts = require('./products').mockProducts || [];
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (category) {
        filteredProducts = filteredProducts.filter(p => p.category._id === category);
      }
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
      if (status) {
        filteredProducts = filteredProducts.filter(p => p.isActive === (status === 'active'));
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return res.json({
        success: true,
        message: 'Products fetched successfully (using mock data)',
        data: {
          products: paginatedProducts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: filteredProducts.length,
            pages: Math.ceil(filteredProducts.length / limit)
          }
        }
      });
    }

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

    if (!isDatabaseConnected()) {
      // Mock product lookup
      const mockProducts = require('./products').mockProducts || [];
      const product = mockProducts.find(p => p._id === id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.json({
        success: true,
        message: 'Product fetched successfully (using mock data)',
        data: { product }
      });
    }

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
router.post('/products', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
  try {
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

    // Handle uploaded images
    const imageUrls = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];

    const slug = generateSlug(name);

    if (!isDatabaseConnected()) {
      // Mock product creation
      const newProduct = {
        _id: `${mockProductCounter++}`,
        name,
        slug,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        images: imageUrls.length > 0 ? imageUrls : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
        category: { _id: category, name: 'Category Name', slug: 'category-slug' },
        isActive: isActive === 'true',
        isFeatured: isFeatured === 'true',
        inventory: {
          stock: parseInt(stock) || 0,
          lowStockThreshold: parseInt(lowStockThreshold) || 5
        },
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        specifications: specifications ? JSON.parse(specifications) : {},
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return res.status(201).json({
        success: true,
        message: 'Product created successfully (using mock data)',
        data: { product: newProduct }
      });
    }

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
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 5
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
router.put('/products/:id', authenticateToken, requireAdmin, upload.array('images', 5), async (req, res) => {
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

    if (!isDatabaseConnected()) {
      // Mock product update
      const updatedProduct = {
        _id: id,
        name: name || 'Updated Product',
        slug: generateSlug(name || 'Updated Product'),
        description: description || 'Updated description',
        price: price ? parseFloat(price) : 10000,
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        images: req.files && req.files.length > 0 
          ? req.files.map(file => `/uploads/products/${file.filename}`)
          : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'],
        category: { _id: category || 'cat1', name: 'Updated Category', slug: 'updated-category' },
        isActive: isActive !== undefined ? (isActive === 'true') : true,
        isFeatured: isFeatured !== undefined ? (isFeatured === 'true') : false,
        inventory: {
          stock: stock ? parseInt(stock) : 10,
          lowStockThreshold: lowStockThreshold ? parseInt(lowStockThreshold) : 5
        },
        updatedAt: new Date()
      };

      return res.json({
        success: true,
        message: 'Product updated successfully (using mock data)',
        data: { product: updatedProduct }
      });
    }

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
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold: parseInt(lowStockThreshold) })
      };
    }

    // Handle images
    let currentImages = [...product.images];
    
    // Remove specified images
    if (removeImages) {
      const imagesToRemove = Array.isArray(removeImages) ? removeImages : [removeImages];
      currentImages = currentImages.filter(img => !imagesToRemove.includes(img));
    }
    
    // Add new images
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
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

    if (!isDatabaseConnected()) {
      return res.json({
        success: true,
        message: 'Product deleted successfully (using mock data)'
      });
    }

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // TODO: Delete associated image files from filesystem
    // product.images.forEach(imageUrl => {
    //   const imagePath = path.join(__dirname, '..', imageUrl);
    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    //   }
    // });

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
    if (!isDatabaseConnected()) {
      // Mock statistics
      return res.json({
        success: true,
        message: 'Dashboard stats fetched successfully (using mock data)',
        data: {
          totalProducts: 6,
          activeProducts: 6,
          totalCategories: 4,
          lowStockProducts: 2,
          totalOrders: 1,
          recentOrders: 1
        }
      });
    }

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
        $expr: { $lte: ['$inventory.stock', '$inventory.lowStockThreshold'] }
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
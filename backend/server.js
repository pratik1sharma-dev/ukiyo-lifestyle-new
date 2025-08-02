const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
// Also load .env.local if it exists
dotenv.config({ path: '.env.local' });

const app = express();

// Middleware
// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-domain.vercel.app', // Replace with your Vercel domain
        'https://your-custom-domain.com' // Replace with your custom domain if any
      ]
    : ['http://localhost:3000', 'http://localhost:5173'], // Development origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection (with graceful handling)
let mongoConnected = false;

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ukiyo_lifestyle', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('✅ Connected to MongoDB');
    mongoConnected = true;
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.log('🔄 Server will continue without database (API endpoints will return mock data)');
    mongoConnected = false;
  }
};

// Try to connect to MongoDB
connectMongo();

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Ukiyo Lifestyle API',
    version: '1.0.0',
    status: 'running',
    database: mongoConnected ? 'connected' : 'disconnected'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoConnected ? 'connected' : 'disconnected'
  });
});

// Import routes
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const { router: authRoutes } = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  
  if (mongoose.connection.readyState === 1) {
    console.log(`✅ MongoDB connected successfully`);
  } else {
    console.log(`⚠️  MongoDB not connected - using mock data`);
  }

  console.log(`📋 Available endpoints:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/profile`);
  console.log(`   - GET  /api/products`);
  console.log(`   - GET  /api/products/featured`);
  console.log(`   - GET  /api/products/:slug`);
  console.log(`   - GET  /api/categories`);
  console.log(`   - GET  /api/cart`);
  console.log(`   - POST /api/cart/add`);
  console.log(`   - POST /api/payment/create-order`);
  console.log(`   - POST /api/payment/verify`);
  console.log(`   - GET  /api/payment/orders`);
  console.log(`   - 🔐 Admin endpoints:`);
  console.log(`     - GET/POST/PUT/DELETE /api/admin/products`);
  console.log(`     - GET/POST/PUT/DELETE /api/admin/categories`);
  console.log(`     - GET /api/admin/dashboard/stats`);
}); 
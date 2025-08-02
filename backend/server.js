const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Ukiyo Lifestyle API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
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
}); 
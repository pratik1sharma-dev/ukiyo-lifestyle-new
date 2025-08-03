const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authService = require('../services/authService');
const router = express.Router();

// Mock user storage (in-memory, for development when MongoDB is not available)
let mockUsers = [
  {
    _id: 'user1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@ukiyo.com',
    password: '$2a$12$u/0ZBvgJGXojER1UcE7tu.Jphf2RFH/Y.7su68hR88N9cIne07ddi', // hashed "password123"
    phone: '+91-9876543210',
    role: 'customer',
    isActive: true,
    emailVerified: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: []
  },
  {
    _id: 'admin1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ukiyo.com',
    password: '$2a$12$u/0ZBvgJGXojER1UcE7tu.Jphf2RFH/Y.7su68hR88N9cIne07ddi', // hashed "password123"
    phone: '+91-9876543210',
    role: 'admin',
    isActive: true,
    emailVerified: true,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    addresses: []
  }
];

// Check if MongoDB is connected
const isMongoConnected = () => {
  return require('mongoose').connection.readyState === 1;
};

// Mock user methods
const mockUserMethods = {
  findByEmail: (email) => {
    return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  },
  
  create: (userData) => {
    const bcrypt = require('bcryptjs');
    const newUser = {
      _id: 'user' + (mockUsers.length + 1),
      ...userData,
      role: 'customer',
      isActive: true,
      emailVerified: false,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      addresses: []
    };
    
    // Hash password
    const salt = bcrypt.genSaltSync(12);
    newUser.password = bcrypt.hashSync(userData.password, salt);
    
    mockUsers.push(newUser);
    return newUser;
  },
  
  findById: (id) => {
    return mockUsers.find(user => user._id === id);
  },
  
  comparePassword: (plainPassword, hashedPassword) => {
    const bcrypt = require('bcryptjs');
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },
  
  getPublicProfile: (user) => {
    const { password, passwordResetToken, passwordResetExpires, emailVerificationToken, emailVerificationExpires, ...publicProfile } = user;
    return publicProfile;
  },
  
  updateUser: (userId, updates) => {
    const userIndex = mockUsers.findIndex(user => user._id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date() };
      return mockUsers[userIndex];
    }
    return null;
  }
};

// JWT token generation
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  });
};

// Auth middleware
const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔧 Auth Middleware:', {
      path: req.path,
      method: req.method,
      hasAuthHeader: !!req.headers.authorization,
      timestamp: new Date().toISOString()
    });

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    
    if (isMongoConnected()) {
      user = await User.findById(decoded.userId).select('-password');
    } else {
      user = mockUserMethods.findById(decoded.userId);
      if (user) {
        // Remove password from mock user
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

    // Check if user already exists
    let existingUser;
    if (isMongoConnected()) {
      existingUser = await User.findByEmail(email);
    } else {
      existingUser = mockUserMethods.findByEmail(email);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    let user;
    if (isMongoConnected()) {
      // Create new user in MongoDB
      user = new User({
        firstName,
        lastName,
        email,
        password,
        phone
      });
      await user.save();
    } else {
      // Create new user in mock storage
      user = mockUserMethods.create({
        firstName,
        lastName,
        email,
        password,
        phone
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    if (isMongoConnected()) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      mockUserMethods.updateUser(user._id, { lastLogin: new Date() });
    }

    res.status(201).json({
      success: true,
      message: `User registered successfully ${isMongoConnected() ? '' : '(using mock data)'}`,
      data: {
        user: isMongoConnected() ? user.getPublicProfile() : mockUserMethods.getPublicProfile(user),
        accessToken: token,  // Changed from 'token' to 'accessToken' for consistency
        refreshToken
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    let user;
    if (isMongoConnected()) {
      // Find user in MongoDB and include password for comparison
      user = await User.findByEmail(email).select('+password');
    } else {
      // Find user in mock storage
      user = mockUserMethods.findByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Compare password
    let isPasswordValid;
    if (isMongoConnected()) {
      isPasswordValid = await user.comparePassword(password);
    } else {
      isPasswordValid = mockUserMethods.comparePassword(password, user.password);
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    if (isMongoConnected()) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      mockUserMethods.updateUser(user._id, { lastLogin: new Date() });
      user = mockUserMethods.findById(user._id); // Get updated user
    }

    res.json({
      success: true,
      message: `Login successful ${isMongoConnected() ? '' : '(using mock data)'}`,
      data: {
        user: isMongoConnected() ? user.getPublicProfile() : mockUserMethods.getPublicProfile(user),
        accessToken: token,  // Changed from 'token' to 'accessToken' for consistency
        refreshToken
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    let user;
    
    if (isMongoConnected()) {
      user = await User.findById(decoded.userId);
    } else {
      user = mockUserMethods.findById(decoded.userId);
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user: isMongoConnected() ? req.user.getPublicProfile() : mockUserMethods.getPublicProfile(req.user)
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    let user = req.user;

    if (isMongoConnected()) {
      // Update in MongoDB
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (phone) user.phone = phone;
      await user.save();
    } else {
      // Update in mock storage
      const updates = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (phone) updates.phone = phone;
      
      user = mockUserMethods.updateUser(user._id, updates);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: isMongoConnected() ? user.getPublicProfile() : mockUserMethods.getPublicProfile(user)
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, we just confirm the logout
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify token endpoint (useful for frontend)
router.get('/verify', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    data: {
      user: isMongoConnected() ? req.user.getPublicProfile() : mockUserMethods.getPublicProfile(req.user)
    }
  });
});

// POST /api/auth/request-otp - Request OTP for phone number
router.post('/request-otp', async (req, res) => {
  try {
    const { phoneNumber, method = 'sms' } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const result = await authService.requestOTP(phoneNumber, method);

    res.json({
      success: true,
      message: `OTP sent via ${method}`,
      data: {
        phone: result.phone,
        method: result.method,
        mock: result.mock
      }
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
});

// POST /api/auth/verify-otp - Verify OTP and login/register
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const result = await authService.verifyOTP(phoneNumber, otp);

    res.json({
      success: true,
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Invalid OTP'
    });
  }
});

// POST /api/auth/google - Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    const result = await authService.verifyGoogleToken(idToken);

    res.json({
      success: true,
      message: result.isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Google authentication failed'
    });
  }
});

// Export middleware for use in other routes
module.exports = { router, authenticateToken };
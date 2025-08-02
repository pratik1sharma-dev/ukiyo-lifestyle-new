# 🔧 Environment Setup Guide

This guide explains how to switch between different database environments for the Ukiyo Lifestyle backend.

## 📁 Environment Files

- **`env.local`** - Configuration for local MongoDB database
- **`env.atlas`** - Configuration for MongoDB Atlas cloud database
- **`switch-env.js`** - Script to easily switch between environments

## 🚀 Quick Start

### Switch to Local Database
```bash
node switch-env.js local
```

### Switch to Atlas Database
```bash
node switch-env.js atlas
```

## 📋 Manual Setup

If you prefer to manually manage environment files:

1. **For Local Development:**
   ```bash
   cp env.local .env.local
   ```

2. **For Atlas Database:**
   ```bash
   cp env.atlas .env.local
   ```

## 🔍 Verify Current Environment

After switching, you can verify which database you're connected to:

```bash
node -e "require('dotenv').config({ path: '.env.local' }); console.log('MongoDB URI:', process.env.MONGODB_URI.includes('mongodb+srv://') ? 'Atlas (Cloud)' : 'Local');"
```

## ⚙️ Environment Variables

Both environment files contain:

- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (5000)
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - JWT refresh secret
- `CORS_ORIGIN` - Allowed frontend origin
- `RAZORPAY_KEY_ID` - Payment gateway key
- `RAZORPAY_KEY_SECRET` - Payment gateway secret

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Keep your environment files secure
- Use different secrets for production environments

## 🐛 Troubleshooting

### "globalIgnore" Error
If you get a `globalIgnore` error when trying to edit `.env.local`, use the `switch-env.js` script instead.

### Connection Issues
1. Ensure MongoDB is running (for local)
2. Check your Atlas connection string (for cloud)
3. Verify network access settings in Atlas dashboard 
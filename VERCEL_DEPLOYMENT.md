# 🚀 Vercel Frontend Deployment Guide

This guide explains how to deploy the Ukiyo Lifestyle frontend to Vercel.

## 📋 Prerequisites

1. **Railway Backend Deployed**: Your backend should be running on Railway
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be on GitHub

## 🚀 Step-by-Step Deployment

### **Step 1: Connect to Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `ukiyo-lifestyle-new`

### **Step 2: Configure Build Settings**

Vercel should automatically detect the configuration from `vercel.json`, but verify these settings:

- **Framework Preset**: Vite
- **Root Directory**: `./` (root of repository)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `cd frontend && npm install`

### **Step 3: Set Environment Variables**

In your Vercel project settings, add these environment variables:

```bash
# Production API URL (your Railway backend URL)
VITE_API_URL=https://your-railway-app.railway.app

# Example:
# VITE_API_URL=https://ukiyo-lifestyle-backend.railway.app
```

**How to add environment variables:**
1. Go to your Vercel project dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add `VITE_API_URL` with your Railway backend URL

### **Step 4: Deploy**

1. Click "Deploy" button
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🔧 Configuration Files

### **vercel.json**
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **frontend/env.example**
```bash
# Frontend Environment Variables
VITE_API_URL=http://localhost:5000

# For production, set this to your Railway backend URL
# VITE_API_URL=https://your-railway-app.railway.app
```

## 🔍 Troubleshooting

### **Build Errors**

1. **"Module not found" errors**:
   - Ensure all dependencies are in `frontend/package.json`
   - Check that `npm install` runs successfully

2. **TypeScript errors**:
   - Run `npm run lint` locally to check for issues
   - Fix any TypeScript compilation errors

3. **Environment variable issues**:
   - Ensure `VITE_API_URL` is set in Vercel dashboard
   - Check that the URL is accessible

### **Runtime Errors**

1. **API connection issues**:
   - Verify your Railway backend is running
   - Check that `VITE_API_URL` points to the correct backend URL
   - Ensure CORS is configured properly in your backend

2. **404 errors on page refresh**:
   - The `vercel.json` rewrite rule should handle this
   - If issues persist, check the rewrite configuration

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **API URLs**: Use HTTPS in production
3. **CORS**: Ensure your backend allows requests from your Vercel domain

## 📊 Monitoring

After deployment, monitor:
- Build logs in Vercel dashboard
- Function execution times
- Error rates
- Performance metrics

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Or manually trigger a redeploy from Vercel dashboard

## 🎯 Next Steps

After successful deployment:
1. Test all functionality
2. Update your Railway backend CORS settings to allow your Vercel domain
3. Set up custom domain (optional)
4. Configure analytics and monitoring 
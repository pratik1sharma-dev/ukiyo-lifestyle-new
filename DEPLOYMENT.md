# 🚀 Deployment Guide - Ukiyo Lifestyle E-commerce

## 🎯 **FREE DEPLOYMENT STACK**

This guide shows you how to deploy your e-commerce platform **completely free** using:

- **Frontend**: Vercel (Free Tier)
- **Backend**: Railway (Free Tier) 
- **Database**: MongoDB Atlas (Free Tier)
- **Images**: Cloudinary (Free Tier)

## 📋 **STEP-BY-STEP DEPLOYMENT**

### **Step 1: Database Setup (MongoDB Atlas)**

1. **Create Account**: Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. **Create Cluster**: 
   - Choose "M0 Sandbox" (Free tier)
   - Select region closest to your users
   - Name your cluster (e.g., "ukiyo-cluster")
3. **Create Database User**:
   - Go to Database Access
   - Add new user with username/password
   - Grant "Read and write to any database" permissions
4. **Setup Network Access**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
5. **Get Connection String**:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

### **Step 2: Image Storage Setup (Cloudinary)**

1. **Create Account**: Go to [Cloudinary](https://cloudinary.com)
2. **Get Credentials**: From Dashboard, copy:
   - Cloud Name
   - API Key  
   - API Secret
3. **Configure Upload Preset** (Optional):
   - Go to Settings → Upload
   - Create unsigned upload preset for easier integration

### **Step 3: Backend Deployment (Railway)**

1. **Create Account**: Go to [Railway](https://railway.app)
2. **Deploy from GitHub**:
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Choose "Deploy Now"
3. **Configure Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_super_secure_refresh_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   ```
4. **Update CORS Origins**: In your Railway dashboard, note your app URL (e.g., `https://your-app.railway.app`)

### **Step 4: Frontend Deployment (Vercel)**

1. **Create Account**: Go to [Vercel](https://vercel.com)
2. **Import Repository**:
   - Click "New Project"
   - Import from GitHub
   - Select your repository
3. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `cd frontend && npm install`
4. **Set Environment Variables**:
   ```bash
   VITE_API_URL=https://your-railway-app.railway.app
   ```
5. **Deploy**: Click "Deploy"

### **Step 5: Update CORS Configuration**

After getting your Vercel URL, update the CORS configuration in your backend:

1. **Edit `backend/server.js`**:
   ```javascript
   const corsOptions = {
     origin: process.env.NODE_ENV === 'production' 
       ? [
           'https://your-vercel-app.vercel.app', // Your Vercel URL
           'https://your-custom-domain.com'     // Your custom domain (if any)
         ]
       : ['http://localhost:3000', 'http://localhost:5173'],
     // ... rest of config
   };
   ```

2. **Redeploy**: Push changes to trigger redeployment

## 🔧 **POST-DEPLOYMENT CONFIGURATION**

### **Custom Domain (Optional)**
- **Vercel**: Add custom domain in project settings
- **Update CORS**: Add your custom domain to CORS origins

### **SSL Certificates**
- **Automatic**: Both Vercel and Railway provide free SSL certificates
- **No configuration needed**

### **Environment Variables Security**
- **Never commit**: Keep `.env` files in `.gitignore`
- **Use platform secrets**: Set sensitive values in deployment platform dashboards
- **Rotate keys**: Regularly update JWT secrets and API keys

## 📊 **FREE TIER LIMITS**

### **Vercel (Frontend)**
- ✅ 100GB bandwidth/month
- ✅ Unlimited personal projects
- ✅ Custom domains
- ✅ SSL certificates

### **Railway (Backend)**
- ✅ $5 free credit/month (usually enough for small apps)
- ✅ 512MB RAM
- ✅ Automatic deployments
- ✅ Custom domains

### **MongoDB Atlas (Database)**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Built-in security features

### **Cloudinary (Images)**
- ✅ 25GB storage
- ✅ 25GB bandwidth/month
- ✅ Image optimization
- ✅ CDN delivery

## 🚀 **DEPLOYMENT CHECKLIST**

- [ ] MongoDB Atlas cluster created and configured
- [ ] Cloudinary account setup with credentials
- [ ] Backend deployed on Railway with environment variables
- [ ] Frontend deployed on Vercel with API URL configured
- [ ] CORS origins updated with production URLs
- [ ] Custom domain configured (optional)
- [ ] SSL certificates verified (automatic)
- [ ] Admin account tested in production
- [ ] Payment integration tested (if using real keys)

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

1. **CORS Errors**: 
   - Check CORS origins in backend
   - Ensure frontend API URL is correct

2. **Database Connection Failed**:
   - Verify MongoDB connection string
   - Check network access settings (0.0.0.0/0)
   - Confirm database user permissions

3. **Images Not Loading**:
   - Check Cloudinary credentials
   - Verify upload preset configuration

4. **Build Failures**:
   - Check build commands in deployment platforms
   - Verify package.json scripts
   - Check for missing dependencies

## 📞 **SUPPORT**

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser developer console for errors

## 🎉 **SUCCESS!**

Your Ukiyo Lifestyle e-commerce platform is now live and accessible worldwide! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **Admin Access**: Login with `admin@ukiyo.com` / `password123`

**Total Monthly Cost: $0** 🎯
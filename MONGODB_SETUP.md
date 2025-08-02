# 🗄️ MongoDB Setup Guide for Ukiyo Lifestyle

## ✅ **MongoDB Installation Complete!**

Your MongoDB installation has been successfully completed and tested. Here's what was installed and configured:

### **📦 Installed Components:**
- ✅ **MongoDB Server 8.0.12** - Database server
- ✅ **MongoDB Shell 2.5.6** - Command-line interface
- ✅ **Data Directory** - `C:\data\db` created
- ✅ **Environment Configuration** - `.env` file created from template

---

## 🚀 **Current Status**

### **✅ Working Components:**
- ✅ MongoDB Server running on `localhost:27017`
- ✅ Database: `ukiyo_lifestyle` 
- ✅ Backend API responding successfully
- ✅ Sample data loaded and accessible
- ✅ API endpoints tested and working

### **🔗 Tested Endpoints:**
- ✅ `GET /api/products` - Returns product data
- ✅ `GET /api/categories` - Returns category data
- ✅ Server running on `http://localhost:5000`

---

## 🛠️ **MongoDB Management Commands**

### **Start MongoDB Service:**
```powershell
# Start MongoDB service (requires admin privileges)
net start MongoDB

# Or use PowerShell with admin rights
Start-Process powershell -Verb RunAs -ArgumentList "net start MongoDB"
```

### **Stop MongoDB Service:**
```powershell
net stop MongoDB
```

### **Check MongoDB Status:**
```powershell
# Check if service is running
Get-Service MongoDB

# Test connection (after installing mongosh)
mongosh --eval "db.runCommand('ping')"
```

### **Access MongoDB Shell:**
```powershell
# Connect to local database
mongosh

# Connect to specific database
mongosh ukiyo_lifestyle

# Run commands directly
mongosh --eval "use ukiyo_lifestyle; db.products.find()"
```

---

## 📁 **Database Structure**

Your MongoDB database `ukiyo_lifestyle` contains the following collections:

### **Collections:**
- **`products`** - Product catalog with details, pricing, images
- **`categories`** - Product categories and hierarchy
- **`users`** - User accounts and authentication
- **`carts`** - Shopping cart items
- **`orders`** - Order management and tracking

### **Sample Data:**
The database is pre-populated with sample data including:
- Modern furniture products
- Home & Living categories
- Sample user accounts
- Demo cart and order data

---

## 🔧 **Configuration Files**

### **Backend Environment (`.env`):**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ukiyo_lifestyle

# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=ukiyo_lifestyle_jwt_secret_key_2024
JWT_REFRESH_SECRET=ukiyo_lifestyle_refresh_secret_key_2024
```

### **MongoDB Connection String:**
- **Local Development:** `mongodb://localhost:27017/ukiyo_lifestyle`
- **Production (Atlas):** `mongodb+srv://username:password@cluster.mongodb.net/ukiyo_lifestyle`

---

## 🚀 **Development Workflow**

### **1. Start MongoDB:**
```powershell
# Start MongoDB service
net start MongoDB
```

### **2. Start Backend:**
```powershell
cd backend
npm start
# Server runs on http://localhost:5000
```

### **3. Start Frontend:**
```powershell
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### **4. Test API Endpoints:**
```powershell
# Test products API
curl http://localhost:5000/api/products

# Test categories API
curl http://localhost:5000/api/categories
```

---

## 🔍 **Database Operations**

### **View Collections:**
```javascript
// In MongoDB Shell
use ukiyo_lifestyle
show collections
```

### **Query Products:**
```javascript
// Find all products
db.products.find()

// Find products by category
db.products.find({category: "Home & Living"})

// Find products by price range
db.products.find({price: {$gte: 100, $lte: 500}})
```

### **Query Categories:**
```javascript
// Find all categories
db.categories.find()

// Find active categories
db.categories.find({isActive: true})
```

---

## 🛡️ **Security & Best Practices**

### **✅ Implemented Security:**
- ✅ Environment variables for sensitive data
- ✅ JWT authentication tokens
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Error handling and logging

### **🔒 Production Recommendations:**
- Use MongoDB Atlas for production
- Enable authentication and authorization
- Use SSL/TLS connections
- Regular database backups
- Monitor database performance

---

## 🚨 **Troubleshooting**

### **MongoDB Service Issues:**
```powershell
# Check service status
Get-Service MongoDB

# Restart service
Restart-Service MongoDB

# Check logs
Get-EventLog -LogName Application -Source MongoDB
```

### **Connection Issues:**
- Verify MongoDB service is running
- Check firewall settings
- Ensure port 27017 is accessible
- Verify connection string in `.env`

### **Permission Issues:**
- Run PowerShell as Administrator
- Check MongoDB service permissions
- Verify data directory permissions

---

## 📚 **Additional Resources**

### **MongoDB Documentation:**
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

### **Development Tools:**
- **MongoDB Compass** - GUI for MongoDB
- **MongoDB Shell** - Command-line interface
- **Studio 3T** - Alternative GUI tool

---

## 🎉 **Next Steps**

Your MongoDB setup is complete and ready for development! You can now:

1. **Start Development:** Run both backend and frontend servers
2. **Test APIs:** Use the provided endpoints for testing
3. **Add Features:** Implement authentication, payments, admin panel
4. **Deploy:** Use MongoDB Atlas for production deployment

**Happy Coding! 🚀** 
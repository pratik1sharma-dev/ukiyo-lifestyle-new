# 🚀 Quick Start Guide - Ukiyo Lifestyle

## ✅ **Current Status: Both Services Working!**

### **Backend:** ✅ Running on http://localhost:5000
### **Frontend:** ✅ Running on http://localhost:5173

---

## 📋 **Prerequisites**

- **Node.js** v18.20.8 (or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning)

---

## 🚀 **Quick Setup (5 minutes)**

### **1. Clone and Navigate**
```bash
git clone https://github.com/pratik1sharma-dev/ukiyo-lifestyle-new.git
cd ukiyo-lifestyle-new
```

### **2. Start Backend Server**
```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
🚀 Ukiyo Lifestyle API running on port 5000
📱 Environment: development
🔗 API URL: http://localhost:5000
⚠️  MongoDB connection failed: connect ECONNREFUSED ::1:27017
🔄 Server will continue without database (API endpoints will return mock data)
```

### **3. Start Frontend Server (New Terminal)**
```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
VITE v4.5.14  ready in 335 ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 **Access Your Application**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

---

## 📡 **Test API Endpoints**

### **Available Endpoints:**
```bash
# Get all products
curl http://localhost:5000/api/products

# Get featured products
curl http://localhost:5000/api/products/featured

# Get categories
curl http://localhost:5000/api/categories

# Get cart
curl http://localhost:5000/api/cart
```

### **Sample API Response:**
```json
{
  "success": true,
  "data": {
    "products": [...],
    "totalPages": 1,
    "currentPage": 1,
    "totalItems": 6,
    "hasNext": false,
    "hasPrev": false
  },
  "message": "Products fetched successfully (mock data)"
}
```

---

## 🔧 **Troubleshooting**

### **Backend Issues:**
- **Port 5000 in use:** Change PORT in backend/.env
- **MongoDB error:** Expected - server runs with mock data
- **Dependencies error:** Run `npm install` in backend directory

### **Frontend Issues:**
- **Port 5173 in use:** Vite will automatically use next available port
- **Node.js version:** Ensure you're using Node.js v18+
- **Dependencies error:** Run `npm install` in frontend directory

### **Common Commands:**
```bash
# Check Node.js version
node --version

# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process on specific port (Windows)
taskkill /PID <PID> /F
```

---

## 📁 **Project Structure**

```
ukiyo-lifestyle/
├── backend/          # Node.js API server
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── server.js     # Main server file
│   └── package.json
├── frontend/         # React.js frontend
│   ├── src/          # Source code
│   ├── public/       # Static files
│   └── package.json
└── docs/             # Documentation
```

---

## 🎯 **Next Steps**

1. **Explore the Frontend:** Visit http://localhost:5173
2. **Test API:** Use the endpoints above
3. **Add Features:** Start building new functionality
4. **Database Setup:** Install MongoDB for real data persistence

---

## 📞 **Need Help?**

- **Backend Issues:** Check `backend/server.js` logs
- **Frontend Issues:** Check browser console
- **API Issues:** Test endpoints with curl or Postman
- **Documentation:** See `docs/` folder for detailed guides

---

**🎉 You're all set! Both services are running and ready for development.** 
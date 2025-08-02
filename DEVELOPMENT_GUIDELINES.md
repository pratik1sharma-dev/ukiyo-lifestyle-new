# 🛠 Development Guidelines - Ukiyo Lifestyle

## 📋 **Project Standards & Best Practices**

### **🔧 Technology Stack**
- **Frontend:** React 18 + TypeScript + Tailwind CSS + Vite
- **Backend:** Node.js + Express.js + MongoDB + Mongoose
- **State Management:** Zustand
- **Build Tool:** Vite
- **Package Manager:** npm

---

## 📁 **File Structure Standards**

### **✅ Allowed File Extensions**
- **Frontend Components:** `.tsx` (React components)
- **Frontend Utilities:** `.ts` (TypeScript files)
- **Backend:** `.js` (Node.js files)
- **Configuration:** `.json`, `.js`, `.ts`
- **Styling:** `.css`, `.scss`

### **❌ Forbidden File Extensions**
- **Frontend:** `.jsx`, `.js` (for React components)
- **Duplicate files:** Never have both `.js` and `.ts` versions

---

## 🚫 **Common Issues to Avoid**

### **1. Duplicate Files**
```bash
# ❌ NEVER DO THIS:
frontend/src/services/api.js
frontend/src/services/api.ts

# ✅ CORRECT:
frontend/src/services/api.ts
```

### **2. Mixed Extensions**
```bash
# ❌ NEVER DO THIS:
frontend/src/components/Header.jsx
frontend/src/components/Header.tsx

# ✅ CORRECT:
frontend/src/components/Header.tsx
```

### **3. Inconsistent Imports**
```bash
# ❌ NEVER DO THIS:
import { productService } from '../services/api';  // Wrong service name
import { productApi } from '../services/api';      // Correct service name

# ✅ CORRECT:
import { productApi, categoryApi, cartApi } from '../services/api';
```

---

## 📋 **File Naming Conventions**

### **Frontend Files**
```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # ✅ PascalCase for components
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── common/
│       ├── ErrorMessage.tsx
│       └── LoadingSpinner.tsx
├── pages/
│   ├── Home.tsx               # ✅ PascalCase for pages
│   ├── Products.tsx
│   └── Cart.tsx
├── services/
│   └── api.ts                 # ✅ camelCase for utilities
├── store/
│   └── index.ts               # ✅ index.ts for main exports
└── types/
    └── index.ts               # ✅ index.ts for type definitions
```

### **Backend Files**
```
backend/
├── models/
│   ├── Product.js             # ✅ PascalCase for models
│   ├── Category.js
│   └── User.js
├── routes/
│   ├── products.js            # ✅ camelCase for routes
│   ├── categories.js
│   └── cart.js
├── services/
│   └── emailService.js        # ✅ camelCase for services
└── server.js                  # ✅ camelCase for main files
```

---

## 🔍 **Pre-Development Checklist**

### **Before Starting New Work:**
1. ✅ Check for existing files with similar names
2. ✅ Verify correct file extensions (.tsx for React, .ts for utilities)
3. ✅ Ensure consistent import/export patterns
4. ✅ Check for duplicate functionality

### **Before Committing:**
1. ✅ Run `npm run build` in frontend
2. ✅ Run `npx tsc --noEmit` in frontend
3. ✅ Test API endpoints
4. ✅ Check for any .jsx or duplicate .js files
5. ✅ Verify imports use correct service names

---

## 🛠 **Development Commands**

### **Frontend Development**
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start development server
npm run build                  # Build for production
npx tsc --noEmit              # Type check without building
```

### **Backend Development**
```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Start development server
```

### **Full Stack Development**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

## 📚 **API Service Standards**

### **Correct Service Names**
```typescript
// ✅ CORRECT IMPORTS
import { 
  productApi,    // NOT productService
  categoryApi,   // NOT categoryService  
  cartApi,       // NOT cartService
  authApi        // NOT authService
} from '../services/api';
```

### **Correct Method Names**
```typescript
// ✅ CORRECT METHOD CALLS
await productApi.getProducts(filters);        // NOT getAll()
await productApi.getFeaturedProducts();       // NOT getFeatured()
await productApi.getProductBySlug(slug);      // NOT getBySlug()
await categoryApi.getCategories();            // NOT getAll()
await cartApi.getCart();                      // NOT get()
await cartApi.addToCart(productId, quantity); // NOT addItem()
```

---

## 🔧 **Troubleshooting**

### **Common Build Errors**
```bash
# Error: Module has no exported member 'productService'
# Solution: Use 'productApi' instead

# Error: Cannot find module './api.js'
# Solution: Use './api.ts' and ensure file exists

# Error: Duplicate identifier
# Solution: Remove duplicate files, keep only .ts/.tsx versions
```

### **TypeScript Errors**
```bash
# Error: Cannot apply unknown utility class
# Solution: Check Tailwind config and CSS imports

# Error: Missing type definitions
# Solution: Add proper TypeScript interfaces in types/index.ts
```

---

## 📋 **Documentation Standards**

### **Single Source of Truth**
- **Main README:** `README.md` (project overview)
- **Quick Start:** `QUICK_START.md` (5-minute setup)
- **Current Status:** `PROGRESS_CHECKPOINT.md` (development status)
- **Architecture:** `ARCHITECTURE.md` (system design)
- **Requirements:** `REQUIREMENTS.md` (project requirements)
- **Integration:** `INTEGRATION_ROADMAP.md` (feature timeline)

### **No Duplicate Documentation**
```bash
# ❌ NEVER HAVE:
README.md
frontend/README.md
backend/README.md

# ✅ CORRECT:
README.md (single main documentation)
```

---

## 🚀 **Deployment Checklist**

### **Before Deployment:**
1. ✅ All TypeScript compilation passes
2. ✅ No duplicate files exist
3. ✅ All imports use correct service names
4. ✅ Build process completes successfully
5. ✅ API endpoints tested and working
6. ✅ Documentation updated and accurate

### **Environment Variables**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_key
VITE_APP_NAME=Ukiyo Lifestyle

# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ukiyo_lifestyle
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

---

## 📞 **Getting Help**

### **When You Encounter Issues:**
1. Check this document first
2. Look for duplicate files
3. Verify import/export patterns
4. Check TypeScript compilation
5. Test API endpoints
6. Review recent changes

### **Contact Points:**
- **Documentation:** Check `docs/` folder
- **API Reference:** `docs/api/API_DOCUMENTATION.md`
- **Current Status:** `PROGRESS_CHECKPOINT.md`

---

**Remember: Consistency is key! Always use TypeScript for frontend and maintain clean, duplicate-free code. 🚀** 
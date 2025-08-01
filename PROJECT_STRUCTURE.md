# Ukiyo Lifestyle Ecommerce Platform - Project Structure

## 1. Root Directory Structure

```
ukiyo-lifestyle/
├── frontend/                 # React.js frontend application
├── backend/                  # Node.js backend API
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation files
├── docker-compose.yml        # Docker development setup
├── .gitignore
├── README.md
├── REQUIREMENTS.md
├── ARCHITECTURE.md
└── PROJECT_STRUCTURE.md
```

## 2. Frontend Structure (React.js + TypeScript)

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── images/
│       ├── logo.svg
│       └── placeholder.jpg
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Loading/
│   │   │   └── ErrorBoundary/
│   │   ├── layout/          # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Navigation/
│   │   ├── product/         # Product-related components
│   │   │   ├── ProductCard/
│   │   │   ├── ProductGrid/
│   │   │   ├── ProductDetail/
│   │   │   ├── ProductFilters/
│   │   │   └── ProductSearch/
│   │   ├── cart/            # Shopping cart components
│   │   │   ├── CartItem/
│   │   │   ├── CartSummary/
│   │   │   └── CartDrawer/
│   │   ├── checkout/        # Checkout flow components
│   │   │   ├── CheckoutForm/
│   │   │   ├── PaymentForm/
│   │   │   └── OrderSummary/
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── ForgotPassword/
│   │   └── admin/           # Admin panel components
│   │       ├── Dashboard/
│   │       ├── ProductManager/
│   │       ├── OrderManager/
│   │       └── UserManager/
│   ├── pages/               # Page components
│   │   ├── Home/
│   │   ├── Products/
│   │   ├── ProductDetail/
│   │   ├── Cart/
│   │   ├── Checkout/
│   │   ├── Account/
│   │   ├── Orders/
│   │   ├── Login/
│   │   ├── Register/
│   │   └── Admin/
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   └── useLocalStorage.ts
│   ├── store/               # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── productStore.ts
│   │   └── uiStore.ts
│   ├── services/            # API service functions
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   └── uploadService.ts
│   ├── utils/               # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validation.ts
│   │   ├── formatters.ts
│   │   └── seo.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── api.ts
│   ├── styles/              # Global styles and Tailwind config
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── tailwind.config.js
│   ├── assets/              # Static assets
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.js
├── .prettierrc
└── index.html
```

## 3. Backend Structure (Node.js + Express.js)

```
backend/
├── src/
│   ├── controllers/         # Route controllers
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── orderController.ts
│   │   ├── userController.ts
│   │   ├── categoryController.ts
│   │   ├── paymentController.ts
│   │   └── uploadController.ts
│   ├── models/              # Database models (Mongoose)
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Category.ts
│   │   ├── Cart.ts
│   │   └── Wishlist.ts
│   ├── routes/              # API routes
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   ├── payments.ts
│   │   ├── uploads.ts
│   │   └── admin.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── upload.ts
│   │   └── cors.ts
│   ├── services/            # Business logic services
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── paymentService.ts
│   │   ├── emailService.ts
│   │   └── uploadService.ts
│   ├── utils/               # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validation.ts
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   └── logger.ts
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   └── express.ts
│   ├── config/              # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── razorpay.ts
│   │   ├── email.ts
│   │   └── upload.ts
│   ├── seeds/               # Database seed data
│   │   ├── users.ts
│   │   ├── categories.ts
│   │   └── products.ts
│   └── app.ts               # Express app setup
├── uploads/                 # File upload directory
│   ├── products/
│   ├── categories/
│   └── temp/
├── logs/                    # Application logs
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
├── tsconfig.json
├── nodemon.json
├── .env.example
├── .eslintrc.js
├── .prettierrc
└── jest.config.js
```

## 4. Shared Types Structure

```
shared/
├── types/                   # Shared TypeScript types
│   ├── auth.ts
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── api.ts
├── constants/               # Shared constants
│   ├── api.ts
│   ├── validation.ts
│   └── messages.ts
└── utils/                   # Shared utility functions
    ├── validation.ts
    ├── formatters.ts
    └── helpers.ts
```

## 5. Documentation Structure

```
docs/
├── api/                     # API documentation
│   ├── auth.md
│   ├── products.md
│   ├── orders.md
│   └── payments.md
├── deployment/              # Deployment guides
│   ├── development.md
│   ├── production.md
│   └── docker.md
├── database/                # Database documentation
│   ├── schema.md
│   ├── migrations.md
│   └── seeds.md
└── guides/                  # Development guides
    ├── setup.md
    ├── contributing.md
    └── testing.md
```

## 6. Docker Configuration

```
docker-compose.yml           # Development environment
docker-compose.prod.yml      # Production environment
Dockerfile.frontend          # Frontend Dockerfile
Dockerfile.backend           # Backend Dockerfile
.dockerignore
```

## 7. Environment Configuration

### Frontend Environment Variables
```env
# .env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_APP_NAME=Ukiyo Lifestyle
```

### Backend Environment Variables
```env
# .env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ukiyo_lifestyle
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
```

## 8. Key Configuration Files

### Frontend Configuration Files
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier formatting rules

### Backend Configuration Files
- `tsconfig.json` - TypeScript configuration
- `nodemon.json` - Development server configuration
- `jest.config.js` - Testing configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc` - Prettier formatting rules

## 9. Naming Conventions

### Files and Folders
- Use kebab-case for folder names: `product-detail/`
- Use PascalCase for component files: `ProductCard.tsx`
- Use camelCase for utility files: `apiService.ts`
- Use UPPER_CASE for constants: `API_ENDPOINTS.ts`

### Components
- Use PascalCase for component names: `ProductCard`
- Use camelCase for props and state: `productData`, `isLoading`
- Use descriptive names: `ProductCard` instead of `Card`

### Database
- Use camelCase for field names: `firstName`, `productName`
- Use plural for collection names: `users`, `products`
- Use descriptive field names: `createdAt` instead of `date`

### API Endpoints
- Use kebab-case for URLs: `/api/product-categories`
- Use HTTP methods appropriately: GET, POST, PUT, DELETE
- Use descriptive endpoint names: `/api/products/:id/reviews`

## 10. Development Workflow

### Git Branching Strategy
```
main                    # Production-ready code
├── develop            # Development branch
├── feature/           # Feature branches
│   ├── feature/user-auth
│   ├── feature/product-catalog
│   └── feature/payment-integration
├── bugfix/            # Bug fix branches
└── hotfix/            # Critical production fixes
```

### Commit Message Convention
```
feat: add user authentication
fix: resolve payment gateway issue
docs: update API documentation
style: format code with prettier
refactor: restructure product service
test: add unit tests for auth service
chore: update dependencies
```

This structure provides a scalable and maintainable foundation for the Ukiyo Lifestyle ecommerce platform, following industry best practices and ensuring good separation of concerns. 
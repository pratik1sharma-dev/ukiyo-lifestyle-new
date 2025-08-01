# Ukiyo Lifestyle Ecommerce Platform - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.ukiyolifestyle.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 1. Authentication Endpoints

### 1.1 Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+919876543210",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### 1.2 Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### 1.3 Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.4 Forgot Password
```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

### 1.5 Reset Password
```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_here",
  "password": "NewSecurePassword123!"
}
```

## 2. Product Endpoints

### 2.1 Get All Products
```http
GET /api/products?page=1&limit=12&category=wellness&sort=price_asc&search=yoga
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 50)
- `category`: Category ID or slug
- `sort`: Sort order (price_asc, price_desc, name_asc, name_desc, newest)
- `search`: Search term
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `inStock`: Filter by stock availability (true/false)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Organic Yoga Mat",
        "slug": "organic-yoga-mat",
        "description": "Premium organic yoga mat for your practice",
        "price": 2999,
        "comparePrice": 3999,
        "images": ["https://example.com/yoga-mat-1.jpg"],
        "category": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Wellness",
          "slug": "wellness"
        },
        "inventory": {
          "quantity": 25,
          "inStock": true
        },
        "rating": 4.5,
        "reviewCount": 128
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 150,
      "pages": 13
    }
  }
}
```

### 2.2 Get Product by ID
```http
GET /api/products/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Organic Yoga Mat",
      "slug": "organic-yoga-mat",
      "description": "Premium organic yoga mat for your practice",
      "shortDescription": "Eco-friendly yoga mat",
      "price": 2999,
      "comparePrice": 3999,
      "costPrice": 1500,
      "sku": "YM-001",
      "images": [
        "https://example.com/yoga-mat-1.jpg",
        "https://example.com/yoga-mat-2.jpg"
      ],
      "variants": [
        {
          "name": "Color",
          "options": ["Purple", "Blue", "Green"]
        },
        {
          "name": "Size",
          "options": ["Standard", "Extra Long"]
        }
      ],
      "category": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Wellness",
        "slug": "wellness"
      },
      "inventory": {
        "quantity": 25,
        "lowStockThreshold": 5,
        "trackQuantity": true,
        "inStock": true
      },
      "seo": {
        "metaTitle": "Organic Yoga Mat - Premium Quality",
        "metaDescription": "Buy premium organic yoga mat for your practice",
        "keywords": ["yoga mat", "organic", "wellness"]
      },
      "reviews": [
        {
          "id": "507f1f77bcf86cd799439013",
          "rating": 5,
          "comment": "Excellent quality mat!",
          "user": {
            "name": "Sarah M.",
            "avatar": "https://example.com/avatar.jpg"
          },
          "createdAt": "2024-01-10T10:30:00Z"
        }
      ],
      "rating": 4.5,
      "reviewCount": 128,
      "isFeatured": true,
      "createdAt": "2024-01-01T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2.3 Search Products
```http
GET /api/products/search?q=yoga&page=1&limit=12
```

## 3. Category Endpoints

### 3.1 Get All Categories
```http
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Wellness",
        "slug": "wellness",
        "description": "Wellness and health products",
        "image": "https://example.com/wellness.jpg",
        "productCount": 45,
        "subcategories": [
          {
            "id": "507f1f77bcf86cd799439014",
            "name": "Yoga",
            "slug": "yoga",
            "productCount": 23
          }
        ]
      }
    ]
  }
}
```

### 3.2 Get Category by ID
```http
GET /api/categories/507f1f77bcf86cd799439012
```

## 4. Cart Endpoints

### 4.1 Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "507f1f77bcf86cd799439015",
      "items": [
        {
          "id": "507f1f77bcf86cd799439016",
          "product": {
            "id": "507f1f77bcf86cd799439011",
            "name": "Organic Yoga Mat",
            "price": 2999,
            "image": "https://example.com/yoga-mat-1.jpg"
          },
          "quantity": 2,
          "variant": "Purple - Standard",
          "price": 2999,
          "total": 5998
        }
      ],
      "subtotal": 5998,
      "tax": 1079.64,
      "shipping": 0,
      "total": 7077.64,
      "itemCount": 2
    }
  }
}
```

### 4.2 Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2,
  "variant": "Purple - Standard"
}
```

### 4.3 Update Cart Item
```http
PUT /api/cart/items/507f1f77bcf86cd799439016
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "quantity": 3
}
```

### 4.4 Remove Cart Item
```http
DELETE /api/cart/items/507f1f77bcf86cd799439016
Authorization: Bearer <token>
```

## 5. Order Endpoints

### 5.1 Create Order
```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "variant": "Purple - Standard"
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "+919876543210"
  },
  "paymentMethod": "razorpay"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "507f1f77bcf86cd799439017",
      "orderNumber": "UKIYO-2024-001",
      "status": "pending",
      "paymentStatus": "pending",
      "items": [
        {
          "product": {
            "id": "507f1f77bcf86cd799439011",
            "name": "Organic Yoga Mat",
            "price": 2999
          },
          "quantity": 2,
          "total": 5998
        }
      ],
      "subtotal": 5998,
      "tax": 1079.64,
      "shipping": 0,
      "total": 7077.64,
      "razorpayOrderId": "order_1234567890",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 5.2 Get User Orders
```http
GET /api/orders?page=1&limit=10
Authorization: Bearer <token>
```

### 5.3 Get Order by ID
```http
GET /api/orders/507f1f77bcf86cd799439017
Authorization: Bearer <token>
```

## 6. Payment Endpoints

### 6.1 Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439017",
  "amount": 7077.64,
  "currency": "INR"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_1234567890",
    "amount": 7077.64,
    "currency": "INR",
    "key": "rzp_test_your_key_id"
  }
}
```

### 6.2 Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_1234567890",
  "razorpayPaymentId": "pay_1234567890",
  "razorpaySignature": "signature_here"
}
```

## 7. User Endpoints

### 7.1 Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

### 7.2 Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

### 7.3 Add Address
```http
POST /api/users/addresses
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "home",
  "street": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "isDefault": true
}
```

## 8. Admin Endpoints

### 8.1 Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalSales": 1500000,
      "totalOrders": 1250,
      "totalProducts": 450,
      "totalCustomers": 850,
      "monthlySales": [
        {"month": "Jan", "sales": 120000},
        {"month": "Feb", "sales": 150000}
      ],
      "topProducts": [
        {
          "id": "507f1f77bcf86cd799439011",
          "name": "Organic Yoga Mat",
          "sales": 25000
        }
      ]
    }
  }
}
```

### 8.2 Create Product (Admin)
```http
POST /api/admin/products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

### 8.3 Update Product (Admin)
```http
PUT /api/admin/products/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
```

### 8.4 Delete Product (Admin)
```http
DELETE /api/admin/products/507f1f77bcf86cd799439011
Authorization: Bearer <admin_token>
```

### 8.5 Update Order Status (Admin)
```http
PUT /api/admin/orders/507f1f77bcf86cd799439017/status
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TRK123456789"
}
```

## 9. Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `PAYMENT_ERROR` | Payment processing failed |
| `INVENTORY_ERROR` | Insufficient stock |
| `SERVER_ERROR` | Internal server error |

## 10. Rate Limiting

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Admin endpoints**: 500 requests per minute

## 11. Webhooks

### 11.1 Razorpay Webhook
```http
POST /api/webhooks/razorpay
```

**Headers:**
```
X-Razorpay-Signature: signature_here
```

**Body:**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "id": "pay_1234567890",
      "order_id": "order_1234567890",
      "amount": 7077.64,
      "status": "captured"
    }
  }
}
```

## 12. File Upload

### 12.1 Upload Product Image
```http
POST /api/admin/upload/product-image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: File (max 5MB, JPG/PNG/WebP)
- `productId`: Product ID (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/products/image-123.jpg",
    "filename": "image-123.jpg"
  }
}
``` 
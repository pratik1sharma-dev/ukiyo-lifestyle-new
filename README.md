# Ukiyo Lifestyle Ecommerce Platform

A modern, SEO-optimized ecommerce platform built with React.js, Node.js, and MongoDB, featuring Razorpay payment integration and comprehensive admin panel.

## 🚀 Features

### Customer Features
- **Product Catalog** - Browse products with advanced filtering and search
- **Shopping Cart** - Persistent cart with quantity management
- **User Authentication** - Secure registration and login system
- **Order Management** - Track orders and view order history
- **Payment Integration** - Seamless Razorpay payment processing
- **Wishlist** - Save favorite products for later purchase
- **Responsive Design** - Mobile-first approach for all devices

### Admin Features
- **Dashboard Analytics** - Sales reports and key metrics
- **Product Management** - Add, edit, and manage products
- **Category Management** - Organize products with categories
- **Inventory Management** - Real-time stock tracking
- **Order Management** - Process and update order status
- **User Management** - View customer accounts and orders

### SEO Features
- **Meta Tags** - Dynamic SEO optimization
- **Structured Data** - Product schema markup
- **Sitemap Generation** - Auto-generated XML sitemaps
- **Performance Optimized** - Fast loading times and Core Web Vitals

## 🛠 Technology Stack

### Frontend
- **React.js 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Vite** for build tooling
- **Headless UI** for accessible components

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Razorpay** for payment processing
- **Multer** for file uploads
- **Nodemailer** for email notifications

### Development Tools
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality
- **Jest & Cypress** for testing
- **Docker** for containerization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pratik1sharma-dev/ukiyo-lifestyle-new.git
cd ukiyo-lifestyle-new
```

### 2. Environment Setup

#### Frontend Environment
Create `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_APP_NAME=Ukiyo Lifestyle
```

#### Backend Environment
Create `.env` file in the `backend` directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ukiyo_lifestyle
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 4. Start Development Servers

#### Backend (Terminal 1)
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

#### Frontend (Terminal 2)
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

### 5. Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

**✅ Both services are currently running and ready for development!**

### 6. Test API Endpoints
```bash
# Get all products
curl http://localhost:5000/api/products

# Get featured products
curl http://localhost:5000/api/products/featured

# Get categories
curl http://localhost:5000/api/categories
```

## 🐳 Docker Setup

### Using Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Containers
```bash
# Build and run backend
docker build -f Dockerfile.backend -t ukiyo-backend .
docker run -p 5000:5000 ukiyo-backend

# Build and run frontend
docker build -f Dockerfile.frontend -t ukiyo-frontend .
docker run -p 5173:5173 ukiyo-frontend
```

## 📁 Project Structure

```
ukiyo-lifestyle/
├── frontend/                 # React.js frontend
├── backend/                  # Node.js backend API
├── shared/                   # Shared types and utilities
├── docs/                     # Documentation
├── docker-compose.yml        # Docker configuration
└── README.md
```

For detailed project structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🔧 Configuration

### Razorpay Setup
1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from the dashboard
3. Add keys to environment variables
4. Configure webhook endpoints for payment verification

### MongoDB Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `ukiyo_lifestyle`
3. Update the connection string in backend `.env`

### Email Configuration
1. Set up SMTP credentials (Gmail recommended for development)
2. Configure email templates for order confirmations
3. Test email functionality

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:coverage # Coverage report
```

### Backend Testing
```bash
cd backend
npm run test          # Unit tests
npm run test:integration # Integration tests
npm run test:coverage # Coverage report
```

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm run build
```

## 🚀 Deployment

### Frontend Deployment
- **Vercel:** Connect GitHub repository for automatic deployment
- **Netlify:** Drag and drop build folder
- **AWS S3 + CloudFront:** For static hosting

### Backend Deployment
- **Heroku:** Connect GitHub repository
- **AWS EC2:** Use PM2 for process management
- **DigitalOcean App Platform:** Containerized deployment

### Database Deployment
- **MongoDB Atlas:** Cloud database service
- **AWS DocumentDB:** Managed MongoDB service

## 🔧 Troubleshooting

### Common Issues

**Backend Issues:**
- **Port 5000 in use:** Change PORT in backend/.env
- **MongoDB error:** Expected - server runs with mock data
- **Dependencies error:** Run `npm install` in backend directory

**Frontend Issues:**
- **Port 5173 in use:** Vite will automatically use next available port
- **Node.js version:** Ensure you're using Node.js v18+
- **Dependencies error:** Run `npm install` in frontend directory

**Quick Commands:**
```bash
# Check Node.js version
node --version

# Check if ports are in use (Windows)
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process on specific port (Windows)
taskkill /PID <PID> /F
```

## 📚 Documentation

- [Quick Start Guide](./QUICK_START.md) - Get up and running in 5 minutes
- [Development Guidelines](./DEVELOPMENT_GUIDELINES.md) - **IMPORTANT: Read this first!**
- [Requirements Document](./REQUIREMENTS.md) - Detailed project requirements
- [Architecture Document](./ARCHITECTURE.md) - System architecture and technology choices
- [Project Structure](./PROJECT_STRUCTURE.md) - Detailed folder organization
- [API Documentation](./docs/api/) - Backend API endpoints
- [Deployment Guides](./docs/deployment/) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write unit tests for new features
- Use conventional commit messages
- Ensure code passes linting and formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Version History

- **v1.0.0** - Initial release with core ecommerce features
- **v1.1.0** - Added admin panel and advanced features
- **v1.2.0** - SEO optimization and performance improvements

## 🙏 Acknowledgments

- [React.js](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://mongodb.com/) - Database
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

**Built with ❤️ for Ukiyo Lifestyle** 
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

// Sample categories
const categories = [
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Beautiful home decor and lifestyle products',
    sortOrder: 1
  },
  {
    name: 'Fashion & Accessories',
    slug: 'fashion-accessories',
    description: 'Trendy fashion items and accessories',
    sortOrder: 2
  },
  {
    name: 'Beauty & Wellness',
    slug: 'beauty-wellness',
    description: 'Natural beauty and wellness products',
    sortOrder: 3
  },
  {
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Premium kitchen and dining essentials',
    sortOrder: 4
  }
];

// Sample products
const products = [
  {
    name: 'Minimalist Ceramic Vase',
    slug: 'minimalist-ceramic-vase',
    description: 'A beautiful handcrafted ceramic vase perfect for modern homes. Made with premium clay and finished with a matte glaze.',
    shortDescription: 'Handcrafted ceramic vase for modern homes',
    price: 1299,
    comparePrice: 1599,
    sku: 'VASE-001',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'],
    inventory: {
      quantity: 25,
      trackQuantity: true
    },
    isFeatured: true,
    tags: ['vase', 'ceramic', 'minimalist', 'home decor']
  },
  {
    name: 'Organic Cotton Tote Bag',
    slug: 'organic-cotton-tote-bag',
    description: 'Eco-friendly tote bag made from 100% organic cotton. Perfect for shopping, beach trips, or daily use.',
    shortDescription: 'Eco-friendly organic cotton tote bag',
    price: 599,
    comparePrice: 799,
    sku: 'BAG-001',
    images: ['https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500'],
    inventory: {
      quantity: 50,
      trackQuantity: true
    },
    isFeatured: true,
    tags: ['tote', 'cotton', 'eco-friendly', 'shopping']
  },
  {
    name: 'Natural Face Serum',
    slug: 'natural-face-serum',
    description: 'Hydrating face serum with natural ingredients like hyaluronic acid and vitamin C. Suitable for all skin types.',
    shortDescription: 'Hydrating natural face serum',
    price: 899,
    comparePrice: 1199,
    sku: 'BEAUTY-001',
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
    inventory: {
      quantity: 30,
      trackQuantity: true
    },
    isFeatured: false,
    tags: ['serum', 'face', 'natural', 'beauty']
  },
  {
    name: 'Bamboo Cutting Board',
    slug: 'bamboo-cutting-board',
    description: 'Premium bamboo cutting board with juice groove. Perfect for chopping vegetables, fruits, and meats.',
    shortDescription: 'Premium bamboo cutting board with juice groove',
    price: 799,
    comparePrice: 999,
    sku: 'KITCHEN-001',
    images: ['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=500'],
    inventory: {
      quantity: 40,
      trackQuantity: true
    },
    isFeatured: true,
    tags: ['cutting board', 'bamboo', 'kitchen', 'cooking']
  },
  {
    name: 'Aromatherapy Diffuser',
    slug: 'aromatherapy-diffuser',
    description: 'Ultrasonic aromatherapy diffuser with LED mood lighting. Perfect for creating a relaxing atmosphere.',
    shortDescription: 'Ultrasonic aromatherapy diffuser with mood lighting',
    price: 1499,
    comparePrice: 1899,
    sku: 'WELLNESS-001',
    images: ['https://images.unsplash.com/photo-1602928321679-7111d78b0cac?w=500'],
    inventory: {
      quantity: 15,
      trackQuantity: true
    },
    isFeatured: false,
    tags: ['diffuser', 'aromatherapy', 'wellness', 'relaxation']
  },
  {
    name: 'Handwoven Throw Blanket',
    slug: 'handwoven-throw-blanket',
    description: 'Luxurious handwoven throw blanket made from premium wool. Perfect for adding warmth and style to your home.',
    shortDescription: 'Luxurious handwoven wool throw blanket',
    price: 2499,
    comparePrice: 2999,
    sku: 'HOME-001',
    images: ['https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=500'],
    inventory: {
      quantity: 20,
      trackQuantity: true
    },
    isFeatured: true,
    tags: ['blanket', 'wool', 'handwoven', 'home decor']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ukiyo_lifestyle', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create a map of category names to IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Add category references to products
    const productsWithCategories = products.map(product => {
      let categoryId;
      if (product.name.includes('Vase') || product.name.includes('Blanket')) {
        categoryId = categoryMap['Home & Living'];
      } else if (product.name.includes('Bag')) {
        categoryId = categoryMap['Fashion & Accessories'];
      } else if (product.name.includes('Serum') || product.name.includes('Diffuser')) {
        categoryId = categoryMap['Beauty & Wellness'];
      } else if (product.name.includes('Cutting Board')) {
        categoryId = categoryMap['Kitchen & Dining'];
      }
      
      return {
        ...product,
        category: categoryId
      };
    });

    // Insert products
    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample data created:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log('\n🔗 You can now test the API endpoints:');
    console.log('   - GET http://localhost:5000/api/categories');
    console.log('   - GET http://localhost:5000/api/products');
    console.log('   - GET http://localhost:5000/api/products/featured');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();
// Also load .env.local if it exists
require('dotenv').config({ path: '.env.local' });

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
    tags: ['vase', 'ceramic', 'minimalist', 'home decor'],
    category: 'Home & Living'
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
    tags: ['tote', 'cotton', 'eco-friendly', 'shopping'],
    category: 'Fashion & Accessories'
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
    tags: ['serum', 'face', 'natural', 'beauty'],
    category: 'Beauty & Wellness'
  },
  {
    name: 'Swipe-Up Noir Extreme Perfume for Men',
    slug: 'swipe-up-noir-extreme-perfume-men',
    description: 'Swipe-Up™ Noir Extreme is an intense Eau de Parfum crafted for the modern man who exudes confidence and mystery. With notes of bergamot, pepper, lavender, and patchouli, this scent strikes a perfect balance between sophistication and masculinity. Ideal for daily use and special occasions, the 100ml bottle ensures long-lasting freshness. Perfectly suited for bold personalities who want to make a lasting impression.',
    shortDescription: 'Swipe-Up™ Noir Extreme – Long-lasting perfume for confident, modern men.',
    price: 299,
    comparePrice: 699,
    sku: 'AMZ-002',
    images: [
      'https://m.media-amazon.com/images/I/61OlCAVTvLL._SL1500_.jpg',
      'https://m.media-amazon.com/images/I/51rWgvCCf+L._SL1500_.jpg'
    ],
    inventory: {
      quantity: 10,
      trackQuantity: true
    },
    isFeatured: true,
    tags: ['perfume', 'men', 'fragrance', 'noir', 'long-lasting'],
    category: 'Beauty & Wellness'
  },
  {
    name: 'Secret Solid Perfume Unisex',
    slug: 'secret-solid-perfume-unisex',
    "description": "Secret Perfume is a luxurious solid fragrance that’s alcohol-free and suitable for both men and women. Its compact and travel-friendly design makes it ideal for on-the-go use. Made with skin-friendly, natural ingredients, this solid perfume offers long-lasting aroma and an elegant fragrance profile. It’s easy to apply, non-spill, and makes for a thoughtful gift. Whether you're heading to work or a special event, this solid perfume is your perfect scent companion.",
    "shortDescription": "Alcohol-free, compact solid perfume with long-lasting luxury fragrance.",
    "price": 349,
    "comparePrice": 999,
    "sku": "AMZ-001",
    "images": [
      "https://m.media-amazon.com/images/I/61-vSHHRwYL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61HD2CnCt5L._SL1500_.jpg"
    ],
    "inventory": {
      "quantity": 10,
      "trackQuantity": true
    },
    "isFeatured": true,
    tags: ['solid perfume', 'alcohol-free', 'unisex', 'luxury', 'gift'],
    category: 'Beauty & Wellness'
  },
  {
    name: 'Secret Solid Perfume Romantic Pink',
    slug: 'secret-solid-perfume-romantic-pink',
    "description": "This solid perfume in Romantic Pink is specially crafted for women seeking a soft yet impactful fragrance. Alcohol-free and enriched with natural ingredients, it's gentle on the skin and perfect for travel. The scent delivers long-lasting freshness with romantic floral notes. With its spill-proof, compact design, it’s an excellent addition to any handbag and a perfect gifting option.",
    "shortDescription": "Romantic Pink – Solid perfume for women with a long-lasting floral fragrance.",
    "price": 349,
    "comparePrice": 999,
    "sku": "AMZ-003",
    "images": [
      "https://m.media-amazon.com/images/I/71AMtxMCRUL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81PM91ykUzL._SL1500_.jpg"
    ],
    "inventory": {
      "quantity": 10,
      "trackQuantity": true
    },
    "isFeatured": true,
    tags: ['solid perfume', 'women', 'romantic', 'alcohol-free', 'gift'],
    category: 'Beauty & Wellness'
  },
  {
    name: 'Secret Solid Perfume Blissful Blossom',
    "slug": "secret-solid-perfume-blissful-blossom",
    "description": "Secret Solid Perfume in Blissful Blossom brings a touch of elegance to your everyday scent. Designed for women who love delicate floral fragrances, it’s alcohol-free, compact, and gentle on the skin. With long-lasting wear and an easy-to-carry case, this perfume is a must-have for travel, office, or daily freshness. Ideal for gifting and personal indulgence.",
    "shortDescription": "Blissful Blossom – Floral solid perfume for women, skin-friendly and travel-ready.",
    "price": 349,
    "comparePrice": 999,
    "sku": "AMZ-004",
    "images": [
      "https://m.media-amazon.com/images/I/71l1xnkkwaL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71T1rcMGXtL._SL1500_.jpg"
    ],
    "inventory": {
      "quantity": 10,
      "trackQuantity": true
    },
    "isFeatured": true,
    tags: ['solid perfume', 'women', 'floral', 'alcohol-free', 'travel'],
    category: 'Beauty & Wellness'
  }
];

// Sample users
const users = [
  {
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@ukiyo.com',
    password: 'password123',
    phone: '+919876543210',
    role: 'customer',
    emailVerified: true,
    isActive: true
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@ukiyo.com',
    password: 'password123',
    phone: '+919876543210',
    role: 'admin',
    emailVerified: true,
    isActive: true
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
    await User.deleteMany({});
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
      
      // Use the category field if it exists, otherwise fall back to name-based mapping
      if (product.category) {
        categoryId = categoryMap[product.category];
      } else if (product.name.includes('Vase') || product.name.includes('Blanket')) {
        categoryId = categoryMap['Home & Living'];
      } else if (product.name.includes('Bag')) {
        categoryId = categoryMap['Fashion & Accessories'];
      } else if (product.name.includes('Serum') || product.name.includes('Diffuser') || product.name.includes('Perfume')) {
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

    // Insert users (create individually to trigger password hashing middleware)
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Sample data created:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Products: ${createdProducts.length}`);
    console.log(`   - Users: ${createdUsers.length} (admin@ukiyo.com, demo@ukiyo.com)`);
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
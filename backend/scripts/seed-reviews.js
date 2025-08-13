/*
  Seed fake reviews for all products.
  Usage:
    NODE_ENV=development MONGODB_URI="mongodb://localhost:27017/ukiyo_lifestyle" node scripts/seed-reviews.js
*/

const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ukiyo_lifestyle';

const sampleNames = [
  'Aarav', 'Vihaan', 'Vivaan', 'Aditya', 'Arjun', 'Reyansh', 'Muhammad', 'Sai', 'Arnav', 'Atharv',
  'Ananya', 'Aadhya', 'Diya', 'Jiya', 'Prisha', 'Ira', 'Anika', 'Sara', 'Myra', 'Advika'
];

const sampleComments = [
  'Smells amazing and lasts long through the day.',
  'Perfect for travel—no spills, just a quick dab.',
  'Subtle yet noticeable. Great for office wear.',
  'Love the fresh opening and warm dry‑down.',
  'Skin‑safe and lightweight. No irritation at all.',
  'Projection is moderate, longevity around 6–7 hours.',
  'Great value for money. The tin is super handy!',
  'Got compliments from friends. Definitely recommend.',
  'Perfect for the Indian summer—stays close and clean.',
  'Layered it with another scent and it works beautifully.'
];

const climates = ['Summer', 'Monsoon', 'Winter'];
const skinTypes = ['Dry', 'Oily', 'Normal', 'Combination'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function seed() {
  console.log('🔧 Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('✅ Connected');

  const products = await Product.find({ isActive: true }).select('_id name slug noteFamily scentProfile');
  console.log(`📦 Found ${products.length} active products`);

  let totalCreated = 0;

  for (const product of products) {
    const existingCount = await Review.countDocuments({ product: product._id });
    const target = Math.max(3, randInt(3, 6));

    if (existingCount >= target) {
      console.log(`   ↷ ${product.name}: already has ${existingCount} reviews, skipping`);
      continue;
    }

    const toCreate = target - existingCount;
    const docs = [];
    for (let i = 0; i < toCreate; i++) {
      const rating = randInt(4, 5); // bias positive
      const longevityRating = randInt(4, 5);
      const projectionRating = randInt(3, 5);
      const scentFamily = product.noteFamily || pick(product.scentProfile || ['Citrus', 'Floral', 'Woody', 'Oriental']);

      docs.push({
        product: product._id,
        name: pick(sampleNames),
        rating,
        title: rating >= 5 ? 'New signature scent!' : 'Lovely daily wear',
        comment: pick(sampleComments),
        scentFamily,
        longevityRating,
        projectionRating,
        climateUsed: pick(climates),
        skinType: pick(skinTypes),
        isVerifiedPurchase: Math.random() < 0.5,
      });
    }

    if (docs.length) {
      await Review.insertMany(docs);
      totalCreated += docs.length;
      // Recompute aggregates
      const agg = await Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      ]);
      if (agg.length > 0) {
        await Product.updateOne({ _id: product._id }, { $set: { rating: Math.round(agg[0].avgRating * 10) / 10, reviewCount: agg[0].count } });
      }
      console.log(`   ✓ ${product.name}: added ${docs.length} reviews (total now ${existingCount + docs.length})`);
    }
  }

  console.log(`🎉 Done. Created ${totalCreated} new reviews.`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('❌ Seeding failed:', err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
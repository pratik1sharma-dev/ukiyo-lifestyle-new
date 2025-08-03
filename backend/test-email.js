require('dotenv').config({ path: '.env.local' });
const emailService = require('./services/emailService');

// Test order data
const testOrder = {
  orderNumber: 'TEST001',
  email: 'test@example.com',
  items: [
    {
      productName: 'Test Product',
      productImage: 'https://via.placeholder.com/60x60',
      quantity: 1,
      totalPrice: 1000
    }
  ],
  orderStatus: 'pending',
  paymentMethod: 'razorpay',
  pricing: {
    total: 1000
  },
  shippingAddress: {
    firstName: 'Test',
    lastName: 'User',
    street: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+91-9876543210'
  },
  createdAt: new Date()
};

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  try {
    // Test email connection
    console.log('1. Testing email connection...');
    const isConnected = await emailService.verifyConnection();
    
    if (!isConnected) {
      console.error('❌ Email service connection failed');
      console.log('\n📧 Email Configuration Check:');
      console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE);
      console.log('EMAIL_USER:', process.env.EMAIL_USER);
      console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '***SET***' : '❌ NOT SET');
      console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
      
      console.log('\n🔧 To fix this:');
      console.log('1. Update EMAIL_USER in backend/env.local');
      console.log('2. Generate Gmail App Password and update EMAIL_PASSWORD');
      console.log('3. Update ADMIN_EMAIL if needed');
      return;
    }
    
    console.log('✅ Email service connected successfully');
    
    // Test admin notification
    console.log('\n2. Testing admin notification...');
    await emailService.sendAdminOrderNotification(testOrder);
    console.log('✅ Admin notification test completed');
    
    console.log('\n🎉 Email service is working correctly!');
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if Gmail App Password is correct');
    console.log('2. Ensure 2-Step Verification is enabled on Gmail');
    console.log('3. Verify EMAIL_USER and ADMIN_EMAIL are correct');
  }
}

// Run the test
testEmailService(); 
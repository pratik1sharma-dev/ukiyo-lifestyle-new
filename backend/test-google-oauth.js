require('dotenv').config({ path: 'env.local' });
const User = require('./models/User');
const authService = require('./services/authService');

async function testGoogleOAuth() {
  console.log('🧪 Testing Google OAuth Configuration...');
  
  try {
    // Test 1: Check environment variables
    console.log('\n1. Checking environment variables...');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ SET' : '❌ NOT SET');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ SET' : '❌ NOT SET');
    
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('❌ GOOGLE_CLIENT_ID is not set in environment variables');
      return;
    }

    // Test 2: Test User model validation for Google OAuth
    console.log('\n2. Testing User model validation...');
    
    // Test creating a user without password (Google OAuth user)
    const googleUser = new User({
      googleId: 'test_google_id_123',
      email: 'test-google@example.com',
      firstName: 'Test',
      lastName: 'Google',
      profilePicture: 'https://example.com/avatar.jpg',
      emailVerified: true,
      role: 'customer',
      isActive: true,
      phone: '+91' + Date.now().toString().slice(-10)
    });

    try {
      await googleUser.save();
      console.log('✅ Google OAuth user created successfully (no password required)');
      
      // Clean up test user
      await User.findByIdAndDelete(googleUser._id);
      console.log('✅ Test user cleaned up');
    } catch (userError) {
      console.error('❌ Failed to create Google OAuth user:', userError.message);
    }

    // Test 3: Test creating a regular user with password
    console.log('\n3. Testing regular user validation...');
    
    const regularUser = new User({
      email: 'test-regular@example.com',
      firstName: 'Test',
      lastName: 'Regular',
      password: 'password123',
      phone: '+91' + Date.now().toString().slice(-10),
      role: 'customer',
      isActive: true
    });

    try {
      await regularUser.save();
      console.log('✅ Regular user created successfully (password required)');
      
      // Clean up test user
      await User.findByIdAndDelete(regularUser._id);
      console.log('✅ Test user cleaned up');
    } catch (userError) {
      console.error('❌ Failed to create regular user:', userError.message);
    }

    // Test 4: Test authService Google OAuth client
    console.log('\n4. Testing Google OAuth client...');
    try {
      // This will test if the Google client can be initialized
      const { OAuth2Client } = require('google-auth-library');
      const testClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      console.log('✅ Google OAuth client initialized successfully');
    } catch (clientError) {
      console.error('❌ Failed to initialize Google OAuth client:', clientError.message);
    }

    console.log('\n🎉 Google OAuth configuration test completed!');
    
  } catch (error) {
    console.error('❌ Google OAuth test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if GOOGLE_CLIENT_ID is set correctly');
    console.log('2. Verify the Google OAuth credentials in Google Cloud Console');
    console.log('3. Ensure the User model validation is working correctly');
  }
}

// Run the test
testGoogleOAuth(); 
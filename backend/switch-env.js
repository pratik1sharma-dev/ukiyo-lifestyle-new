#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envFiles = {
  local: 'env.local',
  atlas: 'env.atlas'
};

const targetFile = '.env.local';

function switchEnvironment(env) {
  if (!envFiles[env]) {
    console.error(`❌ Invalid environment: ${env}`);
    console.log('Available environments: local, atlas');
    process.exit(1);
  }

  const sourceFile = envFiles[env];
  const sourcePath = path.join(__dirname, sourceFile);
  const targetPath = path.join(__dirname, targetFile);

  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source file not found: ${sourceFile}`);
    process.exit(1);
  }

  try {
    // Copy the source file to .env.local
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Switched to ${env} environment`);
    console.log(`📁 Using: ${sourceFile} → ${targetFile}`);
    
    // Show the current MongoDB URI (masked)
    const content = fs.readFileSync(targetPath, 'utf8');
    const mongoUriLine = content.split('\n').find(line => line.startsWith('MONGODB_URI='));
    if (mongoUriLine) {
      const uri = mongoUriLine.split('=')[1];
      if (uri.includes('mongodb+srv://')) {
        console.log('🌐 Database: MongoDB Atlas (Cloud)');
      } else {
        console.log('💻 Database: Local MongoDB');
      }
    }
  } catch (error) {
    console.error(`❌ Error switching environment: ${error.message}`);
    process.exit(1);
  }
}

// Get environment from command line argument
const env = process.argv[2];

if (!env) {
  console.log('🔧 Environment Switcher for Ukiyo Lifestyle');
  console.log('');
  console.log('Usage: node switch-env.js <environment>');
  console.log('');
  console.log('Environments:');
  console.log('  local  - Use local MongoDB database');
  console.log('  atlas  - Use MongoDB Atlas cloud database');
  console.log('');
  console.log('Examples:');
  console.log('  node switch-env.js local');
  console.log('  node switch-env.js atlas');
  process.exit(0);
}

switchEnvironment(env); 
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function findFiles(dir, extensions = []) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.length === 0 || extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

function checkDuplicates() {
  log('🔍 Checking for duplicate files...', 'blue');
  
  const frontendDir = path.join(__dirname, '..', 'frontend', 'src');
  const backendDir = path.join(__dirname, '..', 'backend');
  
  let hasDuplicates = false;
  
  // Check frontend for .jsx files (should be .tsx)
  const jsxFiles = findFiles(frontendDir, ['.jsx']);
  if (jsxFiles.length > 0) {
    log('❌ Found .jsx files in frontend (should be .tsx):', 'red');
    jsxFiles.forEach(file => log(`   ${file}`, 'red'));
    hasDuplicates = true;
  }
  
  // Check for duplicate .js and .ts files
  const jsFiles = findFiles(frontendDir, ['.js']);
  const tsFiles = findFiles(frontendDir, ['.ts', '.tsx']);
  
  const jsBaseNames = jsFiles.map(f => path.basename(f, '.js'));
  const tsBaseNames = tsFiles.map(f => path.basename(f, path.extname(f)));
  
  const duplicates = jsBaseNames.filter(name => tsBaseNames.includes(name));
  
  if (duplicates.length > 0) {
    log('❌ Found duplicate files (both .js and .ts versions):', 'red');
    duplicates.forEach(name => {
      log(`   ${name}.js and ${name}.ts`, 'red');
    });
    hasDuplicates = true;
  }
  
  // Check for forbidden .js files in frontend
  const forbiddenJsFiles = jsFiles.filter(f => {
    const basename = path.basename(f);
    return !basename.includes('config') && !basename.includes('setup');
  });
  
  if (forbiddenJsFiles.length > 0) {
    log('❌ Found .js files in frontend (should be .ts):', 'red');
    forbiddenJsFiles.forEach(file => log(`   ${file}`, 'red'));
    hasDuplicates = true;
  }
  
  if (!hasDuplicates) {
    log('✅ No duplicate files found!', 'green');
  }
  
  return !hasDuplicates;
}

function checkTypeScriptCompliance() {
  log('🔍 Checking TypeScript compliance...', 'blue');
  
  const frontendDir = path.join(__dirname, '..', 'frontend', 'src');
  const tsFiles = findFiles(frontendDir, ['.ts', '.tsx']);
  
  let hasIssues = false;
  
  // Check for React imports in .ts files (should be .tsx)
  for (const file of tsFiles) {
    if (path.extname(file) === '.ts' && !file.includes('types/') && !file.includes('store/')) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('import React') || content.includes('from \'react\'')) {
        log(`❌ React imports found in .ts file (should be .tsx): ${file}`, 'red');
        hasIssues = true;
      }
    }
  }
  
  if (!hasIssues) {
    log('✅ TypeScript compliance check passed!', 'green');
  }
  
  return !hasIssues;
}

function checkDocumentationDuplicates() {
  log('🔍 Checking documentation for duplicates...', 'blue');
  
  const rootDir = path.join(__dirname, '..');
  const readmeFiles = findFiles(rootDir, ['.md']).filter(f => 
    path.basename(f).toLowerCase().includes('readme')
  );
  
  if (readmeFiles.length > 1) {
    log('❌ Multiple README files found:', 'red');
    readmeFiles.forEach(file => log(`   ${file}`, 'red'));
    log('   Keep only the main README.md file', 'yellow');
    return false;
  }
  
  log('✅ No documentation duplicates found!', 'green');
  return true;
}

function main() {
  log('🚀 Ukiyo Lifestyle - Duplicate File Checker', 'blue');
  log('==========================================', 'blue');
  
  const checks = [
    checkDuplicates,
    checkTypeScriptCompliance,
    checkDocumentationDuplicates
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const passed = check();
    if (!passed) {
      allPassed = false;
    }
    console.log('');
  }
  
  if (allPassed) {
    log('🎉 All checks passed! Project is clean and compliant.', 'green');
    process.exit(0);
  } else {
    log('❌ Some checks failed. Please fix the issues above.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDuplicates,
  checkTypeScriptCompliance,
  checkDocumentationDuplicates
}; 
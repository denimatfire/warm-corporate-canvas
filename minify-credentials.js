#!/usr/bin/env node

/**
 * Script to minify Google Service Account credentials JSON for environment variables
 * 
 * Usage:
 * 1. Save your downloaded service account JSON as 'credentials.json' in this directory
 * 2. Run: node minify-credentials.js
 * 3. Copy the output to your .env file
 */

const fs = require('fs');
const path = require('path');

try {
  // Read the credentials file
  const credentialsPath = path.join(__dirname, 'credentials.json');
  
  if (!fs.existsSync(credentialsPath)) {
    console.log('❌ credentials.json not found!');
    console.log('');
    console.log('📋 To use this script:');
    console.log('1. Download your service account JSON from Google Cloud Console');
    console.log('2. Save it as "credentials.json" in this directory');
    console.log('3. Run this script again');
    console.log('');
    console.log('🔗 Or manually minify your JSON:');
    console.log('- Remove all line breaks and extra spaces');
    console.log('- Put everything on one line');
    console.log('- Add to your .env file as VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS');
    process.exit(1);
  }

  const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  
  // Validate required fields
  const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
  const missingFields = requiredFields.filter(field => !credentials[field]);
  
  if (missingFields.length > 0) {
    console.log('❌ Invalid credentials file. Missing required fields:');
    missingFields.forEach(field => console.log(`   - ${field}`));
    process.exit(1);
  }

  // Minify the JSON (remove all whitespace and newlines)
  const minifiedCredentials = JSON.stringify(credentials);
  
  console.log('✅ Credentials minified successfully!');
  console.log('');
  console.log('📋 Add this to your .env file:');
  console.log('');
  console.log('VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=' + minifiedCredentials);
  console.log('');
  console.log('📊 Credentials summary:');
  console.log(`   Project ID: ${credentials.project_id}`);
  console.log(`   Client Email: ${credentials.client_email}`);
  console.log(`   Private Key ID: ${credentials.private_key_id}`);
  console.log(`   Minified length: ${minifiedCredentials.length} characters`);
  console.log('');
  console.log('⚠️  Important:');
  console.log('   - Never commit your .env file to git');
  console.log('   - Keep your credentials secure');
  console.log('   - The minified JSON should be on a single line');

} catch (error) {
  console.error('❌ Error processing credentials:', error.message);
  
  if (error.message.includes('Unexpected token')) {
    console.log('');
    console.log('💡 This usually means the JSON file is malformed.');
    console.log('   Check that the file contains valid JSON.');
  }
  
  process.exit(1);
}

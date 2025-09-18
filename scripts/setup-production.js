#!/usr/bin/env node

/**
 * Production Setup Helper
 * 
 * This script helps you set up production Supabase integration
 * by guiding you through the process and making the necessary changes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const setupProduction = () => {
  console.log('🚀 PRODUCTION SUPABASE SETUP HELPER');
  console.log('===================================\n');
  
  console.log('This script will help you set up production Supabase integration.\n');
  
  // Check current status
  console.log('📋 CURRENT STATUS:');
  console.log('-----------------');
  
  // Check if .env exists
  const envPath = path.join(__dirname, '../.env');
  const hasEnv = fs.existsSync(envPath);
  console.log(`✓ .env file: ${hasEnv ? '✅ Found' : '❌ Missing'}`);
  
  // Check environment variables
  const hasSupabaseUrl = !!process.env.SUPABASE_URL;
  const hasSupabaseKey = !!process.env.SUPABASE_ANON_KEY;
  console.log(`✓ SUPABASE_URL: ${hasSupabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`✓ SUPABASE_ANON_KEY: ${hasSupabaseKey ? '✅ Set' : '❌ Missing'}`);
  
  // Check if Supabase integration is enabled
  const supabaseIntegrationPath = path.join(__dirname, 'supabase-integration.js');
  const supabaseContent = fs.readFileSync(supabaseIntegrationPath, 'utf8');
  const isProductionReady = !supabaseContent.includes('// Simulated data for now');
  console.log(`✓ Production integration: ${isProductionReady ? '✅ Enabled' : '❌ Using simulated data'}`);
  
  console.log('\n🛠️ SETUP STEPS:');
  console.log('---------------');
  
  if (!hasEnv) {
    console.log('1. CREATE .env FILE:');
    console.log('   Create a .env file in your project root with:');
    console.log('   ```');
    console.log('   VITE_SUPABASE_URL=your_supabase_project_url');
    console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
    console.log('   SUPABASE_URL=your_supabase_project_url');
    console.log('   SUPABASE_ANON_KEY=your_supabase_anon_key');
    console.log('   ```\n');
  }
  
  if (!hasSupabaseUrl || !hasSupabaseKey) {
    console.log('2. SET ENVIRONMENT VARIABLES:');
    console.log('   Get your Supabase credentials:');
    console.log('   • Go to your Supabase dashboard');
    console.log('   • Select your project');
    console.log('   • Go to Settings → API');
    console.log('   • Copy Project URL and anon/public key');
    console.log('   • Add them to your .env file\n');
  }
  
  if (!isProductionReady) {
    console.log('3. ENABLE PRODUCTION INTEGRATION:');
    console.log('   Run this command to automatically update the integration:');
    console.log('   ```');
    console.log('   node scripts/enable-production.js');
    console.log('   ```\n');
  }
  
  console.log('4. VERIFY YOUR DATABASE SCHEMA:');
  console.log('   Make sure your Supabase tables have the required columns:');
  console.log('   • Articles: id, title, excerpt, cover_image, author, published_at, tags, status');
  console.log('   • Photos: id, title, caption, image_url, category, tags, is_published');
  console.log('   • Projects: id, slug, title, description, cover_image, tags, status\n');
  
  console.log('5. TEST THE INTEGRATION:');
  console.log('   ```');
  console.log('   npm run meta:supabase');
  console.log('   npm run build:production');
  console.log('   ```\n');
  
  console.log('📚 DETAILED INSTRUCTIONS:');
  console.log('-------------------------');
  console.log('See SUPABASE_PRODUCTION_SETUP.md for complete step-by-step guide.\n');
  
  console.log('🆘 NEED HELP?');
  console.log('-------------');
  console.log('If you encounter issues:');
  console.log('1. Check the console output for specific error messages');
  console.log('2. Verify your Supabase permissions and RLS policies');
  console.log('3. Ensure your database has published content to fetch');
  console.log('4. Test your Supabase connection with a simple query\n');
  
  // Show next actions based on current status
  if (!hasEnv || !hasSupabaseUrl || !hasSupabaseKey) {
    console.log('🎯 NEXT ACTION: Set up environment variables first');
  } else if (!isProductionReady) {
    console.log('🎯 NEXT ACTION: Enable production integration');
  } else {
    console.log('🎯 NEXT ACTION: Test with npm run meta:supabase');
  }
};

setupProduction();

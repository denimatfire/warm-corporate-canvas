#!/usr/bin/env node

/**
 * Enable Production Integration
 * 
 * This script automatically updates the supabase-integration.js file
 * to use real Supabase queries instead of simulated data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enableProductionIntegration = () => {
  console.log('🔧 ENABLING PRODUCTION SUPABASE INTEGRATION');
  console.log('==========================================\n');
  
  const supabaseIntegrationPath = path.join(__dirname, 'supabase-integration.js');
  
  if (!fs.existsSync(supabaseIntegrationPath)) {
    console.error('❌ supabase-integration.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(supabaseIntegrationPath, 'utf8');
  let changes = 0;
  
  // 1. Enable Supabase client initialization
  console.log('1. Enabling Supabase client initialization...');
  const oldInitPattern = /\/\*\s*const { createClient }[\s\S]*?\*\/\s*console\.log\('🔗 Supabase client initialized \(simulated\)'\);\s*return null; \/\/ Simulated for now/;
  const newInit = `const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log('🔗 Supabase client initialized');
    return supabase;`;
  
  if (oldInitPattern.test(content)) {
    content = content.replace(oldInitPattern, newInit);
    changes++;
    console.log('   ✅ Supabase client initialization enabled');
  } else {
    console.log('   ⚠️  Supabase client already enabled or pattern not found');
  }
  
  // 2. Enable articles query
  console.log('2. Enabling articles database query...');
  const articlesPattern = /\/\*\s*const { data, error } = await supabase[\s\S]*?return data\.map[\s\S]*?\}\);[\s\S]*?\*\/\s*\/\/ Simulated data for now[\s\S]*?return \[[\s\S]*?\];/;
  const newArticlesQuery = `const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      coverImage: article.cover_image,
      author: article.author,
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      tags: article.tags,
      readTime: article.read_time,
      category: article.category
    }));`;
  
  if (articlesPattern.test(content)) {
    content = content.replace(articlesPattern, newArticlesQuery);
    changes++;
    console.log('   ✅ Articles query enabled');
  } else {
    console.log('   ⚠️  Articles query already enabled or pattern not found');
  }
  
  // 3. Enable photos query
  console.log('3. Enabling photos database query...');
  const photosPattern = /\/\*\s*const { data, error } = await supabase[\s\S]*?\.from\('photos'\)[\s\S]*?return data\.map[\s\S]*?\}\);[\s\S]*?\*\/\s*\/\/ Simulated data for now[\s\S]*?return \[[\s\S]*?\];/;
  const newPhotosQuery = `const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(photo => ({
      id: photo.id,
      title: photo.title,
      caption: photo.caption,
      imageUrl: photo.image_url,
      category: photo.category,
      tags: photo.tags,
      publishedAt: photo.published_at,
      location: photo.metadata?.location
    }));`;
  
  if (photosPattern.test(content)) {
    content = content.replace(photosPattern, newPhotosQuery);
    changes++;
    console.log('   ✅ Photos query enabled');
  } else {
    console.log('   ⚠️  Photos query already enabled or pattern not found');
  }
  
  // 4. Enable projects query
  console.log('4. Enabling projects database query...');
  const projectsPattern = /\/\*\s*const { data, error } = await supabase[\s\S]*?\.from\('projects'\)[\s\S]*?return data\.map[\s\S]*?\}\);[\s\S]*?\*\/\s*\/\/ Simulated data for now[\s\S]*?return \[[\s\S]*?\];/;
  const newProjectsQuery = `const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(project => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      coverImage: project.cover_image,
      tags: project.tags,
      category: project.category,
      publishedAt: project.published_at,
      presentationType: project.presentation_type
    }));`;
  
  if (projectsPattern.test(content)) {
    content = content.replace(projectsPattern, newProjectsQuery);
    changes++;
    console.log('   ✅ Projects query enabled');
  } else {
    console.log('   ⚠️  Projects query already enabled or pattern not found');
  }
  
  // Save the updated file
  if (changes > 0) {
    fs.writeFileSync(supabaseIntegrationPath, content);
    console.log(`\n🎉 SUCCESS! Made ${changes} changes to enable production integration.`);
    console.log('\n📋 WHAT WAS CHANGED:');
    console.log('• Enabled real Supabase client initialization');
    console.log('• Replaced simulated data with actual database queries');
    console.log('• Connected to your articles, photos, and projects tables');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Make sure your .env file has SUPABASE_URL and SUPABASE_ANON_KEY');
    console.log('2. Test the integration: npm run meta:supabase');
    console.log('3. Generate production meta tags: npm run build:production');
    
    return true;
  } else {
    console.log('\n⚠️  No changes made. Production integration may already be enabled.');
    console.log('Check your supabase-integration.js file manually if needed.');
    return false;
  }
};

// Run the function
const success = enableProductionIntegration();
process.exit(success ? 0 : 1);

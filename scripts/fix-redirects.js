#!/usr/bin/env node

/**
 * Fix Netlify Redirects for Meta Tags
 * 
 * This script creates the proper _redirects configuration to ensure
 * social media crawlers can access the static HTML meta tag files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProperRedirects = () => {
  console.log('🔧 FIXING NETLIFY REDIRECTS FOR META TAGS');
  console.log('=========================================\n');
  
  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');
  
  // Scan for generated HTML files
  const htmlFiles = [];
  
  // Check article files
  const articleDir = path.join(distDir, 'article');
  if (fs.existsSync(articleDir)) {
    const articleFiles = fs.readdirSync(articleDir).filter(f => f.endsWith('.html'));
    articleFiles.forEach(file => {
      const slug = file.replace('.html', '');
      htmlFiles.push({
        path: `/article/${slug}`,
        file: `/article/${file}`,
        type: 'article'
      });
    });
  }
  
  // Check photo files
  const photosDir = path.join(distDir, 'photos');
  if (fs.existsSync(photosDir)) {
    const photoFiles = fs.readdirSync(photosDir).filter(f => f.endsWith('.html'));
    photoFiles.forEach(file => {
      const slug = file.replace('.html', '');
      htmlFiles.push({
        path: `/photos/${slug}`,
        file: `/photos/${file}`,
        type: 'photo'
      });
    });
  }
  
  // Check project files
  const projectsDir = path.join(distDir, 'projects');
  if (fs.existsSync(projectsDir)) {
    const projectFiles = fs.readdirSync(projectsDir).filter(f => f.endsWith('.html'));
    projectFiles.forEach(file => {
      const slug = file.replace('.html', '');
      htmlFiles.push({
        path: `/projects/${slug}`,
        file: `/projects/${file}`,
        type: 'project'
      });
    });
  }
  
  console.log(`📁 Found ${htmlFiles.length} static HTML files:`);
  htmlFiles.forEach(file => {
    console.log(`   ${file.type}: ${file.path} → ${file.file}`);
  });
  
  // Create the new _redirects content
  let redirectsContent = `# Netlify Redirects Configuration for Meta Tags
# This ensures social media crawlers get the static HTML files with proper meta tags

# Static HTML files for social media crawlers (with User-Agent detection)
`;

  // Add redirects for each HTML file with crawler detection
  htmlFiles.forEach(file => {
    redirectsContent += `${file.path}  ${file.file}  200!  Condition=User-Agent:*bot*,*crawler*,*spider*,*facebook*,*twitter*,*linkedin*,*whatsapp*,*telegram*\n`;
  });
  
  redirectsContent += `
# Fallback: All other requests go to React SPA
/*  /index.html  200
`;

  // Write to both public and dist directories
  const publicRedirectsPath = path.join(publicDir, '_redirects');
  const distRedirectsPath = path.join(distDir, '_redirects');
  
  fs.writeFileSync(publicRedirectsPath, redirectsContent);
  fs.writeFileSync(distRedirectsPath, redirectsContent);
  
  console.log('\n✅ REDIRECTS CONFIGURATION UPDATED:');
  console.log('----------------------------------');
  console.log('✓ Social media crawlers → Static HTML files (with meta tags)');
  console.log('✓ Regular users → React SPA');
  console.log('✓ Updated both public/_redirects and dist/_redirects');
  
  console.log('\n📋 WHAT THIS DOES:');
  console.log('------------------');
  console.log('• Facebook/Twitter/LinkedIn bots → Get optimized HTML files');
  console.log('• Google/search engine bots → Get optimized HTML files');
  console.log('• Regular users → Get your React application');
  console.log('• Best of both worlds: SEO + SPA experience');
  
  console.log('\n🚀 NEXT STEPS:');
  console.log('-------------');
  console.log('1. Deploy your site to Netlify');
  console.log('2. Test with social media validators');
  console.log('3. The crawlers should now see the proper meta tags');
  
  console.log('\n🧪 TEST THESE URLS:');
  console.log('------------------');
  htmlFiles.slice(0, 3).forEach(file => {
    console.log(`https://your-domain.netlify.app${file.path}`);
  });
  
  return htmlFiles.length;
};

// Run the fix
const filesProcessed = createProperRedirects();
console.log(`\n🎉 Successfully configured redirects for ${filesProcessed} files!`);

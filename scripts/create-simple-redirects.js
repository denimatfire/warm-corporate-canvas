#!/usr/bin/env node

/**
 * Create Simple Redirects
 * 
 * This creates a simple _redirects file that serves the prerendered HTML pages
 * directly for specific routes, without complex User-Agent detection.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createSimpleRedirects = () => {
  console.log('🔧 CREATING SIMPLE REDIRECTS CONFIGURATION');
  console.log('==========================================\n');
  
  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');
  
  // Find all HTML files
  const routes = [];
  
  // Scan for generated HTML files
  ['article', 'photos', 'projects'].forEach(contentType => {
    const contentDir = path.join(distDir, contentType);
    if (fs.existsSync(contentDir)) {
      const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const slug = file.replace('.html', '');
        routes.push({
          path: `/${contentType}/${slug}`,
          file: `/${contentType}/${file}`
        });
      });
    }
  });
  
  console.log(`📁 Found ${routes.length} routes to configure:`);
  routes.forEach(route => {
    console.log(`   ${route.path} → ${route.file}`);
  });
  
  // Create simple redirects configuration
  let redirectsContent = `# Simple Redirects for Social Media Meta Tags
# Direct serving of HTML files for specific routes

`;

  // Add direct routes for each HTML file
  routes.forEach(route => {
    redirectsContent += `${route.path}  ${route.file}  200\n`;
  });
  
  redirectsContent += `
# Fallback: All other requests go to React SPA
/*  /index.html  200
`;

  // Write to both directories
  const publicRedirectsPath = path.join(publicDir, '_redirects');
  const distRedirectsPath = path.join(distDir, '_redirects');
  
  fs.writeFileSync(publicRedirectsPath, redirectsContent);
  fs.writeFileSync(distRedirectsPath, redirectsContent);
  
  console.log('\n✅ SIMPLE REDIRECTS CREATED:');
  console.log('----------------------------');
  console.log('✓ Direct HTML serving for content routes');
  console.log('✓ React SPA for all other routes');
  console.log('✓ No complex User-Agent detection needed');
  
  console.log('\n🎯 HOW THIS WORKS:');
  console.log('------------------');
  console.log('• /article/gate-exam → Serves prerendered HTML with meta tags');
  console.log('• /photos/sunset → Serves prerendered HTML with meta tags');
  console.log('• /projects/portfolio → Serves prerendered HTML with meta tags');
  console.log('• Everything else → React SPA');
  
  return routes.length;
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const routeCount = createSimpleRedirects();
  console.log(`\n🎉 Successfully configured ${routeCount} routes!`);
}

export { createSimpleRedirects };

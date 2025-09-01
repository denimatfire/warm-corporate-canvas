#!/usr/bin/env node

/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml based on current content
 * 
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Base URL for the website
const BASE_URL = 'https://dasdhrubajyoti.netlify.app';

// Static pages configuration
const STATIC_PAGES = [
  {
    url: '/',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/writing',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/photos',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

// Function to generate XML sitemap
function generateSitemap(staticPages, dynamicPages = []) {
  const allPages = [...staticPages, ...dynamicPages];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
`;

  allPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;
    
    // Add image information if available
    if (page.image) {
      sitemap += `
    <image:image>
      <image:loc>${page.image}</image:loc>
      <image:title>${page.title || ''}</image:title>
      <image:caption>${page.description || ''}</image:caption>
    </image:image>`;
    }
    
    sitemap += `
  </url>
`;
  });

  sitemap += `</urlset>`;
  
  return sitemap;
}

// Function to fetch dynamic content (articles, photos)
async function fetchDynamicContent() {
  const dynamicPages = [];
  
  try {
    // In a real implementation, you would fetch from your API
    // For now, we'll return an empty array
    // This could be expanded to fetch from Supabase or your content API
    
    console.log('Fetching dynamic content...');
    
    // Example structure for dynamic pages:
    // const articles = await fetchArticles();
    // const photos = await fetchPhotos();
    
    // articles.forEach(article => {
    //   dynamicPages.push({
    //     url: `/article/${article.id}`,
    //     priority: '0.7',
    //     changefreq: 'monthly',
    //     lastmod: article.updated_at.split('T')[0],
    //     image: article.cover_image,
    //     title: article.title,
    //     description: article.excerpt
    //   });
    // });
    
    console.log(`Found ${dynamicPages.length} dynamic pages`);
    
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
  }
  
  return dynamicPages;
}

// Main function
async function main() {
  try {
    console.log('Generating sitemap...');
    
    // Fetch dynamic content
    const dynamicPages = await fetchDynamicContent();
    
    // Generate sitemap
    const sitemap = generateSitemap(STATIC_PAGES, dynamicPages);
    
    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    
    console.log(`Sitemap generated successfully at ${outputPath}`);
    console.log(`Total pages: ${STATIC_PAGES.length + dynamicPages.length}`);
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSitemap,
  fetchDynamicContent,
  STATIC_PAGES
};

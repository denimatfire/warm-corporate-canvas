#!/usr/bin/env node

/**
 * Enhanced Meta Tag Injection Script for Social Media Crawlers
 * 
 * This script creates static HTML files with proper meta tags for:
 * - Articles, Photos, and Projects
 * - Integrates with existing data sources and APIs
 * - Generates optimized meta tags for all content types
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runDataIntegration } from './data-integration.js';
import { 
  generateHtmlTemplate, 
  generateArticleMetaData, 
  generatePhotoMetaData, 
  generateProjectMetaData 
} from './generate-dynamic-meta-tags.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load integrated content data
 */
const loadContentData = async () => {
  const dataPath = path.join(__dirname, 'integrated-content-data.json');
  
  try {
    // Try to load existing integrated data
    if (fs.existsSync(dataPath)) {
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      // Check if data is recent (less than 1 hour old)
      const lastUpdated = new Date(data.lastUpdated);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
      
      if (hoursSinceUpdate < 1) {
        console.log('📚 Using cached content data...');
        return data;
      }
    }
    
    // Data doesn't exist or is stale, run integration
    console.log('🔄 Refreshing content data...');
    return await runDataIntegration();
    
  } catch (error) {
    console.error('Error loading content data:', error);
    // Fallback to sample data
    return {
      articles: [{
        id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
        title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
        excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time.',
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=entropy&auto=format',
        author: 'Dhrubajyoti Das',
        publishedAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        tags: ['GATE exam', 'engineering', 'study strategy'],
        readTime: 8,
        category: 'Education'
      }],
      photos: [],
      projects: []
    };
  }
};

/**
 * Enhanced static file generation using the new dynamic system
 */
const generateStaticFiles = async () => {
  try {
    console.log('🚀 Loading content data...\n');
    const contentData = await loadContentData();
    
    const distDir = path.join(__dirname, '../dist');
    
    // Ensure directories exist
    const directories = ['article', 'photos', 'projects'];
    directories.forEach(dir => {
      const fullPath = path.join(distDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });

    let totalGenerated = 0;

    // Generate article pages
    if (contentData.articles && contentData.articles.length > 0) {
      contentData.articles.forEach(article => {
        const metaData = generateArticleMetaData(article);
        const html = generateHtmlTemplate(metaData, 'article');
        const filePath = path.join(distDir, 'article', `${article.id}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Generated article: ${article.title}`);
        totalGenerated++;
      });
    }

    // Generate photo pages
    if (contentData.photos && contentData.photos.length > 0) {
      contentData.photos.forEach(photo => {
        const metaData = generatePhotoMetaData(photo);
        const html = generateHtmlTemplate(metaData, 'photo');
        const filePath = path.join(distDir, 'photos', `${photo.id}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Generated photo: ${photo.title}`);
        totalGenerated++;
      });
    }

    // Generate project pages
    if (contentData.projects && contentData.projects.length > 0) {
      contentData.projects.forEach(project => {
        const metaData = generateProjectMetaData(project);
        const html = generateHtmlTemplate(metaData, 'project');
        const filePath = path.join(distDir, 'projects', `${project.slug}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Generated project: ${project.title}`);
        totalGenerated++;
      });
    }

    console.log(`\n🎉 Successfully generated ${totalGenerated} pages with dynamic meta tags!`);
    console.log('\n📊 Generation summary:');
    console.log(`   Articles: ${contentData.articles?.length || 0}`);
    console.log(`   Photos: ${contentData.photos?.length || 0}`);
    console.log(`   Projects: ${contentData.projects?.length || 0}`);
    console.log(`   Total: ${totalGenerated}`);
    
    console.log('\n📋 Next steps:');
    console.log('1. Deploy to Netlify');
    console.log('2. Test with social media validators:');
    console.log('   - Facebook: https://developers.facebook.com/tools/debug/');
    console.log('   - Twitter: https://cards-dev.twitter.com/validator');
    console.log('   - LinkedIn: https://www.linkedin.com/post-inspector/');
    console.log('3. Verify meta tags are working correctly');
    
    return { totalGenerated, contentData };
    
  } catch (error) {
    console.error('❌ Failed to generate static files:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    console.log('🚀 Starting enhanced meta tag generation...\n');
    await generateStaticFiles();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
};

// Run the script
main();

export { generateStaticFiles, loadContentData };

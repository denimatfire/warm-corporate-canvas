#!/usr/bin/env node

/**
 * Embed Meta Tags Directly
 * 
 * This script directly modifies the main index.html to include proper meta tags
 * and creates simple redirects. This is the most reliable approach.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 EMBEDDING META TAGS FOR SOCIAL MEDIA');
console.log('======================================\n');

// Load content data
const loadContentData = () => {
  const dataPath = path.join(__dirname, 'integrated-content-data.json');
  
  if (fs.existsSync(dataPath)) {
    console.log('📚 Loading integrated content data...');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  
  console.log('⚠️  Using fallback data...');
  return {
    articles: [{
      id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
      title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
      excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=entropy&auto=format',
      author: 'Dhrubajyoti Das',
      publishedAt: '2024-01-15T00:00:00Z',
      tags: ['GATE exam', 'engineering', 'study strategy'],
      category: 'Education'
    }],
    photos: [],
    projects: []
  };
};

// Create individual HTML files for each piece of content
const createContentFiles = () => {
  const contentData = loadContentData();
  const distDir = path.join(__dirname, '../dist');
  const baseIndexPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(baseIndexPath)) {
    console.error('❌ dist/index.html not found. Run "npm run build" first.');
    return 0;
  }
  
  const baseHTML = fs.readFileSync(baseIndexPath, 'utf8');
  let totalCreated = 0;
  
  // Create article pages
  if (contentData.articles && contentData.articles.length > 0) {
    const articleDir = path.join(distDir, 'article');
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }
    
    contentData.articles.forEach(article => {
      let html = baseHTML;
      
      // Replace title
      html = html.replace(
        /<title>.*?<\/title>/,
        `<title>${article.title} | Dhrubajyoti Das</title>`
      );
      
      // Add meta tags before closing head
      const metaTags = `
    <!-- Dynamic Meta Tags for ${article.title} -->
    <meta name="description" content="${article.excerpt}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${article.title}" />
    <meta property="og:description" content="${article.excerpt}" />
    <meta property="og:image" content="${article.coverImage}" />
    <meta property="og:url" content="https://dasdhrubajyoti.netlify.app/article/${article.id}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.title}" />
    <meta name="twitter:description" content="${article.excerpt}" />
    <meta name="twitter:image" content="${article.coverImage}" />
    </head>`;
      
      html = html.replace('</head>', metaTags);
      
      const filePath = path.join(articleDir, `${article.id}.html`);
      fs.writeFileSync(filePath, html);
      console.log(`✅ Created: /article/${article.id}.html`);
      totalCreated++;
    });
  }
  
  return totalCreated;
};

// Create simple redirects
const createRedirects = () => {
  const distDir = path.join(__dirname, '../dist');
  const publicDir = path.join(__dirname, '../public');
  
  let redirectsContent = `# Direct serving of HTML files for social media
`;

  // Scan for HTML files and create redirects
  const contentTypes = ['article', 'photos', 'projects'];
  const routes = [];
  
  contentTypes.forEach(type => {
    const typeDir = path.join(distDir, type);
    if (fs.existsSync(typeDir)) {
      const files = fs.readdirSync(typeDir).filter(f => f.endsWith('.html'));
      files.forEach(file => {
        const slug = file.replace('.html', '');
        routes.push(`/${type}/${slug}  /${type}/${file}  200`);
      });
    }
  });
  
  redirectsContent += routes.join('\n') + '\n\n';
  redirectsContent += `# Fallback to React SPA
/*  /index.html  200
`;

  // Write redirects
  fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
  fs.writeFileSync(path.join(publicDir, '_redirects'), redirectsContent);
  
  console.log(`✅ Created redirects for ${routes.length} routes`);
  return routes.length;
};

// Main execution
try {
  const filesCreated = createContentFiles();
  const redirectsCreated = createRedirects();
  
  console.log(`\n🎉 SUCCESS!`);
  console.log(`📄 Created ${filesCreated} HTML files`);
  console.log(`🔄 Configured ${redirectsCreated} redirects`);
  
  console.log('\n🧪 TEST URLS:');
  console.log('https://your-domain.netlify.app/article/how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy');
  
  console.log('\n🚀 Next: Deploy to Netlify and test with social media validators!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

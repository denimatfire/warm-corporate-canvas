#!/usr/bin/env node

/**
 * Meta Tag Injection Script for Social Media Crawlers
 * 
 * This script creates static HTML files with proper meta tags for articles
 * to ensure social media crawlers can read the correct meta information.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulated article data - in production, this would come from your database/API
const articles = [
  {
    id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
    title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
    excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time.',
    cover_image: 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/gate-exam-strategy.jpg',
    author: 'Dhrubajyoti Das',
    published_at: '2024-01-15',
    tags: ['education', 'strategy', 'gate-exam', 'engineering']
  }
  // Add more articles here as needed
];

// Base HTML template
const getBaseHTML = () => {
  return fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
};

// Generate article-specific HTML
const generateArticleHTML = (article) => {
  let html = getBaseHTML();
  
  // Replace meta tags for the specific article
  const metaReplacements = {
    // Title
    '<title>Dhrubajyoti Das - Personal Portfolio</title>': 
      `<title>${article.title} | Dhrubajyoti Das</title>`,
    
    // Description
    'content="Professional portfolio of Dhrubajyoti Das - showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography."':
      `content="${article.excerpt}"`,
    
    // Open Graph Title
    'content="Dhrubajyoti Das - Personal Portfolio"':
      `content="${article.title}"`,
    
    // Open Graph Description
    'content="Professional portfolio showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography."':
      `content="${article.excerpt}"`,
    
    // Open Graph Type
    'content="website"':
      'content="article"',
    
    // Open Graph URL
    'content="https://dasdhrubajyoti.netlify.app/"':
      `content="https://dasdhrubajyoti.netlify.app/article/${article.id}"`,
    
    // Open Graph Image
    'content="https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png"':
      `content="${article.cover_image || 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png'}"`,
    
    // Twitter Title
    'name="twitter:title" content="Dhrubajyoti Das - Personal Portfolio"':
      `name="twitter:title" content="${article.title}"`,
    
    // Twitter Description
    'name="twitter:description" content="Professional portfolio showcasing expertise in technology, leadership, and innovation."':
      `name="twitter:description" content="${article.excerpt}"`
  };
  
  // Apply replacements
  Object.entries(metaReplacements).forEach(([search, replace]) => {
    html = html.replace(new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
  });
  
  // Add article-specific structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": "https://dasdhrubajyoti.netlify.app/"
    },
    "datePublished": article.published_at,
    "publisher": {
      "@type": "Organization",
      "name": "Dhrubajyoti Das Portfolio",
      "url": "https://dasdhrubajyoti.netlify.app/"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://dasdhrubajyoti.netlify.app/article/${article.id}`
    }
  };
  
  if (article.cover_image) {
    structuredData.image = {
      "@type": "ImageObject",
      "url": article.cover_image,
      "width": 1200,
      "height": 630
    };
  }
  
  // Insert structured data before closing head tag
  const structuredDataScript = `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData, null, 2)}
    </script>
  </head>`;
  
  html = html.replace('</head>', structuredDataScript);
  
  return html;
};

// Create directory structure and generate files
const generateStaticFiles = () => {
  const distDir = path.join(__dirname, '../dist');
  const articleDir = path.join(distDir, 'article');
  
  // Ensure directories exist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  if (!fs.existsSync(articleDir)) {
    fs.mkdirSync(articleDir, { recursive: true });
  }
  
  // Generate HTML file for each article
  articles.forEach(article => {
    const articleHTML = generateArticleHTML(article);
    const articlePath = path.join(articleDir, `${article.id}.html`);
    
    fs.writeFileSync(articlePath, articleHTML);
    console.log(`✅ Generated: ${articlePath}`);
  });
  
  console.log(`\n🎉 Successfully generated ${articles.length} article pages with proper meta tags!`);
  console.log('\n📋 Next steps:');
  console.log('1. Deploy to Netlify');
  console.log('2. Test with social media validators');
  console.log('3. Share articles to verify proper previews');
};

// Run the script
console.log('🚀 Generating static article pages with meta tags...\n');
generateStaticFiles();

export { generateStaticFiles, generateArticleHTML };

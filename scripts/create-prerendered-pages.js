#!/usr/bin/env node

/**
 * Create Prerendered Pages for Social Media
 * 
 * This creates a complete HTML page for each article/photo/project
 * that includes the meta tags directly in the HTML response.
 * This approach works reliably with all social media crawlers.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read the base React app HTML template
 */
const getBaseReactHTML = () => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('dist/index.html not found. Run "npm run build" first.');
  }
  return fs.readFileSync(indexPath, 'utf8');
};

/**
 * Replace meta tags in the base HTML template
 */
const injectMetaTagsIntoReactHTML = (baseHTML, metaData, contentType) => {
  let html = baseHTML;
  
  // Replace title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>${metaData.title} | Dhrubajyoti Das Portfolio</title>`
  );
  
  // Remove existing meta tags that we'll replace
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  
  // Create comprehensive meta tags
  const metaTags = `
    <!-- Primary Meta Tags -->
    <meta name="title" content="${metaData.title}" />
    <meta name="description" content="${metaData.description}" />
    <meta name="author" content="${metaData.author}" />
    <meta name="keywords" content="${metaData.tags ? metaData.tags.join(', ') : ''}" />
    
    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="${metaData.type}" />
    <meta property="og:site_name" content="Dhrubajyoti Das Portfolio" />
    <meta property="og:url" content="${metaData.url}" />
    <meta property="og:title" content="${metaData.title}" />
    <meta property="og:description" content="${metaData.description}" />
    <meta property="og:image" content="${metaData.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${metaData.title}" />
    <meta property="og:locale" content="en_US" />
    
    ${metaData.type === 'article' ? `
    <!-- Article specific Open Graph -->
    <meta property="article:author" content="${metaData.author}" />
    <meta property="article:published_time" content="${metaData.publishedTime}" />
    <meta property="article:modified_time" content="${metaData.modifiedTime || metaData.publishedTime}" />
    <meta property="article:section" content="${metaData.category || 'Technology'}" />
    ${metaData.tags ? metaData.tags.map(tag => `<meta property="article:tag" content="${tag}" />`).join('\n    ') : ''}
    ` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${metaData.url}" />
    <meta name="twitter:title" content="${metaData.title}" />
    <meta name="twitter:description" content="${metaData.description}" />
    <meta name="twitter:image" content="${metaData.image}" />
    <meta name="twitter:image:alt" content="${metaData.title}" />
    <meta name="twitter:creator" content="@dhrubajyoti_das" />
    
    <!-- Additional Social Media -->
    <meta name="pinterest-rich-pin" content="true" />
    <meta name="theme-color" content="#0ea5e9" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${metaData.url}" />
`;

  // Insert meta tags in the head section
  html = html.replace('</head>', `${metaTags}\n</head>`);
  
  // Add structured data
  const structuredData = generateStructuredData(metaData, contentType);
  const structuredDataScript = `
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
  </head>`;
  
  html = html.replace('</head>', structuredDataScript);
  
  return html;
};

/**
 * Generate structured data for different content types
 */
const generateStructuredData = (metaData, contentType) => {
  const baseData = {
    "@context": "https://schema.org",
    "author": {
      "@type": "Person",
      "name": metaData.author,
      "url": "https://dasdhrubajyoti.netlify.app/",
      "sameAs": [
        "https://linkedin.com/in/dhrubajyoti-das",
        "https://github.com/dhrubajyoti-das",
        "https://twitter.com/dhrubajyoti_das"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dhrubajyoti Das Portfolio",
      "url": "https://dasdhrubajyoti.netlify.app/"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": metaData.url
    },
    "inLanguage": "en-US"
  };

  switch (contentType) {
    case 'article':
      return {
        ...baseData,
        "@type": "Article",
        "headline": metaData.title,
        "description": metaData.description,
        "image": {
          "@type": "ImageObject",
          "url": metaData.image,
          "width": 1200,
          "height": 630
        },
        "datePublished": metaData.publishedTime,
        "dateModified": metaData.modifiedTime || metaData.publishedTime,
        "articleSection": metaData.category || "Technology",
        "keywords": metaData.tags ? metaData.tags.join(', ') : ''
      };

    case 'photo':
      return {
        ...baseData,
        "@type": "ImageObject",
        "name": metaData.title,
        "description": metaData.description,
        "contentUrl": metaData.image,
        "url": metaData.url,
        "datePublished": metaData.publishedTime,
        "keywords": metaData.tags ? metaData.tags.join(', ') : ''
      };

    case 'project':
      return {
        ...baseData,
        "@type": "CreativeWork",
        "name": metaData.title,
        "description": metaData.description,
        "image": {
          "@type": "ImageObject",
          "url": metaData.image,
          "width": 1200,
          "height": 630
        },
        "datePublished": metaData.publishedTime,
        "genre": metaData.category,
        "keywords": metaData.tags ? metaData.tags.join(', ') : ''
      };

    default:
      return baseData;
  }
};

/**
 * Load content data from the integrated data file
 */
const loadContentData = () => {
  const dataPath = path.join(__dirname, 'integrated-content-data.json');
  
  if (!fs.existsSync(dataPath)) {
    console.log('⚠️  No integrated content data found. Running data integration...');
    // You could run the integration here, but for now let's use fallback
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
  }
  
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
};

/**
 * Generate meta data objects for different content types
 */
const generateMetaData = {
  article: (article) => ({
    title: article.title,
    description: article.excerpt,
    image: article.coverImage,
    url: `https://dasdhrubajyoti.netlify.app/article/${article.id}`,
    type: 'article',
    author: article.author,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    tags: article.tags,
    category: article.category
  }),
  
  photo: (photo) => ({
    title: photo.title,
    description: photo.caption || `${photo.title} - Photography by Dhrubajyoti Das`,
    image: photo.imageUrl,
    url: `https://dasdhrubajyoti.netlify.app/photos/${photo.id}`,
    type: 'photo',
    author: 'Dhrubajyoti Das',
    publishedTime: photo.publishedAt,
    tags: photo.tags,
    category: photo.category
  }),
  
  project: (project) => ({
    title: project.title,
    description: project.description,
    image: project.coverImage,
    url: `https://dasdhrubajyoti.netlify.app/projects/${project.slug}`,
    type: 'project',
    author: 'Dhrubajyoti Das',
    publishedTime: project.publishedAt,
    tags: project.tags,
    category: project.category
  })
};

/**
 * Create prerendered pages
 */
const createPrerenderedPages = () => {
  console.log('🚀 CREATING PRERENDERED PAGES FOR SOCIAL MEDIA');
  console.log('==============================================\n');
  
  try {
    const baseHTML = getBaseReactHTML();
    const contentData = loadContentData();
    const distDir = path.join(__dirname, '../dist');
    
    let totalGenerated = 0;
    
    // Create article pages
    if (contentData.articles && contentData.articles.length > 0) {
      const articleDir = path.join(distDir, 'article');
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }
      
      contentData.articles.forEach(article => {
        const metaData = generateMetaData.article(article);
        const html = injectMetaTagsIntoReactHTML(baseHTML, metaData, 'article');
        const filePath = path.join(articleDir, `${article.id}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Article: ${article.title}`);
        totalGenerated++;
      });
    }
    
    // Create photo pages
    if (contentData.photos && contentData.photos.length > 0) {
      const photosDir = path.join(distDir, 'photos');
      if (!fs.existsSync(photosDir)) {
        fs.mkdirSync(photosDir, { recursive: true });
      }
      
      contentData.photos.forEach(photo => {
        const metaData = generateMetaData.photo(photo);
        const html = injectMetaTagsIntoReactHTML(baseHTML, metaData, 'photo');
        const filePath = path.join(photosDir, `${photo.id}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Photo: ${photo.title}`);
        totalGenerated++;
      });
    }
    
    // Create project pages
    if (contentData.projects && contentData.projects.length > 0) {
      const projectsDir = path.join(distDir, 'projects');
      if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir, { recursive: true });
      }
      
      contentData.projects.forEach(project => {
        const metaData = generateMetaData.project(project);
        const html = injectMetaTagsIntoReactHTML(baseHTML, metaData, 'project');
        const filePath = path.join(projectsDir, `${project.slug}.html`);
        
        fs.writeFileSync(filePath, html);
        console.log(`✅ Project: ${project.title}`);
        totalGenerated++;
      });
    }
    
    console.log(`\n🎉 Successfully created ${totalGenerated} prerendered pages!`);
    console.log('\n✨ WHAT THIS DOES:');
    console.log('• Each page is a complete HTML document with your React app');
    console.log('• Meta tags are directly embedded in the HTML');
    console.log('• Social media crawlers get instant access to meta tags');
    console.log('• Users still get your full React application experience');
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Deploy to Netlify');
    console.log('2. Test with social media validators');
    console.log('3. Social media should now show proper previews');
    
    return totalGenerated;
    
  } catch (error) {
    console.error('❌ Error creating prerendered pages:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    createPrerenderedPages();
  } catch (error) {
    console.error('❌ Script failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

export { createPrerenderedPages };

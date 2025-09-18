#!/usr/bin/env node

/**
 * Dynamic Meta Tag Generation System
 * 
 * This script generates static HTML files with proper meta tags for:
 * - Articles (from articles.ts and Supabase)
 * - Photos (from Supabase photos table)
 * - Projects (from Supabase projects table)
 * 
 * Each content type gets optimized meta tags for social media sharing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  baseUrl: 'https://dasdhrubajyoti.netlify.app',
  siteName: 'Dhrubajyoti Das Portfolio',
  author: 'Dhrubajyoti Das',
  authorUrl: 'https://dasdhrubajyoti.netlify.app/',
  defaultImage: 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png',
  twitterHandle: '@dhrubajyoti_das',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/dhrubajyoti-das',
    github: 'https://github.com/dhrubajyoti-das',
    twitter: 'https://twitter.com/dhrubajyoti_das'
  }
};

// Content data sources (in production, these would come from your APIs)
const contentSources = {
  // Articles from your existing articles.ts data
  articles: [
    {
      id: 'how-i-cracked-the-gate-exam-in-just-45-days-a-bold-strategy',
      title: 'How I Cracked the GATE Exam in Just 45 Days: A Bold Strategy',
      excerpt: 'Discover the unconventional approach that helped me crack one of India\'s toughest engineering exams in record time. A bold strategy that actually worked.',
      coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&crop=entropy&auto=format',
      author: 'Dhrubajyoti Das',
      publishedAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      tags: ['GATE exam', 'engineering', 'study strategy', 'exam preparation', 'education'],
      readTime: 8,
      category: 'Education'
    }
    // Add more articles here - this could be populated from your Supabase articles table
  ],
  
  // Sample photos data structure (would come from Supabase photos table)
  photos: [
    {
      id: 'sample-photo-1',
      title: 'Beautiful Sunset Photography',
      caption: 'A stunning sunset captured during my travels',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      category: 'Nature',
      tags: ['sunset', 'photography', 'nature', 'travel'],
      publishedAt: '2024-01-10T00:00:00Z',
      location: 'Mountain View Point'
    }
    // Add more photos from your database
  ],
  
  // Sample projects data structure (would come from Supabase projects table)
  projects: [
    {
      id: 'sample-project-1',
      slug: 'portfolio-website',
      title: 'Personal Portfolio Website',
      description: 'A modern, responsive portfolio website built with React and TypeScript',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop',
      tags: ['React', 'TypeScript', 'Web Development', 'Portfolio'],
      category: 'Web Development',
      publishedAt: '2024-01-05T00:00:00Z',
      presentationType: 'external_url'
    }
    // Add more projects from your database
  ]
};

/**
 * Generate HTML template with dynamic meta tags
 */
const generateHtmlTemplate = (metaData, contentType) => {
  const {
    title,
    description,
    image,
    url,
    type,
    author,
    publishedTime,
    modifiedTime,
    tags,
    readingTime,
    category,
    location,
    additionalMeta = {}
  } = metaData;

  // Generate article-specific tags
  const articleTags = type === 'article' && tags ? 
    tags.map(tag => `    <meta property="article:tag" content="${tag}" />`).join('\n') : '';

  // Generate structured data based on content type
  const structuredData = generateStructuredData(metaData, contentType);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
    
    <!-- Primary Meta Tags -->
    <title>${title} | ${config.siteName}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="index, follow" />
    <meta name="language" content="English" />
    ${tags ? `<meta name="keywords" content="${tags.join(', ')}" />` : ''}
    
    <!-- Open Graph / Facebook / LinkedIn -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${config.siteName}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:image:type" content="image/jpeg" />
    
    ${type === 'article' ? `
    <!-- Article specific Open Graph -->
    <meta property="article:author" content="${author}" />
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:modified_time" content="${modifiedTime}" />
    <meta property="article:section" content="${category || 'Technology'}" />
${articleTags}` : ''}

    ${type === 'photo' ? `
    <!-- Photo specific Open Graph -->
    <meta property="og:image:photographer" content="${author}" />
    ${location ? `<meta property="og:image:location" content="${location}" />` : ''}` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${title}" />
    <meta name="twitter:creator" content="${config.twitterHandle}" />
    
    <!-- Additional Social Media -->
    <meta name="pinterest-rich-pin" content="true" />
    <meta name="theme-color" content="#0ea5e9" />
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${url}" />
    
    <!-- Structured Data (JSON-LD) -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    
    <!-- Breadcrumb Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(generateBreadcrumbData(metaData, contentType), null, 2)}
    </script>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Redirect to React App for actual content -->
    <script>
        // Immediately redirect to React app for users (not crawlers)
        if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
            window.location.replace('${getReactAppUrl(contentType, metaData)}');
        }
    </script>
    
    <!-- Fallback content for crawlers -->
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .content-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .content-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .content-meta {
            color: #7f8c8d;
            margin-bottom: 20px;
        }
        .content-image {
            width: 100%;
            max-width: 600px;
            height: 300px;
            object-fit: cover;
            border-radius: 8px;
            margin: 20px 0;
        }
        .cta {
            background: #3498db;
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin: 20px 0;
        }
        .tags {
            margin: 20px 0;
        }
        .tag {
            background: #ecf0f1;
            color: #2c3e50;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-right: 8px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="content-header">
        <h1 class="content-title">${title}</h1>
        <div class="content-meta">
            <p>By <strong>${author}</strong> | ${formatDate(publishedTime)} ${readingTime ? `| ${readingTime} min read` : ''}</p>
        </div>
        <img src="${image}" alt="${title}" class="content-image" />
    </div>
    
    <div class="content-body">
        <p><strong>${description}</strong></p>
        
        ${tags && tags.length > 0 ? `
        <div class="tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ` : ''}
        
        <a href="${url}" class="cta">
            ${getCtaText(contentType)} →
        </a>
        
        <p><em>This is a preview for social media crawlers. Click above to view the complete ${contentType} with interactive content.</em></p>
    </div>
</body>
</html>`;
};

/**
 * Generate structured data based on content type
 */
const generateStructuredData = (metaData, contentType) => {
  const baseData = {
    "@context": "https://schema.org",
    "author": {
      "@type": "Person",
      "name": metaData.author,
      "url": config.authorUrl,
      "sameAs": Object.values(config.socialLinks)
    },
    "publisher": {
      "@type": "Organization",
      "name": config.siteName,
      "url": config.baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": config.defaultImage,
        "width": 1200,
        "height": 630
      }
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
        "dateModified": metaData.modifiedTime,
        "articleSection": metaData.category || "Technology",
        "keywords": metaData.tags ? metaData.tags.join(', ') : '',
        "wordCount": metaData.readingTime ? metaData.readingTime * 200 : undefined,
        "timeRequired": metaData.readingTime ? `PT${metaData.readingTime}M` : undefined
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
        "dateModified": metaData.modifiedTime,
        "keywords": metaData.tags ? metaData.tags.join(', ') : '',
        "contentLocation": metaData.location ? {
          "@type": "Place",
          "name": metaData.location
        } : undefined
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
        "dateModified": metaData.modifiedTime,
        "genre": metaData.category,
        "keywords": metaData.tags ? metaData.tags.join(', ') : '',
        "about": metaData.tags ? metaData.tags.map(tag => ({
          "@type": "Thing",
          "name": tag
        })) : undefined
      };

    default:
      return baseData;
  }
};

/**
 * Generate breadcrumb structured data
 */
const generateBreadcrumbData = (metaData, contentType) => {
  const breadcrumbs = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": config.baseUrl
    }
  ];

  // Add section-specific breadcrumb
  switch (contentType) {
    case 'article':
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Writing",
        "item": `${config.baseUrl}/writing`
      });
      break;
    case 'photo':
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Photos",
        "item": `${config.baseUrl}/photos`
      });
      break;
    case 'project':
      breadcrumbs.push({
        "@type": "ListItem",
        "position": 2,
        "name": "Projects",
        "item": `${config.baseUrl}/projects`
      });
      break;
  }

  // Add current page
  breadcrumbs.push({
    "@type": "ListItem",
    "position": breadcrumbs.length + 1,
    "name": metaData.title,
    "item": metaData.url
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs
  };
};

/**
 * Get React app URL for redirect
 */
const getReactAppUrl = (contentType, metaData) => {
  switch (contentType) {
    case 'article':
      return `/article/${metaData.id}#spa`;
    case 'photo':
      return `/photos/${metaData.id}#spa`;
    case 'project':
      return `/projects/${metaData.slug || metaData.id}#spa`;
    default:
      return '/#spa';
  }
};

/**
 * Get CTA text based on content type
 */
const getCtaText = (contentType) => {
  switch (contentType) {
    case 'article':
      return 'Read Full Article';
    case 'photo':
      return 'View Full Photo';
    case 'project':
      return 'View Project Details';
    default:
      return 'View Content';
  }
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Generate meta data for articles
 */
const generateArticleMetaData = (article) => ({
  title: article.title,
  description: article.excerpt,
  image: article.coverImage || config.defaultImage,
  url: `${config.baseUrl}/article/${article.id}`,
  type: 'article',
  author: article.author,
  publishedTime: article.publishedAt,
  modifiedTime: article.updatedAt || article.publishedAt,
  tags: article.tags,
  readingTime: article.readTime,
  category: article.category
});

/**
 * Generate meta data for photos
 */
const generatePhotoMetaData = (photo) => ({
  title: photo.title,
  description: photo.caption || `${photo.title} - Photography by ${config.author}`,
  image: photo.imageUrl,
  url: `${config.baseUrl}/photos/${photo.id}`,
  type: 'photo',
  author: config.author,
  publishedTime: photo.publishedAt,
  modifiedTime: photo.publishedAt,
  tags: photo.tags,
  category: photo.category,
  location: photo.location
});

/**
 * Generate meta data for projects
 */
const generateProjectMetaData = (project) => ({
  title: project.title,
  description: project.description,
  image: project.coverImage || config.defaultImage,
  url: `${config.baseUrl}/projects/${project.slug}`,
  type: 'project',
  author: config.author,
  publishedTime: project.publishedAt,
  modifiedTime: project.publishedAt,
  tags: project.tags,
  category: project.category
});

/**
 * Create directory structure and generate files
 */
const generateStaticFiles = () => {
  const distDir = path.join(__dirname, '../dist');
  
  // Ensure base directories exist
  const directories = ['article', 'photos', 'projects'];
  directories.forEach(dir => {
    const fullPath = path.join(distDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });

  let totalGenerated = 0;

  // Generate article pages
  contentSources.articles.forEach(article => {
    const metaData = generateArticleMetaData(article);
    const html = generateHtmlTemplate(metaData, 'article');
    const filePath = path.join(distDir, 'article', `${article.id}.html`);
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated article: ${filePath}`);
    totalGenerated++;
  });

  // Generate photo pages
  contentSources.photos.forEach(photo => {
    const metaData = generatePhotoMetaData(photo);
    const html = generateHtmlTemplate(metaData, 'photo');
    const filePath = path.join(distDir, 'photos', `${photo.id}.html`);
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated photo: ${filePath}`);
    totalGenerated++;
  });

  // Generate project pages
  contentSources.projects.forEach(project => {
    const metaData = generateProjectMetaData(project);
    const html = generateHtmlTemplate(metaData, 'project');
    const filePath = path.join(distDir, 'projects', `${project.slug}.html`);
    
    fs.writeFileSync(filePath, html);
    console.log(`✅ Generated project: ${filePath}`);
    totalGenerated++;
  });

  console.log(`\n🎉 Successfully generated ${totalGenerated} pages with dynamic meta tags!`);
  console.log('\n📋 Next steps:');
  console.log('1. Add data integration with your Supabase APIs');
  console.log('2. Deploy to Netlify');
  console.log('3. Test with social media validators');
  console.log('4. Update your build process to run this script');
};

// Run the script
console.log('🚀 Generating dynamic meta tag pages...\n');
generateStaticFiles();

export { generateStaticFiles, generateHtmlTemplate, generateArticleMetaData, generatePhotoMetaData, generateProjectMetaData };

/**
 * SEO Utilities for Enhanced Search Engine Optimization
 * Provides comprehensive SEO functions for different page types
 */

import { updateMetaTags, updateStructuredData, updatePhotoStructuredData, MetaTagData } from './meta-tags';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'photo' | 'gallery';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  readingTime?: string;
  category?: string;
  location?: string;
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Apply SEO optimization for homepage
 */
export const applyHomepageSEO = () => {
  const seoData: MetaTagData = {
    title: 'Dhrubajyoti Das - Personal Portfolio | Technology Professional',
    description: 'Professional portfolio of Dhrubajyoti Das showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography.',
    type: 'website',
    url: 'https://dasdhrubajyoti.netlify.app/',
    image: 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png'
  };
  
  updateMetaTags(seoData);
  
  // Add homepage-specific structured data
  addHomepageStructuredData();
};

/**
 * Apply SEO optimization for writing/blog page
 */
export const applyWritingPageSEO = () => {
  const seoData: MetaTagData = {
    title: 'Writing & Articles | Dhrubajyoti Das - Technology Insights',
    description: 'Read insightful articles on technology, leadership, and innovation by Dhrubajyoti Das. Explore thought-provoking content on modern tech trends.',
    type: 'website',
    url: 'https://dasdhrubajyoti.netlify.app/writing',
    image: 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png',
    keywords: ['technology articles', 'leadership insights', 'innovation', 'tech trends', 'professional writing']
  };
  
  updateMetaTags(seoData);
  addWritingPageStructuredData();
};

/**
 * Apply SEO optimization for photos page
 */
export const applyPhotosPageSEO = () => {
  const seoData: MetaTagData = {
    title: 'Photography Gallery | Dhrubajyoti Das - Visual Stories',
    description: 'Explore the photography gallery of Dhrubajyoti Das. Discover visual stories captured through the lens of a technology professional.',
    type: 'gallery',
    url: 'https://dasdhrubajyoti.netlify.app/photos',
    image: 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png',
    keywords: ['photography', 'visual stories', 'portfolio gallery', 'professional photography']
  };
  
  updateMetaTags(seoData);
  addPhotosPageStructuredData();
};

/**
 * Apply SEO optimization for individual articles
 */
export const applyArticleSEO = (articleData: {
  title: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  read_time: number;
  id: string;
}) => {
  const seoData: MetaTagData = {
    title: `${articleData.title} | Dhrubajyoti Das`,
    description: articleData.excerpt || 'Read this insightful article on technology and innovation by Dhrubajyoti Das.',
    type: 'article',
    url: `https://dasdhrubajyoti.netlify.app/article/${articleData.id}`,
    image: articleData.cover_image,
    author: articleData.author,
    publishedTime: articleData.published_at || articleData.created_at,
    modifiedTime: articleData.updated_at,
    tags: articleData.tags,
    readingTime: articleData.read_time.toString(),
    keywords: articleData.tags || []
  };
  
  updateMetaTags(seoData);
  updateStructuredData(seoData);
};

/**
 * Apply SEO optimization for individual photos
 */
export const applyPhotoSEO = (photoData: {
  title: string;
  caption?: string;
  image_url: string;
  category?: string;
  tags?: string[];
  created_at: string;
  location?: string;
}) => {
  const seoData: MetaTagData = {
    title: `${photoData.title} | Photography by Dhrubajyoti Das`,
    description: photoData.caption || `View ${photoData.title} - a photograph by Dhrubajyoti Das`,
    type: 'photo',
    url: window.location.href,
    image: photoData.image_url,
    author: 'Dhrubajyoti Das',
    publishedTime: photoData.created_at,
    tags: photoData.tags,
    category: photoData.category,
    location: photoData.location,
    keywords: photoData.tags || []
  };
  
  updateMetaTags(seoData);
  updatePhotoStructuredData(seoData);
};

/**
 * Add homepage-specific structured data
 */
const addHomepageStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Dhrubajyoti Das - Personal Portfolio",
    "description": "Professional portfolio showcasing expertise in technology, leadership, and innovation",
    "url": "https://dasdhrubajyoti.netlify.app/",
    "mainEntity": {
      "@type": "Person",
      "name": "Dhrubajyoti Das",
      "jobTitle": "Technology Professional",
      "description": "Professional with expertise in technology, leadership, and innovation"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://dasdhrubajyoti.netlify.app/"
        }
      ]
    }
  };
  
  addStructuredDataScript(structuredData, 'homepage');
};

/**
 * Add writing page structured data
 */
const addWritingPageStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Writing & Articles",
    "description": "Collection of articles on technology, leadership, and innovation",
    "url": "https://dasdhrubajyoti.netlify.app/writing",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Articles",
      "description": "Technology and leadership articles"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://dasdhrubajyoti.netlify.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Writing",
          "item": "https://dasdhrubajyoti.netlify.app/writing"
        }
      ]
    }
  };
  
  addStructuredDataScript(structuredData, 'writing-page');
};

/**
 * Add photos page structured data
 */
const addPhotosPageStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Photography Gallery",
    "description": "Collection of photographs by Dhrubajyoti Das",
    "url": "https://dasdhrubajyoti.netlify.app/photos",
    "author": {
      "@type": "Person",
      "name": "Dhrubajyoti Das"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://dasdhrubajyoti.netlify.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Photos",
          "item": "https://dasdhrubajyoti.netlify.app/photos"
        }
      ]
    }
  };
  
  addStructuredDataScript(structuredData, 'photos-page');
};

/**
 * Add structured data script to document head
 */
const addStructuredDataScript = (data: any, identifier: string) => {
  // Remove existing script with same identifier
  const existingScript = document.querySelector(`script[data-seo-structured-data="${identifier}"]`);
  if (existingScript) {
    existingScript.remove();
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-seo-structured-data', identifier);
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/**
 * Generate dynamic sitemap entries for articles and photos
 */
export const generateSitemapEntries = async () => {
  try {
    // This would typically fetch from your API
    // For now, return a basic structure
    return {
      articles: [],
      photos: []
    };
  } catch (error) {
    console.error('Error generating sitemap entries:', error);
    return { articles: [], photos: [] };
  }
};

/**
 * Add performance hints for better Core Web Vitals
 */
export const addPerformanceHints = () => {
  // Add resource hints for better performance
  const hints = [
    { rel: 'preconnect', href: 'https://cctsyzvkrlbfnmptlxre.supabase.co' },
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' }
  ];
  
  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.rel === 'preconnect') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

/**
 * Initialize SEO for the current page
 */
export const initializeSEO = (pageType: 'home' | 'writing' | 'photos' | 'article' | 'photo', data?: any) => {
  // Add performance hints
  addPerformanceHints();
  
  // Apply page-specific SEO
  switch (pageType) {
    case 'home':
      applyHomepageSEO();
      break;
    case 'writing':
      applyWritingPageSEO();
      break;
    case 'photos':
      applyPhotosPageSEO();
      break;
    case 'article':
      if (data) applyArticleSEO(data);
      break;
    case 'photo':
      if (data) applyPhotoSEO(data);
      break;
  }
};

/**
 * Update page title with dynamic content
 */
export const updatePageTitle = (title: string, includeSiteName: boolean = true) => {
  const siteName = 'Dhrubajyoti Das';
  document.title = includeSiteName ? `${title} | ${siteName}` : title;
};

/**
 * Add meta robots tag for noindex if needed
 */
export const setNoIndex = (noIndex: boolean = true) => {
  const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';
  updateMetaTag('robots', robotsContent);
};

/**
 * Helper function to update meta tags (re-exported from meta-tags.ts)
 */
const updateMetaTag = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) || 
             document.querySelector(`meta[name="${property}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('article:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

/**
 * Dynamic Meta Tags Utility
 * Handles updating meta tags for better social media sharing and SEO
 */

export interface MetaTagData {
  title: string;
  description: string;
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
}

export interface ArticleMetaData extends MetaTagData {
  type: 'article';
  author: string;
  publishedTime: string;
  modifiedTime: string;
  tags: string[];
  readingTime?: string;
}

/**
 * Ensure meta tags are set immediately for better social media crawler compatibility
 * This should be called as early as possible in the page lifecycle
 */
export const ensureMetaTagsImmediate = (data: MetaTagData) => {
  // Set critical meta tags immediately
  document.title = data.title;
  
  // Update the most important meta tags first
  updateMetaTag('og:title', data.title);
  updateMetaTag('og:description', data.description);
  updateMetaTag('og:type', data.type || 'website');
  updateMetaTag('twitter:title', data.title);
  updateMetaTag('twitter:description', data.description);
  
  if (data.url) {
    updateMetaTag('og:url', data.url);
  }
  
  if (data.image) {
    updateMetaTag('og:image', data.image);
    updateMetaTag('twitter:image', data.image);
  }
  
  // Then update the rest asynchronously
  setTimeout(() => {
    updateMetaTags(data);
  }, 0);
};

/**
 * Update meta tags dynamically
 */
export const updateMetaTags = (data: MetaTagData) => {
  console.log('Updating meta tags with:', data); // Debug log
  
  // Update page title
  document.title = data.title;
  
  // Update Open Graph meta tags
  updateMetaTag('og:title', data.title);
  updateMetaTag('og:description', data.description);
  updateMetaTag('og:type', data.type || 'website');
  
  if (data.url) {
    updateMetaTag('og:url', data.url);
  }
  
  if (data.image) {
    updateMetaTag('og:image', data.image);
    updateMetaTag('og:image:secure_url', data.image);
    updateMetaTag('twitter:image', data.image);
  }
  
  // Update Twitter meta tags
  updateMetaTag('twitter:title', data.title);
  updateMetaTag('twitter:description', data.description);
  
  // Update article-specific meta tags if it's an article
  if (data.type === 'article') {
    const articleData = data as ArticleMetaData;
    
    // Update article-specific meta tags
    updateMetaTag('article:author', articleData.author);
    updateMetaTag('article:published_time', articleData.publishedTime);
    updateMetaTag('article:modified_time', articleData.modifiedTime);
    
    if (articleData.tags && articleData.tags.length > 0) {
      updateMetaTag('article:tag', articleData.tags.join(', '));
    }
    
    // Add reading time if available
    if (articleData.readingTime) {
      updateMetaTag('article:reading_time', articleData.readingTime);
    }
    
    // Also update the main meta tags for better compatibility
    updateMetaTag('author', articleData.author);
    updateMetaTag('description', data.description);
  }
  
  // Update structured data
  updateStructuredData(data);
  
  console.log('Meta tags updated successfully'); // Debug log
};

/**
 * Update a specific meta tag
 */
export const updateMetaTag = (property: string, content: string) => {
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
  
  // Debug log
  console.log(`Updated meta tag: ${property} = ${content}`);
};

/**
 * Remove a specific meta tag
 */
export const removeMetaTag = (property: string) => {
  const meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
  if (meta) {
    meta.remove();
  }
};

/**
 * Update structured data (JSON-LD)
 */
export const updateStructuredData = (data: MetaTagData) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[data-dynamic-structured-data]');
  if (existingScript) {
    existingScript.remove();
  }
  
  if (data.type === 'article') {
    const articleData = data as ArticleMetaData;
    
    // Create comprehensive article structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleData.title,
      "description": articleData.description,
      "author": {
        "@type": "Person",
        "name": articleData.author,
        "url": "https://dasdhrubajyoti.netlify.app/",
        "sameAs": [
          "https://linkedin.com/in/dhrubajyoti-das",
          "https://github.com/dhrubajyoti-das",
          "https://twitter.com/dhrubajyoti-das"
        ]
      },
      "datePublished": articleData.publishedTime,
      "dateModified": articleData.modifiedTime,
      "publisher": {
        "@type": "Organization",
        "name": "Dhrubajyoti Das Portfolio",
        "url": "https://dasdhrubajyoti.netlify.app/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png",
          "width": 1200,
          "height": 630
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.url || window.location.href
      },
      "articleSection": "Technology",
      "articleBody": articleData.description,
      "inLanguage": "en-US"
    };
    
    if (articleData.image) {
      structuredData["image"] = {
        "@type": "ImageObject",
        "url": articleData.image,
        "width": 1200,
        "height": 630,
        "caption": articleData.title
      };
    }
    
    if (articleData.tags && articleData.tags.length > 0) {
      structuredData["keywords"] = articleData.tags.join(', ');
      structuredData["about"] = articleData.tags.map(tag => ({
        "@type": "Thing",
        "name": tag
      }));
    }
    
    if (articleData.readingTime) {
      structuredData["wordCount"] = parseInt(articleData.readingTime) * 200; // Rough estimate
      structuredData["timeRequired"] = `PT${articleData.readingTime}M`;
    }
    
    // Add breadcrumb structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": articleData.title,
          "item": data.url || window.location.href
        }
      ]
    };
    
    // Add both structured data scripts
    const articleScript = document.createElement('script');
    articleScript.type = 'application/ld+json';
    articleScript.setAttribute('data-dynamic-structured-data', 'article');
    articleScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(articleScript);
    
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.setAttribute('data-dynamic-structured-data', 'breadcrumb');
    breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(breadcrumbScript);
  }
};

/**
 * Update structured data for photos/gallery
 */
export const updatePhotoStructuredData = (data: MetaTagData) => {
  // Remove existing photo structured data
  const existingScripts = document.querySelectorAll('script[data-dynamic-structured-data="photo"]');
  existingScripts.forEach(script => script.remove());
  
  if (data.type === 'photo' || data.type === 'gallery') {
    const photoData = {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      "name": data.title,
      "description": data.description,
      "url": data.url || window.location.href,
      "contentUrl": data.image,
      "author": {
        "@type": "Person",
        "name": data.author || "Dhrubajyoti Das",
        "url": "https://dasdhrubajyoti.netlify.app/"
      },
      "datePublished": data.publishedTime,
      "dateModified": data.modifiedTime,
      "publisher": {
        "@type": "Organization",
        "name": "Dhrubajyoti Das Portfolio",
        "url": "https://dasdhrubajyoti.netlify.app/"
      }
    };
    
    if (data.category) {
      photoData["genre"] = data.category;
    }
    
    if (data.tags && data.tags.length > 0) {
      photoData["keywords"] = data.tags.join(', ');
    }
    
    if (data.location) {
      photoData["contentLocation"] = {
        "@type": "Place",
        "name": data.location
      };
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic-structured-data', 'photo');
    script.textContent = JSON.stringify(photoData);
    document.head.appendChild(script);
  }
};

/**
 * Reset meta tags to default portfolio values
 */
export const resetMetaTags = () => {
  document.title = 'Dhrubajyoti Das - Personal Portfolio';
  
  // Reset to default portfolio meta tags
  updateMetaTag('og:title', 'Dhrubajyoti Das - Personal Portfolio');
  updateMetaTag('og:description', 'Professional portfolio showcasing expertise in technology, leadership, and innovation. Explore my journey, writings, and photography.');
  updateMetaTag('og:type', 'website');
  updateMetaTag('og:image', 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png');
  
  updateMetaTag('twitter:title', 'Dhrubajyoti Das - Personal Portfolio');
  updateMetaTag('twitter:description', 'Professional portfolio showcasing expertise in technology, leadership, and innovation.');
  updateMetaTag('twitter:image', 'https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png');
  
  // Remove article-specific meta tags
  removeMetaTag('article:author');
  removeMetaTag('article:published_time');
  removeMetaTag('article:modified_time');
  removeMetaTag('article:tag');
  removeMetaTag('article:reading_time');
  
  // Remove all dynamic structured data
  const existingScripts = document.querySelectorAll('script[data-dynamic-structured-data]');
  existingScripts.forEach(script => script.remove());
};

/**
 * Generate social sharing URLs
 */
export const getSocialSharingUrls = (data: MetaTagData) => {
  const url = data.url || window.location.href;
  const title = encodeURIComponent(data.title);
  const description = encodeURIComponent(data.description);
  
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${title}&via=dhrubajyoti-das`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${title}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${title}%20${encodeURIComponent(url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${title}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${description}`,
    reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${title}`,
    email: `mailto:?subject=${title}&body=${description}%20${encodeURIComponent(url)}`
  };
};

/**
 * Debug function to log all current meta tags
 */
export const debugMetaTags = () => {
  console.log('=== Current Meta Tags ===');
  const metaTags = document.querySelectorAll('meta');
  metaTags.forEach(meta => {
    const property = meta.getAttribute('property');
    const name = meta.getAttribute('name');
    const content = meta.getAttribute('content');
    if (property || name) {
      console.log(`${property || name}: ${content}`);
    }
  });
  console.log('=== End Meta Tags ===');
};

/**
 * Copy URL to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

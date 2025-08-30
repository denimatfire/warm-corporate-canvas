/**
 * Dynamic Meta Tags Utility
 * Handles updating meta tags for better social media sharing and SEO
 */

export interface MetaTagData {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  readingTime?: string;
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
 * Update meta tags dynamically
 */
export const updateMetaTags = (data: MetaTagData) => {
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
    updateMetaTag('twitter:image', data.image);
    updateMetaTag('og:image:secure_url', data.image);
  }
  
  // Update Twitter meta tags
  updateMetaTag('twitter:title', data.title);
  updateMetaTag('twitter:description', data.description);
  
  // Update article-specific meta tags if it's an article
  if (data.type === 'article') {
    const articleData = data as ArticleMetaData;
    
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
  }
  
  // Update structured data
  updateStructuredData(data);
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
    
    // Create article structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": articleData.title,
      "description": articleData.description,
      "author": {
        "@type": "Person",
        "name": articleData.author
      },
      "datePublished": articleData.publishedTime,
      "dateModified": articleData.modifiedTime,
      "publisher": {
        "@type": "Organization",
        "name": "Dhrubajyoti Das Portfolio",
        "logo": {
          "@type": "ImageObject",
          "url": "https://cctsyzvkrlbfnmptlxre.supabase.co/storage/v1/object/public/Article_images/portfolio-photos/Gemini_Generated_Image_qx6lf8qx6lf8qx6l.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": data.url || window.location.href
      }
    };
    
    if (articleData.image) {
      structuredData["image"] = {
        "@type": "ImageObject",
        "url": articleData.image,
        "width": 1200,
        "height": 630
      };
    }
    
    if (articleData.tags && articleData.tags.length > 0) {
      structuredData["keywords"] = articleData.tags.join(', ');
    }
    
    if (articleData.readingTime) {
      structuredData["wordCount"] = parseInt(articleData.readingTime) * 200; // Rough estimate
    }
    
    // Add the structured data to the page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic-structured-data', 'true');
    script.textContent = JSON.stringify(structuredData);
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
  
  // Remove dynamic structured data
  const existingScript = document.querySelector('script[data-dynamic-structured-data]');
  if (existingScript) {
    existingScript.remove();
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

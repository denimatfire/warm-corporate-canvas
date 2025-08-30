# Dynamic Meta Tags for Articles

This document explains how the dynamic meta tags system works to ensure LinkedIn shows article-specific information (title, cover image, excerpt) instead of generic portfolio information.

## 🎯 **Problem Solved**

**Before:** When sharing articles on LinkedIn, it always showed:
- Title: "Dhrubajyoti Das - Personal Portfolio"
- Image: Portfolio preview image
- Description: Generic portfolio description

**After:** Now LinkedIn shows:
- Title: **Article title** (e.g., "How to Build Responsive Web Apps")
- Image: **Article cover image** (if available)
- Description: **Article excerpt** (e.g., "Learn the best practices for building mobile-responsive web applications...")

## 🚀 **How It Works**

### **1. Dynamic Meta Tag Updates**
When viewing an article, the component automatically updates the page's meta tags:

```typescript
// Update page title
document.title = `${article.title} - Dhrubajyoti Das Portfolio`;

// Update Open Graph meta tags
updateMetaTag('og:title', article.title);
updateMetaTag('og:description', article.excerpt);
updateMetaTag('og:type', 'article');

// Update Twitter meta tags
updateMetaTag('twitter:title', article.title);
updateMetaTag('twitter:description', article.excerpt);

// Update article-specific meta tags
updateMetaTag('article:author', article.author);
updateMetaTag('article:published_time', article.published_at);
```

### **2. Automatic Cleanup**
When leaving an article, meta tags are automatically reset to portfolio defaults:

```typescript
const resetMetaTags = () => {
  document.title = 'Dhrubajyoti Das - Personal Portfolio';
  updateMetaTag('og:title', 'Dhrubajyoti Das - Personal Portfolio');
  updateMetaTag('og:type', 'website');
  // ... reset all other tags
};
```

## 📱 **Components Updated**

### **PublishedArticle.tsx**
- Updates meta tags when article loads
- Resets meta tags when component unmounts
- Handles article-specific sharing

### **Article_medium.tsx**
- Same dynamic meta tag management
- Ensures consistency across article views

## 🖼️ **Cover Image Support**

The system automatically uses the article's cover image if available:

```typescript
// If article has a cover image, use it
if (article.cover_image) {
  updateMetaTag('og:image', article.cover_image);
  updateMetaTag('twitter:image', article.cover_image);
}
```

## 📊 **Meta Tags Generated**

### **For Articles:**
```html
<meta property="og:title" content="Article Title" />
<meta property="og:description" content="Article excerpt..." />
<meta property="og:type" content="article" />
<meta property="og:image" content="article-cover-image-url" />
<meta property="article:author" content="Author Name" />
<meta property="article:published_time" content="2024-01-01T00:00:00Z" />
<meta property="article:tag" content="tag1, tag2, tag3" />
```

### **For Portfolio (Default):**
```html
<meta property="og:title" content="Dhrubajyoti Das - Personal Portfolio" />
<meta property="og:description" content="Professional portfolio..." />
<meta property="og:type" content="website" />
<meta property="og:image" content="portfolio-preview.png" />
```

## 🔄 **Lifecycle**

1. **User visits portfolio**: Shows portfolio meta tags
2. **User clicks on article**: Meta tags update to article-specific info
3. **User shares article**: LinkedIn sees article title, image, and excerpt
4. **User leaves article**: Meta tags reset to portfolio defaults
5. **User visits another article**: Meta tags update to new article info

## 🧪 **Testing**

### **Test Article Sharing:**
1. Visit an article page
2. Use LinkedIn Post Inspector to verify meta tags
3. Share the article link
4. Verify LinkedIn shows article-specific preview

### **Test Portfolio Default:**
1. Visit the main portfolio page
2. Verify meta tags show portfolio information
3. Share the main portfolio link
4. Verify LinkedIn shows portfolio preview

## 🎨 **Customization Options**

### **Add More Meta Tags:**
```typescript
// Add custom meta tags
updateMetaTag('custom:field', 'custom value');
```

### **Modify Default Values:**
```typescript
const resetMetaTags = () => {
  // Customize default portfolio meta tags
  updateMetaTag('og:title', 'Your Custom Portfolio Title');
  updateMetaTag('og:description', 'Your Custom Description');
};
```

### **Add Schema.org Markup:**
```typescript
// Add structured data for better SEO
const addStructuredData = (article: Article) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "author": article.author,
    "datePublished": article.published_at
  });
  document.head.appendChild(script);
};
```

## ✅ **Benefits**

1. **Better Social Sharing**: LinkedIn shows relevant article information
2. **Improved SEO**: Search engines see article-specific meta tags
3. **Professional Appearance**: Each article has its own preview
4. **User Experience**: Clear article identification in social feeds
5. **Brand Consistency**: Maintains portfolio branding while showing article details

## 🔧 **Technical Details**

- **No external dependencies**: Uses native DOM manipulation
- **Automatic cleanup**: Prevents meta tag pollution
- **Performance optimized**: Only updates when necessary
- **Cross-browser compatible**: Works on all modern browsers
- **SEO friendly**: Follows Open Graph and Twitter Card standards

## 🚨 **Important Notes**

1. **Cover images must be accessible**: Ensure article cover images are publicly accessible URLs
2. **Meta tag updates are client-side**: Search engines may not see dynamic updates immediately
3. **LinkedIn caching**: Use LinkedIn Post Inspector to force cache refresh
4. **Image dimensions**: LinkedIn recommends 1200×630 pixels for optimal display

This system ensures that every article shared on LinkedIn shows the correct, engaging preview that encourages clicks and engagement! 🎉

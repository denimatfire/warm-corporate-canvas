# Dynamic Meta Tags System

A comprehensive, scalable meta tag generation system for articles, photos, and projects that ensures optimal social media sharing and SEO performance.

## 🚀 Features

### ✨ Multi-Content Type Support
- **Articles**: Blog posts, tutorials, case studies
- **Photos**: Photography portfolio with location data
- **Projects**: Portfolio projects with presentations
- **Extensible**: Easy to add new content types

### 🎯 Social Media Optimization
- **Facebook/LinkedIn**: Open Graph meta tags
- **Twitter**: Twitter Card optimization
- **Pinterest**: Rich Pins support
- **WhatsApp/Telegram**: Preview optimization

### 🔍 SEO Excellence
- **Structured Data**: JSON-LD for rich snippets
- **Breadcrumbs**: Navigation context
- **Canonical URLs**: Duplicate content prevention
- **Mobile Optimization**: Responsive meta tags

### ⚡ Performance Features
- **Static Generation**: Pre-built HTML for crawlers
- **Smart Caching**: Avoid unnecessary regeneration
- **Crawler Detection**: Redirect users to React app
- **Fallback Content**: Graceful degradation

## 📁 System Architecture

```
scripts/
├── generate-dynamic-meta-tags.js    # Core meta tag generation
├── data-integration.js              # Data source integration
├── supabase-integration.js          # Production Supabase connection
├── inject-meta-tags.js              # Enhanced injection script
└── integrated-content-data.json     # Cached content data

dist/
├── article/
│   └── [article-id].html           # Article meta pages
├── photos/
│   └── [photo-id].html             # Photo meta pages
└── projects/
    └── [project-slug].html          # Project meta pages
```

## 🛠️ Setup & Usage

### Development Setup

1. **Install Dependencies** (if needed)
```bash
npm install @supabase/supabase-js  # For production Supabase integration
```

2. **Test the System**
```bash
npm run meta:test
```

3. **Generate Meta Tags**
```bash
npm run meta:generate
```

### Production Setup

1. **Configure Environment Variables**
```bash
# .env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

2. **Enable Supabase Integration**
Edit `scripts/supabase-integration.js`:
- Uncomment actual Supabase queries
- Remove simulated data sections

3. **Update Build Process**
```bash
npm run build:production
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run meta:generate` | Generate meta tags with sample data |
| `npm run meta:integrate` | Run data integration from sources |
| `npm run meta:supabase` | Fetch data from Supabase (production) |
| `npm run meta:test` | Test the complete system |
| `npm run build:production` | Full production build with meta tags |

## 📊 Content Data Structure

### Articles
```typescript
interface Article {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  readTime: number;
  category: string;
}
```

### Photos
```typescript
interface Photo {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedAt: string;
  location?: string;
}
```

### Projects
```typescript
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  category: string;
  publishedAt: string;
  presentationType: 'file' | 'external_url';
}
```

## 🎨 Generated Meta Tags

### Article Example
```html
<!-- Primary Meta Tags -->
<title>How I Cracked the GATE Exam | Dhrubajyoti Das</title>
<meta name="description" content="Discover the unconventional approach..." />

<!-- Open Graph -->
<meta property="og:type" content="article" />
<meta property="og:title" content="How I Cracked the GATE Exam" />
<meta property="og:description" content="Discover the unconventional..." />
<meta property="og:image" content="https://..." />
<meta property="article:author" content="Dhrubajyoti Das" />
<meta property="article:published_time" content="2024-01-15T00:00:00Z" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="How I Cracked the GATE Exam" />

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How I Cracked the GATE Exam",
  "author": {
    "@type": "Person",
    "name": "Dhrubajyoti Das"
  }
}
</script>
```

## 🔧 Customization

### Adding New Content Types

1. **Define Data Structure**
```javascript
const fetchNewContentType = async () => {
  // Fetch data from your source
  return data;
};
```

2. **Create Meta Data Generator**
```javascript
const generateNewContentMetaData = (item) => ({
  title: item.title,
  description: item.description,
  image: item.image,
  url: `${config.baseUrl}/new-type/${item.id}`,
  type: 'new-type',
  // ... other fields
});
```

3. **Add to Generation Script**
```javascript
// In generate-dynamic-meta-tags.js
contentSources.newContentType = await fetchNewContentType();
```

### Customizing Meta Tags

Edit `scripts/generate-dynamic-meta-tags.js`:

```javascript
const config = {
  baseUrl: 'https://your-domain.com',
  siteName: 'Your Site Name',
  author: 'Your Name',
  twitterHandle: '@your_handle',
  // ... customize other settings
};
```

## 🧪 Testing

### Social Media Validators

Test your generated meta tags:

1. **Facebook Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test: `https://your-site.com/article/article-id`

2. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test: `https://your-site.com/article/article-id`

3. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Test: `https://your-site.com/article/article-id`

### Manual Testing

1. **Generate Test Files**
```bash
npm run meta:test
```

2. **Check Generated Files**
```bash
# Check article meta tags
cat dist/article/how-i-cracked-the-gate-exam.html | grep -A 20 "og:title"

# Check photo meta tags
cat dist/photos/photo-id.html | grep -A 20 "og:image"
```

3. **Validate HTML**
Use W3C validator: https://validator.w3.org/

## 🚀 Deployment

### Netlify Deployment

1. **Build Command**
```bash
npm run build:production
```

2. **Publish Directory**
```
dist
```

3. **Environment Variables**
Set in Netlify dashboard:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### Manual Deployment

1. **Build Project**
```bash
npm run build:production
```

2. **Deploy dist/ folder**
Upload the entire `dist/` folder to your hosting provider.

## 🔍 Troubleshooting

### Common Issues

1. **Meta Tags Not Updating**
   - Clear cache: Delete `scripts/integrated-content-data.json`
   - Regenerate: `npm run meta:integrate`

2. **Images Not Loading**
   - Check image URLs are publicly accessible
   - Verify CORS settings for external images

3. **Social Media Not Showing Previews**
   - Test with validators (see Testing section)
   - Ensure HTML files are publicly accessible
   - Check for redirect loops

### Debug Mode

Enable debug logging:
```javascript
// In any script file
console.log('Debug info:', data);
```

## 📈 Performance Optimization

### Caching Strategy
- Content data cached for 1 hour
- Regenerate only when data changes
- Static HTML files for optimal crawler performance

### Image Optimization
- Use optimized image URLs (1200x630 for social sharing)
- Implement lazy loading for fallback content
- Compress images for faster loading

## 🔮 Future Enhancements

### Planned Features
- [ ] Automatic image generation for articles without covers
- [ ] Multi-language support
- [ ] Advanced structured data for events/courses
- [ ] Integration with Google Analytics for performance tracking
- [ ] Automated social media posting

### Contributing

To add new features:
1. Create a new branch
2. Implement changes in the appropriate script
3. Test with `npm run meta:test`
4. Update this documentation
5. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the generated files in `dist/`
3. Test with social media validators
4. Check browser developer tools for errors

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Compatibility**: Node.js 16+, ES Modules

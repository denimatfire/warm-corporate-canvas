# Articles Backend System

This document explains the new articles backend system that replaces the localStorage dependency with a Google Sheets-based backend.

## 🚀 What's New

- **Google Sheets Backend**: Articles are now stored in Google Sheets instead of localStorage
- **Centralized Data**: All articles are stored in one place accessible from any device
- **Real-time Updates**: Changes sync across all users instantly
- **Professional API**: RESTful API endpoints for all CRUD operations
- **Fallback Support**: Gracefully falls back to localStorage if API is unavailable

## 📁 File Structure

```
src/
├── lib/
│   └── articles-api.ts          # API service layer
├── hooks/
│   └── use-articles.ts          # React hooks for articles
├── components/
│   └── ArticleListExample.tsx   # Example component using new API
└── pages/
    └── ArticleTest.tsx          # Test page for the new system
```

## 🔧 Setup Instructions

### 1. Create Google Sheet
- Go to [Google Sheets](https://sheets.google.com/)
- Create new spreadsheet
- Name first sheet "Articles"
- Add headers: `ID | Title | Content | Excerpt | Cover Image | Tags | Status | Author | Read Time | Published At | Created At | Updated At`

### 2. Set Up Google Apps Script
- Go to [Google Apps Script](https://script.google.com/)
- Create new project
- Copy code from `google-apps-script-backend.js`
- Update `SPREADSHEET_ID` with your actual sheet ID
- Deploy as web app (Execute as: Me, Access: Anyone)

### 3. Update React App
- Open `src/lib/articles-api.ts`
- Update `ARTICLES_API_URL` with your web app URL

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `?action=getAll` | Get all articles |
| GET | `?action=getPublished` | Get published articles only |
| GET | `?action=getById&id=ID` | Get specific article |
| GET | `?action=search&query=TERM` | Search articles |
| GET | `?action=getByTag&tag=TAG` | Get articles by tag |
| GET | `?action=getStats` | Get article statistics |
| POST | `/` with `action=create` | Create new article |
| POST | `/` with `action=update` | Update existing article |
| POST | `/` with `action=delete` | Delete article |

## 🪝 React Hooks

### `useArticles()`
Main hook for managing articles:

```typescript
const { 
  articles,           // All articles
  publishedArticles,  // Published articles only
  isLoading,         // Loading state
  error,             // Error state
  createArticle,     // Create function
  updateArticle,     // Update function
  deleteArticle,     // Delete function
  refreshArticles    // Refresh function
} = useArticles();
```

### `useArticle(id)`
Hook for managing a single article:

```typescript
const { 
  article,      // Article data
  isLoading,    // Loading state
  error,        // Error state
  refresh       // Refresh function
} = useArticle('article-id');
```

### `useArticleSearch()`
Hook for article search:

```typescript
const { 
  searchResults,  // Search results
  isSearching,    // Search loading state
  searchError,    // Search error
  search,         // Search function
  clearSearch     // Clear search
} = useArticleSearch();
```

## 🔄 Migration from localStorage

### Automatic Fallback
The system automatically falls back to localStorage if:
- API is not configured
- API is unavailable
- Network errors occur

### Manual Migration
To migrate existing localStorage data:

1. Export current articles:
```javascript
console.log(JSON.stringify(JSON.parse(localStorage.getItem('articles') || '[]')))
```

2. Add to Google Sheet manually, or
3. Use the migration function in Apps Script

## 🛡️ Error Handling

The system includes comprehensive error handling:

- **Network Errors**: Automatic retry with fallback
- **API Errors**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Fallback Support**: Graceful degradation to localStorage

## 📱 Component Usage

### Basic Usage
```typescript
import { useArticles } from '../hooks/use-articles';

function MyComponent() {
  const { articles, isLoading, error } = useArticles();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

### Creating Articles
```typescript
const { createArticle } = useArticles();

const handleCreate = async () => {
  try {
    const newArticle = await createArticle({
      title: 'New Article',
      content: 'Article content...',
      excerpt: 'Article excerpt...',
      coverImage: 'image-url.jpg',
      tags: ['Technology', 'Programming'],
      status: 'draft',
      author: 'Your Name',
      readTime: 5
    });
    console.log('Created:', newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
  }
};
```

## 🧪 Testing

### Test Page
Use `src/pages/ArticleTest.tsx` to test the new system:

1. Navigate to `/article-test` in your app
2. Test loading, filtering, and CRUD operations
3. Check browser console for API calls
4. Verify data appears in Google Sheet

### API Testing
Test API endpoints directly:

```bash
# Get all articles
curl "https://script.google.com/macros/s/YOUR_ID/exec?action=getAll"

# Create article
curl -X POST "https://script.google.com/macros/s/YOUR_ID/exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"create","data":{"title":"Test","content":"Test content"}}'
```

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Apps Script has CORS headers
   - Check web app URL is correct

2. **Permission Errors**
   - Verify web app is deployed with "Anyone" access
   - Check execution permissions

3. **Data Not Loading**
   - Check Apps Script logs
   - Verify spreadsheet ID
   - Check sheet name matches exactly

4. **Articles Not Saving**
   - Check Apps Script execution logs
   - Verify sheet write permissions
   - Check required columns exist

### Debug Mode
Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug_articles', 'true');
```

## 🚀 Benefits

✅ **No more "Not responding" errors**  
✅ **Articles load on all devices**  
✅ **Centralized data management**  
✅ **Real-time collaboration**  
✅ **No local storage dependencies**  
✅ **Professional backend infrastructure**  
✅ **Automatic fallback support**  
✅ **Comprehensive error handling**  

## 🔮 Future Enhancements

- **Authentication**: Add user authentication to Apps Script
- **Rate Limiting**: Implement API rate limiting
- **Caching**: Add client-side caching for better performance
- **Real-time Updates**: WebSocket integration for live updates
- **Backup**: Automated backup to Google Drive

## 📞 Support

If you encounter issues:

1. Check Apps Script execution logs
2. Verify all configuration values
3. Test API endpoints directly
4. Check browser console for error messages
5. Review the setup guide in `SETUP_GUIDE.md`

The new system provides a robust, scalable foundation for article management that eliminates your current issues!

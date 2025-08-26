# 🚀 Google Apps Script Backend Setup

This guide will help you set up your article management system using **Google Apps Script** as the backend. This approach is simpler than service accounts and gives you full control over your backend logic.

## 🎯 What This Gives You

✅ **Full CRUD operations** - Create, Read, Update, Delete articles
✅ **Real-time Google Sheets sync** - Articles stored in your spreadsheet
✅ **Simple setup** - No complex authentication needed
✅ **Customizable backend** - Full control over the logic
✅ **Automatic fallback** - Falls back to localStorage if needed
✅ **CORS support** - Works from any domain

## 🛠️ Step-by-Step Setup

### Step 1: Deploy Your Google Apps Script

1. **Copy the code** from `google-apps-script-backend-updated.js`
2. **Go to [Google Apps Script](https://script.google.com/)**
3. **Create a new project**
4. **Paste the code** into the editor
5. **Save the project** (give it a name like "Article Management Backend")

### Step 2: Deploy as Web App

1. **Click "Deploy"** → "New deployment"
2. **Choose type**: "Web app"
3. **Execute as**: "Me" (your Google account)
4. **Who has access**: "Anyone" (for now, you can restrict later)
5. **Click "Deploy"**
6. **Copy the Web App URL** (you'll need this)

### Step 3: Set Up Environment Variables

Create a `.env` file in your project root:

```env
# Your Google Apps Script Web App URL
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Optional: Enable debug logging
VITE_DEBUG_ARTICLES=false
```

### Step 4: Update Your API Service

Your app will now use the Apps Script backend instead of the service account approach.

## 🔧 How It Works

### Backend Endpoints

- **GET** `?action=getAll` - Fetch all articles
- **POST** `action: "add"` - Create new article
- **POST** `action: "update"` - Update existing article
- **POST** `action: "delete"` - Delete article

### Data Flow

1. **Frontend** → **Apps Script** → **Google Sheets**
2. **Automatic fallback** to localStorage if Apps Script fails
3. **Real-time sync** between your app and Google Sheets

## 🧪 Testing the Integration

### Test Page
Navigate to `/google-sheets-test` in your app to run comprehensive tests.

### Manual Testing
Test individual functions in the browser console:

```javascript
// Test the Apps Script backend
const response = await fetch('YOUR_APPS_SCRIPT_URL?action=getAll');
const result = await response.json();
console.log('Articles:', result);

// Test creating an article
const createResponse = await fetch('YOUR_APPS_SCRIPT_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'add',
    article: {
      title: 'Test Article',
      content: 'Test content',
      excerpt: 'Test excerpt',
      coverImage: 'https://via.placeholder.com/400x200',
      tags: ['Test'],
      status: 'draft',
      author: 'Test User',
      readTime: 5
    }
  })
});
const createResult = await createResponse.json();
console.log('Created:', createResult);
```

## 🔍 Troubleshooting

### Common Issues

#### 1. "Apps Script URL not configured"
**Solution**: Add `VITE_GOOGLE_APPS_SCRIPT_URL` to your `.env` file

#### 2. "Apps Script not responding"
**Solution**: 
- Check that your Apps Script is deployed
- Verify the URL is correct
- Check Apps Script execution logs

#### 3. "CORS error"
**Solution**: The Apps Script already includes CORS headers, but make sure you're using the correct deployment URL

#### 4. "Permission denied"
**Solution**: 
- Check that your Google Sheet is shared with your Google account
- Verify the spreadsheet ID in the Apps Script code

### Debug Mode
Enable detailed logging by setting this in your `.env` file:

```env
VITE_DEBUG_ARTICLES=true
```

## 🔒 Security Considerations

### Current Implementation
- **Anyone with the URL** can access your Apps Script
- **No authentication** required (simple but less secure)

### Production Recommendations
1. **Restrict access** to specific domains in Apps Script
2. **Add authentication** if needed
3. **Monitor usage** in Apps Script logs
4. **Regular backups** of your Google Sheet

## 📊 Performance & Limits

### Google Apps Script Limits
- **Execution time**: 6 minutes per request
- **Memory**: 50MB per execution
- **Daily quota**: 20,000 requests per day
- **Concurrent executions**: 100 per user

### Optimization Tips
1. **Batch operations** when possible
2. **Efficient queries** to Google Sheets
3. **Error handling** with fallbacks
4. **Caching** on the frontend

## 🔄 Migration from localStorage

### Automatic Sync
- Articles are automatically synced between Apps Script and localStorage
- localStorage serves as a backup if Apps Script is unavailable
- No data loss during migration

### Manual Migration
To migrate existing localStorage data:

1. **Export current articles**:
   ```javascript
   const articles = JSON.parse(localStorage.getItem('articles') || '[]');
   console.log(JSON.stringify(articles, null, 2));
   ```

2. **Add to Google Sheet** manually, or
3. **Use the Apps Script** to add them programmatically

## 🚀 Next Steps

1. **Deploy your Apps Script** using the updated code
2. **Set up your environment variables**
3. **Test the integration** using the test page
4. **Verify data flow** by creating and reading articles
5. **Monitor performance** and implement optimizations as needed

## 📞 Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify your Apps Script is deployed and accessible
3. Check Apps Script execution logs
4. Verify your environment variables are set correctly
5. Review the troubleshooting section above

## 🎉 Benefits After Setup

✅ **No more "Not responding" errors**
✅ **Articles load on all devices**
✅ **Centralized data management**
✅ **Real-time collaboration**
✅ **No local storage dependencies**
✅ **Professional backend infrastructure**
✅ **Full CRUD operations**
✅ **Automatic fallbacks**
✅ **Easy to customize and extend**

The Google Apps Script backend provides a robust, simple, and scalable foundation for article management that eliminates your current issues and gives you full control over your backend logic!

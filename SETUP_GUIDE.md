# Google Sheets Backend Setup Guide

This guide will help you set up a Google Sheets backend for your article management system, replacing the localStorage dependency that's causing issues in hosted environments.

## Why This Solution?

- **Centralized Data**: All articles stored in one place (Google Sheets)
- **No Local Dependencies**: Works on any device/browser
- **Real-time Updates**: Changes sync across all users
- **No Database Setup**: Uses Google's infrastructure
- **Free Tier**: No hosting costs

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name the first sheet "Articles"
4. Add these headers in row 1:
   ```
   A: ID | B: Title | C: Content | D: Excerpt | E: Cover Image | F: Tags | G: Status | H: Author | I: Read Time | J: Published At | K: Created At | L: Updated At
   ```

## Step 2: Get Spreadsheet ID

1. Look at your Google Sheets URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
2. Copy the `SPREADSHEET_ID_HERE` part

## Step 3: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Name it "Article Management Backend"
4. Replace the default code with the contents of `google-apps-script-backend.js`
5. Update the `SPREADSHEET_ID` constant with your actual spreadsheet ID
6. Save the project

## Step 4: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set "Execute as" to "Me"
4. Set "Who has access" to "Anyone"
5. Click "Deploy"
6. Copy the Web App URL (you'll need this for the next step)

## Step 5: Update React App Configuration

1. Open `src/lib/articles-api.ts`
2. Update the `ARTICLES_API_URL` constant with your Web App URL:
   ```typescript
   const ARTICLES_API_URL = "https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec";
   ```

## Step 6: Test the Setup

1. Run your React app
2. Check the browser console for any API errors
3. Try creating, reading, updating, and deleting articles
4. Verify data appears in your Google Sheet

## Step 7: Migrate Existing Data

If you have existing articles in localStorage, you can migrate them:

1. Open browser console in your app
2. Run this command to export current articles:
   ```javascript
   console.log(JSON.stringify(JSON.parse(localStorage.getItem('articles') || '[]')))
   ```
3. Copy the output and manually add it to your Google Sheet
4. Or create a migration script in the Apps Script

## Troubleshooting

### CORS Errors
- Ensure your Apps Script has CORS headers (already included in the code)
- Check that the Web App URL is correct

### Permission Errors
- Make sure the Web App is deployed with "Anyone" access
- Verify you're executing as the correct user

### Data Not Loading
- Check the Apps Script logs for errors
- Verify the spreadsheet ID is correct
- Ensure the sheet name matches exactly

### Articles Not Saving
- Check the Apps Script execution logs
- Verify the sheet has write permissions
- Check that all required columns exist

## API Endpoints

Your backend now supports these operations:

- `GET ?action=getAll` - Get all articles
- `GET ?action=getPublished` - Get published articles only
- `GET ?action=getById&id=ARTICLE_ID` - Get specific article
- `GET ?action=search&query=SEARCH_TERM` - Search articles
- `GET ?action=getByTag&tag=TAG_NAME` - Get articles by tag
- `GET ?action=getStats` - Get article statistics
- `POST` with `action=create` - Create new article
- `POST` with `action=update` - Update existing article
- `POST` with `action=delete` - Delete article

## Benefits After Setup

✅ **No more "Not responding" errors**  
✅ **Articles load on all devices**  
✅ **Centralized data management**  
✅ **Real-time collaboration**  
✅ **No local storage dependencies**  
✅ **Professional backend infrastructure**  

## Security Considerations

- The current setup allows public access to your articles
- For private articles, implement authentication in the Apps Script
- Consider rate limiting for production use
- Monitor Apps Script execution quotas

## Next Steps

1. **Implement the setup** following this guide
2. **Test thoroughly** with your existing app
3. **Migrate existing data** from localStorage
4. **Update your components** to use the new hooks
5. **Deploy to production** and verify it works

## Support

If you encounter issues:
1. Check the Apps Script execution logs
2. Verify all configuration values
3. Test the API endpoints directly
4. Check browser console for error messages

The new system will eliminate your current issues and provide a robust foundation for article management!

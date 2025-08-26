# 🔗 Link Your Google Sheet

Your Google Sheet is not linked yet because the credentials are not configured. Follow these steps to connect it:

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Your .env File
Create a `.env` file in your project root (same level as `package.json`) with this content:

```env
VITE_GOOGLE_SHEETS_ID=your_actual_sheet_id_here
VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS=your_minified_credentials_here
```

### Step 2: Get Your Sheet ID
1. Open your Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/YOUR_ID_HERE/edit`
3. Replace `your_actual_sheet_id_here` in your `.env` file

### Step 3: Get Your Credentials
1. Download your service account JSON from Google Cloud Console
2. **Option A**: Use the helper script:
   - Save the JSON as `credentials.json` in this directory
   - Run: `node minify-credentials.js`
   - Copy the output to your `.env` file
3. **Option B**: Manual minification:
   - Remove all line breaks and spaces from the JSON
   - Put it all on one line
   - Replace `your_minified_credentials_here` in your `.env` file

## 🔍 What You Need

- **Google Sheet ID**: From your sheet's URL
- **Service Account JSON**: Downloaded from Google Cloud Console
- **Sheet Sharing**: Make sure your service account email has "Editor" access

## ✅ Test the Connection

1. Restart your development server
2. Go to `/google-sheets-test` in your app
3. Click "Run All Tests"
4. All tests should pass with green checkmarks

## 🆘 Still Not Working?

Check the browser console for error messages. Common issues:
- Missing `.env` file
- Incorrect environment variable names (must start with `VITE_`)
- Malformed credentials JSON
- Sheet not shared with service account

## 📚 Full Setup Guide

For detailed instructions, see `GOOGLE_SHEETS_SETUP.md`

---

**Your Google Sheet will be linked once you complete these steps!** 🎉

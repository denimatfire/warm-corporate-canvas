# Production Supabase Integration Setup

This guide will help you connect the dynamic meta tags system to your real Supabase database to fetch live data for articles, photos, and projects.

## 🚀 Step-by-Step Setup

### Step 1: Environment Variables

Create a `.env` file in your project root (if you don't have one):

```bash
# .env file
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For build scripts (Node.js environment)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these values:**
1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### Step 2: Update Supabase Integration Script

Edit `scripts/supabase-integration.js` to use real Supabase queries:

**Replace the simulated sections with real API calls:**

```javascript
// REPLACE THIS SECTION (around line 25-35)
const initializeSupabase = async () => {
  try {
    // Uncomment these lines:
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY
    );
    console.log('🔗 Supabase client initialized');
    return supabase;
    
    // Remove this line:
    // return null; // Simulated for now
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
    throw error;
  }
};
```

### Step 3: Enable Real Database Queries

In `scripts/supabase-integration.js`, replace the simulated data sections:

#### For Articles (around line 45):
```javascript
const fetchArticlesFromSupabase = async (supabase) => {
  try {
    console.log('📰 Fetching articles from Supabase...');
    
    // Uncomment this section:
    const { data, error } = await supabase
      .from('articles')  // Make sure this matches your table name
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      coverImage: article.cover_image,
      author: article.author,
      publishedAt: article.published_at,
      updatedAt: article.updated_at,
      tags: article.tags,
      readTime: article.read_time,
      category: article.category
    }));
    
    // Remove the simulated data section (lines with sample articles)
  } catch (error) {
    console.error('Error fetching articles from Supabase:', error);
    return [];
  }
};
```

#### For Photos (around line 90):
```javascript
const fetchPhotosFromSupabase = async (supabase) => {
  try {
    console.log('📸 Fetching photos from Supabase...');
    
    // Uncomment this section:
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(photo => ({
      id: photo.id,
      title: photo.title,
      caption: photo.caption,
      imageUrl: photo.image_url,
      category: photo.category,
      tags: photo.tags,
      publishedAt: photo.published_at,
      location: photo.metadata?.location
    }));
    
    // Remove the simulated data section
  } catch (error) {
    console.error('Error fetching photos from Supabase:', error);
    return [];
  }
};
```

#### For Projects (around line 135):
```javascript
const fetchProjectsFromSupabase = async (supabase) => {
  try {
    console.log('🚀 Fetching projects from Supabase...');
    
    // Uncomment this section:
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(project => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      coverImage: project.cover_image,
      tags: project.tags,
      category: project.category,
      publishedAt: project.published_at,
      presentationType: project.presentation_type
    }));
    
    // Remove the simulated data section
  } catch (error) {
    console.error('Error fetching projects from Supabase:', error);
    return [];
  }
};
```

### Step 4: Verify Your Database Schema

Make sure your Supabase tables have the expected columns:

#### Articles Table:
```sql
-- Required columns for articles table
id (uuid, primary key)
title (text)
excerpt (text)
cover_image (text)
author (text)
published_at (timestamp)
updated_at (timestamp)
tags (text[])
read_time (integer)
category (text)
status (text) -- should have 'published' value
```

#### Photos Table:
```sql
-- Required columns for photos table
id (uuid, primary key)
title (text)
caption (text)
image_url (text)
category (text)
tags (text[])
published_at (timestamp)
is_published (boolean)
metadata (jsonb) -- for location data
```

#### Projects Table:
```sql
-- Required columns for projects table
id (uuid, primary key)
slug (text)
title (text)
description (text)
cover_image (text)
tags (text[])
category (text)
published_at (timestamp)
status (text) -- should have 'published' value
presentation_type (text)
```

### Step 5: Test the Integration

1. **Test Supabase Connection:**
```bash
npm run meta:supabase
```

2. **Generate Meta Tags with Real Data:**
```bash
npm run build:production
```

3. **Verify Generated Files:**
Check the `dist/` folder for your actual articles, photos, and projects.

### Step 6: Update Build Process

Your `package.json` already has the correct scripts:

```json
{
  "scripts": {
    "build:production": "node scripts/supabase-integration.js && vite build && node scripts/inject-meta-tags.js"
  }
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Table doesn't exist" error:**
   - Check your table names in Supabase dashboard
   - Update the table names in the fetch functions

2. **"Column doesn't exist" error:**
   - Verify your database schema matches the expected columns
   - Update the column mappings in the fetch functions

3. **"No data returned" error:**
   - Check that you have published content in your database
   - Verify the status/is_published conditions

4. **Environment variables not found:**
   - Make sure your `.env` file is in the project root
   - Restart your terminal after adding environment variables

### Debug Mode:

Add this to any script to see what's happening:
```javascript
console.log('Environment check:', {
  hasSupabaseUrl: !!process.env.SUPABASE_URL,
  hasSupabaseKey: !!process.env.SUPABASE_ANON_KEY
});
```

## 🚀 Deployment

### For Netlify:

1. **Set Environment Variables in Netlify Dashboard:**
   - Go to Site Settings → Environment Variables
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **Update Build Command:**
   ```
   npm run build:production
   ```

3. **Publish Directory:**
   ```
   dist
   ```

### For Other Platforms:

Make sure to set the environment variables in your hosting platform's settings.

## ✅ Verification

After setup, you should see:

1. **Real data in generated files** (not sample data)
2. **Actual article/photo/project titles** in the HTML files
3. **Your real images and content** in the meta tags

Test a generated URL with social media validators to confirm it's working!

---

**Need Help?** 
- Check the console output for specific error messages
- Verify your Supabase permissions and RLS policies
- Ensure your database has published content to fetch

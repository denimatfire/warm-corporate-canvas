# 🔐 Supabase Setup Guide for Warm Corporate Canvas

This comprehensive guide will walk you through setting up Supabase as your backend for the Warm Corporate Canvas portfolio website, providing robust article management with real-time capabilities and automatic fallback support.

## 🎯 **What You'll Get**

- **Professional Backend**: PostgreSQL database with real-time subscriptions
- **Secure Authentication**: Row Level Security (RLS) and user management
- **Image Storage**: Supabase Storage for article cover images
- **Real-time Updates**: Live content synchronization across devices
- **Offline Support**: Automatic fallback to localStorage when needed
- **Scalable Architecture**: Built for production use

## 📋 **Prerequisites**

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js 18+ and npm installed
- Your React project ready
- Basic understanding of SQL and database concepts

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `warm-corporate-canvas` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

## 🔑 **Step 2: Get Project Credentials**

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
3. Keep the **service_role key** private (never expose in frontend)

## ⚙️ **Step 3: Set Up Environment Variables**

1. Copy `env.example` to `.env.local` in your project root:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Restart your development server after making changes

## 🗄️ **Step 4: Create Database Schema**

### 4.1 Create Articles Table

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste this SQL:

```sql
-- Create articles table with enhanced schema
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  cover_image_path TEXT,  -- New field for image storage paths
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL,
  read_time INTEGER DEFAULT 1,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);
CREATE INDEX idx_articles_author ON articles(author);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
CREATE POLICY "Public read access for published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create articles" ON articles
  FOR INSERT WITH (auth.role() = 'authenticated');

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid()::text = author);

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid()::text = author);

-- Allow authors to read their own drafts
CREATE POLICY "Authors can read own articles" ON articles
  FOR SELECT USING (auth.uid()::text = author);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE articles;
```

3. Click "Run" to execute the SQL

### 4.2 Create Storage Bucket (Optional but Recommended)

For better image management, create a storage bucket:

```sql
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'article-images', 
  'article-images', 
  true, 
  52428800,  -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies
CREATE POLICY "Public read access to article images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload article images" ON storage.objects
  FOR INSERT WITH (
    bucket_id = 'article-images' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own article images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'article-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own article images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'article-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## 🧪 **Step 5: Test the Setup**

### 5.1 Start Development Server

```bash
npm run dev
```

### 5.2 Verify Supabase Connection

1. Open your browser to `http://localhost:5173`
2. Open browser console (F12)
3. Look for any Supabase connection errors
4. Navigate to the Writing or Article Management section
5. Try creating a test article

### 5.3 Check API Endpoints

The following API functions should work:
- ✅ `articlesApi.getAll()` - Fetch all articles
- ✅ `articlesApi.create()` - Create new article
- ✅ `articlesApi.update()` - Update article
- ✅ `articlesApi.delete()` - Delete article
- ✅ Real-time subscriptions

## 📊 **Step 6: Insert Sample Data (Optional)**

In the SQL Editor, run this to add sample articles:

```sql
INSERT INTO articles (title, content, excerpt, cover_image, tags, status, author, read_time) VALUES
(
  'Getting Started with Warm Corporate Canvas',
  'This is a sample article content about building a modern portfolio website...',
  'Learn how to set up and customize your portfolio website',
  'https://via.placeholder.com/800x400',
  ARRAY['portfolio', 'tutorial', 'web-development'],
  'published',
  'Your Name',
  5
),
(
  'Building a Blog with React and Supabase',
  'Another sample article about building modern web applications...',
  'Step-by-step guide to building a blog with modern technologies',
  'https://via.placeholder.com/800x400',
  ARRAY['react', 'supabase', 'blog', 'typescript'],
  'draft',
  'Your Name',
  8
),
(
  'Advanced Image Editing in Rich Text Editors',
  'Explore the powerful image editing capabilities...',
  'Learn how to use advanced image editing features in your content',
  'https://via.placeholder.com/800x400',
  ARRAY['image-editing', 'quill', 'tiptap', 'content-management'],
  'published',
  'Your Name',
  6
);
```

## 🌐 **Step 7: Configure CORS and Settings**

### 7.1 CORS Configuration

1. Go to **Settings** → **API**
2. Under "API Settings", add your frontend URLs to allowed origins:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`

### 7.2 Authentication Settings

1. Go to **Authentication** → **Settings**
2. Configure your site URL and redirect URLs
3. Set up email templates if using email authentication
4. Configure OAuth providers if needed

## 🔍 **Step 8: Test CRUD Operations**

Your React app should now be able to:
- ✅ Create articles with rich content
- ✅ Read articles with real-time updates
- ✅ Update articles with image editing
- ✅ Delete articles with confirmation
- ✅ Search articles by title and content
- ✅ Filter by tags and status
- ✅ Get comprehensive statistics
- ✅ Handle image uploads and storage

## 🚨 **Troubleshooting**

### Common Issues:

1. **"Missing Supabase environment variables"**
   ```bash
   # Check your .env.local file exists and has correct values
   cat .env.local
   
   # Restart your dev server after changing .env
   npm run dev
   ```

2. **CORS errors**
   - Add your frontend URL to Supabase CORS settings
   - Check browser console for specific error messages
   - Ensure you're using the correct environment file

3. **Authentication errors**
   - Ensure your anon key is correct
   - Check if RLS policies are properly configured
   - Verify user authentication status

4. **Database connection issues**
   - Verify your project URL is correct
   - Check if your Supabase project is active
   - Ensure database is not paused (free tier limitation)

5. **Real-time not working**
   - Check if real-time is enabled in your project
   - Verify subscription setup in your React components
   - Check network connectivity

### Performance Issues:

1. **Slow queries**: Add appropriate database indexes
2. **Large images**: Implement image compression and optimization
3. **Bundle size**: Use `npm run build:dev` for development

## 🔒 **Security Best Practices**

- ✅ **RLS Enabled**: Row Level Security is active by default
- ✅ **Anon Key Safe**: The anon key is safe to expose in frontend code
- ✅ **Service Role Private**: Never expose service role key in frontend
- ✅ **Policy Review**: Regularly review and update RLS policies
- ✅ **Input Validation**: Validate all user inputs on both frontend and backend

## 📚 **Next Steps**

Once everything is working:

1. **Set up user authentication** with Supabase Auth
2. **Configure file uploads** for cover images using Supabase Storage
3. **Add real-time subscriptions** for live updates
4. **Implement advanced features** like comments and likes
5. **Set up backup and monitoring** for production
6. **Deploy to production** with proper environment variables

## 🆘 **Getting Help**

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
- [Project Documentation](PROJECT_STRUCTURE.md)

## 🎉 **Congratulations!**

You've successfully set up Supabase for your Warm Corporate Canvas project! You now have:

- ✅ Professional PostgreSQL backend
- ✅ Real-time data synchronization
- ✅ Secure authentication system
- ✅ Image storage capabilities
- ✅ Comprehensive article management
- ✅ Production-ready architecture

Happy coding! 🚀

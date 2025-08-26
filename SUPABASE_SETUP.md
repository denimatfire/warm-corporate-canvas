# Supabase Setup Guide for Article Management

This guide will walk you through setting up Supabase as your backend for article management, replacing the Google Sheets implementation.

## Prerequisites

- A Supabase account (free at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your React project ready

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `article-management` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

## Step 2: Get Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Copy `env.example` to `.env` in your project root
2. Update the values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste this SQL:

```sql
-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL,
  read_time INTEGER DEFAULT 1,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public read access" ON articles
  FOR SELECT USING (true);

-- Create policy for authenticated users to manage articles
CREATE POLICY "Authenticated users can manage articles" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

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
```

3. Click "Run" to execute the SQL

## Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. If successful, you should see no errors

## Step 6: Insert Sample Data (Optional)

In the SQL Editor, run this to add sample articles:

```sql
INSERT INTO articles (title, content, excerpt, cover_image, tags, status, author, read_time) VALUES
(
  'Getting Started with Supabase',
  'This is a sample article content about Supabase...',
  'Learn how to set up Supabase for your project',
  'https://via.placeholder.com/800x400',
  ARRAY['supabase', 'tutorial', 'backend'],
  'published',
  'Your Name',
  5
),
(
  'Building a Blog with React and Supabase',
  'Another sample article about building blogs...',
  'Step-by-step guide to building a blog',
  'https://via.placeholder.com/800x400',
  ARRAY['react', 'supabase', 'blog'],
  'draft',
  'Your Name',
  8
);
```

## Step 7: Configure CORS (if needed)

1. Go to **Settings** → **API**
2. Under "API Settings", add your frontend URL to allowed origins:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`

## Step 8: Test CRUD Operations

Your React app should now be able to:
- ✅ Create articles
- ✅ Read articles
- ✅ Update articles
- ✅ Delete articles
- ✅ Search articles
- ✅ Filter by tags
- ✅ Get statistics

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists and has correct values
   - Restart your dev server after changing `.env`

2. **CORS errors**
   - Add your frontend URL to Supabase CORS settings
   - Check browser console for specific error messages

3. **Authentication errors**
   - Ensure your anon key is correct
   - Check if RLS policies are properly configured

4. **Database connection issues**
   - Verify your project URL is correct
   - Check if your Supabase project is active

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

Once everything is working:
1. Set up user authentication (if needed)
2. Configure file uploads for cover images
3. Add real-time subscriptions for live updates
4. Set up backup and monitoring
5. Deploy to production

## Security Notes

- The anon key is safe to expose in frontend code
- Row Level Security (RLS) is enabled by default
- Consider adding more restrictive policies based on your needs
- Never expose your service role key in frontend code

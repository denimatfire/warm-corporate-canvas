# 🚀 Warm Corporate Canvas - Development Setup Guide

This comprehensive guide will help you set up the development environment for the Warm Corporate Canvas portfolio website, which uses Supabase as the primary backend with automatic fallback support.

## 🎯 **What This Project Offers**

- **Modern Tech Stack**: React 18, TypeScript 5, Vite 5, Tailwind CSS
- **Professional Backend**: Supabase (PostgreSQL + Real-time + Auth)
- **Advanced Editors**: Enhanced Quill with image editing + TipTap editor
- **Responsive Design**: Mobile-first approach with touch gestures
- **Real-time Features**: Live updates with offline fallback support
- **Security**: Row Level Security (RLS) and authentication

## 📋 **Prerequisites**

Before you begin, ensure you have:

- **Node.js 18+** and npm (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **Git** for version control
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🚀 **Step 1: Clone and Setup**

```bash
# Clone the repository
git clone <your-repo-url>
cd warm-corporate-canvas

# Install dependencies
npm install

# Verify installation
npm run dev
```

## 🔐 **Step 2: Supabase Setup**

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `warm-corporate-canvas` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

### 2.2 Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 2.3 Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 🗄️ **Step 3: Database Schema Setup**

### 3.1 Create Articles Table

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and run this SQL:

```sql
-- Create articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  cover_image_path TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL,
  read_time INTEGER DEFAULT 1,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your needs)
CREATE POLICY "Public read access" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can create" ON articles
  FOR INSERT WITH (auth.role() = 'authenticated');

CREATE POLICY "Users can update own articles" ON articles
  FOR UPDATE USING (auth.uid()::text = author);

CREATE POLICY "Users can delete own articles" ON articles
  FOR DELETE USING (auth.uid()::text = author);

-- Create indexes for better performance
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at);
CREATE INDEX idx_articles_tags ON articles USING GIN(tags);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE articles;
```

### 3.2 Create Storage Bucket (Optional)

If you want to use Supabase Storage for images:

```sql
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('article-images', 'article-images', true);

-- Create storage policy
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH (bucket_id = 'article-images' AND auth.role() = 'authenticated');
```

## 🔧 **Step 4: Test Your Setup**

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Verify Supabase Connection

1. Open your browser to `http://localhost:5173`
2. Open browser console (F12)
3. Look for any Supabase connection errors
4. Navigate to the Writing or Article Management section
5. Try creating a test article

### 4.3 Check API Endpoints

The following API functions should work:
- ✅ `articlesApi.getAll()` - Fetch all articles
- ✅ `articlesApi.create()` - Create new article
- ✅ `articlesApi.update()` - Update article
- ✅ `articlesApi.delete()` - Delete article
- ✅ Real-time subscriptions

## 🎨 **Step 5: Customization**

### 5.1 Update Site Information

Edit these files to customize your portfolio:

- **`src/components/Hero.tsx`** - Main landing section
- **`src/components/About.tsx`** - Professional overview
- **`src/components/Contact.tsx`** - Contact information
- **`src/components/Photos.tsx`** - Photo gallery

### 5.2 Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your authentication providers
3. Set up email templates
4. Configure redirect URLs

### 5.3 Customize Styling

- **`tailwind.config.ts`** - Tailwind CSS configuration
- **`src/index.css`** - Global styles
- **`src/components/ui/`** - Shadcn/UI components

## 🚀 **Step 6: Development Workflow**

### 6.1 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build:dev    # Build for development

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### 6.2 File Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/UI components
│   ├── ArticleEditor.tsx    # Enhanced Quill editor
│   ├── TipTapEditor.tsx     # TipTap editor
│   └── ...                 # Other components
├── pages/              # Page components
├── lib/                # Utilities and API
│   ├── articles-api.ts     # Supabase API integration
│   ├── image-upload.ts     # Image handling
│   └── utils.ts            # Helper functions
├── hooks/              # Custom React hooks
├── data/               # Data management
└── assets/             # Static assets
```

## 🔍 **Troubleshooting**

### Common Issues

#### Supabase Connection Errors
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify in .env.local file
cat .env.local
```

#### Build Errors
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist
npm run build
```

#### Database Permission Errors
1. Check RLS policies in Supabase
2. Verify user authentication status
3. Check table permissions

#### Real-time Not Working
1. Ensure real-time is enabled in Supabase
2. Check network connectivity
3. Verify subscription setup

### Performance Issues

1. **Database**: Add appropriate indexes
2. **Images**: Optimize and compress images
3. **Bundle**: Use `npm run build:dev` for development
4. **Caching**: Implement proper caching strategies

## 📚 **Next Steps**

After successful setup:

1. **Read the Documentation**:
   - [Project Structure](PROJECT_STRUCTURE.md)
   - [Article Management](ARTICLE_MANAGEMENT_README.md)
   - [Quill Enhancements](QUILL_ENHANCEMENTS.md)

2. **Explore Features**:
   - Try the enhanced Quill editor
   - Test the TipTap editor
   - Explore the photo gallery
   - Test authentication

3. **Customize**:
   - Update content and branding
   - Modify color schemes
   - Add your own components

4. **Deploy**:
   - Connect to Netlify
   - Set up environment variables
   - Configure custom domain

## 🆘 **Getting Help**

If you encounter issues:

1. **Check the logs**: Browser console and terminal
2. **Review documentation**: All .md files in the project
3. **Supabase dashboard**: Check logs and metrics
4. **Community**: Supabase Discord, GitHub Issues

## 🎉 **Congratulations!**

You've successfully set up the Warm Corporate Canvas development environment! The project now has:

- ✅ Modern React + TypeScript setup
- ✅ Supabase backend with real-time capabilities
- ✅ Enhanced rich text editors
- ✅ Responsive design system
- ✅ Professional development workflow

Happy coding! 🚀

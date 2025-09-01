# 🚀 Setup Guide - Warm Corporate Canvas

## 📋 **Overview**

This guide will help you set up the Warm Corporate Canvas project locally. The project is a modern portfolio website with integrated content management capabilities, built with React, TypeScript, and Supabase.

## 🎯 **Prerequisites**

### **Required Software**
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or yarn)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### **Required Accounts**
- **Supabase** account for backend services
- **GitHub** account for repository access

## 🏗️ **Project Architecture**

### **Frontend Stack**
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

### **Backend Stack**
- **Supabase** - PostgreSQL database + authentication + storage
- **React Query** - Server state management
- **LocalStorage** - Offline fallback support

### **Content Management**
- **TipTap** - Rich text editor with image support
- **Resizable Images** - Interactive image editing
- **Image Upload** - Drag & drop file management

## 🚀 **Quick Start**

### **1. Clone the Repository**

```bash
git clone <your-repository-url>
cd dasdhrubajyoti-portfolio
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Environment Setup**

Copy the environment template and configure your Supabase credentials:

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### **4. Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ **Supabase Setup**

### **1. Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### **2. Database Setup**

Run the following SQL scripts in your Supabase SQL Editor:

#### **Articles Table**
```sql
-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  cover_image_path TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author TEXT NOT NULL,
  read_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON articles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON articles FOR DELETE USING (auth.role() = 'authenticated');
```

#### **Photos Table**
```sql
-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'Uncategorized',
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON photos FOR SELECT USING (is_published = true);
CREATE POLICY "Allow authenticated insert" ON photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON photos FOR DELETE USING (auth.role() = 'authenticated');
```

#### **Contacts Table**
```sql
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public contact form submissions" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated users to read contacts" ON contacts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update contacts" ON contacts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete contacts" ON contacts FOR DELETE USING (auth.role() = 'authenticated');
```

### **3. Storage Setup**

1. Go to Storage in your Supabase dashboard
2. Create the following buckets:
   - **Article_images** - For article cover images
   - **portfolio-photos** - For photo gallery images

3. Set bucket policies to allow public read access

### **4. Authentication Setup**

1. Go to Authentication in your Supabase dashboard
2. Configure email templates if needed
3. Set up any additional providers (Google, GitHub, etc.)

## 🔧 **Development Workflow**

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database
npm run db:reset     # Reset database (if configured)
npm run db:migrate   # Run migrations (if configured)
```

### **Code Quality**

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Responsive design** principles

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### **Design Principles**
- **Mobile-first** approach
- **Touch-friendly** interactions
- **Performance** optimized
- **Accessibility** compliant

## 🔐 **Security Features**

### **Authentication**
- **Supabase Auth** integration
- **Protected routes** for admin areas
- **Role-based access** control

### **Data Protection**
- **Row Level Security** (RLS)
- **Input validation** on client and server
- **SQL injection** prevention
- **XSS protection**

## 🚀 **Deployment**

### **Netlify (Recommended)**

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables
5. Deploy!

### **Environment Variables for Production**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Supabase Connection Errors**
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies are configured

#### **Build Errors**
- Clear `node_modules` and reinstall
- Check TypeScript errors
- Verify all dependencies are installed

#### **Image Upload Issues**
- Check Supabase storage bucket permissions
- Verify file size limits
- Check authentication status

### **Getting Help**

1. **Check the documentation** files
2. **Review Supabase logs** in dashboard
3. **Check browser console** for errors
4. **Verify environment variables** are set correctly

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

## 🎯 **Next Steps**

After setup:
1. **Test the application** locally
2. **Create your first article** using the editor
3. **Upload some photos** to the gallery
4. **Test the contact form** functionality
5. **Customize the design** to match your brand

---

**Happy coding! 🚀**

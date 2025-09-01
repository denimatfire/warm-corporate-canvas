# 🎯 Warm Corporate Canvas - Portfolio & Content Management System

A modern, responsive portfolio website with integrated content management capabilities, built with React, TypeScript, and Supabase.

## ✨ **Key Features**

- 🎨 **Modern Portfolio Design** - Clean, professional interface with smooth animations
- 📝 **Advanced Content Management** - TipTap rich text editor with image support
- 📸 **Photo Gallery Management** - Upload, organize, and display photos
- 📧 **Contact Form System** - Integrated with Supabase database
- 🔐 **Role-Based Access Control** - Writer and admin permissions
- 📱 **Mobile-First Responsive Design** - Works perfectly on all devices
- 🚀 **Real-time Updates** - Instant data synchronization with Supabase

## 🛠️ **Tech Stack**

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Supabase (Database + Authentication + Storage)
- **Editor**: TipTap (Rich text editing with image support)
- **State Management**: React Query + React Hooks
- **UI Components**: Custom component library with shadcn/ui

## 📁 **Project Structure**

```
src/
├── components/           # Reusable UI components
│   ├── ArticleEditor.tsx    # Article creation/editing with TipTap
│   ├── Article_medium.tsx   # Article viewing component
│   ├── Navigation.tsx       # Main navigation
│   ├── Hero.tsx            # Hero section with timeline
│   ├── About.tsx           # About section
│   ├── Writing.tsx         # Articles listing
│   ├── Photos.tsx          # Photo gallery
│   ├── Contact.tsx         # Contact form
│   ├── TipTapEditor.tsx    # Rich text editor
│   └── ui/                 # UI component library
├── pages/                 # Page components
│   ├── Index.tsx           # Homepage
│   ├── Portfolio.tsx       # Portfolio layout
│   ├── ArticleManagement.tsx # Admin article management
│   ├── PhotoManagement.tsx  # Admin photo management
│   └── ContactViewer.tsx    # Contact form submissions
├── lib/                   # API and utility functions
│   ├── articles-api.ts     # Article management API
│   ├── photos-api.ts       # Photo management API
│   ├── contact-api.ts      # Contact form API
│   ├── image-upload.ts     # Image upload utilities
│   └── utils.ts            # Helper functions
└── data/                  # Data models and utilities
    ├── articles.ts         # Article data management
    ├── blogs.ts            # Legacy blog data (for migration)
    └── auth.ts             # Authentication utilities
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ and npm/yarn
- Supabase account and project

### **Installation**
1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the development server: `npm run dev`

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 **Documentation**

- [Setup Guide](SETUP_GUIDE.md) - Complete setup instructions
- [Supabase Setup](SUPABASE_SETUP.md) - Database and authentication setup
- [TipTap Editor](TIPTAP_EDITOR_README.md) - Rich text editor features
- [Photo Management](PHOTO_MANAGEMENT_SETUP.md) - Photo system setup
- [Contact Form Migration](CONTACT_FORM_MIGRATION.md) - Supabase integration
- [Project Structure](PROJECT_STRUCTURE.md) - Detailed project overview

## 🎨 **Features Overview**

### **Content Management**
- **Article Creation**: Rich text editing with TipTap
- **Image Support**: Drag & drop, resizable images
- **Draft System**: Save and publish workflow
- **Tag Management**: Organize content with tags

### **Photo Gallery**
- **Upload System**: Drag & drop photo uploads
- **Organization**: Categories, tags, and metadata
- **Responsive Grid**: Mobile-optimized display
- **Admin Management**: Full CRUD operations

### **Contact System**
- **Form Integration**: Supabase database storage
- **Admin Interface**: View and manage submissions
- **Status Tracking**: New, read, replied, archived
- **Email Integration**: Automatic notifications

## 🔧 **Development**

### **Available Scripts**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### **Code Quality**
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Responsive design principles

## 📱 **Responsive Design**

- **Mobile-First**: Optimized for mobile devices
- **Breakpoint System**: Tailwind CSS responsive utilities
- **Touch-Friendly**: Optimized for touch interactions
- **Performance**: Optimized images and animations

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🆘 **Support**

For questions or issues:
- Check the documentation files
- Review the project structure
- Check Supabase dashboard for database issues
- Verify environment variables are set correctly

---

**Built with ❤️ using modern web technologies**

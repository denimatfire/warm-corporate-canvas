# 🏗️ Project Structure - Warm Corporate Canvas

## 📋 **Overview**

**Warm Corporate Canvas** is a modern portfolio website with integrated content management capabilities, built with React, TypeScript, and Supabase. The project features a clean, responsive design with advanced content management, photo galleries, and contact systems.

## 🎯 **Core Architecture**

```
dasdhrubajyoti-portfolio/
├── 📁 src/                    # Source code
│   ├── 📁 components/         # Reusable UI components
│   ├── 📁 pages/             # Page components and routing
│   ├── 📁 lib/               # API and utility functions
│   ├── 📁 data/              # Data models and utilities
│   ├── 📁 hooks/             # Custom React hooks
│   ├── 📁 assets/            # Static assets and images
│   └── 📁 ui/                # UI component library
├── 📁 public/                 # Public assets
├── 📁 dist/                   # Build output
├── 📄 package.json            # Dependencies and scripts
├── 📄 vite.config.ts          # Vite configuration
├── 📄 tailwind.config.ts      # Tailwind CSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 .env.example            # Environment variables template
```

## 🧩 **Component Architecture**

### **📁 src/components/** - Core UI Components

```
components/
├── 🎨 ArticleEditor.tsx          # Article creation/editing with TipTap (879 lines)
├── 📄 Article_medium.tsx         # Article viewing component (754 lines)
├── 🧭 Navigation.tsx             # Main navigation with authentication (312 lines)
├── 🚀 Hero.tsx                   # Hero section with timeline (205 lines)
├── 👤 About.tsx                  # About section (106 lines)
├── ✍️ Writing.tsx                # Articles listing component (227 lines)
├── 📸 Photos.tsx                 # Photo gallery component (295 lines)
├── 📧 Contact.tsx                # Contact form component (211 lines)
├── ✏️ TipTapEditor.tsx           # Rich text editor (1606 lines)
├── 🖼️ ResizableImage.tsx         # Resizable image component (160 lines)
├── 🔧 ResizableImageExtension.ts # TipTap extension for resizable images (91 lines)
├── 🎮 SnakeGame.tsx              # Interactive game component (225 lines)
├── 🔒 ProtectedRoute.tsx         # Route protection component (214 lines)
├── 📊 MetaTagTester.tsx          # Meta tag testing component (135 lines)
├── 📋 ArticleList.tsx            # Article list component (491 lines)
├── 👁️ PhotoViewer.tsx            # Photo viewing component (109 lines)
├── 🎮 SnakeGame.tsx              # Interactive game component (225 lines)
└── 📁 ui/                        # UI component library
    ├── 🎨 Button.tsx             # Button component
    ├── 📝 Input.tsx              # Input field component
    ├── 🏷️ Badge.tsx               # Badge component
    ├── 🎴 Card.tsx                # Card component
    ├── 🔽 Select.tsx              # Select dropdown component
    ├── 📋 Textarea.tsx            # Textarea component
    ├── 🏷️ Label.tsx               # Label component
    ├── 🔔 Toast.tsx               # Toast notification component
    ├── 🎭 Dialog.tsx              # Dialog/modal component
    ├── 🎨 Avatar.tsx              # Avatar component
    ├── 📊 Separator.tsx           # Separator component
    ├── 🎯 Tooltip.tsx             # Tooltip component
    └── ...                        # Additional UI components
```

### **📁 src/pages/** - Page Components

```
pages/
├── 🏠 Index.tsx                  # Homepage (8 lines)
├── 🎨 Portfolio.tsx              # Portfolio layout (22 lines)
├── ✍️ ArticleManagement.tsx      # Admin article management (577 lines)
├── 📸 PhotoManagement.tsx        # Admin photo management (709 lines)
├── 📧 ContactViewer.tsx          # Contact form submissions (317 lines)
├── 🔐 LoginPage.tsx              # User authentication (174 lines)
├── 📸 Photos.tsx                 # Public photos page (15 lines)
├── ✍️ Writing.tsx                # Public writing page (15 lines)
└── ❌ NotFound.tsx                # 404 error page (56 lines)
```

### **📁 src/lib/** - API and Utilities

```
lib/
├── 📚 articles-api.ts            # Article management API (497 lines)
├── 📸 photos-api.ts              # Photo management API (457 lines)
├── 📧 contact-api.ts             # Contact form API (new)
├── 🖼️ image-upload.ts            # Image upload utilities (300 lines)
├── 🏷️ meta-tags.ts               # Meta tag management (new)
├── 📧 email-config.ts            # Email configuration (69 lines)
├── 📊 sheets.ts                  # Google Sheets integration (deleted)
└── 🛠️ utils.ts                   # Helper functions (62 lines)
```

### **📁 src/data/** - Data Management

```
data/
├── 📚 articles.ts                # Article data management (456 lines)
├── 📝 blogs.ts                   # Legacy blog data (447 lines)
└── 🔐 auth.ts                    # Authentication utilities (new)
```

### **📁 src/hooks/** - Custom Hooks

```
hooks/
├── 📚 use-articles.ts            # Article management hooks (new)
├── 📱 use-mobile.tsx             # Mobile detection hook (new)
└── 🔔 use-toast.ts               # Toast notification hook (new)
```

## 🗄️ **Database Architecture**

### **Supabase Tables**

```
supabase/
├── 📊 articles                   # Article content and metadata
├── 📸 photos                     # Photo gallery and metadata
├── 📧 contacts                   # Contact form submissions
├── 👥 profiles                   # User profiles and permissions
└── 🔐 auth.users                 # Authentication users
```

### **Key Relationships**

- **articles** ↔ **profiles** (author relationship)
- **photos** ↔ **profiles** (uploader relationship)
- **contacts** ↔ **profiles** (submission tracking)

## 🔧 **Technology Stack**

### **Frontend Framework**
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Modern UI component library

### **Backend & Database**
- **Supabase** - PostgreSQL database + authentication
- **React Query** - Server state management
- **LocalStorage** - Offline fallback support

### **Content Management**
- **TipTap** - Rich text editor with image support
- **Resizable Images** - Interactive image editing
- **Image Upload** - Drag & drop file management

## 🚀 **Key Features**

### **Content Management System**
- **Article Editor**: TipTap-based rich text editing
- **Image Support**: Resizable images with drag & drop
- **Draft System**: Save and publish workflow
- **Tag Management**: Content organization system

### **Photo Gallery System**
- **Upload Management**: Drag & drop photo uploads
- **Organization**: Categories, tags, and metadata
- **Responsive Grid**: Mobile-optimized display
- **Admin Interface**: Full CRUD operations

### **Contact Management**
- **Form Integration**: Supabase database storage
- **Admin Interface**: View and manage submissions
- **Status Tracking**: New, read, replied, archived
- **Email Integration**: Automatic notifications

### **User Management**
- **Authentication**: Supabase-powered user system
- **Role-Based Access**: Writer and admin permissions
- **Protected Routes**: Secure admin interfaces

## 📱 **Responsive Design**

### **Mobile-First Approach**
- **Breakpoint System**: Tailwind CSS responsive utilities
- **Touch Optimization**: Touch-friendly interactions
- **Performance**: Optimized images and animations
- **Accessibility**: WCAG compliance features

### **Design Principles**
- **Clean Interface**: Minimal, professional design
- **Smooth Animations**: Framer Motion-powered interactions
- **Consistent Spacing**: Tailwind CSS spacing system
- **Color System**: Consistent color palette

## 🔐 **Security Features**

### **Authentication & Authorization**
- **Supabase Auth**: Secure user authentication
- **Row Level Security**: Database-level access control
- **Protected Routes**: Component-level route protection
- **Role-Based Access**: Permission-based features

### **Data Protection**
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based security

## 🚀 **Development Workflow**

### **Local Development**
1. **Environment Setup**: Configure Supabase credentials
2. **Dependencies**: Install with `npm install`
3. **Development Server**: Run with `npm run dev`
4. **Hot Reload**: Instant code updates

### **Build & Deployment**
1. **Production Build**: `npm run build`
2. **Preview**: `npm run preview`
3. **Deployment**: Netlify integration
4. **Environment Variables**: Secure configuration

## 📚 **Documentation Structure**

### **Core Documentation**
- **README.md** - Project overview and quick start
- **SETUP_GUIDE.md** - Complete setup instructions
- **PROJECT_STRUCTURE.md** - This detailed architecture guide

### **Feature Documentation**
- **TIPTAP_EDITOR_README.md** - Rich text editor features
- **PHOTO_MANAGEMENT_SETUP.md** - Photo system setup
- **SUPABASE_SETUP.md** - Database and authentication setup
- **CONTACT_FORM_MIGRATION.md** - Contact system integration

### **Technical Documentation**
- **MOBILE_RESPONSIVENESS_README.md** - Responsive design guide
- **KEYBOARD_SHORTCUTS.md** - Editor shortcuts reference
- **DYNAMIC_META_TAGS_README.md** - SEO optimization guide

## 🔄 **Recent Updates**

### **v2.0.0 - Supabase Integration**
- ✅ **Backend Migration**: Moved from Google Sheets to Supabase
- ✅ **Contact System**: Integrated contact form with database
- ✅ **Component Cleanup**: Removed unused legacy components
- ✅ **Editor Migration**: Moved from Quill to TipTap
- ✅ **Performance**: Improved loading and responsiveness

### **Component Cleanup**
- ❌ **Removed**: QuillDemo, QuillTest, TipTapDemo
- ❌ **Removed**: PublishedArticle, EnhancedImageUpload
- ❌ **Removed**: InstagramPhotos, BlogModal
- ❌ **Removed**: ArticleTest, ArticleListExample
- ❌ **Removed**: GoogleSheetsTestPage, sheets.ts

## 🎯 **Future Roadmap**

### **Planned Features**
- **Analytics Dashboard**: Content performance metrics
- **Advanced Search**: Full-text search capabilities
- **Media Library**: Centralized asset management
- **API Documentation**: Developer-friendly API docs

### **Technical Improvements**
- **Performance**: Bundle optimization and lazy loading
- **Testing**: Unit and integration test coverage
- **Monitoring**: Error tracking and performance monitoring
- **CI/CD**: Automated testing and deployment

---

**This project structure reflects the current state after comprehensive cleanup and modernization. All components are actively used in production and the architecture follows modern React best practices.**

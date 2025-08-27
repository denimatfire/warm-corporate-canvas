# 🏗️ Warm Corporate Canvas - Project Structure & Architecture

## 📋 **Project Overview**
A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS, featuring article management, photo galleries, and professional presentation capabilities. Now powered by Supabase for robust backend functionality with automatic fallback support, and enhanced with both Quill and TipTap rich text editors.

---

## 🗂️ **File Structure**

### **🌳 Root Directory**
```
warm-corporate-canvas/
├── 📄 package.json              # Dependencies & scripts (105 lines)
├── 📄 vite.config.ts            # Vite build configuration
├── 🎨 tailwind.config.ts        # Tailwind CSS + custom gradients
├── 📝 tsconfig.json             # TypeScript configuration
├── 📝 tsconfig.app.json         # App-specific TypeScript config
├── 📝 tsconfig.node.json        # Node-specific TypeScript config
├── 📚 README.md                 # Project documentation
├── 🚀 SETUP_GUIDE.md            # Development setup instructions
├── 🔄 BACKEND_COMPARISON.md     # Backend approach analysis
├── 📊 ARTICLE_MANAGEMENT_README.md  # Article system documentation
├── 🔐 SUPABASE_SETUP.md         # Supabase backend setup guide
├── 📚 ARTICLES_BACKEND_README.md    # Articles backend system docs
├── ✨ QUILL_ENHANCEMENTS.md     # Enhanced Quill editor documentation
├── 🔤 TIPTAP_EDITOR_README.md   # TipTap editor documentation
├── ⚙️ eslint.config.js          # Code linting rules
├── 🎯 postcss.config.js         # PostCSS configuration
├── 📦 bun.lockb                 # Bun package lock (193KB)
├── 📦 package-lock.json         # NPM package lock (293KB)
├── 🎨 components.json           # Shadcn/UI configuration
├── 🌐 netlify.toml              # Netlify deployment configuration
├── 🗂️ .git/                     # Git repository
├── 🗂️ .gitignore                # Git ignore rules
├── 🗂️ dist/                     # Production build output
├── 🗂️ node_modules/             # Dependencies
├── 📄 env.example               # Environment variables template
├── 📄 ADD_COVER_IMAGE_PATH_COLUMN.sql  # Database migration script
└── 📄 tatus                     # Git status file
```

---

## 📁 **Source Directory (`src/`)**

### **🎯 Entry Points**
```
src/
├── 🚀 main.tsx                  # React app bootstrap (7 lines)
├── 🎭 App.tsx                   # Main routing & app structure (51 lines)
├── 🎨 index.css                 # Global styles (325 lines)
├── 🎨 App.css                   # App-specific styles (43 lines)
└── 📝 vite-env.d.ts             # Vite type definitions (2 lines)
```

### **🧩 Core Components (`src/components/`)**

#### **🔧 Navigation & Layout**
```
components/
├── 🧭 Navigation.tsx            # Main navigation component (265 lines)
│   ├── Mobile menu with animations
│   ├── Time-based greetings
│   ├── Date display
│   ├── Smooth scroll handling
│   └── Touch gesture support
│
├── 🎨 ui/                       # Shadcn/UI component library (40+ components)
│   ├── 🎯 accordion.tsx         # Collapsible content
│   ├── 🚨 alert-dialog.tsx      # Confirmation dialogs
│   ├── 🚨 alert.tsx             # Alert notifications
│   ├── 📐 aspect-ratio.tsx      # Responsive aspect ratios
│   ├── 👤 avatar.tsx            # User avatars
│   ├── 🏷️ badge.tsx             # Status badges
│   ├── 🍞 breadcrumb.tsx        # Navigation breadcrumbs
│   ├── 🔘 button.tsx            # Interactive buttons
│   ├── 📅 calendar.tsx          # Date picker
│   ├── 🃏 card.tsx              # Content cards
│   ├── 🎠 carousel.tsx          # Image carousels
│   ├── 📊 chart.tsx             # Data visualization
│   ├── ☑️ checkbox.tsx           # Form checkboxes
│   ├── 📁 collapsible.tsx       # Collapsible sections
│   ├── ⌨️ command.tsx            # Command palette
│   ├── 📋 context-menu.tsx      # Right-click menus
│   ├── 💬 dialog.tsx            # Modal dialogs
│   ├── 🗄️ drawer.tsx            # Side drawers
│   ├── 📋 dropdown-menu.tsx     # Dropdown menus
│   ├── 📝 form.tsx              # Form components
│   ├── 💭 hover-card.tsx        # Hover information cards
│   ├── 🔢 input-otp.tsx         # OTP input fields
│   ├── 📥 input.tsx             # Text inputs
│   ├── 🏷️ label.tsx              # Form labels
│   ├── 🍔 menubar.tsx           # Menu bars
│   ├── 🧭 navigation-menu.tsx   # Navigation menus
│   ├── 📄 pagination.tsx        # Page navigation
│   ├── 💬 popover.tsx           # Popover content
│   ├── 📊 progress.tsx          # Progress indicators
│   ├── 🔘 radio-group.tsx       # Radio button groups
│   ├── 📐 resizable.tsx         # Resizable panels
│   ├── 📜 scroll-area.tsx       # Custom scroll areas
│   ├── 📋 select.tsx            # Dropdown selects
│   ├── ➗ separator.tsx          # Visual separators
│   ├── 📄 sheet.tsx             # Side sheets
│   ├── 📱 sidebar.tsx           # Sidebar navigation
│   ├── 💀 skeleton.tsx          # Loading skeletons
│   ├── 🎚️ slider.tsx             # Range sliders
│   ├── 🔔 sonner.tsx            # Toast notifications
│   ├── 🔀 switch.tsx            # Toggle switches
│   ├── 📊 table.tsx             # Data tables
│   ├── 📑 tabs.tsx              # Tabbed content
│   ├── 📝 textarea.tsx          # Multi-line inputs
│   ├── 🔔 toast.tsx             # Toast notifications
│   ├── 🔔 toaster.tsx           # Toast container
│   ├── 🔘 toggle-group.tsx      # Button groups
│   ├── 🔘 toggle.tsx            # Toggle buttons
│   ├── 💡 tooltip.tsx           # Hover tooltips
│   └── 🔔 use-toast.ts          # Toast hook utilities
```

#### **🌟 Hero & Introduction**
```
components/
├── 🎯 Hero.tsx                  # Main landing section (205 lines)
│   ├── Profile photo display
│   ├── Personal introduction
│   ├── Call-to-action buttons
│   └── Responsive grid layout
```

#### **ℹ️ About Section**
```
components/
├── ℹ️ About.tsx                  # Professional overview (106 lines)
│   ├── Skill highlights (5 key areas)
│   ├── Statistics display
│   ├── Glass card animations
│   └── Responsive grid layout
```

#### **✍️ Writing & Articles**
```
components/
├── ✍️ Writing.tsx                # Article showcase (222 lines)
│   ├── Search functionality
│   ├── View toggle (regular/medium)
│   ├── Article filtering by tags
│   ├── Photo viewer integration
│   └── Supabase API integration
│
├── 📄 Article_medium.tsx         # Compact article view (666 lines)
├── 📄 PublishedArticle.tsx       # Published article display (494 lines)
├── ✏️ ArticleEditor.tsx          # Enhanced rich text editor (716 lines)
│   ├── Advanced Quill integration
│   ├── Media library management
│   ├── Image editing capabilities
│   ├── Auto-save functionality
│   └── Content validation
├── 📋 ArticleList.tsx            # Article listing with filters (488 lines)
├── 📋 ArticleListExample.tsx     # Example article list implementation (384 lines)
├── 📝 ArticleWriterMenu.tsx      # Writing tools menu (276 lines)
├── 📚 BlogModal.tsx              # Blog post modal (482 lines)
├── 🧪 QuillDemo.tsx              # Quill editor demonstration (415 lines)
├── 🔤 TipTapEditor.tsx           # TipTap editor implementation (472 lines)
└── 🔧 GoogleSheetsTest.tsx       # Google Sheets integration test (205 lines)
```

#### **📸 Photo Gallery**
```
components/
├── 📸 Photos.tsx                 # Image showcase (273 lines)
│   ├── Category-based organization
│   ├── Lightbox functionality
│   ├── Navigation controls
│   ├── Responsive grid layout
│   └── Personal milestone photos
│
├── 🖼️ PhotoViewer.tsx            # Enhanced image viewing (109 lines)
└── 📱 InstagramPhotos.tsx        # Social media integration (184 lines)
```

#### **📧 Contact & Communication**
```
components/
├── 📧 Contact.tsx                # Contact form (209 lines)
│   ├── EmailJS integration
│   ├── Google Sheets logging
│   ├── Social media links
│   ├── Form validation
│   └── Toast notifications
```

#### **🎮 Interactive Elements**
```
components/
├── 🐍 SnakeGame.tsx              # Classic snake game (225 lines)
└── 🔐 ProtectedRoute.tsx         # Role-based access control (218 lines)
```

#### **🔐 Authentication**
```
components/
├── 🔐 Login.tsx                  # User authentication component (268 lines)
│   ├── Supabase authentication
│   ├── Form validation
│   ├── Error handling
│   └── Responsive design
```

### **📄 Pages (`src/pages/`)**
```
pages/
├── 🏠 Index.tsx                  # Main portfolio page (8 lines)
├── 🎨 Portfolio.tsx              # Portfolio layout orchestrator (22 lines)
├── ✍️ Writing.tsx                # Writing page (15 lines)
├── 📸 Photos.tsx                 # Photos page (15 lines)
├── 🛠️ ArticleManagement.tsx      # Admin article management (462 lines)
│   ├── CRUD operations
│   ├── Search and filtering
│   ├── Statistics dashboard
│   ├── Role-based access control
│   └── Supabase integration
├── 🔐 LoginPage.tsx              # Authentication page (172 lines)
├── ❌ NotFound.tsx               # 404 error page (56 lines)
├── 🧪 ArticleTest.tsx            # Article testing page (33 lines)
├── 🧪 QuillTest.tsx              # Quill editor testing page (54 lines)
└── 📊 GoogleSheetsTestPage.tsx   # Google Sheets integration test (13 lines)
```

### **🔧 Utilities & Hooks (`src/lib/` & `src/hooks/`)**

#### **📚 Articles API (`src/lib/articles-api.ts`)** (382 lines)
```typescript
// Core API functions with Supabase integration:
export const articlesApi = {
  getAll(): Promise<Article[]>           // Fetch all articles
  getPublished(): Promise<Article[]>     // Fetch published articles
  getById(id: string): Promise<Article> // Fetch single article
  create(data: CreateArticleData): Promise<Article>  // Create article
  update(id: string, data: UpdateArticleData): Promise<Article>  // Update article
  delete(id: string): Promise<boolean>  // Delete article
  search(query: string): Promise<Article[]>  // Search articles
  getByTag(tag: string): Promise<Article[]>  // Get articles by tag
  getStats(): Promise<ArticleStats>      // Get article statistics
  subscribeToChanges(callback): void     // Real-time updates
}

// Enhanced fallback API with localStorage support:
export const articlesApiWithFallback = {
  // All CRUD operations with automatic fallback
  // Graceful degradation when Supabase is unavailable
}

// Data interfaces:
interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  cover_image: string
  cover_image_path?: string  // New field for image paths
  tags: string[]
  status: 'draft' | 'published'
  author: string
  read_time: number
  published_at?: string
  created_at: string
  updated_at: string
}

interface ArticleStats {
  total: number
  published: number
  drafts: number
  totalTags: number
}
```

#### **📊 Articles Hook (`src/hooks/use-articles.ts`)** (326 lines)
```typescript
// Enhanced state management hooks:
export function useArticles() {
  // Returns:
  articles, publishedArticles           // Data arrays
  isLoading, isCreating, isUpdating, isDeleting  // Loading states
  error                                 // Error handling
  createArticle, updateArticle, deleteArticle, refreshArticles  // CRUD operations
  getArticleById, searchArticles, getArticlesByTag  // Utility functions
}

export function useArticle(id: string) {
  // Returns:
  article, isLoading, error, refresh  // Single article management
}

export function useArticleSearch() {
  // Returns:
  searchResults, isSearching, searchError, search, clearSearch  // Search functionality
}
```

#### **📧 Email Configuration (`src/lib/email-config.ts`)** (69 lines)
```typescript
// Email functions:
export async function sendNotificationEmail(formData: ContactFormData)
export async function sendWelcomeEmail(formData: ContactFormData)
```

#### **📊 Google Sheets (`src/lib/sheets.ts`)** (51 lines)
```typescript
// Sheets integration:
export async function logContactToSheet(formData: ContactFormData)
```

#### **🖼️ Image Upload (`src/lib/image-upload.ts`)** (260 lines)
```typescript
// Image handling functions:
export async function uploadImage(file: File): Promise<string>
export async function processImage(imageUrl: string): Promise<string>
export function compressImage(file: File): Promise<File>
```

#### **🛠️ Utilities (`src/lib/utils.ts`)** (62 lines)
```typescript
// Utility functions:
export function cn(...inputs: ClassValue[])  // Class name merging
export function formatDate(date: string): string  // Date formatting
export function generateExcerpt(content: string, maxLength: number): string  // Content excerpt
```

### **🔐 Authentication & Data (`src/data/`)**
```
data/
├── 🔐 auth.ts                    # User authentication logic (280 lines)
├── 📄 articles.ts                # Articles data initialization (456 lines)
└── 📚 blogs.ts                   # Blog data management (447 lines)
```

---

## 🚀 **Key Features & Functions**

### **📱 Responsive Design**
- Mobile-first approach with touch gestures
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

### **🎭 Animations & Interactions**
- Framer Motion for smooth animations
- CSS transitions and hover effects
- Custom animation classes
- Progressive loading animations

### **🔍 Search & Filtering**
- Real-time article search
- Tag-based filtering
- Status-based filtering
- Advanced search algorithms

### **📝 Content Management**
- Full CRUD operations for articles
- Enhanced Quill rich text editing with advanced image features
- TipTap editor as alternative rich text editor
- Media library management
- Image editing capabilities (crop, scale, rotate)
- Publishing workflow
- Supabase backend with automatic fallback

### **🔐 Security & Access Control**
- Role-based permissions
- Protected admin routes
- Supabase authentication
- Secure API endpoints
- Row Level Security (RLS)

### **📧 Communication Integration**
- EmailJS for contact forms
- Google Sheets logging
- Social media integration
- Notification system

### **📊 Analytics & Tracking**
- Reading progress tracking
- User engagement metrics
- Performance monitoring
- SEO optimization

### **🔄 Real-time Updates**
- Supabase real-time subscriptions
- Live article updates
- Instant data synchronization
- Offline support with localStorage fallback

---

## 🛠️ **Tech Stack**

### **Frontend Framework**
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion 12.23.12** - Animation library

### **State Management**
- **React Query (TanStack) 5.83.0** - Server state management
- **Custom Hooks** - Local state management
- **Context API** - Global state sharing

### **Backend & APIs**
- **Supabase 2.56.0** - Backend-as-a-Service (Primary)
- **Google Apps Script** - Legacy API endpoints
- **EmailJS 4.4.1** - Email service integration
- **LocalStorage** - Offline fallback support

### **Rich Text Editing**
- **React Quill 2.0.0** - Enhanced rich text editor
- **TipTap 3.3.0** - Alternative rich text editor
- **Advanced Image Features** - Media library, editing tools
- **Canvas API** - HTML5 Canvas for image manipulation
- **Local Storage** - Persistent media management

### **Development Tools**
- **ESLint 9.32.0** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.21** - CSS compatibility
- **TypeScript ESLint 8.38.0** - TypeScript-specific linting

---

## 📁 **Asset Structure**

### **🖼️ Images (`src/assets/` & `public/`)**
```
assets/
├── 👤 profile-photo.jpg          # Main profile image

public/
├── 🖼️ favicon.ico               # Website icon
├── 📸 Henkle.JPG                # Henkle Hackathon photo
├── 🎓 MBAconvocation.JPG        # MBA graduation photo
├── 🎓 MtechConvocation.JPG      # M.Tech graduation photo
├── 🖼️ placeholder.svg           # Image placeholder
└── 🤖 robots.txt                # Search engine instructions
```

---

## 🔄 **Development Workflow**

### **📦 Package Management**
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### **🌐 Environment Configuration**
```
env.example:
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Example:
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **🔐 Supabase Setup**
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Set up database schema (see `SUPABASE_SETUP.md`)
3. Configure environment variables
4. Enable Row Level Security (RLS)
5. Test CRUD operations

---

## 📊 **Project Statistics**

- **Total Components**: 50+ React components
- **UI Components**: 40+ Shadcn/UI components
- **Custom Hooks**: 3+ specialized hooks
- **API Endpoints**: 15+ backend functions
- **Pages**: 9 main application pages
- **File Types**: TypeScript, CSS, Markdown, JSON, SQL
- **Dependencies**: 70+ npm packages
- **Build Size**: Optimized for production
- **Backend**: Supabase + LocalStorage fallback
- **Editors**: Enhanced Quill + TipTap with advanced image features
- **Total Lines of Code**: 10,000+ lines

---

## 🎯 **Architecture Patterns**

### **Component Organization**
- **Atomic Design** - Components organized by complexity
- **Feature-based** - Related functionality grouped together
- **Reusable UI** - Shared components in ui/ directory

### **State Management**
- **Local State** - useState for component-specific data
- **Custom Hooks** - Encapsulated logic and state
- **Server State** - React Query for API data
- **Global State** - Context API for app-wide data

### **Data Flow**
- **Unidirectional** - Data flows down, events flow up
- **API Integration** - Centralized API service layer with fallback
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - Consistent loading indicators
- **Offline Support** - Automatic fallback to localStorage

### **Backend Architecture**
- **Primary**: Supabase (PostgreSQL + Real-time)
- **Fallback**: LocalStorage for offline support
- **Legacy**: Google Apps Script integration
- **Security**: Row Level Security (RLS) policies

---

## 📚 **Documentation Files**

### **Core Documentation**
- **README.md** - Project overview and quick start
- **SETUP_GUIDE.md** - Development environment setup
- **PROJECT_STRUCTURE.md** - This comprehensive structure guide

### **Backend Documentation**
- **SUPABASE_SETUP.md** - Complete Supabase setup guide
- **ARTICLES_BACKEND_README.md** - Articles system documentation
- **BACKEND_COMPARISON.md** - Backend approach analysis
- **ARTICLE_MANAGEMENT_README.md** - Article management system

### **Feature Documentation**
- **QUILL_ENHANCEMENTS.md** - Enhanced Quill editor features
- **TIPTAP_EDITOR_README.md** - TipTap editor documentation
- **Enhanced Image Editing** - Media library and manipulation tools

---

## 🔄 **Migration & Updates**

### **Recent Major Changes**
1. **Supabase Integration** - Replaced Google Sheets as primary backend
2. **Enhanced API Layer** - Added fallback support and real-time updates
3. **Updated Dependencies** - Latest React, TypeScript, and UI libraries
4. **Improved Error Handling** - Better offline support and user experience
5. **Security Enhancements** - Row Level Security and authentication
6. **Quill Editor Enhancements** - Advanced image editing and media management
7. **TipTap Editor Addition** - Alternative rich text editor option
8. **Performance Optimizations** - Better build tools and development experience

### **Backward Compatibility**
- Google Sheets integration maintained for legacy support
- LocalStorage fallback ensures offline functionality
- Gradual migration path for existing data
- Enhanced Quill editor maintains compatibility with existing content
- TipTap editor provides alternative editing experience

---

## 🆕 **New Features & Enhancements**

### **Enhanced Quill Editor**
- **Media Library**: Browse and manage uploaded images
- **Image Editing**: Professional-grade crop, scale, and rotate tools
- **Auto-save**: Automatic draft saving every 30 seconds
- **Accessibility**: Alt text support and semantic HTML
- **Performance**: Optimized rendering and memory management

### **TipTap Editor**
- **Modern Architecture**: Built on ProseMirror
- **Extensible**: Plugin-based architecture
- **Collaborative**: Real-time collaboration support
- **Customizable**: Highly configurable toolbar and features

### **Updated Dependencies**
- **React 18.3.1**: Latest React features and performance improvements
- **TypeScript 5.8.3**: Enhanced type safety and developer experience
- **Vite 5.4.19**: Faster build times and development server
- **Enhanced UI Components**: Latest Shadcn/UI and Radix UI components

---

*This document serves as the comprehensive reference for the Warm Corporate Canvas project structure, architecture, and implementation details. Last updated to reflect Supabase integration, enhanced Quill editor capabilities, TipTap editor addition, and latest project enhancements.*

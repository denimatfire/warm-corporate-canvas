# 🏗️ Warm Corporate Canvas - Project Structure & Architecture

## 📋 **Project Overview**
A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS, featuring article management, photo galleries, and professional presentation capabilities.

---

## 🗂️ **File Structure**

### **🌳 Root Directory**
```
warm-corporate-canvas/
├── 📄 package.json              # Dependencies & scripts
├── 📄 vite.config.ts            # Vite build configuration
├── 🎨 tailwind.config.ts        # Tailwind CSS + custom gradients
├── 📝 tsconfig.json             # TypeScript configuration
├── 📚 README.md                 # Project documentation
├── 🚀 SETUP_GUIDE.md            # Development setup instructions
├── 🔄 BACKEND_COMPARISON.md     # Backend approach analysis
├── 📊 ARTICLE_MANAGEMENT_README.md  # Article system documentation
├── ⚙️ eslint.config.js          # Code linting rules
├── 🎯 postcss.config.js         # PostCSS configuration
├── 📦 bun.lockb                 # Bun package lock
├── 📦 package-lock.json         # NPM package lock
└── 🗂️ dist/                     # Production build output
```

---

## 📁 **Source Directory (`src/`)**

### **🎯 Entry Points**
```
src/
├── 🚀 main.tsx                  # React app bootstrap
├── 🎭 App.tsx                   # Main routing & app structure
├── 🎨 index.css                 # Global styles
├── 🎨 App.css                   # App-specific styles
└── 📝 vite-env.d.ts             # Vite type definitions
```

### **🧩 Core Components (`src/components/`)**

#### **🔧 Navigation & Layout**
```
components/
├── 🧭 Navigation.tsx            # Main navigation component
│   ├── Mobile menu with animations
│   ├── Time-based greetings
│   ├── Date display
│   ├── Smooth scroll handling
│   └── Touch gesture support
│
├── 🎨 ui/                       # Shadcn/UI component library
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
│   └── 💡 tooltip.tsx           # Hover tooltips
```

#### **🌟 Hero & Introduction**
```
components/
├── 🎯 Hero.tsx                  # Main landing section
│   ├── Profile photo display
│   ├── Personal introduction
│   ├── Call-to-action buttons
│   └── Responsive grid layout
│
└── ⏰ Timeline.tsx               # Career milestones
    ├── Interactive timeline
    ├── Icon-based milestones
    ├── Smooth animations
    └── Professional journey
```

#### **ℹ️ About Section**
```
components/
├── ℹ️ About.tsx                  # Professional overview
│   ├── Skill highlights (5 key areas)
│   ├── Statistics display
│   ├── Glass card animations
│   └── Responsive grid layout
```

#### **✍️ Writing & Articles**
```
components/
├── ✍️ Writing.tsx                # Article showcase
│   ├── Search functionality
│   ├── View toggle (regular/medium)
│   ├── Article filtering by tags
│   ├── Photo viewer integration
│   └── Google Apps Script API
│
├── 📄 Article.tsx                # Full article view
│   ├── Reading progress tracking
│   ├── Text-to-speech functionality
│   ├── Social sharing
│   ├── PDF export
│   ├── Comments system
│   ├── Like functionality
│   └── Mobile-responsive design
│
├── 📄 Article_medium.tsx         # Compact article view
├── ✏️ ArticleEditor.tsx          # Rich text editor
├── 📋 ArticleList.tsx            # Article listing with filters
├── 📝 ArticleWriterMenu.tsx      # Writing tools menu
└── 📚 BlogModal.tsx              # Blog post modal
```

#### **📸 Photo Gallery**
```
components/
├── 📸 Photos.tsx                 # Image showcase
│   ├── Category-based organization
│   ├── Lightbox functionality
│   ├── Navigation controls
│   ├── Responsive grid layout
│   └── Personal milestone photos
│
├── 🖼️ PhotoViewer.tsx            # Enhanced image viewing
└── 📱 InstagramPhotos.tsx        # Social media integration
```

#### **📧 Contact & Communication**
```
components/
├── 📧 Contact.tsx                # Contact form
│   ├── EmailJS integration
│   ├── Google Sheets logging
│   ├── Social media links
│   ├── Form validation
│   └── Toast notifications
```

#### **🎮 Interactive Elements**
```
components/
├── 🐍 SnakeGame.tsx              # Classic snake game
└── 🔐 ProtectedRoute.tsx         # Role-based access control
```

### **📄 Pages (`src/pages/`)**
```
pages/
├── 🏠 Index.tsx                  # Main portfolio page
├── 🎨 Portfolio.tsx              # Portfolio layout orchestrator
├── ✍️ Writing.tsx                # Writing page
├── 📸 Photos.tsx                 # Photos page
├── 🛠️ ArticleManagement.tsx      # Admin article management
│   ├── CRUD operations
│   ├── Search and filtering
│   ├── Statistics dashboard
│   └── Role-based access control
├── 🔐 LoginPage.tsx              # Authentication page
├── ❌ NotFound.tsx               # 404 error page
├── 🧪 ArticleTest.tsx            # Article testing page
└── 📊 GoogleSheetsTestPage.tsx   # Google Sheets integration test
```

### **🔧 Utilities & Hooks (`src/lib/` & `src/hooks/`)**

#### **📚 Articles API (`src/lib/articles-api.ts`)**
```typescript
// Core API functions:
export const articlesApi = {
  getAll(): Promise<Article[]>           // Fetch all articles
  getPublished(): Promise<Article[]>     // Fetch published articles
  getById(id: string): Promise<Article> // Fetch single article
  create(data: CreateArticleData): Promise<Article>  // Create article
  update(id: string, data: UpdateArticleData): Promise<Article>  // Update article
  delete(id: string): Promise<boolean>  // Delete article
  search(query: string): Promise<Article[]>  // Search articles
}

// Data interfaces:
interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  cover_image: string
  tags: string[]
  status: 'draft' | 'published'
  author: string
  read_time: number
  published_at?: string
  created_at: string
  updated_at: string
}
```

#### **📊 Articles Hook (`src/hooks/use-articles.ts`)**
```typescript
// State management hooks:
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

#### **📧 Email Configuration (`src/lib/email-config.ts`)**
```typescript
// Email functions:
export async function sendNotificationEmail(formData: ContactFormData)
export async function sendWelcomeEmail(formData: ContactFormData)
```

#### **📊 Google Sheets (`src/lib/sheets.ts`)**
```typescript
// Sheets integration:
export async function logContactToSheet(formData: ContactFormData)
```

#### **🛠️ Utilities (`src/lib/utils.ts`)**
```typescript
// Utility functions:
export function cn(...inputs: ClassValue[])  // Class name merging
```

### **🔐 Authentication & Data (`src/data/`)**
```
data/
├── 🔐 auth.ts                    # User authentication logic
├── 📄 articles.ts                # Articles data initialization
└── 📚 blogs.ts                   # Blog data management
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
- Rich text editing
- Image management
- Publishing workflow

### **🔐 Security & Access Control**
- Role-based permissions
- Protected admin routes
- User authentication
- Secure API endpoints

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

---

## 🛠️ **Tech Stack**

### **Frontend Framework**
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library

### **State Management**
- **React Query** - Server state management
- **Custom Hooks** - Local state management
- **Context API** - Global state sharing

### **Backend & APIs**
- **Supabase** - Backend-as-a-Service
- **Google Apps Script** - Custom API endpoints
- **EmailJS** - Email service integration

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS compatibility

---

## 📁 **Asset Structure**

### **🖼️ Images (`src/assets/` & `public/`)**
```
assets/
├── 👤 profile-photo.jpg          # Main profile image
└── 📱 profile-photo.jpg          # Profile photo asset

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

# Lint code
npm run lint

# Preview production build
npm run preview
```

### **🌐 Environment Configuration**
```
env.example:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 📊 **Project Statistics**

- **Total Components**: 50+ React components
- **UI Components**: 40+ Shadcn/UI components
- **Custom Hooks**: 5+ specialized hooks
- **API Endpoints**: 10+ backend functions
- **Pages**: 8 main application pages
- **File Types**: TypeScript, CSS, Markdown, JSON
- **Dependencies**: 60+ npm packages
- **Build Size**: Optimized for production

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
- **API Integration** - Centralized API service layer
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - Consistent loading indicators

---

*This document serves as the comprehensive reference for the Warm Corporate Canvas project structure, architecture, and implementation details.*

# Article Management System with Authentication

A comprehensive, secure article management system for your portfolio website, built with React, TypeScript, and Tailwind CSS. Features role-based access control, secure authentication, and beautiful user interfaces.

## 🔐 **Security Features**

### **Authentication System**
- **Secure Login**: Username/password authentication with role-based access
- **User Roles**: Admin, Writer, and Viewer with different permission levels
- **Protected Routes**: Article management only accessible to authenticated users
- **Session Management**: Persistent login sessions with secure logout

### **Permission Levels**
- **Admin**: Full access (create, edit, publish, delete, manage users)
- **Writer**: Create, edit, save drafts, request publishing
- **Viewer**: Read published articles, view blog

## 🎯 **Core Features**

### **Article Editor**
- **Rich Text Editor**: Powered by React Quill with full formatting options
- **Cover Image Upload**: Drag & drop or click to upload cover images
- **Tag Management**: Add, remove, and organize article tags
- **Draft & Publish**: Save articles as drafts or publish them immediately
- **Auto-save**: Automatic draft saving every 30 seconds
- **Validation**: Form validation with helpful error messages
- **Permission Control**: Publishing restricted to admin users

### **Article List (Admin View)**
- **Comprehensive Overview**: View all articles with status indicators
- **Search & Filter**: Search by title, content, or tags
- **Sort Options**: Sort by date, title, or status
- **Quick Actions**: Edit, delete, or view articles with one click
- **Statistics Dashboard**: See total articles, published, drafts, and tagged counts
- **User Context**: Shows current user and permission level

### **Published Article (User View)**
- **Reading Experience**: Clean typography with proper spacing and hierarchy
- **Reading Progress Bar**: Visual indicator of reading progress
- **Share Functionality**: Share on LinkedIn, Twitter, WhatsApp, or copy link
- **Comment System**: Add and view comments (stored locally)
- **Text-to-Speech**: Listen to articles with browser's speech synthesis
- **PDF Download**: Export articles as PDF using jsPDF

### **User Management**
- **Role Assignment**: Assign different roles to users
- **Permission Control**: Fine-grained access control
- **User Profiles**: View user information and role badges
- **Secure Logout**: Proper session termination

## 🎨 **UI/UX Features**

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion animations for better user experience
- **Accessibility**: Proper ARIA labels, alt text, and keyboard navigation
- **Modern Design**: Clean, professional interface matching your portfolio theme
- **Navigation Menu**: Integrated menu with Article Writer option
- **User Feedback**: Toast notifications and loading states

## 📁 **File Structure**

```
src/
├── components/
│   ├── ArticleEditor.tsx          # Rich text editor for creating/editing articles
│   ├── ArticleList.tsx            # Admin view for managing articles
│   ├── PublishedArticle.tsx       # User view for reading articles
│   ├── Login.tsx                  # Login form component
│   ├── ProtectedRoute.tsx         # Route protection wrapper
│   └── ArticleWriterMenu.tsx      # Navigation menu with Article Writer option
├── data/
│   ├── articles.ts                # Data types and storage utilities
│   ├── auth.ts                    # Authentication system and user management
│   └── sample-articles.ts         # Sample articles for testing
├── pages/
│   ├── ArticleManagement.tsx      # Main admin page (protected)
│   ├── Blog.tsx                   # Public blog page
│   ├── LoginPage.tsx              # Standalone login page
│   └── Demo.tsx                   # Demo showcase page
└── index.css                      # Styles including prose and line-clamp utilities
```

## 🚀 **Getting Started**

### **1. Install Dependencies**

The system requires these additional packages:
```bash
npm install react-quill @types/react-quill jspdf framer-motion lucide-react
```

### **2. System Initialization**

The system automatically initializes with:
- Default admin user (username: `admin`, password: `admin123`)
- Sample articles for testing
- User authentication system

### **3. Routes Added**

```typescript
// In your App.tsx
<Route path="/admin/articles" element={<ArticleManagement />} />
<Route path="/blog" element={<Blog />} />
<Route path="/login" element={<LoginPage />} />
<Route path="/demo" element={<Demo />} />
```

## 🔑 **Default Credentials**

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin (full access)

## 📱 **Usage Guide**

### **For Admins (Full Access)**
1. **Navigate to `/admin/articles`** (requires login)
2. **Create New Article**: Click "Create New Article" button
3. **Edit Article**: Use the rich text editor with formatting tools
4. **Add Cover Image**: Upload a cover image (required for published articles)
5. **Add Tags**: Enter tags separated by Enter key
6. **Save or Publish**: Choose to save as draft or publish immediately
7. **Manage Users**: Add, edit, or delete user accounts

### **For Writers (Limited Access)**
1. **Navigate to `/admin/articles`** (requires login)
2. **Create Articles**: Use the rich text editor
3. **Save Drafts**: Articles are automatically saved as drafts
4. **Request Publishing**: Submit articles for admin approval
5. **Edit Content**: Modify existing articles as needed

### **For Users (Public Access)**
1. **Navigate to `/blog`** (no login required)
2. **Browse Articles**: View published articles in a grid layout
3. **Search & Filter**: Use search bar and tag filters
4. **Read Articles**: Click on any article to read
5. **Interact**: Comment, share, listen, or download as PDF

## 🛡️ **Security Features**

### **Authentication**
- Secure login with username/password
- Role-based access control
- Protected routes for sensitive operations
- Secure session management

### **Permission Control**
- **Article Creation**: Admin and Writer roles
- **Article Publishing**: Admin role only
- **Article Deletion**: Admin role only
- **User Management**: Admin role only

### **Data Protection**
- Input validation and sanitization
- XSS protection for HTML content
- Secure file upload restrictions
- Local storage encryption (basic)

## 🔧 **Customization**

### **Adding New Users**
```typescript
import { addUser } from './data/auth';

const newUser = addUser({
  username: 'writer1',
  email: 'writer@example.com',
  role: 'writer',
  isActive: true
}, 'password123');
```

### **Modifying Permissions**
```typescript
// In auth.ts, modify the permission functions
export const canPublishArticles = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin' || user?.role === 'writer'; // Allow writers to publish
};
```

### **Styling**
- Modify `src/index.css` for custom styles
- Update Tailwind classes for different color schemes
- Customize prose styles for article content

## 🌐 **Browser Support**

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Text-to-Speech**: Requires browser support for Speech Synthesis API
- **File Upload**: Requires FileReader API support
- **Local Storage**: Requires localStorage support

## 📊 **Performance Considerations**

- **Image Optimization**: Consider compressing cover images before storage
- **Lazy Loading**: Implement lazy loading for article lists
- **Pagination**: Add pagination for large numbers of articles
- **Caching**: Implement caching strategies for better performance

## 🚨 **Security Notes**

- **Input Validation**: All user inputs are validated
- **XSS Protection**: HTML content is sanitized
- **File Upload**: Only image files are accepted
- **Local Storage**: Data is stored client-side (consider server-side for production)
- **Password Security**: Basic encoding (implement proper hashing for production)

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Login Not Working**
   - Verify username: `admin`, password: `admin123`
   - Check browser console for errors
   - Ensure localStorage is enabled

2. **Rich Text Editor Not Loading**
   - Ensure `react-quill` is installed
   - Check CSS imports are correct

3. **Permission Denied Errors**
   - Verify user role and permissions
   - Check if user is properly authenticated

4. **Articles Not Saving**
   - Check browser console for errors
   - Verify localStorage permissions

### **Debug Mode**

Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug_articles', 'true');
localStorage.setItem('debug_auth', 'true');
```

## 🔄 **Future Enhancements**

- **Server Integration**: Connect to Firebase, Supabase, or custom backend
- **User Registration**: Self-service user registration
- **Article Scheduling**: Publish articles at specific dates/times
- **Advanced Analytics**: Track article performance and user engagement
- **Multi-language Support**: Internationalization for global audiences
- **API Integration**: Connect to external content management systems

## 📝 **API Reference**

### **Authentication Functions**
```typescript
// Login
const result = await login({ username, password });

// Check authentication
const isAuth = isAuthenticated();

// Get current user
const user = getCurrentUser();

// Logout
logout();

// Check permissions
const canPublish = canPublishArticles();
const canDelete = canDeleteArticles();
```

### **Article Functions**
```typescript
// Get all articles
const articles = getArticles();

// Get published articles only
const published = getPublishedArticles();

// Add new article
const newArticle = addArticle(articleData);

// Update article
const updated = updateArticle(id, updates);
```

## 📄 **License**

This system is part of your portfolio project. Feel free to modify and extend as needed.

## 🆘 **Support**

For questions or issues:
1. Check the browser console for error messages
2. Verify all dependencies are installed
3. Check file paths and imports
4. Test with sample data first
5. Review the demo page at `/demo`

---

**Happy Writing! 📝✨**

*Your secure, feature-rich Article Management System is ready to use!*

# ✏️ TipTap Editor - Warm Corporate Canvas

## 🎯 **Overview**

The TipTap Editor is the primary rich text editor for the Warm Corporate Canvas portfolio website. Built on ProseMirror, it provides a modern, extensible editing experience with advanced features like resizable images, tables, and collaborative editing capabilities.

## ✨ **Why TipTap?**

### **Modern Architecture**
- **ProseMirror Foundation**: Built on a robust, battle-tested editing framework
- **Plugin-Based**: Highly extensible with custom extensions
- **TypeScript First**: Full type safety and better developer experience
- **Performance**: Optimized rendering and memory management

### **Advanced Features**
- **Resizable Images**: Interactive image editing with drag handles
- **Table Support**: Full table creation and editing capabilities
- **Collaborative Editing**: Real-time collaboration ready
- **Custom Extensions**: Easy to add new functionality
- **Accessibility**: Screen reader friendly with proper ARIA labels

### **Developer Experience**
- **React Integration**: Seamless React component integration
- **Event Handling**: Comprehensive event system for custom behaviors
- **State Management**: Easy integration with React state
- **Styling**: Flexible CSS customization options

## 🚀 **Getting Started**

### **Basic Usage**

```tsx
import { TipTapEditor } from '@/components/TipTapEditor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <TipTapEditor
      value={content}
      onChange={setContent}
      placeholder="Start writing your article..."
    />
  );
}
```

### **With Image Support**

```tsx
import { TipTapEditor } from '@/components/TipTapEditor';

function ArticleEditor() {
  const [content, setContent] = useState('');

  return (
    <TipTapEditor
      value={content}
      onChange={setContent}
      placeholder="Write your article..."
      enableImages={true}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## 🎨 **Editor Features**

### **Text Formatting**
- **Headers**: H1, H2, H3, H4, H5, H6
- **Text Styles**: Bold, italic, underline, strikethrough
- **Lists**: Bullet lists, numbered lists, task lists
- **Alignment**: Left, center, right, justify
- **Links**: Add, edit, and remove hyperlinks
- **Code**: Inline code and code blocks with syntax highlighting

### **Block Elements**
- **Paragraphs**: Standard text blocks
- **Blockquotes**: Highlight important content
- **Horizontal Rules**: Content separation
- **Tables**: Create and edit data tables
- **Images**: Upload and manage images

### **Advanced Features**
- **Undo/Redo**: Full editing history
- **Keyboard Shortcuts**: Power user efficiency
- **Drag & Drop**: Move content blocks
- **Copy/Paste**: Smart content handling
- **Search & Replace**: Find and modify text

## 🖼️ **Image Management**

### **Upload Process**
1. **Drag & Drop**: Drag images directly into the editor
2. **Toolbar Button**: Click the image button in the toolbar
3. **Paste**: Paste images from clipboard
4. **File Selection**: Browse and select image files

### **Image Features**
- **Resizable**: Interactive resize handles on all sides
- **Aspect Ratio**: Hold Shift to maintain proportions
- **Alignment**: Left, center, right alignment options
- **Caption**: Add descriptive text below images
- **Alt Text**: Accessibility support for screen readers

### **Resizable Image Extension**

The editor includes a custom extension for resizable images:

```tsx
import { ResizableImageExtension } from '@/components/ResizableImageExtension';

// The extension is automatically included in TipTapEditor
// It provides:
// - Resize handles on all sides
// - Aspect ratio preservation
// - Smooth resize animations
// - Touch-friendly mobile support
```

## 🔧 **Configuration Options**

### **Basic Props**

```tsx
interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  enableImages?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}
```

### **Advanced Configuration**

```tsx
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const extensions = [
  StarterKit,
  Image.configure({
    HTMLAttributes: {
      class: 'resizable-image',
    },
  }),
  Link.configure({
    openOnClick: false,
  }),
];

// Custom editor instance
const editor = useEditor({
  extensions,
  content: initialContent,
  onUpdate: ({ editor }) => {
    setContent(editor.getHTML());
  },
});
```

## 🎨 **Styling & Customization**

### **CSS Customization**

```css
/* Custom editor styles */
.ProseMirror {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #374151;
}

/* Image styles */
.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Table styles */
.ProseMirror table {
  border-collapse: collapse;
  margin: 1rem 0;
  width: 100%;
}

.ProseMirror th,
.ProseMirror td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}
```

### **Theme Integration**

The editor automatically integrates with your Tailwind CSS theme:

```tsx
// Editor automatically uses your theme colors
// Customize by overriding CSS variables
:root {
  --editor-bg: theme('colors.gray.50');
  --editor-text: theme('colors.gray.900');
  --editor-border: theme('colors.gray.200');
}
```

## 📱 **Mobile Support**

### **Touch Optimization**
- **Touch-Friendly**: Large touch targets for mobile devices
- **Gesture Support**: Swipe and pinch gestures for images
- **Responsive Toolbar**: Adapts to screen size
- **Virtual Keyboard**: Optimized for mobile input

### **Performance**
- **Lazy Loading**: Images load as needed
- **Memory Management**: Efficient memory usage on mobile
- **Smooth Scrolling**: Optimized for touch devices
- **Battery Optimization**: Minimal battery impact

## 🔐 **Security Features**

### **Content Sanitization**
- **HTML Sanitization**: Prevents XSS attacks
- **Link Validation**: Ensures safe external links
- **Image Validation**: Prevents malicious image uploads
- **Script Blocking**: No JavaScript execution in content

### **Upload Security**
- **File Type Validation**: Only image files allowed
- **Size Limits**: Configurable file size restrictions
- **Virus Scanning**: Integration with security services
- **Access Control**: User-based upload permissions

## 🚀 **Performance Optimization**

### **Rendering Optimization**
- **Virtual Scrolling**: Efficient rendering of long content
- **Lazy Loading**: Images and content load on demand
- **Debounced Updates**: Prevents excessive re-renders
- **Memory Management**: Efficient memory usage

### **Bundle Optimization**
- **Tree Shaking**: Only includes used features
- **Code Splitting**: Lazy loads editor components
- **Compression**: Optimized bundle sizes
- **Caching**: Smart caching strategies

## 🔧 **Integration Examples**

### **With Form Libraries**

```tsx
import { useForm } from 'react-hook-form';
import { TipTapEditor } from '@/components/TipTapEditor';

function ArticleForm() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const content = watch('content');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Article title" />
      
      <TipTapEditor
        value={content}
        onChange={(value) => setValue('content', value)}
        placeholder="Write your article content..."
      />
      
      <button type="submit">Publish Article</button>
    </form>
  );
}
```

### **With State Management**

```tsx
import { useState, useCallback } from 'react';
import { TipTapEditor } from '@/components/TipTapEditor';

function ArticleEditor() {
  const [article, setArticle] = useState({
    title: '',
    content: '',
    excerpt: ''
  });

  const handleContentChange = useCallback((content: string) => {
    setArticle(prev => ({
      ...prev,
      content,
      excerpt: generateExcerpt(content)
    }));
  }, []);

  return (
    <div>
      <input
        value={article.title}
        onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Article title"
      />
      
      <TipTapEditor
        value={article.content}
        onChange={handleContentChange}
        placeholder="Start writing..."
      />
      
      <p>Excerpt: {article.excerpt}</p>
    </div>
  );
}
```

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Editor Not Rendering**
- Check if all dependencies are installed
- Verify React version compatibility
- Check browser console for errors
- Ensure proper CSS imports

#### **Images Not Uploading**
- Verify `onImageUpload` function is provided
- Check file size and type restrictions
- Ensure proper error handling
- Verify upload service configuration

#### **Content Not Saving**
- Check `onChange` callback implementation
- Verify state management setup
- Check for JavaScript errors
- Ensure proper form integration

### **Debug Mode**

Enable debug logging:

```tsx
// Add to your component
const editor = useEditor({
  extensions,
  content,
  onUpdate: ({ editor }) => {
    console.log('Editor content:', editor.getHTML());
    console.log('Editor JSON:', editor.getJSON());
  },
});
```

## 📈 **Future Enhancements**

### **Planned Features**
- **Collaborative Editing**: Real-time multi-user editing
- **Version Control**: Content revision history
- **Advanced Tables**: Complex table operations
- **Math Support**: LaTeX equation rendering
- **Code Highlighting**: Syntax highlighting for code blocks

### **Performance Improvements**
- **WebAssembly**: Faster content processing
- **Service Worker**: Offline editing support
- **Compression**: Better content compression
- **Caching**: Enhanced caching strategies

## 📚 **Additional Resources**

- [TipTap Documentation](https://tiptap.dev/docs)
- [ProseMirror Documentation](https://prosemirror.net/docs)
- [React Integration Guide](https://tiptap.dev/docs/react)
- [Extension Development](https://tiptap.dev/docs/editor/api/extensions)

---

**The TipTap Editor provides a modern, powerful editing experience with advanced features and excellent performance.**
